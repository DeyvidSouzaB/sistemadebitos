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

interface DesktopAppMockupProps {
  userName?: string;
  totalRemaining?: number;
  totalPaid?: number;
  totalOverdue?: number;
  activeClientsCount?: number;
}

export const DesktopAppMockup: React.FC<DesktopAppMockupProps> = ({
  userName = "Deyvid Dener",
  totalRemaining = 2000.99,
  totalPaid = 0.00,
  totalOverdue = 2000.99,
  activeClientsCount = 1
}) => {
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/90 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.25)] overflow-hidden text-slate-900 font-sans select-none">
      
      {/* Mac-Style Browser Window Header */}
      <div className="bg-slate-100/90 border-b border-slate-200/80 px-3.5 py-1.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex-1 max-w-xs mx-auto bg-white px-3 py-0.5 rounded-full text-[10px] text-slate-400 font-mono text-center truncate border border-slate-200/60">
          https://pagmefy.app/dashboard
        </div>
        <div className="w-10 shrink-0" />
      </div>

      {/* Top Application Navbar */}
      <div className="bg-white border-b border-slate-200/80 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Hamburger & Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 border border-slate-200/60">
            <Menu className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-black text-slate-900 tracking-tight font-display truncate">
              Painel Dashboard
            </h3>
            <p className="text-[9px] text-slate-400 font-medium truncate hidden sm:block">
              Visão geral de recebíveis, indicadores e alertas rápidos
            </p>
          </div>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="relative w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200/60">
            <Bell className="w-3 h-3" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 text-white font-black text-[7px] rounded-full flex items-center justify-center ring-1 ring-white">
              1
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100/90/90 pl-1 pr-2 py-0.5 rounded-full border border-slate-200/60">
            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-black text-[9px] flex items-center justify-center">
              {initials}
            </div>
            <span className="text-[10px] font-bold text-slate-800 hidden sm:inline">
              {userName}
            </span>
          </div>

          <div className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400">
            <LogOut className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Main Body Content */}
      <div className="p-2.5 sm:p-4 space-y-3">
        
        {/* Dark Hero Banner */}
        <div className="relative rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-3.5 sm:p-4 shadow-md border border-slate-800/80 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-600 rounded-l-xl" />

          <div className="relative z-10 space-y-2">
            
            {/* Banner Text Content */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[8px] sm:text-[9px] font-bold">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                  Sistema Inteligente de Cobranças
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-[8px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AO VIVO
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black tracking-tight font-display leading-tight text-white">
                Visão Geral de Recebíveis
              </h2>

              <p className="text-[9px] sm:text-[10px] text-slate-300 font-medium leading-normal line-clamp-2 sm:line-clamp-none">
                Acompanhe o fluxo financeiro em tempo real, gerencie vencimentos com alertas automatizados e envie cobranças amigáveis no WhatsApp.
              </p>

              <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-semibold text-slate-300 pt-0.5 flex-wrap">
                <span className="flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> Dados protegidos
                </span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Zap className="w-2.5 h-2.5 text-amber-400" /> Cobrança em 1-clique
                </span>
              </div>
            </div>

            {/* Banner Action Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <button className="px-3 py-1.5 bg-emerald-400 text-slate-950 text-[10px] font-black rounded-lg shadow-xs flex items-center gap-1 border border-emerald-300">
                <PlusCircle className="w-3 h-3 stroke-[2.5]" />
                <span>Nova Cobrança</span>
              </button>

              <button className="px-2.5 py-1.5 bg-white/10 border border-white/15 text-white text-[10px] font-bold rounded-lg backdrop-blur-md flex items-center gap-1 relative">
                <Bell className="w-3 h-3 text-amber-300" />
                <span>Lembretes</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 absolute top-1 right-1" />
              </button>

              <button className="px-2.5 py-1.5 bg-white/10 border border-white/15 text-white text-[10px] font-bold rounded-lg backdrop-blur-md flex items-center gap-1">
                <span>Relatórios</span>
                <FileText className="w-2.5 h-2.5 text-slate-300" />
              </button>
            </div>

          </div>
        </div>

        {/* 4 Executive Metric Cards Grid (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          
          {/* Card 1: TOTAL A RECEBER */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-start justify-between gap-1">
              <div>
                <span className="text-[8px] sm:text-[9px] font-black uppercase text-emerald-600 font-mono flex items-center gap-0.5">
                  <DollarSign className="w-2.5 h-2.5" /> TOTAL A RECEBER
                </span>
                <p className="text-[8px] text-slate-400 font-medium truncate">Saldo pendente em aberto</p>
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-emerald-50/60 text-emerald-600 rounded-lg flex items-center justify-center shrink-0 border border-emerald-100/50">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-display tracking-tight">
                {formatCurrency(totalRemaining)}
              </h3>
            </div>

            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[8px] sm:text-[9px]">
              <span className="text-slate-400 font-mono font-bold flex items-center gap-0.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> Fluxo projetado
              </span>
              <span className="font-bold text-emerald-600 flex items-center gap-0.5 shrink-0">
                Detalhar <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>

          {/* Card 2: RECEBIDO NO MÊS */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-start justify-between gap-1">
              <div>
                <span className="text-[8px] sm:text-[9px] font-black uppercase text-teal-600 font-mono flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> RECEBIDO NO MÊS
                </span>
                <p className="text-[8px] text-slate-400 font-medium truncate">Entradas em Agosto</p>
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-teal-50/60 text-teal-600 rounded-lg flex items-center justify-center shrink-0 border border-teal-100/50">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-display tracking-tight">
                {formatCurrency(totalPaid)}
              </h3>
            </div>

            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[8px] sm:text-[9px]">
              <span className="text-teal-600 font-mono font-bold flex items-center gap-0.5 truncate">
                <TrendingUp className="w-2.5 h-2.5" /> Liquidado
              </span>
              <span className="font-bold text-teal-600 flex items-center gap-0.5 shrink-0">
                Ver extrato <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>

          {/* Card 3: EM ATRASO (VIBRANT RED CARD) */}
          <div className="bg-gradient-to-br from-rose-600 via-red-600 to-rose-700 text-white rounded-xl p-3 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-start justify-between gap-1">
              <div>
                <span className="text-[8px] sm:text-[9px] font-black uppercase text-rose-100 font-mono flex items-center gap-0.5">
                  <AlertTriangle className="w-2.5 h-2.5 text-amber-300" /> EM ATRASO
                </span>
                <p className="text-[8px] text-rose-100/80 font-medium truncate">Títulos vencidos e não pagos</p>
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/15 text-white rounded-lg flex items-center justify-center shrink-0 border border-white/20">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-white font-display tracking-tight">
                {formatCurrency(totalOverdue)}
              </h3>
            </div>

            <div className="pt-1.5 border-t border-white/20 flex items-center justify-between text-[8px] sm:text-[9px]">
              <span className="text-rose-100 font-mono font-bold flex items-center gap-0.5 bg-white/15 px-1.5 py-0.2 rounded-full truncate">
                <span className="w-1 h-1 rounded-full bg-amber-300 animate-ping" /> 1 título
              </span>
              <span className="font-black text-white flex items-center gap-0.5 shrink-0">
                Ver atrasos <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>

          {/* Card 4: CLIENTES ATIVOS */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-2">
            <div className="flex items-start justify-between gap-1">
              <div>
                <span className="text-[8px] sm:text-[9px] font-black uppercase text-indigo-600 font-mono flex items-center gap-0.5">
                  <Users className="w-2.5 h-2.5" /> CLIENTES ATIVOS
                </span>
                <p className="text-[8px] text-slate-400 font-medium truncate">Com saldo pendente</p>
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-indigo-50/60 text-indigo-600 rounded-lg flex items-center justify-center shrink-0 border border-indigo-100/50">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 font-display tracking-tight flex items-baseline gap-1">
                {activeClientsCount} <span className="text-[10px] font-bold text-slate-400 font-sans">cliente</span>
              </h3>
            </div>

            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[8px] sm:text-[9px]">
              <span className="text-slate-400 font-mono font-bold truncate">
                Base cadastrada
              </span>
              <span className="font-bold text-indigo-600 flex items-center gap-0.5 shrink-0">
                Ver todos <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
