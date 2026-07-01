import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { 
  Briefcase,
  DollarSign,
  Calendar,
  Target,
  MoreVertical,
  Edit2,
  ArrowLeft,
  MessageSquare,
  FileText,
  Clock,
  Swords,
  Zap,
  Users,
  ChevronRight,
  Building2,
  TrendingUp,
  ShieldCheck,
  Plus,
  CheckCircle2,
  Phone,
  Mail,
  ChevronDown
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import DealForm from '../components/forms/DealForm';

const DEAL_STAGES = ['DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'CONTRACT', 'CLOSED_WON', 'CLOSED_LOST'];

const DealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchDeal = async () => {
    try {
      const res = await api.get(`/deals/${id}`);
      setDeal(res.data);
    } catch (err) {
      console.error('Failed to fetch deal:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateDealStage = async (newStage) => {
    try {
      await api.post(`/deals/${id}/stage`, { stage: newStage }).catch(() => api.put(`/deals/${id}/stage`, { stage: newStage }));
      setDeal(prev => ({ ...prev, stage: newStage }));
    } catch (err) {
      console.error('Failed to update deal stage:', err);
    }
  };

  const handleSecurityReview = async () => {
    try {
      await api.post(`/deals/${id}/activities`, { type: 'NOTE', note: 'Security Review Requested' });
      fetchDeal();
      alert('Security Review requested successfully!');
    } catch (err) {
      console.error(err);
    }
  };


  const handleInitializeTemplates = async () => {
    try {
      await api.post(`/deals/${id}/initialize-templates`);
      fetchDeal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogActivity = async () => {
    const note = window.prompt('Enter activity note (e.g., Had a meeting):');
    if (note) {
      try {
        await api.post(`/deals/${id}/activities`, { type: 'NOTE', note });
        fetchDeal();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const logSpecificActivity = async (type, promptText) => {
    const note = window.prompt(promptText);
    if (note) {
      try {
        await api.post(`/deals/${id}/activities`, { type, note });
        fetchDeal();
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchDeal();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5CF6]"></div>
    </div>
  );

  if (!deal) return (
    <div className="p-12 text-center">
      <h2 className="text-2xl font-bold text-slate-400">Deal not found</h2>
      <button onClick={() => navigate('/pipeline')} className="mt-4 text-[#8B5CF6] font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
        <ArrowLeft size={16} /> Back to Pipeline
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Top Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/pipeline')}
            className="w-12 h-12 border border-[#E5E7EB] rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors bg-white shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">
              <Building2 size={12} className="text-slate-400" />
              <span>{deal.account?.name || deal.accountName || 'NO ACCOUNT'}</span>
              <ChevronRight size={12} className="text-slate-300 mx-1" />
              <span className="text-[#111827]">DEAL ROOM</span>
            </div>
            <h1 className="text-[32px] font-bold text-[#111827] leading-none font-serif tracking-tight">
              {deal.title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">WEIGHTED VALUE</div>
            <div className="text-[24px] font-bold text-[#111827] leading-none font-serif tracking-tight">
              ${deal.value && deal.probability ? ((Number(deal.value) * deal.probability) / 100).toLocaleString(undefined, {minimumFractionDigits: 2}) : '0.00'}
            </div>
          </div>
          <span className="bg-orange-50 text-orange-600 px-5 py-2.5 rounded-lg text-[12px] font-extrabold tracking-widest uppercase border border-orange-100">
            {deal.stage?.replace('_', ' ') || 'DISCOVERY'}
          </span>
          <Button variant="ghost" className="px-2" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="w-5 h-5 text-[#6B7280]" />
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex-1 overflow-auto flex flex-col">
        <Tabs defaultValue="overview" className="w-full flex flex-col flex-1">
          <div className="px-8 border-b border-[#E5E7EB] bg-white pt-2 sticky top-0 z-10">
            <TabsList className="bg-transparent border-0 w-full justify-start h-auto p-0 overflow-x-auto flex-nowrap gap-8">
              <TabsTrigger value="overview" className="border-b-[3px] border-transparent data-[state=active]:border-[#16A34A] data-[state=active]:text-[#111827] text-slate-500 px-0 py-4 font-bold text-[14px] flex items-center gap-2 rounded-none bg-transparent shadow-none">
                <Target size={16} /> Overview
              </TabsTrigger>
              <TabsTrigger value="activities" className="border-b-[3px] border-transparent data-[state=active]:border-[#16A34A] data-[state=active]:text-[#111827] text-slate-500 px-0 py-4 font-bold text-[14px] flex items-center gap-2 rounded-none bg-transparent shadow-none">
                <Clock size={16} /> Activities
              </TabsTrigger>
              <TabsTrigger value="deal_room" className="border-b-[3px] border-transparent data-[state=active]:border-[#16A34A] data-[state=active]:text-[#111827] text-slate-500 px-0 py-4 font-bold text-[14px] flex items-center gap-2 rounded-none bg-transparent shadow-none">
                <FileText size={16} /> Deal Room
              </TabsTrigger>

            </TabsList>
          </div>

          <div className="flex-1 overflow-auto bg-[#F8FAFC] p-8">
            <TabsContent value="overview" className="m-0 flex flex-col lg:flex-row gap-8 max-w-[1200px]">
              {/* Main Content */}
              <div className="flex-1 space-y-6">
                {/* 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                      <DollarSign size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">DEAL VALUE</div>
                      <div className="text-[22px] font-bold text-[#111827] font-serif tracking-tight">${deal.value ? Number(deal.value).toLocaleString() : '0.00'}</div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                      <TrendingUp size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">WIN PROBABILITY</div>
                      <div className="text-[22px] font-bold text-[#111827] font-serif tracking-tight">{deal.probability || 0}%</div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-between h-40">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                      <Calendar size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">EXPECTED CLOSE</div>
                      <div className="text-[22px] font-bold text-[#111827] font-serif tracking-tight">{deal.dueDate ? new Date(deal.dueDate).toLocaleDateString() : '-'}</div>
                    </div>
                  </div>
                </div>

                {/* Opportunity Overview */}
                <div className="bg-white p-8 rounded-[28px] shadow-sm border border-slate-100 min-h-[220px]">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="text-emerald-700" size={24} />
                    <h3 className="text-[20px] font-bold text-[#111827] tracking-tight">Opportunity Overview</h3>
                  </div>
                  <div className="text-[16px] text-slate-500 leading-relaxed">
                    {deal.description ? <div className="whitespace-pre-wrap">{deal.description}</div> : "No detailed description provided for this opportunity."}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-[28px] shadow-sm border border-slate-100">
                  <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-5">QUICK ACTIONS</div>
                  <div className="space-y-4">
                    <Button onClick={() => setIsEditModalOpen(true)} className="w-full bg-[#348A54] hover:bg-[#2A7345] text-white py-6 rounded-2xl shadow-sm text-[15px] font-semibold flex items-center justify-center gap-2">
                      <TrendingUp size={18} /> Update Probability
                    </Button>
                    <Button onClick={handleSecurityReview} variant="outline" className="w-full py-6 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-50 text-[15px] font-semibold flex items-center justify-center gap-2">
                      <ShieldCheck size={18} /> Security Review
                    </Button>
                  </div>
                </div>


              </div>
            </TabsContent>

            <TabsContent value="activities" className="m-0 max-w-[1200px]">
              <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 lg:p-10">
                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center gap-3 border-b border-[#E5E7EB] pb-6 mb-8">
                  <div className="inline-flex rounded-md shadow-sm">
                    <button onClick={() => logSpecificActivity('TASK', 'Enter task details:')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-l-md hover:bg-slate-50">
                      <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white"><CheckCircle2 size={12} /></div>
                      New Task
                    </button>
                    <button className="px-2 py-2 text-slate-500 bg-white border-y border-r border-slate-300 rounded-r-md hover:bg-slate-50">
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  <div className="inline-flex rounded-md shadow-sm">
                    <button onClick={() => logSpecificActivity('CALL', 'Enter call summary:')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-l-md hover:bg-slate-50">
                      <div className="w-5 h-5 bg-teal-500 rounded flex items-center justify-center text-white"><Phone size={12} /></div>
                      Log a Call
                    </button>
                    <button className="px-2 py-2 text-slate-500 bg-white border-y border-r border-slate-300 rounded-r-md hover:bg-slate-50">
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  <div className="inline-flex rounded-md shadow-sm">
                    <button onClick={() => logSpecificActivity('MEETING', 'Enter event details:')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-l-md hover:bg-slate-50">
                      <div className="w-5 h-5 bg-purple-500 rounded flex items-center justify-center text-white"><Calendar size={12} /></div>
                      New Event
                    </button>
                    <button className="px-2 py-2 text-slate-500 bg-white border-y border-r border-slate-300 rounded-r-md hover:bg-slate-50">
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  <div className="inline-flex rounded-md shadow-sm">
                    <button onClick={() => logSpecificActivity('EMAIL', 'Enter email subject/body:')} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-l-md hover:bg-slate-50">
                      <div className="w-5 h-5 bg-slate-400 rounded flex items-center justify-center text-white"><Mail size={12} /></div>
                      Email
                    </button>
                    <button className="px-2 py-2 text-slate-500 bg-white border-y border-r border-slate-300 rounded-r-md hover:bg-slate-50">
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>

                {/* Activity Feed */}
                {deal.activities?.length > 0 ? (
                  <div className="space-y-4">
                    {deal.activities.map((act) => (
                      <div key={act.id} className="flex gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                          {act.type === 'TASK' ? <CheckCircle2 size={16} className="text-green-500" /> :
                           act.type === 'CALL' ? <Phone size={16} className="text-teal-500" /> :
                           act.type === 'MEETING' ? <Calendar size={16} className="text-purple-500" /> :
                           act.type === 'EMAIL' ? <Mail size={16} className="text-slate-400" /> :
                           act.type === 'STAGE_CHANGE' ? <Target size={16} className="text-orange-500" /> :
                           <MessageSquare size={16} className="text-blue-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[14px] text-slate-800">
                              {act.user?.fullName || 'System'}
                            </span>
                            <span className="text-[12px] text-slate-500 font-medium bg-white px-2 py-1 rounded-md border border-slate-200">
                              {new Date(act.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2">{act.type.replace('_', ' ')}</div>
                          <div className="text-[15px] text-slate-700 whitespace-pre-wrap leading-relaxed">{act.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare size={32} className="mx-auto text-[#9CA3AF] mb-4" />
                    <h3 className="text-[16px] font-semibold text-[#111827]">No recent activity</h3>
                    <p className="text-[14px] text-[#6B7280] mt-1">Log a call, email, or meeting to track history.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="deal_room" className="m-0 max-w-[1200px]">
              {deal.documents?.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[16px] font-bold text-[#111827]">Deal Documents</h3>
                    <Button onClick={handleInitializeTemplates} variant="outline" className="text-[13px]">Auto-Fill Templates</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deal.documents.map((doc) => (
                      <div key={doc.id} className="bg-white border border-[#E5E7EB] p-5 rounded-[24px] flex items-start gap-4 hover:border-slate-300 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                          <FileText size={24} />
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold text-[#111827] text-[14px] truncate" title={doc.fileName}>{doc.fileName}</div>
                          <div className="text-[12px] font-medium text-slate-500 mt-1 uppercase tracking-wider">
                            {(doc.fileSize / 1024).toFixed(0)} KB • {doc.mimeType?.split('/')[1] || 'DOC'}
                          </div>
                          <a href={doc.storageUrl} target="_blank" rel="noreferrer" className="text-[12px] text-blue-600 font-bold hover:underline mt-2 inline-block">
                            View Document
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-white border border-[#E5E7EB] rounded-[24px]">
                  <FileText size={32} className="mx-auto text-[#9CA3AF] mb-4" />
                  <h3 className="text-[16px] font-semibold text-[#111827]">Deal Room is Empty</h3>
                  <p className="text-[14px] text-[#6B7280] mt-1">Upload documents related to this deal.</p>
                  <Button onClick={handleInitializeTemplates} variant="secondary" className="mt-6 rounded-full px-6">Auto-Fill Templates</Button>
                </div>
              )}
            </TabsContent>


          </div>
        </Tabs>
      </div>

      {/* Edit Modal (using full screen for massive forms) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <DealForm 
              editDeal={deal}
              onCancel={() => setIsEditModalOpen(false)} 
              onSuccess={() => {
                setIsEditModalOpen(false);
                fetchDeal();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DealDetails;
