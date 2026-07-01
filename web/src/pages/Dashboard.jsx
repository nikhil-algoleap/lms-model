import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Modal from '../components/ui/Modal';
import LeadForm from '../components/forms/LeadForm';
import {
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Activity,
  Users,
  Target,
  Clock,
  MoreHorizontal
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, leadsRes, activityRes] = await Promise.allSettled([
        api.get('/dashboard/stats'),
        api.get('/leads'),
        api.get('/dashboard/activity')
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
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

  useEffect(() => {
    fetchData();
  }, []);

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return date.toLocaleDateString();
  };

  // Mock data for sparklines & area chart
  const revenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
    { name: 'Jul', value: 7000 }
  ];

  const STATUS_COLORS = {
    'NEW': '#3B82F6',
    'CONTACTED': '#6366F1',
    'WORKING': '#F59E0B',
    'NURTURING': '#8B5CF6',
    'QUALIFIED': '#10B981'
  };

  const pieData = Object.entries(stats.statusCounts || {}).map(([key, value]) => ({
    name: key,
    value: value || 0
  })).filter(d => d.value > 0);

  // If no data, provide a placeholder
  if (pieData.length === 0) {
    pieData.push({ name: 'No Data', value: 1 });
  }

  const kpis = [
    { label: 'Pipeline Value', value: stats.pipelineValue, icon: Target, trend: '+12.5%', isUp: true, sparkData: revenueData.slice(0, 7) },
    { label: 'Active Leads', value: stats.totalLeads, icon: Users, trend: '+5.2%', isUp: true, sparkData: revenueData.slice(2, 9) },
    { label: 'Conversion Rate', value: stats.leadConversionRate, icon: Activity, trend: '-1.4%', isUp: false, sparkData: revenueData.slice(1, 8) },
    { label: 'Avg Time to Convert', value: stats.avgTimeToConvert, icon: Clock, trend: '-2 days', isUp: true, sparkData: revenueData.slice(0, 7).reverse() },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="body-text text-[#6B7280] mt-1">
            Welcome back, {user.fullName?.split(' ')[0] || 'User'}. Here's what's happening today.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <span>New Lead</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={kpi.label}
            className="enterprise-card p-5 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-[#F8FAFC] rounded-[8px] border border-[#E5E7EB]">
                <kpi.icon size={16} className="text-[#6B7280]" />
              </div>
              <div className={`flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-full ${kpi.isUp ? 'text-[#22C55E] bg-[#22C55E]/10' : 'text-[#EF4444] bg-[#EF4444]/10'}`}>
                {kpi.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="caption-text mb-1 uppercase tracking-wider">{kpi.label}</p>
              <h3 className="text-[24px] font-bold text-[#111827] leading-none">
                {loading ? '—' : kpi.value}
              </h3>
            </div>

            {/* Mini Sparkline */}
            <div className="h-10 mt-4 -mx-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpi.sparkData}>
                  <defs>
                    <linearGradient id={`colorSpark${idx}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={kpi.isUp ? '#22C55E' : '#EF4444'} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={kpi.isUp ? '#22C55E' : '#EF4444'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={kpi.isUp ? '#22C55E' : '#EF4444'}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#colorSpark${idx})`}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 enterprise-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="card-title">Revenue Forecast</h3>
            <button className="p-1 text-[#6B7280] hover:bg-[#F8FAFC] rounded-md transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#111827', fontSize: '14px', fontWeight: 600 }}
                  labelStyle={{ color: '#6B7280', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#166534" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Status Donut Chart */}
        <div className="enterprise-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <h3 className="card-title">Leads by Status</h3>
          </div>
          <div className="flex-1 min-h-[280px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#CBD5E1'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '8px 12px' }}
                  itemStyle={{ color: '#111827', fontSize: '14px', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[28px] font-bold text-[#111827] leading-none">{stats.totalLeads}</span>
              <span className="text-[12px] font-medium text-[#6B7280] mt-1">Total</span>
            </div>
          </div>

          {/* Custom Legend */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[entry.name] || '#CBD5E1' }}></div>
                <span className="text-[12px] font-medium text-[#6B7280] truncate">{entry.name}</span>
                <span className="text-[12px] font-bold text-[#111827] ml-auto">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Leads Table */}
        <div className="lg:col-span-2 enterprise-card overflow-hidden">
          <div className="px-6 py-5 border-b border-[#E5E7EB] flex justify-between items-center bg-white">
            <h3 className="card-title">Recent Leads</h3>
            <button onClick={() => navigate('/leads')} className="text-[13px] font-medium text-[#166534] hover:text-[#14532D]">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                  <th className="px-6 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Lead</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {leads.length > 0 ? leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#F8FAFC]/50 transition-colors cursor-pointer group" onClick={() => navigate(`/leads/${lead.id}`)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#F1F5F9] text-[#475569] rounded-full flex items-center justify-center text-[12px] font-semibold border border-[#E2E8F0]">
                          {(lead.company || lead.account?.name || lead.title || 'L').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[14px] font-medium text-[#111827] group-hover:text-[#166534] transition-colors">
                            {`${lead.firstName || ''} ${lead.lastName || ''}`.trim() || lead.title}
                          </p>
                          <p className="text-[12px] text-[#6B7280]">{lead.account?.name || lead.company || 'Unknown Account'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                        {lead.leadStatus || 'NEW'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] font-medium text-[#111827]">{lead.leadScore || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[13px] text-[#6B7280]">{getRelativeTime(lead.createdAt)}</span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-[13px] text-[#6B7280]">No recent leads found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="enterprise-card flex flex-col">
          <div className="px-6 py-5 border-b border-[#E5E7EB] bg-white">
            <h3 className="card-title">Activity</h3>
          </div>
          <div className="flex-1 p-6 overflow-y-auto max-h-[350px]">
            <div className="relative border-l border-[#E5E7EB] ml-3 space-y-6 pb-2">
              {activities.length > 0 ? activities.map((activity, idx) => (
                <div key={activity.id || idx} className="relative pl-6">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#166534] ring-4 ring-white"></div>
                  <div>
                    <p className="text-[13px] text-[#111827]">
                      <span className="font-semibold">{activity.user?.fullName === user.fullName ? 'You' : activity.user?.fullName || 'System'}</span>
                      {activity.type === 'LOGIN' ? ' logged in' : ` ${activity.note || ''}`}
                      {activity.displayTitle && activity.type !== 'LOGIN' && <span className="font-semibold ml-1">{activity.displayTitle}</span>}
                    </p>
                    <p className="text-[11px] text-[#6B7280] mt-1 font-medium">{getRelativeTime(activity.createdAt)}</p>
                  </div>
                </div>
              )) : (
                <div className="text-[13px] text-[#6B7280] pl-4">No recent activity.</div>
              )}
            </div>
          </div>
        </div>

      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} hideHeader={true}>
        <LeadForm onSuccess={() => { setIsModalOpen(false); fetchData(); }} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Dashboard;
