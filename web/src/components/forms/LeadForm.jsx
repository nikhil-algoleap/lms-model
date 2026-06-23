import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  CheckCircle2,
  Loader2,
  Calendar,
  ChevronDown,
  Upload
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
      <label className="text-sm font-bold text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
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
              + Add "{search.trim()}" as new {label.toLowerCase()}
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
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LeadForm = ({ onSuccess, prefilledAccountName }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [file, setFile] = useState(null);

  // Dropdown lists
  const [practiceLeaders, setPracticeLeaders] = useState(['Prashanth', 'Sanjay']);
  const [clientManagers, setClientManagers] = useState(['Gopi (me)', 'Nikhil Y']);
  const [practiceAreas, setPracticeAreas] = useState([
    'SRE-observability',
    'Salesforce',
    'Microsoft Cloud',
    'Google Cloud',
    'AWS',
    'ERP',
    'Oracle',
    'Adobe',
    'Data practice',
    'Databricks',
    'Workday',
    'Pega',
    'Supply Chain'
  ]);
  const [deliveryFormats, setDeliveryFormats] = useState([
    'Studio MVP Enhancement',
    'TM- Staff Augmentation',
    'Project engagement',
    'Support services',
    'Manager service',
    'Managed Services'
  ]);

  const [formData, setFormData] = useState({
    accountName: prefilledAccountName || '',
    primaryContact: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    industry: '',
    leadStatus: 'NEW',
    leadRating: 'COLD',
    serviceLine: '',
    practiceArea: '',
    deliveryFormat: '',
    value: '',
    estimatedDuration: '',
    dueDate: '',
    probability: '20',
    source: 'Existing Client',
    geography: 'Central Europe',
    practiceLeader: '',
    clientManager: '',
    description: ''
  });

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        // Fetch accounts
        try {
          const accRes = await api.get('/accounts');
          setAccounts(accRes.data);
        } catch (e) {
          console.error('Error fetching accounts:', e);
        }

        // Fetch contacts
        try {
          const conRes = await api.get('/contacts');
          setContacts(conRes.data);
        } catch (e) {
          console.error('Error fetching contacts:', e);
        }

        // Fetch leads to extract existing practice leaders, client managers, practice areas, and delivery formats dynamically
        try {
          const leadRes = await api.get('/leads');
          const uniqueLeaders = new Set(['Prashanth', 'Sanjay']);
          const uniqueManagers = new Set(['Gopi (me)', 'Nikhil Y']);
          const uniquePracticeAreas = new Set([
            'SRE-observability',
            'Salesforce',
            'Microsoft Cloud',
            'Google Cloud',
            'AWS',
            'ERP',
            'Oracle',
            'Adobe',
            'Data practice',
            'Databricks',
            'Workday',
            'Pega',
            'Supply Chain'
          ]);
          const uniqueDeliveryFormats = new Set([
            'Studio MVP Enhancement',
            'TM- Staff Augmentation',
            'Project engagement',
            'Support services',
            'Manager service',
            'Managed Services'
          ]);

          if (leadRes.data && Array.isArray(leadRes.data)) {
            leadRes.data.forEach(lead => {
              if (lead.practiceLeader) uniqueLeaders.add(lead.practiceLeader);
              if (lead.clientManager) uniqueManagers.add(lead.clientManager);
              if (lead.practiceArea) uniquePracticeAreas.add(lead.practiceArea);
              if (lead.deliveryFormat) uniqueDeliveryFormats.add(lead.deliveryFormat);
            });
          }
          setPracticeLeaders(Array.from(uniqueLeaders));
          setClientManagers(Array.from(uniqueManagers));
          setPracticeAreas(Array.from(uniquePracticeAreas));
          setDeliveryFormats(Array.from(uniqueDeliveryFormats));
        } catch (e) {
          console.error('Error fetching leads for selection:', e);
        }
      } catch (err) {
        console.error('General fetch error:', err);
      }
    };
    fetchSelectData();
  }, []);

  const handlePrimaryContactChange = (val) => {
    const matchedContact = contacts.find(c => c.fullName === val);
    if (matchedContact) {
      const nameParts = val.trim().split(/\s+/);
      const fName = nameParts[0] || '';
      const lName = nameParts.slice(1).join(' ') || '';

      setFormData(prev => ({
        ...prev,
        primaryContact: val,
        firstName: fName,
        lastName: lName,
        email: matchedContact.email || '',
        phone: matchedContact.phone || '',
        jobTitle: matchedContact.title || '',
        company: matchedContact.account?.name || matchedContact.company || prev.company || '',
        accountName: matchedContact.account?.name || prev.accountName || ''
      }));
    } else {
      const nameParts = val.trim().split(/\s+/);
      const fName = nameParts[0] || '';
      const lName = nameParts.slice(1).join(' ') || '';
      
      setFormData(prev => ({
        ...prev,
        primaryContact: val,
        firstName: fName,
        lastName: lName
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create Lead
      const leadRes = await api.post('/leads', {
        ...formData,
        company: formData.company || formData.accountName,
        probability: formData.probability ? parseInt(formData.probability) : undefined,
        estimatedDuration: formData.estimatedDuration ? parseInt(formData.estimatedDuration) : undefined
      });

      const leadId = leadRes.data.id;

      // 2. Upload file if exists
      if (file && leadId) {
        const fileData = new FormData();
        fileData.append('file', file);
        await api.post(`/leads/${leadId}/upload`, fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setSuccess(true);
      setTimeout(() => onSuccess(), 2000);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 size={48} />
      </div>
      <h3 className="text-3xl font-serif font-bold text-slate-900">Lead Successfully Created</h3>
      <p className="text-slate-400 font-medium mt-2">Opportunity has been assigned and registered.</p>
    </div>
  );

  return (
    <div className="bg-[#fcfbf9] min-h-screen p-8 lg:p-20">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Form Title */}
        <div className="space-y-4">
          <h1 className="text-5xl font-serif text-slate-900 tracking-tight">Create new lead</h1>
          <p className="text-slate-500 font-medium text-lg">Capture a qualified opportunity and assign it to a practice leader</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] space-y-10">

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">First name</label>
              <input
                type="text"
                placeholder="First name"
                className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Last name</label>
              <input
                type="text"
                placeholder="Last name"
                className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email address <span className="text-rose-500">*</span></label>
              <input
                required
                type="email"
                placeholder="name@company.com"
                className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Phone number <span className="text-rose-500">*</span></label>
              <input
                required
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Job Title</label>
              <input
                type="text"
                placeholder="e.g. VP of Engineering"
                className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Company <span className="text-rose-500">*</span></label>
              <input
                required
                type="text"
                placeholder="Company Name"
                className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <SearchableSelect
              label="Account"
              placeholder="Search existing or type new account..."
              value={formData.accountName}
              onChange={(val) => setFormData({ ...formData, accountName: val })}
              options={accounts.map(acc => acc.name)}
              required={true}
              disabled={!!prefilledAccountName}
            />
            <SearchableSelect
              label="Primary Contact"
              placeholder="Search existing or type new contact..."
              value={formData.primaryContact}
              onChange={handlePrimaryContactChange}
              options={contacts.map(c => c.fullName).filter(Boolean)}
              required={false}
            />
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Industry</label>
              <input
                type="text"
                placeholder="e.g., Logistics, Banking, Healthcare"
                className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Leads source</label>
              <div className="relative">
                <select className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium" value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })}>
                  <option value="Existing Client">Existing Client</option>
                  <option value="Referral">Referral</option>
                  <option value="Website">Website</option>
                  <option value="Cold Outreach">Cold Outreach</option>
                  <option value="Event/Conference">Event/Conference</option>
                  <option value="Partner">Partner</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Service line <span className="text-rose-500">*</span></label>
              <div className="relative">
                <select required className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium" value={formData.serviceLine} onChange={(e) => setFormData({ ...formData, serviceLine: e.target.value })}>
                  <option value="">Select service line...</option>
                  <option>AI & Automation</option>
                  <option>Product Engineering</option>
                  <option>Service Management</option>
                  <option>Cloud Migration</option>
                  <option>Cyber Security</option>
                  <option>Data Analytics</option>
                  <option>Digital Experience</option>
                  <option>Enterprise Resource Planning</option>
                  <option>Managed Services</option>
                  <option>Business Transformation</option>
                  <option>Sustainability & ESG</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>
            <SearchableSelect
              label="Practice Area"
              placeholder="Search or type new practice area..."
              value={formData.practiceArea}
              onChange={(val) => setFormData({ ...formData, practiceArea: val })}
              options={practiceAreas}
              required={false}
            />
          </div>

          <div className="grid grid-cols-2 gap-10">
            <SearchableSelect
              label="Delivery Format"
              placeholder="Search or type new delivery format..."
              value={formData.deliveryFormat}
              onChange={(val) => setFormData({ ...formData, deliveryFormat: val })}
              options={deliveryFormats}
              required={false}
            />
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Estimated revenue (USD) <span className="text-rose-500">*</span></label>
              <input required type="number" className="w-full border border-slate-200 px-6 py-4 rounded-xl font-medium" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Estimated duration (months)</label>
              <input type="number" className="w-full border border-slate-200 px-6 py-4 rounded-xl font-medium" value={formData.estimatedDuration} onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Expected start date</label>
              <input type="date" className="w-full border border-slate-200 px-6 py-4 rounded-xl font-medium" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Lead rating</label>
              <div className="relative">
                <select className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium" value={formData.leadRating} onChange={(e) => setFormData({ ...formData, leadRating: e.target.value })}>
                  <option value="HOT">🔥 Hot</option>
                  <option value="WARM">☀️ Warm</option>
                  <option value="COLD">❄️ Cold</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Lead status</label>
              <div className="relative">
                <select className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium" value={formData.leadStatus} onChange={(e) => setFormData({ ...formData, leadStatus: e.target.value })}>
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="UNQUALIFIED">Unqualified</option>
                  <option value="LOST">Lost</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <SearchableSelect
              label="Practice Leader"
              placeholder="Search existing or type new leader..."
              value={formData.practiceLeader}
              onChange={(val) => setFormData({ ...formData, practiceLeader: val })}
              options={practiceLeaders}
              required={false}
            />
            <SearchableSelect
              label="Owner (Client Manager)"
              placeholder="Search existing or type new owner..."
              value={formData.clientManager}
              onChange={(val) => setFormData({ ...formData, clientManager: val })}
              options={clientManagers}
              required={false}
            />
          </div>

          {/* NEW SECTION: DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Description / notes</label>
            <textarea
              placeholder="Background, opportunity context, competitive landscape, stakeholders..."
              className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900 min-h-[150px] resize-y"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          {/* NEW SECTION: FILE UPLOAD */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700">Attach files</label>
            <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 group hover:border-[#122b1c]/30 hover:bg-slate-50 transition-all cursor-pointer relative">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Upload className="text-slate-400 group-hover:text-[#122b1c]" size={32} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-900">{file ? file.name : 'Drag & drop or click to upload'}</p>
                <p className="text-sm text-slate-400 font-medium mt-1">SOWs, proposals, MSAs, pricing sheets · up to 10 MB each</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 pt-10 border-t border-slate-100">
            <button type="button" onClick={() => onSuccess()} className="w-full border border-slate-200 text-slate-600 py-5 rounded-2xl font-bold hover:bg-slate-50 transition-all">Cancel</button>
            <button disabled={loading} className="w-full bg-[#34833a] text-white py-5 rounded-2xl font-bold shadow-xl shadow-green-900/10 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save lead'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LeadForm;
