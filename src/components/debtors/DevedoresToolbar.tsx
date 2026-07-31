/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, X, FileDown, Table2, LayoutGrid, ArrowUpDown } from 'lucide-react';
import { DebtStatusFilter, DebtSortOption, Debt } from '../../types';
import { DueDatePreset } from '../../hooks/useDebtorsFilter';
import { exportToExcel } from '../../utils/export';

interface DevedoresToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: DebtStatusFilter;
  setStatusFilter: (val: DebtStatusFilter) => void;
  dueDatePreset: DueDatePreset;
  setDueDatePreset: (val: DueDatePreset) => void;
  sortOption: DebtSortOption;
  setSortOption: (val: DebtSortOption) => void;
  viewType: 'grid' | 'table';
  setViewType: (val: 'grid' | 'table') => void;
  onOpenPdfModal: () => void;
  dateFilteredDebts: Debt[];
  counts: {
    totalCount: number;
    overdueCount: number;
    pendingCount: number;
    partialCount: number;
    paidCount: number;
  };
}

export const DevedoresToolbar: React.FC<DevedoresToolbarProps> = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  dueDatePreset,
  setDueDatePreset,
  sortOption,
  setSortOption,
  viewType,
  setViewType,
  onOpenPdfModal,
  dateFilteredDebts,
  counts,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-4">
      {/* Row 1: Search & Export Options */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-3 text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            id="input-devedores-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por nome do devedor, telefone ou observação..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs sm:text-sm placeholder-slate-400 text-slate-900 font-medium transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-devedores-export-pdf"
            onClick={onOpenPdfModal}
            disabled={dateFilteredDebts.length === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Exportar PDF</span>
          </button>

          <button
            id="btn-devedores-export-excel"
            onClick={() => exportToExcel(dateFilteredDebts)}
            disabled={dateFilteredDebts.length === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Row 2: Status Filter Tabs & Sorting */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3.5 pt-3.5 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
            <button
              id="tab-status-all"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({counts.totalCount})
            </button>

            <button
              id="tab-status-pending"
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Atrasados / Pendentes ({counts.pendingCount})
            </button>

            <button
              id="tab-status-partial"
              onClick={() => setStatusFilter('partial')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                statusFilter === 'partial'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Parciais ({counts.partialCount})
            </button>

            <button
              id="tab-status-paid"
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                statusFilter === 'paid'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Em Dia / Quitados ({counts.paidCount})
            </button>
          </div>

          {/* Date preset selector */}
          <select
            id="select-devedores-date-preset"
            value={dueDatePreset}
            onChange={(e) => setDueDatePreset(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 py-2 px-3 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Todas as Datas</option>
            <option value="overdue">Apenas Vencidos / Atrasados</option>
            <option value="today">Vencem Hoje</option>
            <option value="this_week">Vencem nos Próximos 7 Dias</option>
            <option value="this_month">Vencem Este Mês</option>
          </select>
        </div>

        {/* Right Group: Sorting and View Toggle */}
        <div className="flex items-center justify-between xl:justify-end gap-2.5">
          {/* View Switcher */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              id="btn-devedores-view-table"
              onClick={() => setViewType('table')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewType === 'table' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tabela detalhada"
            >
              <Table2 className="w-4 h-4" />
            </button>
            <button
              id="btn-devedores-view-grid"
              onClick={() => setViewType('grid')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewType === 'grid' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grade em blocos"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              id="select-devedores-sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as DebtSortOption)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 py-2 px-3 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="amount_desc">Valor: Maior Devedor</option>
              <option value="amount_asc">Valor: Menor Devedor</option>
              <option value="dueDate_asc">Vencimento: Mais Próximo</option>
              <option value="dueDate_desc">Vencimento: Mais Distante</option>
              <option value="name_asc">Nome: A a Z</option>
              <option value="name_desc">Nome: Z a A</option>
              <option value="createdAt_desc">Cadastrados Recentes</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
