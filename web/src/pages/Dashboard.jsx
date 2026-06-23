import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  Plus,
  ExternalLink,
  ChevronRight,
  Activity,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('lms_user') || '{"fullName": "User", "role": "Team Member"}');
  
  const [stats, setStats] = useState({
    totalLeads: 0,
    pipelineValue: '$0',
    leadConversionRate: '0%',
    avgTimeToConvert: '—',
    unassignedLeads: 0,
    statusCounts: {}
  });

  const [leads, setLeads] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [statsRes, leadsRes, activityRes] = await Promise.allSettled([
          api.get('/dashboard/stats'),
          api.get('/leads'),
          api.get('/dashboard/activity')
        ]);

        if (statsRes.status === 'fulfilled') {
          setStats({
            totalLeads: statsRes.value.data.totalLeads || 0,
            pipelineValue: statsRes.value.data.pipelineValue || '$0',
            leadConversionRate: statsRes.value.data.leadConversionRate || '0%',
            avgTimeToConvert: statsRes.value.data.avgTimeToConvert || '—',
            unassignedLeads: statsRes.value.data.unassignedLeads || 0,
            statusCounts: statsRes.value.data.statusCounts || {}
          });
        }

        if (leadsRes.status === 'fulfilled') {
          setLeads(leadsRes.value.data.slice(0, 5));
        }

        if (activityRes.status === 'fulfilled') {
          setActivities(activityRes.value.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getActivityIcon = (type) => {
    switch(type) {
      case 'WON': return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><polyline points="20 6 9 17 4 12"></polyline></svg>;
      case 'CREATED': return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
      case 'LOGIN': return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>;
      case 'STATUS_CHANGED': return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>;
      default: return <Activity size={16} className="text-slate-400" />;
    }
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const kpis = [
    { label: 'OPEN PIPELINE', value: stats.pipelineValue, trend: `${stats.unassignedLeads} unassigned leads`, color: 'border-emerald-500', isUp: true },
    { label: 'ACTIVE LEADS', value: stats.totalLeads, trend: 'Currently in pipeline', color: 'border-blue-500', isUp: true },
    { label: 'CONVERSION RATE', value: stats.leadConversionRate, trend: 'All-time average', color: 'border-purple-500', isUp: true },
    { label: 'AVG TIME TO CONVERT', value: stats.avgTimeToConvert, trend: 'From creation to conversion', color: 'border-amber-400', isUp: true },
  ];

  // Build chart data from real status counts
  const STATUS_CONFIG = [
    { key: 'NEW', label: 'NEW', color: 'bg-slate-300' },
    { key: 'CONTACTED', label: 'CONTACTED', color: 'bg-blue-400' },
    { key: 'WORKING', label: 'WORKING', color: 'bg-amber-400' },
    { key: 'NURTURING', label: 'NURTURING', color: 'bg-purple-400' },
    { key: 'QUALIFIED', label: 'QUALIFIED', color: 'bg-emerald-500' },
  ];

  const maxCount = Math.max(1, ...STATUS_CONFIG.map(s => stats.statusCounts[s.key] || 0));
  const chartData = STATUS_CONFIG.map(s => ({
    ...s,
    count: stats.statusCounts[s.key] || 0,
    heightPercent: maxCount > 0 ? Math.max(((stats.statusCounts[s.key] || 0) / maxCount) * 100, 4) : 4
  }));

  // Role badge color mapping for dashboard
  const roleBadgeColor = {
    'Administrator': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Practice Leader': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Client Manager': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Team Member': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto">
      
      {/* Header Section */}
      <div className="bg-[#122b1c] text-white p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h1 className="text-5xl font-serif tracking-tight">
              {getGreeting()}, {user.fullName?.split(' ')[0] || 'User'} 👋
            </h1>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${roleBadgeColor[user.role] || 'bg-slate-500/20 text-slate-300 border-slate-500/30'}`}>
              {user.role}
            </span>
          </div>
          <p className="text-emerald-200/60 font-medium">
            Live data from Supabase · {stats.totalLeads} leads in pipeline · {stats.unassignedLeads} unassigned
          </p>
        </div>
        <button 
          onClick={() => navigate('/leads')}
          className="mt-6 md:mt-0 flex items-center gap-2 border border-white/20 px-6 py-3 rounded-xl hover:bg-white/10 transition-all font-bold text-sm tracking-wide"
        >
          <Plus size={18} />
          <span>New Lead</span>
        </button>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`bg-white p-8 rounded-3xl border-t-8 ${kpi.color} shadow-sm border-x border-b border-slate-100 hover:shadow-md transition-all`}>
            <p className="text-[10px] font-black text-slate-400 tracking-[0.15em] mb-4">{kpi.label}</p>
            <h3 className="text-5xl font-serif text-slate-900 mb-4">{loading ? '—' : kpi.value}</h3>
            <div className={`flex items-center gap-1 text-sm font-bold ${kpi.isUp ? 'text-emerald-600' : 'text-rose-500'}`}>
              {kpi.isUp ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Chart Card */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-10">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Leads by Status</h3>
                <p className="text-sm text-slate-400 font-medium mt-1">Current distribution of active leads</p>
              </div>
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Live</span>
            </div>

            <div className="flex items-end justify-between h-64 gap-4 px-4">
               {chartData.map((stage, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-sm font-bold text-slate-700">{stage.count}</span>
                    <div 
                      className={`w-full ${stage.color} rounded-t-lg transition-all duration-700 cursor-pointer group relative`} 
                      style={{ height: `${stage.heightPercent}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {stage.label}: {stage.count}
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 tracking-wider">{stage.label}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex-1">
            <div className="mb-10">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Activity</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Real-time updates from across the platform</p>
            </div>

            <div className="relative pl-6 space-y-10 border-l border-slate-100 ml-4">
              {activities.length > 0 ? activities.map((activity, idx) => (
                <div key={activity.id || idx} className="relative">
                  <div className={`absolute -left-[45px] top-0 w-10 h-10 rounded-full ${activity.type === 'LOGIN' ? 'bg-blue-50' : activity.type === 'STATUS_CHANGED' ? 'bg-amber-50' : 'bg-emerald-50'} flex items-center justify-center border-4 border-white shadow-sm`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <p className="text-slate-800 text-base">
                      <span className="font-bold text-slate-900">{activity.user?.fullName === user.fullName ? 'You' : activity.user?.fullName || 'System'}</span> 
                      {activity.type === 'LOGIN' ? ' logged in' : ` ${activity.note || ''}`}
                      {activity.displayTitle && activity.type !== 'LOGIN' && <span className="font-bold text-slate-900 ml-1">{activity.displayTitle}</span>}
                    </p>
                    <p className="text-sm text-slate-500 mt-1.5 font-medium">{getRelativeTime(activity.createdAt)}</p>
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center text-slate-400 font-medium">
                  No recent activity recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: My Leads */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-10">
             <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Leads</h3>
                <p className="text-sm text-slate-400 font-medium mt-1">Latest leads in the system</p>
             </div>
             <button 
               onClick={() => navigate('/leads')}
               className="text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-200 px-4 py-2 rounded-xl transition-all flex items-center gap-2 group"
             >
                View all <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

          <div className="space-y-4 flex-1">
            {leads.length > 0 ? leads.map((lead) => (
              <div 
                key={lead.id} 
                onClick={() => navigate(`/leads/${lead.id}`)}
                className="p-5 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100 group cursor-pointer space-y-3"
              >
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 leading-snug pr-4">
                        {lead.account?.name || lead.company || 'No Account'} · {lead.title}
                    </h4>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                      lead.leadStatus === 'QUALIFIED' ? 'bg-emerald-50 text-emerald-500' :
                      lead.leadStatus === 'WORKING' ? 'bg-amber-50 text-amber-500' :
                      lead.leadStatus === 'CONTACTED' ? 'bg-blue-50 text-blue-500' :
                      lead.leadStatus === 'NURTURING' ? 'bg-purple-50 text-purple-500' :
                      'bg-violet-50 text-violet-500'
                    }`}>
                        {lead.leadStatus || 'NEW'}
                    </span>
                </div>
                <div className="flex justify-between items-end">
                    <div className="flex gap-2">
                        {lead.leadRating === 'HOT' && <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">🔥 HOT</span>}
                        {lead.leadRating === 'WARM' && <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded">☀️ WARM</span>}
                        {lead.leadRating === 'COLD' && <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">❄️ COLD</span>}
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">Score: {lead.leadScore || 0}</span>
                    </div>
                    <ExternalLink size={14} className="text-slate-200 group-hover:text-slate-400" />
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                 <Activity size={40} className="mb-4 opacity-20" />
                 <p className="font-bold">{loading ? 'Loading...' : 'No leads found'}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
