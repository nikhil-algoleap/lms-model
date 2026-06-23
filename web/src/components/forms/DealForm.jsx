import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { 
  CheckCircle2, 
  Loader2, 
  ChevronDown, 
  DollarSign, 
  Calendar 
} from 'lucide-react';

const SearchableSelect = ({ label, placeholder, value, onChange, options, required, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value || '');

  useEffect(() => {
    setSearch(value || '');
  }, [value]);

  const filteredOptions = options.filter(opt =>
    opt && opt.toLowerCase().includes(search.toLowerCase())
  );

  const isExactMatch = options.some(opt =>
    opt && opt.toLowerCase() === search.trim().toLowerCase()
  );

  return (
    <div className="space-y-2 relative">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <div className="relative">
        <input
          required={required}
          type="text"
          placeholder={placeholder}
          disabled={disabled}
          className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900 bg-white"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 200);
          }}
        />
        <ChevronDown 
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer pointer-events-none" 
          size={18} 
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2">
          {search.trim() !== '' && !isExactMatch && (
            <div
              className="px-6 py-3 text-sm text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer font-bold border-b border-slate-100"
              onMouseDown={() => {
                const newValue = search.trim();
                setSearch(newValue);
                onChange(newValue);
              }}
            >
              + Add "{search.trim()}" as new account
            </div>
          )}

          {filteredOptions.map((opt, i) => (
            <div
              key={i}
              className="px-6 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer font-medium"
              onMouseDown={() => {
                setSearch(opt);
                onChange(opt);
              }}
            >
              {opt}
            </div>
          ))}

          {filteredOptions.length === 0 && search.trim() === '' && (
            <div className="px-6 py-3 text-sm text-slate-400 italic">
              No accounts found. Type a new name to create.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DealForm = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    accountName: '',
    expectedCloseDate: '',
    stage: 'DISCOVERY',
    value: '',
    nextStep: '',
    leadSource: 'Existing Client',
    description: ''
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get('/accounts');
        setAccounts(res.data);
      } catch (err) {
        console.error('Error fetching accounts for form:', err);
      }
    };
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Find matching account ID if selected from options
      const matchedAccount = accounts.find(a => a.name.toLowerCase() === formData.accountName.trim().toLowerCase());
      
      const payload = {
        title: formData.title,
        accountId: matchedAccount ? matchedAccount.id : undefined,
        accountName: formData.accountName,
        stage: formData.stage,
        value: formData.value,
        expectedCloseDate: formData.expectedCloseDate || undefined,
        nextStep: formData.nextStep || undefined,
        leadSource: formData.leadSource || undefined,
        description: formData.description || undefined
      };

      await api.post('/deals', payload);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      console.error('Error creating opportunity:', err);
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to create opportunity');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Opportunity Created Successfully</h3>
        <p className="text-slate-400 font-medium mt-2">The pipeline has been updated.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Create New Opportunity</h2>
          <p className="text-slate-500 font-medium text-sm">Add a new opportunity/deal to the sales pipeline</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Opportunity Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Opportunity Name <span className="text-rose-500">*</span></label>
              <input
                required
                type="text"
                placeholder="e.g. ERP Implementation Phase 2"
                className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900 bg-white"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Account Name (Searchable Select) */}
            <SearchableSelect
              required
              label="Account Name"
              placeholder="Search or enter account..."
              value={formData.accountName}
              onChange={(val) => setFormData({ ...formData, accountName: val })}
              options={accounts.map(a => a.name)}
            />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Close Date */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Close Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900 bg-white"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                />
              </div>
            </div>

            {/* Stage */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Stage <span className="text-rose-500">*</span></label>
              <div className="relative">
                <select
                  required
                  className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium text-slate-900"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                >
                  <option value="DISCOVERY">Discovery</option>
                  <option value="PROPOSAL">Proposal</option>
                  <option value="NEGOTIATION">Negotiation</option>
                  <option value="CONTRACT">Contact</option>
                  <option value="CLOSED_WON">Closed Won</option>
                  <option value="CLOSED_LOST">Closed Lost</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full border border-slate-200 pl-10 pr-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900 bg-white"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Next Step */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Next Step</label>
              <input
                type="text"
                placeholder="e.g. Schedule demo or follow up meeting"
                className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900 bg-white"
                value={formData.nextStep}
                onChange={(e) => setFormData({ ...formData, nextStep: e.target.value })}
              />
            </div>

            {/* Lead Source */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Lead Source</label>
              <div className="relative">
                <select
                  className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium text-slate-900"
                  value={formData.leadSource}
                  onChange={(e) => setFormData({ ...formData, leadSource: e.target.value })}
                >
                  <option value="Existing Client">Existing Client</option>
                  <option value="Referral">Referral</option>
                  <option value="Website">Website</option>
                  <option value="Cold Outreach">Cold Outreach</option>
                  <option value="Event/Conference">Event/Conference</option>
                  <option value="Partner">Partner</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            </div>

          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Description</label>
            <textarea
              rows="3"
              placeholder="Enter details about this deal..."
              className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900 bg-white resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Action Button */}
          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading} 
              className="bg-[#358b49] text-white px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#2a7039] transition-all disabled:opacity-70 shadow-lg shadow-green-950/10"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              Create Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealForm;
