/**
 * Team — Interactive Org Chart
 * Ported from crm-app into main LMS web project.
 * Data source: REST API (/api/contacts?accountId=xxx) instead of Firebase.
 * Features: PrimeReact OrganizationChart, drag-to-pan, zoom, search,
 * right-click context menu, export PNG/PDF.
 */
import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { OrganizationChart } from 'primereact/organizationchart';
import { ContextMenu } from 'primereact/contextmenu';
import { Toast } from 'primereact/toast';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import {
  Search, ZoomIn, ZoomOut, RefreshCcw, Download, FileImage,
  ArrowLeft, Loader2, Users,
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ─── Role design tokens ────────────────────────────────────────────────────────
const ROLE_THEME = {
  Executive: { bg: 'bg-indigo-600',  border: 'border-indigo-400', badge: 'bg-indigo-50 text-indigo-700',  hex: '#4f46e5' },
  'C-Suite':  { bg: 'bg-violet-600', border: 'border-violet-400', badge: 'bg-violet-50 text-violet-700',  hex: '#7c3aed' },
  VP:         { bg: 'bg-blue-500',   border: 'border-blue-400',   badge: 'bg-blue-50 text-blue-700',      hex: '#3b82f6' },
  Lead:       { bg: 'bg-teal-500',   border: 'border-teal-400',   badge: 'bg-teal-50 text-teal-700',      hex: '#0d9488' },
  Manager:    { bg: 'bg-emerald-500',border: 'border-emerald-400',badge: 'bg-emerald-50 text-emerald-700',hex: '#10b981' },
  IC:         { bg: 'bg-slate-500',  border: 'border-slate-300',  badge: 'bg-slate-100 text-slate-600',   hex: '#64748b' },
};
const theme = (role) => ROLE_THEME[role] || ROLE_THEME.IC;
const LEGEND = ['Executive', 'C-Suite', 'VP', 'Lead', 'Manager', 'IC'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildOrgTree(contacts, company) {
  const nodes = {};
  const scopedContacts = company
    ? contacts.filter(c => (c.account?.name || '') === company)
    : contacts;

  scopedContacts.forEach(c => {
    if (!c.role && !c.reportsTo) return;
    const name = c.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim();
    if (!name) return;
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    nodes[name] = {
      key: String(c.id),
      expanded: true,
      data: {
        name,
        title: c.title || c.role || '',
        role: c.role || 'IC',
        department: c.department || '',
        email: c.email,
        phone: c.phone,
        avatar: initials,
        since: c.since || '—',
        company: c.account?.name || company || '',
        city: c.location || '',
      },
      children: [],
    };
  });

  const roots = [];
  scopedContacts.forEach(c => {
    if (!c.role && !c.reportsTo) return;
    const name = c.fullName || `${c.firstName || ''} ${c.lastName || ''}`.trim();
    const node = nodes[name];
    if (!node) return;
    if (!c.reportsTo || !nodes[c.reportsTo]) {
      roots.push(node);
    } else {
      nodes[c.reportsTo].children.push(node);
    }
  });

  if (roots.length === 1) return roots[0];
  if (roots.length > 1) {
    return {
      key: 'org-root',
      expanded: true,
      data: {
        name: company || 'Organization',
        title: 'Org Chart',
        role: 'Executive',
        department: company || '',
        email: '', phone: '', avatar: company ? company[0] : 'O', since: '—',
        company: company || '', city: '',
      },
      children: roots,
    };
  }
  return null;
}

function expandAll(node) {
  if (!node) return node;
  return { ...node, expanded: true, children: (node.children || []).map(expandAll) };
}

function searchKeys(node, q, acc = new Set()) {
  if (!node) return acc;
  if (node.data.name.toLowerCase().includes(q) || node.data.title?.toLowerCase().includes(q)) acc.add(node.key);
  for (const c of node.children || []) searchKeys(c, q, acc);
  return acc;
}

function addChild(node, parentKey, child) {
  if (node.key === parentKey) return { ...node, expanded: true, children: [...(node.children || []), child] };
  return { ...node, children: (node.children || []).map(c => addChild(c, parentKey, child)) };
}

function editNode(node, key, data) {
  if (node.key === key) return { ...node, data: { ...node.data, ...data, avatar: data.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() } };
  return { ...node, children: (node.children || []).map(c => editNode(c, key, data)) };
}

function deleteNode(node, key) {
  if (!node) return node;
  return { ...node, children: (node.children || []).filter(c => c.key !== key).map(c => deleteNode(c, key)) };
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function Tooltip({ data }) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
      <div className="bg-slate-900 text-white text-[10px] font-medium rounded-lg px-2.5 py-1.5 shadow-xl">
        <p className="font-bold">{data.name}</p>
        <p className="text-slate-300">{data.title} · {data.department}</p>
        {data.email && <p className="text-indigo-300 mt-0.5">{data.email}</p>}
      </div>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
    </div>
  );
}

// ─── Node Card ────────────────────────────────────────────────────────────────
const NodeCard = memo(function NodeCard({ node, selectedKey, highlightKeys, onCtxMenu, onSelect }) {
  const d = node.data;
  const t = theme(d.role);
  const isSelected  = selectedKey === node.key;
  const isHighlight = highlightKeys.has(node.key);

  return (
    <div
      onContextMenu={e => onCtxMenu(e, node)}
      onClick={() => onSelect(node)}
      className={[
        'group relative cursor-pointer select-none',
        'bg-white/95 backdrop-blur-sm rounded-xl border-2 px-3 py-2',
        'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg',
        'min-w-[140px] max-w-[165px]',
        t.border,
        isSelected  ? 'ring-2 ring-indigo-400 ring-offset-2 shadow-lg shadow-indigo-100' : '',
        isHighlight ? 'ring-2 ring-amber-400 ring-offset-1 shadow-amber-100' : '',
      ].join(' ')}
    >
      <Tooltip data={d} />
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-[11px] font-bold shadow-sm ${t.bg}`}>
          {d.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800 text-[11px] leading-tight truncate">{d.name}</p>
          <p className="text-slate-500 text-[9.5px] leading-snug truncate">{d.title}</p>
          <span className={`inline-block mt-0.5 text-[8.5px] font-semibold px-1.5 py-px rounded-full ${t.badge}`}>
            {d.role}
          </span>
        </div>
      </div>
      <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${t.bg} opacity-60`} />
    </div>
  );
});

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend() {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {LEGEND.map(r => {
        const t = theme(r);
        return (
          <div key={r} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${t.bg}`} />
            <span className="text-[10px] font-medium text-slate-500">{r}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Add/Edit Modal ────────────────────────────────────────────────────────────
function NodeModal({ mode, initialData, parentName, onSave, onClose }) {
  const [form, setForm] = useState(initialData || { name: '', title: '', role: 'IC', department: '', email: '', phone: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 border border-slate-100" onClick={e => e.stopPropagation()}>
        <h2 className="text-sm font-bold text-slate-800 mb-4">{mode === 'add' ? `Add report under ${parentName}` : 'Edit Node'}</h2>
        {[['name','Name'],['title','Title'],['department','Department'],['email','Email'],['phone','Phone']].map(([k,lbl]) => (
          <div key={k} className="mb-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">{lbl}</label>
            <input value={form[k] || ''} onChange={e => set(k, e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        ))}
        <div className="mb-4">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Role</label>
          <select value={form.role} onChange={e => set('role', e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {LEGEND.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={() => onSave(form)} className="flex-1 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700">Save</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Team() {
  const location = useLocation();
  const navigate = useNavigate();
  const { contactData } = location.state || {};
  const company = contactData?.company || null;

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tree, setTree] = useState(null);
  const [zoom, setZoom] = useState(0.75);
  const [searchQ, setSearchQ] = useState('');
  const [selectedKey, setSelectedKey] = useState(null);
  const [highlightKeys, setHighlightKeys] = useState(new Set());
  const [ctxNode, setCtxNode] = useState(null);
  const [modal, setModal] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const isPanning  = useRef(false);
  const panStart   = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });
  const cmRef      = useRef(null);
  const toastRef   = useRef(null);
  const chartRef   = useRef(null);
  const canvasRef  = useRef(null);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/contacts');
        setContacts(res.data);
      } catch (err) {
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // Build tree
  const baseTree = useMemo(() => buildOrgTree(contacts, company), [contacts, company]);
  useEffect(() => { if (baseTree) setTree(expandAll(baseTree)); }, [baseTree]);

  // Search highlighting
  useEffect(() => {
    if (!tree) return;
    const q = searchQ.trim().toLowerCase();
    setHighlightKeys(q ? searchKeys(tree, q) : new Set());
  }, [searchQ, tree]);

  // Highlight from nav state (contact name highlight)
  useEffect(() => {
    const { contactName } = location.state || {};
    if (!contactName || !tree) return;
    setHighlightKeys(searchKeys(tree, contactName.toLowerCase()));
  }, [location.state, tree]);

  // Context menu items
  const ctxItems = useMemo(() => [
    { label: 'Add Report', icon: 'pi pi-plus', command: () => setModal({ mode: 'add', node: ctxNode }) },
    { label: 'Edit Node',  icon: 'pi pi-pencil', command: () => setModal({ mode: 'edit', node: ctxNode }) },
    { separator: true },
    {
      label: 'Delete Node', icon: 'pi pi-trash', className: 'text-red-500',
      command: () => {
        if (!ctxNode) return;
        setTree(t => deleteNode(t, ctxNode.key));
        toastRef.current?.show({ severity: 'warn', summary: 'Deleted', detail: ctxNode.data.name, life: 2500 });
      },
    },
  ], [ctxNode]);

  // Node template
  const nodeTemplate = useCallback((node) => {
    if (!node?.data) return null;
    return (
      <NodeCard
        node={node}
        selectedKey={selectedKey}
        highlightKeys={highlightKeys}
        onSelect={n => setSelectedKey(k => k === n.key ? null : n.key)}
        onCtxMenu={(e, n) => { e.preventDefault(); setCtxNode(n); cmRef.current?.show(e); }}
      />
    );
  }, [selectedKey, highlightKeys]);

  // CRUD
  const handleSave = (form) => {
    if (!modal) return;
    const { mode, node } = modal;
    const avatar = form.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    if (mode === 'add') {
      const child = { key: `node-${Date.now()}`, expanded: true, data: { ...form, avatar }, children: [] };
      setTree(t => addChild(t, node.key, child));
      toastRef.current?.show({ severity: 'success', summary: 'Added', detail: form.name, life: 2000 });
    } else {
      setTree(t => editNode(t, node.key, form));
      toastRef.current?.show({ severity: 'success', summary: 'Updated', detail: form.name, life: 2000 });
    }
    setModal(null);
  };

  // Export
  const exportPNG = async () => {
    if (!chartRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(chartRef.current, { backgroundColor: '#f8fafc', scale: 2 });
      const a = document.createElement('a');
      a.download = 'org-chart.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch (e) { console.error(e); }
    setExporting(false);
  };

  const exportPDF = async () => {
    if (!chartRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(chartRef.current, { backgroundColor: '#f8fafc', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save('org-chart.pdf');
    } catch (e) { console.error(e); }
    setExporting(false);
  };

  // Pan
  const onPanStart = useCallback(e => {
    if (e.button !== 0) return;
    isPanning.current = true;
    panStart.current = { mx: e.clientX, my: e.clientY, ox: panOffset.x, oy: panOffset.y };
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
  }, [panOffset]);

  const onPanMove = useCallback(e => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.mx;
    const dy = e.clientY - panStart.current.my;
    setPanOffset({ x: panStart.current.ox + dx, y: panStart.current.oy + dy });
  }, []);

  const onPanEnd = useCallback(() => {
    isPanning.current = false;
    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
  }, []);

  const resetView = useCallback(() => { setZoom(0.75); setPanOffset({ x: 0, y: 0 }); }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col gap-2 p-2 overflow-hidden">
      <Toast ref={toastRef} position="bottom-right" />
      <ContextMenu ref={cmRef} model={ctxItems} className="text-xs shadow-xl rounded-xl border border-slate-100" />

      {modal && (
        <NodeModal
          mode={modal.mode}
          initialData={modal.mode === 'edit' ? modal.node.data : undefined}
          parentName={modal.node?.data?.name}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center gap-3 bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white shadow-sm">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:text-indigo-800 pr-3 border-r border-slate-200">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <div className="mr-1">
          <h1 className="text-sm font-bold text-slate-800 leading-tight">Organization Chart</h1>
          {company && <p className="text-[10px] text-slate-400">{company}</p>}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Search name or title…"
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-slate-300"
          />
          {searchQ && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
              {highlightKeys.size} found
            </span>
          )}
        </div>

        <div className="flex-1" />
        <Legend />
        <div className="w-px h-5 bg-slate-200" />

        {/* Zoom */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-100 p-1 shadow-sm">
          <button onClick={() => setZoom(z => Math.max(0.25, +(z - 0.1).toFixed(2)))} className="p-1 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><ZoomOut className="w-3.5 h-3.5" /></button>
          <span className="text-[10px] font-bold text-slate-600 w-8 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(1.5, +(z + 0.1).toFixed(2)))} className="p-1 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><ZoomIn className="w-3.5 h-3.5" /></button>
          <div className="w-px h-3.5 bg-slate-200" />
          <button onClick={resetView} className="p-1 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Reset view"><RefreshCcw className="w-3.5 h-3.5" /></button>
        </div>

        <div className="w-px h-5 bg-slate-200" />

        {/* Export */}
        <div className="flex items-center gap-1">
          <button onClick={exportPNG} disabled={exporting} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors disabled:opacity-50">
            <FileImage className="w-3.5 h-3.5" /> PNG
          </button>
          <button onClick={exportPDF} disabled={exporting} className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50">
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 rounded-2xl border border-white overflow-hidden relative select-none"
        style={{ background: 'rgba(248,250,252,0.85)', backdropFilter: 'blur(12px)', cursor: 'grab' }}
        onMouseDown={onPanStart}
        onMouseMove={onPanMove}
        onMouseUp={onPanEnd}
        onMouseLeave={onPanEnd}
      >
        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '22px 22px', opacity: 0.35 }} />

        <style>{`
          .p-organizationchart .p-organizationchart-node-content { border: none !important; padding: 0 !important; background: transparent !important; cursor: default !important; }
          .p-organizationchart .p-organizationchart-line-down { background: #cbd5e1; height: 14px; }
          .p-organizationchart .p-organizationchart-line-left { border-right: 1.5px solid #cbd5e1; border-top: 1.5px solid #cbd5e1; }
          .p-organizationchart .p-organizationchart-line-right { border-top: 1.5px solid #cbd5e1; }
          .p-organizationchart td.p-organizationchart-node-cell { padding: 0 6px; }
          .p-organizationchart-table > tbody > tr > td { padding: 0; }
          .p-organizationchart .p-node-toggler { width: 16px; height: 16px; border-radius: 50%; background: white; border: 1.5px solid #a5b4fc; color: #6366f1; display: flex; align-items: center; justify-content: center; }
          .p-organizationchart .p-node-toggler:hover { background: #eef2ff; }
          .p-organizationchart .p-node-toggler .p-node-toggler-icon { font-size: 8px; }
        `}</style>

        {tree ? (
          <div className="absolute" style={{ top: 0, left: 0, transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`, transformOrigin: 'top center', padding: '32px 60px', minWidth: '100%' }}>
            <div ref={chartRef}>
              <OrganizationChart value={[tree]} nodeTemplate={nodeTemplate} />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="text-center p-6 bg-white/80 rounded-2xl border border-slate-100 max-w-sm shadow-sm">
              <Users className="w-10 h-10 text-indigo-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800">No Org Chart Data</p>
              <p className="text-xs text-slate-500 mt-1 leading-normal">Add contacts with roles and "Reports To" relationships to build the org chart.</p>
            </div>
          </div>
        )}

        {panOffset.x === 0 && panOffset.y === 0 && tree && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="flex items-center gap-1.5 bg-slate-800/70 backdrop-blur-sm text-white text-[10px] font-medium px-3 py-1.5 rounded-full">
              <span>🖱️</span> Drag to pan · right-click node for options
            </div>
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-1.5 bg-white/60 rounded-xl border border-white text-[10px] text-slate-400">
        <span>Right-click any node → Add / Edit / Delete</span>
        {selectedKey
          ? <span className="text-indigo-500 font-semibold">1 node selected · click again to deselect</span>
          : <span>🖱️ Drag canvas to pan</span>
        }
        <span>Pan: {Math.round(panOffset.x)}, {Math.round(panOffset.y)} · Zoom: {Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
