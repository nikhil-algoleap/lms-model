import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Table({ columns, data, onRowClick, className }) {
  return (
    <div className={twMerge('w-full overflow-x-auto', className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.length > 0 ? (
            data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                onClick={() => onRowClick?.(row)}
                className={twMerge(
                  'transition-colors duration-100 hover:bg-blue-50/50',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-4 py-3 text-sm text-slate-700">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-slate-400 italic">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
