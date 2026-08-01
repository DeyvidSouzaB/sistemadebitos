/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
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
  isLoading = false,
}: ConfirmModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleConfirmClick = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('Erro na confirmação:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStyle = () => {
    switch (type) {
      case 'danger':
        return {
          iconWrapClass: 'bg-rose-500/15 border border-rose-500/30',
          iconClass: 'text-rose-400',
          icon: <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />,
          accentBar: 'bg-rose-500',
          messageBg: 'bg-rose-50/60 border-rose-200/60',
          messageText: 'text-rose-800',
          confirmVariant: 'danger' as const,
          label: 'Ação Destrutiva',
        };
      case 'info':
        return {
          iconWrapClass: 'bg-emerald-500/15 border border-emerald-500/30',
          iconClass: 'text-emerald-400',
          icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />,
          accentBar: 'bg-gradient-to-b from-emerald-500 to-teal-400',
          messageBg: 'bg-emerald-50/60 border-emerald-200/60',
          messageText: 'text-emerald-900',
          confirmVariant: 'primary' as const,
          label: 'Confirmação',
        };
      case 'warning':
      default:
        return {
          iconWrapClass: 'bg-amber-500/15 border border-amber-500/30',
          iconClass: 'text-amber-400',
          icon: <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />,
          accentBar: 'bg-amber-500',
          messageBg: 'bg-amber-50/60 border-amber-200/60',
          messageText: 'text-amber-900',
          confirmVariant: 'primary' as const,
          label: 'Atenção',
        };
    }
  };

  const style = getStyle();
  const loadingState = isLoading || isSubmitting;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      bodyClassName="p-0 flex flex-col h-full"
      ariaLabelledBy="confirm-modal-title"
    >
      {/* Header — dark slate matching navbar */}
      <div className="shrink-0 bg-slate-900 text-white p-4 sm:p-6 relative border-b border-slate-800/80 overflow-hidden">
        {/* Left accent bar */}
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${style.accentBar}`} />

        <div className="flex items-center justify-between gap-3 pl-2">
          <div className="flex items-center gap-3.5">
            {/* Colored icon badge */}
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${style.iconWrapClass} ${style.iconClass} flex items-center justify-center shrink-0`}
            >
              {style.icon}
            </div>
            <div>
              <h3
                id="confirm-modal-title"
                className="text-base sm:text-lg font-black tracking-tight font-display text-white"
              >
                {title}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                {style.label}
              </p>
            </div>
          </div>

          <button
            id="btn-confirm-close"
            type="button"
            onClick={onClose}
            disabled={loadingState}
            aria-label="Fechar janela de confirmação"
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-700 shrink-0 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-white">
        {/* Message Card */}
        <div className={`p-4 sm:p-5 rounded-2xl border ${style.messageBg}`}>
          <div className={`text-xs sm:text-sm font-medium leading-relaxed ${style.messageText}`}>
            {message}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            id="btn-confirm-cancel"
            type="button"
            variant="ghost"
            size="sm"
            disabled={loadingState}
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            id="btn-confirm-ok"
            type="button"
            variant={type === 'danger' ? 'danger' : 'primary'}
            size="sm"
            isLoading={loadingState}
            onClick={handleConfirmClick}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
