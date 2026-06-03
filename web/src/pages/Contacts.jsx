import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/ui/Modal';
import ContactForm from '../components/forms/ContactForm';
import { Plus, GitBranch } from 'lucide-react';

const Contacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="p-8 lg:p-12 space-y-8 max-w-[1500px] mx-auto bg-[#f9fafb] min-h-screen">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
           <h1 className="text-4xl font-serif text-slate-900 font-bold tracking-tight mb-2">Contacts</h1>
           <p className="text-slate-500 font-medium">142 contacts across 28 accounts</p>
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
        <button className="px-4 py-1.5 rounded-full bg-[#34833a] text-white text-sm font-medium border border-[#34833a]">All (142)</button>
        <button className="px-4 py-1.5 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50">Decision makers (38)</button>
        <button className="px-4 py-1.5 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50">Champions (22)</button>
        <button className="px-4 py-1.5 rounded-full bg-white text-slate-600 text-sm font-medium border border-slate-200 hover:bg-slate-50">Recently contacted (14)</button>
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
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32">Phone</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24">Last Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#34833a] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {contact.fullName?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || '?'}
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
                    <span className="text-sm text-slate-600">{contact.email || '-'}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-slate-600 whitespace-pre-wrap leading-tight block w-24">{contact.phone ? contact.phone.replace(/ /g, '\n') : '-'}</span>
                  </td>
                  <td className="px-6 py-5">
                    {contact.role ? (
                       <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                          contact.role.toLowerCase().includes('decision') || contact.role.toLowerCase().includes('primary') ? 'bg-emerald-100 text-emerald-700' :
                          contact.role.toLowerCase().includes('influencer') ? 'bg-amber-100 text-amber-700' :
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
                    <span className="text-sm text-slate-600">{contact.ownerInitials || ''}</span>
                  </td>
                </tr>
              ))}
              
              {/* If no contacts, show empty state */}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        hideHeader={true}
      >
        <ContactForm 
          onSuccess={() => { setIsModalOpen(false); fetchContacts(); }} 
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Contacts;
