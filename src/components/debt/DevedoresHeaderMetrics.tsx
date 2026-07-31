/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, ShieldAlert, DollarSign, Users, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface DevedoresHeaderMetricsProps {
  onOpenAddModal: () => void;
  totalOverdueAmount: number;
  overdueCount: number;
  totalOpenAmount: number;
  activeDebtorsCount: number;
  formatCurrency: (val: number) => string;
}

export const DevedoresHeaderMetrics: React.FC<DevedoresHeaderMetricsProps> = ({
  onOpenAddModal,
  totalOverdueAmount,
  overdueCount,
  totalOpenAmount,
  activeDebtorsCount,
  formatCurrency,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 shadow-2xl border border-slate-800/80"
    >
      {/* Ambient background glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 via-teal-400 to-emerald-600 rounded-l-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>GESTÃO DE CLIENTES & DEVEDORES</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-display leading-tight">
            Devedores & Cobranças
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
            Monitore todos os clientes com cobranças em aberto, acompanhe saldos em atraso e envie lembretes no WhatsApp em 1 clique.
          </p>
        </div>

        {/* Action Header Highlight Button */}
        <button
          id="btn-devedores-add-main"
          onClick={onOpenAddModal}
          className="group relative overflow-hidden px-6 py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 active:scale-95 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-emerald-300/40"
        >
          <Plus className="w-5 h-5 stroke-[2.8] transition-transform duration-300 group-hover:rotate-90" />
          <span>Adicionar Devedor</span>
        </button>
      </div>

      {/* Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80 relative z-10">
        {/* Card 1: Total em Atraso */}
        <div className="bg-gradient-to-br from-rose-950/60 via-rose-900/40 to-slate-950/80 border border-rose-500/40 p-4.5 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-lg group hover:border-rose-400/60 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5 font-mono">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              Total em Atraso
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-black text-white font-mono mt-2 tracking-tight">
            {formatCurrency(totalOverdueAmount)}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-rose-200 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span>{overdueCount} {overdueCount === 1 ? 'cobrança vencida' : 'cobranças vencidas'}</span>
          </div>
        </div>

        {/* Card 2: Saldo Total Pendente */}
        <div className="bg-white/5 border border-white/10 p-4.5 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-lg group hover:border-white/20 transition-all duration-300">
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-mono">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Saldo Total Pendente
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-black text-white font-mono mt-2 tracking-tight">
            {formatCurrency(totalOpenAmount)}
          </p>

          <p className="text-[11px] font-medium text-slate-400 mt-1.5">
            Em todas as cobranças em aberto
          </p>
        </div>

        {/* Card 3: Clientes com Débitos */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 p-4.5 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-lg group hover:border-emerald-400/50 transition-all duration-300">
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5 font-mono">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Clientes Com Débitos
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-black text-white font-mono mt-2 tracking-tight">
            {activeDebtorsCount} <span className="text-sm text-slate-400 font-bold">{activeDebtorsCount === 1 ? 'cliente' : 'clientes'}</span>
          </p>

          <p className="text-[11px] font-medium text-emerald-300/80 mt-1.5">
            Cadastrados na base ativa
          </p>
        </div>
      </div>
    </motion.div>
  );
};
