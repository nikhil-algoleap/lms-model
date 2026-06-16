import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
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
  Zap
} from 'lucide-react';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchLead();
  }, [id]);

  const handlePromote = async () => {
    if (!window.confirm('Are you sure you want to promote this lead to a deal? This will move it to the Deal Pipeline.')) return;

    try {
      const res = await api.post(`/deals/convert/${id}`);
      navigate(`/deals/${res.data.id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to promote lead');
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

  const getStageColor = (stage) => {
    switch (stage?.toUpperCase()) {
      case 'WON': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'LOST': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'NEGOTIATION': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'PROPOSAL': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
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
          {lead.stage !== 'CONVERTED' && (
            <button
              onClick={handlePromote}
              className="bg-[#358b49] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#2a7039] transition-all text-sm shadow-lg shadow-green-900/10"
            >
              <TrendingUp size={18} />
              <span>Promote to Deal</span>
            </button>
          )}
          <button className="bg-white text-slate-600 px-6 py-3 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all text-sm shadow-sm">
            Move Stage
          </button>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all text-sm shadow-lg shadow-slate-900/10">
            Edit Opportunity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

        {/* Left Column (2/3) */}
        <div className="xl:col-span-2 space-y-8">

          {/* Detailed Fields Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h3 className="font-bold text-slate-900">Entity Details</h3>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStageColor(lead.stage)}`}>
                {lead.stage}
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
                      {activity.type === 'STAGE_CHANGED' ? (
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
  );
};

export default LeadDetails;
