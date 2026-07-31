/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Debt } from '../types';
import { Calendar, AlertTriangle, Clock, CalendarCheck, MessageCircle, Eye, Check, CheckCircle2, Sparkles } from 'lucide-react';
import { formatDate, getTodayString } from '../utils/dateUtils';
import { formatCurrency } from '../hooks/useDebtCalculations';
import { getWhatsappUrl, buildWhatsappMessage } from '../utils/phoneUtils';
import Pagination from './Pagination';
import FullMonthlyCalendar from './FullMonthlyCalendar';
import { motion, AnimatePresence } from 'motion/react';

interface PrazosVencimentosViewProps {
  debts: Debt[];
  onSelectDebt?: (debt: Debt) => void;
  onPayFull?: (debt: Debt) => void;
}

function PrazosVencimentosView({ debts, onSelectDebt, onPayFull }: PrazosVencimentosViewProps) {
  const [timeFilter, setTimeFilter] = useState<'all' | 'overdue' | 'today' | 'upcoming'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [timeFilter]);

  const todayStr = getTodayString();
  const nowTime = new Date(todayStr).getTime();

  // Categorize debts (Memoized)
  const unpaidDebts = useMemo(() => debts.filter(d => d.status !== 'paid'), [debts]);

  const overdueDebts = useMemo(() => {
    return unpaidDebts.filter(d => {
      if (!d.dueDate) return false;
      const dueTime = new Date(d.dueDate.slice(0, 10)).getTime();
      return dueTime < nowTime;
    });
  }, [unpaidDebts, nowTime]);

  const dueTodayDebts = useMemo(() => {
    return unpaidDebts.filter(d => {
      if (!d.dueDate) return false;
      return d.dueDate.slice(0, 10) === todayStr;
    });
  }, [unpaidDebts, todayStr]);

  const upcomingDebts = useMemo(() => {
    return unpaidDebts.filter(d => {
      if (!d.dueDate) return false;
      const dueTime = new Date(d.dueDate.slice(0, 10)).getTime();
      return dueTime > nowTime;
    });
  }, [unpaidDebts, nowTime]);

  const totalOverdueAmount = useMemo(() => overdueDebts.reduce((sum, d) => sum + d.currentAmount, 0), [overdueDebts]);
  const totalTodayAmount = useMemo(() => dueTodayDebts.reduce((sum, d) => sum + d.currentAmount, 0), [dueTodayDebts]);
  const totalUpcomingAmount = useMemo(() => upcomingDebts.reduce((sum, d) => sum + d.currentAmount, 0), [upcomingDebts]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Vencimentos</h2>
        <p className="text-xs text-slate-500 mt-0.5">Gestão preventiva do cronograma de cobranças e prazos fatais</p>
      </div>

      {/* High Fidelity Summary Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Overdue Card - Red when overdue debts exist, Positive Emerald when 0 overdue debts */}
        <div 
          onClick={() => setTimeFilter('overdue')}
          className={`group relative bg-white rounded-3xl p-6 border transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 ${
            overdueDebts.length === 0
              ? timeFilter === 'overdue'
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10 hover:shadow-emerald-500/10'
                : 'border-emerald-200/80 hover:border-emerald-300 bg-emerald-50/10 hover:shadow-emerald-500/10'
              : timeFilter === 'overdue'
                ? 'border-rose-500 ring-2 ring-rose-500/20 hover:shadow-rose-500/10'
                : 'border-slate-200/80 hover:border-rose-300 hover:shadow-rose-500/10'
          }`}
        >
          {/* Top Status Gradient Bar */}
          <div className={`absolute top-0 left-6 right-6 h-[3px] rounded-b-full ${
            overdueDebts.length === 0
              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400'
              : 'bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500'
          }`} />

          <div className="flex items-start justify-between gap-3 mb-4 pt-1">
            <div>
              <span className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                overdueDebts.length === 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}>
                {overdueDebts.length === 0 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                )} 
                Cobranças Atrasadas
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {overdueDebts.length === 0 ? 'Tudo em dia e sem pendências!' : 'Prazos expirados pendentes'}
              </p>
            </div>
            <div className={`w-11 h-11 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform ${
              overdueDebts.length === 0
                ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20'
                : 'bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/25'
            }`}>
              {overdueDebts.length === 0 ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <h3 className={`text-2xl sm:text-3xl font-black tracking-tight group-hover:transition-colors ${
                overdueDebts.length === 0 
                  ? 'text-slate-900 group-hover:text-emerald-700' 
                  : 'text-slate-900 group-hover:text-rose-600'
              }`}>
                {overdueDebts.length} <span className="text-sm font-bold text-slate-500 font-sans">pendência{overdueDebts.length !== 1 ? 's' : ''}</span>
              </h3>
            </div>
            
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
              <span className={`text-xs font-black font-mono px-2.5 py-1 rounded-xl border ${
                overdueDebts.length === 0
                  ? 'text-emerald-700 bg-emerald-100/80 border-emerald-200'
                  : 'text-rose-600 bg-rose-50 border-rose-100'
              }`}>
                {formatCurrency(totalOverdueAmount)}
              </span>
              {overdueDebts.length > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> Atenção Exigida
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/80">
                  <Sparkles className="w-3 h-3 text-emerald-600" /> Tudo em dia! 🎉
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Amber - Due Today Card */}
        <div 
          onClick={() => setTimeFilter('today')}
          className={`group relative bg-white rounded-3xl p-6 border transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 ${
            timeFilter === 'today' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200/80 hover:border-amber-300'
          }`}
        >
          {/* Top Status Gradient Bar */}
          <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500" />

          <div className="flex items-start justify-between gap-3 mb-4 pt-1">
            <div>
              <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Vencem Hoje
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Compromissos para a data</p>
            </div>
            <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                {dueTodayDebts.length} <span className="text-sm font-bold text-slate-500 font-sans">cobrança{dueTodayDebts.length !== 1 ? 's' : ''}</span>
              </h3>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-black font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-100">
                {formatCurrency(totalTodayAmount)}
              </span>
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">
                Vencimento do dia
              </span>
            </div>
          </div>
        </div>

        {/* Emerald - Upcoming Card */}
        <div 
          onClick={() => setTimeFilter('upcoming')}
          className={`group relative bg-white rounded-3xl p-6 border transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 ${
            timeFilter === 'upcoming' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/80 hover:border-emerald-300'
          }`}
        >
          {/* Top Status Gradient Bar */}
          <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400" />

          <div className="flex items-start justify-between gap-3 mb-4 pt-1">
            <div>
              <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" /> Próximos Vencimentos
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Previsão de recebimento</p>
            </div>
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/25 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                {upcomingDebts.length} <span className="text-sm font-bold text-slate-500 font-sans">programado{upcomingDebts.length !== 1 ? 's' : ''}</span>
              </h3>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-black font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                {formatCurrency(totalUpcomingAmount)}
              </span>
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
                Futuros previstos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FULL MONTHLY & YEARLY INTERACTIVE CALENDAR */}
      <FullMonthlyCalendar
        debts={debts}
        onSelectDebt={onSelectDebt}
        onPayFull={onPayFull}
      />

      {/* Main timeline listing */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
        {/* Header with Title and Segmented Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              {timeFilter === 'all' && 'Todos os Compromissos em Aberto'}
              {timeFilter === 'overdue' && 'Cobranças Atrasadas'}
              {timeFilter === 'today' && 'Compromissos para Quitação Hoje'}
              {timeFilter === 'upcoming' && 'Agenda de Recebíveis Próximos'}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Listagem filtrada por cronograma de vencimento
            </p>
          </div>

          {/* Unified Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl overflow-x-auto max-w-full">
            <button
              id="btn-time-filter-all"
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                timeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Todos</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                timeFilter === 'all' ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/70 text-slate-500'
              }`}>
                {unpaidDebts.length}
              </span>
            </button>

            <button
              id="btn-time-filter-overdue"
              onClick={() => setTimeFilter('overdue')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                timeFilter === 'overdue'
                  ? 'bg-rose-500 text-white shadow-2xs font-black'
                  : 'text-slate-500 hover:text-rose-600'
              }`}
            >
              <span>Atrasados</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                timeFilter === 'overdue' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
              }`}>
                {overdueDebts.length}
              </span>
            </button>

            <button
              id="btn-time-filter-today"
              onClick={() => setTimeFilter('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                timeFilter === 'today'
                  ? 'bg-amber-500 text-white shadow-2xs font-black'
                  : 'text-slate-500 hover:text-amber-600'
              }`}
            >
              <span>Hoje</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                timeFilter === 'today' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                {dueTodayDebts.length}
              </span>
            </button>

            <button
              id="btn-time-filter-upcoming"
              onClick={() => setTimeFilter('upcoming')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                timeFilter === 'upcoming'
                  ? 'bg-emerald-600 text-white shadow-2xs font-black'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              <span>Futuros</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                timeFilter === 'upcoming' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {upcomingDebts.length}
              </span>
            </button>
          </div>
        </div>

        {/* Selected Category List Output */}
        <div className="space-y-3">

            {/* List items */}
            <div className="space-y-3">
              {(() => {
                let currentList = unpaidDebts;
                if (timeFilter === 'overdue') currentList = overdueDebts;
                if (timeFilter === 'today') currentList = dueTodayDebts;
                if (timeFilter === 'upcoming') currentList = upcomingDebts;

                if (currentList.length === 0) {
                  if (timeFilter === 'overdue' || (timeFilter === 'all' && unpaidDebts.length === 0)) {
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-10 px-6 border-2 border-dashed border-emerald-200/80 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50/40 rounded-3xl space-y-3"
                      >
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-900 flex items-center justify-center gap-1.5">
                            Tudo em dia! <span className="text-lg">🎉</span>
                          </h4>
                          <p className="text-xs text-slate-500 font-medium max-w-md mx-auto mt-1">
                            Parabéns! Nenhuma cobrança está em atraso no momento. Todas as contas estão rigorosamente dentro do prazo de vencimento.
                          </p>
                        </div>
                        <div className="pt-1">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-700 bg-emerald-100/80 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Excelente saúde financeira!
                          </span>
                        </div>
                      </motion.div>
                    );
                  }

                  return (
                    <div className="text-center py-10 px-6 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl space-y-2">
                      <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-500 font-bold">Nenhuma cobrança cadastrada neste critério.</p>
                      <p className="text-[11px] text-slate-400">Alterne o filtro ou adicione novos lançamentos no sistema.</p>
                    </div>
                  );
                }

                const totalItems = currentList.length;
                const totalPages = Math.ceil(totalItems / pageSize) || 1;
                const activePage = Math.min(currentPage, totalPages);
                const paginatedList = currentList.slice(
                  (activePage - 1) * pageSize,
                  activePage * pageSize
                );

                return (
                  <>
                    <div className="space-y-3">
                      <AnimatePresence>
                        {paginatedList.map((debt, index) => {
                          const daysLeft = debt.dueDate
                            ? Math.floor((new Date(debt.dueDate.slice(0, 10)).getTime() - nowTime) / (1000 * 60 * 60 * 24))
                            : null;

                          return (
                            <motion.div 
                              key={`${debt.id}-${index}`} 
                              initial={{ opacity: 0, y: 10, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                              transition={{ 
                                duration: 0.25, 
                                ease: "easeOut" 
                              }}
                              onClick={() => onSelectDebt?.(debt)}
                              className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50/80 hover:border-emerald-300 transition-all shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer group"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs font-black text-slate-800 group-hover:text-emerald-700 transition-colors truncate">{debt.name}</h4>
                                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                    debt.status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
                                  }`}>
                                    {debt.status === 'partial' ? 'Parcial' : 'Pendente'}
                                  </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 mt-1 text-[10px] font-semibold text-slate-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                                    Vencimento: {debt.dueDate ? formatDate(debt.dueDate) : 'Indeterminado'}
                                  </span>
                                  {daysLeft !== null && (
                                    <span className={`font-bold uppercase ${
                                      daysLeft < 0 ? 'text-rose-600' : daysLeft === 0 ? 'text-amber-500' : 'text-emerald-600'
                                    }`}>
                                      {daysLeft < 0 
                                        ? `(${Math.abs(daysLeft)} dias atrasado)` 
                                        : daysLeft === 0 
                                          ? '(vence hoje)' 
                                          : `(em ${daysLeft} dias)`
                                      }
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                <div className="text-left sm:text-right mr-1">
                                  <p className="text-xs font-black font-mono text-slate-900">{formatCurrency(debt.currentAmount)}</p>
                                  <p className="text-[9px] text-slate-400 mt-0.5 font-medium">saldo devido</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-1.5">
                                  {debt.phone && (
                                    <a
                                      href={getWhatsappUrl(debt.phone, buildWhatsappMessage(debt))}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-2xs"
                                      title="Cobrar via WhatsApp"
                                      id={`btn-vencimento-wa-${debt.id}`}
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </a>
                                  )}

                                  {onSelectDebt && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectDebt(debt);
                                      }}
                                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-2xs"
                                      title="Ver Detalhes do Cliente"
                                      id={`btn-vencimento-detail-${debt.id}`}
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  {onPayFull && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onPayFull(debt);
                                      }}
                                      className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-xl transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                                      title="Dar Baixa Total"
                                      id={`btn-vencimento-pay-${debt.id}`}
                                    >
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      <span className="hidden xs:inline">Quitar</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>

                    <Pagination
                      currentPage={activePage}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      totalItems={totalItems}
                      onPageChange={setCurrentPage}
                      onPageSizeChange={setPageSize}
                    />
                  </>
                );
              })()}
            </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PrazosVencimentosView);
