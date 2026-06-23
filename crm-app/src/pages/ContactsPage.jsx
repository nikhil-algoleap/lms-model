import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, User, Mail, Phone, MapPin, Edit2, Eye,
  Users, ChevronDown, Check, Trash2, GitBranch
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input, TextArea } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { CompanySelect } from '../components/ui/CompanySelect';
import { Pagination } from '../components/ui/Pagination';

// ── Reports To Dropdown ───────────────────────────────────────────────────────
function ReportsToSelect({ value, onChange, contactOptions }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { setQuery(value || ''); }, [value]);

  useEffect(() => {
    function outside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', outside);
    return () => document.removeEventListener('mousedown', outside);
  }, []);

  const filtered = contactOptions.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
    (c.jobTitle || '').toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (c) => {
    const fullName = `${c.firstName} ${c.lastName}`;
    setQuery(fullName);
    onChange(fullName);
    setOpen(false);
  };

  const isEmpty = contactOptions.length === 0;

  return (
    <div className="flex flex-col gap-1 w-full relative" ref={containerRef}>
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Reports To</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => !isEmpty && setOpen(true)}
          onKeyDown={e => {
            if (e.key === 'Escape') setOpen(false);
            if (e.key === 'Enter' && filtered.length > 0) { e.preventDefault(); handleSelect(filtered[0]); }
          }}
          placeholder={isEmpty ? 'Select a company first…' : 'Search contacts…'}
          disabled={isEmpty}
          className={`w-full bg-white border border-slate-300 rounded-lg px-3 py-2 pr-8 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${isEmpty ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
        />
        <button type="button" tabIndex={-1} disabled={isEmpty}
          onClick={() => { if (!isEmpty) { setOpen(o => !o); inputRef.current?.focus(); } }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
          <ChevronDown className={`w-4 h-4 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          <ul className="max-h-44 overflow-y-auto py-1">
            {filtered.length > 0 ? filtered.map(c => {
              const fullName = `${c.firstName} ${c.lastName}`;
              const isSelected = value === fullName;
              return (
                <li key={c.id}>
                  <button type="button" onClick={() => handleSelect(c)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-blue-50 transition-colors text-sm ${isSelected ? 'bg-blue-50/60' : ''}`}>
                    <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-xs flex-shrink-0">
                      {c.firstName[0]}{c.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{fullName}</p>
                      {c.jobTitle && <p className="text-xs text-slate-400 truncate">{c.jobTitle}</p>}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
                  </button>
                </li>
              );
            }) : (
              <li className="px-4 py-3 text-center text-xs text-slate-400">
                No contacts found for this company.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Section label for modal forms ─────────────────────────────────────────────
const SectionLabel = ({ label }) => (
  <div className="pt-2 pb-1 border-b border-slate-200 mb-3">
    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
export function ContactsPage() {
  const { contacts, accounts, addContact, updateContact, deleteContact } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const emptyForm = {
    firstName: '', lastName: '', company: '', reportsTo: '',
    email: '', phone: '', city: '', jobTitle: '', role: '', department: '', since: '', notes: ''
  };
  const [formData, setFormData] = useState(emptyForm);

  const reportsToOptions = formData.company
    ? contacts.filter(c => c.company === formData.company && `${c.firstName} ${c.lastName}` !== `${formData.firstName} ${formData.lastName}`)
    : contacts.filter(c => `${c.firstName} ${c.lastName}` !== `${formData.firstName} ${formData.lastName}`);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredContacts = contacts.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredContacts.length / pageSize);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      header: 'Name',
      accessor: 'firstName',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
            {row.firstName[0]}{row.lastName[0]}
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm leading-tight">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-slate-400">{row.jobTitle}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Company',
      accessor: 'company',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-700">{row.company}</span>
          {row.company && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate('/team', { state: { contactName: `${row.firstName} ${row.lastName}`, contactData: row } });
              }}
              title="View Org Chart"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:text-blue-700 transition-colors"
            >
              <GitBranch className="w-3 h-3" />
              Org Chart
            </button>
          )}
        </div>
      )
    },
    {
      header: 'Email',
      accessor: 'email',
      render: (row) => (
        <a href={`mailto:${row.email}`} className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600 transition-colors">
          <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {row.email}
        </a>
      )
    },
    { header: 'Phone', accessor: 'phone' },
    { header: 'City', accessor: 'city' },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            title="View Details"
            onClick={(e) => { e.stopPropagation(); setSelectedContact(row); setIsDetailOpen(true); }}
            className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            title="Edit Contact"
            onClick={(e) => { e.stopPropagation(); setFormData(row); setIsModalOpen(true); }}
            className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            title="Delete Contact"
            onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this contact?')) deleteContact(row.id); }}
            className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    let dataToSubmit = { ...formData };

    if (!dataToSubmit.id && !dataToSubmit.reportsTo && dataToSubmit.company) {
      const ceo = contacts.find(
        (c) => c.company === dataToSubmit.company && c.jobTitle && c.jobTitle.toLowerCase().includes('ceo')
      );
      if (ceo) dataToSubmit.reportsTo = `${ceo.firstName} ${ceo.lastName}`;
    }

    if (dataToSubmit.id) updateContact(dataToSubmit);
    else addContact(dataToSubmit);
    setIsModalOpen(false);
    setFormData(emptyForm);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Contacts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Keep track of your key relationships</p>
        </div>
        <Button icon={Plus} onClick={() => { setFormData(emptyForm); setIsModalOpen(true); }}>
          New Contact
        </Button>
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden p-0">
        {/* Toolbar */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search contacts…"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-white border border-slate-300 rounded-lg py-1.5 pl-9 pr-3 text-sm placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>
          <span className="text-xs text-slate-500 ml-auto">{filteredContacts.length} record{filteredContacts.length !== 1 ? 's' : ''}</span>
        </div>
        <Table columns={columns} data={paginatedContacts} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredContacts.length}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </Card>

      {/* New/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'Edit Contact' : 'New Contact'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <SectionLabel label="Basic Info" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
            <Input label="Last Name" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <CompanySelect
              label="Company"
              required
              value={formData.company}
              onChange={(val) => setFormData({ ...formData, company: val, reportsTo: '' })}
              options={accounts}
            />
            <Input label="Job Title" value={formData.jobTitle} onChange={e => setFormData({ ...formData, jobTitle: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ReportsToSelect
              value={formData.reportsTo}
              onChange={(val) => setFormData({ ...formData, reportsTo: val })}
              contactOptions={reportsToOptions}
            />
            <Input label="City" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
          </div>

          <SectionLabel label="Contact Info" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            <Input label="Phone" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          </div>

          <SectionLabel label="Org Chart Placement" />
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Role</label>
              <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500">
                <option value="">— None —</option>
                {['Executive', 'C-Suite', 'VP', 'Lead', 'Manager', 'IC'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Department</label>
              <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500">
                <option value="">— None —</option>
                {['Executive', 'Technology', 'Engineering', 'Product', 'Finance', 'Operations', 'Marketing', 'Sales'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <Input label="Year Joined" placeholder="e.g. 2023" value={formData.since} onChange={e => setFormData({ ...formData, since: e.target.value })} />
          </div>

          <TextArea label="Notes" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{formData.id ? 'Update' : 'Create'} Contact</Button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title="Contact Details">
        {selectedContact && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {selectedContact.firstName[0]}{selectedContact.lastName[0]}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedContact.firstName} {selectedContact.lastName}</h2>
                <p className="text-sm text-blue-600 font-medium">{selectedContact.jobTitle}</p>
                <p className="text-sm text-slate-500">{selectedContact.company}</p>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Mail, label: 'Email', value: selectedContact.email, color: 'text-blue-600' },
                { icon: Phone, label: 'Phone', value: selectedContact.phone, color: 'text-emerald-600' },
                { icon: MapPin, label: 'City', value: selectedContact.city, color: 'text-amber-600' },
                { icon: User, label: 'Company', value: selectedContact.company, color: 'text-purple-600' },
              ].map(({ icon: Icon, label, value, color }) => value ? (
                <div key={label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{value}</p>
                  </div>
                </div>
              ) : null)}

              {selectedContact.reportsTo && (
                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <Users className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-600" />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reports To</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{selectedContact.reportsTo}</p>
                  </div>
                </div>
              )}
            </div>

            {selectedContact.notes && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Notes</p>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedContact.notes}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                onClick={() => { setIsDetailOpen(false); navigate('/team', { state: { contactName: `${selectedContact.firstName} ${selectedContact.lastName}`, contactData: selectedContact } }); }}
              >
                <GitBranch className="w-3.5 h-3.5 mr-1.5" />
                View Org Chart
              </Button>
              <Button onClick={() => setIsDetailOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
