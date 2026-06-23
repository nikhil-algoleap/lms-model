import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import ConvertLeadModal from '../components/forms/ConvertLeadModal';
import Modal from '../components/ui/Modal';
import {
  Building,
  User,
  Calendar,
  TrendingUp,
  FileText,
  MoreVertical,
  Plus,
  ArrowLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  File,
  Download,
  Shield,
  Zap,
  Mail,
  Phone,
  Target
} from 'lucide-react';

const LEAD_STATUSES = ['NEW', 'CONTACTED', 'WORKING', 'NURTURING', 'QUALIFIED', 'UNQUALIFIED'];

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    value: '',
    probability: '',
    dueDate: '',
    description: '',
    serviceLine: '',
    practiceArea: '',
    deliveryFormat: '',
    leadRating: 'COLD',
  });

  const fetchLead = async () => {
    try {
      const res = await api.get(`/leads/${id}`);
      setLead(res.data);
      setSelectedStatus(res.data.leadStatus);
    } catch (err) {
      console.error('Error fetching lead details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const updateLeadField = async (fieldName, value) => {
    try {
      const res = await api.put(`/leads/${id}`, { [fieldName]: value });
      setLead(res.data);
    } catch (err) {
      console.error(`Error updating lead field ${fieldName}:`, err);
      alert('Failed to update field');
    }
  };

  const handleMoveStage = async () => {
    if (lead.leadStatus === 'CONVERTED' || lead.leadStatus === 'UNQUALIFIED') return;
    const currentIndex = LEAD_STATUSES.indexOf(lead.leadStatus);
    if (currentIndex >= 0 && currentIndex < LEAD_STATUSES.indexOf('QUALIFIED')) {
      const nextStatus = LEAD_STATUSES[currentIndex + 1];
      try {
        const res = await api.put(`/leads/${id}/status`, { leadStatus: nextStatus });
        setLead(res.data);
        setSelectedStatus(res.data.leadStatus);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to update status');
      }
    }
  };

  const handleOpenEditModal = () => {
    setEditForm({
      title: lead.title || '',
      value: lead.value || '',
      probability: lead.probability || '',
      dueDate: lead.dueDate ? lead.dueDate.split('T')[0] : '',
      description: lead.description || '',
      serviceLine: lead.serviceLine || '',
      practiceArea: lead.practiceArea || '',
      deliveryFormat: lead.deliveryFormat || '',
      leadRating: lead.leadRating || 'COLD',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateLeadDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/leads/${id}`, {
        ...editForm,
        probability: editForm.probability ? parseInt(editForm.probability) : 0,
        value: editForm.value ? String(editForm.value) : null,
      });
      setLead(res.data);
      setIsEditModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update lead');
    }
  };


  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#122b1c]"></div>
    </div>
  );

  if (!lead) return (
    <div className="p-12 text-center">
      <h2 className="text-2xl font-bold text-slate-400">Lead not found</h2>
      <button onClick={() => navigate('/leads')} className="mt-4 text-emerald-600 font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
        <ArrowLeft size={16} /> Back to Pipeline
      </button>
    </div>
  );

  const getStageColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'QUALIFIED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'UNQUALIFIED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'WORKING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'CONTACTED': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'NURTURING': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'CONVERTED': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getRatingBadge = (rating) => {
    switch (rating) {
      case 'HOT': return <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">🔥 HOT</span>;
      case 'WARM': return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">☀️ WARM</span>;
      case 'COLD': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">❄️ COLD</span>;
      default: return null;
    }
  };

  return (
    <>
      <div className="p-8 lg:p-12 space-y-10 max-w-[1600px] mx-auto animate-in fade-in duration-700">

      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/leads')}
            className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
              <Building size={10} />
              <span>Strategic Leads</span>
              <ChevronRight size={10} />
              <span className="text-slate-900">{lead.accountName}</span>
            </div>
            <h1 className="text-4xl font-serif text-slate-900 tracking-tight">{lead.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lead.leadStatus !== 'CONVERTED' && (
            <button
              onClick={() => setIsConvertModalOpen(true)}
              className="bg-[#358b49] hover:bg-[#2a7039] text-white shadow-lg shadow-green-900/10 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all text-sm"
            >
              <TrendingUp size={18} />
              <span>Convert Lead</span>
            </button>
          )}
          {lead.leadStatus !== 'CONVERTED' && lead.leadStatus !== 'UNQUALIFIED' && (
            <button
              onClick={handleMoveStage}
              className="bg-white text-slate-600 px-6 py-3 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all text-sm shadow-sm"
            >
              Move Stage
            </button>
          )}
          <button
            onClick={handleOpenEditModal}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all text-sm shadow-lg shadow-slate-900/10"
          >
            Edit Lead
          </button>
        </div>
      </div>

      {isConvertModalOpen && (
        <ConvertLeadModal lead={lead} onClose={() => setIsConvertModalOpen(false)} />
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

        {/* Left Column (2/3) */}
        <div className="xl:col-span-2 space-y-8">

          {/* Status Path Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Target size={20} className="text-slate-400" />
                <h3 className="font-bold text-slate-900">Lead Status Pipeline</h3>
              </div>
              <div className="flex gap-4">
                {getRatingBadge(lead.leadRating)}
                <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                  Score: {lead.leadScore || 0}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between relative px-2">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 rounded-full z-0"></div>
              {LEAD_STATUSES.map((status, index) => {
                const currentIndex = LEAD_STATUSES.indexOf(lead.leadStatus);
                const isCompleted = index < currentIndex || lead.leadStatus === 'CONVERTED';
                const isCurrent = index === currentIndex && lead.leadStatus !== 'CONVERTED';
                const isSelected = status === selectedStatus;

                return (
                  <button
                    key={status}
                    disabled={lead.leadStatus === 'CONVERTED'}
                    onClick={() => setSelectedStatus(status)}
                    className={`relative z-10 flex flex-col items-center gap-2 focus:outline-none transition-all duration-200 ${lead.leadStatus !== 'CONVERTED' ? 'cursor-pointer hover:scale-105' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${isCompleted
                        ? 'bg-[#358b49] border-[#358b49] text-white'
                        : isCurrent
                          ? 'bg-blue-500 border-blue-500 text-white animate-pulse'
                          : isSelected
                            ? 'bg-white border-blue-600 text-blue-600 shadow-md shadow-blue-500/10'
                            : 'bg-white border-slate-200 text-slate-300 hover:border-slate-300'
                      }`}>
                      {isCompleted && <CheckCircle2 size={14} />}
                      {isCurrent && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                      {!isCompleted && !isCurrent && <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-transparent'}`}></div>}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isCurrent
                        ? 'text-blue-600 font-bold'
                        : isSelected
                          ? 'text-blue-600 font-bold underline underline-offset-4'
                          : isCompleted
                            ? 'text-slate-600'
                            : 'text-slate-400'
                      }`}>
                      {status}
                    </span>
                  </button>
                );
              })}
            </div>

            {selectedStatus !== lead.leadStatus && lead.leadStatus !== 'CONVERTED' && (
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end animate-in slide-in-from-top-2 duration-300">
                <button
                  onClick={async () => {
                    try {
                      const res = await api.put(`/leads/${id}/status`, { leadStatus: selectedStatus });
                      setLead(res.data);
                      setSelectedStatus(res.data.leadStatus);
                    } catch (err) {
                      alert(err.response?.data?.message || 'Failed to update status');
                    }
                  }}
                  className="bg-[#358b49] hover:bg-[#2a7039] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-900/10 flex items-center gap-2 transition-all"
                >
                  <CheckCircle2 size={16} />
                  <span>Mark {selectedStatus === 'QUALIFIED' ? 'as Qualified' : `Status as ${selectedStatus}`}</span>
                </button>
              </div>
            )}
          </div>

          {lead.isConverted && (
            <div className="bg-emerald-50 rounded-[2.5rem] border border-emerald-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 size={24} className="text-emerald-500" />
                <h3 className="font-bold text-emerald-900 text-xl">Converted Lead</h3>
              </div>
              <p className="text-emerald-700 mb-6">This lead was successfully converted. Associated records:</p>
              <div className="flex gap-4">
                {lead.convertedAccountId && (
                  <button onClick={() => navigate(`/accounts/${lead.convertedAccountId}`)} className="bg-white px-4 py-2 rounded-lg text-sm font-bold text-emerald-800 shadow-sm border border-emerald-100 flex items-center gap-2 hover:bg-emerald-50 transition-all">
                    <Building size={16} /> View Account
                  </button>
                )}
                {lead.convertedContactId && (
                  <button onClick={() => navigate(`/contacts/${lead.convertedContactId}`)} className="bg-white px-4 py-2 rounded-lg text-sm font-bold text-emerald-800 shadow-sm border border-emerald-100 flex items-center gap-2 hover:bg-emerald-50 transition-all">
                    <User size={16} /> View Contact
                  </button>
                )}
                {lead.convertedDealId && (
                  <button onClick={() => navigate(`/deals/${lead.convertedDealId}`)} className="bg-white px-4 py-2 rounded-lg text-sm font-bold text-emerald-800 shadow-sm border border-emerald-100 flex items-center gap-2 hover:bg-emerald-50 transition-all">
                    <TrendingUp size={16} /> View Deal
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Person Info Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                <h3 className="font-bold text-slate-900">Lead Contact Info</h3>
              </div>
              <div className="p-6 grid grid-cols-1 gap-6">
                <div className="flex items-center gap-4">
                  <User size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</p>
                    <p className="text-sm font-bold text-slate-700">{[lead.firstName, lead.lastName].filter(Boolean).join(' ') || lead.title || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Building size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company & Title</p>
                    <p className="text-sm font-bold text-slate-700">{lead.jobTitle || 'No Title'} at {lead.company || lead.accountName || 'Unknown Company'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-bold text-slate-700">{lead.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone size={18} className="text-slate-400" />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                    <p className="text-sm font-bold text-slate-700">{lead.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BANT Qualification Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">BANT Qualification</h3>
                <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                  {[lead.hasBudget, lead.hasAuthority, lead.hasNeed, lead.hasTimeline].filter(Boolean).length}/4
                </span>
              </div>
              <div className="p-6 grid grid-cols-1 gap-4">
                {[
                  { key: 'hasBudget', label: 'Budget', desc: 'Has approved funding' },
                  { key: 'hasAuthority', label: 'Authority', desc: 'Is the decision maker' },
                  { key: 'hasNeed', label: 'Need', desc: 'Has defined problem to solve' },
                  { key: 'hasTimeline', label: 'Timeline', desc: 'Clear timeframe for project' }
                ].map(bant => (
                  <div
                    key={bant.key}
                    onClick={() => lead.leadStatus !== 'CONVERTED' && updateLeadField(bant.key, !lead[bant.key])}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${lead.leadStatus !== 'CONVERTED'
                        ? 'cursor-pointer hover:border-emerald-500/30 hover:bg-emerald-50/10'
                        : ''
                      } ${lead[bant.key] ? 'bg-emerald-50/50 border-emerald-100 shadow-sm' : 'bg-slate-50 border-slate-100'}`}
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-700">{bant.label}</p>
                      <p className="text-xs text-slate-500">{bant.desc}</p>
                    </div>
                    {lead[bant.key] ? (
                      <CheckCircle2 size={20} className="text-[#358b49]" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Fields Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-bold text-slate-900">Opportunity Details</h3>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStageColor(lead.leadStatus)}`}>
                {lead.leadStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {[
                { label: 'Account', value: lead.accountName, icon: Building },
                { label: 'Service Line', value: lead.serviceLine, icon: Zap },
                { label: 'Practice Area', value: lead.practiceArea || 'N/A', icon: Shield },
                { label: 'Delivery Format', value: lead.deliveryFormat, icon: FileText },
                { label: 'Est. Revenue', value: lead.value || '$0', icon: TrendingUp, bold: true },
                { label: 'Start Date', value: lead.dueDate ? new Date(lead.dueDate).toLocaleDateString() : 'TBD', icon: Calendar },
                { label: 'Probability', value: `${lead.probability || 0}%`, icon: Clock },
                { label: 'Source', value: lead.source || 'Existing Client', icon: User }
              ].map((field, i) => (
                <div key={field.label} className={`p-6 flex items-start gap-4 border-slate-50 ${i % 2 === 0 ? 'md:border-r' : ''} ${i < 6 ? 'border-b' : ''}`}>
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                    <field.icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{field.label}</p>
                    <p className={`text-sm mt-1 ${field.bold ? 'font-serif text-xl text-slate-900' : 'font-bold text-slate-700'}`}>{field.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-6">
            <div className="flex items-center gap-3 mb-2 text-slate-900">
              <FileText size={20} />
              <h3 className="text-xl font-bold tracking-tight">Executive Summary & Notes</h3>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">
              {lead.description || 'No detailed description provided for this opportunity.'}
            </p>
          </div>

          {/* Attachments Section */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <File size={20} className="text-slate-400" />
                <h3 className="font-bold text-slate-900">Signed Artifacts & Attachments</h3>
              </div>
              <button className="text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-100 transition-all">
                <Plus size={14} /> Upload Artifact
              </button>
            </div>

            <div className="p-8 space-y-4">
              {lead.attachments?.length > 0 ? lead.attachments.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors shadow-sm">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{file.fileName}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        {Math.round(file.fileSize / 1024)} KB · {file.mimeType}
                      </p>
                    </div>
                  </div>
                  <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                    <Download size={18} />
                  </button>
                </div>
              )) : (
                <div className="text-center py-10 text-slate-300">
                  <p className="text-sm font-bold uppercase tracking-widest">No attachments available</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-8">

          {/* Team Members Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-8">
            <h3 className="font-bold text-slate-900 border-b border-slate-50 pb-6 mb-2">Stakeholder Matrix</h3>

            <div className="space-y-6">
              {[
                { name: lead.ownerInitials || 'N/A', role: 'Account Manager', color: 'bg-slate-900', label: 'Owner' },
                { name: lead.practiceLeader || 'P', role: 'Practice Leader', color: 'bg-emerald-600', label: 'Sign-off' },
                { name: lead.clientManager || 'G', role: 'Client Executive', color: 'bg-blue-600', label: 'Watcher' }
              ].map((member, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${member.color} rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg`}>
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 leading-none">{member.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{member.role}</p>
                  </div>
                  <span className="bg-slate-50 text-slate-400 px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter border border-slate-100">{member.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-8">
            <h3 className="font-bold text-slate-900 border-b border-slate-50 pb-6 mb-2">Activity Stream</h3>

            <div className="relative space-y-8">
              {/* Timeline Line */}
              <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-slate-50"></div>

              {lead.activities?.length > 0 ? lead.activities.map((activity, i) => (
                <div key={activity.id} className="relative z-10 flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${activity.type === 'STAGE_CHANGED' ? 'bg-blue-50 text-blue-600' :
                    activity.type === 'CREATED' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-slate-50 text-slate-400'
                    }`}>
                    {activity.type === 'STAGE_CHANGED' ? <Zap size={18} /> :
                      activity.type === 'CREATED' ? <Plus size={18} /> :
                        <Clock size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-tight">
                      {activity.type === 'STATUS_CHANGED' ? (
                        <span>Moved <b>{activity.fromValue}</b> → <b>{activity.toValue}</b></span>
                      ) : activity.note}
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      {new Date(activity.createdAt).toLocaleDateString()} · {activity.user?.fullName || 'System'}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-slate-300">
                  <p className="text-xs font-bold uppercase tracking-widest">No activity recorded</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>

      {/* Edit Lead Modal */ }
  <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Lead Details">
    <form onSubmit={handleUpdateLeadDetails} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">Lead Title</label>
          <input
            required
            type="text"
            value={editForm.title}
            onChange={e => setEditForm({ ...editForm, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#358b49] transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Revenue ($)</label>
          <input
            type="number"
            value={editForm.value}
            onChange={e => setEditForm({ ...editForm, value: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#358b49] transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Win Probability (%)</label>
          <input
            type="number"
            value={editForm.probability}
            onChange={e => setEditForm({ ...editForm, probability: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#358b49] transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Start Date / Due Date</label>
          <input
            type="date"
            value={editForm.dueDate}
            onChange={e => setEditForm({ ...editForm, dueDate: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#358b49] transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
          <select
            value={editForm.leadRating}
            onChange={e => setEditForm({ ...editForm, leadRating: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#358b49] transition-all bg-white"
          >
            <option value="HOT">🔥 HOT</option>
            <option value="WARM">☀️ WARM</option>
            <option value="COLD">❄️ COLD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Service Line</label>
          <input
            type="text"
            value={editForm.serviceLine}
            onChange={e => setEditForm({ ...editForm, serviceLine: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#358b49] transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Practice Area</label>
          <input
            type="text"
            value={editForm.practiceArea}
            onChange={e => setEditForm({ ...editForm, practiceArea: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#358b49] transition-all"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">Delivery Format</label>
          <input
            type="text"
            value={editForm.deliveryFormat}
            onChange={e => setEditForm({ ...editForm, deliveryFormat: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#358b49] transition-all"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">Executive Summary / Description</label>
          <textarea
            value={editForm.description}
            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#358b49] transition-all"
            rows={4}
          />
        </div>
      </div>
      <button type="submit" className="w-full py-4 bg-[#358b49] hover:bg-[#2a7039] text-white rounded-xl font-bold transition-colors">Save Lead Details</button>
    </form>
  </Modal>
    </>
  );
};

export default LeadDetails;
