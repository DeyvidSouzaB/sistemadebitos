import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Monitor, 
  Share, 
  PlusSquare, 
  X, 
  Download, 
  CheckCircle2, 
  Coins, 
  Sparkles,
  FileCheck
} from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIos: boolean;
  isMobile?: boolean;
  onTriggerInstall: () => void;
  canDirectInstall: boolean;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  isIos,
  isMobile = false,
  onTriggerInstall,
  canDirectInstall,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 text-slate-900"
        >
          {/* Top Banner Gradient */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 relative overflow-hidden">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
              {isMobile ? <Smartphone className="w-40 h-40 text-emerald-400" /> : <Monitor className="w-40 h-40 text-emerald-400" />}
            </div>

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 shrink-0">
                  <img src="/pwa-192x192.png" alt="Logo Pagmefy" className="w-8 h-8 rounded-lg shadow-xs" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 mb-1">
                    <Sparkles className="w-3 h-3" /> {isMobile ? 'Aplicativo Mobile' : 'Aplicativo Desktop'}
                  </span>
                  <h3 className="text-xl font-black text-white font-display">
                    Atalho com Ícone Oficial
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-3 font-medium leading-relaxed relative z-10">
              {isMobile ? (
                <span>O ícone oficial do <strong className="text-white">PAGMEFY</strong> permite abrir o sistema como app nativo no celular sem digitar endereço no navegador.</span>
              ) : (
                <span>O atalho oficial <strong className="text-white">PAGMEFY - Atalho do Sistema.url</strong> foi baixado com o ícone oficial da marca para sua Área de Trabalho / Downloads.</span>
              )}
            </p>
          </div>

          {/* Modal Body / Instructions */}
          <div className="p-6 space-y-5">
            {!isMobile && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-black text-emerald-800">
                  <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Download do Atalho do PC efetuado!</span>
                </div>
                <p className="text-emerald-700 text-[11px]">
                  O arquivo <strong>PAGMEFY - Atalho do Sistema.url</strong> foi baixado na sua pasta de Downloads. Você pode movê-lo para a sua Área de Trabalho (Desktop) para abrir o app direto!
                </p>
              </div>
            )}

            {canDirectInstall ? (
              /* Chrome / Android / Windows Direct Install Prompt */
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200 shadow-sm">
                  <Download className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">Instalar Aplicativo com 1 Clique</h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                    Clique no botão abaixo para fixar o aplicativo direto no seu sistema com o ícone oficial.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onTriggerInstall();
                    onClose();
                  }}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <Download className="w-5 h-5" />
                  <span>Instalar App Agora</span>
                </button>
              </div>
            ) : isIos ? (
              /* iOS Safari Step-by-Step Instructions */
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 font-mono">
                  <Smartphone className="w-4 h-4 text-emerald-600" /> Como adicionar no iPhone / iPad (Safari)
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      1
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        Toque no botão Compartilhar <Share className="w-4 h-4 text-sky-600 inline" />
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Na barra inferior do Safari, toque no ícone de compartilhar (quadrado com seta para cima).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      2
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        Selecione "Adicionar à Tela de Início" <PlusSquare className="w-4 h-4 text-emerald-600 inline" />
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Role a lista para baixo e toque na opção com o sinal de mais (+).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      3
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        Confirme em "Adicionar" <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        O ícone verde oficial do PAGMEFY aparecerá na tela do seu celular!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop PC / Android General Instructions */
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 font-mono">
                  <Monitor className="w-4 h-4 text-emerald-600" /> No Computador (Chrome / Edge)
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      1
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">
                        Instale pela barra de endereços
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Clique no ícone de <strong className="text-slate-700">computador com seta para baixo (Instalar app)</strong> na barra do endereço do seu navegador.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      2
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">
                        Ou use o arquivo baixado
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Abra o arquivo <strong>PAGMEFY - Atalho do Sistema.url</strong> baixado nos seus Downloads para abrir o app a qualquer momento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Close / Action footer */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-colors cursor-pointer text-xs shadow-md"
              >
                Concluído
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
