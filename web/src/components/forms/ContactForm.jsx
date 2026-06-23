import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Loader2, CheckCircle2, X } from 'lucide-react';

const ContactForm = ({ onSuccess, onClose, editContact }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const [data, setData] = useState({
    fullName: editContact?.fullName || '',
    phone: editContact?.phone || '',
    email: editContact?.email || '',
    accountName: editContact?.account?.name || '',
    title: editContact?.title || '',
    location: editContact?.location || '',
    department: editContact?.department || '',
    reportsTo: editContact?.reportsTo || '',
    role: editContact?.role || '',
    since: editContact?.since || ''
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
    // Fetch contacts for suggestions
    const fetchContacts = async () => {
      try {
        const res = await api.get('/contacts');
        setContacts(res.data);
      } catch (err) {
        console.error('Failed to fetch contacts', err);
      }
    };
    fetchAccounts();
    fetchContacts();
  }, []);

  // Handle clicking outside the custom reportsTo dropdown to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      const container = document.getElementById('reports-to-container');
      if (container && !container.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'accountName') {
      // Clear reportsTo selection when the company/account is changed
      setData({ ...data, accountName: value, reportsTo: '' });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. If reportsTo is filled but does not exist in the selected company's contacts, auto-create it
      if (data.reportsTo && data.reportsTo.trim()) {
        const reportsToName = data.reportsTo.trim();
        const exists = contacts.some(c => 
          c.fullName.toLowerCase() === reportsToName.toLowerCase() &&
          c.account?.name?.toLowerCase() === data.accountName.toLowerCase()
        );
        if (!exists) {
          try {
            await api.post('/contacts', {
              fullName: reportsToName,
              accountName: data.accountName,
              role: 'Manager' // Default role for auto-created manager
            });
          } catch (err) {
            console.error('Failed to auto-create manager contact:', err);
          }
        }
      }

      // 2. Submit/Update the main contact
      if (editContact) {
        await api.put(`/contacts/${editContact.id}`, data);
      } else {
        await api.post('/contacts', data);
      }
      setSuccess(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredContactsForCompany = contacts.filter(
    c => data.accountName && c.account?.name?.toLowerCase() === data.accountName.toLowerCase()
  );

  if (success) return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
      <h3 className="text-2xl font-bold text-slate-900">{editContact ? 'Contact Updated Successfully' : 'Contact Created Successfully'}</h3>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Custom Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2 tracking-tight">{editContact ? 'Edit contact' : 'Create new contact'}</h2>
        <p className="text-slate-500 font-medium">{editContact ? `Editing ${editContact.fullName}` : 'Add a new stakeholder or account representative'}</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="space-y-6">
          
          {/* Row 1: Full Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Email Address
              </label>
              <input 
                name="email" 
                type="email" 
                placeholder="e.g., m.weber@company.com" 
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
                value={data.email} 
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* Row 2: Phone Number & Company */}
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
                Company <span className="text-rose-500">*</span>
              </label>
              <select 
                required
                name="accountName" 
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1em]" 
                value={data.accountName} 
                onChange={handleChange}
              >
                <option value="" disabled>Select company...</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.name}>{acc.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Job Title & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Job Title
              </label>
              <input 
                name="title" 
                type="text" 
                placeholder="e.g., Senior Operations Manager" 
                className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
                value={data.title} 
                onChange={handleChange} 
              />
            </div>
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
          </div>

          {/* Org Chart Placement Section */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Org Chart Placement</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Role Type
                </label>
                <select 
                  name="role" 
                  className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:1em]" 
                  value={data.role} 
                  onChange={handleChange}
                >
                  <option value="" disabled>Select role type...</option>
                  <option value="Executive">Executive (C-Suite/VP)</option>
                  <option value="VP">VP / Director</option>
                  <option value="Lead">Team Lead / Manager</option>
                  <option value="Manager">Manager</option>
                  <option value="IC">Individual Contributor</option>
                </select>
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
                  <option value="Executive">Executive</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Supply Chain">Supply Chain</option>
                  <option value="Procurement">Procurement</option>
                  <option value="Quality Management">Quality Management</option>
                  <option value="Regulatory">Regulatory</option>
                  <option value="Customer Equipment">Customer Equipment</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Year Joined
                </label>
                <input 
                  name="since" 
                  type="text" 
                  placeholder="e.g. 2018" 
                  className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700" 
                  value={data.since} 
                  onChange={handleChange} 
                />
              </div>
              <div id="reports-to-container" className="relative">
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Reports to (Manager's Full Name)
                </label>
                <div className="relative">
                  <input 
                    name="reportsTo" 
                    type="text" 
                    placeholder={data.accountName ? "Select or type manager's name..." : "Select a company first..."}
                    className="w-full bg-white border border-slate-200 px-4 py-3 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-slate-700 disabled:bg-slate-50 disabled:cursor-not-allowed" 
                    value={data.reportsTo} 
                    onChange={(e) => {
                      setData({ ...data, reportsTo: e.target.value });
                      setDropdownOpen(true);
                    }} 
                    onFocus={() => {
                      if (data.accountName) setDropdownOpen(true);
                    }}
                    disabled={!data.accountName}
                    autoComplete="off"
                  />
                  {data.reportsTo && (
                    <button
                      type="button"
                      onClick={() => {
                        setData({ ...data, reportsTo: '' });
                        setDropdownOpen(true);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Clear selection"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {dropdownOpen && data.accountName && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
                    {/* List matching contacts */}
                    {filteredContactsForCompany
                      .filter(c => c.fullName.toLowerCase().includes((data.reportsTo || '').toLowerCase()))
                      .map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setData({ ...data, reportsTo: c.fullName });
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm flex items-center justify-between transition-colors"
                        >
                          <span className="font-semibold">{c.fullName}</span>
                          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{c.role || 'Contact'}</span>
                        </button>
                      ))}
                    
                    {/* Add new contact option */}
                    {data.reportsTo.trim() && !filteredContactsForCompany.some(c => c.fullName.toLowerCase() === data.reportsTo.trim().toLowerCase()) && (
                      <button
                        type="button"
                        onClick={() => {
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 text-emerald-700 font-bold text-sm border-t border-slate-100 flex items-center gap-2 transition-colors"
                      >
                        <span className="text-base font-black">+</span>
                        <span>Add "{data.reportsTo.trim()}" as a new contact</span>
                      </button>
                    )}

                    {filteredContactsForCompany.filter(c => c.fullName.toLowerCase().includes((data.reportsTo || '').toLowerCase())).length === 0 && !data.reportsTo.trim() && (
                      <div className="px-4 py-3 text-slate-400 text-xs font-semibold text-center leading-normal">
                        No contacts found under {data.accountName}.<br />Type a name to add them.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons at the bottom */}
          <div className="pt-8 border-t border-slate-100 flex justify-end gap-3 mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#3e864e] text-white font-bold rounded-xl shadow-sm hover:bg-[#347242] transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {editContact ? 'Update contact' : 'Save contact'}
            </button>
          </div>

        </div>
      </div>
    </form>
  );
};

export default ContactForm;

