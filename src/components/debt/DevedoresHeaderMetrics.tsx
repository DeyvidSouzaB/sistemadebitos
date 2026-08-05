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
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white p-6 sm:p-8 shadow-2xl border border-emerald-400/40"
    >
      {/* Accent border and subtle top glow */}
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-white/30 via-white/20 to-white/30" />
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-white/40 via-white/20 to-white/40 rounded-l-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold backdrop-blur-md">
            <Users className="w-3.5 h-3.5 text-white" />
            <span>GESTÃO DE CLIENTES &amp; DEVEDORES</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-display leading-tight">
            Devedores & Cobranças
          </h1>

          <p className="text-xs sm:text-sm text-emerald-50 font-medium leading-relaxed max-w-xl">
            Monitore todos os clientes com cobranças em aberto, acompanhe saldos em atraso e envie lembretes no WhatsApp em 1 clique.
          </p>
        </div>

        {/* Action Header Highlight Button */}
        <button
          id="btn-devedores-add-main"
          onClick={onOpenAddModal}
          className="group relative overflow-hidden px-6 py-3.5 bg-white hover:bg-emerald-50 active:scale-95 text-emerald-700 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-white/80"
        >
          <Plus className="w-5 h-5 stroke-[2.8] transition-transform duration-300 group-hover:rotate-90" />
          <span>Adicionar Devedor</span>
        </button>
      </div>

      {/* Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/20 relative z-10">
        {/* Card 1: Total em Atraso */}
        <div className="bg-white/15 border border-white/25 p-4.5 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-lg group hover:border-white/35 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-black uppercase tracking-wider text-white flex items-center gap-1.5 font-mono">
              <AlertCircle className="w-3.5 h-3.5 text-rose-300" />
              Total em Atraso
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/30 text-rose-200 border border-rose-400/30 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-black text-white font-mono mt-2 tracking-tight">
            {formatCurrency(totalOverdueAmount)}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-rose-200 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-300" />
            <span>{overdueCount} {overdueCount === 1 ? 'cobrança vencida' : 'cobranças vencidas'}</span>
          </div>
        </div>

        {/* Card 2: Saldo Total Pendente */}
        <div className="bg-white/15 border border-white/25 p-4.5 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-lg group hover:border-white/35 transition-all duration-300">
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-black uppercase tracking-wider text-white flex items-center gap-1.5 font-mono">
              <DollarSign className="w-3.5 h-3.5 text-white" />
              Saldo Total Pendente
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-black text-white font-mono mt-2 tracking-tight">
            {formatCurrency(totalOpenAmount)}
          </p>

          <p className="text-[11px] font-medium text-emerald-100 mt-1.5">
            Em todas as cobranças em aberto
          </p>
        </div>

        {/* Card 3: Clientes com Débitos */}
        <div className="bg-white/15 border border-white/25 p-4.5 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-lg group hover:border-white/35 transition-all duration-300">
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-black uppercase tracking-wider text-white flex items-center gap-1.5 font-mono">
              <Users className="w-3.5 h-3.5 text-white" />
              Clientes Com Débitos
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <p className="text-xl sm:text-2xl font-black text-white font-mono mt-2 tracking-tight">
            {activeDebtorsCount} <span className="text-sm text-emerald-100 font-bold">{activeDebtorsCount === 1 ? 'cliente' : 'clientes'}</span>
          </p>

          <p className="text-[11px] font-medium text-emerald-100 mt-1.5">
            Cadastrados na base ativa
          </p>
        </div>
      </div>
    </motion.div>
  );
};
