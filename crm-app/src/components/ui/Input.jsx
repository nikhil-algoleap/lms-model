import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Input({ label, error, className, required, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        className={twMerge(
          "bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500",
          error && "border-rose-400 focus:ring-rose-500/30 focus:border-rose-500",
          className
        )}
        required={required}
        {...props}
      />
      {error && <span className="text-xs text-rose-500 mt-0.5">{error}</span>}
    </div>
  );
}

export function TextArea({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>
      )}
      <textarea
        className={twMerge(
          "bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-150 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 min-h-[90px] resize-none",
          error && "border-rose-400 focus:ring-rose-500/30 focus:border-rose-500",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-rose-500 mt-0.5">{error}</span>}
    </div>
  );
}
