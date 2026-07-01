import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import {
  Building2,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowLeft,
  MessageSquare,
  FileText,
  Clock,
  Target,
  ChevronRight,
  Star,
  CheckCircle2,
  Plus,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Expand,
  AlignJustify,
  Settings,
  Info
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import Modal from '../components/ui/Modal';
import LeadForm from '../components/forms/LeadForm';
import ConvertLeadModal from '../components/forms/ConvertLeadModal';

const LEAD_STAGES = ['NEW', 'CONTACTED', 'WORKING', 'NURTURING', 'QUALIFIED', 'UNQUALIFIED'];

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);

  const fetchLead = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      setLead(res.data);
    } catch (err) {
      console.error('Error fetching lead details:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (newStatus) => {
    if (lead?.leadStatus === newStatus) return;
    const oldStatus = lead?.leadStatus;
    
    // Optimistic update
    setLead(prev => ({ ...prev, leadStatus: newStatus }));
    
    try {
      await api.put(`/leads/${id}/status`, { leadStatus: newStatus });
    } catch (err) {
      console.error('Failed to update lead status:', err);
      // Revert on failure
      setLead(prev => ({ ...prev, leadStatus: oldStatus }));
    }
  };

  const toggleBant = async (field) => {
    const newValue = !lead[field];
    const oldValue = lead[field];
    
    // Optimistic update
    setLead(prev => ({ ...prev, [field]: newValue }));
    
    try {
      await api.put(`/leads/${id}`, { [field]: newValue });
    } catch (err) {
      console.error(`Failed to update ${field}:`, err);
      // Revert on failure
      setLead(prev => ({ ...prev, [field]: oldValue }));
    }
  };

  const handleMoveStage = () => {
    const currentStatus = lead?.leadStatus?.toUpperCase() || 'NEW';
    const currentIndex = LEAD_STAGES.indexOf(currentStatus);

    // Auto-advance to the next stage if we are not at the end
    if (currentIndex >= 0 && currentIndex < LEAD_STAGES.length - 1) {
      updateLeadStatus(LEAD_STAGES[currentIndex + 1]);
    }
  };

  const logSpecificActivity = async (type, promptText) => {
    const note = window.prompt(promptText);
    if (note) {
      try {
        await api.post(`/leads/${id}/activities`, { type, note });
        fetchLead();
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#166534]"></div>
    </div>
  );

  if (!lead) return (
    <div className="p-12 text-center">
      <h2 className="text-2xl font-bold text-slate-400">Lead not found</h2>
      <button onClick={() => navigate('/leads')} className="mt-4 text-[#166534] font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
        <ArrowLeft size={16} /> Back to Pipeline
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Top Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E5E7EB] px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/leads')}
            className="w-10 h-10 border border-[#E5E7EB] rounded-[8px] flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm">
              <Star size={24} fill="currentColor" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-[#6B7280] mb-0.5">
                Lead
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-[24px] font-bold text-[#111827] leading-none">
                  {lead.firstName} {lead.lastName || lead.title}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="px-2 shadow-sm border-slate-300" onClick={() => setIsEditModalOpen(true)}>
            <Edit2 className="w-4 h-4 text-slate-700" />
          </Button>
          <Button
            variant="secondary"
            className="px-2 shadow-sm border-slate-300"
            onClick={() => {
              if (lead?.leadStatus?.toUpperCase() !== 'QUALIFIED') {
                alert('Only QUALIFIED leads can be converted.');
                return;
              }
              setIsConvertModalOpen(true);
            }}
          >
            Convert
          </Button>
          <Button variant="secondary" className="px-2 shadow-sm border-slate-300">
            <ChevronDown className="w-4 h-4 text-slate-700" />
          </Button>
        </div>
      </div>

      {/* Lead Status Pipeline */}
      <div className="bg-white border-b border-[#E5E7EB] px-8 py-6 shrink-0 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-[#6B7280]" />
            <h3 className="font-bold text-[#111827]">Lead Status Pipeline</h3>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
            Score: {lead.leadScore || 0}
          </div>
        </div>

        <div className="relative flex items-center justify-between w-full max-w-4xl mx-auto px-4 sm:px-8">
          {/* Connecting Line */}
          <div className="absolute top-4 left-8 right-8 h-0.5 bg-[#E5E7EB] -z-0"></div>
          
          {LEAD_STAGES.map((stage, idx) => {
            const currentStageIndex = LEAD_STAGES.indexOf(lead.leadStatus?.toUpperCase() || 'NEW');
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isFuture = idx > currentStageIndex;

            return (
              <div 
                key={stage}
                onClick={() => updateLeadStatus(stage)}
                className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group w-24"
              >
                {/* Circle */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm
                  ${isCompleted ? 'bg-[#22C55E] text-white border-none' : 
                    isCurrent ? 'bg-white border-2 border-[#3B82F6]' : 
                    'bg-white border-2 border-[#E5E7EB] group-hover:border-[#CBD5E1]'}`}
                >
                  {isCompleted && <CheckCircle2 size={16} />}
                  {isCurrent && <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></div>}
                  {isFuture && <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-[#E5E7EB] transition-colors"></div>}
                </div>
                
                {/* Label */}
                <span className={`text-[11px] font-bold tracking-wider uppercase whitespace-nowrap
                  ${isCompleted ? 'text-[#111827]' : 
                    isCurrent ? 'text-[#3B82F6]' : 
                    'text-[#9CA3AF]'}`}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <div className="flex-1 overflow-auto flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 p-8 lg:p-10 space-y-8 max-w-[1000px]">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-[16px]">
                  <User size={18} className="text-[#6B7280]" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[14px]">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Email</div>
                  <div className="col-span-2 text-[#111827] break-words">{lead.email || '-'}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Phone</div>
                  <div className="col-span-2 text-[#111827]">{lead.phone || '-'}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Title</div>
                  <div className="col-span-2 text-[#111827]">{lead.title || '-'}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-[16px]">
                    <Target size={18} className="text-[#6B7280]" />
                    BANT Qualification
                  </div>
                  <div className="text-[12px] font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                    {[lead.hasBudget, lead.hasAuthority, lead.hasNeed, lead.hasTimeline].filter(Boolean).length}/4
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Budget */}
                <div 
                  onClick={() => toggleBant('hasBudget')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors
                  ${lead.hasBudget ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                >
                  <div>
                    <h5 className={`font-semibold text-[14px] ${lead.hasBudget ? 'text-emerald-900' : 'text-[#111827]'}`}>Budget</h5>
                    <p className={`text-[12px] ${lead.hasBudget ? 'text-emerald-600' : 'text-slate-500'}`}>Has approved funding</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border
                    ${lead.hasBudget ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}
                  >
                    {lead.hasBudget && <CheckCircle2 size={12} strokeWidth={3} />}
                  </div>
                </div>

                {/* Authority */}
                <div 
                  onClick={() => toggleBant('hasAuthority')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors
                  ${lead.hasAuthority ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                >
                  <div>
                    <h5 className={`font-semibold text-[14px] ${lead.hasAuthority ? 'text-emerald-900' : 'text-[#111827]'}`}>Authority</h5>
                    <p className={`text-[12px] ${lead.hasAuthority ? 'text-emerald-600' : 'text-slate-500'}`}>Is the decision maker</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border
                    ${lead.hasAuthority ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}
                  >
                    {lead.hasAuthority && <CheckCircle2 size={12} strokeWidth={3} />}
                  </div>
                </div>

                {/* Need */}
                <div 
                  onClick={() => toggleBant('hasNeed')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors
                  ${lead.hasNeed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                >
                  <div>
                    <h5 className={`font-semibold text-[14px] ${lead.hasNeed ? 'text-emerald-900' : 'text-[#111827]'}`}>Need</h5>
                    <p className={`text-[12px] ${lead.hasNeed ? 'text-emerald-600' : 'text-slate-500'}`}>Has defined problem to solve</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border
                    ${lead.hasNeed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}
                  >
                    {lead.hasNeed && <CheckCircle2 size={12} strokeWidth={3} />}
                  </div>
                </div>

                {/* Timeline */}
                <div 
                  onClick={() => toggleBant('hasTimeline')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors
                  ${lead.hasTimeline ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                >
                  <div>
                    <h5 className={`font-semibold text-[14px] ${lead.hasTimeline ? 'text-emerald-900' : 'text-[#111827]'}`}>Timeline</h5>
                    <p className={`text-[12px] ${lead.hasTimeline ? 'text-emerald-600' : 'text-slate-500'}`}>Has a clear timeframe</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border
                    ${lead.hasTimeline ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}
                  >
                    {lead.hasTimeline && <CheckCircle2 size={12} strokeWidth={3} />}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-[16px]">
                  <Building2 size={18} className="text-[#6B7280]" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[14px]">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Company</div>
                  <div className="col-span-2 text-[#111827] font-semibold">{lead.company || lead.accountName || '-'}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Industry</div>
                  <div className="col-span-2 text-[#111827]">{lead.industry || '-'}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Website</div>
                  <div className="col-span-2 text-blue-600 hover:underline cursor-pointer">{lead.website || '-'}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Practice Leader</div>
                  <div className="col-span-2 text-[#111827]">{lead.practiceLeader || '-'}</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-[#6B7280] font-medium">Owner</div>
                  <div className="col-span-2 text-[#111827]">{lead.owner?.fullName || lead.ownerInitials || '-'}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-[16px]">
                <MapPin size={18} className="text-[#6B7280]" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-[14px] text-[#111827]">
              {lead.street ? (
                <>
                  <div>{lead.street}</div>
                  <div>{lead.city}, {lead.state} {lead.postalCode}</div>
                  <div>{lead.country}</div>
                </>
              ) : (
                <div className="text-[#9CA3AF] italic">No address provided</div>
              )}
            </CardContent>
          </Card>

          {/* Related Records Tabs */}
          <div className="mt-8">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="bg-transparent border-b border-[#E5E7EB] w-full justify-start h-auto p-0 rounded-none overflow-x-auto flex-nowrap">
                <TabsTrigger value="activity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#166534] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3">Activity</TabsTrigger>
                <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#166534] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3">Notes</TabsTrigger>
                <TabsTrigger value="emails" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#166534] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3">Emails</TabsTrigger>
                <TabsTrigger value="tasks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#166534] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3">Tasks</TabsTrigger>
                <TabsTrigger value="files" className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#166534] data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-3">Files</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="py-6 space-y-6">

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E7EB] pb-4">
                  <div className="inline-flex rounded-md shadow-sm">
                    <button onClick={() => logSpecificActivity('TASK', 'Enter task details:')} className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-l-md hover:bg-slate-50">
                      <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center text-white"><CheckCircle2 size={12} /></div>
                      New Task
                    </button>
                    <button className="px-2 py-1.5 text-slate-500 bg-white border-y border-r border-slate-300 rounded-r-md hover:bg-slate-50">
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  <div className="inline-flex rounded-md shadow-sm">
                    <button onClick={() => logSpecificActivity('CALL', 'Enter call summary:')} className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-l-md hover:bg-slate-50">
                      <div className="w-5 h-5 bg-teal-500 rounded flex items-center justify-center text-white"><Phone size={12} /></div>
                      Log a Call
                    </button>
                    <button className="px-2 py-1.5 text-slate-500 bg-white border-y border-r border-slate-300 rounded-r-md hover:bg-slate-50">
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  <div className="inline-flex rounded-md shadow-sm">
                    <button onClick={() => logSpecificActivity('MEETING', 'Enter event details:')} className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-l-md hover:bg-slate-50">
                      <div className="w-5 h-5 bg-purple-500 rounded flex items-center justify-center text-white"><Calendar size={12} /></div>
                      New Event
                    </button>
                    <button className="px-2 py-1.5 text-slate-500 bg-white border-y border-r border-slate-300 rounded-r-md hover:bg-slate-50">
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  <div className="inline-flex rounded-md shadow-sm">
                    <button onClick={() => logSpecificActivity('EMAIL', 'Enter email subject/body:')} className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-l-md hover:bg-slate-50">
                      <div className="w-5 h-5 bg-slate-400 rounded flex items-center justify-center text-white"><Mail size={12} /></div>
                      Email
                    </button>
                    <button className="px-2 py-1.5 text-slate-500 bg-white border-y border-r border-slate-300 rounded-r-md hover:bg-slate-50">
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>

                {/* Filters & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[12px]">
                  <div className="flex-1"></div>
                  <div className="flex flex-col items-end gap-2 text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>Filters: All time • All activities • All types</span>
                      <button className="p-1 border border-transparent rounded hover:border-slate-300"><Settings size={14} /></button>
                    </div>
                    <div className="flex items-center gap-3 font-semibold text-blue-600">
                      <button className="flex items-center gap-1 hover:underline"><RefreshCw size={12} /> Refresh</button>
                      <button className="flex items-center gap-1 hover:underline"><Expand size={12} /> Expand All</button>
                      <button className="flex items-center gap-1 hover:underline"><AlignJustify size={12} /> View All</button>
                    </div>
                  </div>
                </div>

                {/* Activity Feed Empty State / Feed */}
                <div className="space-y-4">
                  {/* Upcoming Accordion */}
                  <div className="border border-slate-200 rounded-md bg-[#F8FAFC]">
                    <div className="px-4 py-3 flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                      <ChevronDown size={16} className="text-slate-500" />
                      Activity Timeline
                    </div>
                  </div>

                  {lead.activities?.length > 0 ? (
                    <div className="space-y-4">
                      {lead.activities.map((act) => (
                        <div key={act.id} className="flex gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
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
                    <div className="py-12 bg-white border border-slate-200 border-dashed rounded-md flex flex-col items-center justify-center text-center">
                      <div className="text-[14px] text-slate-500 mb-1">No activities to show.</div>
                      <div className="text-[13px] text-slate-400">Get started by sending an email, scheduling a task, and more.</div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[12px] text-slate-500 bg-slate-50 p-3 rounded-md mt-4 border border-slate-200">
                  <Info size={16} className="text-slate-400 shrink-0" />
                  To change what's shown, try changing your filters.
                </div>
              </TabsContent>
              <TabsContent value="notes" className="py-6">
                <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-[8px] text-[14px] text-[#111827]">
                  {lead.notes || "No notes available for this lead."}
                </div>
              </TabsContent>
              <TabsContent value="emails" className="py-6">
                <div className="text-center py-12 border border-dashed border-[#D1D5DB] rounded-[10px]">
                  <Mail size={32} className="mx-auto text-[#9CA3AF] mb-3" />
                  <h3 className="text-[14px] font-semibold text-[#111827]">No emails logged</h3>
                  <p className="text-[13px] text-[#6B7280]">Connect your inbox to see email history.</p>
                </div>
              </TabsContent>
              <TabsContent value="tasks" className="py-6">
                <div className="text-center py-12 border border-dashed border-[#D1D5DB] rounded-[10px]">
                  <Target size={32} className="mx-auto text-[#9CA3AF] mb-3" />
                  <h3 className="text-[14px] font-semibold text-[#111827]">No tasks found</h3>
                  <p className="text-[13px] text-[#6B7280]">Create a task to follow up.</p>
                </div>
              </TabsContent>
              <TabsContent value="files" className="py-6">
                <div className="text-center py-12 border border-dashed border-[#D1D5DB] rounded-[10px]">
                  <FileText size={32} className="mx-auto text-[#9CA3AF] mb-3" />
                  <h3 className="text-[14px] font-semibold text-[#111827]">No files uploaded</h3>
                  <p className="text-[13px] text-[#6B7280]">Upload documents related to this lead.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[#E5E7EB] bg-[#F8FAFC] flex-shrink-0">
          <Tabs defaultValue="related" className="w-full">
            <TabsList className="bg-white border-b border-[#E5E7EB] w-full justify-start h-auto p-0 rounded-none overflow-x-auto flex-nowrap px-2">
              <TabsTrigger value="related" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 px-4 py-3 font-semibold text-slate-600">Related</TabsTrigger>
              <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-blue-600 px-4 py-3 font-semibold text-slate-600">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="related" className="p-4 space-y-4 m-0">
              <div className="border border-slate-200 rounded-md p-4 flex items-start gap-3 shadow-sm bg-white">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User size={14} />
                </div>
                <div className="text-[13px] text-slate-700 font-medium">We found no potential duplicates of this Lead.</div>
              </div>
              <div className="border border-slate-200 rounded-md p-4 flex items-center justify-between shadow-sm bg-white cursor-pointer hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0">
                    <Target size={14} />
                  </div>
                  <div className="text-[13px] text-slate-700 font-medium">Campaign History (0)</div>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
              </div>
            </TabsContent>

            <TabsContent value="details" className="p-6 space-y-8 m-0 bg-white min-h-[500px]">
              <div>
                <h3 className="text-[13px] font-bold text-[#6B7280] uppercase tracking-wider mb-4">About this Lead</h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0 mt-0.5">
                      {(lead.firstName?.[0] || 'U')}
                    </div>
                    <div>
                      <div className="text-[12px] text-[#6B7280]">Lead Owner</div>
                      <div className="text-[14px] font-semibold text-[#111827]">Unassigned</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F3F4F6]">
                    <div className="text-[12px] text-[#6B7280] mb-1">Lead Source</div>
                    <div className="text-[14px] font-medium text-[#111827] flex items-center gap-2">
                      <Target size={14} className="text-blue-500" />
                      {lead.leadSource || 'Website'}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F3F4F6]">
                    <div className="text-[12px] text-[#6B7280] mb-1">Rating</div>
                    <div className="text-[14px] font-medium text-[#111827]">{lead.leadRating || 'WARM'}</div>
                  </div>

                  <div className="pt-4 border-t border-[#F3F4F6]">
                    <div className="text-[12px] text-[#6B7280] mb-1">Created Date</div>
                    <div className="text-[14px] font-medium text-[#111827] flex items-center gap-2">
                      <Calendar size={14} className="text-[#9CA3AF]" />
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Today'}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#F3F4F6]">
                    <div className="text-[12px] text-[#6B7280] mb-1">Last Modified</div>
                    <div className="text-[14px] font-medium text-[#111827] flex items-center gap-2">
                      <Clock size={14} className="text-[#9CA3AF]" />
                      {lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString() : 'Today'}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Modal (using full screen for massive forms) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <LeadForm
              initialData={lead}
              onCancel={() => setIsEditModalOpen(false)}
              onSuccess={() => {
                setIsEditModalOpen(false);
                fetchLead();
              }}
              prefilledAccountName={lead.company}
            />
          </div>
        </div>
      )}

      {/* Convert Modal */}
      {isConvertModalOpen && (
        <ConvertLeadModal
          lead={lead}
          onClose={() => {
            setIsConvertModalOpen(false);
            navigate('/pipeline');
          }}
        />
      )}
    </div>
  );
};

export default LeadDetails;
