/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Menu, 
  Bell, 
  LogOut, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Users,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { formatCurrency } from '../../hooks/useDebtCalculations';

interface MobilePhoneMockupProps {
  totalRemaining?: number;
  totalPaid?: number;
  totalOverdue?: number;
  activeClientsCount?: number;
}

export const MobilePhoneMockup: React.FC<MobilePhoneMockupProps> = ({
  totalRemaining = 2000.99,
  totalPaid = 0.00,
  totalOverdue = 2000.99,
  activeClientsCount = 1
}) => {
  return (
    <div className="relative flex justify-center items-center py-4">
      {/* Ambient Glow behind phone */}
      <div className="absolute w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute w-64 h-64 bg-teal-400/15 rounded-full blur-2xl pointer-events-none -z-10 translate-y-12" />

      {/* Outer Smartphone Frame (iPhone 15 Pro Style) */}
      <div className="relative w-[320px] sm:w-[350px] h-[660px] bg-slate-950 rounded-[50px] p-3 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.6)] border-[4px] border-slate-800/90 ring-1 ring-white/10 overflow-hidden select-none">
        
        {/* Physical Side Buttons Simulation */}
        <div className="absolute -left-[7px] top-24 w-[3px] h-8 bg-slate-700 rounded-l-sm" />
        <div className="absolute -left-[7px] top-36 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
        <div className="absolute -left-[7px] top-52 w-[3px] h-12 bg-slate-700 rounded-l-sm" />
        <div className="absolute -right-[7px] top-32 w-[3px] h-16 bg-slate-700 rounded-r-sm" />

        {/* Screen Container */}
        <div className="relative w-full h-full bg-slate-50 rounded-[40px] overflow-hidden flex flex-col justify-between border border-slate-800/40 font-sans">
          
          {/* Top Speaker / Dynamic Island */}
          <div className="sticky top-0 z-30 pt-2 bg-white pb-1 border-b border-slate-100/80">
            <div className="w-28 h-4 bg-black rounded-full mx-auto flex items-center justify-between px-2.5 shadow-md">
              <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-900" />
            </div>

            {/* Mobile Header Bar */}
            <div className="px-3.5 pt-2 pb-1.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 border border-slate-200/60">
                  <Menu className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-black text-slate-900 tracking-tight font-display leading-tight truncate">
                    Painel Dashboard
                  </h3>
                  <p className="text-[9px] text-slate-400 font-medium truncate leading-tight">
                    Visão geral de recebíveis, indicadores e alertas rápidos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <div className="relative w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200/60">
                  <Bell className="w-3.5 h-3.5" />
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 text-white font-black text-[8px] rounded-full flex items-center justify-center ring-1 ring-white">
                    1
                  </span>
                </div>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400">
                  <LogOut className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Screen Content Body */}
          <div className="flex-1 overflow-y-auto space-y-3.5 px-3 py-3 scrollbar-none text-slate-900">
            
            {/* Dark Mobile Hero Banner */}
            <div className="relative rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-4 shadow-md border border-slate-800/80 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-600 rounded-l-2xl" />

              <div className="space-y-2.5 relative z-10">
                {/* Badges Stack */}
                <div className="flex flex-col gap-1.5 items-start">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[9px] font-bold">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    Sistema Inteligente de Cobranças
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-[8px] font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AO VIVO
                  </span>
                </div>

                {/* Banner Title & Description */}
                <div>
                  <h2 className="text-lg font-black tracking-tight font-display leading-tight text-white">
                    Visão Geral de Recebíveis
                  </h2>
                  <p className="text-[10px] text-slate-300 font-medium leading-relaxed mt-1">
                    Acompanhe o fluxo financeiro em tempo real, gerencie vencimentos com alertas automatizados e envie cobranças amigáveis no WhatsApp.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[9px] font-semibold text-slate-300 pt-0.5 flex-wrap">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Dados protegidos
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> Cobrança em 1-clique
                  </span>
                </div>

                {/* Action Buttons in Banner */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <button className="flex-1 py-2 px-3 bg-emerald-400 text-slate-950 text-[11px] font-black rounded-xl shadow-xs flex items-center justify-center gap-1.5 border border-emerald-300">
                      <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Nova Cobrança</span>
                    </button>

                    <button className="py-2 px-3 bg-white/10 border border-white/15 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 relative">
                      <Bell className="w-3.5 h-3.5 text-amber-300" />
                      <span>Lembretes</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1.5 right-1.5" />
                    </button>
                  </div>

                  <button className="w-auto py-1.5 px-3 bg-white/10 border border-white/15 text-white text-[10px] font-bold rounded-xl flex items-center gap-1">
                    <span>Relatórios</span>
                    <FileText className="w-3 h-3 text-slate-300" />
                  </button>
                </div>

              </div>
            </div>

            {/* Mobile Metric Card 1: TOTAL A RECEBER */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-600 font-mono flex items-center gap-1">
                    <DollarSign className="w-3 h-3" /> TOTAL A RECEBER
                  </span>
                  <p className="text-[9px] text-slate-400 font-medium">Saldo pendente em aberto</p>
                </div>
                <div className="w-8 h-8 bg-emerald-50/60 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100/50">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 font-display tracking-tight">
                  {formatCurrency(totalRemaining)}
                </h3>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-slate-400 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Fluxo projetado
                </span>
                <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                  Detalhar <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Mobile Metric Card 2: RECEBIDO NO MÊS */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-teal-600 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> RECEBIDO NO MÊS
                  </span>
                  <p className="text-[9px] text-slate-400 font-medium">Entradas em Agosto</p>
                </div>
                <div className="w-8 h-8 bg-teal-50/60 text-teal-600 rounded-xl flex items-center justify-center shrink-0 border border-teal-100/50">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 font-display tracking-tight">
                  {formatCurrency(totalPaid)}
                </h3>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-teal-600 font-mono font-bold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Liquidado
                </span>
                <span className="font-bold text-teal-600 flex items-center gap-0.5">
                  Ver extrato <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Mobile Metric Card 3: EM ATRASO (ROSE CARD) */}
            <div className="bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 text-white rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-rose-100 font-mono flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-amber-300" /> EM ATRASO
                  </span>
                  <p className="text-[9px] text-rose-100/80 font-medium">Títulos vencidos e não pagos</p>
                </div>
                <div className="w-8 h-8 bg-white/15 text-white rounded-xl flex items-center justify-center shrink-0 border border-white/20">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-white font-display tracking-tight">
                  {formatCurrency(totalOverdue)}
                </h3>
              </div>

              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[10px]">
                <span className="text-rose-100 font-mono font-bold flex items-center gap-1 bg-white/15 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" /> 1 título
                </span>
                <span className="font-black text-white flex items-center gap-0.5">
                  Ver atrasos <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="py-2 flex justify-center items-center bg-white border-t border-slate-100">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
};
