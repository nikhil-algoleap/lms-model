import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  PieChart as PieChartIcon, 
  ArrowUpRight,
  BarChart3,
  Calendar,
  Download,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  CartesianGrid,
  Cell
} from 'recharts';

const Forecast = () => {
  const [metrics, setMetrics] = useState({ totalValue: 0, weightedValue: 0 });
  const [pipeline, setPipeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [forecastRes, pipelineRes] = await Promise.all([
        api.get('/deals/forecast'),
        api.get('/deals/pipeline')
      ]);
      setMetrics(forecastRes.data);
      setPipeline(pipelineRes.data);
    } catch (err) {
      console.error('Error fetching forecast data:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeDeals = pipeline.filter(item => item.type === 'DEAL' && item.stage !== 'CLOSED_WON' && item.stage !== 'CLOSED_LOST');
  
  const stageStats = ['QUALIFIED', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'CONTRACT'].map(stage => {
    const dealsInStage = activeDeals.filter(d => d.stage === stage);
    const value = dealsInStage.reduce((acc, d) => acc + parseFloat(d.value?.replace(/[^0-9.]/g, '') || 0), 0);
    const count = dealsInStage.length;
    return { name: stage, value, count };
  });

  const COLORS = ['#94A3B8', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981'];

  // Mock historical data for area chart
  const historicalData = [
    { month: 'Jan', actual: 45000, target: 50000 },
    { month: 'Feb', actual: 52000, target: 50000 },
    { month: 'Mar', actual: 48000, target: 50000 },
    { month: 'Apr', actual: 61000, target: 60000 },
    { month: 'May', actual: 59000, target: 60000 },
    { month: 'Jun', actual: 75000, target: 60000 },
    { month: 'Jul', actual: 82000, target: 80000 },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="page-title">Forecast</h1>
          <p className="body-text text-[#6B7280] mt-1">
            Revenue projections, goal attainment, and pipeline health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Calendar size={16} />
            <span>Q3 2026</span>
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="enterprise-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#10B981]/10 text-[#10B981] rounded-[8px]">
              <Target size={20} />
            </div>
            <div className="flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-full text-[#10B981] bg-[#10B981]/10">
              <ArrowUpRight size={12} /> 12%
            </div>
          </div>
          <div>
            <p className="caption-text mb-1 uppercase tracking-wider">Weighted Forecast</p>
            <h3 className="text-[32px] font-bold text-[#111827] leading-none">
              ${loading ? '—' : metrics.weightedValue.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="enterprise-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#3B82F6]/10 text-[#3B82F6] rounded-[8px]">
              <DollarSign size={20} />
            </div>
          </div>
          <div>
            <p className="caption-text mb-1 uppercase tracking-wider">Total Pipeline Value</p>
            <h3 className="text-[32px] font-bold text-[#111827] leading-none">
              ${loading ? '—' : metrics.totalValue.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="enterprise-card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-[8px]">
              <TrendingUp size={20} />
            </div>
            <div className="flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-full text-[#F59E0B] bg-[#F59E0B]/10">
              <AlertCircle size={12} /> Needs Attention
            </div>
          </div>
          <div>
            <p className="caption-text mb-1 uppercase tracking-wider">Avg. Win Rate</p>
            <h3 className="text-[32px] font-bold text-[#111827] leading-none">
              {loading ? '—' : (metrics.totalValue > 0 ? Math.round((metrics.weightedValue / metrics.totalValue) * 100) : 0)}%
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Attainment Area Chart */}
        <div className="enterprise-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="card-title">Goal Attainment</h3>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#166534" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 600 }}
                  labelStyle={{ color: '#6B7280', fontSize: '12px', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="target" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                <Area type="monotone" dataKey="actual" stroke="#166534" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Funnel Chart */}
        <div className="enterprise-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="card-title">Pipeline by Stage</h3>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageStats} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `$${val/1000}k`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#111827', fontWeight: 600 }} width={90} />
                <Tooltip 
                  cursor={{fill: '#F8FAFC'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  itemStyle={{ color: '#111827', fontSize: '13px', fontWeight: 600 }}
                  formatter={(value, name, props) => [`$${value.toLocaleString()}`, `${props.payload.count} Deals`]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {stageStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Forecast;
