/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Coins, 
  LayoutGrid, 
  Users, 
  Calendar, 
  FileText,
  LogOut,
  Database,
  Sparkles,
  X,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: string) => void;
  activeOption: string;
  userName?: string;
  userEmail?: string;
  onOpenSqlModal?: () => void;
  onToggleExpand?: () => void;
}

export default function SidebarDrawer({
  isOpen,
  onClose,
  onSelectOption,
  activeOption,
  userName = 'Usuário',
  userEmail = 'usuario@exemplo.com',
  onOpenSqlModal,
  onToggleExpand
}: SidebarDrawerProps) {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'prazos', label: 'Vencimentos', icon: Calendar },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  const getInitials = (name: string) => {
    if (!name || !name.trim()) return 'US';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <>
      {/* Backdrop overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* Off-canvas Slide Sidebar Panel */}
      <motion.aside
        role="navigation"
        aria-label="Menu principal"
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 bottom-0 h-screen w-72 bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden z-50 select-none shadow-2xl border-r border-slate-900 gpu-accelerate"
      >
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

        {/* Fixed Width Inner Container */}
        <div className="w-full h-full flex flex-col justify-between shrink-0">
          <div>
            {/* Header section with brand logo and close button */}
            <div className="p-4 border-b border-slate-900 flex items-center justify-between relative z-10 h-16 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white shadow-lg shadow-emerald-600/20 shrink-0">
                  <Coins className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-black tracking-tight text-white uppercase truncate">
                    PAGMEFY
                  </h2>
                  <p className="text-[8px] font-bold text-emerald-400 tracking-wider uppercase mt-0.5 truncate">
                    GESTÃO DE DÉBITOS
                  </p>
                </div>
              </div>

              <button
                id="btn-sidebar-close"
                type="button"
                onClick={onClose}
                aria-label="Fechar menu lateral"
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all duration-200 cursor-pointer border border-slate-800 shadow-xs flex items-center justify-center shrink-0 w-9 h-9"
                title="Fechar Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Menu Options */}
            <div className="py-6 relative z-10 space-y-2 px-3">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeOption === item.id;

                return (
                  <button
                    id={`menu-item-${item.id}`}
                    key={item.id}
                    onClick={() => {
                      onSelectOption(item.id);
                      onClose();
                    }}
                    className={`flex items-center rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer text-left group relative w-full px-4 py-3.5 gap-3.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 transition-transform duration-200 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                    
                    <span className="flex-1 text-left">{item.label}</span>

                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom section with profile information */}
          <div className="p-3 border-t border-slate-900 bg-slate-950 relative z-10 flex flex-col items-center">
            {/* Profile Section */}
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl w-full p-2.5 overflow-hidden shadow-xs">
              <div className="flex items-center min-w-0 gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-xs font-black text-white shrink-0 uppercase shadow-xs">
                  {getInitials(userName)}
                </div>
                <div className="overflow-hidden whitespace-nowrap flex flex-col justify-center min-w-0">
                  <span className="block text-xs font-extrabold text-white truncate">
                    {userName}
                  </span>
                  <span className="block text-[11px] text-slate-300 truncate font-semibold antialiased">
                    {userEmail}
                  </span>
                </div>
              </div>
              <button
                id="btn-sidebar-logout"
                title="Sair da sessão"
                onClick={() => {
                  onSelectOption('logout');
                  onClose();
                }}
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl p-2 cursor-pointer transition-all shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
