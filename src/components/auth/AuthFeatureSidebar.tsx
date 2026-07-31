/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const AuthFeatureSidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:col-span-6 bg-slate-900 p-10 flex-col justify-center space-y-8 relative overflow-hidden">
      {/* Accent vertical bar */}
      <div className="absolute left-0 top-10 bottom-10 w-1 rounded-full bg-emerald-500" />

      {/* Header Quote / Value Proposition */}
      <div className="relative z-10 space-y-4 pl-6">
        <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight font-display">
          Suas cobranças organizadas, sem caderno, sem bagunça.
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
          O PAGMEFY é a ferramenta ideal para autônomos, prestadores de serviço e pequenos comerciantes. Deixe o papel no passado e receba mais rápido no Pix.
        </p>
      </div>

      {/* Key Benefits Checklist */}
      <div className="relative z-10 space-y-3.5 pt-4 pl-6 border-t border-slate-800">
        <div className="flex items-start gap-3 text-xs text-slate-300 font-semibold">
          <span className="w-4 h-px bg-emerald-500 mt-2.5 shrink-0" />
          <span>Zero risco de perder dados ou folha rasgada</span>
        </div>

        <div className="flex items-start gap-3 text-xs text-slate-300 font-semibold">
          <span className="w-4 h-px bg-emerald-500 mt-2.5 shrink-0" />
          <span>Mensagem de cobrança pronta no WhatsApp em 1 clique</span>
        </div>

        <div className="flex items-start gap-3 text-xs text-slate-300 font-semibold">
          <span className="w-4 h-px bg-amber-500 mt-2.5 shrink-0" />
          <span>Acesse do seu celular a qualquer hora e lugar</span>
        </div>
      </div>
    </div>
  );
};
