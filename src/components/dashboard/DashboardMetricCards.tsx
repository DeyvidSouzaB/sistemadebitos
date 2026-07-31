/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DollarSign, CheckCircle2, AlertTriangle, Users, TrendingUp, ChevronRight, AlertCircle } from 'lucide-react';
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* CARD 1: Total a Receber */}
      <div 
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
        className="relative bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
        title="Ver todos os devedores"
      >
        <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full bg-gradient-to-r from-emerald-500 to-teal-500" />

        <div className="flex items-start justify-between gap-3 mb-4 pt-1">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Total a Receber
            </span>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Saldo pendente em aberto</p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-2xs">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
            <AnimatedCurrency value={totalRemaining} />
          </h3>
          <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-500">Fluxo projetado</span>
            <span className="font-extrabold text-emerald-700 group-hover:underline flex items-center gap-0.5">
              <span>Detalhar</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* CARD 2: Recebido no Mês */}
      <div 
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
        className="relative bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
        title="Ver relatórios de recebimento"
      >
        <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full bg-gradient-to-r from-emerald-500 to-teal-500" />

        <div className="flex items-start justify-between gap-3 mb-4 pt-1">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Recebido no Mês
            </span>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Entradas em {new Date().toLocaleDateString('pt-BR', { month: 'long' })}</p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-2xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
            <AnimatedCurrency value={totalReceivedThisMonth} />
          </h3>
          <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
              Liquidado
            </span>
            <span className="font-extrabold text-emerald-600 group-hover:underline flex items-center gap-0.5">
              <span>Ver extrato</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* CARD 3: Em Atraso */}
      <div 
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
        className={`relative rounded-3xl p-6 border shadow-2xs flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 ${
          overdueDebts.length > 0 
            ? 'bg-gradient-to-br from-rose-500 via-rose-600 to-orange-600 text-white border-rose-400 ring-2 ring-rose-500/30' 
            : 'bg-white border-slate-200/90 text-slate-900'
        }`}
        title="Ver vencimentos e títulos em atraso"
      >
        <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full bg-gradient-to-r from-emerald-500 to-teal-500" />

        {overdueDebts.length > 0 && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        )}

        <div className="flex items-start justify-between gap-3 mb-4 pt-1">
          <div>
            <span className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
              overdueDebts.length > 0 ? 'text-rose-100' : 'text-rose-600'
            }`}>
              <AlertCircle className={`w-3.5 h-3.5 ${overdueDebts.length > 0 ? 'text-white animate-bounce' : 'text-rose-500'}`} />
              Em Atraso
            </span>
            <p className={`text-[11px] font-medium mt-0.5 ${overdueDebts.length > 0 ? 'text-rose-100/90' : 'text-slate-400'}`}>
              Títulos vencidos e não pagos
            </p>
          </div>

          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
            overdueDebts.length > 0 
              ? 'bg-white text-rose-600 shadow-rose-900/30' 
              : 'bg-rose-50 text-rose-600 border border-rose-100'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div>
          <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${
            overdueDebts.length > 0 ? 'text-white' : 'text-slate-900'
          }`}>
            <AnimatedCurrency value={totalOverdueAmount} />
          </h3>

          <div className={`flex items-center justify-between gap-2 mt-4 pt-3 text-xs border-t ${
            overdueDebts.length > 0 ? 'border-rose-400/40' : 'border-slate-100'
          }`}>
            <span className={`font-extrabold px-2.5 py-1 rounded-xl ${
              overdueDebts.length > 0 
                ? 'bg-white/20 text-white backdrop-blur-sm' 
                : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
              {overdueDebts.length} título{overdueDebts.length !== 1 ? 's' : ''} vencido{overdueDebts.length !== 1 ? 's' : ''}
            </span>

            <span className={`font-extrabold flex items-center gap-0.5 group-hover:underline ${
              overdueDebts.length > 0 ? 'text-white' : 'text-rose-600'
            }`}>
              <span>Ver atrasos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* CARD 4: Clientes Ativos */}
      <div 
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
        className="relative bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
        title="Ver lista de clientes cadastrados"
      >
        <div className="absolute top-0 left-6 right-6 h-[3px] rounded-b-full bg-gradient-to-r from-emerald-500 to-teal-500" />

        <div className="flex items-start justify-between gap-3 mb-4 pt-1">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              Clientes Ativos
            </span>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Com saldo pendente</p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-2xs">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
            <AnimatedNumber value={activeClientsCount} />{' '}
            <span className="text-sm font-bold text-slate-500">
              cliente{activeClientsCount !== 1 ? 's' : ''}
            </span>
          </h3>

          <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-500">Base cadastrada</span>
            <span className="font-extrabold text-emerald-700 group-hover:underline flex items-center gap-0.5">
              <span>Ver todos</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
