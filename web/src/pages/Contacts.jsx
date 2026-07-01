import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/ui/Modal';
import ContactForm from '../components/forms/ContactForm';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Building2, 
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

const Contacts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const highlightContactId = location.state?.highlightContactId;
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const counts = useMemo(() => {
    let decisionMakersCount = 0;
    let championsCount = 0;
    
    contacts.forEach(contact => {
      const r = (contact.role || '').toLowerCase();
      if (r.includes('decision') || r.includes('primary') || r.includes('executive') || r.includes('vp')) {
        decisionMakersCount++;
      }
      if (r.includes('champion') || r.includes('influencer')) {
        championsCount++;
      }
    });

    return {
      all: contacts.length,
      decisionMakers: decisionMakersCount,
      champions: championsCount
    };
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    let result = contacts;
    
    if (activeFilter === 'decisionMakers') {
      result = result.filter(contact => {
        const r = (contact.role || '').toLowerCase();
        return r.includes('decision') || r.includes('primary') || r.includes('executive') || r.includes('vp');
      });
    } else if (activeFilter === 'champions') {
      result = result.filter(contact => {
        const r = (contact.role || '').toLowerCase();
        return r.includes('champion') || r.includes('influencer');
      });
    }

    if (searchQuery) {
      result = result.filter(contact => 
        contact.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.account?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [contacts, activeFilter, searchQuery]);

  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="page-title">Contacts</h1>
          <p className="body-text text-[#6B7280] mt-1">
            Manage your network of decision makers and champions.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
             onClick={() => setIsModalOpen(true)}
             className="btn-primary flex items-center gap-2"
          >
             <Plus size={16} />
             <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="enterprise-card p-4 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
        <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
          {[
            { id: 'all', label: `All (${counts.all})` },
            { id: 'decisionMakers', label: `Decision Makers (${counts.decisionMakers})` },
            { id: 'champions', label: `Champions (${counts.champions})` }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors border ${
                activeFilter === filter.id 
                  ? 'bg-[#166534] text-white border-[#166534]' 
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-all"
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="enterprise-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
             <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                   <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Contact</th>
                   <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Company</th>
                   <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Role</th>
                   <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Deals</th>
                   <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider text-right">Last Interaction</th>
                   <th className="px-6 py-4"></th>
                </tr>
             </thead>
             <tbody className="divide-y divide-[#E5E7EB]">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-[#64748B] text-[14px]">Loading contacts...</td>
                  </tr>
                ) : filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-[#64748B] text-[14px]">No contacts found matching criteria.</td>
                  </tr>
                ) : (
                  filteredContacts.map((contact) => (
                    <tr 
                      key={contact.id} 
                      onClick={() => { setEditingContact(contact); setIsModalOpen(true); }}
                      className={`hover:bg-[#F8FAFC]/60 transition-colors cursor-pointer group ${highlightContactId === contact.id ? 'bg-[#10B981]/5 border-l-2 border-[#10B981]' : ''}`}
                    >
                      
                      {/* Name & Contact Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#166534] text-white rounded-full flex items-center justify-center text-[14px] font-bold shadow-sm">
                             {contact.fullName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold text-[#111827] group-hover:text-[#166534] transition-colors leading-snug">
                              {contact.fullName}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-[12px] font-medium text-[#64748B] flex items-center gap-1">
                                  <Mail size={12} className="text-[#94A3B8]" /> {contact.email || 'No email'}
                               </span>
                               {contact.phone && (
                                 <span className="text-[12px] font-medium text-[#64748B] flex items-center gap-1">
                                    <Phone size={12} className="text-[#94A3B8]" /> {contact.phone}
                                 </span>
                               )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Company & Title */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                           <span className="text-[13px] font-semibold text-[#111827] flex items-center gap-1.5">
                             <Building2 size={14} className="text-[#64748B]" />
                             {contact.account?.name || 'No Company'}
                           </span>
                           <span className="text-[12px] text-[#64748B] ml-5">{contact.title || contact.department || 'No Title'}</span>
                        </div>
                      </td>

                      {/* Role Chip */}
                      <td className="px-6 py-4">
                        {contact.role ? (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                            contact.role.toLowerCase().includes('decision') || 
                            contact.role.toLowerCase().includes('primary') || 
                            contact.role.toLowerCase().includes('executive') || 
                            contact.role.toLowerCase().includes('vp')
                              ? 'bg-[#10B981]/10 text-[#10B981]' :
                            contact.role.toLowerCase().includes('champion') || 
                            contact.role.toLowerCase().includes('influencer')
                              ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                              'bg-[#3B82F6]/10 text-[#3B82F6]'
                          }`}>
                            {contact.role}
                          </span>
                        ) : <span className="text-[#94A3B8]">-</span>}
                      </td>

                      {/* Deals */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {contact.stakeholderIn && contact.stakeholderIn.length > 0 ? (
                            contact.stakeholderIn.map((sh) => (
                              sh.deal && (
                                <Link
                                  key={sh.deal.id}
                                  to={`/deals/${sh.deal.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[11px] font-semibold text-[#166534] bg-[#F0FDF4] border border-[#DCFCE7] hover:bg-[#DCFCE7] transition-colors px-2 py-0.5 rounded-[4px] w-fit inline-flex items-center truncate max-w-[150px]"
                                >
                                  {sh.deal.title}
                                </Link>
                              )
                            ))
                          ) : (
                            <span className="text-[12px] text-[#94A3B8]">No active deals</span>
                          )}
                        </div>
                      </td>

                      {/* Last Interaction */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-[13px] text-[#64748B]">
                           <Clock size={14} className="text-[#94A3B8]" />
                           {getRelativeTime(contact.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#94A3B8] hover:text-[#111827] p-1.5 rounded-md hover:bg-[#E2E8F0] transition-colors opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); setEditingContact(contact); setIsModalOpen(true); }}>
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
             </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
          <span className="text-[13px] text-[#64748B]">Showing <span className="font-semibold text-[#111827]">{filteredContacts.length}</span> results</span>
          <div className="flex gap-2">
            <button className="p-1.5 rounded-md text-[#94A3B8] border border-[#E2E8F0] bg-white cursor-not-allowed"><ChevronLeft size={16} /></button>
            <button className="p-1.5 rounded-md text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9]"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingContact(null); }}
        hideHeader={true}
      >
        <ContactForm
          editContact={editingContact}
          onSuccess={() => { setIsModalOpen(false); setEditingContact(null); fetchContacts(); }}
          onClose={() => { setIsModalOpen(false); setEditingContact(null); }}
        />
      </Modal>
    </div>
  );
};

export default Contacts;
