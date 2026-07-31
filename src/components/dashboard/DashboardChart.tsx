/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart3, Sparkles } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 shadow-2xs">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Evolução de Recebimentos</h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
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
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3 text-xs font-bold mr-2">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              Recebido
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              A Receber / Pendente
            </span>
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setChartMode('bar')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                chartMode === 'bar'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Gráfico
            </button>
            <button
              type="button"
              onClick={() => setChartMode('overview')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                chartMode === 'overview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Resumo
            </button>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      {chartMode === 'bar' ? (
        <div className="pt-2">
          <div className="h-64 w-full flex items-end gap-3 sm:gap-6 pt-10 pb-2 px-2 relative border-b border-slate-100">
            <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-100" />
            <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-slate-100" />

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
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className="absolute -top-16 z-30 bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-800 text-center whitespace-nowrap pointer-events-none"
                      >
                        <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{item.label} ({item.monthKey})</p>
                        <div className="flex items-center gap-3 text-xs mt-1 font-mono">
                          <span className="text-emerald-400 font-bold">
                            Rec: {formatCurrency(item.received)}
                          </span>
                          <span className="text-amber-400 font-bold">
                            Pend: {formatCurrency(item.pending)}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="w-full flex items-end justify-center gap-1.5 h-full max-w-[80px]">
                    <div className="flex-1 flex flex-col items-center h-full justify-end">
                      {item.received > 0 && (
                        <span className="text-[9px] font-mono text-emerald-700 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                          {item.received >= 1000 ? `${(item.received / 1000).toFixed(1)}k` : Math.round(item.received)}
                        </span>
                      )}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${receivedHeightPct}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className={`w-full rounded-t-lg transition-all duration-200 ${
                          isHovered ? 'bg-emerald-400 shadow-md shadow-emerald-500/20' : 'bg-emerald-500'
                        }`}
                        style={{ minHeight: item.received > 0 ? '6px' : '0' }}
                      />
                    </div>

                    <div className="flex-1 flex flex-col items-center h-full justify-end">
                      {item.pending > 0 && (
                        <span className="text-[9px] font-mono text-amber-700 font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                          {item.pending >= 1000 ? `${(item.pending / 1000).toFixed(1)}k` : Math.round(item.pending)}
                        </span>
                      )}
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${pendingHeightPct}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 + 0.02 }}
                        className={`w-full rounded-t-lg transition-all duration-200 ${
                          isHovered ? 'bg-amber-400 shadow-md shadow-amber-500/20' : 'bg-amber-500/80'
                        }`}
                        style={{ minHeight: item.pending > 0 ? '6px' : '0' }}
                      />
                    </div>
                  </div>

                  <span className={`text-xs font-bold mt-3 font-mono transition-colors ${
                    isHovered ? 'text-emerald-700 font-black scale-110' : 'text-slate-500'
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
              <div key={`${item.monthKey}-${idx}`} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-slate-800 tracking-wider font-mono">
                    {item.label} ({item.monthKey})
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {pctReceived}% liquidado
                  </span>
                </div>

                <div className="space-y-1.5 my-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Recebido:</span>
                    <span className="font-bold text-emerald-700 font-mono">{formatCurrency(item.received)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Pendente:</span>
                    <span className="font-bold text-amber-700 font-mono">{formatCurrency(item.pending)}</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pctReceived}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
        <span>💡 Passe o mouse sobre as barras para conferir detalhes de cada mês.</span>
        <span className="font-mono font-bold text-slate-600">
          Média de recebimentos: {formatCurrency(monthlyChartData.reduce((acc, m) => acc + m.received, 0) / 6)}/mês
        </span>
      </div>
    </div>
  );
};
