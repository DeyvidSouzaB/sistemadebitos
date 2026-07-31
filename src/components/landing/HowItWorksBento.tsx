import React from 'react';
import { 
  UserPlus, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  QrCode
} from 'lucide-react';
import { motion } from 'motion/react';

export function HowItWorksBento() {
  const steps = [
    {
      number: "01",
      title: "Cadastre em segundos",
      subtitle: "Cliente & Valor do Fiado",
      description: "Informe o nome do cliente, o telefone do WhatsApp e o valor da venda. Leva menos de 20 segundos para registrar.",
      badge: "Simples & Rápido",
      accent: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50/50 via-white to-slate-50",
      borderColor: "border-emerald-200/80",
      icon: UserPlus,
      preview: (
        <div className="p-3 rounded-xl bg-white border border-emerald-200/80 shadow-xs space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700">Maria Silva</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">R$ 180,00</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <Smartphone className="w-3 h-3 text-emerald-600" />
            <span>(11) 90000-0000 • Venc: 15/08</span>
          </div>
        </div>
      )
    },
    {
      number: "02",
      title: "Painel de Vencimentos",
      subtitle: "Organização por Cores",
      description: "Identifique na hora quem está em dia (Verde), quem vence hoje (Amarelo) e quem está em atraso (Vermelho).",
      badge: "Visão Instantânea",
      accent: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50/40 via-white to-slate-50",
      borderColor: "border-amber-200/80",
      icon: Clock,
      preview: (
        <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center font-bold">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            Em Dia (12)
          </div>
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            Hoje (3)
          </div>
          <div className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            Atrasado (2)
          </div>
        </div>
      )
    },
    {
      number: "03",
      title: "Lembrete no WhatsApp",
      subtitle: "Cobrança Sem Constrangimento",
      description: "Com 1 clique, o sistema gera uma mensagem gentil com o valor atualizado e sua chave Pix. Basta tocar para abrir o WhatsApp.",
      badge: "1-Clique",
      accent: "from-emerald-600 to-green-500",
      bgGradient: "from-slate-900 to-slate-800",
      borderColor: "border-slate-700",
      isDark: true,
      icon: Send,
      preview: (
        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-emerald-400 font-mono">
            <span>Mensagem Gerada</span>
            <span className="flex items-center gap-1">
              <QrCode className="w-3 h-3" /> Pix Anexado
            </span>
          </div>
          <p className="text-[11px] leading-snug text-slate-300">
            "Olá! Lembrete do saldo de R$ 180,00 com chave Pix pronta."
          </p>
        </div>
      )
    },
    {
      number: "04",
      title: "Baixa & Caixa Atualizado",
      subtitle: "Dinheiro Recuperado",
      description: "Quando o cliente pagar, dê baixa em um toque. O painel atualiza seus ganhos e seu histórico fica 100% organizado.",
      badge: "Caixa no Verde",
      accent: "from-teal-500 to-emerald-600",
      bgGradient: "from-teal-50/40 via-white to-slate-50",
      borderColor: "border-teal-200/80",
      icon: CheckCircle2,
      preview: (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="font-bold text-slate-900 text-[11px]">Pagamento Recebido!</p>
              <p className="text-[10px] text-emerald-700">Baixa efetuada no sistema</p>
            </div>
          </div>
          <span className="font-extrabold text-emerald-600 text-sm font-display">+ R$ 180</span>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/80 mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Simplicidade Absoluta</span>
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
          Como funciona em <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
            4 passos extremamente simples
          </span>
        </h2>
        <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
          Feito sob medida para quem não tem tempo a perder com sistemas complicados. Se você sabe usar o WhatsApp, já sabe usar o PAGMEFY.
        </p>
      </div>

      {/* Bento Grid layout for 4 steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`rounded-3xl p-6 border shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden bg-gradient-to-b ${step.bgGradient} ${step.borderColor} ${step.isDark ? 'text-white' : 'text-slate-900'}`}
            >
              <div>
                {/* Step badge & number */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-2xl font-black tracking-tight font-display bg-gradient-to-r ${step.accent} bg-clip-text text-transparent`}>
                    {step.number}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${step.isDark ? 'bg-slate-800 text-emerald-400 border-slate-700' : 'bg-white text-slate-600 border-slate-200'}`}>
                    {step.badge}
                  </span>
                </div>

                {/* Step Icon & Titles */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${step.isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className={`font-extrabold text-base leading-snug ${step.isDark ? 'text-white' : 'text-slate-900'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-[11px] font-medium ${step.isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                <p className={`text-xs sm:text-sm mt-3 leading-relaxed ${step.isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {step.description}
                </p>
              </div>

              {/* Visual preview widget at bottom */}
              <div className="mt-5 pt-4 border-t border-slate-200/40">
                {step.preview}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
