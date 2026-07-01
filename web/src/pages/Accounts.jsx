import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/ui/Modal';
import AccountForm from '../components/forms/AccountForm';
import { 
  Building2, 
  MapPin, 
  Plus, 
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  DollarSign,
  Activity,
  User as UserIcon,
  Laptop,
  Heart,
  Globe,
  Briefcase
} from 'lucide-react';

const Accounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/accounts');
      setAccounts(res.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(acc => 
    acc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-[#10B981] bg-[#10B981]/10';
    if (score >= 60) return 'text-[#F59E0B] bg-[#F59E0B]/10';
    return 'text-[#EF4444] bg-[#EF4444]/10';
  };

  const getIndustryIcon = (industry) => {
    switch (industry?.toLowerCase()) {
      case 'technology': return <Laptop size={14} className="text-[#64748B]" />;
      case 'healthcare': return <Heart size={14} className="text-[#64748B]" />;
      case 'finance': return <Globe size={14} className="text-[#64748B]" />;
      default: return <Briefcase size={14} className="text-[#64748B]" />;
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="page-title">Accounts</h1>
          <p className="body-text text-[#6B7280] mt-1">
            Directory of institutional entities and client companies.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#166534] focus:ring-1 focus:ring-[#166534] transition-all"
            />
          </div>
          <button 
             onClick={() => setIsModalOpen(true)}
             className="btn-primary flex items-center gap-2"
          >
             <Plus size={16} />
             <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Account Directory Table */}
      <div className="enterprise-card overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
             <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                   <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Company</th>
                   <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Industry</th>
                   <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Revenue</th>
                   <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Owner</th>
                   <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider text-center">Health</th>
                   <th className="px-6 py-4 text-[12px] font-semibold text-[#64748B] uppercase tracking-wider text-right">Last Activity</th>
                   <th className="px-6 py-4"></th>
                </tr>
             </thead>
             <tbody className="divide-y divide-[#E5E7EB]">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-[#64748B] text-[14px]">Loading accounts...</td>
                  </tr>
                ) : filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-[#64748B] text-[14px]">No accounts found.</td>
                  </tr>
                ) : (
                  filteredAccounts.map((account) => (
                    <tr key={account.id} onClick={() => navigate(`/accounts/${account.id}`)} className="hover:bg-[#F8FAFC]/60 transition-colors cursor-pointer group">
                      
                      {/* Company Logo & Name */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white border border-[#E2E8F0] rounded-[8px] flex items-center justify-center text-[16px] font-bold text-[#111827] shadow-sm">
                             {account.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold text-[#111827] group-hover:text-[#166534] transition-colors leading-snug">
                              {account.name}
                            </p>
                            <p className="text-[12px] font-medium text-[#64748B] flex items-center gap-1 mt-0.5">
                              <MapPin size={12} /> {account.region || 'Global'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Industry */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           {getIndustryIcon(account.industry)}
                           <span className="text-[13px] font-medium text-[#111827]">
                             {account.industry || 'Technology'}
                           </span>
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-[13px] font-medium text-[#111827]">
                          <DollarSign size={14} className="text-[#94A3B8]" />
                          {account.annualRevenue || account.ltv || '0'}
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-[#F1F5F9] text-[#475569] rounded-full flex items-center justify-center text-[10px] font-bold border border-[#E2E8F0]">
                             {(account.owner || 'A').charAt(0)}
                          </div>
                          <span className="text-[13px] font-medium text-[#475569]">{account.owner || 'Unassigned'}</span>
                        </div>
                      </td>

                      {/* Health Score */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-1 rounded-[6px] text-[11px] font-bold tracking-wide ${getHealthScoreColor(account.healthScore || 85)}`}>
                          {account.healthScore || 85}/100
                        </span>
                      </td>

                      {/* Last Activity */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-[13px] text-[#64748B]">
                           <Activity size={14} className="text-[#94A3B8]" />
                           2 days ago
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button className="text-[#94A3B8] hover:text-[#111827] p-1.5 rounded-md hover:bg-[#E2E8F0] transition-colors opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); }}>
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
          <span className="text-[13px] text-[#64748B]">Showing <span className="font-semibold text-[#111827]">{filteredAccounts.length}</span> results</span>
          <div className="flex gap-2">
            <button className="p-1.5 rounded-md text-[#94A3B8] border border-[#E2E8F0] bg-white cursor-not-allowed"><ChevronLeft size={16} /></button>
            <button className="p-1.5 rounded-md text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9]"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} hideHeader={true}>
        <AccountForm onSuccess={() => { setIsModalOpen(false); fetchAccounts(); }} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Accounts;
