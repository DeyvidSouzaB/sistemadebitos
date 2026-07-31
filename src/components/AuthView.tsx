/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthForm } from '../hooks/useAuthForm';
import { AuthHeader } from './auth/AuthHeader';
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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      {/* Main Container Card */}
      <div className="max-w-5xl w-full mx-auto bg-white border border-slate-200/90 rounded-3xl shadow-xl overflow-hidden relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* LEFT COLUMN: AUTH FORM */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-white">
            <AuthHeader mode={mode} onBackToLanding={onBackToLanding} />

            {/* Error, Success & Demo OTP Alerts */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex flex-col gap-2 shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                </motion.div>
              )}

              {demoOtpNotice && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold rounded-xl flex items-center gap-2.5 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{demoOtpNotice}</span>
                </motion.div>
              )}

              {forgotPasswordSent && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2.5 shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Enviamos o código de confirmação para o seu e-mail. Verifique sua caixa de entrada e spam!</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2.5 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Fields Component */}
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

          {/* RIGHT COLUMN: BRAND SHOWCASE */}
          <AuthFeatureSidebar />
        </div>
      </div>
    </div>
  );
}
