/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Mail, Lock, Eye, EyeOff, Check, ArrowRight, ShieldCheck, KeyRound, RefreshCw, Edit3 } from 'lucide-react';
import { AuthMode } from '../../hooks/useAuthForm';

interface AuthFormFieldsProps {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  rememberMe: boolean;
  setRememberMe: (val: boolean) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  loading: boolean;
  touchedEmail: boolean;
  setTouchedEmail: (val: boolean) => void;
  touchedPassword: boolean;
  setTouchedPassword: (val: boolean) => void;
  otpDigits: string[];
  otpEmail: string;
  resendCountdown: number;
  handleStartForgotPassword: (e?: React.MouseEvent) => void;
  handleResendOtp: () => void;
  handleOtpDigitChange: (index: number, val: string) => void;
  handleOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setErrorMessage: (msg: string | null) => void;
}

export const AuthFormFields: React.FC<AuthFormFieldsProps> = ({
  mode,
  setMode,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  rememberMe,
  setRememberMe,
  showPassword,
  setShowPassword,
  loading,
  touchedEmail,
  setTouchedEmail,
  touchedPassword,
  setTouchedPassword,
  otpDigits,
  otpEmail,
  resendCountdown,
  handleStartForgotPassword,
  handleResendOtp,
  handleOtpDigitChange,
  handleOtpKeyDown,
  handleSubmit,
  setErrorMessage,
}) => {
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* MODE: REGISTER -> Full Name field */}
        {mode === 'register' && (
          <div>
            <label htmlFor="input-auth-name" className="block text-xs font-bold text-slate-700 mb-1.5">
              Nome Completo ou Razão Social
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                id="input-auth-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Maria das Graças / Salão da Maria"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                required={mode === 'register'}
              />
            </div>
          </div>
        )}

        {/* EMAIL FIELD (Visible in login, register, forgot_password) */}
        {(mode === 'login' || mode === 'register' || mode === 'forgot_password') && (
          <div>
            <label htmlFor="input-auth-email" className="block text-xs font-bold text-slate-700 mb-1.5">
              E-mail para Acesso
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="input-auth-email"
                type="email"
                value={email}
                onBlur={() => setTouchedEmail(true)}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-1 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                  touchedEmail && !email 
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' 
                    : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-600'
                }`}
                required
              />
            </div>
          </div>
        )}

        {/* MODE: VERIFY OTP (8 DIGITS) */}
        {mode === 'verify_otp' && (
          <div className="space-y-4 py-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2 overflow-hidden">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">Código enviado para: <strong className="text-slate-900">{otpEmail || email}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setMode('forgot_password')}
                className="text-emerald-700 hover:text-emerald-800 font-bold underline flex items-center gap-1 cursor-pointer shrink-0 ml-2"
              >
                <Edit3 className="w-3 h-3" />
                <span>Alterar</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-2 text-center uppercase tracking-wider">
                Digite o código de 8 dígitos
              </label>

              {/* 8 Individual Digit Inputs */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 my-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={`otp-input-${idx}`}
                    id={`input-otp-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={8}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-8 h-11 sm:w-10 sm:h-13 text-center text-lg sm:text-2xl font-black text-slate-900 bg-slate-50 border-2 border-slate-300 focus:border-emerald-600 focus:bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition-all"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>
            </div>

            {/* Resend Code Option */}
            <div className="text-center pt-1">
              {resendCountdown > 0 ? (
                <p className="text-xs text-slate-500 font-semibold">
                  Não recebeu? Reenviar código em <span className="text-emerald-700 font-bold">{resendCountdown}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Não recebeu o código? Reenviar agora</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* PASSWORD FIELD (In login, register, reset_password) */}
        {(mode === 'login' || mode === 'register' || mode === 'reset_password') && (
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="input-auth-password" className="block text-xs font-bold text-slate-700">
                {mode === 'reset_password' ? 'Nova Senha' : 'Senha de Acesso'}
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={handleStartForgotPassword}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="input-auth-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onBlur={() => setTouchedPassword(true)}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-xl focus:ring-1 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                  touchedPassword && !password 
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500' 
                    : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-600'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* CONFIRM PASSWORD FIELD (In register & reset_password modes) */}
        {(mode === 'register' || mode === 'reset_password') && (
          <div>
            <label htmlFor="input-auth-confirm-password" className="block text-xs font-bold text-slate-700 mb-1.5">
              {mode === 'reset_password' ? 'Confirmar Nova Senha' : 'Confirmar Senha'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="input-auth-confirm-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                required
              />
            </div>
            {password && confirmPassword && (
              <div className="mt-1.5 text-xs font-semibold flex items-center gap-1.5">
                {password === confirmPassword ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Senhas coincidem
                  </span>
                ) : (
                  <span className="text-rose-600">As senhas não coincidem</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* REMEMBER ME OPTION (Login mode only) */}
        {mode === 'login' && (
          <div className="flex items-center justify-between pt-1 select-none">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer group py-1"
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                rememberMe 
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                  : 'bg-white border-slate-300 group-hover:border-slate-400'
              }`}>
                {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>Lembrar de mim neste dispositivo</span>
            </button>
          </div>
        )}

        {/* PRIMARY SUBMIT BUTTON */}
        <button
          id="btn-auth-submit"
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] font-black text-white text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Verificando...</span>
            </div>
          ) : (
            <>
              <span>
                {mode === 'login' 
                  ? 'Entrar na Conta' 
                  : mode === 'register' 
                  ? 'Concluir e Acessar Painel' 
                  : mode === 'forgot_password'
                  ? 'Enviar Código de 8 Dígitos'
                  : mode === 'verify_otp'
                  ? 'Confirmar Código e Continuar'
                  : 'Salvar e Atualizar Senha'}
              </span>
              <ArrowRight className="w-4 h-4 text-white" />
            </>
          )}
        </button>
      </form>

      {/* BOTTOM NAVIGATION TOGGLE LINKS */}
      <div className="text-center pt-2 border-t border-slate-200">
        {mode === 'login' ? (
          <p className="text-xs text-slate-500 font-medium">
            Ainda não tem conta?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className="font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
            >
              Cadastre-se grátis
            </button>
          </p>
        ) : mode === 'register' ? (
          <p className="text-xs text-slate-500 font-medium">
            Já possui uma conta?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className="font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
            >
              Entrar na sua conta
            </button>
          </p>
        ) : (
          <p className="text-xs text-slate-500 font-medium">
            Lembrou da senha?{' '}
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className="font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
            >
              Voltar para o login
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
