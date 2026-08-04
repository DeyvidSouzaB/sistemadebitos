/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Debt } from '../types';
import DebtModal from './DebtModal';
import PaymentModal from './PaymentModal';
import BackupModal from './BackupModal';
import ConfirmModal from './ConfirmModal';
import SqlModal from './SqlModal';
import NotificationsModal from './NotificationsModal';
import DebtorDetailModal from './DebtorDetailModal';
import { formatPhone } from '../utils/phoneUtils';
import { formatCurrency } from '../hooks/useDebtCalculations';

// ── Modal Type Union ─────────────────────────────────────────────────────────
export type ModalType =
  | 'add'
  | 'edit'
  | 'detail'
  | 'payment'
  | 'backup'
  | 'sql'
  | 'notifications'
  | 'confirm_clear_db'
  | 'confirm_load_demo'
  | null;

export interface DebtFormData {
  name: string;
  phone?: string;
  originalAmount: number;
  createdAt: string;
  dueDate?: string;
  description?: string;
}

export interface ModalManagerProps {
  // Consolidated modal state
  activeModal: ModalType;
  debtIdToDelete: string | null;

  // Data
  debts: Debt[];
  activeSelectedDebt: Debt | null;

  // Close handlers
  onCloseModal: () => void;
  onCancelDelete: () => void;

  // Action handlers
  onSaveDebt: (formData: DebtFormData) => void;
  onAddPayment: (amount: number, date: string, note?: string) => void;
  onImportBackup: (debts: Debt[], mode: 'merge' | 'replace') => void;
  onPayFull: (debt: Debt) => void;
  onDeletePayment: (debtId: string, paymentId: string) => void;
  onOpenPaymentModal: (debt: Debt) => void;
  onOpenEditModal: (debt: Debt) => void;
  onDeleteFromDetail: (id: string) => void;
  onConfirmDeleteDebt: () => void;
  onConfirmClearDb: () => void;
  onConfirmLoadDemo: () => void;
}

