/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
}: ConfirmModalProps) {
  // Determine styling based on confirmation type
  const getColors = () => {
    switch (type) {
      case 'danger':
        return {
          bgBadge: 'from-rose-500 to-rose-600 text-white shadow-rose-500/25',
          confirmBtn: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-rose-600/20',
          icon: <AlertCircle className="w-6 h-6" />
        };
      case 'info':
        return {
          bgBadge: 'from-emerald-600 to-teal-600 text-white shadow-emerald-600/25',
          confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-600/20',
          icon: <HelpCircle className="w-6 h-6" />
        };
      case 'warning':
      default:
        return {
          bgBadge: 'from-amber-500 to-amber-600 text-white shadow-amber-500/25',
          confirmBtn: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-amber-500/20',
          icon: <AlertTriangle className="w-6 h-6" />
        };
    }
  };

  const style = getColors();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      bodyClassName="p-0 flex flex-col h-full"
      ariaLabelledBy="confirm-modal-title"
    >
      {/* Header */}
      <div className="shrink-0 bg-slate-900 text-white p-4 sm:p-6 relative border-b border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br ${style.bgBadge} flex items-center justify-center text-white shadow-lg shrink-0`}>
              {style.icon}
            </div>
            <div>
              <h3 id="confirm-modal-title" className="text-base sm:text-lg font-black tracking-tight text-white">
                {title}
              </h3>
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                Confirmação de Ação
              </p>
            </div>
          </div>

          <button
            id="btn-confirm-close"
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de confirmação"
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
            {message}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-3">
          <Button
            id="btn-confirm-cancel"
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            id="btn-confirm-ok"
            type="button"
            variant={type === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
