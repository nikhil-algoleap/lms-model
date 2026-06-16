import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { 
  Building2, 
  User, 
  TrendingUp, 
  Loader2, 
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Zap
} from 'lucide-react';

const ConvertLeadModal = ({ lead, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [accountMode, setAccountMode] = useState('new'); // 'new' or 'existing'
  const [selectedAccountId, setSelectedAccountId] = useState('');

  const [formData, setFormData] = useState({
    // Account
    accountName: lead?.company || lead?.account?.name || '',
    // Contact (pre-filled from lead)
    contactFirstName: lead?.firstName || '',
    contactLastName: lead?.lastName || '',
    contactEmail: lead?.email || '',
    contactPhone: lead?.phone || '',
    contactJobTitle: lead?.jobTitle || '',
    // Opportunity / Deal
    dealTitle: `${lead?.company || lead?.account?.name || ''} - ${lead?.firstName || ''} ${lead?.lastName || ''}`.trim().replace(/^- /, ''),
    dealValue: '',
    dealStage: 'DISCOVERY',
    dealProbability: '10',
    expectedCloseDate: '',
    dealDescription: lead?.description || ''
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get('/accounts');
        setAccounts(res.data);
        // If lead already has an account, pre-select it
        if (lead?.accountId) {
          setAccountMode('existing');
          setSelectedAccountId(lead.accountId);
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    };
    if (lead) fetchAccounts();
  }, [lead]);

  const handleConvert = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        // Account info
        accountMode,
        accountName: accountMode === 'new' ? formData.accountName : undefined,
        existingAccountId: accountMode === 'existing' ? selectedAccountId : undefined,
        // Contact info
        contactFirstName: formData.contactFirstName,
        contactLastName: formData.contactLastName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        contactJobTitle: formData.contactJobTitle,
        // Deal info
        title: formData.dealTitle,
        value: formData.dealValue,
        probability: parseInt(formData.dealProbability) || 10,
        expectedCloseDate: formData.expectedCloseDate || undefined,
        description: formData.dealDescription
      };

      const res = await api.post(`/deals/convert/${lead.id}`, payload);
      setSuccess(true);
      setTimeout(() => onSuccess(res.data), 2000);
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  if (!lead) return null;

  if (success) return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 size={48} />
      </div>
      <h3 className="text-3xl font-serif font-bold text-slate-900">Lead Converted!</h3>
      <p className="text-slate-400 font-medium mt-2">Account, Contact, and Deal have been created successfully.</p>
    </div>
  );

  return (
    <div className="bg-[#fcfbf9] p-8 lg:p-12 max-h-[85vh] overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Zap className="text-emerald-600" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">Convert Lead</h2>
              <p className="text-sm text-slate-400 font-medium">
                {lead.firstName} {lead.lastName} {lead.company ? `· ${lead.company}` : ''}
              </p>
            </div>
          </div>
          
          {/* Conversion flow visual */}
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 mt-4">
            <span className="text-xs font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">LEAD</span>
            <ArrowRight size={16} className="text-slate-300" />
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">ACCOUNT</span>
            <span className="text-xs font-black text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">CONTACT</span>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">DEAL</span>
          </div>
        </div>

        <form onSubmit={handleConvert} className="space-y-8">

          {/* Section 1: Account */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <Building2 size={20} className="text-blue-600" />
              <div>
                <h3 className="font-bold text-slate-900">Account</h3>
                <p className="text-xs text-slate-400 font-medium">Company record for this prospect</p>
              </div>
            </div>

            <div className="flex gap-4">
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer flex-1 transition-all ${accountMode === 'new' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-slate-300'}`}>
                <input type="radio" name="accountMode" value="new" checked={accountMode === 'new'} onChange={() => setAccountMode('new')} className="accent-blue-600" />
                <span className="text-sm font-bold text-slate-700">Create new account</span>
              </label>
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer flex-1 transition-all ${accountMode === 'existing' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-slate-300'}`}>
                <input type="radio" name="accountMode" value="existing" checked={accountMode === 'existing'} onChange={() => setAccountMode('existing')} className="accent-blue-600" />
                <span className="text-sm font-bold text-slate-700">Use existing account</span>
              </label>
            </div>

            {accountMode === 'new' ? (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Account name <span className="text-rose-500">*</span></label>
                <input 
                  required
                  type="text"
                  className="w-full border border-slate-200 px-5 py-3.5 rounded-xl outline-none focus:border-blue-400 font-medium text-slate-900"
                  value={formData.accountName}
                  onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Select account <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <select 
                    required
                    className="w-full border border-slate-200 px-5 py-3.5 rounded-xl outline-none appearance-none bg-white font-medium"
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                  >
                    <option value="">Choose an account...</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Contact */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <User size={20} className="text-purple-600" />
              <div>
                <h3 className="font-bold text-slate-900">Contact</h3>
                <p className="text-xs text-slate-400 font-medium">Person record linked to the account</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">First name</label>
                <input type="text" className="w-full border border-slate-200 px-5 py-3.5 rounded-xl outline-none font-medium text-slate-900" value={formData.contactFirstName} onChange={(e) => setFormData({...formData, contactFirstName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Last name</label>
                <input type="text" className="w-full border border-slate-200 px-5 py-3.5 rounded-xl outline-none font-medium text-slate-900" value={formData.contactLastName} onChange={(e) => setFormData({...formData, contactLastName: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email</label>
                <input type="email" className="w-full border border-slate-200 px-5 py-3.5 rounded-xl outline-none font-medium text-slate-900" value={formData.contactEmail} onChange={(e) => setFormData({...formData, contactEmail: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Phone</label>
                <input type="tel" className="w-full border border-slate-200 px-5 py-3.5 rounded-xl outline-none font-medium text-slate-900" value={formData.contactPhone} onChange={(e) => setFormData({...formData, contactPhone: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Job title</label>
              <input type="text" className="w-full border border-slate-200 px-5 py-3.5 rounded-xl outline-none font-medium text-slate-900" value={formData.contactJobTitle} onChange={(e) => setFormData({...formData, contactJobTitle: e.target.value})} />
            </div>
          </div>

          {/* Section 3: Opportunity / Deal */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <TrendingUp size={20} className="text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-900">Opportunity / Deal</h3>
                <p className="text-xs text-slate-400 font-medium">Revenue opportunity details</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Deal name <span className="text-rose-500">*</span></label>
              <input 
                required
                type="text"
                placeholder="e.g., Acme Corp - Cloud Migration"
                className="w-full border border-slate-200 px-5 py-3.5 rounded-xl outline-none focus:border-emerald-400 font-medium text-slate-900"
                value={formData.dealTitle}
                onChange={(e) => setFormData({...formData, dealTitle: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Deal value (USD)</label>
                <input type="number" placeholder="250000" className="w-full border border-slate-200 px-5 py-3.5 rounded-xl outline-none font-medium text-slate-900" value={formData.dealValue} onChange={(e) => setFormData({...formData, dealValue: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Probability (%)</label>
                <input type="number" min="0" max="100" className="w-full border border-slate-200 px-5 py-3.5 rounded-xl outline-none font-medium text-slate-900" value={formData.dealProbability} onChange={(e) => setFormData({...formData, dealProbability: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Stage</label>
                <div className="relative">
                  <select className="w-full border border-slate-200 px-5 py-3.5 rounded-xl outline-none appearance-none bg-white font-medium" value={formData.dealStage} onChange={(e) => setFormData({...formData, dealStage: e.target.value})}>
                    <option value="DISCOVERY">Discovery</option>
                    <option value="PROPOSAL">Proposal</option>
                    <option value="NEGOTIATION">Negotiation</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Expected close date</label>
                <input type="date" className="w-full border border-slate-200 px-5 py-3.5 rounded-xl outline-none font-medium text-slate-900" value={formData.expectedCloseDate} onChange={(e) => setFormData({...formData, expectedCloseDate: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-6 pt-4">
            <button type="button" onClick={onClose} className="w-full border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all">Cancel</button>
            <button disabled={loading} className="w-full bg-[#34833a] text-white py-4 rounded-2xl font-bold shadow-xl shadow-green-900/10 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={18} /> Convert Lead</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ConvertLeadModal;
