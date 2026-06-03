import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Building2, Check } from 'lucide-react';

/**
 * CompanySelect — editable combobox with filterable dropdown of account names.
 * Props:
 *   label      — field label string
 *   value      — current selected / typed value (company name string)
 *   onChange   — (value: string) => void
 *   options    — array of { id, name } objects (accounts list)
 *   required   — boolean
 *   placeholder — string
 */
export function CompanySelect({ label, value, onChange, options = [], required = false, placeholder = 'Search or type a company…' }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { setQuery(value || ''); }, [value]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        if (query !== value) onChange(query);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query, value, onChange]);

  const filtered = options.filter(opt => opt.name.toLowerCase().includes(query.toLowerCase()));

  const handleInputChange = (e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); };
  const handleSelect = (name) => { setQuery(name); onChange(name); setOpen(false); };
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'Enter' && filtered.length > 0) { e.preventDefault(); handleSelect(filtered[0].name); }
  };

  return (
    <div className="flex flex-col gap-1 w-full relative" ref={containerRef}>
      {label && (
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Building2 className="w-4 h-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          required={required}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
        />
        <button
          type="button" tabIndex={-1}
          onClick={() => { setOpen(o => !o); inputRef.current?.focus(); }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {query && (
            <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2 text-xs text-slate-400">
              <Search className="w-3 h-3" />
              <span>Results for "<span className="font-semibold text-slate-600">{query}</span>"</span>
            </div>
          )}
          <ul className="max-h-52 overflow-y-auto py-1">
            {filtered.length > 0 ? (
              filtered.map(opt => (
                <li key={opt.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opt.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-blue-50 transition-colors ${value === opt.name ? 'bg-blue-50/60' : ''}`}
                  >
                    <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-700 text-sm flex-1">{opt.name}</span>
                    {value === opt.name && <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 text-center text-sm text-slate-400">
                No companies found.{' '}
                <span className="text-blue-600 font-medium">"{query}" will be used.</span>
              </li>
            )}
          </ul>
          {query && !filtered.find(o => o.name.toLowerCase() === query.toLowerCase()) && (
            <div className="border-t border-slate-100 px-3 py-2">
              <button
                type="button"
                onClick={() => handleSelect(query)}
                className="w-full flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                <span className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center text-xs font-bold">+</span>
                Use "<span className="underline">{query}</span>"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CompanySelect;
