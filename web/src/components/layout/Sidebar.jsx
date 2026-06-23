import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Target,
  Building2,
  LogOut,
  UserPlus,
  KeyRound,
  Columns,
  TrendingUp,
  GitBranch,
  BookOpen
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('lms_user') || '{"fullName": "User", "role": "Team Member"}');
  const isAdmin = user.role === 'Administrator';



  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Leads', icon: Target, path: '/leads' },
    { name: 'Accounts', icon: Building2, path: '/accounts' },
    { name: 'Contacts', icon: Users, path: '/contacts' },
    { name: 'Pipeline', icon: GitBranch, path: '/pipeline' },
    { name: 'Forecast', icon: TrendingUp, path: '/forecast' },
  ];

  // Role badge color mapping
  const roleBadgeColor = {
    'Administrator': 'bg-emerald-50 text-emerald-700',
    'Practice Leader': 'bg-purple-50 text-purple-700',
    'Client Manager': 'bg-blue-50 text-blue-700',
    'Team Member': 'bg-slate-100 text-slate-500',
  };

  return (
    <aside className="w-64 bg-[#0d2618] h-screen flex flex-col flex-shrink-0 fixed top-0 left-0 z-50">
      {/* Brand Header */}
      <div className="px-6 py-5 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#378b47] rounded-md flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-serif font-bold text-white tracking-tight leading-none">algoleap</h2>
          <p className="text-[10px] font-semibold text-[#8da396] uppercase tracking-wider mt-0.5">LMS V1.0</p>
        </div>
      </div>

      {/* Navigation — scrollable to prevent overflow */}
      <nav className="flex-1 px-4 py-2">
        <p className="text-[10px] font-semibold text-[#6a8274] uppercase tracking-widest px-3 mb-2 mt-2">Workspace</p>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${isActive
                  ? 'bg-[#378b47] text-white'
                  : 'text-[#cbd9d0] hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon size={18} className="opacity-80" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Administration Section — Only visible to Administrators */}
        {isAdmin && (
          <div className="mt-6">
            <p className="text-[10px] font-semibold text-[#6a8274] uppercase tracking-widest px-3 mb-2">Administration</p>
            <div className="space-y-1">
              <NavLink
                to="/users-roles"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${isActive ? 'bg-[#378b47] text-white' : 'text-[#cbd9d0] hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <UserPlus size={18} className="opacity-80" />
                <span>Users & Roles</span>
              </NavLink>
              <NavLink
                to="/permissions"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm ${isActive ? 'bg-[#378b47] text-white' : 'text-[#cbd9d0] hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <KeyRound size={18} className="opacity-80" />
                <span>Permissions</span>
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      {/* User Profile Footer */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 bg-[#378b47] rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user.fullName?.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
            <p className="text-[11px] text-[#8da396]">{user.role}</p>
          </div>
          <button onClick={handleLogout} className="p-1.5 text-[#6a8274] hover:text-red-400 transition-colors" title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


