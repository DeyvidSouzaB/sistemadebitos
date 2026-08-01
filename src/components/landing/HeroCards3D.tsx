import React, { useState, useMemo } from 'react';
import { Smartphone, Laptop } from 'lucide-react';
import { MobilePhoneMockup } from './MobilePhoneMockup';
import { DesktopAppMockup } from './DesktopAppMockup';
import { Debt } from '../../types';
import { getTodayString } from '../../utils/dateUtils';

interface HeroCards3DProps {
  liveDebts?: Debt[];
}

export function HeroCards3D({ liveDebts = [] }: HeroCards3DProps) {
  // Default view mode set to 'desktop' as requested
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Compute live metrics if debts are passed
  const metrics = useMemo(() => {
    if (!liveDebts || liveDebts.length === 0) {
      return {
        totalRemaining: 2000.99,
        totalPaid: 0.00,
        totalOverdue: 2000.99,
        activeClientsCount: 1,
      };
    }

    const todayStr = getTodayString();
    const totalRemaining = liveDebts
      .filter((d) => d.status !== 'paid')
      .reduce((acc, d) => acc + d.currentAmount, 0);

    const totalPaid = liveDebts.reduce((acc, d) => {
      const paid = d.payments.reduce((pSum, p) => pSum + p.amount, 0);
      return acc + paid;
    }, 0);

    const overdue = liveDebts
      .filter((d) => d.dueDate && d.dueDate.slice(0, 10) < todayStr && d.status !== 'paid')
      .reduce((acc, d) => acc + d.currentAmount, 0);

    const activeClientsCount = new Set(
      liveDebts.filter((d) => d.status !== 'paid').map((d) => d.name.trim().toLowerCase())
    ).size;

    return {
      totalRemaining,
      totalPaid,
      totalOverdue: overdue,
      activeClientsCount: activeClientsCount || 1,
    };
  }, [liveDebts]);

  return (
    <div className="relative w-full max-w-5xl mx-auto py-4 px-1 sm:px-6 lg:px-8 overflow-hidden">
      {/* View Switcher Toggle Bar (Desktop first, Mobile second) */}
      <div className="flex items-center justify-center gap-2 mb-4 relative z-20">
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode('desktop')}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'desktop'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>💻 Modelo Computador</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📱 Modelo Celular</span>
          </button>
        </div>
      </div>

      {/* Light Slate Gradient Background Container */}
      <div
        className={`relative rounded-3xl bg-gradient-to-b from-slate-50 via-white to-slate-50 border border-slate-200/80 shadow-xl transition-all duration-300 ${
          viewMode === 'desktop'
            ? 'p-2 sm:p-4'
            : 'p-2 sm:p-6 lg:p-8 min-h-[500px] flex items-center justify-center overflow-hidden'
        }`}
      >
        {/* Subtle Radial Glow Effects in Background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-sky-200/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-[80px] pointer-events-none" />

        {viewMode === 'desktop' ? (
          <div className="w-full relative z-10 py-1">
            <DesktopAppMockup
              totalRemaining={metrics.totalRemaining}
              totalPaid={metrics.totalPaid}
              totalOverdue={metrics.totalOverdue}
              activeClientsCount={metrics.activeClientsCount}
            />
          </div>
        ) : (
          <MobilePhoneMockup
            totalRemaining={metrics.totalRemaining}
            totalPaid={metrics.totalPaid}
            totalOverdue={metrics.totalOverdue}
            activeClientsCount={metrics.activeClientsCount}
          />
        )}
      </div>
    </div>
  );
}
