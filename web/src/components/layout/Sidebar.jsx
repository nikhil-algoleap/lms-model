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
  TrendingUp,
  GitBranch,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
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

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-60'} bg-[#0F172A] border-r border-[#1E293B] h-screen flex flex-col flex-shrink-0 fixed top-0 left-0 z-50 transition-all duration-300`}>
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        className="absolute -right-3 top-6 bg-[#1E293B] border border-[#334155] rounded-full p-1 text-white hover:bg-[#334155] z-50 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand Header */}
      <div className={`px-5 py-6 flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
        <div className="w-8 h-8 bg-[#166534] rounded-[8px] flex items-center justify-center shadow-sm flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4" />
            <line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-[16px] font-bold text-white tracking-tight leading-none truncate">Algoleap</h2>
            <p className="text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider mt-1 truncate">CRM Platform</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden">
        {!isCollapsed ? (
          <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-widest px-3 mb-3 mt-2">Workspace</p>
        ) : (
          <div className="h-6 mb-3 mt-2"></div>
        )}
        <div className="space-y-0.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={isCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-[8px] transition-colors duration-150 text-[14px] font-medium ${
                  isActive
                    ? 'bg-[#166534]/20 text-[#22C55E]'
                    : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
                } ${isCollapsed ? 'justify-center' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Administration Section */}
        {isAdmin && (
          <div className="mt-8">
            {!isCollapsed ? (
              <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-widest px-3 mb-3">Administration</p>
            ) : (
              <div className="h-4 mb-3 border-t border-[#1E293B] mx-2"></div>
            )}
            <div className="space-y-0.5">
              <NavLink
                to="/users-roles"
                title={isCollapsed ? 'Users & Roles' : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-[8px] transition-colors duration-150 text-[14px] font-medium ${
                    isActive ? 'bg-[#166534]/20 text-[#22C55E]' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <UserPlus size={16} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                    {!isCollapsed && <span>Users & Roles</span>}
                  </>
                )}
              </NavLink>
              <NavLink
                to="/permissions"
                title={isCollapsed ? 'Permissions' : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-[8px] transition-colors duration-150 text-[14px] font-medium ${
                    isActive ? 'bg-[#166534]/20 text-[#22C55E]' : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-[#F8FAFC]'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    <KeyRound size={16} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                    {!isCollapsed && <span>Permissions</span>}
                  </>
                )}
              </NavLink>
            </div>
          </div>
        )}
      </nav>

      {/* User Profile Footer */}
      <div className={`px-4 py-4 border-t border-[#1E293B] ${isCollapsed ? 'flex justify-center px-2' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} cursor-pointer group w-full`}>
          <div className="w-8 h-8 bg-[#1E293B] group-hover:bg-[#334155] transition-colors rounded-full flex items-center justify-center text-white font-semibold text-sm border border-[#334155] flex-shrink-0">
            {user.fullName?.charAt(0) || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-[13px] font-medium text-white truncate">{user.fullName}</p>
              <p className="text-[11px] text-[#94A3B8] truncate">{user.role}</p>
            </div>
          )}
          {!isCollapsed && (
            <button onClick={handleLogout} className="p-1.5 text-[#64748B] hover:text-[#EF4444] transition-colors rounded-md hover:bg-[#1E293B]" title="Sign out">
              <LogOut size={14} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;


