import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className, hover = true, animate = false }) {
  return (
    <div
      className={twMerge(
        "bg-white border border-slate-200 rounded-lg shadow-sm relative overflow-hidden transition-all duration-200",
        hover && "hover:shadow-md hover:border-slate-300",
        className
      )}
    >
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
