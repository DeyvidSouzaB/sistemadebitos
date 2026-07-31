/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, PlusCircle, Bell, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardHeroProps {
  onOpenAddModal: () => void;
  onSelectOption: (option: string) => void;
  onOpenNotifications?: () => void;
  overdueCount: number;
}

export const DashboardHero: React.FC<DashboardHeroProps> = ({
  onOpenAddModal,
  onSelectOption,
  onOpenNotifications,
  overdueCount,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 shadow-2xl border border-slate-800/80"
    >
      {/* Ambient background glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-600 rounded-l-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Sistema Inteligente de Cobranças</span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-medium backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400 font-bold">● AO VIVO</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-display leading-tight">
            Visão Geral de Recebíveis
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
            Acompanhe o fluxo financeiro em tempo real, gerencie vencimentos com alertas automatizados e envie cobranças amigáveis no WhatsApp.
          </p>

          <div className="pt-1 flex items-center gap-4 text-xs text-slate-400 font-medium flex-wrap">
            <span className="flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Dados protegidos
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Zap className="w-4 h-4 text-amber-400" /> Cobrança em 1-clique
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 lg:pt-0">
          <button
            id="btn-dash-hero-add-debt"
            onClick={onOpenAddModal}
            className="group relative overflow-hidden px-5 py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 active:scale-95 text-slate-950 text-xs sm:text-sm font-black rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all duration-300 cursor-pointer flex items-center gap-2.5 border border-emerald-300/40"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5] transition-transform duration-300 group-hover:rotate-90" />
            <span>Nova Cobrança</span>
          </button>

          <button
            id="btn-dash-hero-lembretes"
            onClick={() => {
              if (onOpenNotifications) {
                onOpenNotifications();
              } else {
                onSelectOption('prazos');
              }
            }}
            className="px-4 py-3.5 bg-white/10 hover:bg-white/15 active:scale-95 border border-white/15 text-slate-100 text-xs sm:text-sm font-bold rounded-2xl backdrop-blur-md transition-all duration-200 cursor-pointer flex items-center gap-2 relative shadow-lg hover:border-emerald-400/40"
          >
            <Bell className="w-4 h-4 text-emerald-400" />
            <span>Lembretes</span>
            {overdueCount > 0 && (
              <span className="flex h-2.5 w-2.5 absolute top-2 right-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectOption('relatorios')}
            className="px-3.5 py-3.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold rounded-2xl transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            title="Abrir Relatórios Financeiros"
          >
            <span>Relatórios</span>
            <ArrowUpRight className="w-4 h-4 opacity-70" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
