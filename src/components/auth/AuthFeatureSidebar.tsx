/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, MessageSquare, Smartphone, CheckCircle2, Sparkles } from 'lucide-react';

export const AuthFeatureSidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-10 lg:p-12 flex-col justify-between relative overflow-hidden text-white border-l border-slate-800/80">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge & Main Value Proposition */}
      <div className="relative z-10 space-y-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Gestão Inteligente de Cobranças</span>
        </span>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight font-display tracking-tight">
          Suas cobranças organizadas,{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400">
            sem caderno, sem bagunça.
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
          O PAGMEFY é a ferramenta ideal para autônomos, prestadores de serviço e pequenos comerciantes. Deixe o papel no passado e receba mais rápido no Pix.
        </p>
      </div>

      {/* Glassmorphism Key Benefits List */}
      <div className="relative z-10 space-y-3 pt-6">
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center gap-3.5 group">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-200">
            Zero risco de perder dados ou folha rasgada
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center gap-3.5 group">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-200">
            Lembrete de cobrança pronto no WhatsApp em 1 clique
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center gap-3.5 group">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-200">
            Acesse do seu celular a qualquer hora e lugar
          </span>
        </div>
      </div>
    </div>
  );
};
