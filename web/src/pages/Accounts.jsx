import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import Modal from '../components/ui/Modal';
import AccountForm from '../components/forms/AccountForm';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Plus, 
  Search,
  ChevronRight,
  Filter,
  Users,
  DollarSign,
  Landmark
} from 'lucide-react';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAccounts = async () => {
    try {
      const res = await api.get('/accounts');
      setAccounts(res.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(acc => 
    acc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.industry?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 lg:p-12 space-y-10 max-w-[1700px] mx-auto animate-in fade-in duration-700">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                 <Building2 size={18} />
              </div>
              <h1 className="text-4xl font-serif text-slate-900 tracking-tight">Strategic Accounts</h1>
           </div>
           <p className="text-slate-400 font-medium tracking-tight">Managing <span className="text-slate-900 font-bold">{accounts.length}</span> institutional entities and global relationships.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search accounts..." 
                className="outline-none text-xs font-bold w-48" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-[#122b1c] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-900/10 hover:shadow-xl transition-all"
           >
              <Plus size={16} />
              <span>Add Account</span>
           </button>
        </div>
      </div>

      {/* Account Directory Grid */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
         <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Portfolio Matrix</h3>
            <button className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-xl">
               <Filter size={14} /> Advanced Filter
            </button>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/10">
                     <th className="px-8 py-5">Account & Address</th>
                     <th className="px-8 py-5">Industry / Type</th>
                     <th className="px-8 py-5">Corporate Scale</th>
                     <th className="px-8 py-5">Ownership</th>
                     <th className="px-8 py-5">Status</th>
                     <th className="px-8 py-5">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filteredAccounts.map((account) => (
                     <tr key={account.id} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                        <td className="px-8 py-7">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-slate-900/10 group-hover:scale-110 transition-transform">
                                 {account.name?.charAt(0)}
                              </div>
                              <div>
                                 <Link to={`/accounts/${account.id}`} className="font-bold text-slate-900 tracking-tight leading-tight mb-1 hover:text-emerald-700 hover:underline block">{account.name}</Link>
                                 <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                    <MapPin size={10} /> {account.address || account.region || 'Global HQ'}
                                 </p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-7">
                           <div className="flex flex-col gap-1.5">
                              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider w-fit border border-emerald-100/50">
                                 {account.industry || 'Technology'}
                              </span>
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest pl-1">{account.region}</span>
                           </div>
                        </td>
                        <td className="px-8 py-7">
                           <div className="space-y-2">
                              <div className="flex items-center gap-2 text-slate-900 font-serif text-lg">
                                 <DollarSign size={16} className="text-slate-300" />
                                 {account.annualRevenue || account.ltv || 'TBD'}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                 <Users size={12} /> {account.employeesCount?.toLocaleString() || '0'} Employees
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-7">
                           <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                              <Landmark size={14} className="text-slate-300" />
                              {account.ownership || 'Private'}
                           </div>
                        </td>
                        <td className="px-8 py-7">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                             account.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                             account.status === 'Prospect' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                             'bg-slate-100 text-slate-400 border-slate-200'
                           }`}>
                              {account.status || 'Active'}
                           </span>
                        </td>
                        <td className="px-8 py-7">
                           <button className="p-3 text-slate-300 hover:text-slate-900 hover:bg-white rounded-xl transition-all shadow-sm">
                              <ChevronRight size={20} />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        hideHeader={true}
      >
        <AccountForm 
          onSuccess={() => { setIsModalOpen(false); fetchAccounts(); }} 
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Accounts;
