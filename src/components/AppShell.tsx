/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Menu, 
  Bell, 
  LogOut, 
  LayoutGrid, 
  Users, 
  Calendar, 
  FileText, 
  Settings,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Smartphone,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SidebarDrawer from './SidebarDrawer';
import { User } from '../hooks/useAuth';
import { ToastItem, ToastType } from '../hooks/useToast';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { PwaInstallModal } from './PwaInstallModal';

// ── View metadata map (avoids if/else chain in header) ───────────────────────
const VIEW_META: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Painel Dashboard',
    subtitle: 'Visão geral de recebíveis, indicadores e alertas rápidos',
  },
  clientes: {
    title: 'Devedores & Cobranças',
    subtitle: 'Gestão unificada de devedores, histórico de cobranças e pagamentos',
  },
  prazos: {
    title: 'Vencimentos',
    subtitle: 'Monitoramento de vencimentos e lembretes por data',
  },
  relatorios: {
    title: 'Relatórios Executivos',
    subtitle: 'Análise consolidada de recuperação de crédito',
  },
  configuracoes: {
    title: 'Configurações',
    subtitle: 'Preferências do sistema, perfil e backup',
  },
};

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Inicio', icon: LayoutGrid },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'prazos', label: 'Prazos', icon: Calendar },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
  { id: 'configuracoes', label: 'Ajustes', icon: Settings },
];

export interface AppShellProps {
  activeSidebarOption: string;
  currentUser: User;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  pendingNotificationsCount: number;
  toastMessage?: string | null;
  toast?: ToastItem | null;
  onOpenNotifications: () => void;
  onLogout: () => void;
  onSelectSidebarOption: (opt: string) => void;
  onOpenSqlModal: () => void;
  children: React.ReactNode;
}

