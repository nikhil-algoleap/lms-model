import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  DollarSign, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Download
} from 'lucide-react';

const Pipeline = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const stages = [
    { id: 'NEW', label: 'New Lead', color: 'bg-slate-100 text-slate-600' },
    { id: 'QUALIFIED', label: 'Qualified', color: 'bg-blue-50 text-blue-600' },
    { id: 'DISCOVERY', label: 'Discovery', color: 'bg-purple-50 text-purple-600' },
    { id: 'PROPOSAL', label: 'Proposal', color: 'bg-amber-50 text-amber-600' },
    { id: 'NEGOTIATION', label: 'Negotiation', color: 'bg-orange-50 text-orange-600' },
    { id: 'CONTRACT', label: 'Contract', color: 'bg-indigo-50 text-indigo-600' },
    { id: 'CLOSED', label: 'Closed', color: 'bg-emerald-50 text-emerald-600' }
  ];

  useEffect(() => {
    fetchPipeline();
  }, []);

  const fetchPipeline = async () => {
    try {
      const res = await api.get('/deals/pipeline');
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Type', 'Title', 'Account', 'Stage', 'Value', 'Created At'];
    const csvData = items.map(item => [
      item.type,
      item.title,
      item.accountName || 'N/A',
      item.stage,
      `"${item.value || '0'}"`,
      new Date(item.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pipeline_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilteredItems = (stageId) => {
    return items.filter(item => 
      item.stage === stageId && 
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       item.accountName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const calculateStageTotal = (stageId) => {
    return getFilteredItems(stageId).reduce((sum, item) => {
      const val = parseFloat(item.value?.replace(/[^0-9.]/g, '') || 0);
      return sum + val;
    }, 0);
  };

  const getRelativeTime = (dateString) => {
    const diff = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    return `${diff}d ago`;
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Unified Pipeline</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage leads and deals in one place</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search leads or deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#358b49] w-64 transition-all"
            />
          </div>
          <button 
            onClick={exportToCSV}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Download size={18} />
            <span className="text-xs font-bold">Export</span>
          </button>
          <button className="bg-[#358b49] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#2a7039] transition-all shadow-lg shadow-green-900/10">
            <Plus size={18} />
            <span>New Item</span>
          </button>
        </div>
      </div>

      {/* Board Layout */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
        <div className="flex gap-6 h-full min-w-max">
          {stages.map((stage) => (
            <div key={stage.id} className="w-80 flex flex-col h-full bg-slate-100/50 rounded-3xl border border-slate-200/50">
              {/* Lane Header */}
              <div className="p-5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${stage.color}`}>
                    {stage.label}
                  </span>
                  <span className="text-slate-400 font-bold text-sm">{getFilteredItems(stage.id).length}</span>
                </div>
                <div className="text-[10px] font-black text-slate-500">
                  ${(calculateStageTotal(stage.id) / 1000).toFixed(0)}K
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
                {getFilteredItems(stage.id).map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => navigate(item.type === 'LEAD' ? `/leads/${item.id}` : `/deals/${item.id}`)}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#358b49]/30 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${item.type === 'LEAD' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {item.type}
                      </span>
                      <button className="text-slate-300 group-hover:text-slate-500 transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-tight mb-2 group-hover:text-[#358b49] transition-colors">
                      {item.accountName ? `${item.accountName} · ` : ''}{item.title}
                    </h4>

                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <DollarSign size={12} className="text-slate-400" />
                        <span className="text-xs font-bold">{item.value || '$0'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 ml-auto">
                        <Clock size={12} className="text-slate-400" />
                        <span className="text-[10px] font-bold">{getRelativeTime(item.createdAt)}</span>
                      </div>
                    </div>

                    {/* Stale Warning (Mock logic for now) */}
                    {item.type === 'DEAL' && parseInt(getRelativeTime(item.createdAt)) > 14 && (
                      <div className="mt-3 flex items-center gap-1.5 text-rose-500 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-100">
                        <AlertCircle size={12} />
                        <span className="text-[10px] font-bold">STALE (14d+)</span>
                      </div>
                    )}
                  </div>
                ))}
                
                {getFilteredItems(stage.id).length === 0 && (
                  <div className="h-32 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-300 text-xs font-bold">
                    Empty lane
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
