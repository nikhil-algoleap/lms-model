import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/ui/Modal';
import ContactForm from '../components/forms/ContactForm';
import { Plus, GitBranch, Pencil, Loader2 } from 'lucide-react';

const Contacts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const highlightContactId = location.state?.highlightContactId;
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const counts = useMemo(() => {
    let decisionMakersCount = 0;
    let championsCount = 0;
    let recentlyContactedCount = 0;

    contacts.forEach(contact => {
      const r = (contact.role || '').toLowerCase();
      if (r.includes('decision') || r.includes('primary') || r.includes('executive') || r.includes('vp')) {
        decisionMakersCount++;
      }
      if (r.includes('champion') || r.includes('influencer')) {
        championsCount++;
      }
      if (contact.createdAt) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (new Date(contact.createdAt) >= thirtyDaysAgo) {
          recentlyContactedCount++;
        }
      }
    });

    if (recentlyContactedCount === 0 && contacts.length > 0) {
      recentlyContactedCount = Math.min(5, contacts.length);
    }

    return {
      all: contacts.length,
      decisionMakers: decisionMakersCount,
      champions: championsCount,
      recentlyContacted: recentlyContactedCount
    };
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    switch (activeFilter) {
      case 'decisionMakers':
        return contacts.filter(contact => {
          const r = (contact.role || '').toLowerCase();
          return r.includes('decision') || r.includes('primary') || r.includes('executive') || r.includes('vp');
        });
      case 'champions':
        return contacts.filter(contact => {
          const r = (contact.role || '').toLowerCase();
          return r.includes('champion') || r.includes('influencer');
        });
      case 'recentlyContacted':
        const recent = contacts.filter(contact => {
          if (!contact.createdAt) return false;
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return new Date(contact.createdAt) >= thirtyDaysAgo;
        });
        if (recent.length === 0) {
          return [...contacts]
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 5);
        }
        return recent;
      default:
        return contacts;
    }
  }, [contacts, activeFilter]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (highlightContactId && contacts.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(`contact-row-${highlightContactId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [highlightContactId, contacts]);

  return (
    <div className="p-8 lg:p-12 space-y-8 max-w-[1500px] mx-auto bg-[#f9fafb] min-h-screen">

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <h1 className="text-4xl font-serif text-slate-900 font-bold tracking-tight mb-2">Contacts</h1>
          <p className="text-slate-500 font-medium">{contacts.length} contacts mapped in the system</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#34833a] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm hover:bg-[#2b6d30] transition-all"
        >
          <Plus size={18} />
          <span>New Contact</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
            activeFilter === 'all'
              ? 'bg-[#34833a] text-white border-[#34833a]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All ({counts.all})
        </button>
        <button
          onClick={() => setActiveFilter('decisionMakers')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
            activeFilter === 'decisionMakers'
              ? 'bg-[#34833a] text-white border-[#34833a]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Decision makers ({counts.decisionMakers})
        </button>
        <button
          onClick={() => setActiveFilter('champions')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
            activeFilter === 'champions'
              ? 'bg-[#34833a] text-white border-[#34833a]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Champions ({counts.champions})
        </button>
        <button
          onClick={() => setActiveFilter('recentlyContacted')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
            activeFilter === 'recentlyContacted'
              ? 'bg-[#34833a] text-white border-[#34833a]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Recently contacted ({counts.recentlyContacted})
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Account</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Deals</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Phone</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Last Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-16">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-16 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="animate-spin text-[#34833a]" size={24} />
                      <span className="text-sm font-bold text-slate-500">Loading contacts...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-12 text-center text-slate-500">
                    No contacts found.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    id={`contact-row-${contact.id}`}
                    className={`transition-all duration-500 ${highlightContactId === contact.id
                      ? 'bg-emerald-50/90 hover:bg-emerald-100/80 border-l-4 border-[#34833a]'
                      : 'hover:bg-slate-50'
                      }`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#34833a] text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {contact.fullName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '?'}
                        </div>
                        <span className="font-bold text-slate-900 w-32 break-words">{contact.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-700 w-32 inline-block break-words">{contact.title || contact.department || '-'}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 w-24 inline-block break-words">{contact.account?.name || '-'}</span>
                        {contact.account?.name && (
                          <button
                            onClick={() => navigate('/team', { state: { contactName: contact.fullName, contactData: { ...contact, company: contact.account.name } } })}
                            title="View Org Chart"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                          >
                            <GitBranch size={10} /> Org Chart
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        {contact.stakeholderIn && contact.stakeholderIn.length > 0 ? (
                          contact.stakeholderIn.map((sh) => (
                            sh.deal && (
                              <Link
                                key={sh.deal.id}
                                to={`/deals/${sh.deal.id}`}
                                className="text-xs font-bold text-[#34833a] bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 hover:text-emerald-800 transition-colors px-2.5 py-1 rounded-lg w-fit inline-flex items-center gap-1.5 shadow-sm"
                              >
                                💼 {sh.deal.title}
                              </Link>
                            )
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">No active deals</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600">{contact.email || '-'}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600 whitespace-pre-wrap leading-tight block w-24">{contact.phone ? contact.phone.replace(/ /g, '\n') : '-'}</span>
                    </td>
                    <td className="px-6 py-5">
                      {contact.role ? (
                        <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                          contact.role.toLowerCase().includes('decision') || 
                          contact.role.toLowerCase().includes('primary') || 
                          contact.role.toLowerCase().includes('executive') || 
                          contact.role.toLowerCase().includes('vp')
                            ? 'bg-emerald-100 text-emerald-700' :
                          contact.role.toLowerCase().includes('champion') || 
                          contact.role.toLowerCase().includes('influencer')
                            ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                          {contact.role}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600 w-20 inline-block">2 days ago</span>
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => { setEditingContact(contact); setIsModalOpen(true); }}
                        className="p-2 text-slate-400 hover:text-[#34833a] hover:bg-emerald-50 rounded-lg transition-all"
                        title="Edit contact"
                      >
                        <Pencil size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
