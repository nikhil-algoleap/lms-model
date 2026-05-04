import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { 
  CheckCircle2, 
  Loader2,
  Calendar,
  ChevronDown,
  Upload
} from 'lucide-react';

const LeadForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    accountName: '',
    primaryContact: '',
    serviceLine: '',
    practiceArea: '',
    deliveryFormat: '',
    value: '250000',
    estimatedDuration: '6',
    dueDate: '2026-05-01',
    probability: '20',
    source: 'Existing Client',
    stage: 'New',
    geography: 'Central Europe',
    practiceLeader: 'Prashanth',
    clientManager: 'Gopi (me)',
    description: ''
  });

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [accRes, conRes] = await Promise.all([
          api.get('/accounts'),
          api.get('/contacts')
        ]);
        setAccounts(accRes.data);
        setContacts(conRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchSelectData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create Lead
      const leadRes = await api.post('/leads', {
        ...formData,
        probability: parseInt(formData.probability),
        estimatedDuration: parseInt(formData.estimatedDuration)
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
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Lead title <span className="text-rose-500">*</span></label>
            <input 
              required
              type="text" 
              placeholder="e.g., DHL · ServiceNow AI Transformation"
              className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <p className="text-[11px] text-slate-400 font-medium pt-1">Suggested format: Account · Project or outcome</p>
          </div>

          <div className="grid grid-cols-2 gap-10">
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Account <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <select required className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium" value={formData.accountName} onChange={(e) => setFormData({...formData, accountName: e.target.value})}>
                    <option value="">Select account...</option>
                    <option value="ADP">ADP</option>
                    <option value="CBRE">CBRE</option>
                    <option value="Cargill">Cargill</option>
                    <option value="Cornerstone">Cornerstone</option>
                    <option value="DHL">DHL</option>
                    <option value="IDP Education">IDP Education</option>
                    <option value="KPMG">KPMG</option>
                    <option value="Maersk">Maersk</option>
                    <option value="Thomson Reuters">Thomson Reuters</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Primary contact</label>
                <div className="relative">
                  <select className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium" value={formData.primaryContact} onChange={(e) => setFormData({...formData, primaryContact: e.target.value})}>
                    <option value="">Select contact...</option>
                    <option value="Marcus Weber">Marcus Weber (DHL)</option>
                    <option value="Sarah Hoffmann">Sarah Hoffmann (DHL)</option>
                    <option value="Jessica Tan">Jessica Tan (Thomson Reuters)</option>
                    <option value="John Doe">John Doe (CBRE)</option>
                    <option value="Alice Smith">Alice Smith (Cargill)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Service line <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <select required className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium" value={formData.serviceLine} onChange={(e) => setFormData({...formData, serviceLine: e.target.value})}>
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
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Practice area</label>
                <div className="relative">
                  <select className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium" value={formData.practiceArea} onChange={(e) => setFormData({...formData, practiceArea: e.target.value})}>
                    <option value="">Select practice area...</option>
                    <option>SRE-observability</option>
                    <option>Salesforce</option>
                    <option>Microsoft Cloud</option>
                    <option>Google Cloud</option>
                    <option>AWS</option>
                    <option>ERP</option>
                    <option>Oracle</option>
                    <option>Adobe</option>
                    <option>Data practice</option>
                    <option>Databricks</option>
                    <option>Workday</option>
                    <option>Pega</option>
                    <option>Supply Chain</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Delivery format</label>
                <div className="relative">
                  <select className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium" value={formData.deliveryFormat} onChange={(e) => setFormData({...formData, deliveryFormat: e.target.value})}>
                    <option value="">Select delivery format...</option>
                    <option>Studio MVP Enhancement</option>
                    <option>TM- Staff Augmentation</option>
                    <option>Project engagement</option>
                    <option>Support services</option>
                    <option>Manager service</option>
                    <option>Managed Services</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Estimated revenue (USD) <span className="text-rose-500">*</span></label>
                <input required type="number" className="w-full border border-slate-200 px-6 py-4 rounded-xl font-medium" value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Estimated duration (months)</label>
                <input type="number" className="w-full border border-slate-200 px-6 py-4 rounded-xl font-medium" value={formData.estimatedDuration} onChange={(e) => setFormData({...formData, estimatedDuration: e.target.value})} />
             </div>
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Expected start date</label>
                <input type="date" className="w-full border border-slate-200 px-6 py-4 rounded-xl font-medium" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Stage</label>
                <div className="relative">
                  <select className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium" value={formData.stage} onChange={(e) => setFormData({...formData, stage: e.target.value})}>
                    <option value="New">New</option>
                    <option value="Qualification">Qualification</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Practice Leader</label>
                <div className="relative">
                  <select className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium" value={formData.practiceLeader} onChange={(e) => setFormData({...formData, practiceLeader: e.target.value})}>
                    <option>Prashanth</option><option>Sanjay</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Owner (Client Manager)</label>
                <div className="relative">
                  <select className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none appearance-none bg-white font-medium" value={formData.clientManager} onChange={(e) => setFormData({...formData, clientManager: e.target.value})}>
                    <option>Gopi (me)</option><option>Nikhil Y</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
             </div>
          </div>

          {/* NEW SECTION: DESCRIPTION */}
          <div className="space-y-2">
             <label className="text-sm font-bold text-slate-700">Description / notes</label>
             <textarea 
               placeholder="Background, opportunity context, competitive landscape, stakeholders..."
               className="w-full border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-slate-400 font-medium text-slate-900 min-h-[150px] resize-y"
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
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
