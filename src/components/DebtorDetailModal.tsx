/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Debt } from '../types';
import { 
  X, 
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
  FileText,
  CornerDownRight,
  TrendingUp,
  Receipt,
  ShieldCheck,
  CreditCard
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
  const todayStr = getTodayString();

  const totalPaid = debt ? getEffectivePaidAmount(debt.payments) : 0;
  const isOverdue = !!(debt?.dueDate && debt.dueDate.slice(0, 10) < todayStr && debt.currentAmount > 0);
  const isPaid = debt?.status === 'paid' || debt?.currentAmount === 0;
  const isPartial = !isPaid && totalPaid > 0;
  
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
      bodyClassName="p-0 flex flex-col h-full bg-slate-50/30"
      ariaLabelledBy="debtor-detail-modal-title"
    >
      {/* Header */}
      <div className="p-5 sm:p-6 bg-white border-b border-slate-200/80 flex items-start justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {/* Avatar Icon */}
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-lg sm:text-xl font-black shadow-sm transition-transform duration-200 hover:scale-105 shrink-0 ${
            isOverdue 
              ? 'bg-gradient-to-br from-rose-50 to-rose-100 text-rose-700 border border-rose-200/80 ring-4 ring-rose-50/50' 
              : isPaid 
                ? 'bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-700 border border-emerald-200/80 ring-4 ring-emerald-50/50' 
                : isPartial
                  ? 'bg-gradient-to-br from-amber-50 to-orange-100 text-amber-700 border border-amber-200/80 ring-4 ring-amber-50/50'
                  : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 border border-slate-200 ring-4 ring-slate-100/50'
          }`}>
            {initials}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 id="debtor-detail-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {debt.name}
              </h3>
              
              {/* Status Pill Badges */}
              {isOverdue && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                  Atrasado
                </span>
              )}
              {isPaid && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Quitado
                </span>
              )}
              {isPartial && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wider shadow-2xs">
                  Parcial
                </span>
              )}
            </div>

            {/* Quick Meta details */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
              {debt.phone && (
                <a 
                  href={whatsappUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-700 font-semibold border border-emerald-200/60 transition-colors cursor-pointer"
                  title="Abrir WhatsApp"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{formatPhone(debt.phone)}</span>
                </a>
              )}
              {debt.dueDate && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 text-slate-700 font-medium border border-slate-200/60">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  Vencimento: <strong className={isOverdue ? 'text-rose-600 font-extrabold' : 'text-slate-800 font-bold'}>{formatDate(debt.dueDate)}</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar detalhes do devedor"
          className="p-2.5 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all cursor-pointer border border-slate-200/80 shadow-2xs hover:rotate-90 duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Modal Body Content */}
      <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
        
        {/* Financial Summary Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Card 1: Valor Original */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 relative overflow-hidden group hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Valor Original</span>
              <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(debt.originalAmount)}
            </div>
          </div>

          {/* Card 2: Total Pago */}
          <div className="bg-gradient-to-br from-emerald-50/70 to-teal-50/40 p-4 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-2 relative overflow-hidden group hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Total Pago</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight">
              {formatCurrency(totalPaid)}
            </div>
          </div>

          {/* Card 3: Saldo Devedor */}
          <div className={`p-4 rounded-2xl border shadow-2xs space-y-2 relative overflow-hidden group transition-all ${
            isPaid 
              ? 'bg-slate-50/80 border-slate-200 text-slate-400' 
              : isOverdue
                ? 'bg-gradient-to-br from-rose-50/80 to-pink-50/40 border-rose-200/80 hover:border-rose-300'
                : 'bg-gradient-to-br from-amber-50/70 to-orange-50/40 border-amber-200/80 hover:border-amber-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                isPaid ? 'text-slate-500' : isOverdue ? 'text-rose-800' : 'text-amber-800'
              }`}>
                Saldo Devedor
              </span>
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                isPaid ? 'bg-slate-100 text-slate-500' : isOverdue ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {isPaid ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              </div>
            </div>
            <div className={`text-xl sm:text-2xl font-black tracking-tight ${
              isPaid ? 'text-slate-400 line-through decoration-slate-300' : isOverdue ? 'text-rose-600' : 'text-amber-700'
            }`}>
              {formatCurrency(debt.currentAmount)}
            </div>
          </div>

        </div>

        {/* Enhanced Progress Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-600 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Progresso de Quitação
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-black">
              {paymentPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/80 shadow-inner">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${paymentPercentage}%` }}
            />
          </div>
        </div>

        {/* Notes Card */}
        {debt.description && (
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-l-4 border-l-emerald-500 border-slate-200/90 shadow-2xs space-y-1.5">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Observações da Cobrança
            </span>
            <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed pl-6 border-l border-slate-200/60 my-1">
              "{debt.description}"
            </p>
          </div>
        )}

        {/* History of Payments */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <History className="w-4.5 h-4.5 text-emerald-600" />
              Histórico de Pagamentos Lançados
            </h4>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200/60">
              {debt.payments.length} {debt.payments.length === 1 ? 'registro' : 'registros'}
            </span>
          </div>

          {debt.payments.length > 0 ? (
            <div className="space-y-2.5">
              {debt.payments.map((pmt, idx) => (
                <div 
                  key={`${pmt.id || 'pmt'}-${idx}`}
                  className="p-3.5 bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-emerald-300 rounded-xl flex items-center justify-between gap-3 text-xs transition-all shadow-2xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100/80 flex items-center justify-center text-emerald-700 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <CornerDownRight className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">
                          {formatCurrency(pmt.amount)}
                        </span>
                        <span className="text-[11px] text-slate-500 font-semibold bg-white px-2 py-0.5 rounded-md border border-slate-200/60">
                          {formatDate(pmt.date)}
                        </span>
                      </div>
                      {pmt.note && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">"{pmt.note}"</p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeletePayment(debt.id, pmt.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-rose-200/60"
                    title="Remover pagamento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200/80 space-y-2">
              <CreditCard className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-500">Nenhum pagamento registrado ainda.</p>
            </div>
          )}
        </div>

      </div>

      {/* Footer CTAs */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 sticky bottom-0 z-10 shadow-lg">
        {/* Left Side Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onEdit(debt);
              onClose();
            }}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200 shadow-2xs flex items-center gap-1.5 active:scale-95"
          >
            <Edit3 className="w-4 h-4 text-slate-500" />
            <span>Editar</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onDelete(debt.id);
              onClose();
            }}
            className="px-3.5 py-2.5 bg-rose-50/80 hover:bg-rose-100 text-rose-700 border border-rose-200/80 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            title="Excluir cobrança"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Excluir</span>
          </button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {debt.currentAmount > 0 && (
            <>
              {debt.phone && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Cobrar via WhatsApp</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  onAddPaymentClick(debt);
                  onClose();
                }}
                className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-md shadow-teal-600/20 cursor-pointer flex items-center gap-2"
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

