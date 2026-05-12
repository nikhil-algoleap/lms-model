import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Building2, 
  LogOut,
  UserPlus,
  KeyRound,
  Columns,
  TrendingUp
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('lms_user') || '{"fullName": "User", "role": "Team Member"}');
  const isAdmin = user.role === 'Administrator';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Forecast', icon: TrendingUp, path: '/forecast' },
    { name: 'Pipeline', icon: Columns, path: '/pipeline' },
    { name: 'Leads', icon: Target, path: '/leads' },
    { name: 'Accounts', icon: Building2, path: '/accounts' },
    { name: 'Contacts', icon: Users, path: '/contacts' },
  ];

  // Role badge color mapping
  const roleBadgeColor = {
    'Administrator': 'bg-emerald-50 text-emerald-700',
    'Practice Leader': 'bg-purple-50 text-purple-700',
    'Client Manager': 'bg-blue-50 text-blue-700',
    'Team Member': 'bg-slate-100 text-slate-500',
  };

  return (
    <aside className="w-72 bg-white h-screen flex flex-col border-r border-slate-100">
      <div className="p-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#358b49] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/10">
           <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
           </svg>
        </div>
        <div>
          <h2 className="text-xl font-sans font-bold text-[#358b49] tracking-tight leading-none">algoleap</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 px-8 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${
                isActive 
                  ? 'bg-slate-100 text-[#122b1c]' 
                  : 'text-slate-400 hover:text-slate-900'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}

        {/* Administration Section — Only visible to Administrators */}
        {isAdmin && (
          <div className="pt-10 space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-5 mb-4">Administration</p>
            <NavLink
              to="/users-roles"
              className={({ isActive }) => 
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${
                  isActive ? 'bg-slate-100 text-[#122b1c]' : 'text-slate-400 hover:text-slate-900'
                }`
              }
            >
              <UserPlus size={20} />
              <span>Users & Roles</span>
            </NavLink>
            <NavLink
              to="/permissions"
              className={({ isActive }) => 
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm ${
                  isActive ? 'bg-slate-100 text-[#122b1c]' : 'text-slate-400 hover:text-slate-900'
                }`
              }
            >
              <KeyRound size={20} />
              <span>Permissions</span>
            </NavLink>
          </div>
        )}
      </nav>

      <div className="p-8">
         <div className="flex items-center gap-4 group cursor-pointer border-t border-slate-50 pt-8">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 font-black text-xs border border-slate-200">
                {user.fullName?.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-xs font-black text-slate-900 truncate">{user.fullName}</p>
                <span className={`text-[9px] font-black uppercase tracking-tight px-2 py-0.5 rounded-md ${roleBadgeColor[user.role] || 'bg-slate-100 text-slate-500'}`}>
                  {user.role}
                </span>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                <LogOut size={16} />
            </button>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;


