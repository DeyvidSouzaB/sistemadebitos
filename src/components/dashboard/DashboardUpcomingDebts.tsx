/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Clock, ChevronRight, Calendar, MessageCircle, Check, CheckCircle2, Search, Filter, AlertCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Debt } from '../../types';
import { formatDate, getTodayString } from '../../utils/dateUtils';
import { getWhatsappUrl, buildWhatsappMessage } from '../../utils/phoneUtils';
import { formatCurrency } from '../../hooks/useDebtCalculations';

interface DashboardUpcomingDebtsProps {
  upcomingDebts: Debt[];
  onSelectOption: (option: string) => void;
  onPayFull: (debt: Debt) => void;
  getStatusInfo: (debt: Debt) => { label: string; colorClass: string; dotClass: string };
}

export const DashboardUpcomingDebts: React.FC<DashboardUpcomingDebtsProps> = ({
  upcomingDebts,
  onSelectOption,
  onPayFull,
  getStatusInfo,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'overdue' | 'today'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const todayStr = getTodayString();

  // Helper for client initials avatar
  const getInitials = (name: string) => {
    if (!name) return 'CL';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Filter debts based on selected tab and search query
  const filteredDebts = upcomingDebts.filter((debt) => {
    const isOverdue = debt.dueDate && debt.dueDate.slice(0, 10) < todayStr;
    const isToday = debt.dueDate && debt.dueDate.slice(0, 10) === todayStr;

    if (filterMode === 'overdue' && !isOverdue) return false;
    if (filterMode === 'today' && !isToday) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = debt.name.toLowerCase().includes(q);
      const matchReason = (debt.description || '').toLowerCase().includes(q);
      return matchName || matchReason;
    }

    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 gap-6"
    >
      <div className="w-full bg-white dark:bg-slate-900/90 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Agenda Financeira
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5 font-display">
                Próximos Vencimentos
              </h3>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Filter Tabs */}
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                    filterMode === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  Todos ({upcomingDebts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('overdue')}
                  className={`px-3 py-1 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                    filterMode === 'overdue'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'text-slate-500 hover:text-rose-600 dark:text-slate-400'
                  }`}
                >
                  Atrasados
                </button>
              </div>

              <button
                onClick={() => onSelectOption('prazos')}
                className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-3.5 py-2 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 transition-all duration-200 cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>Ver Todos</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Search */}
          {upcomingDebts.length > 3 && (
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar por nome do cliente ou cobrança..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 pl-10 pr-4 py-2.5 rounded-2xl text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          )}

          {/* List of Debts */}
          {filteredDebts.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredDebts.map((debt, index) => {
                  const statusInfo = getStatusInfo(debt);
                  const initials = getInitials(debt.name);

                  return (
                    <motion.div
                      key={`${debt.id}-${index}`}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      transition={{ 
                        duration: 0.25, 
                        ease: "easeOut",
                        delay: index * 0.04
                      }}
                      className="group p-4 sm:p-4.5 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1 flex items-center gap-3.5">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm font-mono border border-emerald-400/30">
                          {initials}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white truncate font-display">{debt.name}</h4>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border ${statusInfo.colorClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                              {statusInfo.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              Vence: <strong className="text-slate-800 dark:text-slate-200 font-mono">{formatDate(debt.dueDate!)}</strong>
                            </span>
                            {debt.description && (
                              <span className="text-slate-400 dark:text-slate-500 truncate max-w-[200px]">
                                • {debt.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action Controls */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 dark:border-slate-800">
                        <span className="text-base font-black text-slate-900 dark:text-white mr-1 font-mono">
                          {formatCurrency(debt.currentAmount)}
                        </span>

                        {debt.phone && (
                          <a
                            href={getWhatsappUrl(debt.phone, buildWhatsappMessage(debt))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-500 text-emerald-700 dark:text-emerald-400 hover:text-white border border-emerald-200 dark:border-emerald-800/80 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center shadow-xs hover:shadow-emerald-500/20 active:scale-95"
                            title="Enviar cobrança via WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          id={`btn-quitar-rapido-${debt.id}`}
                          onClick={() => onPayFull(debt)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black rounded-xl transition-all duration-200 shadow-xs hover:shadow-emerald-600/30 cursor-pointer shrink-0"
                          title="Quitar cobrança em 1 clique"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Marcar como pago</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2 animate-bounce" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Nenhum vencimento pendente!</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Todas as suas cobranças estão quitadas ou em dia no filtro selecionado.</p>
            </div>
          )}
        </div>

        {/* Footer Legend */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-2">
          <span className="font-semibold">Legenda de cores:</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Em dia
            </span>
            <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Vencendo
            </span>
            <span className="flex items-center gap-1 text-rose-700 dark:text-rose-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Atrasado
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
