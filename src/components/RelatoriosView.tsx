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
    pieChartData,
    periodLabel,
  } = metrics;


  return (
    <div className="space-y-6 pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Relatórios Executivos</h2>
          <p className="text-xs text-slate-500 mt-0.5">Análise consolidada de recuperação de crédito, inadimplência e extratos por período</p>
        </div>

        {/* Quick Export Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <button
            id="btn-relatorios-pdf"
            onClick={() => setIsPdfModalOpen(true)}
            disabled={filteredDebts.length === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Exportar Relatório PDF do Período"
          >
            <FileDown className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Exportar PDF</span>
          </button>
          <button
            id="btn-relatorios-excel"
            onClick={() => exportToExcel(filteredDebts)}
            disabled={filteredDebts.length === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Exportar Planilha Excel do Período"
          >
            <FileDown className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Period Filter Controls Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                Filtrar Período de Análise
              </h3>
              <p className="text-[11px] text-slate-400">
                Selecione o horizonte temporal e a base de datas para consolidação dos números
              </p>
            </div>
          </div>

          {/* Date Basis Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-[11px] font-bold self-start lg:self-auto">
            <span className="text-[10px] uppercase text-slate-400 font-black px-2 hidden sm:inline">Base:</span>
            <button
              type="button"
              onClick={() => { setDateBasis('dueDate'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                dateBasis === 'dueDate' ? 'bg-white text-emerald-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Filtra cobranças com vencimento no período"
            >
              Vencimento
            </button>
            <button
              type="button"
              onClick={() => { setDateBasis('createdAt'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                dateBasis === 'createdAt' ? 'bg-white text-emerald-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Filtra cobranças lançadas/cadastradas no período"
            >
              Lançamento
            </button>
            <button
              type="button"
              onClick={() => { setDateBasis('paymentDate'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                dateBasis === 'paymentDate' ? 'bg-white text-emerald-700 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Filtra recebimentos e fluxo de caixa ocorridos no período"
            >
              Recebimento
            </button>
          </div>
        </div>

        {/* Period Preset Pills & Custom Pickers */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => { setPeriodFilter('this_month'); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                periodFilter === 'this_month'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              Este Mês
            </button>
            <button
              type="button"
              onClick={() => { setPeriodFilter('last_month'); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                periodFilter === 'last_month'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              Mês Anterior
            </button>
            <button
              type="button"
              onClick={() => { setPeriodFilter('this_quarter'); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                periodFilter === 'this_quarter'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              Este Trimestre
            </button>
            <button
              type="button"
              onClick={() => { setPeriodFilter('this_year'); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                periodFilter === 'this_year'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              Este Ano
            </button>
            <button
              type="button"
              onClick={() => { setPeriodFilter('all'); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                periodFilter === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              Todo o Histórico
            </button>
            <button
              type="button"
              onClick={() => { setPeriodFilter('custom'); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                periodFilter === 'custom'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              Personalizado
            </button>
          </div>

          {/* Custom Date Inputs */}
          {periodFilter === 'custom' && (
            <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">De:</span>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => { setCustomStart(e.target.value); setCurrentPage(1); }}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Até:</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => { setCustomEnd(e.target.value); setCurrentPage(1); }}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-xl text-slate-800 font-bold text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Active Filter Summary Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200/80 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Período Ativo: <span className="font-mono text-emerald-900">{periodLabel}</span>
            </span>
            <span className="text-slate-500 font-medium text-xs">
              • <strong className="text-slate-800 font-black">{filteredDebts.length}</strong> cobrança{filteredDebts.length !== 1 ? 's' : ''} • <strong className="text-slate-800 font-black">{periodPayments.length}</strong> recebimento{periodPayments.length !== 1 ? 's' : ''} no período
            </span>
          </div>

          {periodFilter !== 'all' && (
            <button
              type="button"
              onClick={() => setPeriodFilter('all')}
              className="text-slate-400 hover:text-emerald-700 text-[11px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors ml-auto sm:ml-0"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" /> Resetar para Todo Histórico
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Lançado */}
        <div 
          id="relatorio-card-total-original"
          onClick={() => { setDateBasis('createdAt'); setCurrentPage(1); }}
          className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
          title="Clique para filtrar pela base de Lançamento"
        >
          {/* Top Status Gradient Bar */}
          <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400" />

          <div className="flex items-start justify-between gap-3 mb-4 pt-1">
            <div>
              <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Total Lançado
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Montante bruto cadastrado</p>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/25 group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
              {formatCurrency(totalOriginal)}
            </h3>
            
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl truncate">
                {totalCount} cobrança{totalCount !== 1 ? 's' : ''}
              </span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0">Base Histórica</span>
            </div>
          </div>
        </div>

        {/* Total Arrecadado */}
        <div 
          id="relatorio-card-total-paid"
          onClick={() => { setDateBasis('paymentDate'); setCurrentPage(1); }}
          className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
          title="Clique para filtrar pela base de Recebimento"
        >
          {/* Top Status Gradient Bar */}
          <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400" />

          <div className="flex items-start justify-between gap-3 mb-4 pt-1">
            <div>
              <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Total Arrecadado
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Valores recuperados</p>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div>
            <h3 className="text-xl sm:text-3xl font-black font-mono tracking-tight text-emerald-600 transition-colors truncate">
              {formatCurrency(totalPaid)}
            </h3>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-black font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100 truncate">
                {recoveryRate}% de taxa
              </span>
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider shrink-0">
                Recuperação
              </span>
            </div>
          </div>
        </div>

        {/* Saldo em Aberto */}
        <div 
          id="relatorio-card-total-remaining"
          onClick={() => { setDateBasis('dueDate'); setCurrentPage(1); }}
          className="group relative bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-rose-500/10 hover:border-rose-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
          title="Clique para filtrar por Vencimento"
        >
          {/* Top Status Gradient Bar */}
          <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500" />

          <div className="flex items-start justify-between gap-3 mb-4 pt-1">
            <div>
              <span className="text-[11px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-rose-500" /> Saldo em Aberto
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Pendente de liquidação</p>
            </div>
            <div className="w-11 h-11 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/25 group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-rose-600 transition-colors">
              {formatCurrency(totalRemaining)}
            </h3>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-100">
                {pendingDebts.length + partialDebts.length} pendência{pendingDebts.length + partialDebts.length !== 1 ? 's' : ''}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" /> Em aberto
              </span>
            </div>
          </div>
        </div>

        {/* Em Atraso */}
        <div 
          id="relatorio-card-total-overdue"
          onClick={() => { setDateBasis('dueDate'); setPeriodFilter('all'); setCurrentPage(1); }}
          className="group relative bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
          title="Clique para filtrar cobranças em atraso"
        >
          {/* Top Status Gradient Bar */}
          <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500" />

          <div className="flex items-start justify-between gap-3 mb-4 pt-1">
            <div>
              <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Em Atraso
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Vencidos e não pagos</p>
            </div>
            <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
              {overdueDebts.length} <span className="text-sm font-bold text-slate-500 font-sans">devedor{overdueDebts.length !== 1 ? 'es' : ''}</span>
            </h3>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-black font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100">
                {formatCurrency(totalOverdueAmount)}
              </span>
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">
                Inadimplente
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top 5 Devedores com Maior Saldo */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Maiores Saldos em Aberto</h3>
                  <p className="text-[11px] text-slate-400">Ranking das cobranças prioritárias para liquidação</p>
                </div>
              </div>
            </div>

            {topDebtors.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {topDebtors.map((debt, index) => {
                  const paidVal = getEffectivePaidAmount(debt.payments);
                  const pct = debt.originalAmount > 0 ? (paidVal / debt.originalAmount) * 100 : 0;

                  return (
                    <div 
                      key={`${debt.id}-${index}`} 
                      onClick={() => onSelectDebt?.(debt)}
                      className="py-3 px-2.5 -mx-2.5 rounded-xl hover:bg-slate-50/90 transition-all cursor-pointer group flex items-center justify-between gap-3"
                      title="Clique para ver os detalhes completos deste devedor"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 font-mono transition-colors">
                          #{index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                            {debt.name}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            Original: {formatCurrency(debt.originalAmount)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="text-right">
                          <span className="block text-xs font-black text-rose-600 font-mono">
                            {formatCurrency(debt.currentAmount)}
                          </span>
                          <div className="w-16 sm:w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1 ml-auto">
                            <div 
                              className="bg-emerald-500 h-full rounded-full" 
                              style={{ width: `${Math.min(100, pct)}%` }}
                            />
                          </div>
                        </div>

                        {/* Quick action buttons */}
                        <div className="flex items-center gap-1.5">
                          {debt.phone && (
                            <a
                              href={getWhatsappUrl(debt.phone, buildWhatsappMessage(debt))}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-2xs"
                              title="Cobrar via WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {debt.currentAmount > 0 && onAddPaymentClick && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddPaymentClick(debt);
                              }}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold shadow-2xs"
                              title="Registrar Pagamento"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Pagar</span>
                            </button>
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-0.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Nenhum devedor com saldo pendente registrado.
              </div>
            )}
          </div>
        </div>

        {/* Distribuição por Status */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-2">
              <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
                <PieChart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Distribuição da Carteira</h3>
                <p className="text-[11px] text-slate-400">Gráfico de proporção por estado de liquidação</p>
              </div>
            </div>

            {/* Donut Chart Canvas */}
            <div className="relative w-full h-[190px] flex items-center justify-center my-1">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={78}
                    paddingAngle={totalCount > 0 && pieChartData.length > 1 ? 4 : 0}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={4}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        if (data.name === 'Sem dados') return null;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-800 z-50">
                            <p className="font-bold flex items-center gap-1.5" style={{ color: data.color }}>
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                              {data.name}
                            </p>
                            <p className="text-[11px] text-slate-300 mt-1 font-mono">
                              <strong className="text-white font-bold">{data.count}</strong> cobrança{data.count !== 1 ? 's' : ''} ({data.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }} 
                  />
                </RechartsPieChart>
              </ResponsiveContainer>

              {/* Inner Badge Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black font-mono text-slate-900 leading-none">
                  {totalCount}
                </span>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mt-1">
                  Cobrança{totalCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Structured Executive Legend */}
            <div className="space-y-2 mt-1">
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  Quitados
                </span>
                <div className="flex items-center gap-2 font-mono text-slate-800 font-extrabold">
                  <span>{paidDebts.length}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                    {totalCount > 0 ? Math.round((paidDebts.length / totalCount) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  Pagamento Parcial
                </span>
                <div className="flex items-center gap-2 font-mono text-slate-800 font-extrabold">
                  <span>{partialDebts.length}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 font-bold">
                    {totalCount > 0 ? Math.round((partialDebts.length / totalCount) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  Pendentes sem Pagamento
                </span>
                <div className="flex items-center gap-2 font-mono text-slate-800 font-extrabold">
                  <span>{pendingDebts.length}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 font-bold">
                    {totalCount > 0 ? Math.round((pendingDebts.length / totalCount) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">
              Total da Carteira no Período
            </span>
            <span className="text-base font-black text-slate-900 font-mono block mt-0.5">
              {totalCount} registro{totalCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

      </div>

      {/* Audit Log of Received Payments */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Extrato de Entradas no Período</h3>
              <p className="text-[11px] text-slate-400">Histórico dos recebimentos quitados ou parciais registrados em {periodLabel}</p>
            </div>
          </div>
          <span className="text-xs font-black font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
            {periodPayments.length} lançamento{periodPayments.length !== 1 ? 's' : ''}
          </span>
        </div>

        {periodPayments.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <caption className="sr-only">Extrato de Entradas e Pagamentos do Período</caption>
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    <th scope="col" className="py-2.5 px-3">Devedor</th>
                    <th scope="col" className="py-2.5 px-3">Data do Pagamento</th>
                    <th scope="col" className="py-2.5 px-3">Observação / Nota</th>
                    <th scope="col" className="py-2.5 px-3 text-right">Valor Recebido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginatedPayments.map((pmt, idx) => {
                    const parentDebt = debts.find(d => d.id === pmt.debtId);
                    return (
                      <tr 
                        key={`${pmt.debtId || 'debt'}-${pmt.id || 'pmt'}-${idx}`} 
                        onClick={() => parentDebt && onSelectDebt?.(parentDebt)}
                        className={`transition-colors ${parentDebt ? 'hover:bg-slate-50 cursor-pointer group' : 'hover:bg-slate-50/50'}`}
                        title={parentDebt ? "Clique para ver detalhes desta cobrança" : undefined}
                      >
                        <td className="py-3 px-3 font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          <div className="flex items-center gap-1.5">
                            <span>{pmt.debtorName}</span>
                            {parentDebt && <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600 transition-colors" />}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono">
                          {formatDate(pmt.date)}
                        </td>
                        <td className="py-3 px-3 text-slate-500 italic">
                          {pmt.note || '-'}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-emerald-600 font-mono">
                          +{formatCurrency(pmt.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
              pageSizeOptions={[8, 16, 32, 64]}
            />
          </>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            Nenhum pagamento registrado no período de {periodLabel}.
          </div>
        )}
      </div>

      {/* PDF Export Preview & Customization Modal */}
      <React.Suspense fallback={null}>
        <PdfExportModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          debts={filteredDebts}
        />
      </React.Suspense>
    </div>
  );
}

export default React.memo(RelatoriosView);
