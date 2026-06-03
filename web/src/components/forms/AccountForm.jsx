import React, { useState } from 'react';
import api from '../../api/client';
import { Loader2, CheckCircle2 } from 'lucide-react';

const AccountForm = ({ onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    industry: 'Technology',
    annualRevenue: '',
    employeesCount: '',
    ownership: '',
    status: 'Customer',
    region: 'EMEA', // Hidden or kept for backward compatibility if needed
    website: '',
    foundedYear: '',
    description: '',
    specialties: '',
    linkedin: '',
    twitter: '',
    instagram: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/accounts', formData);
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
      <h3 className="text-2xl font-bold text-slate-900">Account Created Successfully</h3>
    </div>
  );

  return (
    <div className="w-full">
      {/* Custom Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2 tracking-tight">Create new account</h2>
          <p className="text-slate-500 font-medium">Add a new company profile to the LMS</p>
        </div>
        <button 
          onClick={onClose}
          className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Account name */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            Account name <span className="text-rose-500">*</span>
          </label>
          <input 
            required 
            name="name" 
            type="text" 
            placeholder="e.g., DHL Global Forwarding" 
            className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
            value={formData.name} 
            onChange={handleChange} 
          />
        </div>

        {/* Row 2: Website & Founded Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Website URL
            </label>
            <input 
              name="website" 
              type="url" 
              placeholder="e.g. https://www.dhl.com" 
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
              value={formData.website} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Founded Year
            </label>
            <input 
              name="foundedYear" 
              type="text" 
              placeholder="e.g. 1969" 
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
              value={formData.foundedYear} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Row 3: Account address */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            Account address
          </label>
          <textarea 
            name="address" 
            rows="3" 
            placeholder="Headquarters address, street, city, country..." 
            className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700 resize-none" 
            value={formData.address} 
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Row 4: About the Company */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-2">
            About the Company
          </label>
          <textarea 
            name="description" 
            rows="3" 
            placeholder="Brief description of the company business, specialties, etc..." 
            className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700 resize-none" 
            value={formData.description} 
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Row 5: Revenue & Employees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Annual revenue (USD)
            </label>
            <input 
              name="annualRevenue" 
              type="text" 
              placeholder="e.g. 10000000" 
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
              value={formData.annualRevenue} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Number of employees
            </label>
            <input 
              name="employeesCount" 
              type="number" 
              placeholder="e.g. 5000" 
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
              value={formData.employeesCount} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Row 6: Status & Ownership */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Status
            </label>
            <select 
              name="status" 
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1em]" 
              value={formData.status} 
              onChange={handleChange}
            >
              <option value="Customer">Customer</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Ownership
            </label>
            <select 
              name="ownership" 
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1em]" 
              value={formData.ownership} 
              onChange={handleChange}
            >
              <option value="" disabled>Select ownership...</option>
              <option value="Private">Private</option>
              <option value="Public">Public</option>
              <option value="Government">Government</option>
              <option value="Startup">Startup</option>
            </select>
          </div>
        </div>

        {/* Row 7: Industry & Specialties */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Industry <span className="text-rose-500">*</span>
            </label>
            <select 
              required
              name="industry" 
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1em]" 
              value={formData.industry} 
              onChange={handleChange}
            >
              <option value="" disabled>Select industry...</option>
              <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
              <option value="Banking & Financial Services">Banking & Financial Services</option>
              <option value="Technology & SaaS">Technology & SaaS</option>
              <option value="Healthcare & Pharma">Healthcare & Pharma</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail & E-commerce">Retail & E-commerce</option>
              <option value="Energy & Utilities">Energy & Utilities</option>
              <option value="Education / EdTech">Education / EdTech</option>
              <option value="Chemicals">Chemicals</option>
              <option value="Real Estate">Real Estate</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Specialties
            </label>
            <input 
              name="specialties" 
              type="text" 
              placeholder="e.g. Water Treatment, Logistics, SaaS" 
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
              value={formData.specialties} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Row 8: Social Media Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              LinkedIn URL
            </label>
            <input 
              name="linkedin" 
              type="url" 
              placeholder="e.g. https://linkedin.com/company/dhl" 
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
              value={formData.linkedin} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              X (Twitter) URL
            </label>
            <input 
              name="twitter" 
              type="url" 
              placeholder="e.g. https://x.com/dhl" 
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
              value={formData.twitter} 
              onChange={handleChange} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Instagram URL
            </label>
            <input 
              name="instagram" 
              type="url" 
              placeholder="e.g. https://instagram.com/dhl" 
              className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
              value={formData.instagram} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <button 
            disabled={loading} 
            className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-70"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            Create Account
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default AccountForm;
