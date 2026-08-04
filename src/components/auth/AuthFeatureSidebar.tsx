/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, MessageSquare, Smartphone, BarChart3, Coins, Sparkles } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    text: 'Controle total dos seus devedores',
    color: 'emerald',
  },
  {
    icon: MessageSquare,
    text: 'Lembretes automáticos no WhatsApp',
    color: 'emerald',
  },
  {
    icon: Smartphone,
    text: 'Acesse de qualquer dispositivo',
    color: 'emerald',
  },
  {
    icon: BarChart3,
    text: 'Relatórios financeiros completos',
    color: 'emerald',
  },
];

export const AuthFeatureSidebar: React.FC = () => {
  return (
    <div
      className="hidden lg:flex lg:col-span-5 flex-col justify-between relative overflow-hidden text-white"
      style={{ background: 'linear-gradient(145deg, #059669 0%, #10b981 50%, #0d9488 100%)' }}
    >
      {/* Subtle dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Glow blobs */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.10), transparent 70%)' }} />

      <div className="relative z-10 flex flex-col h-full p-10 lg:p-12 space-y-8">

        {/* Logo PAGMEFY */}
        <div className="space-y-5">
          {/* Ícone logo — igual ao favicon.svg */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl border border-white/20"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
          >
            <Coins className="w-8 h-8 text-white" />
          </div>

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-sm">
              PAGMEFY
            </h2>
            <p className="text-white/75 text-sm font-medium mt-2 leading-relaxed max-w-xs">
              A plataforma completa para gestão de cobranças e controle de fiados do seu negócio
            </p>
          </div>

          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/15 text-white border border-white/25 backdrop-blur-sm w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Gestão Inteligente de Cobranças
          </span>
        </div>

        {/* Features list */}
        <ul className="space-y-3 flex-1">
          {features.map(({ icon: Icon, text }) => (
            <li
              key={text}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-white/20 hover:border-white/40 transition-all"
              style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(4px)' }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/25"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-white/90">{text}</span>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
};
