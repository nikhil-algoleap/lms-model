import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  CheckCircle2,
  Loader2,
  X,
  Building2,
  User,
  Target,
  Flag
} from 'lucide-react';

const ConvertLeadModal = ({ lead, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null); // Will hold the response data on success
  const [accounts, setAccounts] = useState([]);
  
  // Section Expansion State
  const [expandedSection, setExpandedSection] = useState('account');

  // Form State
  const [accountMode, setAccountMode] = useState('new');
  const [contactMode, setContactMode] = useState('new');
  const [opportunityMode, setOpportunityMode] = useState('new');
  const [createOpportunity, setCreateOpportunity] = useState(true);

  const [formData, setFormData] = useState({
    accountName: lead?.company || lead?.account?.name || '',
    existingAccountId: lead?.accountId || '',
    
    contactFullName: `${lead?.firstName || ''} ${lead?.lastName || ''}`.trim(),
    
    opportunityName: `${lead?.company || lead?.account?.name || ''} - ${lead?.firstName || ''} ${lead?.lastName || ''}`.trim().replace(/^- /, '')
  });

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get('/accounts');
        setAccounts(res.data);
        if (lead?.accountId) {
          setAccountMode('existing');
          setFormData(prev => ({ ...prev, existingAccountId: lead.accountId }));
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    };
    if (lead) fetchAccounts();
  }, [lead]);

  const handleConvert = async () => {
    setLoading(true);
    try {
      const payload = {
        accountMode,
        accountName: accountMode === 'new' ? formData.accountName : undefined,
        existingAccountId: accountMode === 'existing' ? formData.existingAccountId : undefined,
        
        contactFirstName: lead?.firstName || '',
        contactLastName: lead?.lastName || '',
        contactEmail: lead?.email || '',
        contactPhone: lead?.phone || '',
        contactJobTitle: lead?.jobTitle || '',
        
        createDeal: createOpportunity,
        title: createOpportunity ? formData.opportunityName : undefined,
      };

      const res = await api.post(`/deals/convert/${lead.id}`, payload);
      
      // Artificial delay for better UX
      setTimeout(() => {
        setSuccessData({
          account: res.data.account || { name: formData.accountName || accounts.find(a => a.id === formData.existingAccountId)?.name },
          contact: res.data.contact || { name: formData.contactFullName },
          opportunity: createOpportunity ? (res.data.deal || { name: formData.opportunityName }) : null
        });
        setLoading(false);
      }, 800);
      
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Conversion failed');
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // SUCCESS SCREEN
  if (successData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden relative">
          <button onClick={onClose} className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10">
            <X size={20} />
          </button>
          
          <div className="p-10 flex flex-col items-center border-b border-slate-100 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent"></div>
            <h2 className="text-3xl font-light text-slate-800 mb-8 relative z-10">Your lead has been converted</h2>
            
            <div className="relative w-32 h-32 mb-4">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-blue-200 rounded-full flex items-center justify-center">
                <Flag className="text-blue-600 w-12 h-12" />
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Account Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-4">Account</h4>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex flex-shrink-0 items-center justify-center text-white">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-600 hover:underline cursor-pointer">{successData.account?.name || formData.accountName}</h5>
                    <div className="mt-2 text-xs text-slate-600 space-y-1">
                      <p><span className="text-slate-400">Account Owner:</span> You</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-4">Contact</h4>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 flex flex-shrink-0 items-center justify-center text-white">
                    <User size={16} />
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-600 hover:underline cursor-pointer">{successData.contact?.name || formData.contactFullName}</h5>
                    <div className="mt-2 text-xs text-slate-600 space-y-1">
                      <p><span className="text-slate-400">Title:</span> {lead?.jobTitle || 'N/A'}</p>
                      <p><span className="text-slate-400">Email:</span> {lead?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opportunity Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-4">Opportunity</h4>
                {createOpportunity ? (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500 flex flex-shrink-0 items-center justify-center text-white">
                      <Target size={16} />
                    </div>
                    <div>
                      <h5 className="font-semibold text-blue-600 hover:underline cursor-pointer">{successData.opportunity?.name || formData.opportunityName}</h5>
                      <div className="mt-2 text-xs text-slate-600 space-y-1">
                        <p><span className="text-slate-400">Account Name:</span> {successData.account?.name || formData.accountName}</p>
                        <p><span className="text-slate-400">Opportunity Owner:</span> You</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-20 text-sm text-slate-400 italic">
                    Not created
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end gap-3">
            <button 
              onClick={() => navigate('/leads')}
              className="px-5 py-2 border border-slate-300 text-slate-700 bg-white rounded-full font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Go to Leads
            </button>
            <button 
              onClick={() => {
                onClose();
                navigate(successData.opportunity?.id ? `/deals/${successData.opportunity.id}` : '/opportunities');
              }}
              className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold text-sm hover:bg-blue-700 transition-colors"
            >
              View Opportunity
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CONVERT FORM MODAL
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white relative">
          <h2 className="text-lg font-bold text-slate-800 w-full text-center">Convert Lead</h2>
          <button onClick={onClose} className="absolute right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-0 bg-white">
          {/* ACCOUNT SECTION */}
          <div className="border-b border-slate-200">
            <button 
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              onClick={() => toggleSection('account')}
            >
              <div className="flex items-center gap-3">
                {expandedSection === 'account' ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                <span className="font-semibold text-slate-800">Account</span>
              </div>
              {accountMode === 'new' && formData.accountName && expandedSection !== 'account' && (
                <span className="text-sm text-slate-500">{formData.accountName} (New)</span>
              )}
            </button>
            
            {expandedSection === 'account' && (
              <div className="px-12 pb-6 flex gap-8">
                {/* Create New Account */}
                <div className="flex-1 space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={accountMode === 'new'} 
                      onChange={() => setAccountMode('new')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">Create New Account</span>
                  </label>
                  <div className="pl-6">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                      <span className="text-red-500">*</span> Account Name
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      value={formData.accountName}
                      onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                      disabled={accountMode !== 'new'}
                    />
                  </div>
                </div>
                
                <div className="w-px bg-slate-200"></div>
                
                {/* Choose Existing Account */}
                <div className="flex-1 space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={accountMode === 'existing'} 
                      onChange={() => setAccountMode('existing')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">Choose Existing Account</span>
                  </label>
                  <div className="pl-6">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Account Search</label>
                    <div className="relative">
                      <select 
                        className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm appearance-none bg-white"
                        value={formData.existingAccountId}
                        onChange={(e) => setFormData({...formData, existingAccountId: e.target.value})}
                        disabled={accountMode !== 'existing'}
                      >
                        <option value="">Search for matching accounts...</option>
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                      </select>
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    </div>
                    <div className="mt-2 h-20 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center">
                      <span className="text-xs text-slate-400">
                        {accountMode === 'existing' && formData.existingAccountId ? '1 Account Selected' : '0 Account Matches'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CONTACT SECTION */}
          <div className="border-b border-slate-200 bg-white">
            <button 
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              onClick={() => toggleSection('contact')}
            >
              <div className="flex items-center gap-3">
                {expandedSection === 'contact' ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                <span className="font-semibold text-slate-800">Contact</span>
              </div>
              {contactMode === 'new' && formData.contactFullName && expandedSection !== 'contact' && (
                <span className="text-sm text-slate-500">{formData.contactFullName} (New)</span>
              )}
            </button>
            
            {expandedSection === 'contact' && (
              <div className="px-12 pb-6 flex gap-8">
                <div className="flex-1 space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={contactMode === 'new'} 
                      onChange={() => setContactMode('new')}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-semibold text-slate-700">Create New Contact</span>
                  </label>
                  <div className="pl-6">
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      value={formData.contactFullName}
                      onChange={(e) => setFormData({...formData, contactFullName: e.target.value})}
                      disabled={contactMode !== 'new'}
                    />
                  </div>
                </div>
                
                <div className="w-px bg-slate-200"></div>
                
                <div className="flex-1 space-y-4">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                    <input 
                      type="radio" 
                      disabled
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">Choose Existing Contact</span>
                  </label>
                  <div className="pl-6">
                    <div className="h-10 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center">
                      <span className="text-xs text-slate-400">0 Contact Matches detected</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* OPPORTUNITY SECTION */}
          <div className="border-b border-slate-200 bg-white">
            <button 
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              onClick={() => toggleSection('opportunity')}
            >
              <div className="flex items-center gap-3">
                {expandedSection === 'opportunity' ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                <span className="font-semibold text-slate-800">Opportunity</span>
              </div>
              {opportunityMode === 'new' && formData.opportunityName && createOpportunity && expandedSection !== 'opportunity' && (
                <span className="text-sm text-slate-500">{formData.opportunityName} (New)</span>
              )}
              {!createOpportunity && expandedSection !== 'opportunity' && (
                <span className="text-sm text-slate-500 italic">Do not create</span>
              )}
            </button>
            
            {expandedSection === 'opportunity' && (
              <div className="px-12 pb-6 space-y-6">
                <div className="flex gap-8">
                  <div className="flex-1 space-y-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        checked={opportunityMode === 'new' && createOpportunity} 
                        onChange={() => {
                          setOpportunityMode('new');
                          setCreateOpportunity(true);
                        }}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm font-semibold text-slate-700">Create New Opportunity</span>
                    </label>
                    <div className="pl-6">
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        value={formData.opportunityName}
                        onChange={(e) => setFormData({...formData, opportunityName: e.target.value})}
                        disabled={opportunityMode !== 'new' || !createOpportunity}
                      />
                    </div>
                  </div>
                  
                  <div className="w-px bg-slate-200"></div>
                  
                  <div className="flex-1 space-y-4">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                      <input 
                        type="radio" 
                        disabled
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-semibold">Choose Existing Opportunity</span>
                    </label>
                    <div className="pl-6">
                      <div className="h-10 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center">
                        <span className="text-xs text-slate-400">To find opportunity, choose an existing account</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 pl-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!createOpportunity}
                      onChange={(e) => setCreateOpportunity(!e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-600">Don't create an opportunity upon conversion</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end gap-3 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 text-slate-700 bg-white rounded-full font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConvert}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Convert'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvertLeadModal;
