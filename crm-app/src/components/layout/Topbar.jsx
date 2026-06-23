import React, { useState } from 'react';
import { Bell, Building2, Settings, LogOut, Search, Database } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { FirebaseSetupModal } from '../ui/FirebaseSetupModal';

export function Topbar() {
  const { isFirebaseConfigured } = useData();
  const [setupOpen, setSetupOpen] = useState(false);

  return (
    <header className="h-[56px] bg-white border-b border-slate-200 flex items-center px-5 gap-4 flex-shrink-0 z-40">

      {/* Global search */}
      <div className="relative flex-1 max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search…"
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
        />
      </div>

      {/* Database Connection Status Badge */}
      {/* <button
        onClick={() => setSetupOpen(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
          isFirebaseConfigured
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300'
            : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isFirebaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
        <Database className="w-3.5 h-3.5" />
        <span>{isFirebaseConfigured ? 'Firebase Active' : 'Local Storage Mode'}</span>
      </button> */}

      <div className="flex-1" />

      <FirebaseSetupModal isOpen={setupOpen} onClose={() => setSetupOpen(false)} />

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* Bell */}
        <button className="relative p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
          <Settings className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-200 mx-2" />

        {/* User */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            SV
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 leading-none">Sachin Vudiga</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Admin</p>
          </div>
        </div>

        {/* Logout */}
        <button className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors ml-1">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
