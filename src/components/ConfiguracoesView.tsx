/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';
import { getWhatsappConfig, saveWhatsappConfig, buildWhatsappMessage, WhatsappConfig } from '../utils/phoneUtils';
import { motion } from 'motion/react';

interface ConfiguracoesViewProps {
  userName: string;
  userEmail: string;
  onOpenBackupModal: () => void;
  onOpenSqlModal?: () => void;
  onLoadDemoData: () => void;
  onClearDb: () => void;
  onUpdateUserName?: (newName: string) => Promise<boolean>;
}

export default function ConfiguracoesView({
  userName,
  userEmail,
  onOpenBackupModal,
  onOpenSqlModal,
  onLoadDemoData,
  onClearDb,
  onUpdateUserName,
}: ConfiguracoesViewProps) {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [autoReminders, setAutoReminders] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('R$');

  // User Profile Name State
  const [nameInput, setNameInput] = useState(userName);
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameSavedSuccess, setNameSavedSuccess] = useState(false);

  useEffect(() => {
    setNameInput(userName);
  }, [userName]);

  const handleSaveProfileName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateUserName || !nameInput.trim()) return;
    setIsUpdatingName(true);
    const success = await onUpdateUserName(nameInput);
    setIsUpdatingName(false);
    if (success) {
      setNameSavedSuccess(true);
      setTimeout(() => setNameSavedSuccess(false), 3000);
    }
  };


  // WhatsApp Configuration State
  const [waMode, setWaMode] = useState<WhatsappConfig['mode']>('empty');
  const [waCustomText, setWaCustomText] = useState<string>('');

  useEffect(() => {
    const initialConfig = getWhatsappConfig();
    setWaMode(initialConfig.mode || 'empty');
    setWaCustomText(
      initialConfig.customTemplate ||
      'Olá {nome}, tudo bem? Segue lembrete da sua cobrança no valor de {valor} (vencimento: {vencimento}).'
    );
  }, []);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    saveWhatsappConfig({
      mode: waMode,
      customTemplate: waCustomText,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Sample data for live preview
  const sampleDebt = {
    name: 'Maria Gadu',
    currentAmount: 2000.99,
    dueDate: '2026-07-30',
  };

  const previewMessage = buildWhatsappMessage(sampleDebt, {
    mode: waMode,
    customTemplate: waCustomText,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 sm:space-y-7 text-slate-900 max-w-[1600px] mx-auto pb-12"
    >
      {/* 1. HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 shadow-2xl border border-slate-800/80">
        {/* Subtle security/settings watermark for Settings view */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none hidden sm:block">
          <div className="w-36 h-36 rounded-full border-4 border-dashed border-emerald-400 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-emerald-400" />
          </div>
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-600 rounded-l-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>CONFIGURAÇÕES & SEGURANÇA</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-display leading-tight">
              Configurações do Sistema
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Personalize modelos de cobrança via WhatsApp, gerencie credenciais de usuário e controle backups de segurança.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md rounded-2xl text-xs font-black shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Configurações Salvas com Sucesso!</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: User Profile & Database Tools */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <form onSubmit={handleSaveProfileName} className="bg-white/90 p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3 font-mono">
              <User className="w-4 h-4 text-emerald-600" /> Perfil do Usuário
            </h3>

            <div className="flex items-center gap-3.5 py-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-sm flex items-center justify-center font-mono shadow-sm shrink-0">
                {nameInput.trim() ? nameInput.trim().slice(0, 2).toUpperCase() : 'US'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 truncate font-display">{nameInput || userName}</p>
                <p className="text-xs text-slate-400 truncate">{userEmail}</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Razão Social / Nome do Operador
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Digite seu nome ou razão social..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 text-xs font-medium px-3.5 py-2.5 rounded-xl transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">E-mail Cadastrado</label>
                <input
                  type="text"
                  readOnly
                  value={userEmail}
                  className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-xs font-mono px-3.5 py-2.5 rounded-xl cursor-not-allowed"
                />
              </div>

              {onUpdateUserName && (
                <button
                  type="submit"
                  disabled={isUpdatingName || nameInput.trim() === userName || !nameInput.trim()}
                  className={`w-full py-2.5 px-4 font-black text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${nameSavedSuccess
                      ? 'bg-emerald-600 text-white'
                      : isUpdatingName || nameInput.trim() === userName || !nameInput.trim()
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95'
                    }`}
                >
                  {isUpdatingName ? (
                    <span>Salvando Informações...</span>
                  ) : nameSavedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Informações Atualizadas!</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>Salvar Informações</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>


        </div>

        {/* RIGHT COLUMN: WhatsApp Live Template Simulator & Preferences */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSavePreferences} className="bg-white/90 p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                Configurador de Mensagem WhatsApp
              </h3>

              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar Modelo</span>
              </button>
            </div>

            {/* Mode selection radio */}
            <div className="space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 font-mono">
                Estilo de Mensagem Automática
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${waMode === 'empty' ? 'border-emerald-500 bg-emerald-50/50/40 ring-1 ring-emerald-500' : 'border-slate-200 bg-slate-50/50/40'
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">Apenas Link</span>
                    <input
                      type="radio"
                      name="waMode"
                      value="empty"
                      checked={waMode === 'empty'}
                      onChange={() => setWaMode('empty')}
                      className="accent-emerald-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Abre a conversa do WhatsApp sem texto pré-preenchido.</p>
                </label>

                <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${waMode === 'standard' ? 'border-emerald-500 bg-emerald-50/50/40 ring-1 ring-emerald-500' : 'border-slate-200 bg-slate-50/50/40'
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">Padrão Sistema</span>
                    <input
                      type="radio"
                      name="waMode"
                      value="standard"
                      checked={waMode === 'standard'}
                      onChange={() => setWaMode('standard')}
                      className="accent-emerald-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Mensagem padrão amigável informando o saldo e vencimento.</p>
                </label>

                <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${waMode === 'custom' ? 'border-emerald-500 bg-emerald-50/50/40 ring-1 ring-emerald-500' : 'border-slate-200 bg-slate-50/50/40'
                  }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900">Personalizada</span>
                    <input
                      type="radio"
                      name="waMode"
                      value="custom"
                      checked={waMode === 'custom'}
                      onChange={() => setWaMode('custom')}
                      className="accent-emerald-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Crie seu modelo próprio com variáveis dinâmicas.</p>
                </label>
              </div>
            </div>

            {/* Custom Template Editor */}
            {waMode === 'custom' && (
              <div className="space-y-3">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 font-mono">
                  Editor de Modelo de Texto
                </label>

                <textarea
                  rows={4}
                  value={waCustomText}
                  onChange={(e) => setWaCustomText(e.target.value)}
                  placeholder="Digite sua mensagem personalizada aqui..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400 font-semibold">Tags dinâmicas:</span>
                  <button
                    type="button"
                    onClick={() => setWaCustomText(prev => prev + ' {nome}')}
                    className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-mono text-[11px] font-bold border border-emerald-200"
                  >
                    + &#123;nome&#125;
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaCustomText(prev => prev + ' {valor}')}
                    className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-mono text-[11px] font-bold border border-emerald-200"
                  >
                    + &#123;valor&#125;
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaCustomText(prev => prev + ' {vencimento}')}
                    className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-mono text-[11px] font-bold border border-emerald-200"
                  >
                    + &#123;vencimento&#125;
                  </button>
                </div>
              </div>
            )}

            {/* LIVE SMARTPHONE CHAT SIMULATOR */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Pré-Visualização da Mensagem no WhatsApp
              </label>

              <div className="rounded-3xl border border-emerald-500/20 bg-slate-950 overflow-hidden shadow-xl max-w-md mx-auto sm:mx-0">
                {/* Simulator Header */}
                <div className="bg-emerald-800 text-white px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center font-mono border border-emerald-400">
                    MG
                  </div>
                  <div>
                    <p className="text-xs font-bold font-display">Maria Gadu</p>
                    <p className="text-[10px] text-emerald-200">Online • WhatsApp Pagmefy</p>
                  </div>
                </div>

                {/* Chat Bubble Body */}
                <div className="p-4 bg-slate-900 min-h-[120px] flex items-end">
                  <div className="bg-emerald-950/80 border border-emerald-700/50 text-emerald-100 p-3.5 rounded-2xl rounded-tl-none max-w-[85%] text-xs leading-relaxed font-sans shadow-md relative">
                    <p className="whitespace-pre-wrap">{previewMessage || '(Sua mensagem aparecerá aqui)'}</p>
                    <span className="text-[9px] text-emerald-400 font-mono block text-right mt-1.5">12:00 ✓✓</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>


    </motion.div>
  );
}
