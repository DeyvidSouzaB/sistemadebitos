/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Debt } from '../types';
import { Calendar, AlertTriangle, Clock, CalendarCheck, MessageCircle, Eye, Check, CheckCircle2, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 sm:space-y-7 text-slate-900 max-w-[1600px] mx-auto pb-10"
    >
      {/* 1. HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 shadow-2xl border border-slate-800/80">
        {/* Calendar grid watermark for Deadlines view */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none hidden sm:block">
          <div className="grid grid-cols-4 gap-2 w-48 h-32 border border-emerald-400 p-2 rounded-xl">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border border-emerald-400/50 rounded-md" />
            ))}
          </div>
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-600 rounded-l-3xl" />

        <div className="relative z-10 space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>GESTÃO PREVENTIVA DE VENCIMENTOS</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-display leading-tight">
            Prazos & Vencimentos
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Acompanhe o cronograma completo de cobranças, previna atrasos fatais e controle os vencimentos diários.
          </p>
        </div>
      </div>

      {/* 2. SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Overdue Card */}
        <div 
          onClick={() => setTimeFilter('overdue')}
          className={`group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 ${
            overdueDebts.length === 0
              ? timeFilter === 'overdue'
                ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-emerald-900/40 border-2 border-emerald-500 text-white'
                : 'bg-white/90 border border-slate-200/80 text-slate-900 hover:border-emerald-400'
              : timeFilter === 'overdue'
                ? 'bg-gradient-to-br from-rose-600 via-rose-700 to-red-800 text-white border-2 border-rose-400 shadow-rose-950/20'
                : 'bg-white/90 border border-slate-200/80 text-slate-900 hover:border-rose-400'
          }`}
        >
          <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full ${
            overdueDebts.length === 0
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600'
              : 'bg-gradient-to-r from-rose-500 via-rose-400 to-red-600'
          }`} />

          <div className="flex items-start justify-between gap-3 mb-4 pt-1">
            <div>
              <span className={`text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 font-mono ${
                overdueDebts.length === 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {overdueDebts.length === 0 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                )} 
                Cobranças Atrasadas
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {overdueDebts.length === 0 ? 'Tudo em dia e sem pendências!' : 'Prazos expirados pendentes'}
              </p>
            </div>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300 ${
              overdueDebts.length === 0
                ? 'bg-emerald-50/60 text-emerald-600 border border-emerald-100'
                : 'bg-rose-50/60 text-rose-600 border border-rose-100'
            }`}>
              {overdueDebts.length === 0 ? (
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              ) : (
                <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
              )}
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-display">
                {overdueDebts.length} <span className="text-sm font-bold text-slate-400 font-sans">pendência{overdueDebts.length !== 1 ? 's' : ''}</span>
              </h3>
            </div>
            
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
              <span className={`text-xs font-black font-mono px-2.5 py-1 rounded-xl border ${
                overdueDebts.length === 0
                  ? 'text-emerald-700 bg-emerald-50/60 border-emerald-100'
                  : 'text-rose-700 bg-rose-50/60 border-rose-100'
              }`}>
                {formatCurrency(totalOverdueAmount)}
              </span>
              {overdueDebts.length > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-rose-600 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> Atenção Exigida
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50/60 px-2 py-0.5 rounded-lg border border-emerald-100">
                  <Sparkles className="w-3 h-3 text-emerald-500" /> Tudo em dia! 🎉
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Due Today Card */}
        <div 
          onClick={() => setTimeFilter('today')}
          className={`group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 ${
            timeFilter === 'today'
              ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-2 border-amber-300 shadow-amber-950/20'
              : 'bg-white/90 border border-slate-200/80 text-slate-900 hover:border-amber-400'
          }`}
        >
          <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500" />

          <div className="flex items-start justify-between gap-3 mb-4 pt-1">
            <div>
              <span className="text-[11px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Vencem Hoje
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Compromissos para a data</p>
            </div>
            <div className="w-12 h-12 bg-amber-50/60 text-amber-600 border border-amber-100 rounded-2xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
              <Clock className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-display">
                {dueTodayDebts.length} <span className="text-sm font-bold text-slate-400 font-sans">cobrança{dueTodayDebts.length !== 1 ? 's' : ''}</span>
              </h3>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-black font-mono text-amber-700 bg-amber-50/60 px-2.5 py-1 rounded-xl border border-amber-100">
                {formatCurrency(totalTodayAmount)}
              </span>
              <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">
                Vencimento do dia
              </span>
            </div>
          </div>
        </div>

        {/* Upcoming Card */}
        <div 
          onClick={() => setTimeFilter('upcoming')}
          className={`group relative rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 ${
            timeFilter === 'upcoming'
              ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-2 border-emerald-300 shadow-emerald-950/20'
              : 'bg-white/90 border border-slate-200/80 text-slate-900 hover:border-emerald-400'
          }`}
        >
          <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

          <div className="flex items-start justify-between gap-3 mb-4 pt-1">
            <div>
              <span className="text-[11px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" /> Próximos Vencimentos
              </span>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Previsão de recebimento</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50/60 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
              <CalendarCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-display">
                {upcomingDebts.length} <span className="text-sm font-bold text-slate-400 font-sans">programado{upcomingDebts.length !== 1 ? 's' : ''}</span>
              </h3>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
              <span className="text-xs font-black font-mono text-emerald-700 bg-emerald-50/60 px-2.5 py-1 rounded-xl border border-emerald-100">
                {formatCurrency(totalUpcomingAmount)}
              </span>
              <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
                Futuros previstos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FULL MONTHLY & YEARLY INTERACTIVE CALENDAR */}
      <FullMonthlyCalendar
        debts={debts}
        onSelectDebt={onSelectDebt}
        onPayFull={onPayFull}
      />

      {/* 4. MAIN TIMELINE LISTING */}
      <div className="bg-white/90 rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
        {/* Header with Title and Segmented Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight font-display">
              {timeFilter === 'all' && 'Todos os Compromissos em Aberto'}
              {timeFilter === 'overdue' && 'Cobranças Atrasadas'}
              {timeFilter === 'today' && 'Compromissos para Quitação Hoje'}
              {timeFilter === 'upcoming' && 'Agenda de Recebíveis Próximos'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Listagem filtrada por cronograma de vencimento
            </p>
          </div>

          {/* Unified Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100/80/80 p-1 rounded-2xl overflow-x-auto max-w-full border border-slate-200/60/60">
            <button
              id="btn-time-filter-all"
              onClick={() => setTimeFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                timeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Todos</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                timeFilter === 'all' ? 'bg-slate-100 text-slate-700' : 'bg-slate-200/70/70 text-slate-500'
              }`}>
                {unpaidDebts.length}
              </span>
            </button>

            <button
              id="btn-time-filter-overdue"
              onClick={() => setTimeFilter('overdue')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                timeFilter === 'overdue'
                  ? 'bg-rose-500 text-white shadow-xs font-black'
                  : 'text-slate-500 hover:text-rose-600'
              }`}
            >
              <span>Atrasados</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                timeFilter === 'overdue' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'
              }`}>
                {overdueDebts.length}
              </span>
            </button>

            <button
              id="btn-time-filter-today"
              onClick={() => setTimeFilter('today')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                timeFilter === 'today'
                  ? 'bg-amber-500 text-white shadow-xs font-black'
                  : 'text-slate-500 hover:text-amber-600'
              }`}
            >
              <span>Hoje</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                timeFilter === 'today' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                {dueTodayDebts.length}
              </span>
            </button>

            <button
              id="btn-time-filter-upcoming"
              onClick={() => setTimeFilter('upcoming')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                timeFilter === 'upcoming'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              <span>Futuros</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                timeFilter === 'upcoming' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {upcomingDebts.length}
              </span>
            </button>
          </div>
        </div>

        {/* Selected Category List Output */}
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
                    className="text-center py-10 px-6 border-2 border-dashed border-emerald-200 bg-emerald-50/40/20 rounded-3xl space-y-3"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 flex items-center justify-center gap-1.5 font-display">
                        Tudo em dia! <span className="text-lg">🎉</span>
                      </h4>
                      <p className="text-xs text-slate-500 font-medium max-w-md mx-auto mt-1">
                        Parabéns! Nenhuma cobrança está em atraso no momento. Todas as contas estão rigorosamente dentro do prazo de vencimento.
                      </p>
                    </div>
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Excelente saúde financeira!
                      </span>
                    </div>
                  </motion.div>
                );
              }

              return (
                <div className="text-center py-10 px-6 border border-dashed border-slate-200 bg-slate-50/50/40 rounded-2xl space-y-2">
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

                      const initials = debt.name
                        ? debt.name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]).join('').toUpperCase()
                        : 'CL';

                      return (
                        <motion.div 
                          key={`${debt.id}-${index}`} 
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                          transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.03 }}
                          onClick={() => onSelectDebt?.(debt)}
                          className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60/40 hover:bg-white hover:border-emerald-300 transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer group"
                        >
                          <div className="min-w-0 flex-1 flex items-center gap-3.5">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm font-mono">
                              {initials}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors truncate font-display">{debt.name}</h4>
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                  debt.status === 'partial' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}>
                                  {debt.status === 'partial' ? 'Parcial' : 'Pendente'}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                                <span className="flex items-center gap-1 font-medium">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  Vencimento: <strong className="font-mono text-slate-800">{debt.dueDate ? formatDate(debt.dueDate) : 'Indeterminado'}</strong>
                                </span>
                                {daysLeft !== null && (
                                  <span className={`font-bold font-mono text-[11px] ${
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
                          </div>

                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                            <div className="text-left sm:text-right mr-1 font-mono">
                              <p className="text-sm font-black text-slate-900">{formatCurrency(debt.currentAmount)}</p>
                              <p className="text-[10px] text-slate-400 font-medium">saldo devido</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5">
                              {debt.phone && (
                                <a
                                  href={getWhatsappUrl(debt.phone, buildWhatsappMessage(debt))}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 bg-emerald-50/60 hover:bg-emerald-500 text-emerald-700 hover:text-white rounded-xl border border-emerald-200 transition-all duration-200 cursor-pointer flex items-center justify-center shadow-2xs active:scale-95"
                                  title="Cobrar via WhatsApp"
                                  id={`btn-vencimento-wa-${debt.id}`}
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>
                              )}

                              {onSelectDebt && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectDebt(debt);
                                  }}
                                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center shadow-2xs active:scale-95"
                                  title="Ver Detalhes do Cliente"
                                  id={`btn-vencimento-detail-${debt.id}`}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}

                              {onPayFull && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onPayFull(debt);
                                  }}
                                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all duration-200 shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
                                  title="Dar Baixa Total"
                                  id={`btn-vencimento-pay-${debt.id}`}
                                >
                                  <Check className="w-4 h-4 stroke-[3]" />
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
    </motion.div>
  );
}

export default React.memo(PrazosVencimentosView);
