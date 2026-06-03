import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  icon: Icon,
  ...props 
}) {
  const variants = {
    primary:   'bg-blue-600 text-white hover:bg-blue-700 border border-blue-700 shadow-sm',
    secondary: 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-sm',
    ghost:     'bg-transparent text-slate-600 hover:bg-slate-100 border border-transparent',
    danger:    'bg-rose-600 text-white hover:bg-rose-700 border border-rose-700 shadow-sm',
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-2.5 text-sm rounded-lg',
  };

  return (
    <button
      className={twMerge(
        'inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-1.5" />}
      {children}
    </button>
  );
}

export default Button;
