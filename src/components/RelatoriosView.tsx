/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Debt } from '../types';
import { 
  FileText, 
  FileDown, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  PieChart, 
  Users, 
  ArrowUpRight,
  Receipt,
  Calendar,
  Filter,
  Sparkles,
  RotateCcw,
  Clock,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { exportToExcel } from '../utils/export';
import { getWhatsappUrl, buildWhatsappMessage } from '../utils/phoneUtils';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { 
  formatDate, 
  getEffectivePaidAmount,
  PeriodFilterType,
  DateBasisType
} from '../utils/dateUtils';
import { formatCurrency } from '../hooks/useDebtCalculations';
import { useReports } from '../hooks/useReports';
import Pagination from './Pagination';
import { motion } from 'motion/react';

const PdfExportModal = React.lazy(() => import('./PdfExportModal'));

interface RelatoriosViewProps {
  debts: Debt[];
  onSelectDebt?: (debt: Debt) => void;
  onAddPaymentClick?: (debt: Debt) => void;
  onPayFull?: (debt: Debt) => void;
}

function RelatoriosView({ debts, onSelectDebt, onAddPaymentClick, onPayFull }: RelatoriosViewProps) {
  const {
    isPdfModalOpen,
    setIsPdfModalOpen,
    periodFilter,
    setPeriodFilter,
    dateBasis,
    setDateBasis,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    paginatedPayments,
    metrics,
  } = useReports(debts);

  const {
    filteredDebts,
    periodPayments,
    totalOriginal,
    totalRemaining,
    totalPaid,
    totalScheduled,
    totalOverdueAmount,
    totalCount,
    paidDebts,
    partialDebts,
    pendingDebts,
    overdueDebts,
    recoveryRate,
    topDebtors,
    isUsingOverallTopDebtors,
    pieChartData,
    periodLabel,
  } = metrics;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 sm:space-y-7 text-slate-900 max-w-[1600px] mx-auto pb-12"
    >
      {/* 1. HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white p-6 sm:p-8 shadow-2xl border border-emerald-400/40">
        {/* Subtle chart pattern watermark for Reports view */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none hidden sm:block">
          <svg className="w-64 h-32 text-white" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M 0 80 Q 40 20 80 60 T 160 30 T 200 10" />
            <path d="M 0 90 Q 50 40 100 70 T 200 40" strokeOpacity="0.5" strokeDasharray="4 4" />
          </svg>
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-white/40 via-white/20 to-white/40 rounded-l-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold backdrop-blur-md">
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>RELATÓRIOS &amp; DEPURADORES FINANCEIROS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-display leading-tight">
              Relatórios Financeiros
            </h1>

            <p className="text-xs sm:text-sm text-emerald-50 font-medium leading-relaxed">
              Analise métricas consolidadas de liquidação, acompanhe entradas por período e exporte balancetes em PDF/Excel.
            </p>
          </div>

          {/* Export Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="btn-relatorio-pdf"
              onClick={() => setIsPdfModalOpen(true)}
              className="px-5 py-3 bg-white/10 hover:bg-white/15 active:scale-95 border border-white/15 text-slate-100 text-xs sm:text-sm font-bold rounded-2xl backdrop-blur-md transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <FileDown className="w-4 h-4 text-rose-400" />
              <span>Exportar PDF</span>
            </button>

            <button
              id="btn-relatorio-excel"
              onClick={() => exportToExcel(filteredDebts)}
              className="px-5 py-3 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 active:scale-95 text-slate-950 text-xs sm:text-sm font-black rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all duration-300 cursor-pointer flex items-center gap-2 border border-emerald-300/40"
            >
              <FileDown className="w-4 h-4 stroke-[2.5]" />
              <span>Exportar Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. FILTER BAR CARD */}
      <div className="bg-white/90 rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-50/60 text-emerald-600 rounded-2xl border border-emerald-100/50">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 font-display">Filtros de Período</h3>
              <p className="text-xs text-slate-400 font-medium font-mono">{periodLabel}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Period selector */}
            <div className="flex items-center bg-slate-100/80/80 p-1 rounded-2xl border border-slate-200/60/60">
              {[
                { key: 'this_month', label: 'Este Mês' },
                { key: 'last_month', label: 'Mês Passado' },
                { key: 'this_year', label: 'Este Ano' },
                { key: 'all', label: 'Todo Período' },
                { key: 'custom', label: 'Personalizado' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setPeriodFilter(item.key as PeriodFilterType)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    periodFilter === item.key
                      ? 'bg-white text-slate-900 shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Date basis selector */}
            <select
              value={dateBasis}
              onChange={(e) => setDateBasis(e.target.value as DateBasisType)}
              className="bg-slate-50/80 border border-slate-200 text-xs font-bold text-slate-700 py-2 px-3 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="paymentDate">Base: Data do Pagamento</option>
              <option value="dueDate">Base: Data de Vencimento</option>
              <option value="createdAt">Base: Data de Criação</option>
            </select>
          </div>
        </div>

        {/* Custom date range inputs */}
        {periodFilter === 'custom' && (
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono"
            />
            <span className="text-xs text-slate-400 font-bold">até</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-mono"
            />
          </div>
        )}
      </div>

      {/* 3. EXECUTIVE KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Pago */}
        <div className="bg-white/90 rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
          <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-emerald-500 to-teal-400" />
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 font-mono">Recebido no Período</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Total de entradas liquidadas</p>
            </div>
            <div className="w-11 h-11 bg-emerald-50/60 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            {formatCurrency(totalPaid)}
          </h3>
          <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3.5 h-3.5" /> {periodPayments.length} pagamentos efetuados
          </p>
        </div>

        {/* Saldo Restante */}
        <div className="bg-white/90 rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
          <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-amber-500 to-orange-400" />
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 font-mono">Saldo Pendente</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Valores em aberto no filtro</p>
            </div>
            <div className="w-11 h-11 bg-amber-50/60 text-amber-600 rounded-2xl flex items-center justify-center shrink-0 border border-amber-100">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            {formatCurrency(totalRemaining)}
          </h3>
          <p className="text-xs font-bold text-amber-600 mt-2 font-mono">
            {pendingDebts.length + partialDebts.length} títulos pendentes
          </p>
        </div>

        {/* Total em Atraso */}
        <div className="bg-white/90 rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300">
          <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-rose-500 to-red-600" />
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 font-mono">Total em Atraso</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Valores com vencimento expirado</p>
            </div>
            <div className="w-11 h-11 bg-rose-50/60 text-rose-600 rounded-2xl flex items-center justify-center shrink-0 border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            {formatCurrency(totalOverdueAmount)}
          </h3>
          <p className="text-xs font-bold text-rose-600 mt-2 font-mono">
            {overdueDebts.length} cobranças em atraso
          </p>
        </div>

        {/* Taxa de Recuperação */}
        <div className="bg-white/90 rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
          <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-indigo-500 to-teal-400" />
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 font-mono">Taxa de Adimplência</span>
              <p className="text-xs text-slate-400 font-medium mt-0.5">% do volume total quitado</p>
            </div>
            <div className="w-11 h-11 bg-indigo-50/60 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-indigo-600 font-display">
            {Number(recoveryRate).toFixed(1)}%
          </h3>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Number(recoveryRate))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. GRAPH & TOP DEBTORS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution Pie Chart */}
        <div className="bg-white/90 rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <PieChart className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-black text-slate-900 font-display">
                Distribuição de Cobranças por Status
              </h3>
            </div>

            <div className="h-60 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: any, name: any) => [
                      name === 'Sem dados' || totalCount === 0 ? 'R$ 0,00' : `R$ ${Number(value).toLocaleString('pt-BR')}`,
                      'Valor'
                    ]}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs font-mono">
            {pieChartData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/40">
                <span className="flex items-center gap-1.5 text-slate-600 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-black text-slate-900">
                  {item.count === 0 || item.name === 'Sem dados' ? formatCurrency(0) : formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Debtors Ranking */}
        <div className="bg-white/90 rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900 font-display">
                  Ranking de Maiores Devedores
                </h3>
              </div>
              {isUsingOverallTopDebtors && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50/60 px-2.5 py-1 rounded-full border border-amber-200/80/80">
                  Ranking Geral
                </span>
              )}
            </div>

            {topDebtors.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100/80 flex items-center justify-center text-slate-400">
                  <Users className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">
                    Nenhum devedor com saldo pendente
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    Todos os débitos cadastrados estão quitados ou sem pendências.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {topDebtors.slice(0, 5).map((debtor, idx) => (
                  <div 
                    key={`top-debtor-${debtor.id || idx}`}
                    onClick={() => onSelectDebt?.(debtor)}
                    className="p-3.5 bg-slate-50/40 hover:bg-slate-100 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 cursor-pointer transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center font-mono shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 truncate font-display">{debtor.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Original: {formatCurrency(debtor.originalAmount)}</p>
                      </div>
                    </div>

                    <span className="text-sm font-black text-rose-600 font-mono shrink-0">
                      {formatCurrency(debtor.currentAmount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal for PDF Export */}
      <React.Suspense fallback={null}>
        <PdfExportModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          debts={filteredDebts}
        />
      </React.Suspense>
    </motion.div>
  );
}

export default React.memo(RelatoriosView);
