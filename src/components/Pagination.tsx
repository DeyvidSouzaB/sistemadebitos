/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 12, 24, 48, 96],
}: PaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with ellipses
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div 
      id="pagination-footer"
      className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 mt-6"
    >
      {/* Left side: Items counter & page size selector */}
      <div className="flex flex-wrap items-center justify-between md:justify-start gap-4 w-full md:w-auto text-xs font-medium text-slate-500">
        <div className="flex items-center gap-1.5">
          <span>Mostrando</span>
          <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg font-mono">
            {startItem}-{endItem}
          </span>
          <span>de</span>
          <span className="font-black text-slate-900 font-mono">{totalItems}</span>
          <span>registros</span>
        </div>

        <div className="flex items-center gap-2 border-l border-slate-200/80 pl-4">
          <span className="text-slate-400 font-bold hidden sm:inline">Exibir:</span>
          <select
            id="select-page-size"
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1);
            }}
            aria-label="Registros por página"
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-extrabold py-1.5 px-2.5 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option} por pág.
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right side: Page navigation controls */}
      <div className="flex items-center gap-1.5 w-full md:w-auto justify-center md:justify-end" role="navigation" aria-label="Navegação de páginas">
        {/* First Page Button */}
        <button
          id="btn-page-first"
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="Primeira página"
          className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Primeira Página"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page Button */}
        <button
          id="btn-page-prev"
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Página anterior"
          className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Página Anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 px-1">
          {pages.map((page, idx) => {
            if (typeof page === 'string') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1.5 py-1 text-slate-400 font-bold text-xs">
                  ...
                </span>
              );
            }

            const isCurrent = page === currentPage;
            return (
              <button
                key={`page-${page}-${idx}`}
                id={`btn-page-${page}`}
                type="button"
                onClick={() => onPageChange(page)}
                aria-label={`Página ${page}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={`min-w-[34px] h-[34px] px-2 text-xs font-black rounded-xl transition-all cursor-pointer font-mono flex items-center justify-center ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          id="btn-page-next"
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Próxima página"
          className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Próxima Página"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page Button */}
        <button
          id="btn-page-last"
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Última página"
          className="p-2 text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          title="Última Página"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
