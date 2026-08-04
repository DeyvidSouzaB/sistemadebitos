/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ChevronDown, 
  Sparkles, 
  HelpCircle, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  FileSpreadsheet, 
  Smartphone,
  ArrowRight,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getWhatsappUrl } from '../../utils/phoneUtils';

export interface FaqItem {
  id: string;
  number: string;
  q: string;
  a: string;
  icon: React.ElementType;
  badge?: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    number: '01',
    q: 'O Pagmefy é realmente 100% gratuito?',
    a: 'Sim! O sistema Web é totalmente gratuito para você cadastrar suas cobranças, enviar lembretes no WhatsApp e gerenciar seus clientes sem cartão de crédito, pegadinhas ou taxas escondidas.',
    icon: CheckCircle2,
    badge: 'Sem Pegadinhas'
  },
  {
    id: 'faq-2',
    number: '02',
    q: 'Preciso instalar algum programa no meu computador?',
    a: 'Não é preciso instalar nada! O Pagmefy é 100% online e funciona direto pelo navegador de internet em qualquer dispositivo: Celular, Tablet, Notebook ou Computador.',
    icon: Smartphone,
    badge: '100% Na Nuvem'
  },
  {
    id: 'faq-3',
    number: '03',
    q: 'Como funciona o envio de cobranças pelo WhatsApp?',
    a: 'Com apenas 1 clique, o Pagmefy monta automaticamente uma mensagem personalizada e profissional com o nome do cliente, o valor pendente, a data de vencimento e a sua chave Pix. O WhatsApp abre com tudo preenchido, bastando apertar enviar.',
    icon: Send,
    badge: '1-Clique WhatsApp'
  },
  {
    id: 'faq-4',
    number: '04',
    q: 'Meus dados ficam seguros no sistema?',
    a: 'Com certeza. Utilizamos criptografia de nível bancário e servidores seguros em nuvem para garantir que suas anotações fiquem sempre protegidas e salvos em tempo real, sem risco de perder como acontecia no papel.',
    icon: ShieldCheck,
    badge: 'Criptografia Forte'
  },
  {
    id: 'faq-5',
    number: '05',
    q: 'Posso exportar relatórios em PDF ou Excel?',
    a: 'Sim! Você pode baixar balancetes completos em PDF profissional com visual pronto para impressão ou relatórios organizados em planilha do Excel com 1 clique.',
    icon: FileSpreadsheet,
    badge: 'Exportação Rápida'
  }
];

export function LandingFaq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleWhatsappSupport = () => {
    const text = 'Olá! Estava navegando na página do Pagmefy e gostaria de tirar uma dúvida sobre o sistema.';
    const url = getWhatsappUrl('18997764052', text);
    window.open(url, '_blank');
  };

  return (
    <section id="faq" className="relative py-20 sm:py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200/80 overflow-hidden">
      {/* Subtle Ambient Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-black uppercase tracking-wider backdrop-blur-md shadow-xs">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>Tira-Dúvidas Rápido</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight font-display leading-tight">
            Perguntas <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">Frequentes</span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
            Tudo o que você precisa saber sobre o Pagmefy: segurança, envio pelo WhatsApp e funcionamento sem custos.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => {
            const isOpen = activeFaq === index;
            const IconComp = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`relative rounded-3xl transition-all duration-300 overflow-hidden border ${
                  isOpen
                    ? 'bg-white border-emerald-500/60 shadow-[0_15px_35px_-10px_rgba(16,185,129,0.18)] ring-1 ring-emerald-500/30'
                    : 'bg-white/90/90 hover:bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300/80'
                }`}
              >
                {/* Left Active Accent Line */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 bg-gradient-to-b from-emerald-500 to-teal-400 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none group"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    {/* Number / Icon Badge */}
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 font-mono font-black text-xs sm:text-sm ${
                        isOpen
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 scale-105'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600'
                      }`}
                    >
                      {item.number}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-base sm:text-lg font-black tracking-tight font-display transition-colors ${
                          isOpen ? 'text-emerald-700' : 'text-slate-900 group-hover:text-emerald-600'
                        }`}>
                          {item.q}
                        </h3>
                      </div>
                      
                      {item.badge && (
                        <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                          isOpen 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200/80'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Toggle Circular Arrow Icon */}
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-emerald-500 text-white rotate-180 shadow-md shadow-emerald-500/30'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-700'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </button>

                {/* Animated Body Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 leading-relaxed font-medium border-t border-slate-100/60 mt-1 space-y-3">
                        <p>{item.a}</p>
                        
                        <div className="flex items-center gap-2 pt-2 text-xs font-bold text-emerald-600">
                          <IconComp className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Destaque: {item.badge}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Modern WhatsApp Help CTA Banner at Bottom */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mx-auto sm:mx-0 shadow-inner">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white font-display">
                Ficou com alguma dúvida específica?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                Fale com a nossa equipe no WhatsApp para tirar dúvidas sobre o seu negócio.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleWhatsappSupport}
            className="relative z-10 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-2 shrink-0 border border-emerald-300/40"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>Falar no WhatsApp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
