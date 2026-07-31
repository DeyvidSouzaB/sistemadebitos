import React from 'react';
import { motion } from 'motion/react';
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
  MessageCircle,
  Phone,
  Clock
} from 'lucide-react';

interface DebtTableRowProps {
  debt: Debt;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
  onAddPaymentClick: (debt: Debt) => void;
  onPayFull: (debt: Debt) => void;
  onDeletePayment: (debtId: string, paymentId: string) => void;
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
}

export function DebtTableRow({
  debt,
  onEdit,
  onDelete,
  onAddPaymentClick,
  onPayFull,
  onDeletePayment,
  isExpanded,
  setIsExpanded,
}: DebtTableRowProps) {
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
    <>
      <motion.tr
        id={`debt-table-row-${debt.id}`}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ 
          opacity: 0, 
          scale: 0.92, 
          x: -24, 
          filter: 'blur(4px)',
          transition: { duration: 0.2, ease: 'easeOut' } 
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`group transition-colors border-b border-slate-100 gpu-accelerate ${
          isOverdue 
            ? 'bg-red-50/10 hover:bg-red-50/20' 
            : 'hover:bg-slate-50/50'
        }`}
      >
        {/* Devedor Column */}
        <td className="py-4 px-5 align-middle">
          <div className="flex items-center gap-3.5">
            <div className={`w-9.5 h-9.5 rounded-xl flex items-center justify-center font-black text-xs shrink-0 select-none border transition-transform duration-200 group-hover:scale-105 ${statusColorConfig.avatar}`}>
              {initials}
            </div>
            <div className="min-w-0">
              <span className="block text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                {debt.name}
              </span>
              {debt.description && (
                <span className="block text-[11px] text-slate-400 truncate max-w-[220px] italic">
                  {debt.description}
                </span>
              )}
            </div>
          </div>
        </td>

        {/* Status Column */}
        <td className="py-4 px-4 align-middle">
          <div className="flex flex-col items-start gap-1">
            {debt.status === 'paid' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Quitada
              </span>
            )}
            {debt.status === 'partial' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Parcial ({paymentPercentage.toFixed(0)}%)
              </span>
            )}
            {debt.status === 'pending' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                Pendente
              </span>
            )}
            {scheduledPaid > 0 && (
              <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs" title={`Pagamento de ${formatCurrency(scheduledPaid)} agendado para ${formatDate(scheduledPayments[0]?.date)} (Ainda não quitado no sistema)`}>
                <Clock className="w-3 h-3 text-amber-700" />
                Agendado: {formatCurrency(scheduledPaid)}
              </span>
            )}
            {isOverdue && (
              <span className="inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 mt-0.5">
                <AlertTriangle className="w-3 h-3" />
                Atrasado
              </span>
            )}
          </div>
        </td>

        {/* Vencimento Column */}
        <td className="py-4 px-4 align-middle text-xs font-mono">
          {debt.dueDate ? (
            <span className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(debt.dueDate)}
            </span>
          ) : (
            <span className="text-slate-300">-</span>
          )}
        </td>

        {/* Original Column */}
        <td className="py-4 px-4 align-middle text-right text-xs font-mono font-semibold text-slate-500">
          {formatCurrency(debt.originalAmount)}
        </td>

        {/* Pago Column */}
        <td className="py-4 px-4 align-middle text-right text-xs font-mono font-bold text-emerald-600">
          {totalPaid > 0 ? formatCurrency(totalPaid) : '-'}
        </td>

        {/* Saldo Column */}
        <td className="py-4 px-5 align-middle text-right text-sm font-mono font-black text-slate-900">
          <span className={debt.currentAmount > 0 ? 'text-rose-600' : 'text-slate-400'}>
            {formatCurrency(debt.currentAmount)}
          </span>
        </td>

        {/* Ações Column */}
        <td className="py-4 px-5 align-middle text-center" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {debt.status !== 'paid' && (
              <>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={debt.phone ? `Cobrar ${debt.name} no WhatsApp (${formatPhone(debt.phone)})` : 'Enviar cobrança no WhatsApp'}
                  className="p-1.5 text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200"
                  title={debt.phone ? `Cobrar ${debt.name} no WhatsApp (${formatPhone(debt.phone)})` : 'Enviar cobrança no WhatsApp'}
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <button
                  id={`btn-table-add-pay-${debt.id}`}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onAddPaymentClick(debt); }}
                  aria-label="Lançar pagamento parcial"
                  className="p-1.5 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors cursor-pointer border border-teal-100"
                  title="Lançar pagamento parcial"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
                <button
                  id={`btn-table-full-pay-${debt.id}`}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onPayFull(debt); }}
                  aria-label="Quitar totalmente"
                  className="p-1.5 text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-100"
                  title="Quitar totalmente"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              id={`btn-table-edit-${debt.id}`}
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit(debt); }}
              aria-label="Editar cobrança"
              className="p-1.5 text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100"
              title="Editar cobrança"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              id={`btn-table-delete-${debt.id}`}
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete(debt.id); }}
              aria-label="Excluir cobrança"
              className="p-1.5 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer border border-rose-100"
              title="Excluir cobrança"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {debt.payments.length > 0 && (
              <button
                id={`btn-table-toggle-hist-${debt.id}`}
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                aria-label={isExpanded ? 'Ocultar histórico de pagamentos' : 'Ver histórico de pagamentos'}
                className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer border ${
                  isExpanded 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/10' 
                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-100'
                }`}
                title={isExpanded ? 'Ocultar Histórico' : 'Ver Histórico'}
              >
                <History className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </motion.tr>

      {/* Expandable History Row */}
      {isExpanded && debt.payments.length > 0 && (
        <tr className="bg-slate-50/50">
          <td colSpan={7} className="px-6 py-4 border-b border-slate-100">
            <div className="pl-4 border-l-2 border-emerald-500 space-y-2.5 max-w-2xl">
              <div className="flex items-center gap-1.5 mb-1">
                <History className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Histórico de Pagamentos Lançados
                </span>
              </div>
              <PaymentHistoryList
                debt={debt}
                onDeletePayment={onDeletePayment}
                formatCurrency={formatCurrency}
                buttonPrefix="btn-table"
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
