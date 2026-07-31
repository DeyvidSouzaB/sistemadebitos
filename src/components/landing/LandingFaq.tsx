import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    q: 'O Pagmefy é realmente 100% gratuito?',
    a: 'Sim, a versão Web é totalmente gratuita sem prazos de validade ou pegadinhas. Você pode cadastrar cobranças, gerar links para WhatsApp e emitir recibos sem custo nenhum.'
  },
  {
    q: 'Preciso instalar algum programa no meu computador?',
    a: 'Não. O Pagmefy funciona diretamente no seu navegador de internet (no PC, Notebook, Tablet ou Celular).'
  },
  {
    q: 'Como funciona o envio de cobranças pelo WhatsApp?',
    a: 'Com um clique, o sistema formata a mensagem com o valor do débito, data de vencimento e chave Pix para pagamento, abrindo seu WhatsApp Web ou aplicativo com tudo preenchido.'
  },
  {
    q: 'Meus dados ficam seguros no sistema?',
    a: 'Sim! Utilizamos criptografia de ponta a ponta e armazenamento em nuvem de alta segurança. Seus dados de cobrança ficam protegidos e salvos em tempo real.'
  },
  {
    q: 'Posso exportar relatórios em PDF ou Excel?',
    a: 'Com certeza! Você pode baixar relatórios consolidados em PDF profissional para impressão ou planilha do Excel para controle contábil.'
  }
];

export function LandingFaq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <section id="faq" className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-3">
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Tudo o que você precisa saber sobre o Pagmefy.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_DATA.map((item, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full text-left p-5 font-bold text-slate-900 flex items-center justify-between gap-4 text-sm sm:text-base hover:text-emerald-600 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
