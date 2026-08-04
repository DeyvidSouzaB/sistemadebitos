/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart3, Sparkles, TrendingUp, DollarSign, PieChart, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MonthlyChartItem } from '../../hooks/useDashboardMetrics';
import { formatCurrency } from '../../hooks/useDebtCalculations';

interface DashboardChartProps {
  monthlyChartData: MonthlyChartItem[];
  maxChartValue: number;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({
  monthlyChartData,
  maxChartValue,
}) => {
  const [chartMode, setChartMode] = useState<'bar' | 'overview'>('bar');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  // Quick summary calculations
  const totalReceived6Months = monthlyChartData.reduce((acc, m) => acc + m.received, 0);
  const totalPending6Months = monthlyChartData.reduce((acc, m) => acc + m.pending, 0);
  const avgMonthlyReceived = totalReceived6Months / (monthlyChartData.length || 1);
  const grandTotal = totalReceived6Months + totalPending6Months;
  const settlementRate = grandTotal > 0 ? Math.round((totalReceived6Months / grandTotal) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/90 rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm relative overflow-hidden"
    >
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50/60 text-emerald-600 rounded-2xl border border-emerald-100/50 shadow-sm shrink-0">
            <BarChart3 className="w-6 h-6 stroke-[2.2]" />
          </div>
          
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-black text-slate-900 tracking-tight font-display">
                Evolução de Recebimentos
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80/80 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                6 Meses
              </span>
            </div>
            
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Histórico comparativo de valores liquidados vs. saldos gerados por mês
            </p>
          </div>
        </div>

        {/* Controls & Legend */}
        <div className="flex items-center gap-4 flex-wrap justify-between lg:justify-end">
          <div className="flex items-center gap-3 text-xs font-bold bg-slate-50/50 px-3.5 py-2 rounded-2xl border border-slate-200/60/60">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shrink-0 shadow-xs" />
              Recebido
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 shrink-0 shadow-xs" />
              Pendente
            </span>
          </div>

          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setChartMode('bar')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                chartMode === 'bar'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Gráfico</span>
            </button>

            <button
              type="button"
              onClick={() => setChartMode('overview')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                chartMode === 'overview'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Resumo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top KPI Mini Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="p-3.5 bg-slate-50/80/40 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Média Mensal</span>
            <p className="text-sm font-black text-slate-900 font-mono">{formatCurrency(avgMonthlyReceived)}</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-100/60/60 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 bg-slate-50/80/40 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Volume Total (6M)</span>
            <p className="text-sm font-black text-slate-900 font-mono">{formatCurrency(grandTotal)}</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-teal-100/60/60 text-teal-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 bg-slate-50/80/40 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Taxa de Adimplência</span>
            <p className="text-sm font-black text-emerald-600 font-mono">{settlementRate}% quitado</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-indigo-100/60/60 text-indigo-600 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Chart Content */}
      {chartMode === 'bar' ? (
        <div className="pt-2">
          <div className="h-64 sm:h-72 w-full flex items-end gap-2 sm:gap-6 pt-12 pb-2 px-2 relative border-b border-slate-100">
            {/* Horizontal guideline grid */}
            <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-200/60" />
            <div className="absolute inset-x-0 top-1/3 border-b border-dashed border-slate-200/60" />
            <div className="absolute inset-x-0 top-2/3 border-b border-dashed border-slate-200/60" />

            {monthlyChartData.map((item, idx) => {
              const receivedHeightPct = Math.min(100, (item.received / maxChartValue) * 100);
              const pendingHeightPct = Math.min(100, (item.pending / maxChartValue) * 100);
              const isHovered = hoveredMonth === idx;

              return (
                <div
                  key={`${item.monthKey}-${idx}`}
                  onMouseEnter={() => setHoveredMonth(idx)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  className="flex-1 h-full flex flex-col justify-end items-center relative group cursor-pointer"
                >
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute -top-20 z-30 bg-slate-950 text-white p-3 rounded-2xl shadow-2xl border border-slate-800 text-center whitespace-nowrap pointer-events-none backdrop-blur-md"
                      >
                        <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider font-mono">
                          {item.label} ({item.monthKey})
                        </p>
                        <div className="flex items-center gap-4 text-xs mt-1 font-mono">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Rec: {formatCurrency(item.received)}
                          </span>
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Pend: {formatCurrency(item.pending)}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="w-full flex items-end justify-center gap-1.5 sm:gap-2 h-full max-w-[90px]">
                    {/* Received Bar */}
                    <div className="flex-1 flex flex-col items-center h-full justify-end">
                      {item.received > 0 && (
                        <span className="text-[10px] font-mono text-emerald-600 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                          {item.received >= 1000 ? `${(item.received / 1000).toFixed(1)}k` : Math.round(item.received)}
                        </span>
                      )}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${receivedHeightPct}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className={`w-full rounded-t-xl transition-all duration-300 ${
                          isHovered 
                            ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-lg shadow-emerald-500/30 scale-x-105' 
                            : 'bg-gradient-to-t from-emerald-600 to-emerald-500'
                        }`}
                        style={{ minHeight: item.received > 0 ? '8px' : '0' }}
                      />
                    </div>

                    {/* Pending Bar */}
                    <div className="flex-1 flex flex-col items-center h-full justify-end">
                      {item.pending > 0 && (
                        <span className="text-[10px] font-mono text-amber-600 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                          {item.pending >= 1000 ? `${(item.pending / 1000).toFixed(1)}k` : Math.round(item.pending)}
                        </span>
                      )}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${pendingHeightPct}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 + 0.02 }}
                        className={`w-full rounded-t-xl transition-all duration-300 ${
                          isHovered 
                            ? 'bg-gradient-to-t from-amber-600 to-orange-400 shadow-lg shadow-amber-500/30 scale-x-105' 
                            : 'bg-gradient-to-t from-amber-500/90 to-amber-400/90'
                        }`}
                        style={{ minHeight: item.pending > 0 ? '8px' : '0' }}
                      />
                    </div>
                  </div>

                  <span className={`text-xs font-bold mt-3 font-mono transition-all duration-200 ${
                    isHovered 
                      ? 'text-emerald-600 font-black scale-110' 
                      : 'text-slate-500'
                  }`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {monthlyChartData.map((item, idx) => {
            const total = item.received + item.pending;
            const pctReceived = total > 0 ? Math.round((item.received / total) * 100) : 0;

            return (
              <div key={`${item.monthKey}-${idx}`} className="p-4 bg-slate-50/80/50 rounded-2xl border border-slate-100 flex flex-col justify-between hover:border-emerald-300 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-slate-800 tracking-wider font-mono">
                    {item.label} ({item.monthKey})
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {pctReceived}% liquidado
                  </span>
                </div>

                <div className="space-y-1.5 my-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Recebido:</span>
                    <span className="font-bold text-emerald-600 font-mono">{formatCurrency(item.received)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Pendente:</span>
                    <span className="font-bold text-amber-600 font-mono">{formatCurrency(item.pending)}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pctReceived}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
        <span>💡 Passe o mouse sobre as barras para conferir detalhes detalhados de cada mês.</span>
        <span className="font-mono font-bold text-slate-600">
          Média mensal: {formatCurrency(avgMonthlyReceived)}/mês
        </span>
      </div>
    </motion.div>
  );
};
