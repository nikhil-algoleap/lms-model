import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Loader2, CheckCircle2 } from 'lucide-react';

const ContactForm = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accounts, setAccounts] = useState([]);
  
  const [data, setData] = useState({
    fullName: '',
    phone: '',
    accountName: '',
    location: '',
    department: '',
    reportsTo: ''
  });

  useEffect(() => {
    // Fetch accounts to populate the Account dropdown
    const fetchAccounts = async () => {
      try {
        const res = await api.get('/accounts');
        setAccounts(res.data);
      } catch (err) {
        console.error('Failed to fetch accounts', err);
      }
    };
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contacts', data);
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
      <h3 className="text-2xl font-bold text-slate-900">Contact Created Successfully</h3>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Custom Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2 tracking-tight">Create new contact</h2>
          <p className="text-slate-500 font-medium">Add a new stakeholder or account representative</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#3e864e] text-white font-bold rounded-lg shadow-sm hover:bg-[#347242] transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            Save contact
          </button>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="space-y-6">
          
          {/* Row 1: Full Name */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input 
              required 
              name="fullName" 
              type="text" 
              placeholder="e.g., Marcus Weber" 
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
              value={data.fullName} 
              onChange={handleChange} 
            />
          </div>

          {/* Row 2: Phone Number & Account */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Phone Number
              </label>
              <input 
                name="phone" 
                type="text" 
                placeholder="e.g., +49 228 18..." 
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
                value={data.phone} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Account <span className="text-rose-500">*</span>
              </label>
              <select 
                required
                name="accountName" 
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1em]" 
                value={data.accountName} 
                onChange={handleChange}
              >
                <option value="" disabled>Select account...</option>
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
            </div>
          </div>

          {/* Row 3: Location & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Location (Country/City)
              </label>
              <input 
                name="location" 
                type="text" 
                placeholder="e.g., Berlin, Germany" 
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
                value={data.location} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Department
              </label>
              <select 
                name="department" 
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1em]" 
                value={data.department} 
                onChange={handleChange}
              >
                <option value="" disabled>Select department...</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Engineering">Engineering</option>
                <option value="Executive">Executive</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>

          {/* Row 4: Reports to */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Reports to
              </label>
              <input 
                name="reportsTo" 
                type="text" 
                placeholder="e.g., Sarah Hoffmann" 
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
                value={data.reportsTo} 
                onChange={handleChange} 
              />
            </div>
          </div>

        </div>
      </div>
    </form>
  );
};

export default ContactForm;

