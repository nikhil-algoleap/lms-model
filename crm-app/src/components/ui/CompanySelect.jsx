import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Building2, Check } from 'lucide-react';

/**
 * CompanySelect — an editable combobox that shows a filterable dropdown
 * of company names pulled from the `options` prop, while still allowing
 * the user to type a custom name not present in the list.
 *
 * Props:
 *   label      — field label string
 *   value      — current selected / typed value
 *   onChange   — (value: string) => void
 *   options    — array of { id, name } objects (i.e. accounts)
 *   required   — boolean
 *   placeholder — string
 */
export function CompanySelect({ label, value, onChange, options = [], required = false, placeholder = 'Search or type a company…' }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Keep internal query in sync when external value changes (e.g. form reset)
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        // If user typed something not in the list, still keep it as a custom value
        if (query !== value) onChange(query);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query, value, onChange]);

  const filtered = options.filter(opt =>
    opt.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onChange(e.target.value);
    setOpen(true);
  };

  const handleSelect = (name) => {
    setQuery(name);
    onChange(name);
    setOpen(false);
  };

  const handleInputFocus = () => setOpen(true);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'Enter' && filtered.length > 0) {
      e.preventDefault();
      handleSelect(filtered[0].name);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full relative" ref={containerRef}>
      {label && (
        <label className="text-sm font-semibold text-slate-600 ml-1">
          {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
        </label>
      )}

      {/* Input */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Building2 className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          required={required}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-white/50 backdrop-blur-md border border-white/60 rounded-2xl pl-9 pr-10 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => { setOpen(o => !o); inputRef.current?.focus(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl shadow-slate-200/60 overflow-hidden">
          {/* Search hint */}
          {query && (
            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 text-xs text-slate-400">
              <Search className="w-3 h-3" />
              <span>Showing results for "<span className="font-semibold text-slate-600">{query}</span>"</span>
            </div>
          )}

          <ul className="max-h-52 overflow-y-auto py-1.5">
            {filtered.length > 0 ? (
              filtered.map(opt => (
                <li key={opt.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opt.name)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-indigo-50 transition-colors group ${value === opt.name ? 'bg-indigo-50/60' : ''}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-indigo-500 flex-shrink-0 transition-colors">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-700 text-sm flex-1">{opt.name}</span>
                    {value === opt.name && <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 text-center text-sm text-slate-400">
                <Building2 className="w-5 h-5 mx-auto mb-1 opacity-40" />
                No companies found.{' '}
                <span className="text-indigo-500 font-medium">
                  "{query}" will be used as a custom value.
                </span>
              </li>
            )}
          </ul>

          {/* Custom value hint at the bottom */}
          {query && !filtered.find(o => o.name.toLowerCase() === query.toLowerCase()) && (
            <div className="border-t border-slate-100 px-4 py-2.5">
              <button
                type="button"
                onClick={() => handleSelect(query)}
                className="w-full flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                <span className="w-5 h-5 rounded-md bg-indigo-50 flex items-center justify-center text-xs font-bold">+</span>
                Use "<span className="underline">{query}</span>" as a new company
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
