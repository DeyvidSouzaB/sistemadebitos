/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Debt } from '../types';
import { X, DollarSign, Calendar, User, FileText, PlusCircle, Edit3, Sparkles, Phone, Loader2 } from 'lucide-react';
import { Modal } from './ui/Modal';
import { formatPhone } from '../utils/phoneUtils';
import { getTodayString, toSafeISOString } from '../utils/dateUtils';

interface DebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    phone?: string;
    originalAmount: number;
    createdAt: string;
    dueDate?: string;
    description?: string;
  }) => void;
  debtToEdit?: Debt | null;
}

export default function DebtModal({
  isOpen,
  onClose,
  onSubmit,
  debtToEdit,
}: DebtModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset or fill form when modal opens / changes mode (add/edit)
  useEffect(() => {
    if (isOpen) {
      if (debtToEdit) {
        setName(debtToEdit.name);
        setPhone(formatPhone(debtToEdit.phone || ''));
        setOriginalAmount(debtToEdit.originalAmount.toString());
        setCreatedAt(debtToEdit.createdAt.slice(0, 10));
        setDueDate(debtToEdit.dueDate ? debtToEdit.dueDate.slice(0, 10) : '');
        setDescription(debtToEdit.description || '');
      } else {
        setName('');
        setPhone('');
        setOriginalAmount('');
        setCreatedAt(getTodayString());
        setDueDate('');
        setDescription('');
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, debtToEdit]);

  // Remove line 63 if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhone(formatPhone(val));
  };

  // Normalize locale-aware numeric string to JS float.
  // Handles BR format ("1.200,50" → 1200.50) and US format ("1200.50" → 1200.50).
  const parseLocaleFloat = (raw: string): number => {
    const trimmed = raw.trim();
    // If it has both dot and comma (e.g. "1.200,50"), it's BR thousands-dot + decimal-comma
    if (trimmed.includes('.') && trimmed.includes(',')) {
      return parseFloat(trimmed.replace(/\./g, '').replace(',', '.'));
    }
    // If only comma (e.g. "1200,50"), it's BR decimal-comma
    if (trimmed.includes(',') && !trimmed.includes('.')) {
      return parseFloat(trimmed.replace(',', '.'));
    }
    // Otherwise standard dot notation ("1200.50")
    return parseFloat(trimmed);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = 'Nome do devedor é obrigatório.';
    } else if (trimmedName.length > 100) {
      newErrors.name = 'O nome não pode exceder 100 caracteres.';
    }
    
    const amt = parseLocaleFloat(originalAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      newErrors.originalAmount = 'Insira um valor numérico válido maior que zero.';
    } else if (amt > 1000000000) {
      newErrors.originalAmount = 'O valor máximo permitido é R$ 1.000.000.000,00.';
    }
    
    if (!createdAt) {
      newErrors.createdAt = 'Selecione a data de origem do débito.';
    }

    if (dueDate && createdAt && new Date(dueDate) < new Date(createdAt)) {
      newErrors.dueDate = 'A data de vencimento não pode ser anterior à data de origem.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    onSubmit({
      name: name.trim().slice(0, 100),
      phone: phone.trim().slice(0, 30) || undefined,
      originalAmount: Math.min(1000000000, Math.max(0.01, parseLocaleFloat(originalAmount))),
      createdAt: toSafeISOString(createdAt),
      dueDate: dueDate ? toSafeISOString(dueDate) : undefined,
      description: description.trim().slice(0, 1000) || undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      bodyClassName="p-0 flex flex-col h-full"
      ariaLabelledBy="debt-modal-title"
    >
      {/* Header Card Section */}
          <div className="shrink-0 bg-slate-900 text-white p-4 sm:p-6 relative border-b border-slate-800">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/25 shrink-0">
                  {debtToEdit ? <Edit3 className="w-5 h-5 sm:w-6 sm:h-6" /> : <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
                </div>
                <div>
                  <h3 id="debt-modal-title" className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                    {debtToEdit ? 'Editar Cobrança' : 'Nova Cobrança'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                    {debtToEdit 
                      ? 'Atualize os dados e valores do registro do devedor' 
                      : 'Preencha as informações para registrar um novo débito'}
                  </p>
                </div>
              </div>

              <button
                id="btn-close-debt-modal"
                type="button"
                onClick={onClose}
                aria-label="Fechar formulário de cobrança"
                className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Debtor Name */}
            <div>
              <label htmlFor="input-debt-name" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" /> Nome do Devedor
                <span aria-hidden="true" className="text-rose-500 ml-0.5">*</span>
              </label>
              <input
                id="input-debt-name"
                type="text"
                required
                autoFocus
                aria-required="true"
                aria-invalid={errors.name ? 'true' : undefined}
                aria-describedby={errors.name ? 'error-debt-name' : undefined}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Carlos Silva Santos"
                className={`w-full px-4 py-3 bg-slate-50/80 focus:bg-white text-slate-900 font-semibold border ${
                  errors.name 
                    ? 'border-rose-400 focus:ring-rose-500/20' 
                    : 'border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15'
                } rounded-2xl focus:outline-none transition-all text-sm`}
              />
              {errors.name && (
                <p id="error-debt-name" role="alert" className="text-xs text-rose-500 mt-1.5 font-bold flex items-center gap-1">⚠️ {errors.name}</p>
              )}
            </div>

            {/* Debtor Phone / WhatsApp */}
            <div>
              <label htmlFor="input-debt-phone" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Celular / WhatsApp <span className="text-slate-400 font-normal lowercase">(para envio direto de cobranças)</span>
              </label>
              <div className="relative">
                <input
                  id="input-debt-phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(11) 90000-0000"
                  maxLength={15}
                  className="w-full px-4 py-3 bg-slate-50/80 focus:bg-white text-slate-900 font-semibold border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 rounded-2xl focus:outline-none transition-all text-sm"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Ao registrar o número, as cobranças via WhatsApp serão direcionadas automaticamente para este contato.</p>
            </div>

            {/* Value and Dates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Amount */}
              <div>
                <label htmlFor="input-debt-amount" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Valor Original *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-slate-400 text-xs font-black">
                    R$
                  </span>
                  <input
                    id="input-debt-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    aria-required="true"
                    aria-invalid={errors.originalAmount ? 'true' : undefined}
                    aria-describedby={errors.originalAmount ? 'error-debt-amount' : undefined}
                    value={originalAmount}
                    onChange={(e) => setOriginalAmount(e.target.value)}
                    placeholder="0,00"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50/80 focus:bg-white text-slate-900 font-bold border ${
                      errors.originalAmount 
                        ? 'border-rose-400' 
                        : 'border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15'
                    } rounded-2xl focus:outline-none transition-all text-sm`}
                  />
                </div>
                {errors.originalAmount && (
                  <p id="error-debt-amount" role="alert" className="text-xs text-rose-500 mt-1.5 font-bold flex items-center gap-1">⚠️ {errors.originalAmount}</p>
                )}
              </div>

              {/* Created At / Date of Origin */}
              <div>
                <label htmlFor="input-debt-created-at" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Data de Origem *
                </label>
                <input
                  id="input-debt-created-at"
                  type="date"
                  required
                  aria-required="true"
                  aria-invalid={errors.createdAt ? 'true' : undefined}
                  aria-describedby={errors.createdAt ? 'error-debt-created-at' : undefined}
                  value={createdAt}
                  onChange={(e) => setCreatedAt(e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-50/80 focus:bg-white text-slate-900 font-bold border ${
                    errors.createdAt 
                      ? 'border-rose-400' 
                      : 'border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15'
                  } rounded-2xl focus:outline-none transition-all text-sm`}
                />
                {errors.createdAt && (
                  <p id="error-debt-created-at" role="alert" className="text-xs text-rose-500 mt-1.5 font-bold flex items-center gap-1">⚠️ {errors.createdAt}</p>
                )}
              </div>
            </div>

            {/* Due Date (Optional) */}
            <div>
              <label htmlFor="input-debt-due-date" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Data de Vencimento <span className="text-slate-400 font-normal lowercase">(opcional)</span>
              </label>
              <input
                id="input-debt-due-date"
                type="date"
                aria-invalid={errors.dueDate ? 'true' : undefined}
                aria-describedby={errors.dueDate ? 'error-debt-due-date' : undefined}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50/80 focus:bg-white text-slate-900 font-bold border ${
                  errors.dueDate 
                    ? 'border-rose-400' 
                    : 'border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15'
                } rounded-2xl focus:outline-none transition-all text-sm`}
              />
              {errors.dueDate && (
                <p id="error-debt-due-date" role="alert" className="text-xs text-rose-500 mt-1.5 font-bold flex items-center gap-1">⚠️ {errors.dueDate}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="input-debt-desc" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Observações / Detalhes
              </label>
              <textarea
                id="input-debt-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Venda de produtos de catálogo, parcelado em 2x..."
                className="w-full px-4 py-3 bg-slate-50/80 focus:bg-white text-slate-900 border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 rounded-2xl focus:outline-none transition-all text-sm resize-none"
              />
            </div>

            {/* Submit Actions Footer */}
            <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
              <button
                id="btn-cancel-debt"
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                id="btn-submit-debt"
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Sparkles className="w-4 h-4 text-emerald-200" />}
                {debtToEdit ? 'Salvar Alterações' : 'Criar Cobrança'}
              </button>
            </div>
          </form>
    </Modal>
  );
}
