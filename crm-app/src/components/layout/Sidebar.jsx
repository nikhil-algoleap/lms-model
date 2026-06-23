import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Building2,
  Users,
  Settings,
  LogOut,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar({ isCollapsed, onToggle }) {
  const navItems = [
    { name: 'Accounts', path: '/', icon: Briefcase, end: true },
    { name: 'Contacts', path: '/contacts', icon: Users, end: false },
  ];

  return (
    <div className={clsx(
      "fixed top-0 bottom-0 bg-white border-r border-slate-200 flex flex-col z-50 transition-all duration-300 shadow-sm",
      isCollapsed ? "w-[60px]" : "w-[220px]"
    )}>

      {/* Logo */}
      <div className={clsx(
        "flex items-center border-b border-slate-200 h-[56px] flex-shrink-0",
        isCollapsed ? "justify-center px-0" : "gap-2.5 px-4"
      )}>
        <div className="w-7 h-7 min-w-[1.75rem] bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
          <Building2 className="text-white w-4 h-4" />
        </div>
        {!isCollapsed && (
          <span className="text-sm font-bold text-slate-800 whitespace-nowrap overflow-hidden tracking-tight">
            CRM Core
          </span>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[68px] bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-full p-1 z-50 transition-colors shadow-sm"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Nav section label */}
      {!isCollapsed && (
        <div className="px-4 pt-5 pb-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</p>
        </div>
      )}
      {isCollapsed && <div className="pt-4" />}

      {/* Nav items */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) => clsx(
              "flex items-center rounded-lg transition-all duration-150 group whitespace-nowrap",
              isCollapsed ? "justify-center p-2.5 mx-auto" : "gap-3 px-3 py-2",
              isActive
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
            )}
          >
            <item.icon className={clsx("w-4 h-4 shrink-0", isCollapsed ? "" : "text-current")} />
            {!isCollapsed && <span className="text-sm">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className={clsx(
        "border-t border-slate-200 py-3 px-2 space-y-0.5",
      )}>
        <button
          title={isCollapsed ? "Settings" : undefined}
          className={clsx(
            "flex items-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors w-full group",
            isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
        </button>
        <button
          title={isCollapsed ? "Logout" : undefined}
          className={clsx(
            "flex items-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors w-full",
            isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}
