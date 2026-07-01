import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, hideHeader, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="bg-slate-50 rounded-[2.5rem] w-full max-w-5xl relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
        {!hideHeader && (
          <div className="px-8 py-6 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
            <h2 className="text-2xl font-serif text-slate-900 font-bold">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>
        )}
        
        <div className={`flex-1 min-h-0 ${hideHeader ? 'flex flex-col' : 'p-8 overflow-y-auto'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
