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
  ArrowRight
} from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIos: boolean;
  onTriggerInstall: () => void;
  canDirectInstall: boolean;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  isIos,
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
              <Smartphone className="w-40 h-40 text-emerald-400" />
            </div>

            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 mb-1">
                    <Sparkles className="w-3 h-3" /> Aplicativo PAGMEFY
                  </span>
                  <h3 className="text-xl font-black text-white font-display">
                    Instalar Ícone na Tela
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
              Adicione o PAGMEFY como um atalho na tela inicial do seu <strong className="text-white">Celular (Android/iPhone)</strong> ou <strong className="text-white">Computador (PC/Mac)</strong> para acessar instantaneamente com 1 toque sem abrir o navegador!
            </p>
          </div>

          {/* Modal Body / Instructions */}
          <div className="p-6 space-y-5">
            {canDirectInstall ? (
              /* Chrome / Android / Windows Direct Install Prompt */
              <div className="space-y-4 text-center py-2">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border border-emerald-200 shadow-sm">
                  <Download className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">Pronto para Instalar!</h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                    Clique no botão abaixo para adicionar o ícone do aplicativo direto na tela do seu dispositivo.
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
                  <span>Adicionar Ícone do App Agora</span>
                </button>
              </div>
            ) : isIos ? (
              /* iOS Safari Step-by-Step Instructions */
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 font-mono">
                  <Smartphone className="w-4 h-4 text-emerald-600" /> Passo a Passo no iPhone / iPad (Safari)
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
                        Na barra inferior do seu Safari, toque no ícone de quadrado com a seta para cima.
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
                        Role a lista de opções para baixo e toque na opção de adicionar o ícone.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      3
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        Confirme no canto superior em "Adicionar" <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Pronto! O ícone do PAGMEFY ficará salvo na sua tela principal como um app nativo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop PC / Android General Instructions */
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 font-mono">
                  <Monitor className="w-4 h-4 text-emerald-600" /> No Computador (Chrome / Edge) ou Android
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      1
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">
                        Olhe a Barra de Endereços do Navegador
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        No Chrome ou Edge, clique no ícone de <strong className="text-slate-700">computador com seta para baixo (Instalar)</strong> na barra do endereço.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                      2
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">
                        Ou pelo Menu de 3 Pontinhos
                      </p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Clique nos 3 pontinhos do navegador &gt; <strong className="text-slate-700">Salvar e compartilhar</strong> &gt; <strong className="text-slate-700">Instalar página como app</strong>.
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
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors cursor-pointer text-xs"
              >
                Entendi
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
