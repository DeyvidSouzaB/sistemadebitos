/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, AlertTriangle, Clock, TrendingUp, CheckCircle2, MessageCircle, PlusCircle, Edit3, ChevronRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Debt } from '../../types';
import { formatDate, getEffectivePaidAmount } from '../../utils/dateUtils';
import { formatPhone, getWhatsappUrl, buildWhatsappMessage } from '../../utils/phoneUtils';
import { formatCurrency } from '../../hooks/useDebtCalculations';

interface DevedoresTableProps {
  paginatedDebts: Debt[];
  todayStr: string;
  onSelectDebtor: (debt: Debt) => void;
  onAddPaymentClick: (debt: Debt) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

export const DevedoresTable: React.FC<DevedoresTableProps> = ({
  paginatedDebts,
  todayStr,
  onSelectDebtor,
  onAddPaymentClick,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
      <table className="w-full text-left border-collapse min-w-[880px]">
        <caption className="sr-only">Tabela de Clientes e Cobranças Registradas</caption>
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/60 font-mono">
            <th scope="col" className="py-4 px-5 text-center">Devedor / Cliente</th>
            <th scope="col" className="py-4 px-4 text-center">Status de Cobrança</th>
            <th scope="col" className="py-4 px-4 text-center">Próximo Vencimento</th>
            <th scope="col" className="py-4 px-4 text-center">Valor Original</th>
            <th scope="col" className="py-4 px-4 text-center">Valor Pago</th>
            <th scope="col" className="py-4 px-5 text-center">Valor Total Devido</th>
            <th scope="col" className="py-4 px-5 text-center">Ações Rápidas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          <AnimatePresence>
            {paginatedDebts.map((debt, index) => {
              const isOverdue = debt.dueDate && debt.dueDate.slice(0, 10) < todayStr && debt.currentAmount > 0;
              const totalPaid = getEffectivePaidAmount(debt.payments);
              const initials = debt.name
                ? debt.name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]).join('').toUpperCase()
                : 'DE';

              const msgText = buildWhatsappMessage(debt);
              const whatsappUrl = getWhatsappUrl(debt.phone, msgText);

              return (
                <motion.tr
                  key={`table-${debt.id}-${index}`}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.92, 
                    x: -24, 
                    filter: 'blur(4px)',
                    transition: { duration: 0.2, ease: 'easeOut' } 
                  }}
                  transition={{ duration: 0.25, ease: 'easeOut', delay: index * 0.03 }}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectDebtor(debt)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectDebtor(debt);
                    }
                  }}
                  className={`group cursor-pointer transition-all duration-200 focus:outline-none focus:bg-emerald-50/50 dark:focus:bg-emerald-950/30 ${
                    isOverdue 
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 border-l-4 border-l-rose-500' 
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {/* Devedor Column */}
                  <td className="py-4 px-5 align-middle text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-xs shrink-0 shadow-sm font-mono border ${
                        isOverdue 
                          ? 'bg-gradient-to-br from-rose-600 to-red-700 text-white border-rose-400' 
                          : debt.status === 'paid' 
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700' 
                            : debt.status === 'partial'
                              ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white border-amber-400'
                              : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400'
                      }`}>
                        {initials}
                      </div>
                      
                      <div className="min-w-0 text-left">
                        <span className="block text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate font-display">
                          {debt.name}
                        </span>
                        {debt.phone && (
                          <span className="block text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                            {formatPhone(debt.phone)}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Status Column */}
                  <td className="py-4 px-4 align-middle text-center">
                    {isOverdue && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                        Atrasado
                      </span>
                    )}
                    {!isOverdue && debt.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <Clock className="w-3.5 h-3.5" />
                        Em Aberto
                      </span>
                    )}
                    {!isOverdue && debt.status === 'partial' && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Parcial
                      </span>
                    )}
                    {!isOverdue && debt.status === 'paid' && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Em Dia / Quitado
                      </span>
                    )}
                  </td>

                  {/* Vencimento */}
                  <td className="py-4 px-4 align-middle text-center text-xs font-mono">
                    {debt.dueDate ? (
                      <span className={isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-300 font-medium'}>
                        {formatDate(debt.dueDate)}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600">-</span>
                    )}
                  </td>

                  {/* Original */}
                  <td className="py-4 px-4 align-middle text-center text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
                    {formatCurrency(debt.originalAmount)}
                  </td>

                  {/* Pago */}
                  <td className="py-4 px-4 align-middle text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {totalPaid > 0 ? formatCurrency(totalPaid) : '-'}
                  </td>

                  {/* Saldo Restante */}
                  <td className="py-4 px-5 align-middle text-center text-sm font-black font-mono">
                    <span className={debt.currentAmount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}>
                      {formatCurrency(debt.currentAmount)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 align-middle text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {debt.currentAmount > 0 && (
                        <>
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-500 text-emerald-700 dark:text-emerald-400 hover:text-white rounded-xl transition-all duration-200 cursor-pointer border border-emerald-200 dark:border-emerald-800 shadow-2xs active:scale-95"
                            title="Cobrar via WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          <button
                            onClick={(e) => { e.stopPropagation(); onAddPaymentClick(debt); }}
                            className="p-2 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-500 text-teal-700 dark:text-teal-400 hover:text-white rounded-xl transition-all duration-200 cursor-pointer border border-teal-200 dark:border-teal-800 shadow-2xs active:scale-95"
                            title="Registrar pagamento"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(debt); }}
                        className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-200 cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs active:scale-95"
                        title="Editar cobrança"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectDebtor(debt); }}
                        className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-200 cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs active:scale-95"
                        title="Ver Detalhes do Devedor"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(debt.id); }}
                        className="p-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-600 text-rose-600 dark:text-rose-400 hover:text-white rounded-xl transition-all duration-200 cursor-pointer border border-rose-200 dark:border-rose-800 shadow-2xs active:scale-95"
                        title="Excluir cobrança"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};
