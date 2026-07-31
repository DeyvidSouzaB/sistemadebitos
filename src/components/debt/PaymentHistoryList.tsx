import React from 'react';
import { Debt } from '../../types';
import { formatDate, isFutureDate } from '../../utils/dateUtils';
import { CornerDownRight, Clock, CheckCircle, Trash2 } from 'lucide-react';

interface PaymentHistoryListProps {
  debt: Debt;
  onDeletePayment: (debtId: string, paymentId: string) => void;
  formatCurrency: (val: number) => string;
  buttonPrefix?: string;
}

export function PaymentHistoryList({
  debt,
  onDeletePayment,
  formatCurrency,
  buttonPrefix = 'btn',
}: PaymentHistoryListProps) {
  return (
    <div className="pl-3 mt-3 border-l-2 border-emerald-500 space-y-2 pt-1">
      {debt.payments.map((pmt, idx) => (
        <div
          key={`${pmt.id || 'pmt'}-${idx}`}
          className="flex items-center justify-between text-[11px] py-2 hover:bg-slate-50 px-2.5 rounded-xl border border-slate-100/80 transition-all group/item"
        >
          <div className="flex items-start gap-1.5">
            <CornerDownRight className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-slate-800 font-mono">
                  {formatCurrency(pmt.amount)}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {formatDate(pmt.date)}
                </span>
                {isFutureDate(pmt.date) ? (
                  <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200/90 inline-flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5 text-amber-600" />
                    Agendado (Ainda não quitado)
                  </span>
                ) : (
                  <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 inline-flex items-center gap-0.5">
                    <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                    Efetivado
                  </span>
                )}
              </div>
              {pmt.note && (
                <p className="text-slate-500 mt-0.5 text-[11px] leading-relaxed italic">
                  "{pmt.note}"
                </p>
              )}
            </div>
          </div>

          <button
            id={`${buttonPrefix}-del-pmt-${pmt.id}`}
            type="button"
            onClick={() => onDeletePayment(debt.id, pmt.id)}
            aria-label={`Remover pagamento de ${formatCurrency(pmt.amount)}`}
            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg opacity-0 group-hover/item:opacity-100 focus:opacity-100 transition-all shrink-0 cursor-pointer"
            title="Remover este registro de pagamento"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