export default function AppShell({
  activeSidebarOption,
  currentUser,
  isSidebarOpen,
  setIsSidebarOpen,
  pendingNotificationsCount,
  toastMessage,
  toast,
  onOpenNotifications,
  onLogout,
  onSelectSidebarOption,
  onOpenSqlModal,
  children,
}: AppShellProps) {
  const meta = VIEW_META[activeSidebarOption] ?? { title: '', subtitle: '' };
  
  const {
    isInstallable,
    isInstalled,
    isIos,
    triggerInstall,
    showInstallModal,
    setShowInstallModal
  } = usePwaInstall();

  // Resolve message and type from either toast object or fallback toastMessage
  const activeMessage = toast?.message || toastMessage || '';
  const activeType: ToastType = toast?.type || (
    activeMessage.startsWith('⚠️') || activeMessage.toLowerCase().includes('mantido localmente')
      ? 'warning'
      : activeMessage.toLowerCase().includes('erro') || activeMessage.toLowerCase().includes('falha')
      ? 'error'
      : 'success'
  );

  // Derive 2-letter initials from user name
  const initials = (() => {
    if (!currentUser.name?.trim()) return 'US';
    const parts = currentUser.name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  })();

  // Toast type visual styles dictionary
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'error':
        return {
          containerClass: 'bg-slate-950/95 border-rose-500/50 shadow-rose-950/40 text-white',
          dotClass: 'bg-rose-500',
          icon: <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />,
        };
      case 'warning':
        return {
          containerClass: 'bg-slate-900/95 border-amber-500/50 shadow-amber-950/40 text-white',
          dotClass: 'bg-amber-400',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
        };
      case 'info':
        return {
          containerClass: 'bg-slate-900/95 border-sky-500/50 shadow-sky-950/40 text-white',
          dotClass: 'bg-sky-400',
          icon: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
        };
      case 'success':
      default:
        return {
          containerClass: 'bg-slate-900/95 border-emerald-500/40 shadow-emerald-950/30 text-white',
          dotClass: 'bg-emerald-400',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
        };
    }
  };

  const toastStyle = getToastStyles(activeType);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white pb-24 sm:pb-16">

      {/* ── Sidebar ── */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectOption={onSelectSidebarOption}
        activeOption={activeSidebarOption}
        userName={currentUser.name}
        userEmail={currentUser.email}
        onOpenSqlModal={onOpenSqlModal}
        onToggleExpand={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* ── Content column ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Top Header ── */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-6xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">

            {/* Left: burger + page title */}
            <div className="flex items-center gap-3.5">
              <button
                id="btn-toggle-sidebar"
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label={isSidebarOpen ? 'Fechar menu principal' : 'Abrir menu principal'}
                className="hidden sm:flex p-2.5 bg-slate-50 hover:bg-emerald-50 active:bg-emerald-100 text-slate-800 hover:text-emerald-700 rounded-xl transition-all duration-200 cursor-pointer border border-slate-200 hover:border-emerald-200 shadow-xs items-center justify-center shrink-0 w-11 h-11 group"
                title={isSidebarOpen ? 'Fechar Menu' : 'Abrir Menu'}
              >
                <Menu className="w-5 h-5 text-slate-700 group-hover:text-emerald-700 transition-colors" />
              </button>
              <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">
                  {meta.title}
                </h1>
                <p className="text-[11px] font-semibold text-slate-400 mt-1">{meta.subtitle}</p>
              </div>
            </div>

            {/* Right: notifications + user + logout */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* PWA App Shortcut Install Button */}
              {!isInstalled && (
                <button
                  id="btn-header-install-pwa"
                  type="button"
                  onClick={triggerInstall}
                  aria-label="Instalar atalho do aplicativo no celular ou PC"
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs rounded-xl border border-emerald-200 transition-all shadow-2xs cursor-pointer"
                  title="Instalar PAGMEFY como Ícone na Tela"
                >
                  <Download className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span className="hidden md:inline">Instalar App</span>
                </button>
              )}

              {/* Notification bell */}
              <button
                id="btn-header-notifications"
                type="button"
                onClick={onOpenNotifications}
                aria-label={`Notificações e lembretes. ${pendingNotificationsCount} pendentes.`}
                className="relative p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl transition-all border border-slate-200 cursor-pointer shadow-2xs"
                title="Lembretes de Vencimento e Alertas"
              >
                <Bell className="w-5 h-5" />
                {pendingNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce shadow-sm border border-white">
                    {pendingNotificationsCount}
                  </span>
                )}
              </button>

              {/* User chip */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200/80">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center text-xs font-black uppercase">
                  {initials}
                </div>
                <span className="text-xs font-extrabold text-slate-800 max-w-[120px] truncate">
                  {currentUser.name}
                </span>
              </div>

              {/* Logout */}
              <button
                id="btn-header-logout"
                type="button"
                onClick={onLogout}
                aria-label="Sair da conta"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Sair da Conta"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* ── Main workspace ── */}
        <main className="max-w-6xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 mt-6 w-full">
          {children}
        </main>

        {/* ── Mobile Bottom Navigation Bar ── */}
        <nav
          aria-label="Navegação inferior mobile"
          className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/90 px-2 py-2 flex items-center justify-around shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.3)]"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSidebarOption === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSidebarOption(item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-emerald-400 font-extrabold'
                    : 'text-slate-400 hover:text-slate-200 font-medium'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-active-pill"
                    className="absolute inset-0 bg-emerald-500/15 border border-emerald-500/30 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[10px] tracking-tight relative z-10 mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* ── Floating Typed Toast ── */}
        <AnimatePresence>
          {activeMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-3 text-sm font-semibold max-w-md ${toastStyle.containerClass}`}
            >
              {toastStyle.icon}
              <span className="flex-1 leading-snug">{activeMessage}</span>
              <div className={`w-2 h-2 rounded-full shrink-0 ${toastStyle.dotClass}`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── PWA Installation Guidance Modal ── */}
        <PwaInstallModal
          isOpen={showInstallModal}
          onClose={() => setShowInstallModal(false)}
          isIos={isIos}
          onTriggerInstall={triggerInstall}
          canDirectInstall={isInstallable && !isIos}
        />
      </div>
    </div>
  );
}
