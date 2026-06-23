import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Plus, Edit2, Building2, Globe, ExternalLink, Loader2, X, Mail, Phone, MapPin, Calendar, Star, ChevronDown } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Table } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input, TextArea } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Pagination } from '../components/ui/Pagination';

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

function simulateLinkedInFetch(linkedinUrl, companyName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const match = linkedinUrl.match(/linkedin\.com\/company\/([^/?#]+)/i);
      const extracted = match ? match[1].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : null;
      const name = companyName || extracted || 'This company';
      resolve(`${name} is a leading company committed to delivering exceptional value to its clients and partners. With a strong focus on innovation, quality, and customer success, ${name} has established itself as a trusted name in its industry.`);
    }, 1500);
  });
}

const SectionLabel = ({ label }) => (
  <div className="pt-2 pb-1 border-b border-slate-200 mb-3">
    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
  </div>
);

const emptyForm = {
  name: '', industry: '', location: '', size: '', contact: '', status: 'Active',
  linkedin: '', twitter: '', instagram: '', description: '',
  contactEmail: '', contactPhone: '', website: '',
  foundedYear: '', specialties: '',
  address: ''
};

export function AccountsPage() {
  const { accounts, addAccount, updateAccount } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [linkedinLoading, setLinkedinLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const set = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredAccounts = accounts.filter(acc =>
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAccounts.length / pageSize);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleLinkedInBlur = async (url) => {
    if (!url || !url.includes('linkedin.com/company/')) return;
    setLinkedinLoading(true);
    const desc = await simulateLinkedInFetch(url, formData.name);
    setFormData(prev => ({ ...prev, description: desc }));
    setLinkedinLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) updateAccount(formData);
    else addAccount(formData);
    setIsModalOpen(false);
    setFormData(emptyForm);
  };

  const handleEdit = (row) => {
    setFormData({ ...emptyForm, ...row });
    setIsModalOpen(true);
  };

  const columns = [
    {
      header: 'Company Name', accessor: 'name',
      render: (row) => (
        <Link to={`/accounts/${row.id}`} className="flex items-center gap-2.5 group" onClick={(e) => e.stopPropagation()}>
          <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 flex-shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-blue-600 group-hover:underline text-sm">{row.name}</span>
        </Link>
      )
    },
    { header: 'Industry', accessor: 'industry' },
    { header: 'Location', accessor: 'location' },
    { header: 'Company Size', accessor: 'size' },
    { header: 'Contact', accessor: 'contact' },
    {
      header: 'Status', accessor: 'status',
      render: (row) => <Badge>{row.status}</Badge>
    },
    {
      header: 'Actions',
      render: (row) => (
        <Button variant="ghost" size="sm" className="px-2 py-1" title="Edit Account"
          onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>
          <Edit2 className="w-3.5 h-3.5 mr-1" />
          Edit
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Accounts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your company partners and clients</p>
        </div>
        <Button icon={Plus} onClick={() => { setFormData(emptyForm); setIsModalOpen(true); }}>
          New Account
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
              placeholder="Search accounts…"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-white border border-slate-300 rounded-lg py-1.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
          </div>
          <span className="text-xs text-slate-500 ml-auto">{filteredAccounts.length} record{filteredAccounts.length !== 1 ? 's' : ''}</span>
        </div>
        <Table columns={columns} data={paginatedAccounts} className="" />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredAccounts.length}
          pageSize={pageSize}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </Card>

      {/* New / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.id ? 'Edit Account' : 'New Account'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <SectionLabel label="Basic Info" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company Name" required value={formData.name} onChange={set('name')} />
            <Input label="Industry" required value={formData.industry} onChange={set('industry')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Company Size" value={formData.size} onChange={set('size')} placeholder="e.g. 1,000–5,000" />
            <div className="flex flex-col gap-1 w-full">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Status</label>
              <select
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                value={formData.status} onChange={set('status')}>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Founded Year" value={formData.foundedYear} onChange={set('foundedYear')} placeholder="e.g. 2001" />
            <Input label="Website" value={formData.website} onChange={set('website')} placeholder="https://example.com" />
          </div>

          <SectionLabel label="Description" />
          <TextArea label="About the Company" value={formData.description} onChange={set('description')}
            placeholder="Brief description of the company..." />

          <SectionLabel label="Specialties" />
          <Input label="Specialties" value={formData.specialties} onChange={set('specialties')}
            placeholder="e.g. Cloud Computing, AI, DevOps (comma-separated)" />

          <SectionLabel label="Contact Info" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Primary Contact Name" value={formData.contact} onChange={set('contact')} />
            <Input label="Contact Email" type="email" value={formData.contactEmail} onChange={set('contactEmail')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Contact Phone" value={formData.contactPhone} onChange={set('contactPhone')} placeholder="+1 (555) 000-0000" />
            <Input label="Location" value={formData.location} onChange={set('location')} placeholder="City, State" />
          </div>

          <SectionLabel label="Address" />
          <Input label="Full Address" value={formData.address} onChange={set('address')}
            placeholder="Street, City, State, ZIP, Country" />

          <SectionLabel label="Social Media" />
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[#0A66C2]"><LinkedInIcon /></span>
                <div className="flex-1">
                  <Input label="LinkedIn URL" placeholder="https://linkedin.com/company/..."
                    value={formData.linkedin || ''} onChange={set('linkedin')}
                    onBlur={(e) => handleLinkedInBlur(e.target.value)} />
                </div>
              </div>
              {linkedinLoading && (
                <div className="flex items-center gap-2 text-blue-600 text-xs mt-1.5 ml-6">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Extracting company info from LinkedIn…</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-800"><TwitterIcon /></span>
              <div className="flex-1">
                <Input label="X (Twitter) URL" placeholder="https://twitter.com/..."
                  value={formData.twitter || ''} onChange={set('twitter')} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#E1306C]"><InstagramIcon /></span>
              <div className="flex-1">
                <Input label="Instagram URL" placeholder="https://instagram.com/..."
                  value={formData.instagram || ''} onChange={set('instagram')} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{formData.id ? 'Update' : 'Create'} Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
