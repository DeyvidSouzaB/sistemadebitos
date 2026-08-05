/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Debt } from '../types';
import { X, DollarSign, Calendar, FileText, Receipt, CheckCircle, Wallet, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { Modal } from './ui/Modal';
import { getTodayString, toSafeISOString, isFutureDate, formatDate } from '../utils/dateUtils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, date: string, note?: string) => void;
  debt: Debt | null;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onSubmit,
  debt,
}: PaymentModalProps) {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && debt) {
      const rounded = Number((debt.currentAmount || 0).toFixed(2));
      setAmount(rounded > 0 ? rounded.toString() : '');
      setDate(getTodayString());
      setNote('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen, debt]);

  // Check debt inside render block for AnimatePresence

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debt) return;
    const rawAmt = parseFloat(String(amount).replace(',', '.'));
    const payAmt = isNaN(rawAmt) ? 0 : Number(rawAmt.toFixed(2));

    if (!Number.isFinite(payAmt) || payAmt <= 0) {
      setError('Insira um valor numérico válido maior que zero.');
      return;
    }

    const maxAllowed = Number((debt.currentAmount || 0).toFixed(2));
    if (payAmt > maxAllowed + 0.001) {
      setError(`O pagamento não pode ser maior que o saldo restante (${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(maxAllowed)}).`);
      return;
    }

    if (!date) {
      setError('A data do pagamento é obrigatória.');
      return;
    }

    setIsSubmitting(true);
    onSubmit(payAmt, toSafeISOString(date), note.trim().slice(0, 500) || undefined);
    onClose();
  };

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  if (!debt) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      bodyClassName="p-0 flex flex-col h-full"
      ariaLabelledBy="payment-modal-title"
    >
      {/* Header Card Section */}
          <div className="shrink-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 sm:p-6 relative border-b border-emerald-500/30">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 flex items-center justify-center text-white border border-white/30 shrink-0">
                  <Receipt className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 id="payment-modal-title" className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    Lançar Pagamento
                  </h3>
                  <p className="text-[11px] sm:text-xs text-emerald-100 mt-0.5 truncate max-w-[210px]">
                    Devedor: <strong className="text-white">{debt.name}</strong>
                  </p>
                </div>
              </div>

              <button
                id="btn-close-pay-modal"
                type="button"
                onClick={onClose}
                aria-label="Fechar lançamento de pagamento"
                className="p-1.5 sm:p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Outstanding Amount Card */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider block">Saldo Restante</span>
                  <span className="text-xs font-semibold text-emerald-700">A ser amortizado</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-black font-mono text-emerald-900 block">
                  {formatBRL(debt.currentAmount)}
                </span>
              </div>
            </div>

            {/* Payment Amount */}
            <div>
              <label htmlFor="input-pay-amount" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Valor Recebido (R$) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-slate-400 text-xs font-black font-mono">
                  R$
                </span>
                <input
                  id="input-pay-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={Number((debt.currentAmount || 0).toFixed(2))}
                  required
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError('');
                  }}
                  placeholder="0,00"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50/80 focus:bg-white text-slate-900 font-mono font-bold border ${
                    error ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15'
                  } rounded-2xl focus:outline-none transition-all text-sm`}
                />
              </div>
              {error && <p className="text-xs text-rose-500 mt-1.5 font-bold flex items-center gap-1">⚠️ {error}</p>}
            </div>

            {/* Date of Payment */}
            <div>
              <label htmlFor="input-pay-date" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Data do Pagamento *
              </label>
              <input
                id="input-pay-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50/80 focus:bg-white text-slate-900 font-mono font-bold border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 rounded-2xl focus:outline-none transition-all text-sm"
              />
              
              {/* Future Date / Scheduled Payment Notice */}
              {isFutureDate(date) && (
                <div className="mt-2.5 p-3.5 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-start gap-3 text-amber-900 text-xs font-medium">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-extrabold text-amber-900">
                      Pagamento Agendado para {formatDate(date)}
                    </p>
                    <p className="text-amber-800 text-[11px] leading-relaxed">
                      Como a data informada é <strong>futura</strong>, o valor ficará agendado e a cobrança <strong>continuará constando como NÃO PAGA no sistema</strong> até o dia do pagamento.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Note */}
            <div>
              <label htmlFor="input-pay-note" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Observação / Nota <span className="text-slate-400 font-normal lowercase">(opcional)</span>
              </label>
              <input
                id="input-pay-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex: Pago via Pix, dinheiro, transferência..."
                className="w-full px-4 py-3 bg-slate-50/80 focus:bg-white text-slate-900 border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 rounded-2xl focus:outline-none transition-all text-sm"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
              <button
                id="btn-cancel-pay"
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                id="btn-submit-pay"
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <CheckCircle className="w-4 h-4 text-emerald-200" />}
                Confirmar Pagamento
              </button>
            </div>
          </form>
    </Modal>
  );
}
