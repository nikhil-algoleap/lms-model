import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  onPageSizeChange,
  className = '',
}) {
  if (totalPages <= 1 && !onPageSizeChange) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      if (currentPage <= 2) end = 4;
      else if (currentPage >= totalPages - 1) start = totalPages - 3;
      if (start > 2) pages.push('ellipsis1');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('ellipsis2');
      pages.push(totalPages);
    }
    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-slate-200 ${className}`}>
      <div className="text-xs text-slate-500 font-medium">
        {totalItems > 0 ? (
          <>
            Showing <span className="font-semibold text-slate-800">{startItem}</span> to{' '}
            <span className="font-semibold text-slate-800">{endItem}</span> of{' '}
            <span className="font-semibold text-slate-800">{totalItems}</span> result{totalItems !== 1 ? 's' : ''}
          </>
        ) : (
          'No results to display'
        )}
      </div>

      <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
        {onPageSizeChange && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer font-semibold text-slate-700"
            >
              {[5, 10, 25, 50].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>per page</span>
          </div>
        )}

        {totalPages > 1 && (
          <nav className="flex items-center gap-1" aria-label="Pagination">
            <Button
              variant="secondary" size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {getPageNumbers().map((page, index) => {
              if (page === 'ellipsis1' || page === 'ellipsis2') {
                return (
                  <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-semibold">
                    •••
                  </span>
                );
              }
              const isCurrent = page === currentPage;
              return (
                <button
                  key={`page-${page}`}
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                    isCurrent
                      ? 'bg-blue-600 border border-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <Button
              variant="secondary" size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </nav>
        )}
      </div>
    </div>
  );
}

export default Pagination;
