import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: "bg-slate-100 text-slate-600 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger:  "bg-rose-50 text-rose-700 border-rose-200",
    indigo:  "bg-blue-50 text-blue-700 border-blue-200"
  };

  const statusMap = {
    "Active":   "success",
    "Inactive": "danger",
    "On Hold":  "warning",
    "Pending":  "warning"
  };

  const currentVariant = statusMap[children] || variant;

  return (
    <span className={twMerge(
      "inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded border",
      variants[currentVariant],
      className
    )}>
      {children}
    </span>
  );
}
