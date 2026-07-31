/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Phone, MessageCircle, PlusCircle, Edit3, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Debt } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { formatPhone, getWhatsappUrl, buildWhatsappMessage } from '../../utils/phoneUtils';
import { formatCurrency } from '../../hooks/useDebtCalculations';

interface DevedoresGridProps {
  paginatedDebts: Debt[];
  todayStr: string;
  onSelectDebtor: (debt: Debt) => void;
  onAddPaymentClick: (debt: Debt) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

export const DevedoresGrid: React.FC<DevedoresGridProps> = ({
  paginatedDebts,
  todayStr,
  onSelectDebtor,
  onAddPaymentClick,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {paginatedDebts.map((debt, index) => {
          const isOverdue = debt.dueDate && debt.dueDate.slice(0, 10) < todayStr && debt.currentAmount > 0;
          const initials = debt.name
            ? debt.name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]).join('').toUpperCase()
            : 'DE';

          const msgText = buildWhatsappMessage(debt);
          const whatsappUrl = getWhatsappUrl(debt.phone, msgText);

          return (
            <motion.div
              key={`grid-${debt.id}-${index}`}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ 
                opacity: 0, 
                scale: 0.88, 
                y: 16, 
                filter: 'blur(4px)',
                transition: { duration: 0.2, ease: 'easeOut' } 
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              role="button"
              tabIndex={0}
              onClick={() => onSelectDebtor(debt)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectDebtor(debt);
                }
              }}
              className={`bg-white border ${
                isOverdue ? 'border-rose-300' : 'border-slate-200/90'
              } hover:border-emerald-300 rounded-3xl p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs border ${
                      isOverdue 
                        ? 'bg-rose-100 text-rose-700 border-rose-200' 
                        : debt.status === 'paid' 
                          ? 'bg-slate-100 text-slate-600 border-slate-200' 
                          : debt.status === 'partial'
                            ? 'bg-amber-100 text-amber-700 border-amber-200'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    }`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                        {debt.name}
                      </h3>
                    </div>
                  </div>

                  {isOverdue && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[9px] font-black uppercase">
                      Atrasado
                    </span>
                  )}
                </div>

                {/* Amount Box */}
                <div className="my-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Valor Original</span>
                    <span className="text-slate-700 font-bold">{formatCurrency(debt.originalAmount)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-rose-600 uppercase font-black block">Total Devido</span>
                    <span className="text-rose-600 font-black text-sm">{formatCurrency(debt.currentAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                <span className="text-[11px] text-slate-500 font-medium">
                  Venc: {debt.dueDate ? formatDate(debt.dueDate) : 'Sem data'}
                </span>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {debt.currentAmount > 0 && (
                    <>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs"
                        title="Cobrar via WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Cobrar</span>
                      </a>

                      <button
                        onClick={(e) => { e.stopPropagation(); onAddPaymentClick(debt); }}
                        className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs"
                        title="Registrar pagamento"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Pagar</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(debt); }}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer border border-slate-200"
                    title="Editar cobrança"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(debt.id); }}
                    className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl transition-all cursor-pointer border border-rose-200"
                    title="Excluir cobrança"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
