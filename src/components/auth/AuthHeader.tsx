/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Coins, ArrowLeft } from 'lucide-react';
import { AuthMode } from '../../hooks/useAuthForm';

interface AuthHeaderProps {
  mode: AuthMode;
  onBackToLanding?: () => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ mode, onBackToLanding }) => {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 font-black shrink-0">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tight font-display flex items-center gap-2">
              PAGMEFY
            </span>
          </div>
        </div>

        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/90 hover:bg-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-extrabold transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
            <span>Voltar</span>
          </button>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
        {mode === 'login' 
          ? 'Entrar na sua conta' 
          : mode === 'register' 
          ? 'Criar sua conta grátis' 
          : mode === 'forgot_password'
          ? 'Recuperação de Senha'
          : mode === 'verify_otp'
          ? 'Código de Confirmação'
          : 'Criar Nova Senha'}
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
        {mode === 'login' 
          ? 'Acesse suas cobranças e acompanhe seus recebíveis sem papelada.' 
          : mode === 'register'
          ? 'Comece a organizar suas cobranças e fiados em menos de 2 minutos.'
          : mode === 'forgot_password'
          ? 'Informe seu e-mail cadastrado para receber um código de 8 dígitos.'
          : mode === 'verify_otp'
          ? 'Insira o código de 8 dígitos enviado para o seu e-mail para continuar.'
          : 'Digite e confirme sua nova senha para redefinir o acesso com segurança.'}
      </p>
    </div>
  );
};
