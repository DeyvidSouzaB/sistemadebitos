/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Clock, ChevronRight, Calendar, MessageCircle, Check, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Debt } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { formatPhone, getWhatsappUrl, buildWhatsappMessage } from '../../utils/phoneUtils';
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
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="w-full bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Agenda Financeira
              </span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
                Próximos Vencimentos
              </h3>
            </div>

            <button
              onClick={() => onSelectOption('prazos')}
              className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-all cursor-pointer flex items-center gap-1 shrink-0"
            >
              <span>Ver Todos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingDebts.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence>
                {upcomingDebts.map((debt, index) => {
                  const statusInfo = getStatusInfo(debt);

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
                      className="group p-4 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-extrabold text-slate-900 truncate">{debt.name}</h4>
                          <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-md border ${statusInfo.colorClass}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
                            {statusInfo.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Vence: <strong className="text-slate-800">{formatDate(debt.dueDate!)}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                        <span className="text-base font-black text-slate-900 mr-1">
                          {formatCurrency(debt.currentAmount)}
                        </span>

                        {debt.phone && (
                          <a
                            href={getWhatsappUrl(debt.phone, buildWhatsappMessage(debt))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-2xs"
                            title="Cobrar via WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        )}

                        <button
                          id={`btn-quitar-rapido-${debt.id}`}
                          onClick={() => onPayFull(debt)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-2xs cursor-pointer shrink-0"
                          title="Quitar cobrança em 1 clique"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Marcar como pago</span>
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
              <p className="text-xs font-bold text-slate-700">Nenhum vencimento pendente!</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Todas as suas cobranças estão quitadas ou em dia.</p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold">Legenda de cores:</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Em dia
            </span>
            <span className="flex items-center gap-1 text-amber-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Vencendo
            </span>
            <span className="flex items-center gap-1 text-rose-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Atrasado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
