import React, { useState } from 'react';
import { Smartphone, Laptop } from 'lucide-react';
import { MobilePhoneMockup } from './MobilePhoneMockup';
import { DesktopAppMockup } from './DesktopAppMockup';

export function HeroCards3D() {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('mobile');

  return (
    <div className="relative w-full max-w-5xl mx-auto py-6 px-2 sm:px-6 lg:px-8 overflow-hidden">
      {/* View Switcher Toggle Bar */}
      <div className="flex items-center justify-center gap-2 mb-4 relative z-20">
        <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📱 Modelo Celular</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('desktop')}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'desktop'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>💻 Modelo Computador</span>
          </button>
        </div>
      </div>

      {/* Light Slate Gradient Background Container */}
      <div className={`relative rounded-3xl bg-gradient-to-b from-slate-50 via-white to-slate-50 border border-slate-200/80 shadow-xl transition-all duration-300 ${
        viewMode === 'desktop' 
          ? 'p-2 sm:p-4' 
          : 'p-2 sm:p-6 lg:p-8 min-h-[500px] flex items-center justify-center overflow-hidden'
      }`}>
        
        {/* Subtle Radial Glow Effects in Background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-sky-200/20 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-[80px] pointer-events-none" />

        {viewMode === 'mobile' ? (
          <MobilePhoneMockup />
        ) : (
          <div className="w-full relative z-10 py-1">
            <DesktopAppMockup />
          </div>
        )}

      </div>
    </div>
  );
}
