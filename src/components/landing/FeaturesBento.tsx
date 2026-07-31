import React, { useState } from 'react';
import { 
  MessageSquare, 
  Wallet, 
  FileText, 
  Users, 
  Smartphone, 
  Lock, 
  CheckCircle2, 
  Clock, 
  Zap, 
  TrendingUp, 
  CloudCheck, 
  ShieldCheck, 
  QrCode,
  Laptop,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Send,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function FeaturesBento() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const featureTabs = [
    {
      id: 0,
      badge: "Notificação 1-Clique",
      title: "Lembretes no WhatsApp com Pix",
      shortDesc: "Envie mensagens educadas e prontas com chave Pix anexada em 1 toque.",
      icon: MessageSquare,
      accentColor: "emerald",
      previewComponent: (
        <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-emerald-50 via-white to-slate-50 text-slate-900 rounded-2xl border border-slate-200/90 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header Mockup */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                P
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  Marcos Oliveira (Cliente)
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </h4>
                <p className="text-[11px] text-slate-500">Status: Parcela Vencendo Hoje</p>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
              WhatsApp Pronto
            </span>
          </div>

          {/* Chat Bubble Mockup */}
          <div className="my-6 space-y-3">
            <div className="max-w-md ml-auto p-4 rounded-2xl rounded-tr-none bg-emerald-600 text-white text-xs space-y-2 shadow-md">
              <p className="leading-relaxed font-medium">
                Olá Marcos, tudo bem? Passando para lembrar que sua parcela de <strong className="text-amber-200">R$ 150,00</strong> vence hoje.
              </p>
              <div className="pt-2 border-t border-emerald-500/60 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-mono text-emerald-100">
                  <QrCode className="w-3.5 h-3.5" /> Chave Pix: 11900000000
                </span>
                <span className="text-[10px] text-emerald-200">14:32</span>
              </div>
            </div>

            <div className="max-w-xs p-3 rounded-2xl rounded-tl-none bg-white text-slate-800 text-xs border border-slate-200 shadow-xs">
              <p>Opa, perfeito! Já fiz o Pix aqui. Obrigado pelo lembrete!</p>
              <span className="text-[9px] text-slate-400 block mt-1">14:34 • Lido</span>
            </div>
          </div>

          {/* Action Trigger Simulation */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
            <span className="text-xs text-slate-600 font-medium">Toque para reenviar ou copiar Pix</span>
            <button className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1.5 hover:bg-emerald-500 transition-colors shadow-xs">
              <Send className="w-3.5 h-3.5" />
              <span>Enviar no WhatsApp</span>
            </button>
          </div>
        </div>
      )
    },
    {
      id: 1,
      badge: "Cálculo Automático",
      title: "Parcelamento & Vencimentos",
      shortDesc: "Divida cobranças em 2x, 3x ou quinzenal com controle por cores claras.",
      icon: Calendar,
      accentColor: "teal",
      previewComponent: (
        <div className="w-full h-full flex flex-col justify-between p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Plano de Cobrança em 3x
              </span>
              <h4 className="text-base font-extrabold text-slate-900 mt-1">Venda: Reforma de Roupa • R$ 450,00</h4>
            </div>
            <span className="text-xs font-bold text-slate-500">Cliente: Ana Souza</span>
          </div>

          {/* 3 Installment Cards */}
          <div className="my-4 space-y-3">
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  1/3
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Parcela 1 • R$ 150,00</p>
                  <p className="text-[10px] text-emerald-700">Pago via Pix em 10/07</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs">
                Quitada ✅
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                  2/3
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Parcela 2 • R$ 150,00</p>
                  <p className="text-[10px] text-amber-700">Vencimento: Hoje!</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-xs animate-pulse">
                Vence Hoje 🕒
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between opacity-80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  3/3
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Parcela 3 • R$ 150,00</p>
                  <p className="text-[10px] text-slate-500">Vencimento: 10/08</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                A Vencer 📅
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">Saldo Restante: <strong className="text-slate-900 font-bold">R$ 300,00</strong></span>
            <span className="text-emerald-700 font-bold">Progresso: 33% Pago</span>
          </div>
        </div>
      )
    },
    {
      id: 2,
      badge: "Transparência Total",
      title: "Histórico Completo por Cliente",
      shortDesc: "Saiba exatamente tudo o que cada cliente comprou e pagou ao longo do tempo.",
      icon: FileText,
      accentColor: "indigo",
      previewComponent: (
        <div className="w-full h-full flex flex-col justify-between p-6 bg-white rounded-2xl border border-slate-200/80 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                MS
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Maria Silva</h4>
                <p className="text-[11px] text-slate-500">Cliente desde Março de 2024 • 100% Pontual</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Score Bom
            </span>
          </div>

          {/* History Timeline */}
          <div className="my-4 space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800">Bolo de Aniversário (2kg)</p>
                <p className="text-[10px] text-slate-500">Comp. 15/06 • Pago via Pix</p>
              </div>
              <span className="font-bold text-emerald-600">R$ 140,00</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800">Docinhos de Festa (100 un)</p>
                <p className="text-[10px] text-slate-500">Comp. 02/05 • Pago em Dinheiro</p>
              </div>
              <span className="font-bold text-emerald-600">R$ 90,00</span>
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-indigo-950">Kit Salgados (150 un)</p>
                <p className="text-[10px] text-indigo-700">Comp. Hoje • Em aberto</p>
              </div>
              <span className="font-bold text-amber-600">R$ 120,00</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex justify-between items-center font-medium">
            <span>Total Histórico Movimentado:</span>
            <strong className="text-sm font-black font-display text-indigo-950">R$ 350,00</strong>
          </div>
        </div>
      )
    },
    {
      id: 3,
      badge: "Proteção Antiperda",
      title: "Multi-Dispositivo & Nuvem 24/7",
      shortDesc: "Acesse no celular, tablet ou computador. Seus dados nunca se perdem.",
      icon: CloudCheck,
      accentColor: "sky",
      previewComponent: (
        <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-sky-50 via-white to-slate-50 text-slate-900 rounded-2xl border border-slate-200/90 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-600" />
              <h4 className="text-sm font-bold text-slate-900">Sincronização Nuvem Instantânea</h4>
            </div>
            <span className="text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-0.5 rounded-full">
              Proteção 100% Segura
            </span>
          </div>

          <div className="my-6 grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center space-y-2">
              <Smartphone className="w-7 h-7 text-sky-600" />
              <span className="text-xs font-bold text-slate-900">Celular</span>
              <span className="text-[9px] text-slate-500">iOS & Android</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center space-y-2">
              <Laptop className="w-7 h-7 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">Notebook</span>
              <span className="text-[9px] text-slate-500">Navegador Web</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center space-y-2">
              <CloudCheck className="w-7 h-7 text-teal-600" />
              <span className="text-xs font-bold text-slate-900">Nuvem 24h</span>
              <span className="text-[9px] text-slate-500">Backup em Tempo Real</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-xs">
            <span className="text-slate-600 text-[11px]">Status do Sistema:</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              100% Sincronizado & Seguro
            </span>
          </div>
        </div>
      )
    }
  ];

  const currentTab = featureTabs[activeTab];

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      {/* Header section badge & title */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/80 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Showcase Interativo</span>
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
          Tudo o que seu negócio precisa <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
            para nunca mais perder o fiado
          </span>
        </h2>
        <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
          Clique nas abas abaixo para ver como cada ferramenta funciona na prática:
        </p>
      </div>

      {/* Main Interactive Split Layout (Navigation Left/Top, Viewport Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* Left Column: Interactive Tabs Navigation */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          {featureTabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-4 ${
                  isActive 
                    ? 'bg-white border-emerald-500/80 shadow-xl ring-2 ring-emerald-500/20 scale-[1.01]' 
                    : 'bg-slate-50/80 border-slate-200/80 hover:bg-white hover:border-slate-300 opacity-80 hover:opacity-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-slate-200/80 text-slate-700'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-200/60 text-slate-600'
                    }`}>
                      {tab.badge}
                    </span>
                    {isActive && <ChevronRight className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </div>

                  <h3 className={`text-base font-extrabold mt-1.5 ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                    {tab.title}
                  </h3>

                  <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">
                    {tab.shortDesc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Dynamic Live Viewport */}
        <div className="lg:col-span-7 min-h-[420px] sm:min-h-[460px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full h-full"
            >
              {currentTab.previewComponent}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