export default function ModalManager({
  activeModal,
  debtIdToDelete,
  debts,
  activeSelectedDebt,
  onCloseModal,
  onCancelDelete,
  onSaveDebt,
  onAddPayment,
  onImportBackup,
  onPayFull,
  onDeletePayment,
  onOpenPaymentModal,
  onOpenEditModal,
  onDeleteFromDetail,
  onConfirmDeleteDebt,
  onConfirmClearDb,
  onConfirmLoadDemo,
}: ModalManagerProps) {
  // Resolved from the live debts list (not stale prop) to prevent IIFE anti-pattern
  const debtToDelete = useMemo(
    () => debts.find((d) => d.id === debtIdToDelete) ?? null,
    [debts, debtIdToDelete]
  );

  // ── Confirmation modal messages ────────────────────────────────────────────
  const deleteMessage = debtToDelete ? (
    <div className="space-y-3">
      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
        Tem certeza de que deseja excluir permanentemente este registro de cobrança e todo o seu histórico financeiro?
      </p>
      <div className="p-3.5 bg-white rounded-2xl border border-rose-200/90 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-slate-500 font-semibold">Cliente / Devedor:</span>
          <span className="font-extrabold text-slate-900 truncate max-w-[200px]">{debtToDelete.name}</span>
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-slate-500 font-semibold">Valor Inicial:</span>
          <span className="font-bold text-slate-700 font-mono">{formatCurrency(debtToDelete.originalAmount)}</span>
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-slate-500 font-semibold">Saldo Devedor Atual:</span>
          <span className="font-black text-rose-600 font-mono">{formatCurrency(debtToDelete.currentAmount)}</span>
        </div>
        {debtToDelete.phone && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold">Telefone:</span>
            <span className="font-medium text-slate-600">{formatPhone(debtToDelete.phone)}</span>
          </div>
        )}
        {debtToDelete.payments?.length > 0 && (
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="font-medium">Histórico de Pagamentos:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              {debtToDelete.payments.length} lançamento(s)
            </span>
          </div>
        )}
      </div>
      <p className="text-[11px] text-rose-600/90 font-bold flex items-center gap-1">
        ⚠️ Esta ação removerá definitivamente este cliente de todas as telas e relatórios.
      </p>
    </div>
  ) : (
    'Tem certeza de que deseja excluir permanentemente este registro de cobrança e todo o seu histórico?'
  );

  const clearDbMessage = (
    <div className="space-y-3">
      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
        Esta ação apagará <strong>TODAS</strong> as cobranças e históricos registrados na base de dados.
      </p>
      <div className="p-3 bg-white rounded-xl border border-rose-200/90 text-xs space-y-1.5 shadow-2xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Total de Registros:</span>
          <span className="font-extrabold text-slate-900">{debts.length} cobrança(s)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Saldo Total a Apagar:</span>
          <span className="font-black text-rose-600 font-mono">
            {formatCurrency(debts.reduce((acc, d) => acc + d.currentAmount, 0))}
          </span>
        </div>
      </div>
      <p className="text-[11px] text-rose-600 font-bold">⚠️ Esta operação é irreversível!</p>
    </div>
  );

  // ── Render all modals ─────────────────────────────────────────────────────
  return (
    <>
      {/* Create / Edit debt */}
      <DebtModal
        isOpen={activeModal === 'add' || activeModal === 'edit'}
        onClose={onCloseModal}
        onSubmit={onSaveDebt}
        debtToEdit={activeModal === 'edit' ? activeSelectedDebt : null}
      />

      {/* Register partial payment */}
      <PaymentModal
        isOpen={activeModal === 'payment'}
        onClose={onCloseModal}
        onSubmit={onAddPayment}
        debt={activeSelectedDebt}
      />

      {/* Backup & restore */}
      <BackupModal
        isOpen={activeModal === 'backup'}
        onClose={onCloseModal}
        debts={debts}
        onImport={onImportBackup}
      />

      {/* SQL console */}
      <SqlModal
        isOpen={activeModal === 'sql'}
        onClose={onCloseModal}
      />

      {/* Notifications & reminders */}
      <NotificationsModal
        isOpen={activeModal === 'notifications'}
        onClose={onCloseModal}
        debts={debts}
        onPayFull={onPayFull}
        onOpenPaymentModal={onOpenPaymentModal}
      />

      {/* Debtor detail */}
      <DebtorDetailModal
        isOpen={activeModal === 'detail'}
        onClose={onCloseModal}
        debt={activeSelectedDebt}
        onAddPaymentClick={onOpenPaymentModal}
        onPayFull={onPayFull}
        onEdit={onOpenEditModal}
        onDelete={onDeleteFromDetail}
        onDeletePayment={onDeletePayment}
      />

      {/* Confirmation: delete single debt */}
      <ConfirmModal
        isOpen={debtIdToDelete !== null}
        title="Excluir Cobrança"
        message={deleteMessage}
        confirmText="Sim, Excluir"
        type="danger"
        onClose={onCancelDelete}
        onConfirm={onConfirmDeleteDebt}
      />

      {/* Confirmation: clear entire database */}
      <ConfirmModal
        isOpen={activeModal === 'confirm_clear_db'}
        title="Limpar Toda a Base de Dados"
        message={clearDbMessage}
        confirmText="Limpar Tudo"
        type="danger"
        onClose={onCloseModal}
        onConfirm={onConfirmClearDb}
      />

      {/* Confirmation: load demo data */}
      <ConfirmModal
        isOpen={activeModal === 'confirm_load_demo'}
        title="Gerar 100 Clientes Fictícios de Teste"
        message="Isso preencherá sua conta com 100 clientes brasileiros fictícios, incluindo telefones, descrições, valores, datas de vencimento e histórico de pagamentos."
        confirmText="Gerar 100 Clientes"
        type="warning"
        onClose={onCloseModal}
        onConfirm={onConfirmLoadDemo}
      />
    </>
  );
}
