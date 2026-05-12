import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  PieChart, 
  ArrowUpRight,
  BarChart3,
  Calendar
} from 'lucide-react';

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

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#122b1c]"></div>
    </div>
  );

  // Group deals by stage for the visual representation
  const activeDeals = pipeline.filter(item => item.type === 'DEAL' && item.stage !== 'CLOSED_WON' && item.stage !== 'CLOSED_LOST');
  
  const stageStats = ['DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'CONTRACT'].map(stage => {
    const dealsInStage = activeDeals.filter(d => d.stage === stage);
    const value = dealsInStage.reduce((acc, d) => acc + parseFloat(d.value || 0), 0);
    const count = dealsInStage.length;
    return { stage, value, count };
  });

  const maxStageValue = Math.max(...stageStats.map(s => s.value), 1);

  return (
    <div className="p-8 lg:p-12 space-y-12 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                 <BarChart3 size={18} />
              </div>
              <h1 className="text-4xl font-serif text-slate-900 tracking-tight">Executive Forecast</h1>
           </div>
           <p className="text-slate-400 font-medium">Real-time revenue projection and pipeline health analysis.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="bg-white text-slate-600 px-5 py-3 rounded-xl font-bold flex items-center gap-2 border border-slate-200 hover:bg-slate-50 transition-all text-sm shadow-sm">
                <Calendar size={18} />
                <span>Q3 2026</span>
            </button>
            <button className="bg-[#122b1c] text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-emerald-900/10">
                Export Report
            </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors"></div>
            <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                    <Target size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weighted Forecast</p>
                <div className="flex items-end gap-4 mt-2">
                    <p className="text-4xl font-serif text-slate-900">${metrics.weightedValue.toLocaleString()}</p>
                    <span className="flex items-center text-xs font-bold text-emerald-500 mb-1"><ArrowUpRight size={14} /> 12%</span>
                </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors"></div>
            <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <DollarSign size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Pipeline Value</p>
                <div className="flex items-end gap-4 mt-2">
                    <p className="text-4xl font-serif text-slate-900">${metrics.totalValue.toLocaleString()}</p>
                </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-purple-50 rounded-full blur-2xl group-hover:bg-purple-100 transition-colors"></div>
            <div className="relative z-10">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <TrendingUp size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. Win Rate</p>
                <div className="flex items-end gap-4 mt-2">
                    <p className="text-4xl font-serif text-slate-900">{metrics.totalValue > 0 ? Math.round((metrics.weightedValue / metrics.totalValue) * 100) : 0}%</p>
                </div>
            </div>
         </div>
      </div>

      {/* Visual Pipeline Funnel */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
         <div className="flex items-center gap-3 mb-10">
            <PieChart size={20} className="text-slate-400" />
            <h3 className="font-bold text-slate-900 text-lg">Revenue by Stage</h3>
         </div>
         
         <div className="space-y-8">
            {stageStats.map((stat, i) => {
               const percentage = Math.max((stat.value / maxStageValue) * 100, 5); // Ensure at least 5% width for visibility
               const colors = [
                  'bg-blue-500', // DISCOVERY
                  'bg-purple-500', // PROPOSAL
                  'bg-orange-500', // NEGOTIATION
                  'bg-emerald-500' // CONTRACT
               ];
               
               return (
                  <div key={stat.stage} className="flex items-center gap-6">
                     <div className="w-32 text-right">
                        <p className="font-bold text-slate-900">{stat.stage.replace('_', ' ')}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.count} Deals</p>
                     </div>
                     <div className="flex-1 bg-slate-50 rounded-full h-8 relative overflow-hidden">
                        <div 
                           className={`absolute left-0 top-0 bottom-0 ${colors[i]} rounded-full transition-all duration-1000 ease-out`}
                           style={{ width: `${percentage}%` }}
                        ></div>
                     </div>
                     <div className="w-32 text-left">
                        <p className="font-bold text-slate-900">${stat.value.toLocaleString()}</p>
                     </div>
                  </div>
               );
            })}
         </div>
      </div>
      
    </div>
  );
};

export default Forecast;
