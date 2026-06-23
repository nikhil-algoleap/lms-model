import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/ui/Modal';
import LeadForm from '../components/forms/LeadForm';
import ImportModal from '../components/forms/ImportModal';
import {
  Target,
  Search,
  Plus,
  ChevronRight,
  MoreVertical,
  ExternalLink,
  Calendar,
  LayoutGrid,
  List as ListIcon,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  Loader2
} from 'lucide-react';

const LEAD_STATUSES = ['NEW', 'CONTACTED', 'WORKING', 'NURTURING', 'QUALIFIED', 'UNQUALIFIED'];

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [activeFilter, setActiveFilter] = useState('All leads');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'oldest'
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConvertedLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get('/leads/converted');
      setLeads(res.data);
    } catch (err) {
      console.error('Error fetching converted leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'converted') {
      fetchConvertedLeads();
    } else {
      fetchLeads();
    }
  }, [viewMode]);

  const currentUser = JSON.parse(localStorage.getItem('lms_user') || '{}');

  const filteredLeads = useMemo(() => {
    const filtered = leads.filter(lead => {
      const matchesSearch = (lead.title || '').toLowerCase().includes((searchQuery || '').toLowerCase()) ||
        (lead.account?.name || '').toLowerCase().includes((searchQuery || '').toLowerCase());

      const matchesFilter = activeFilter === 'All leads' ||
        (activeFilter === 'My leads' && lead.ownerId === currentUser.id) ||
        lead.serviceLine === activeFilter;

      return matchesSearch && matchesFilter;
    });

    return [...filtered].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [leads, searchQuery, activeFilter, sortBy]);

  const leadsByStage = useMemo(() => {
    const grouped = LEAD_STATUSES.reduce((acc, status) => ({ ...acc, [status]: [] }), {});
    filteredLeads.forEach(lead => {
      const status = lead.leadStatus?.toUpperCase() || 'NEW';
      if (grouped[status]) grouped[status].push(lead);
    });
    return grouped;
  }, [filteredLeads]);

  const totalValue = useMemo(() => {
    const sum = leads.reduce((acc, lead) => {
      const val = parseFloat(lead.value?.replace(/[^0-9.]/g, '') || 0);
      return acc + val;
    }, 0);
    return `$${(sum / 1000).toFixed(1)}M`;
  }, [leads]);

  const getStageColor = (status) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500';
      case 'CONTACTED': return 'bg-indigo-500';
      case 'WORKING': return 'bg-amber-500';
      case 'NURTURING': return 'bg-purple-500';
      case 'QUALIFIED': return 'bg-emerald-500';
      case 'UNQUALIFIED': return 'bg-rose-500';
      default: return 'bg-slate-400';
    }
  };

  const getRatingBadge = (rating) => {
    switch (rating) {
      case 'HOT': return <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[10px] font-bold">🔥 HOT</span>;
      case 'WARM': return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold">☀️ WARM</span>;
      case 'COLD': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">❄️ COLD</span>;
      default: return null;
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-8 max-w-[1800px] mx-auto animate-in fade-in duration-700">

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-5xl font-serif text-slate-900 tracking-tight mb-2">Leads</h1>
          <p className="text-slate-400 font-medium tracking-tight">
            <span className="text-slate-900 font-bold">{leads.length} active leads</span> ·
            <span className="text-slate-900 font-bold ml-1">{totalValue} open pipeline</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* View Switcher */}
          <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center shadow-sm">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${viewMode === 'kanban' ? 'bg-slate-100 text-[#122b1c]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={14} /> Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${viewMode === 'table' ? 'bg-slate-100 text-[#122b1c]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ListIcon size={14} /> Table
            </button>
            <button
              onClick={() => setViewMode('converted')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${viewMode === 'converted' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Target size={14} /> Converted
            </button>
          </div>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <UploadCloud size={14} /> Import
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#122b1c] text-white px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-900/10 hover:shadow-xl transition-all"
          >
            <Plus size={16} />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap items-center gap-3">
          {['All leads', 'My leads', 'Product Engineering', 'AI & Automation', 'Service Mgmt', 'Supply Chain'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs font-black transition-all border ${activeFilter === filter
                ? 'bg-[#122b1c] text-white border-[#122b1c]'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                }`}
            >
              {filter} {filter === 'All leads' ? `(${leads.length})` : ''}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search pipeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none text-xs font-bold w-48 text-slate-700"
            />
          </div>
          <button
            onClick={() => setSortBy(prev => prev === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 hover:text-slate-600 transition-colors outline-none"
          >
            Sort: {sortBy === 'newest' ? 'Newest' : 'Oldest'}
            {sortBy === 'newest' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm gap-3">
          <Loader2 className="animate-spin text-[#122b1c]" size={36} />
          <span className="text-sm font-bold text-[#122b1c] uppercase tracking-widest">Loading leads...</span>
        </div>
      ) : viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-8 -mx-12 px-12">
          <div className="flex gap-6 min-w-max">
            {LEAD_STATUSES.map((status) => (
              <div key={status} className="w-[320px] flex flex-col gap-4">
                <div className="flex items-center justify-between px-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStageColor(status)}`}></div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em]">{status}</h3>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {leadsByStage[status]?.length || 0}
                  </span>
                </div>

                <div className="space-y-4 min-h-[500px]">
                  {leadsByStage[status]?.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group cursor-pointer space-y-4"
                    >
                      <h4 className="font-bold text-slate-900 leading-snug group-hover:text-[#122b1c] transition-colors">
                        {[lead.firstName, lead.lastName].filter(Boolean).join(' ') || lead.title || 'Unknown Lead'} {(lead.company || lead.account?.name) ? `(${lead.company || lead.account?.name})` : ''}
                      </h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        {lead.jobTitle || 'No Title'}
                      </p>
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-2">
                          {getRatingBadge(lead.leadRating)}
                          <span className="text-xs font-bold text-slate-500">Score: {lead.leadScore || 0}</span>
                        </div>
                        <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center font-black text-[10px] border border-slate-100 group-hover:bg-[#122b1c] group-hover:text-white transition-all">
                          {lead.ownerInitials || lead.account?.name?.charAt(0) || '-'}
                        </div>
                      </div>
                    </div>
                  ))}
                  {leadsByStage[status]?.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Leads</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                  <th className="px-8 py-5">Lead Info</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Rating & Score</th>
                  <th className="px-8 py-5">{viewMode === 'converted' ? 'Converted Date' : 'Due Date'}</th>
                  <th className="px-8 py-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-16 text-center text-slate-400 font-medium">
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="group hover:bg-slate-50/80 transition-all cursor-pointer"
                    >
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#122b1c] rounded-2xl flex items-center justify-center text-white font-black text-base shadow-lg shadow-emerald-900/10 group-hover:scale-110 transition-transform">
                            {(lead.firstName?.[0] || lead.company?.[0] || '-').toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 tracking-tight leading-tight mb-1">{[lead.firstName, lead.lastName].filter(Boolean).join(' ') || lead.title || 'Unknown Lead'}</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{lead.company || lead.account?.name || '-'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-7">
                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border ${lead.leadStatus === 'CONVERTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          lead.leadStatus === 'QUALIFIED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            lead.leadStatus === 'WORKING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              'bg-slate-50 text-slate-500 border-slate-100'
                          }`}>
                          {lead.leadStatus}
                        </span>
                      </td>
                      <td className="px-8 py-7">
                        <div className="flex flex-col gap-2">
                          {getRatingBadge(lead.leadRating)}
                          <span className="text-xs font-bold text-slate-600">Score: {lead.leadScore || 0}</span>
                        </div>
                      </td>
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                          <Calendar size={14} className="text-slate-300" />
                          {viewMode === 'converted'
                            ? (lead.convertedDate ? new Date(lead.convertedDate).toLocaleDateString() : '-')
                            : (lead.dueDate ? new Date(lead.dueDate).toLocaleDateString() : 'TBD')}
                        </div>
                      </td>
                      <td className="px-8 py-7">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/leads/${lead.id}`); }}
                            className="p-3 text-slate-300 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
                          >
                            <ExternalLink size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Potential Opportunity"
      >
        <LeadForm onSuccess={() => { setIsModalOpen(false); fetchLeads(); }} />
      </Modal>

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => { setIsImportModalOpen(false); fetchLeads(); }}
      />
    </div>
  );
};

export default Leads;
