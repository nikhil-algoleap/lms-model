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
  Filter,
  ExternalLink,
  Calendar,
  LayoutGrid,
  List as ListIcon,
  ChevronDown,
  UploadCloud
} from 'lucide-react';

const STAGES = ['NEW', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'table'
  const [activeFilter, setActiveFilter] = useState('All leads');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads');
      setLeads(res.data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = (lead.title || '').toLowerCase().includes((searchQuery || '').toLowerCase()) || 
                           (lead.account?.name || '').toLowerCase().includes((searchQuery || '').toLowerCase());
      
      const matchesFilter = activeFilter === 'All leads' || 
                           (activeFilter === 'My leads' && lead.ownerId === 'me') || // Mock owner logic
                           lead.serviceLine === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [leads, searchQuery, activeFilter]);

  const leadsByStage = useMemo(() => {
    const grouped = STAGES.reduce((acc, stage) => ({ ...acc, [stage]: [] }), {});
    filteredLeads.forEach(lead => {
      const stage = lead.stage?.toUpperCase() || 'NEW';
      if (grouped[stage]) grouped[stage].push(lead);
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

  const getStageColor = (stage) => {
    switch(stage) {
      case 'NEW': return 'bg-blue-500';
      case 'QUALIFIED': return 'bg-amber-500';
      case 'PROPOSAL': return 'bg-purple-500';
      case 'NEGOTIATION': return 'bg-rose-500';
      case 'WON': return 'bg-emerald-500';
      default: return 'bg-slate-400';
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
           </div>

           <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={14} /> Filter
           </button>

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
                className={`px-5 py-2 rounded-full text-xs font-black transition-all border ${
                  activeFilter === filter 
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
            <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50">
               Sort: Newest <ChevronDown size={14} />
            </div>
         </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'kanban' ? (
        <div className="overflow-x-auto pb-8 -mx-12 px-12">
           <div className="flex gap-6 min-w-max">
              {STAGES.map((stage) => (
                <div key={stage} className="w-[320px] flex flex-col gap-4">
                   <div className="flex items-center justify-between px-2 mb-2">
                      <div className="flex items-center gap-2">
                         <div className={`w-2 h-2 rounded-full ${getStageColor(stage)}`}></div>
                         <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em]">{stage}</h3>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                         {leadsByStage[stage]?.length || 0}
                      </span>
                   </div>
                   
                   <div className="space-y-4 min-h-[500px]">
                      {leadsByStage[stage]?.map((lead) => (
                        <div 
                          key={lead.id}
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group cursor-pointer space-y-4"
                        >
                           <h4 className="font-bold text-slate-900 leading-snug group-hover:text-[#122b1c] transition-colors">
                              {lead.account?.name || '-'} · {lead.title}
                           </h4>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                              {lead.serviceLine} · {lead.deliveryFormat}
                           </p>
                           <div className="flex justify-between items-center pt-2">
                              <span className="font-serif text-lg text-slate-900">{lead.value || '$0'}</span>
                              <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center font-black text-[10px] border border-slate-100 group-hover:bg-[#122b1c] group-hover:text-white transition-all">
                                 {lead.ownerInitials || lead.account?.name?.charAt(0) || '-'}
                              </div>
                           </div>
                        </div>
                      ))}
                      {leadsByStage[stage]?.length === 0 && (
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
                       <th className="px-8 py-5">Opportunity Name & Account</th>
                       <th className="px-8 py-5">Stage</th>
                       <th className="px-8 py-5">Deal Value</th>
                       <th className="px-8 py-5">Due Date</th>
                       <th className="px-8 py-5">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {filteredLeads.map((lead) => (
                       <tr 
                         key={lead.id} 
                         onClick={() => navigate(`/leads/${lead.id}`)}
                         className="group hover:bg-slate-50/80 transition-all cursor-pointer"
                       >
                          <td className="px-8 py-7">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#122b1c] rounded-2xl flex items-center justify-center text-white font-black text-base shadow-lg shadow-emerald-900/10 group-hover:scale-110 transition-transform">
                                   {lead.account?.name?.charAt(0) || '-'}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900 tracking-tight leading-tight mb-1">{lead.title}</h4>
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{lead.account?.name || '-'}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-7">
                             <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                               lead.stage === 'WON' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                               lead.stage === 'NEGOTIATION' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                               lead.stage === 'PROPOSAL' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                               'bg-slate-50 text-slate-500 border-slate-100'
                             }`}>
                                {lead.stage}
                             </span>
                          </td>
                          <td className="px-8 py-7">
                             <div className="flex flex-col">
                                <span className="font-serif text-slate-900 text-xl">{lead.value || '$0'}</span>
                                <div className="flex items-center gap-1.5 mt-1">
                                   <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${lead.probability || 0}%` }}></div>
                                   </div>
                                   <span className="text-[10px] font-black text-slate-400">{lead.probability || 0}%</span>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-7">
                             <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                <Calendar size={14} className="text-slate-300" />
                                {lead.dueDate ? new Date(lead.dueDate).toLocaleDateString() : 'TBD'}
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
                    ))}
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
