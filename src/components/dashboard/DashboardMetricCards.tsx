/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DollarSign, CheckCircle2, AlertTriangle, Users, TrendingUp, ChevronRight, AlertCircle, ArrowUpRight } from 'lucide-react';
import { motion, Variants } from 'motion/react';
import { AnimatedCurrency, AnimatedNumber } from '../AnimatedCounter';
import { Debt } from '../../types';

interface DashboardMetricCardsProps {
  totalRemaining: number;
  totalReceivedThisMonth: number;
  totalOverdueAmount: number;
  overdueDebts: Debt[];
  activeClientsCount: number;
  onSelectOption: (option: string) => void;
}

export const DashboardMetricCards: React.FC<DashboardMetricCardsProps> = ({
  totalRemaining,
  totalReceivedThisMonth,
  totalOverdueAmount,
  overdueDebts,
  activeClientsCount,
  onSelectOption,
}) => {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
    >
      {/* CARD 1: Total a Receber */}
      <motion.div 
        variants={item}
        id="card-total-a-receber"
        role="button"
        tabIndex={0}
        onClick={() => onSelectOption('clientes')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectOption('clientes');
          }
        }}
        className="relative bg-white/90 rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
        title="Ver todos os devedores"
      >
        <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        <div className="flex items-start justify-between gap-3 mb-4 pt-1">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 font-mono">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Total a Receber
            </span>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Saldo pendente em aberto</p>
          </div>
          
          <div className="w-12 h-12 bg-emerald-50/50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100/50 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm ring-4 ring-emerald-500/5">
            <DollarSign className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors font-display">
            <AnimatedCurrency value={totalRemaining} />
          </h3>
          
          <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Fluxo projetado
            </span>
            <span className="font-extrabold text-emerald-600 group-hover:underline flex items-center gap-0.5">
              <span>Detalhar</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </motion.div>

      {/* CARD 2: Recebido no Mês */}
      <motion.div 
        variants={item}
        id="card-recebido-no-mes"
        role="button"
        tabIndex={0}
        onClick={() => onSelectOption('relatorios')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectOption('relatorios');
          }
        }}
        className="relative bg-white/90 rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
        title="Ver relatórios de recebimento"
      >
        <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600" />

        <div className="flex items-start justify-between gap-3 mb-4 pt-1">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 flex items-center gap-1.5 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              Recebido no Mês
            </span>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5 capitalize">
              Entradas em {new Date().toLocaleDateString('pt-BR', { month: 'long' })}
            </p>
          </div>
          
          <div className="w-12 h-12 bg-teal-50/50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0 border border-teal-100/50 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300 shadow-sm ring-4 ring-teal-500/5">
            <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors font-display">
            <AnimatedCurrency value={totalReceivedThisMonth} />
          </h3>
          
          <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="font-bold text-teal-700 bg-teal-50/60 px-2.5 py-0.5 rounded-lg border border-teal-100/50 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
              Liquidado
            </span>
            <span className="font-extrabold text-teal-600 group-hover:underline flex items-center gap-0.5">
              <span>Ver extrato</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </motion.div>

      {/* CARD 3: Em Atraso */}
      <motion.div 
        variants={item}
        id="card-em-atraso"
        role="button"
        tabIndex={0}
        onClick={() => onSelectOption('prazos')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectOption('prazos');
          }
        }}
        className={`relative rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 ${
          overdueDebts.length > 0 
            ? 'bg-gradient-to-br from-rose-600 via-rose-700 to-red-800 text-white border border-rose-500/50 shadow-rose-950/20 ring-1 ring-rose-400/30' 
            : 'bg-white/90 border border-slate-200/80 text-slate-900'
        }`}
        title="Ver vencimentos e títulos em atraso"
      >
        <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full ${
          overdueDebts.length > 0 ? 'bg-gradient-to-r from-amber-300 via-rose-300 to-white' : 'bg-gradient-to-r from-rose-500 to-red-500'
        }`} />

        {overdueDebts.length > 0 && (
          <>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />
          </>
        )}

        <div className="flex items-start justify-between gap-3 mb-4 pt-1 relative z-10">
          <div>
            <span className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 font-mono ${
              overdueDebts.length > 0 ? 'text-rose-100' : 'text-rose-600'
            }`}>
              <AlertCircle className={`w-3.5 h-3.5 ${overdueDebts.length > 0 ? 'text-white animate-bounce' : 'text-rose-500'}`} />
              Em Atraso
            </span>
            <p className={`text-[11px] font-medium mt-0.5 ${overdueDebts.length > 0 ? 'text-rose-100/90' : 'text-slate-400'}`}>
              Títulos vencidos e não pagos
            </p>
          </div>

          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 shadow-md ${
            overdueDebts.length > 0 
              ? 'bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-rose-950/40 group-hover:bg-white group-hover:text-rose-700' 
              : 'bg-rose-50/50 text-rose-600 border border-rose-100/50 group-hover:bg-rose-600 group-hover:text-white'
          }`}>
            <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        <div className="relative z-10">
          <h3 className={`text-2xl sm:text-3xl font-black tracking-tight font-display ${
            overdueDebts.length > 0 ? 'text-white' : 'text-slate-900'
          }`}>
            <AnimatedCurrency value={totalOverdueAmount} />
          </h3>

          <div className={`flex items-center justify-between gap-2 mt-4 pt-3 text-xs border-t ${
            overdueDebts.length > 0 ? 'border-white/20' : 'border-slate-100'
          }`}>
            <span className={`font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1.5 ${
              overdueDebts.length > 0 
                ? 'bg-white/20 text-white backdrop-blur-md border border-white/20' 
                : 'bg-rose-50/60 text-rose-700 border border-rose-100/50'
            }`}>
              <span className={`w-2 h-2 rounded-full ${overdueDebts.length > 0 ? 'bg-amber-300' : 'bg-rose-500'}`} />
              {overdueDebts.length} título{overdueDebts.length !== 1 ? 's' : ''}
            </span>

            <span className={`font-extrabold flex items-center gap-0.5 group-hover:underline ${
              overdueDebts.length > 0 ? 'text-white' : 'text-rose-600'
            }`}>
              <span>Ver atrasos</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </motion.div>

      {/* CARD 4: Clientes Ativos */}
      <motion.div 
        variants={item}
        id="card-clientes-ativos"
        role="button"
        tabIndex={0}
        onClick={() => onSelectOption('clientes')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectOption('clientes');
          }
        }}
        className="relative bg-white/90 rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
        title="Ver lista de clientes cadastrados"
      >
        <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-teal-500" />

        <div className="flex items-start justify-between gap-3 mb-4 pt-1">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 flex items-center gap-1.5 font-mono">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              Clientes Ativos
            </span>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Com saldo pendente</p>
          </div>
          
          <div className="w-12 h-12 bg-indigo-50/50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100/50 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm ring-4 ring-indigo-500/5">
            <Users className="w-6 h-6 stroke-[2.2]" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors font-display">
            <AnimatedNumber value={activeClientsCount} />{' '}
            <span className="text-sm font-bold text-slate-400">
              cliente{activeClientsCount !== 1 ? 's' : ''}
            </span>
          </h3>

          <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="font-semibold text-slate-500">Base cadastrada</span>
            <span className="font-extrabold text-indigo-600 group-hover:underline flex items-center gap-0.5">
              <span>Ver todos</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
