/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Debt } from '../types';
import { getEffectivePaidAmount } from '../utils/dateUtils';
import { X, Download, Upload, AlertCircle, CheckCircle, Info, Database, FileCode, HardDrive } from 'lucide-react';
import { Modal } from './ui/Modal';
import { motion } from 'motion/react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  debts: Debt[];
  onImport: (importedDebts: Debt[], mode: 'merge' | 'replace') => void;
}

export default function BackupModal({
  isOpen,
  onClose,
  debts,
  onImport,
}: BackupModalProps) {
  const [importText, setImportText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // AnimatePresence handles visibility via isOpen check in JSX

  // Handle local text import
  const handleTextImport = (mode: 'merge' | 'replace') => {
    try {
      if (!importText.trim()) {
        setErrorMsg('Por favor, cole o código JSON do seu backup.');
        return;
      }
      const parsed = JSON.parse(importText);
      validateAndProcessImport(parsed, mode);
    } catch (e) {
      setErrorMsg('Código JSON inválido. Verifique se copiou todo o conteúdo corretamente.');
    }
  };

  // Validate and sanitize JSON schema
  const validateAndProcessImport = (parsed: unknown, mode: 'merge' | 'replace') => {
    if (!Array.isArray(parsed)) {
      setErrorMsg('O backup deve ser uma lista de cobranças válida (Array de objetos).');
      return;
    }

    if (parsed.length === 0) {
      setErrorMsg('O arquivo ou código de backup está vazio.');
      return;
    }

    // Deep sanitization and normalization
    const sanitizedDebts: Debt[] = [];

    for (let i = 0; i < parsed.length; i++) {
      const item = parsed[i] as Record<string, unknown> | null;
      if (typeof item !== 'object' || item === null) continue;

      const id = typeof item.id === 'string' && item.id.trim() 
        ? item.id.trim().slice(0, 64) 
        : 'debt_' + Math.random().toString(36).substring(2, 11);

      const name = typeof item.name === 'string' ? item.name.trim().slice(0, 100) : '';
      if (!name) continue; // Skip entries without a valid name

      const origAmt = typeof item.originalAmount === 'number' && Number.isFinite(item.originalAmount)
        ? Math.max(0, Math.min(1000000000, item.originalAmount))
        : 0;

      const phone = typeof item.phone === 'string' ? item.phone.trim().slice(0, 30) : undefined;
      const description = typeof item.description === 'string' ? item.description.trim().slice(0, 1000) : undefined;
      const createdAt = typeof item.createdAt === 'string' && item.createdAt.trim() 
        ? item.createdAt.trim() 
        : new Date().toISOString();
      const dueDate = typeof item.dueDate === 'string' && item.dueDate.trim() 
        ? item.dueDate.trim() 
        : undefined;

      // Sanitize payments
      const rawPayments = Array.isArray(item.payments) ? item.payments : [];
      const payments = rawPayments
        .filter((p: unknown): p is Record<string, unknown> => Boolean(p && typeof p === 'object'))
        .map((p) => {
          const pmtId = typeof p.id === 'string' && p.id.trim() ? p.id.trim().slice(0, 64) : 'pmt_' + Math.random().toString(36).substring(2, 11);
          const pmtAmount = typeof p.amount === 'number' && Number.isFinite(p.amount) ? Math.max(0, p.amount) : 0;
          const pmtDate = typeof p.date === 'string' && p.date.trim() ? p.date.trim() : createdAt;
          const pmtNote = typeof p.note === 'string' ? p.note.trim().slice(0, 500) : undefined;
          return { id: pmtId, amount: pmtAmount, date: pmtDate, note: pmtNote };
        });

      // Recalculate amounts safely
      const totalPaid = getEffectivePaidAmount(payments);
      const currentAmount = Math.max(0, Number((origAmt - totalPaid).toFixed(2)));
      let status: 'pending' | 'partial' | 'paid' = 'pending';
      if (currentAmount === 0 && origAmt > 0) {
        status = 'paid';
      } else if (totalPaid > 0) {
        status = 'partial';
      }

      sanitizedDebts.push({
        id,
        name,
        phone,
        originalAmount: origAmt,
        currentAmount,
        createdAt,
        dueDate,
        status,
        description,
        payments,
      });
    }

    if (sanitizedDebts.length === 0) {
      setErrorMsg('Nenhuma cobrança válida foi encontrada no backup informado.');
      return;
    }

    onImport(sanitizedDebts, mode);
    setSuccessMsg(`${sanitizedDebts.length} cobrança(s) higienizada(s) e importada(s) com sucesso!`);
    setErrorMsg('');
    setImportText('');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 2000);
  };

  // Download Backup File
  const handleDownloadBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(debts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup_devedores_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const parsed = JSON.parse(text);
          validateAndProcessImport(parsed, 'merge');
        } catch (err) {
          setErrorMsg('Falha ao ler o arquivo. Verifique se o arquivo JSON está formatado corretamente.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const parsed = JSON.parse(text);
          validateAndProcessImport(parsed, 'merge');
        } catch (err) {
          setErrorMsg('Falha ao ler o arquivo. Verifique se o arquivo JSON está formatado corretamente.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      bodyClassName="p-0 flex flex-col h-full"
      ariaLabelledBy="backup-modal-title"
    >
      {/* Header Card Section */}
      <div className="shrink-0 bg-slate-900 text-white p-4 sm:p-6 relative border-b border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/25 shrink-0">
              <HardDrive className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 id="backup-modal-title" className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Backup & Restauração
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                Exporte ou importe seus dados em arquivo seguro .JSON
              </p>
            </div>
          </div>

          <button
            id="btn-close-backup-modal"
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de backup"
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
            {/* Export Section Card */}
            <div className="p-5 bg-gradient-to-br from-emerald-50/80 to-slate-50 rounded-2xl border border-emerald-100/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-emerald-600" /> Exportar Cópia de Segurança
                </h4>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {debts.length} registro(s)
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 font-medium">
                Baixe o arquivo completo contendo seus devedores, histórico de parcelas e liquidações.
              </p>
              <button
                id="btn-download-backup"
                onClick={handleDownloadBackup}
                disabled={debts.length === 0}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-black rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg cursor-pointer ${
                  debts.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Download className="w-4 h-4" /> Baixar Backup (.json)
              </button>
            </div>

            {/* Alert banners */}
            {successMsg && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs flex items-center gap-2.5 border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">{successMsg}</span>
              </motion.div>
            )}
            {errorMsg && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-50 text-rose-800 rounded-2xl text-xs flex items-center gap-2.5 border border-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-bold">{errorMsg}</span>
              </motion.div>
            )}

            {/* Import Drag & Drop Zone */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-emerald-600" /> Restaurar / Importar Dados
              </h4>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  dragActive 
                    ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <Upload className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-slate-700 font-bold">
                  Arraste o arquivo .JSON do seu backup aqui
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">ou se preferir</p>
                <label className="text-xs text-emerald-600 hover:text-emerald-800 font-black cursor-pointer mt-1.5 inline-block bg-white px-3.5 py-1.5 rounded-xl border border-emerald-100 shadow-xs">
                  <span>Selecionar arquivo no computador</span>
                  <input
                    id="input-file-backup"
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Manual text area option */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">
                  Ou cole o código JSON diretamente:
                </label>
                <textarea
                  id="input-text-backup"
                  rows={3}
                  value={importText}
                  onChange={(e) => {
                    setImportText(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder='[{"id": "...", "name": "...", "originalAmount": 100, ...}]'
                  className="w-full px-3.5 py-2.5 bg-slate-50 font-mono text-[11px] border border-slate-200 focus:border-emerald-600 rounded-xl focus:outline-none text-slate-800 resize-none"
                />
              </div>

              {/* Process actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
                <button
                  id="btn-import-merge"
                  type="button"
                  onClick={() => handleTextImport('merge')}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 bg-slate-50 border border-slate-200 rounded-xl transition-all cursor-pointer"
                  title="Adiciona as cobranças sem apagar as atuais"
                >
                  Mesclar com Atuais
                </button>
                <button
                  id="btn-import-replace"
                  type="button"
                  onClick={() => handleTextImport('replace')}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all cursor-pointer shadow-xs"
                  title="Apaga todas as cobranças atuais e carrega apenas as do backup"
                >
                  Substituir Tudo
                </button>
              </div>
            </div>

            <div className="flex gap-2 text-[11px] leading-relaxed text-slate-500 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <Info className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
              <span>
                <strong>Nota:</strong> A mesclagem atualiza cobranças com IDs correspondentes sem duplicações acidentais.
              </span>
            </div>
          </div>
    </Modal>
  );
}
