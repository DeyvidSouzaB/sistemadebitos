/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SUPABASE_SQL_SCRIPT } from '../lib/sqlScripts';
import { Copy, Check, X, Database, ExternalLink, Terminal } from 'lucide-react';
import { Modal } from './ui/Modal';

interface SqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SqlModal({ isOpen, onClose }: SqlModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      className="bg-slate-900 border-slate-800 text-slate-100"
      bodyClassName="p-0 flex flex-col h-full"
      ariaLabelledBy="sql-modal-title"
    >
      {/* Modal Header */}
      <div className="shrink-0 p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 shrink-0">
            <Database className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 id="sql-modal-title" className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              Script SQL de Tabelas
              <span className="text-[9px] sm:text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full uppercase">
                Supabase
              </span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Crie as tabelas <code className="text-emerald-400 font-mono">profiles</code>, <code className="text-emerald-400 font-mono">debts</code> e <code className="text-emerald-400 font-mono">payments</code> no seu projeto
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar janela de script SQL"
          className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Instructions banner */}
      <div className="shrink-0 bg-emerald-950/40 border-b border-emerald-900/50 p-3 sm:p-4 text-xs text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Copie o código abaixo e cole no <strong>SQL Editor</strong> do seu painel Supabase.
          </span>
        </div>
        <a
          href="https://supabase.com/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition-all shrink-0 cursor-pointer text-[11px] shadow-sm"
        >
          Abrir Supabase <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Code Content Box */}
      <div className="p-5 flex-1 overflow-y-auto font-mono text-xs bg-slate-950 text-emerald-400 leading-relaxed rounded-b-none border-b border-slate-800/80">
        <pre className="whitespace-pre-wrap select-all">{SUPABASE_SQL_SCRIPT}</pre>
      </div>

      {/* Footer Actions */}
      <div className="p-4 sm:p-5 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        <span className="text-xs text-slate-400 font-mono">
          ⚡ 3 Tabelas + Triggers + Políticas RLS
        </span>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopy}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs transition-all cursor-pointer shadow-md ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:text-slate-950'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> SQL Copiado para a Área de Transferência!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copiar Script SQL Completo
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
