import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Users
} from 'lucide-react';

export function HeroCards3D() {
  return (
    <div className="relative w-full max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Light Slate Gradient Background Container — fiel ao tema claro do sistema */}
      <div className="relative rounded-3xl bg-gradient-to-b from-slate-50 via-white to-slate-50 p-6 sm:p-10 lg:p-14 border border-slate-200/80 shadow-xl overflow-hidden">
        
        {/* Subtle Emerald/Sky Radial Glow Effects in Background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-sky-200/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-[80px] pointer-events-none" />

        {/* 3D Perspective Stage */}
        <div className="relative z-10 min-h-[460px] sm:min-h-[520px] flex items-center justify-center [perspective:1200px]">
          
          {/* ========================================================================= */}
          {/* CARD 1 (MAIOR, AO FUNDO): DASHBOARD PRINCIPAL                            */}
          {/* ========================================================================= */}
          <div 
            className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.15)] text-slate-900 transition-all duration-500 transform hover:scale-[1.01]"
            style={{
              transform: 'rotateX(4deg) rotateY(-6deg) translateZ(0px)',
            }}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-white text-xs shadow-md shadow-emerald-500/20">
                  P
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    PAGMEFY
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 font-sans font-bold">Painel Conectado</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Painel Geral de Cobranças</p>
                </div>
              </div>
            </div>

            {/* Total a Receber - Main Metric */}
            <div className="mb-6 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total a Receber</p>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1 font-display">
                  R$ 14.850<span className="text-slate-400 text-2xl font-normal">,00</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold self-start sm:self-center">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% este mês</span>
              </div>
            </div>

            {/* Two Inner Metric Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Widget 1: Vencendo Hoje */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-amber-200 hover:border-amber-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500">Vencendo Hoje</span>
                  <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-amber-700 tracking-tight">
                  R$ 1.250<span className="text-amber-700/70 text-base font-normal">,00</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">3 clientes aguardando</p>
              </div>

              {/* Widget 2: Recebido no Mês */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-emerald-200 hover:border-emerald-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-500">Recebido no Mês</span>
                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-700 tracking-tight">
                  R$ 8.920<span className="text-emerald-700/70 text-base font-normal">,00</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">19 cobranças quitadas</p>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 2 (À DIREITA, UM POUCO À FRENTE): LISTA DE DEVEDORES                 */}
          {/* ========================================================================= */}
          <div 
            className="absolute right-0 sm:right-2 lg:-right-4 top-12 sm:top-8 w-72 sm:w-80 bg-white/98 backdrop-blur-2xl border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-slate-900 hidden sm:block transition-all duration-500 hover:z-30 hover:scale-105 shadow-[0_25px_60px_-10px_rgba(15,23,42,0.18)]"
            style={{
              transform: 'rotateX(6deg) rotateY(-12deg) translate3d(10px, -10px, 40px)',
            }}
          >
            <div className="flex items-center justify-between mb-3.5 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Lista de Devedores</h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">4 registros</span>
            </div>

            <div className="space-y-2.5">
              {/* Debtor Item 1 */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <p className="font-semibold text-slate-800">Maria Silva</p>
                  <p className="text-[10px] text-slate-400">Pix • Venc. 12/07</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">R$ 250,00</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Pago
                  </span>
                </div>
              </div>

              {/* Debtor Item 2 */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <p className="font-semibold text-slate-800">Carlos Eduardo</p>
                  <p className="text-[10px] text-slate-400">Parcela 2/3 • Hoje</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">R$ 480,00</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Pendente
                  </span>
                </div>
              </div>

              {/* Debtor Item 3 */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <p className="font-semibold text-slate-800">Ana Souza</p>
                  <p className="text-[10px] text-slate-400">Pix • Venc. 20/07</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">R$ 150,00</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Pago
                  </span>
                </div>
              </div>

              {/* Debtor Item 4 */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <p className="font-semibold text-slate-800">João Pedro</p>
                  <p className="text-[10px] text-slate-400">Atrasado (3 dias)</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">R$ 320,00</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Pendente
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 3 (NA FRENTE, MENOR): GRÁFICO DE LINHA SIMPLES                        */}
          {/* ========================================================================= */}
          <div 
            className="absolute left-0 sm:left-2 lg:-left-4 bottom-2 sm:bottom-4 w-64 sm:w-72 bg-white/98 backdrop-blur-2xl border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-slate-900 hidden sm:block transition-all duration-500 hover:z-30 hover:scale-105 shadow-[0_30px_70px_-15px_rgba(15,23,42,0.2)]"
            style={{
              transform: 'rotateX(-4deg) rotateY(8deg) translate3d(-10px, 15px, 70px)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recebimentos</p>
                <h5 className="text-sm font-black text-slate-900">Evolução Mensal</h5>
              </div>
              <div className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                +24%
              </div>
            </div>

            {/* Simple Line Graph SVG — tons de verde-esmeralda, fiéis ao sistema */}
            <div className="h-28 w-full mt-2 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 90" fill="none">
                <defs>
                  <linearGradient id="gradientEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="fillAreaLight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="20" x2="200" y2="20" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="0" y1="50" x2="200" y2="50" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="200" y2="80" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" />

                {/* Fill Area */}
                <path 
                  d="M 10 75 Q 50 60, 80 40 T 150 25 T 190 15 L 190 85 L 10 85 Z" 
                  fill="url(#fillAreaLight)" 
                />

                {/* Line Path */}
                <path 
                  d="M 10 75 Q 50 60, 80 40 T 150 25 T 190 15" 
                  stroke="url(#gradientEmerald)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                />

                {/* Data Points */}
                <circle cx="10" cy="75" r="4" fill="#10b981" />
                <circle cx="80" cy="40" r="4" fill="#10b981" />
                <circle cx="150" cy="25" r="4" fill="#059669" />
                <circle cx="190" cy="15" r="5" fill="#047857" stroke="#ffffff" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-100">
              <span>Sem 1</span>
              <span>Sem 2</span>
              <span>Sem 3</span>
              <span>Sem 4</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

