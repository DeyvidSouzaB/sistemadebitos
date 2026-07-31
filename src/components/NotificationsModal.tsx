/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Debt } from '../types';
import { Bell, AlertTriangle, Clock, CheckCircle2, MessageCircle, X, ChevronRight } from 'lucide-react';
import { formatDate, getTodayString } from '../utils/dateUtils';
import { getWhatsappUrl, formatPhone, buildWhatsappMessage } from '../utils/phoneUtils';
import { formatCurrency } from '../hooks/useDebtCalculations';
import { Modal } from './ui/Modal';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  debts: Debt[];
  onPayFull: (debt: Debt) => void;
  onOpenPaymentModal: (debt: Debt) => void;
}

export default function NotificationsModal({
  isOpen,
  onClose,
  debts,
  onPayFull,
  onOpenPaymentModal,
}: NotificationsModalProps) {
  const todayStr = getTodayString();

  // Overdue
  const overdueDebts = debts.filter(d => {
    if (d.status === 'paid' || d.currentAmount <= 0) return false;
    if (!d.dueDate) return false;
    return d.dueDate.slice(0, 10) < todayStr;
  });

  // Due Soon (next 5 days including today)
  const dueSoonDebts = debts.filter(d => {
    if (d.status === 'paid' || d.currentAmount <= 0) return false;
    if (!d.dueDate) return false;
    const due = d.dueDate.slice(0, 10);
    const in5Days = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    return due >= todayStr && due <= in5Days;
  });

  // AnimatePresence handles visibility via isOpen check in JSX

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      bodyClassName="p-0 flex flex-col h-full"
      ariaLabelledBy="notifications-modal-title"
    >
      {/* Header */}
          <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 id="notifications-modal-title" className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                  Notificações & Lembretes
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                    {overdueDebts.length + dueSoonDebts.length} pendentes
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Lembretes automáticos de vencimento e alertas de cobranças em atraso
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar janela de notificações"
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer border border-slate-700/50 shrink-0"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
            {/* Overdue Section */}
            {overdueDebts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    Cobranças em Atraso ({overdueDebts.length})
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {overdueDebts.map((d, index) => {
                    const msg = buildWhatsappMessage(d);
                    const waUrl = getWhatsappUrl(d.phone, msg);

                    return (
                      <div
                        key={`overdue-${d.id}-${index}`}
                        className="p-4 bg-white rounded-2xl border border-rose-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-extrabold text-slate-900">{d.name}</h5>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 border border-rose-200">
                              Venceu {formatDate(d.dueDate!)}
                            </span>
                          </div>
                          {d.phone && (
                            <span className="text-xs text-slate-500 block mt-0.5">
                              {formatPhone(d.phone)}
                            </span>
                          )}
                          <span className="text-sm font-black text-rose-600 mt-1 block">
                            {formatCurrency(d.currentAmount)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Cobrar</span>
                          </a>

                          <button
                            onClick={() => {
                              onPayFull(d);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Dar Baixa</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Due Soon Section */}
            {dueSoonDebts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Vencendo nos Próximos Dias ({dueSoonDebts.length})
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {dueSoonDebts.map((d, index) => {
                    const msg = buildWhatsappMessage(d);
                    const waUrl = getWhatsappUrl(d.phone, msg);

                    return (
                      <div
                        key={`duesoon-${d.id}-${index}`}
                        className="p-4 bg-white rounded-2xl border border-amber-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-extrabold text-slate-900">{d.name}</h5>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                              Vence {formatDate(d.dueDate!)}
                            </span>
                          </div>
                          {d.phone && (
                            <span className="text-xs text-slate-500 block mt-0.5">
                              {formatPhone(d.phone)}
                            </span>
                          )}
                          <span className="text-sm font-black text-amber-700 mt-1 block">
                            {formatCurrency(d.currentAmount)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Lembrar</span>
                          </a>

                          <button
                            onClick={() => {
                              onPayFull(d);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Dar Baixa</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {overdueDebts.length === 0 && dueSoonDebts.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
                <h4 className="text-base font-extrabold text-slate-800">Tudo sob controle!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Não há cobranças atrasadas ou vencendo nos próximos dias.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Entendido
            </button>
          </div>
    </Modal>
  );
}
