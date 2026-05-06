import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { 
  Building, 
  TrendingUp, 
  Calendar, 
  Users, 
  FileText, 
  Shield, 
  Clock, 
  Plus, 
  ChevronRight, 
  ArrowLeft,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  Download,
  Target,
  Zap,
  Swords
} from 'lucide-react';

const DealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDeal();
  }, [id]);

  const fetchDeal = async () => {
    try {
      const res = await api.get(`/deals/${id}`);
      setDeal(res.data);
    } catch (err) {
      console.error('Error fetching deal:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStage = async (newStage) => {
    try {
      await api.post(`/deals/${id}/stage`, { stage: newStage });
      fetchDeal();
    } catch (err) {
      alert('Failed to update stage');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#358b49]"></div>
    </div>
  );

  if (!deal) return (
    <div className="p-12 text-center bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-bold text-slate-400">Deal not found</h2>
      <button onClick={() => navigate('/pipeline')} className="mt-4 text-[#358b49] font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
        <ArrowLeft size={16} /> Back to Pipeline
      </button>
    </div>
  );

  const getStageColor = (stage) => {
    switch(stage) {
      case 'CLOSED_WON': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'CLOSED_LOST': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'NEGOTIATION': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'PROPOSAL': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Target },
    { id: 'activities', label: 'Activities', icon: Clock },
    { id: 'dealroom', label: 'Deal Room', icon: FileText },
    { id: 'stakeholders', label: 'Stakeholders', icon: Users },
    { id: 'competitors', label: 'Competitors', icon: Swords }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/pipeline')}
              className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                <Building size={10} />
                <span>{deal.account?.name || 'Private Client'}</span>
                <ChevronRight size={10} />
                <span className="text-slate-900">DEAL ROOM</span>
              </div>
              <h1 className="text-4xl font-serif text-slate-900 tracking-tight">{deal.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right mr-4 hidden lg:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weighted Value</p>
              <p className="text-2xl font-serif text-slate-900">
                ${(parseFloat(deal.value || 0) * (deal.probability / 100)).toLocaleString()}
              </p>
            </div>
            <select 
              value={deal.stage}
              onChange={(e) => updateStage(e.target.value)}
              className={`px-6 py-3 rounded-xl font-bold text-sm border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#358b49]/20 ${getStageColor(deal.stage)}`}
            >
              {['DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'CONTRACT', 'CLOSED_WON', 'CLOSED_LOST', 'ON_HOLD'].map(s => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-slate-200 px-8">
        <div className="max-w-7xl mx-auto flex gap-10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-5 text-sm font-bold transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'border-[#358b49] text-slate-900' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left / Main Column */}
          <div className="xl:col-span-2 space-y-8">
            
            {activeTab === 'overview' && (
              <>
                {/* Financial Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Deal Value', value: `$${parseFloat(deal.value || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Win Probability', value: `${deal.probability}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Expected Close', value: deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : 'TBD', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                        <stat.icon size={20} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-serif text-slate-900 mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Description Card */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
                   <div className="flex items-center gap-3 mb-6">
                      <FileText size={20} className="text-[#358b49]" />
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">Opportunity Overview</h3>
                   </div>
                   <p className="text-slate-500 font-medium leading-relaxed">
                      {deal.description || 'No detailed description provided for this opportunity.'}
                   </p>
                </div>
              </>
            )}

            {activeTab === 'dealroom' && (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-[#358b49]" />
                    <h3 className="font-bold text-slate-900">Signed Artifacts & Proposals</h3>
                  </div>
                  <button className="text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-100 transition-all">
                    <Plus size={14} /> Upload to Deal Room
                  </button>
                </div>
                <div className="p-8 space-y-4">
                  {deal.documents?.length > 0 ? deal.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors shadow-sm">
                             <FileText size={24} />
                          </div>
                          <div>
                             <p className="font-bold text-slate-900">{doc.fileName}</p>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                {doc.mimeType || 'PDF Document'} · {new Date(doc.createdAt).toLocaleDateString()}
                             </p>
                          </div>
                       </div>
                       <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                          <Download size={18} />
                       </button>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No documents in the Deal Room yet</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'stakeholders' && (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
                 <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                       <Users size={20} className="text-[#358b49]" />
                       <h3 className="text-xl font-bold text-slate-900 tracking-tight">Stakeholder Matrix</h3>
                    </div>
                    <button className="text-xs font-bold text-[#358b49] bg-emerald-50 px-4 py-2 rounded-xl">
                       Map Stakeholder
                    </button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deal.stakeholders?.map((sh) => (
                       <div key={sh.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-900 font-black text-sm shadow-sm">
                             {sh.contact.fullName.charAt(0)}
                          </div>
                          <div className="flex-1">
                             <p className="font-bold text-slate-900">{sh.contact.fullName}</p>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{sh.role || 'Stakeholder'}</p>
                          </div>
                          {sh.role === 'CHAMPION' && <Zap size={14} className="text-amber-500" />}
                       </div>
                    ))}
                    {deal.stakeholders?.length === 0 && (
                       <div className="col-span-full py-20 text-center text-slate-400 uppercase font-black text-[10px] tracking-widest">
                          No stakeholders mapped
                       </div>
                    )}
                 </div>
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
                 <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-8">Deal Timeline</h3>
                 <div className="relative space-y-8">
                    <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
                    {deal.activities?.map((activity) => (
                       <div key={activity.id} className="relative z-10 flex gap-6">
                          <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm text-slate-400">
                             {activity.type === 'STAGE_CHANGE' ? <Zap size={18} /> : <FileText size={18} />}
                          </div>
                          <div>
                             <p className="font-bold text-slate-800">{activity.note}</p>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                {new Date(activity.createdAt).toLocaleString()} · {activity.user?.fullName}
                             </p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
            )}
          </div>

          {/* Right Column / Sidebar */}
          <div className="space-y-8">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h4>
              <button className="w-full py-4 bg-[#358b49] text-white rounded-2xl font-bold text-sm shadow-lg shadow-green-900/10 hover:bg-[#2a7039] transition-all flex items-center justify-center gap-2">
                <TrendingUp size={18} />
                <span>Update Probability</span>
              </button>
              <button className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                <Shield size={18} />
                <span>Security Review</span>
              </button>
            </div>

            {/* Competitor Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Competitors</h4>
                <button className="text-[#358b49] hover:bg-emerald-50 p-1 rounded-lg transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-4">
                {deal.competitors?.map(comp => (
                  <div key={comp.id} className="p-4 bg-rose-50/30 border border-rose-100 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Swords size={14} className="text-rose-500" />
                      <p className="font-bold text-slate-900 text-sm">{comp.name}</p>
                    </div>
                    {comp.strength && (
                      <p className="text-[10px] text-slate-500 leading-tight"><b>S:</b> {comp.strength}</p>
                    )}
                  </div>
                ))}
                {deal.competitors?.length === 0 && (
                  <p className="text-[10px] font-black text-slate-300 uppercase text-center py-4 tracking-widest">No competitors noted</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DealDetails;
