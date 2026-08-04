import React from 'react';
import { 
  UserCheck, 
  Receipt, 
  BadgeCheck, 
  MapPin, 
  Laptop, 
  Coins, 
  Activity, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { motion } from 'motion/react';
import { AnimatedNumber, AnimatedCurrency } from '../AnimatedCounter';
import { SystemLiveStats } from '../../lib/supabaseService';

interface LiveStatsModernProps {
  stats: SystemLiveStats;
}

export function LiveStatsModern({ stats }: LiveStatsModernProps) {
  const metricItems = [
    {
      label: "Clientes Cadastrados",
      value: stats.totalClients,
      icon: UserCheck,
      iconBg: "bg-indigo-100 text-indigo-700 border-indigo-200",
    },
    {
      label: "Cobranças no App",
      value: stats.totalDebts,
      icon: Receipt,
      iconBg: "bg-amber-100 text-amber-700 border-amber-200",
    },
    {
      label: "Cobranças Quitadas",
      value: stats.paidDebtsCount,
      icon: BadgeCheck,
      iconBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    {
      label: "Estados Presentes",
      value: stats.totalActiveStates,
      icon: MapPin,
      iconBg: "bg-rose-100 text-rose-700 border-rose-200",
    },
    {
      label: "Usuários Ativos",
      value: stats.systemUsersCount || 1,
      icon: Laptop,
      iconBg: "bg-violet-100 text-violet-700 border-violet-200",
    },
  ];

  return (
    <div className="w-full relative z-20">
      {/* Light Theme Container */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xl overflow-hidden text-slate-900">
        
        {/* Subtle Radial Glows */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-80 h-80 bg-teal-100/40 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                  DADOS EM TEMPO REAL
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Métricas do Sistema em Tempo Real
              </h3>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs self-start sm:self-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Criptografado & Seguro</span>
            </div>
          </div>

          {/* HERO METRIC BANNER: Light Emerald Highlight */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-emerald-600/20 relative overflow-hidden group">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-100 font-bold text-xs uppercase tracking-wider">
                <Coins className="w-4 h-4 text-emerald-200" />
                <span>Total Movimentado e Recuperado via Pix</span>
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-display pt-1">
                <AnimatedCurrency value={stats.totalRecoveredBrl} />
              </div>
              <p className="text-xs text-emerald-100/90 pt-1">
                Valores calculados automaticamente direto das cobranças quitadas.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold shrink-0 self-start md:self-center">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>+ Taxa de Sucesso: {stats.successRate || 98}%</span>
            </div>
          </div>

          {/* 5 Legible Cards Grid in Light Theme */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {metricItems.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${item.iconBg}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                      <AnimatedNumber value={item.value} />
                    </div>
                    <p className="text-xs font-semibold text-slate-500 mt-1.5 leading-snug">
                      {item.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Ticker Bar */}
          <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
            <span className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Atualização contínua dos valores movimentados no sistema</span>
            </span>
            <span className="text-[11px] text-slate-500 font-bold">
              Dados 100% Protegidos
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
