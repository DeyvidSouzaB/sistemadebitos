/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Debt } from '../types';
import { exportToPDF, PdfExportOptions, createDefaultLogoDataUrl } from '../utils/export';
import { getEffectivePaidAmount } from '../utils/dateUtils';
import { formatCurrency } from '../hooks/useDebtCalculations';
import { Modal } from './ui/Modal';
import { 
  X, 
  FileDown, 
  Sparkles, 
  Building2, 
  Receipt, 
  AlertTriangle, 
  FileText,
  ShieldCheck,
  Upload,
  RotateCcw,
  ChevronDown,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  debts: Debt[];
  userName?: string;
  userEmail?: string;
}

export default function PdfExportModal({
  isOpen,
  onClose,
  debts,
  userName = 'Gestor',
  userEmail = '',
}: PdfExportModalProps) {
  const [reportTitle, setReportTitle] = useState('Relatório Financeiro de Cobranças');
  const [companyName, setCompanyName] = useState('PAGMEFY - Gestão de Débitos');
  const [includePayments, setIncludePayments] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'paid'>('all');
  const [logoUrl, setLogoUrl] = useState<string>(() => createDefaultLogoDataUrl());
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        setErrorMessage('A imagem do logotipo deve ter no máximo 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setLogoUrl(evt.target.result as string);
          setErrorMessage('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedDebts = debts.filter(d => {
    if (filterType === 'pending') return d.status !== 'paid';
    if (filterType === 'paid') return d.status === 'paid';
    return true;
  });

  const totalOriginal = selectedDebts.reduce((sum, d) => sum + d.originalAmount, 0);
  const totalRemaining = selectedDebts.reduce((sum, d) => sum + d.currentAmount, 0);
  const totalPaid = selectedDebts.reduce((sum, d) => sum + getEffectivePaidAmount(d.payments), 0);
  const recoveryRate = totalOriginal > 0 ? (totalPaid / totalOriginal) * 100 : 0;
  const totalPaymentsCount = selectedDebts.reduce((sum, d) => sum + d.payments.length, 0);

  const handleDownload = async () => {
    if (selectedDebts.length === 0) return;
    setIsGenerating(true);
    setErrorMessage('');
    try {
      const options: PdfExportOptions = {
        title: reportTitle.trim() || 'Relatório Financeiro de Cobranças',
        companyName: companyName.trim() || 'PAGMEFY - Gestão de Débitos',
        includePayments,
        userName,
        userEmail,
        logoUrl,
      };
      await new Promise((resolve) => setTimeout(resolve, 100));
      await exportToPDF(selectedDebts, options);
      setTimeout(() => {
        setIsGenerating(false);
        onClose();
      }, 500);
    } catch (err: unknown) {
      console.error('Erro ao gerar PDF:', err);
      const errorObj = err as Partial<Error>;
      setErrorMessage(errorObj?.message || 'Ocorreu um erro ao gerar o relatório em PDF. Tente novamente.');
      setIsGenerating(false);
    }
  };

  const filterLabels = {
    all: `Todas as Cobranças (${debts.length})`,
    pending: `Apenas Pendentes (${debts.filter(d => d.status !== 'paid').length})`,
    paid: `Apenas Quitadas (${debts.filter(d => d.status === 'paid').length})`,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      bodyClassName="p-0 flex flex-col h-full"
      ariaLabelledBy="pdf-modal-title"
    >
      {/* ── HEADER ─────────────────────────────── */}
      <div className="shrink-0 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white p-5 sm:p-6">
        {/* grid watermark */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-teal-500/30 to-transparent pointer-events-none" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 id="pdf-modal-title" className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                Exportação de Relatório PDF
              </h3>
              <p className="text-[11px] sm:text-xs text-emerald-100 mt-0.5 font-medium">
                Personalize e gere o documento executivo oficial
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de exportação em PDF"
            className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all cursor-pointer border border-white/20 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── BODY ───────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">

        {/* ── Inputs row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest font-mono">
              Título do Relatório
            </label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder="Ex: Relatório Mensal de Cobranças"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 text-sm font-semibold text-slate-800 transition-all shadow-xs placeholder:text-slate-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest font-mono">
              Nome da Empresa / Emissor
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ex: Minha Empresa Ltda"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 text-sm font-semibold text-slate-800 transition-all shadow-xs placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>

        {/* ── Logo card ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700/40 flex items-center justify-center overflow-hidden shrink-0 shadow-md p-0.5">
              <img src={logoUrl} alt="Logo do Relatório" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-bold text-slate-800">Logotipo do Documento PDF</h5>
              <p className="text-[11px] text-slate-400 font-medium leading-normal mt-0.5">
                Logo oficial PAGMEFY ou envie o símbolo da sua empresa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95">
              <Upload className="w-3.5 h-3.5" />
              <span>Enviar Logo</span>
              <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleLogoChange} className="hidden" />
            </label>
            <button
              type="button"
              onClick={() => setLogoUrl(createDefaultLogoDataUrl())}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
              title="Restaurar Logo Oficial PAGMEFY"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Padrão</span>
            </button>
          </div>
        </div>

        {/* ── Filter + Toggle row ── */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          {/* Custom filter select */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest font-mono shrink-0">Filtrar</span>
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="appearance-none bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer shadow-xs"
              >
                <option value="all">Todas as Cobranças ({debts.length})</option>
                <option value="pending">Apenas Pendentes ({debts.filter(d => d.status !== 'paid').length})</option>
                <option value="paid">Apenas Quitadas ({debts.filter(d => d.status === 'paid').length})</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Animated toggle */}
          <button
            type="button"
            onClick={() => setIncludePayments(!includePayments)}
            className="flex items-center gap-3 cursor-pointer select-none group"
            aria-label="Incluir extrato de pagamentos"
          >
            <div className={`relative w-10 h-5.5 rounded-full transition-all duration-300 ${includePayments ? 'bg-emerald-500' : 'bg-slate-300'}`}
              style={{ height: '22px' }}>
              <div className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-md transition-all duration-300 ${includePayments ? 'translate-x-[18px]' : 'translate-x-0'}`}
                style={{ width: '18px', height: '18px' }} />
            </div>
            <span className={`text-xs font-bold transition-colors ${includePayments ? 'text-emerald-700' : 'text-slate-500'}`}>
              Extrato Detalhado de Pagamentos
              <span className="ml-1.5 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-mono">
                {totalPaymentsCount}
              </span>
            </span>
          </button>
        </div>

        {/* ── KPI mini-cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Lançado', value: formatCurrency(totalOriginal), color: 'slate', icon: Receipt },
            { label: 'Total Recebido', value: formatCurrency(totalPaid), color: 'emerald', icon: TrendingUp },
            { label: 'Saldo em Aberto', value: formatCurrency(totalRemaining), color: 'rose', icon: AlertTriangle },
            { label: 'Recuperação', value: `${recoveryRate.toFixed(1)}%`, color: 'teal', icon: Sparkles },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label}
              className={`p-3.5 rounded-2xl border shadow-xs text-center
                ${color === 'slate'   ? 'bg-slate-50 border-slate-200' :
                  color === 'emerald' ? 'bg-emerald-50 border-emerald-100' :
                  color === 'rose'    ? 'bg-rose-50 border-rose-100' :
                                        'bg-teal-50 border-teal-100'}`}
            >
              <Icon className={`w-3.5 h-3.5 mx-auto mb-1
                ${color === 'slate'   ? 'text-slate-400' :
                  color === 'emerald' ? 'text-emerald-500' :
                  color === 'rose'    ? 'text-rose-400' :
                                        'text-teal-500'}`} />
              <span className={`text-[10px] font-black uppercase tracking-wide block
                ${color === 'slate'   ? 'text-slate-400' :
                  color === 'emerald' ? 'text-emerald-600' :
                  color === 'rose'    ? 'text-rose-500' :
                                        'text-teal-600'}`}>{label}</span>
              <span className={`text-sm font-black block mt-0.5 font-mono
                ${color === 'slate'   ? 'text-slate-900' :
                  color === 'emerald' ? 'text-emerald-700' :
                  color === 'rose'    ? 'text-rose-600' :
                                        'text-teal-700'}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* ── Preview box ── */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          {/* Preview header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-700 font-mono">
                Pré-visualização do Modelo PDF
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Layout Executivo PAGMEFY
            </span>
          </div>

          {/* Mock PDF document */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* PDF doc header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/40 flex items-center justify-center overflow-hidden shadow-md p-0.5 shrink-0">
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 leading-tight">{companyName || 'PAGMEFY'}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Sistema Oficial de Gestão de Débitos</p>
                </div>
              </div>
              <div className="sm:text-right">
                <span className="text-xs font-black text-emerald-600 block">{reportTitle || 'Relatório Financeiro'}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Emissão: {new Date().toLocaleDateString('pt-BR')} • {selectedDebts.length} reg.
                </span>
              </div>
            </div>

            {/* Table teaser */}
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <div className="min-w-[420px]">
                <div className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-xl px-3 py-2.5 grid grid-cols-12 gap-1 text-[10px] font-black items-center">
                  <span className="col-span-4">Devedor</span>
                  <span className="col-span-2 text-right">Original</span>
                  <span className="col-span-2 text-right">Pago</span>
                  <span className="col-span-2 text-right">Saldo</span>
                  <span className="col-span-2 text-center">Status</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {selectedDebts.slice(0, 3).map((d, index) => (
                    <div key={`${d.id}-${index}`}
                      className={`w-full px-3 py-2 grid grid-cols-12 gap-1 text-[10px] items-center ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}`}>
                      <span className="col-span-4 font-bold text-slate-900 truncate">{d.name}</span>
                      <span className="col-span-2 text-right text-slate-600 truncate font-mono">{formatCurrency(d.originalAmount)}</span>
                      <span className="col-span-2 text-right text-emerald-600 truncate font-mono">{formatCurrency(getEffectivePaidAmount(d.payments))}</span>
                      <span className="col-span-2 text-right text-rose-600 font-bold truncate font-mono">{formatCurrency(d.currentAmount)}</span>
                      <span className="col-span-2 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded-md text-[9px] font-black
                          ${d.status === 'paid'    ? 'bg-emerald-100 text-emerald-800' :
                            d.status === 'partial' ? 'bg-amber-100 text-amber-800' :
                                                     'bg-rose-100 text-rose-700'}`}>
                          {d.status === 'paid' ? 'Quitado' : d.status === 'partial' ? 'Parcial' : 'Pendente'}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
                {selectedDebts.length > 3 && (
                  <div className="text-center text-[10px] text-slate-400 italic py-2 bg-slate-50/80 rounded-b-xl border-t border-slate-100">
                    + mais {selectedDebts.length - 3} devedores listados no PDF completo...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl font-medium flex items-center gap-2.5 shadow-xs"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Security note ── */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium px-1">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>O arquivo gerado conterá cabeçalho vetorial com logotipo, tabela zebrada e rodapé de segurança.</span>
        </div>
      </div>

      {/* ── FOOTER ─────────────────────────────── */}
      <div className="shrink-0 p-4 sm:p-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <button
          type="button"
          onClick={onClose}
          disabled={isGenerating}
          className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          Cancelar
        </button>

        <motion.button
          type="button"
          onClick={handleDownload}
          disabled={selectedDebts.length === 0 || isGenerating}
          whileHover={{ scale: selectedDebts.length > 0 && !isGenerating ? 1.02 : 1 }}
          whileTap={{ scale: 0.97 }}
          className="w-full sm:w-auto px-6 py-3 text-sm font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 rounded-2xl shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Gerando PDF...</span>
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4 stroke-[2.5]" />
              <span>Gerar e Baixar PDF ({selectedDebts.length})</span>
            </>
          )}
        </motion.button>
      </div>
    </Modal>
  );
}
