/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Debt } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  MessageCircle, 
  Check, 
  Eye, 
  Filter, 
  ArrowRight,
  Sparkles,
  Grid,
  CalendarDays
} from 'lucide-react';
import { formatDate, getTodayString } from '../utils/dateUtils';
import { formatCurrency } from '../hooks/useDebtCalculations';
import { getWhatsappUrl, buildWhatsappMessage } from '../utils/phoneUtils';
import { useCalendarData, MONTH_NAMES, WEEKDAY_NAMES } from '../hooks/useCalendarData';

interface FullMonthlyCalendarProps {
  debts: Debt[];
  onSelectDebt?: (debt: Debt) => void;
  onPayFull?: (debt: Debt) => void;
}

export function FullMonthlyCalendar({ debts, onSelectDebt, onPayFull }: FullMonthlyCalendarProps) {
  const todayStr = getTodayString();
  const todayDateObj = new Date();
  
  const [selectedYear, setSelectedYear] = useState<number>(todayDateObj.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(todayDateObj.getMonth()); // 0-indexed
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);

  // Available year options (e.g. 2024 -> 2028)
  const yearOptions = useMemo(() => {
    const currentYr = new Date().getFullYear();
    const list = [];
    for (let y = currentYr - 2; y <= currentYr + 3; y++) {
      list.push(y);
    }
    return list;
  }, []);

  // Switch to Previous Month
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
    setSelectedDayStr(null);
  };

  // Switch to Next Month
  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
    setSelectedDayStr(null);
  };

  // Reset to Current Month/Today
  const handleResetToToday = () => {
    setSelectedYear(todayDateObj.getFullYear());
    setSelectedMonth(todayDateObj.getMonth());
    setSelectedDayStr(todayStr);
  };

  const {
    debtsByDate,
    calendarGridCells,
    monthStats,
    yearlyStats,
  } = useCalendarData(debts, selectedYear, selectedMonth, todayStr);

  // Selected Day Debts List
  const selectedDayDebts = useMemo(() => {
    if (!selectedDayStr) return [];
    return debtsByDate[selectedDayStr] || [];
  }, [selectedDayStr, debtsByDate]);

  return (
    <div className="space-y-6">
      
      {/* HEADER & CONTROLS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Title & Badge */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
                Calendário Anual & Mensal
              </span>
              <span className="text-xs font-bold text-slate-400">
                {MONTH_NAMES[selectedMonth]} de {selectedYear}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Vencimentos por Data
            </h2>
          </div>

          {/* Controls: Nav, Selectors & Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* View Mode Toggle */}
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center text-xs font-extrabold">
              <button
                onClick={() => setViewMode('monthly')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'monthly'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Mês</span>
              </button>

              <button
                onClick={() => setViewMode('yearly')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'yearly'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>12 Meses</span>
              </button>
            </div>

            {/* Month & Year Nav (Only for monthly view) */}
            {viewMode === 'monthly' && (
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/80 p-1 rounded-2xl">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-slate-200/80 rounded-xl text-slate-700 transition-colors cursor-pointer"
                  title="Mês Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Month Dropdown */}
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(Number(e.target.value));
                    setSelectedDayStr(null);
                  }}
                  className="bg-transparent text-xs font-extrabold text-slate-900 px-2 py-1 focus:outline-none cursor-pointer"
                >
                  {MONTH_NAMES.map((name, idx) => (
                    <option key={`month-opt-${idx}`} value={idx}>{name}</option>
                  ))}
                </select>

                {/* Year Dropdown */}
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(Number(e.target.value));
                    setSelectedDayStr(null);
                  }}
                  className="bg-transparent text-xs font-extrabold text-slate-900 px-1 py-1 focus:outline-none cursor-pointer"
                >
                  {yearOptions.map((y, idx) => (
                    <option key={`year-opt-${y}-${idx}`} value={y}>{y}</option>
                  ))}
                </select>

                <button
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-slate-200/80 rounded-xl text-slate-700 transition-colors cursor-pointer"
                  title="Próximo Mês"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Reset to Today button */}
            <button
              onClick={handleResetToToday}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-2xl transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mês Atual</span>
            </button>
          </div>
        </div>

        {/* MONTH STATS RIBBON (FOR ACTIVE MONTH) */}
        {viewMode === 'monthly' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Cobranças no Mês</span>
              <span className="text-base font-black text-slate-900 mt-0.5 block">{monthStats.totalCount} títulos</span>
            </div>

            <div className="bg-rose-50/60 p-3 rounded-2xl border border-rose-100/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">Atrasados no Mês</span>
              <span className="text-base font-black text-rose-700 mt-0.5 block">{formatCurrency(monthStats.overdueAmount)}</span>
            </div>

            <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Vencem Hoje / A Vencer</span>
              <span className="text-base font-black text-amber-700 mt-0.5 block">{formatCurrency(monthStats.todayAmount + monthStats.upcomingAmount)}</span>
            </div>

            <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Quitados no Mês</span>
              <span className="text-base font-black text-emerald-700 mt-0.5 block">{formatCurrency(monthStats.paidAmount)}</span>
            </div>
          </div>
        )}
      </div>

      {/* VIEW MODE 1: FULL MONTHLY CALENDAR GRID */}
      {viewMode === 'monthly' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-3 sm:p-5 border border-slate-200/90 shadow-2xs overflow-hidden">
            
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
              {WEEKDAY_NAMES.map((wd, i) => (
                <div key={i} className="py-1 sm:py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400">
                  {wd}
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix (35 or 42 cells) */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarGridCells.map((cell, idx) => {
                const cellDebts = debtsByDate[cell.dateStr] || [];
                const hasDebts = cellDebts.length > 0;
                
                const isSelected = selectedDayStr === cell.dateStr;

                // Determine highlight color based on debt urgency
                let statusBg = 'bg-white hover:border-slate-300';
                let badgeBg = 'bg-slate-100 text-slate-700';

                if (hasDebts) {
                  const hasOverdue = cellDebts.some(d => d.status !== 'paid' && cell.dateStr < todayStr);
                  const hasToday = cellDebts.some(d => d.status !== 'paid' && cell.dateStr === todayStr);
                  const hasPending = cellDebts.some(d => d.status !== 'paid' && cell.dateStr > todayStr);
                  const allPaid = cellDebts.every(d => d.status === 'paid');

                  if (hasOverdue) {
                    statusBg = 'bg-rose-50/50 border-rose-200 hover:border-rose-400';
                    badgeBg = 'bg-rose-600 text-white';
                  } else if (hasToday) {
                    statusBg = 'bg-amber-50/60 border-amber-200 hover:border-amber-400';
                    badgeBg = 'bg-amber-500 text-white';
                  } else if (hasPending) {
                    statusBg = 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400';
                    badgeBg = 'bg-emerald-600 text-white';
                  } else if (allPaid) {
                    statusBg = 'bg-slate-50 border-slate-200';
                    badgeBg = 'bg-emerald-100 text-emerald-700';
                  }
                }

                const dayTotalAmount = cellDebts.reduce((sum, d) => sum + d.currentAmount, 0);

                return (
                  <div
                    key={`grid-cell-${cell.dateStr}-${idx}`}
                    onClick={() => {
                      if (hasDebts) {
                        setSelectedDayStr(isSelected ? null : cell.dateStr);
                      } else {
                        setSelectedDayStr(cell.dateStr);
                      }
                    }}
                    className={`min-h-[64px] sm:min-h-[105px] p-1 sm:p-2 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                      !cell.isCurrentMonth ? 'opacity-40 bg-slate-50/40 border-slate-100' : statusBg
                    } ${
                      cell.isToday ? 'ring-2 ring-emerald-500 ring-offset-1 sm:ring-offset-2 font-bold' : ''
                    } ${
                      isSelected ? 'border-2 border-emerald-600 shadow-md bg-emerald-50/20' : ''
                    }`}
                  >
                    {/* Day Number Header */}
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] sm:text-sm font-black ${
                        cell.isToday ? 'text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md sm:rounded-lg' : cell.isCurrentMonth ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {cell.dayNum}
                      </span>

                      {cell.isToday && (
                        <span className="hidden sm:inline-block text-[9px] font-black uppercase text-emerald-600 tracking-wider">
                          Hoje
                        </span>
                      )}
                    </div>

                    {/* Debts Badge & Amount */}
                    {hasDebts ? (
                      <div className="mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1">
                        <span className={`inline-block text-[8px] sm:text-[10px] font-black px-1 sm:px-2 py-0.5 rounded-md sm:rounded-lg shadow-2xs leading-none ${badgeBg}`}>
                          {cellDebts.length} <span className="hidden sm:inline">{cellDebts.length === 1 ? 'cobrança' : 'cobranças'}</span><span className="inline sm:hidden">cob.</span>
                        </span>

                        <p className="text-[9px] sm:text-xs font-black text-slate-900 truncate">
                          {formatCurrency(dayTotalAmount)}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-auto text-right">
                        <span className="text-[8px] sm:text-[9px] text-slate-300 group-hover:text-slate-400 font-medium">Livre</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* SELECTED DAY DETAILS DRAWER */}
          {selectedDayStr && (
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-500/80 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <h3 className="text-base font-black text-slate-900">
                    Cobranças em {formatDate(selectedDayStr)}
                  </h3>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {selectedDayDebts.length} {selectedDayDebts.length === 1 ? 'registro' : 'registros'}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedDayStr(null)}
                  className="text-xs font-extrabold text-slate-500 hover:text-slate-800 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Fechar Filtro do Dia
                </button>
              </div>

              {selectedDayDebts.length > 0 ? (
                <div className="space-y-3">
                  {selectedDayDebts.map((debt, index) => {
                    const isOverdue = debt.status !== 'paid' && selectedDayStr < todayStr;
                    const isToday = selectedDayStr === todayStr;
                    const isPaid = debt.status === 'paid';

                    const waMessage = buildWhatsappMessage(debt);
                    const waUrl = getWhatsappUrl(debt.phone, waMessage);

                    return (
                      <div
                        key={`${debt.id}-${index}`}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-900">{debt.name}</h4>
                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              isPaid
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : isOverdue
                                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                  : isToday
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}>
                              {isPaid ? 'Pago / Quitado' : isOverdue ? 'Atrasado' : isToday ? 'Vence Hoje' : 'Programado'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                            <span>Tel: <strong className="text-slate-700">{debt.phone || 'Não informado'}</strong></span>
                            <span>•</span>
                            <span>Vencimento: <strong className="text-slate-700">{formatDate(debt.dueDate)}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <div className="text-right mr-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Saldo Devedor</span>
                            <span className="text-sm font-black text-slate-900">{formatCurrency(debt.currentAmount)}</span>
                          </div>

                          {/* WhatsApp Reminder Button */}
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-all cursor-pointer"
                            title="Cobrar via WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          {/* Detail Button */}
                          {onSelectDebt && (
                            <button
                              onClick={() => onSelectDebt(debt)}
                              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                              title="Ver Detalhes do Cliente"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}

                          {/* Pay Button */}
                          {!isPaid && onPayFull && (
                            <button
                              onClick={() => onPayFull(debt)}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Quitar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                  <p className="text-xs font-bold text-slate-600">Sem registros de cobrança nesta data.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: 12-MONTH YEARLY CARDS OVERVIEW */}
      {viewMode === 'yearly' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
              Resumo Geral dos 12 Meses de {selectedYear}
            </h3>
            <span className="text-xs text-slate-400 font-bold">Clique em qualquer mês para abrir o calendário completo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {yearlyStats.map((item, idx) => {
              const isCurrentCalendarMonth = item.monthIdx === todayDateObj.getMonth() && selectedYear === todayDateObj.getFullYear();

              return (
                <div
                  key={`year-stat-${item.monthIdx}-${idx}`}
                  onClick={() => {
                    setSelectedMonth(item.monthIdx);
                    setViewMode('monthly');
                    setSelectedDayStr(null);
                  }}
                  className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden ${
                    isCurrentCalendarMonth
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200/90 hover:border-emerald-300'
                  }`}
                >
                  {isCurrentCalendarMonth && (
                    <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-2xl">
                      Mês Atual
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-xs font-bold text-slate-400">
                      {selectedYear}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">Total Previsto:</span>
                      <span className="text-sm font-black text-slate-900">
                        {formatCurrency(item.total)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Cobranças:</span>
                      <span className="font-extrabold text-slate-800">{item.count} títulos</span>
                    </div>

                    {item.overdue > 0 && (
                      <div className="flex items-center justify-between text-xs bg-rose-50 px-2.5 py-1 rounded-xl text-rose-700 font-bold">
                        <span>Atrasados:</span>
                        <span>{formatCurrency(item.overdue)}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-emerald-700 group-hover:translate-x-1 transition-transform">
                    <span>Ver Calendário Completo</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

export default FullMonthlyCalendar;
