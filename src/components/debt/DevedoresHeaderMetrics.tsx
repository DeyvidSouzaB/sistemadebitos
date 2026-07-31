import React from 'react';
import { Plus, ShieldAlert, DollarSign, Users } from 'lucide-react';

interface DevedoresHeaderMetricsProps {
  onOpenAddModal: () => void;
  totalOverdueAmount: number;
  overdueCount: number;
  totalOpenAmount: number;
  activeDebtorsCount: number;
  formatCurrency: (val: number) => string;
}

export function DevedoresHeaderMetrics({
  onOpenAddModal,
  totalOverdueAmount,
  overdueCount,
  totalOpenAmount,
  activeDebtorsCount,
  formatCurrency,
}: DevedoresHeaderMetricsProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xs relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Devedores & Cobranças
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xl leading-relaxed font-medium">
            Monitore todos os clientes com cobranças em aberto, acompanhe saldos em atraso e envie cobranças no WhatsApp em 1 clique.
          </p>
        </div>

        {/* Action Header Highlight Button */}
        <button
          id="btn-devedores-add-main"
          onClick={onOpenAddModal}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>Adicionar Devedor</span>
        </button>
      </div>

      {/* Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
        <div className="bg-rose-50/80 border border-rose-200/80 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-rose-700 uppercase tracking-wider">Total em Atraso</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-black text-rose-600 font-mono mt-1">
            {formatCurrency(totalOverdueAmount)}
          </p>
          <p className="text-[10px] font-semibold text-rose-700/80 mt-1">
            {overdueCount} {overdueCount === 1 ? 'cobrança vencida' : 'cobranças vencidas'}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Saldo Total Pendente</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-slate-900 font-mono mt-1">
            {formatCurrency(totalOpenAmount)}
          </p>
          <p className="text-[10px] font-semibold text-slate-500 mt-1">
            Em todas as cobranças em aberto
          </p>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">Clientes Com Débitos</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-700 font-mono mt-1">
            {activeDebtorsCount} {activeDebtorsCount === 1 ? 'Cliente' : 'Clientes'}
          </p>
          <p className="text-[10px] font-semibold text-emerald-700/80 mt-1">
            Cadastrados no sistema
          </p>
        </div>
      </div>
    </div>
  );
}
