import React from 'react';
import { 
  Flame, 
  FileX, 
  AlertTriangle, 
  Calculator, 
  MessageSquare, 
  Smartphone,
  CheckCircle,
  XCircle,
  CloudCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export function PainPointsBento() {
  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      {/* Header section badge & title */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200/80 mb-3 shadow-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>O Problema do Caderninho</span>
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
          Por que continuar no papel <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-amber-600 to-rose-500">
            custa muito caro pro seu bolso?
          </span>
        </h2>
        <p className="mt-3 text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
          Controlar fiado no caderno parece fácil, até você somar o prejuízo de anotações perdidas, valores rasurados e constrangimento na cobrança.
        </p>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* CARD 1: HERO FEATURE CARD (2 cols in lg) - O Caderno Rasgado vs Nuvem */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 lg:col-span-2 relative rounded-3xl bg-gradient-to-br from-rose-50/80 via-white to-amber-50/50 p-6 sm:p-8 border border-rose-200/60 shadow-lg shadow-rose-950/5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group overflow-hidden"
        >
          {/* Subtle Radial Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-200/40 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-300/40 transition-all" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold tracking-wider uppercase bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full border border-rose-200">
                Risco Nº 1
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Caderno rasgado, molhado ou esquecido
            </h3>
            <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
              Um copo de café derrubado na mesa, uma página arrancada ou um caderno esquecido na loja e todo o seu histórico financeiro desaparece para sempre.
            </p>
          </div>

          {/* Visual comparison widget inside Card 1 */}
          <div className="mt-6 pt-4 border-t border-rose-200/50 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/90 border border-rose-200 text-xs">
              <div className="flex items-center gap-1.5 text-rose-600 font-bold mb-1">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>Caderno de Papel</span>
              </div>
              <p className="text-slate-500 text-[11px]">Sem cópia de segurança. Se perder, perdeu o dinheiro.</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
                <CloudCheck className="w-4 h-4 shrink-0" />
                <span>Com PAGMEFY</span>
              </div>
              <p className="text-slate-600 text-[11px]">Backup automático 24/7 na nuvem e acessível no celular.</p>
            </div>
          </div>
        </motion.div>

        {/* CARD 2: Letra Ilegível / Rabiscos (1 col) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-1 lg:col-span-2 rounded-3xl bg-white/90 backdrop-blur-xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <FileX className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Letra ilegível e anotações confusas
            </h3>
            <p className="mt-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
              Na correria do atendimento você anota rápido. Semanas depois ninguém sabe se o valor anotado era R$ 50 ou R$ 150.
            </p>
          </div>

          {/* Interactive Visual snippet */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/60 font-mono text-xs flex items-center justify-between">
            <span className="line-through text-slate-400 decoration-rose-500 decoration-2">R$ 150?? (rabiscado)</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              R$ 150,00 (Claro)
            </span>
          </div>
        </motion.div>

        {/* CARD 3: Constrangimento de Cobrar (2 cols in lg) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2 lg:col-span-2 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/80 p-6 sm:p-8 text-slate-900 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden border border-emerald-200/80"
        >
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Cobrança Amigável
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Fim da vergonha e do constrangimento
            </h3>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              Ficar pensando no texto ideal para cobrar um amigo ou cliente no WhatsApp é desgastante. O PAGMEFY gera um lembrete educado e profissional com chave Pix integrada em 1 toque.
            </p>
          </div>

          <div className="mt-5 p-3 sm:p-4 rounded-xl bg-white border border-emerald-200/80 text-xs text-slate-800 shadow-xs">
            <div className="flex items-center gap-2 mb-1 text-emerald-700 font-semibold">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mensagem Pronta no WhatsApp:</span>
            </div>
            <p className="italic text-slate-600 text-[11px]">
              "Olá Marcos! Tudo bem? Passando para lembrar da parcela de R$ 120,00 com vencimento hoje. Chave Pix: 11900000000"
            </p>
          </div>
        </motion.div>

        {/* CARD 4: Não saber o total a receber (1 col) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-1 lg:col-span-1 rounded-3xl bg-white/90 backdrop-blur-xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Calculadora no escuro
            </h3>
            <p className="mt-2 text-slate-600 text-xs leading-relaxed">
              Somar folha por folha na calculadora pra saber o total a receber dá preguiça e você fica sem visão do caixa.
            </p>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-[11px] font-bold text-sky-800 flex items-center justify-between">
            <span>Visão Total Instantânea</span>
            <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
          </div>
        </motion.div>

        {/* CARD 5: O Caderno Fica num Lugar Só (1 col) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-1 lg:col-span-1 rounded-3xl bg-white/90 backdrop-blur-xl p-6 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Preso ao balcão
            </h3>
            <p className="mt-2 text-slate-600 text-xs leading-relaxed">
              Se estiver em casa ou viajando, você não sabe quem deve. Com o app no celular, seus dados estão sempre com você.
            </p>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-purple-50 border border-purple-200 text-[11px] font-bold text-purple-800 flex items-center justify-between">
            <span>Acesso 24h no Celular</span>
            <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
