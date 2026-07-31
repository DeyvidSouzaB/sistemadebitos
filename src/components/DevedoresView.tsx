/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Debt, DebtStatusFilter, DebtSortOption } from '../types';
import { Users, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useDebtorsFilter } from '../hooks/useDebtorsFilter';
import { formatCurrency } from '../hooks/useDebtCalculations';
import { DevedoresHeaderMetrics } from './debt/DevedoresHeaderMetrics';
import { DevedoresToolbar } from './debtors/DevedoresToolbar';
import { DevedoresTable } from './debtors/DevedoresTable';
import { DevedoresGrid } from './debtors/DevedoresGrid';
import Pagination from './Pagination';
import DebtorDetailModal from './DebtorDetailModal';

const PdfExportModal = React.lazy(() => import('./PdfExportModal'));

interface DevedoresViewProps {
  debts: Debt[];
  sortedDebts: Debt[];
  search: string;
  setSearch: (val: string) => void;
  statusFilter: DebtStatusFilter;
  setStatusFilter: (val: DebtStatusFilter) => void;
  sortOption: DebtSortOption;
  setSortOption: (val: DebtSortOption) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
  onAddPaymentClick: (debt: Debt) => void;
  onPayFull: (debt: Debt) => void;
  onDeletePayment: (debtId: string, paymentId: string) => void;
  onOpenAddModal: () => void;
}

function DevedoresView({
  debts,
  sortedDebts,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sortOption,
  setSortOption,
  onEdit,
  onDelete,
  onAddPaymentClick,
  onPayFull,
  onDeletePayment,
  onOpenAddModal,
}: DevedoresViewProps) {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedDebtorForModal, setSelectedDebtorForModal] = useState<Debt | null>(null);

  const activeDebtorForModal = useMemo(() => {
    if (!selectedDebtorForModal) return null;
    return debts.find((d) => d.id === selectedDebtorForModal.id) || selectedDebtorForModal;
  }, [debts, selectedDebtorForModal]);

  const {
    viewType,
    setViewType,
    dueDatePreset,
    setDueDatePreset,
    currentPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    paginatedDebts,
    dateFilteredDebts,
    handlePageChange,
    metrics,
    counts,
    todayStr,
  } = useDebtorsFilter(debts, sortedDebts, search, statusFilter, sortOption);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 text-slate-900 dark:text-slate-100 max-w-[1600px] mx-auto pb-10"
    >
      {/* 1. Header Banner Metrics */}
      <DevedoresHeaderMetrics
        onOpenAddModal={onOpenAddModal}
        totalOverdueAmount={metrics.totalOverdueAmount}
        overdueCount={metrics.overdueCount}
        totalOpenAmount={metrics.totalOpenAmount}
        activeDebtorsCount={metrics.activeDebtorsCount}
        formatCurrency={formatCurrency}
      />

      {/* 2. Toolbar & Filters */}
      <DevedoresToolbar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dueDatePreset={dueDatePreset}
        setDueDatePreset={setDueDatePreset}
        sortOption={sortOption}
        setSortOption={setSortOption}
        viewType={viewType}
        setViewType={setViewType}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
        dateFilteredDebts={dateFilteredDebts}
        counts={counts}
      />

      {/* 3. Main List / Table Section */}
      <div>
        {dateFilteredDebts.length > 0 ? (
          <>
            {viewType === 'table' ? (
              <DevedoresTable
                paginatedDebts={paginatedDebts}
                todayStr={todayStr}
                onSelectDebtor={(d) => setSelectedDebtorForModal(d)}
                onAddPaymentClick={onAddPaymentClick}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ) : (
              <DevedoresGrid
                paginatedDebts={paginatedDebts}
                todayStr={todayStr}
                onSelectDebtor={(d) => setSelectedDebtorForModal(d)}
                onAddPaymentClick={onAddPaymentClick}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={setPageSize}
            />
          </>
        ) : (
          /* Empty State View */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm space-y-4 w-full my-4"
          >
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 rounded-3xl flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight font-display">
                Nenhum devedor encontrado
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
                {search || statusFilter !== 'all'
                  ? 'Nenhuma cobrança corresponde aos filtros selecionados. Tente redefinir a busca.'
                  : 'Sua caderneta digital está limpa! Adicione seu primeiro devedor para iniciar o controle de cobranças de forma profissional.'}
              </p>
            </div>

            {search || statusFilter !== 'all' ? (
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setDueDatePreset('all');
                }}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200/80 dark:border-slate-700"
              >
                Limpar Filtros e Busca
              </button>
            ) : (
              <button
                onClick={onOpenAddModal}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Adicionar Primeiro Devedor</span>
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <DebtorDetailModal
        isOpen={selectedDebtorForModal !== null}
        onClose={() => setSelectedDebtorForModal(null)}
        debt={activeDebtorForModal}
        onAddPaymentClick={onAddPaymentClick}
        onPayFull={onPayFull}
        onEdit={onEdit}
        onDelete={onDelete}
        onDeletePayment={onDeletePayment}
      />

      {/* PDF Export Modal */}
      <React.Suspense fallback={null}>
        <PdfExportModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          debts={dateFilteredDebts}
        />
      </React.Suspense>
    </motion.div>
  );
}

export default React.memo(DevedoresView);
