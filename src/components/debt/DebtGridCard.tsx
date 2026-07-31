/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Debt } from '../../types';
import { useDebtCalculations } from '../../hooks/useDebtCalculations';
import { PaymentHistoryList } from './PaymentHistoryList';
import { 
  Trash2, 
  Edit3, 
  CheckCircle, 
  History, 
  Calendar, 
  AlertTriangle, 
  PlusCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare,
  MessageCircle,
  Clock
} from 'lucide-react';

interface DebtGridCardProps {
  debt: Debt;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
  onAddPaymentClick: (debt: Debt) => void;
  onPayFull: (debt: Debt) => void;
  onDeletePayment: (debtId: string, paymentId: string) => void;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
}

export function DebtGridCard({
  debt,
  onEdit,
  onDelete,
  onAddPaymentClick,
  onPayFull,
  onDeletePayment,
  isExpanded,
  setIsExpanded,
}: DebtGridCardProps) {
  const {
    totalPaid,
    scheduledPaid,
    scheduledPayments,
    paymentPercentage,
    isOverdue,
    initials,
    whatsappUrl,
    statusColorConfig,
    formatCurrency,
    formatDate,
    formatPhone,
  } = useDebtCalculations(debt);

  return (
    <div className="w-full">
      <motion.div
        id={`debt-card-${debt.id}`}
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
        className={`bg-white dark:bg-slate-900/90 rounded-3xl border ${
          isOverdue 
            ? 'border-rose-300 dark:border-rose-900/80 shadow-rose-950/10 ring-1 ring-rose-500/20 hover:shadow-2xl' 
            : 'border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1'
        } p-5 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-full gpu-accelerate`}
      >
        {/* Top subtle horizontal gradient highlight bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl ${
          isOverdue 
            ? 'bg-gradient-to-r from-rose-500 via-rose-600 to-red-700' 
            : debt.status === 'paid' 
              ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600' 
              : debt.status === 'partial' 
                ? 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600' 
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600'
        }`} />

        <div className="pt-1">
          {/* Card Header Section */}
          <div className="flex items-start gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm shrink-0 border select-none transition-transform duration-200 group-hover:scale-105 shadow-sm font-mono ${
              isOverdue
                ? 'bg-gradient-to-br from-rose-600 to-red-700 text-white border-rose-400'
                : debt.status === 'paid'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400'
            }`}>
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight truncate font-display max-w-[180px] sm:max-w-none" title={debt.name}>
                  {debt.name}
                </h4>
                
                {isOverdue && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shrink-0">
                    <AlertTriangle className="w-2.5 h-2.5 animate-pulse" />
                    Atrasado
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 items-center">
                {debt.status === 'paid' && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Quitada
                  </span>
                )}
                {debt.status === 'partial' && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    Parcial ({paymentPercentage.toFixed(0)}%)
                  </span>
                )}
                {debt.status === 'pending' && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                    Pendente
                  </span>
                )}
              </div>
            </div>
          </div>

          {scheduledPaid > 0 && (
            <div className="mt-3 p-2.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200/90 dark:border-amber-800/80 rounded-xl flex items-center justify-between text-amber-900 dark:text-amber-200 text-xs shadow-2xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div>
                  <p className="font-extrabold text-[11px] leading-tight text-amber-950 dark:text-amber-100">
                    Pagamento Agendado: {formatCurrency(scheduledPaid)}
                  </p>
                  <p className="text-[10px] text-amber-800 dark:text-amber-300">
                    Data: {formatDate(scheduledPayments[0]?.date)} • <strong className="text-amber-900 dark:text-amber-200">Ainda não quitado no sistema</strong>
                  </p>
                </div>
              </div>
            </div>
          )}

          {debt.description && (
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-3 flex items-start gap-2 bg-slate-50/90 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 italic leading-relaxed">
              <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
              <span className="line-clamp-2">{debt.description}</span>
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Origem: <strong className="text-slate-700 dark:text-slate-300 font-bold font-mono">{formatDate(debt.createdAt)}</strong></span>
            </div>
            {debt.dueDate && (
              <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-rose-600 dark:text-rose-400 font-bold' : ''}`}>
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Vence: <strong className={`font-bold font-mono ${isOverdue ? 'text-rose-600 dark:text-rose-400 font-black' : 'text-slate-700 dark:text-slate-300'}`}>{formatDate(debt.dueDate)}</strong></span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1 bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 mt-3.5 text-center shadow-2xs font-mono">
            <div className="min-w-0">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-black">Original</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{formatCurrency(debt.originalAmount)}</span>
            </div>

            <div className="min-w-0 border-x border-slate-200/80 dark:border-slate-700/80 px-1">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-black">Pago</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 truncate block mt-0.5">{totalPaid > 0 ? formatCurrency(totalPaid) : '-'}</span>
            </div>

            <div className="min-w-0">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-black">Saldo</span>
              <span className={`text-xs sm:text-sm font-black truncate block mt-0.5 ${debt.currentAmount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {formatCurrency(debt.currentAmount)}
              </span>
            </div>
          </div>

          {debt.originalAmount > 0 && debt.status !== 'paid' && (
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, paymentPercentage)}%` }}
                />
              </div>
              <span className="text-xs font-black text-slate-500 dark:text-slate-400 shrink-0 min-w-[32px] text-right font-mono">
                {paymentPercentage.toFixed(0)}%
              </span>
            </div>
          )}
        </div>

        <div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            {debt.payments.length > 0 ? (
              <button
                id={`btn-toggle-hist-${debt.id}`}
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 text-xs text-teal-700 dark:text-teal-300 hover:text-teal-900 font-bold focus:outline-none transition-all duration-200 cursor-pointer bg-teal-50/80 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 px-3 py-2 rounded-xl border border-teal-100 dark:border-teal-800/80 active:scale-95 h-9 sm:h-10 shrink-0"
              >
                <History className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{isExpanded ? 'Ocultar' : `Histórico (${debt.payments.length})`}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-1.5 ml-auto" onClick={(e) => e.stopPropagation()}>
              {debt.status !== 'paid' && (
                <>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="h-9 sm:h-10 px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all duration-200 cursor-pointer shadow-xs active:scale-95 flex items-center justify-center gap-1.5 font-bold text-xs shrink-0"
                    title={debt.phone ? `Cobrar ${debt.name} via WhatsApp (${formatPhone(debt.phone)})` : 'Enviar cobrança via WhatsApp'}
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Cobrar</span>
                  </a>

                  <button
                    id={`btn-add-pay-${debt.id}`}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onAddPaymentClick(debt); }}
                    aria-label="Lançar pagamento parcial"
                    className="w-9 h-9 sm:w-10 sm:h-10 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 hover:bg-teal-600 hover:text-white rounded-xl transition-all duration-200 cursor-pointer border border-teal-200 dark:border-teal-800 shadow-2xs active:scale-95 flex items-center justify-center shrink-0"
                    title="Lançar pagamento parcial"
                  >
                    <PlusCircle className="w-4 h-4 shrink-0" />
                  </button>

                  <button
                    id={`btn-full-pay-${debt.id}`}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onPayFull(debt); }}
                    aria-label="Quitar totalmente"
                    className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-600 hover:text-white rounded-xl transition-all duration-200 cursor-pointer border border-emerald-200 dark:border-emerald-800 shadow-2xs active:scale-95 flex items-center justify-center shrink-0"
                    title="Quitar totalmente"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  </button>
                </>
              )}

              <button
                id={`btn-edit-${debt.id}`}
                type="button"
                onClick={(e) => { e.stopPropagation(); onEdit(debt); }}
                aria-label="Editar cobrança"
                className="w-9 h-9 sm:w-10 sm:h-10 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-800 hover:text-white dark:hover:bg-slate-700 rounded-xl transition-all duration-200 cursor-pointer border border-slate-200 dark:border-slate-700 shadow-2xs active:scale-95 flex items-center justify-center shrink-0"
                title="Editar cobrança"
              >
                <Edit3 className="w-4 h-4 shrink-0" />
              </button>

              <button
                id={`btn-delete-${debt.id}`}
                type="button"
                onClick={(e) => { e.stopPropagation(); onDelete(debt.id); }}
                aria-label="Excluir cobrança"
                className="w-9 h-9 sm:w-10 sm:h-10 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-600 hover:text-white rounded-xl transition-all duration-200 cursor-pointer border border-rose-200 dark:border-rose-800 shadow-2xs active:scale-95 flex items-center justify-center shrink-0"
                title="Excluir cobrança"
              >
                <Trash2 className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isExpanded && debt.payments.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <PaymentHistoryList
                  debt={debt}
                  onDeletePayment={onDeletePayment}
                  formatCurrency={formatCurrency}
                  buttonPrefix="btn"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
