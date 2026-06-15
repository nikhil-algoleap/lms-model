import React, { useState } from 'react';
import api from '../../api/client';
import { 
  CheckCircle2, 
  Loader2,
  Calendar,
  ChevronDown
} from 'lucide-react';

const DealForm = ({ onSuccess, prefilledAccountId, prefilledAccountName }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    accountId: prefilledAccountId || '',
    accountName: prefilledAccountName || '',
    value: '250000',
    probability: '10',
    stage: 'DISCOVERY',
    expectedCloseDate: '2026-12-31',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/deals', {
        ...formData,
        value: parseFloat(formData.value) || 0,
        probability: parseInt(formData.probability, 10) || 10
      });

      setSuccess(true);
      setTimeout(() => onSuccess(), 2000);
    } catch (err) {
      console.error('Error creating deal:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 size={48} />
      </div>
      <h3 className="text-3xl font-serif font-bold text-slate-900">Deal Successfully Created</h3>
      <p className="text-slate-400 font-medium mt-2">The deal has been logged directly in the pipeline.</p>
    </div>
  );

  return (
    <div className="bg-[#fcfbf9] p-8 lg:p-12 rounded-3xl">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif text-slate-900 tracking-tight">Create new deal</h1>
          <p className="text-slate-500 font-medium text-sm">Log a qualified business opportunity directly under this account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Deal Title <span className="text-rose-500">*</span></label>
            <input 
              required
              type="text" 
              placeholder="e.g., DHL · Global Logistics Phase 2"
              className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Account</label>
              <input 
                disabled
                type="text"
                className="w-full border border-slate-200 px-6 py-4 rounded-xl font-medium bg-slate-50 text-slate-400 cursor-not-allowed"
                value={formData.accountName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Value (USD) <span className="text-rose-500">*</span></label>
              <input 
                required
                type="number"
                className="w-full border border-slate-200 px-6 py-4 rounded-xl font-medium"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Stage</label>
              <div className="relative">
                <select 
                  className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium" 
                  value={formData.stage} 
                  onChange={(e) => setFormData({...formData, stage: e.target.value})}
                >
                  <option value="DISCOVERY">Discovery</option>
                  <option value="PROPOSAL">Proposal</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="CONTRACT">Contract</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Probability (%)</label>
              <input 
                type="number"
                min="0"
                max="100"
                className="w-full border border-slate-200 px-6 py-4 rounded-xl font-medium"
                value={formData.probability}
                onChange={(e) => setFormData({...formData, probability: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Expected Close Date</label>
            <input 
              type="date"
              className="w-full border border-slate-200 px-6 py-4 rounded-xl font-medium"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData({...formData, expectedCloseDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Description / Opportunity Notes</label>
            <textarea 
              placeholder="Provide context on this deal opportunity..."
              className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900 min-h-[120px] resize-y"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => onSuccess()} className="w-full border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">Cancel</button>
            <button disabled={loading} type="submit" className="w-full bg-[#34833a] text-white py-4 rounded-2xl font-bold shadow-sm hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealForm;
