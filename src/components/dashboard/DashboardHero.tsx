/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, PlusCircle, Bell, ArrowRight } from 'lucide-react';

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
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl">
      {/* Decorative emerald subtle bar accent */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-teal-400" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistema Inteligente de Cobranças</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-display">
            Visão Geral de Recebíveis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
            Acompanhe o fluxo financeiro em tempo real, gerencie vencimentos e envie cobranças amigáveis no WhatsApp.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            id="btn-dash-hero-add-debt"
            onClick={onOpenAddModal}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 text-xs sm:text-sm font-black rounded-2xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
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
            className="px-4 py-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-2 relative"
          >
            <Bell className="w-4 h-4 text-emerald-400" />
            <span>Lembretes</span>
            {overdueCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse absolute top-2 right-2" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
