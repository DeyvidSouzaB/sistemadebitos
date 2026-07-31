/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, CheckCircle2, MessageCircle, Sparkles, Send } from 'lucide-react';
import { getWhatsappConfig, saveWhatsappConfig, buildWhatsappMessage, WhatsappConfig } from '../utils/phoneUtils';

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
    name: 'Deyvid Dener',
    currentAmount: 170,
    dueDate: '2026-07-31',
  };

  const previewMessage = buildWhatsappMessage(sampleDebt, {
    mode: waMode,
    customTemplate: waCustomText,
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Configurações do PAGMEFY</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie seu perfil, preferências de exibição, regras de notificação e mensagens de WhatsApp.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-extrabold animate-bounce shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Configurações Salvas!</span>
          </div>
        )}
      </div>

      <div className="max-w-4xl space-y-6">
        {/* User Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-emerald-600" /> Perfil do Usuário
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="input-config-user-name" className="block text-xs font-bold text-slate-700 mb-1.5">Nome / Razão Social</label>
              <input
                id="input-config-user-name"
                type="text"
                readOnly
                value={userName}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="input-config-user-email" className="block text-xs font-bold text-slate-700 mb-1.5">E-mail de Acesso</label>
              <input
                id="input-config-user-email"
                type="email"
                readOnly
                value={userEmail}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Message Settings */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" /> Formato de Mensagens do WhatsApp
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Personalizável
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Escolha como o PAGMEFY deve abrir as conversas no WhatsApp ao clicar no botão de cobrança dos clientes:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Option 1: Empty / Direct chat */}
            <div
              role="radio"
              aria-checked={waMode === 'empty'}
              tabIndex={0}
              onClick={() => setWaMode('empty')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setWaMode('empty');
                }
              }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                waMode === 'empty'
                  ? 'border-emerald-600 bg-emerald-50/30 shadow-xs'
                  : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    🚀 Ir Direto ao Chat (Sem Texto)
                  </span>
                  <input
                    type="radio"
                    name="waMode"
                    checked={waMode === 'empty'}
                    onChange={() => setWaMode('empty')}
                    className="accent-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Abre o chat do cliente instantaneamente no WhatsApp <strong>sem nenhuma mensagem pré-escrita</strong> no campo de envio.
                </p>
              </div>
            </div>

            {/* Option 2: Standard friendly */}
            <div
              role="radio"
              aria-checked={waMode === 'standard'}
              tabIndex={0}
              onClick={() => setWaMode('standard')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setWaMode('standard');
                }
              }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                waMode === 'standard'
                  ? 'border-emerald-600 bg-emerald-50/30 shadow-xs'
                  : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    💬 Lembrete de Cobrança (Padrão)
                  </span>
                  <input
                    type="radio"
                    name="waMode"
                    checked={waMode === 'standard'}
                    onChange={() => setWaMode('standard')}
                    className="accent-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Gera uma mensagem cordial lembrando o valor e a data de vencimento da cobrança.
                </p>
              </div>
            </div>

            {/* Option 3: Formal */}
            <div
              role="radio"
              aria-checked={waMode === 'formal'}
              tabIndex={0}
              onClick={() => setWaMode('formal')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setWaMode('formal');
                }
              }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                waMode === 'formal'
                  ? 'border-emerald-600 bg-emerald-50/30 shadow-xs'
                  : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    📄 Notificação Formal
                  </span>
                  <input
                    type="radio"
                    name="waMode"
                    checked={waMode === 'formal'}
                    onChange={() => setWaMode('formal')}
                    className="accent-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Mensagem mais direta e solene solicitando a quitação do saldo pendente.
                </p>
              </div>
            </div>

            {/* Option 4: Custom */}
            <div
              role="radio"
              aria-checked={waMode === 'custom'}
              tabIndex={0}
              onClick={() => setWaMode('custom')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setWaMode('custom');
                }
              }}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                waMode === 'custom'
                  ? 'border-emerald-600 bg-emerald-50/30 shadow-xs'
                  : 'border-slate-200/80 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    ✍️ Texto Personalizado
                  </span>
                  <input
                    type="radio"
                    name="waMode"
                    checked={waMode === 'custom'}
                    onChange={() => setWaMode('custom')}
                    className="accent-emerald-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Crie seu próprio modelo usando as tags <code>&#123;nome&#125;</code>, <code>&#123;valor&#125;</code> e <code>&#123;vencimento&#125;</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Custom Textarea if mode === 'custom' */}
          {waMode === 'custom' && (
            <div className="space-y-2 pt-2">
              <label htmlFor="input-wa-custom-text" className="block text-xs font-extrabold text-slate-700">Modelo Personalizado de Mensagem:</label>
              <textarea
                id="input-wa-custom-text"
                rows={3}
                value={waCustomText}
                onChange={(e) => setWaCustomText(e.target.value)}
                placeholder="Ex: Olá {nome}, tudo bem? Seu débito de {valor} venceu em {vencimento}."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Tags disponíveis: <code>&#123;nome&#125;</code> = Nome do cliente | <code>&#123;valor&#125;</code> = Valor do débito | <code>&#123;vencimento&#125;</code> = Data de vencimento.
              </p>
            </div>
          )}

          {/* Live Preview Box */}
          <div className="p-4 bg-slate-100/70 border border-slate-200/80 rounded-2xl space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Send className="w-3 h-3 text-emerald-600" /> Prévia da Ação ao Clicar no WhatsApp:
            </span>

            {waMode === 'empty' ? (
              <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>O WhatsApp abrirá o chat do cliente diretamente com o campo de texto <strong>totalmente limpo</strong>.</span>
              </div>
            ) : (
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium italic shadow-2xs leading-relaxed whitespace-pre-wrap">
                "{previewMessage}"
              </div>
            )}
          </div>
        </div>

        {/* Preferences Form */}
        <form onSubmit={handleSavePreferences} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="w-4 h-4 text-emerald-600" /> Alertas e Notificações
          </h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 cursor-pointer hover:bg-slate-100/80 transition-colors">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Destaque de cobranças em atraso</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Exibir banner em vermelho e alertas sonoros/visuais para títulos vencidos.</span>
              </div>
              <input
                type="checkbox"
                checked={autoReminders}
                onChange={(e) => setAutoReminders(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </label>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Moeda Principal</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">Símbolo exibido nos relatórios e nos cards.</span>
              </div>
              <select
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="bg-white border border-slate-200 text-xs font-bold text-slate-800 px-3 py-1.5 rounded-xl focus:outline-none"
              >
                <option value="R$">Real Brasileiro (R$)</option>
                <option value="$">Dólar ($)</option>
                <option value="€">Euro (€)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar Preferências</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
