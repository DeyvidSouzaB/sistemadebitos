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
  CheckSquare, 
  Square, 
  Receipt, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  FileText,
  ShieldCheck,
  Coins,
  Upload,
  RotateCcw,
  Image as ImageIcon
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

  // AnimatePresence handles visibility via isOpen check in JSX

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

  // Filter debts according to modal filter selection for preview & export
  const selectedDebts = debts.filter(d => {
    if (filterType === 'pending') return d.status !== 'paid';
    if (filterType === 'paid') return d.status === 'paid';
    return true;
  });

  // Calculate quick summary metrics
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

      // Brief delay to allow React state update so spinner renders
      await new Promise((resolve) => setTimeout(resolve, 100));

      await exportToPDF(selectedDebts, options);
      
      // Keep modal open slightly so user sees completion before closing
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      bodyClassName="p-0 flex flex-col h-full"
      ariaLabelledBy="pdf-modal-title"
    >
      {/* Modal Header */}
          <div className="shrink-0 bg-slate-900 text-white p-4 sm:p-6 relative">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 id="pdf-modal-title" className="text-base sm:text-xl font-black tracking-tight">
                    Exportação de Relatório PDF
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                    Personalize o modelo antes de gerar o documento executivo oficial
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar janela de exportação em PDF"
                className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
            
            {/* Customization Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Report Title Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Título do Relatório
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Ex: Relatório Mensal de Cobranças"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-semibold text-slate-800"
                />
              </div>

              {/* Company / Issuer Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nome da Empresa / Emissor
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: Minha Empresa Ltda"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

            </div>

            {/* Logo Management Option */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 overflow-hidden">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/50 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-0.5">
                  <img src={logoUrl} alt="Logo do Relatório" className="w-full h-full object-contain rounded-lg" />
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-slate-800 truncate">Logotipo do Documento PDF</h5>
                  <p className="text-[11px] text-slate-500 font-medium leading-normal">
                    Logotipo oficial do PAGMEFY em alta definição ou envie o símbolo da sua empresa
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <label className="px-3 py-1.5 bg-white hover:bg-slate-100 active:bg-slate-200 text-emerald-600 border border-emerald-200 hover:border-emerald-300 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs">
                  <Upload className="w-3.5 h-3.5 shrink-0" />
                  <span>Enviar Logo</span>
                  <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleLogoChange} className="hidden" />
                </label>

                <button
                  type="button"
                  onClick={() => setLogoUrl(createDefaultLogoDataUrl())}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  title="Restaurar Logo Oficial PAGMEFY"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Padrão</span>
                </button>
              </div>
            </div>

            {/* Filter & Checkbox Toggles */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden">
              
              {/* Filter selector */}
              <div className="flex flex-wrap items-center gap-2 max-w-full">
                <span className="text-xs font-bold text-slate-600 shrink-0">Filtrar Dados:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="bg-white border border-slate-200 text-xs font-bold text-slate-800 py-1.5 px-3 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer max-w-full truncate"
                >
                  <option value="all">Todas as Cobranças ({debts.length})</option>
                  <option value="pending">Apenas Pendentes ({debts.filter(d => d.status !== 'paid').length})</option>
                  <option value="paid">Apenas Quitadas ({debts.filter(d => d.status === 'paid').length})</option>
                </select>
              </div>

              {/* Include Payments Checkbox */}
              <button
                type="button"
                onClick={() => setIncludePayments(!includePayments)}
                className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-600 cursor-pointer select-none shrink-0 max-w-full"
              >
                {includePayments ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className="truncate">Incluir Extrato Detalhado de Pagamentos ({totalPaymentsCount})</span>
              </button>

            </div>

            {/* Document Template Visual Preview Box */}
            <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-gradient-to-b from-slate-50/50 to-white shadow-xs space-y-4 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/80">
                <div className="flex items-center gap-2 min-w-0">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 truncate">
                    Pré-visualização do Modelo PDF
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                  Layout Executivo PAGMEFY
                </span>
              </div>

              {/* Template Card Mockup */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 text-slate-800 overflow-hidden">
                
                {/* PDF Header Mockup */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0 max-w-full">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm p-0.5">
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-black text-slate-900 leading-tight truncate">
                        {companyName || 'PAGMEFY'}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate">
                        Sistema Oficial de Gestão de Débitos
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right min-w-0 max-w-full">
                    <span className="text-xs font-black text-emerald-600 block truncate">
                      {reportTitle || 'Relatório Financeiro'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono truncate">
                      Emissão: {new Date().toLocaleDateString('pt-BR')} • {selectedDebts.length} registro(s)
                    </span>
                  </div>
                </div>

                {/* Financial KPI Summary Cards Mockup */}
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                    Resumo Financeiro Consolidado
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 min-w-0 overflow-hidden">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block truncate">Total Lançado</span>
                      <span className="text-xs font-black text-slate-900 block mt-0.5 truncate">
                        {formatCurrency(totalOriginal)}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 min-w-0 overflow-hidden">
                      <span className="text-[9px] font-bold text-emerald-700 uppercase block truncate">Total Recebido</span>
                      <span className="text-xs font-black text-emerald-600 block mt-0.5 truncate">
                        {formatCurrency(totalPaid)}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100 min-w-0 overflow-hidden">
                      <span className="text-[9px] font-bold text-rose-700 uppercase block truncate">Saldo em Aberto</span>
                      <span className="text-xs font-black text-rose-600 block mt-0.5 truncate">
                        {formatCurrency(totalRemaining)}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-100 min-w-0 overflow-hidden">
                      <span className="text-[9px] font-bold text-teal-700 uppercase block truncate">Recuperação</span>
                      <span className="text-xs font-black text-teal-700 block mt-0.5 truncate">
                        {recoveryRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Table Mockup teaser */}
                <div className="pt-2 overflow-x-auto">
                  <div className="min-w-[420px]">
                    <div className="w-full bg-slate-900 text-white rounded-lg px-3 py-2 grid grid-cols-12 gap-1 text-[10px] font-bold items-center">
                      <span className="col-span-4 truncate">Devedor</span>
                      <span className="col-span-2 text-right truncate">Original</span>
                      <span className="col-span-2 text-right truncate">Pago</span>
                      <span className="col-span-2 text-right truncate">Saldo</span>
                      <span className="col-span-2 text-center truncate">Status</span>
                    </div>
                    <div className="mt-1 space-y-1">
                      {selectedDebts.slice(0, 3).map((d, index) => (
                        <div key={`${d.id}-${index}`} className="w-full bg-slate-50 rounded-lg px-3 py-1.5 grid grid-cols-12 gap-1 text-[10px] text-slate-600 items-center">
                          <span className="col-span-4 font-sans font-bold text-slate-900 truncate">{d.name}</span>
                          <span className="col-span-2 text-right truncate">{formatCurrency(d.originalAmount)}</span>
                          <span className="col-span-2 text-right text-emerald-600 truncate">{formatCurrency(getEffectivePaidAmount(d.payments))}</span>
                          <span className="col-span-2 text-right text-rose-600 font-bold truncate">{formatCurrency(d.currentAmount)}</span>
                          <span className="col-span-2 text-center capitalize text-[9px] font-sans font-bold truncate">
                            <span className={`inline-block px-1.5 py-0.5 rounded ${d.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : d.status === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                              {d.status === 'paid' ? 'Quitado' : d.status === 'partial' ? 'Parcial' : 'Pendente'}
                            </span>
                          </span>
                        </div>
                      ))}
                      {selectedDebts.length > 3 && (
                        <div className="text-center text-[10px] text-slate-400 italic py-1">
                          + mais {selectedDebts.length - 3} devedores listados na tabela do PDF...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Verification Security Note */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>O arquivo gerado conterá cabeçalho vetorial com logotipo, tabela zebrada e rodapé de segurança.</span>
            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={selectedDebts.length === 0 || isGenerating}
              className="w-full sm:w-auto px-6 py-3 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gerando PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Gerar e Baixar PDF ({selectedDebts.length})</span>
                </>
              )}
            </button>
          </div>
    </Modal>
  );
}
