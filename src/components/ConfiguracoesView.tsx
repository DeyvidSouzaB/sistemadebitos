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
}

export default function ConfiguracoesView({
  userName,
  userEmail,
  onOpenBackupModal,
  onOpenSqlModal,
  onLoadDemoData,
  onClearDb,
}: ConfiguracoesViewProps) {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [autoReminders, setAutoReminders] = useState(true);
  const [currencySymbol, setCurrencySymbol] = useState('R$');

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
      className="space-y-6 sm:space-y-7 text-slate-900 dark:text-slate-100 max-w-[1600px] mx-auto pb-12"
    >
      {/* 1. HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 shadow-2xl border border-slate-800/80">
        {/* Ambient background glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-600 rounded-l-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
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
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md rounded-2xl text-xs font-black animate-pulse shadow-lg">
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
          <div className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 font-mono">
              <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Perfil do Usuário
            </h3>

            <div className="flex items-center gap-3.5 py-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-sm flex items-center justify-center font-mono shadow-sm">
                {userName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 dark:text-white truncate font-display">{userName}</p>
                <p className="text-xs text-slate-400 truncate">{userEmail}</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Razão Social / Operador</label>
                <input
                  type="text"
                  readOnly
                  value={userName}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono px-3.5 py-2.5 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">E-mail Cadastrado</label>
                <input
                  type="text"
                  readOnly
                  value={userEmail}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono px-3.5 py-2.5 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WhatsApp Live Template Simulator & Preferences */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSavePreferences} className="bg-white dark:bg-slate-900/90 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white font-display flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
                <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  waMode === 'empty' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Apenas Link</span>
                    <input
                      type="radio"
                      name="waMode"
                      value="empty"
                      checked={waMode === 'empty'}
                      onChange={() => setWaMode('empty')}
                      className="accent-emerald-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Abre a conversa do WhatsApp sem texto pré-preenchido.</p>
                </label>

                <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  waMode === 'standard' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Padrão Sistema</span>
                    <input
                      type="radio"
                      name="waMode"
                      value="standard"
                      checked={waMode === 'standard'}
                      onChange={() => setWaMode('standard')}
                      className="accent-emerald-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Mensagem padrão amigável informando o saldo e vencimento.</p>
                </label>

                <label className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  waMode === 'custom' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-500' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Personalizada</span>
                    <input
                      type="radio"
                      name="waMode"
                      value="custom"
                      checked={waMode === 'custom'}
                      onChange={() => setWaMode('custom')}
                      className="accent-emerald-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Crie seu modelo próprio com variáveis dinâmicas.</p>
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
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-400 font-semibold">Tags dinâmicas:</span>
                  <button
                    type="button"
                    onClick={() => setWaCustomText(prev => prev + ' {nome}')}
                    className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg font-mono text-[11px] font-bold border border-emerald-200 dark:border-emerald-800"
                  >
                    + &#123;nome&#125;
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaCustomText(prev => prev + ' {valor}')}
                    className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg font-mono text-[11px] font-bold border border-emerald-200 dark:border-emerald-800"
                  >
                    + &#123;valor&#125;
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaCustomText(prev => prev + ' {vencimento}')}
                    className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg font-mono text-[11px] font-bold border border-emerald-200 dark:border-emerald-800"
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
