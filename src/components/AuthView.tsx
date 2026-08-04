/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, Sparkles, CheckCircle2, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthForm } from '../hooks/useAuthForm';
import { AuthFormFields } from './auth/AuthFormFields';
import { AuthFeatureSidebar } from './auth/AuthFeatureSidebar';

interface AuthViewProps {
  onLoginSuccess: (user: { id: string; email: string; name: string }) => void;
  onBackToLanding?: () => void;
  onOpenSqlModal?: () => void;
}

export default function AuthView({ onLoginSuccess, onBackToLanding }: AuthViewProps) {
  const {
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
    errorMessage,
    setErrorMessage,
    successMessage,
    forgotPasswordSent,
    touchedEmail,
    setTouchedEmail,
    touchedPassword,
    setTouchedPassword,
    otpDigits,
    otpEmail,
    resendCountdown,
    demoOtpNotice,
    handleStartForgotPassword,
    handleResendOtp,
    handleOtpDigitChange,
    handleOtpKeyDown,
    handleSubmit,
    handleDemoLogin,
  } = useAuthForm({ onLoginSuccess });

  const modeTitle =
    mode === 'login'
      ? 'Acesse sua conta'
      : mode === 'register'
      ? 'Criar conta grátis'
      : mode === 'forgot_password'
      ? 'Recuperar senha'
      : mode === 'verify_otp'
      ? 'Confirmar código'
      : 'Nova senha';

  const modeSubtitle =
    mode === 'login'
      ? 'Entre com suas credenciais'
      : mode === 'register'
      ? 'Comece a organizar suas cobranças gratuitamente'
      : mode === 'forgot_password'
      ? 'Informe o e-mail cadastrado para receber o código'
      : mode === 'verify_otp'
      ? 'Insira o código de 8 dígitos enviado ao seu e-mail'
      : 'Digite e confirme sua nova senha';

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      {/* Card container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex" style={{ minHeight: '600px' }}>

        {/* LEFT: Green sidebar (hidden on mobile) */}
        <AuthFeatureSidebar />

        {/* RIGHT: Form panel */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 py-10 bg-white">

          {/* Back button (mobile / top) */}
          {onBackToLanding && (
            <button
              type="button"
              onClick={onBackToLanding}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors mb-6 w-fit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Voltar ao site
            </button>
          )}

          {/* Logo on mobile — igual ao favicon.svg */}
          <div className="flex items-center gap-2.5 mb-6 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-500/25"
              style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <Coins className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">PAGMEFY</span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{modeTitle}</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">{modeSubtitle}</p>
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {demoOtpNotice && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold rounded-xl flex items-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{demoOtpNotice}</span>
              </motion.div>
            )}

            {forgotPasswordSent && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Código enviado! Verifique seu e-mail e a caixa de spam.</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <AuthFormFields
            mode={mode}
            setMode={setMode}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            loading={loading}
            touchedEmail={touchedEmail}
            setTouchedEmail={setTouchedEmail}
            touchedPassword={touchedPassword}
            setTouchedPassword={setTouchedPassword}
            otpDigits={otpDigits}
            otpEmail={otpEmail}
            resendCountdown={resendCountdown}
            handleStartForgotPassword={handleStartForgotPassword}
            handleResendOtp={handleResendOtp}
            handleOtpDigitChange={handleOtpDigitChange}
            handleOtpKeyDown={handleOtpKeyDown}
            handleSubmit={handleSubmit}
            setErrorMessage={setErrorMessage}
          />


        </div>
      </div>
    </div>
  );
}
