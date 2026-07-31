/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Debt } from '../types';
import { 
  X, 
  User, 
  Phone, 
  Calendar, 
  DollarSign, 
  MessageCircle, 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  History, 
  AlertTriangle, 
  Clock, 
  FileText,
  CornerDownRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { formatDate, getTodayString, getEffectivePaidAmount } from '../utils/dateUtils';
import { formatPhone, getWhatsappUrl, buildWhatsappMessage } from '../utils/phoneUtils';
import { formatCurrency } from '../hooks/useDebtCalculations';
import { Modal } from './ui/Modal';

interface DebtorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  debt: Debt | null;
  onAddPaymentClick: (debt: Debt) => void;
  onPayFull: (debt: Debt) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
  onDeletePayment: (debtId: string, paymentId: string) => void;
}

export default function DebtorDetailModal({
  isOpen,
  onClose,
  debt,
  onAddPaymentClick,
  onPayFull,
  onEdit,
  onDelete,
  onDeletePayment,
}: DebtorDetailModalProps) {
  // AnimatePresence handles conditional rendering

  const todayStr = getTodayString();

  const totalPaid = debt ? getEffectivePaidAmount(debt.payments) : 0;
  const isOverdue = !!(debt?.dueDate && debt.dueDate.slice(0, 10) < todayStr && debt.currentAmount > 0);
  
  const paymentPercentage = (debt && debt.originalAmount > 0)
    ? Math.min(100, (totalPaid / debt.originalAmount) * 100) 
    : 0;

  const msgText = debt ? buildWhatsappMessage(debt) : '';
  const whatsappUrl = debt ? getWhatsappUrl(debt.phone, msgText) : '';

  const initials = debt?.name
    ? debt.name.trim().split(/\s+/).slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'DE';

  if (!debt) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      bodyClassName="p-0 flex flex-col h-full"
      ariaLabelledBy="debtor-detail-modal-title"
    >
      {/* Header */}
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black border shadow-xs ${
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

              <div>
                <div className="flex items-center gap-2">
                  <h3 id="debtor-detail-modal-title" className="text-xl font-black text-slate-900 tracking-tight">{debt.name}</h3>
                  {isOverdue && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      Atrasado
                    </span>
                  )}
                  {debt.status === 'paid' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                      Quitado
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  {debt.phone && (
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <Phone className="w-3.5 h-3.5" />
                      {formatPhone(debt.phone)}
                    </span>
                  )}
                  {debt.dueDate && (
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Vencimento: <strong className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-800'}>{formatDate(debt.dueDate)}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar detalhes do devedor"
              className="p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-slate-200 shadow-xs"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Financial Summary Cards Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Valor Original</span>
                <span className="text-base sm:text-lg font-black text-slate-800 mt-1 block">
                  {formatCurrency(debt.originalAmount)}
                </span>
              </div>

              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-center">
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider block">Total Pago</span>
                <span className="text-base sm:text-lg font-black text-emerald-700 mt-1 block">
                  {formatCurrency(totalPaid)}
                </span>
              </div>

              <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 text-center">
                <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider block">Saldo Devedor</span>
                <span className="text-base sm:text-lg font-black text-rose-600 mt-1 block">
                  {formatCurrency(debt.currentAmount)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-500">Progresso de Quitação</span>
                <span className="text-emerald-700">{paymentPercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${paymentPercentage}%` }}
                />
              </div>
            </div>

            {/* Notes / Description */}
            {debt.description && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  Observações da Cobrança:
                </span>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  "{debt.description}"
                </p>
              </div>
            )}

            {/* History of Payments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-600" />
                  Histórico de Pagamentos Lançados ({debt.payments.length})
                </h4>
              </div>

              {debt.payments.length > 0 ? (
                <div className="space-y-2">
                  {debt.payments.map((pmt, idx) => (
                    <div 
                      key={`${pmt.id || 'pmt'}-${idx}`}
                      className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <CornerDownRight className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm">
                              {formatCurrency(pmt.amount)}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {formatDate(pmt.date)}
                            </span>
                          </div>
                          {pmt.note && (
                            <p className="text-[11px] text-slate-500 italic mt-0.5">"{pmt.note}"</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onDeletePayment(debt.id, pmt.id)}
                        className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                        title="Remover pagamento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-xs font-medium">
                  Nenhum pagamento registrado ainda para este devedor.
                </div>
              )}
            </div>

          </div>

          {/* Footer CTAs */}
          <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onEdit(debt);
                  onClose();
                }}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-extrabold rounded-xl transition-all cursor-pointer border border-slate-200 shadow-2xs flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4 text-slate-500" />
                <span>Editar</span>
              </button>

              <button
                onClick={() => {
                  onDelete(debt.id);
                  onClose();
                }}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                title="Excluir cobrança"
              >
                <Trash2 className="w-4 h-4" />
                <span>Excluir</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {debt.currentAmount > 0 && (
                <>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Cobrar via WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      onAddPaymentClick(debt);
                      onClose();
                    }}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Registrar Pagamento</span>
                  </button>
                </>
              )}
            </div>
          </div>
    </Modal>
  );
}
