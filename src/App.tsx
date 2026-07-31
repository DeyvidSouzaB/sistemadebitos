/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Debt } from './types';
import Dashboard from './components/Dashboard';
import DebtModal from './components/DebtModal';
import PaymentModal from './components/PaymentModal';
import BackupModal from './components/BackupModal';
import ConfirmModal from './components/ConfirmModal';
import SidebarDrawer from './components/SidebarDrawer';
import AuthView from './components/AuthView';
import SqlModal from './components/SqlModal';
import { formatPhone } from './utils/phoneUtils';
import DevedoresView from './components/DevedoresView';
import PrazosVencimentosView from './components/PrazosVencimentosView';
import NotificationsModal from './components/NotificationsModal';
import ConfiguracoesView from './components/ConfiguracoesView';

const RelatoriosView = React.lazy(() => import('./components/RelatoriosView'));
const LandingPage = React.lazy(() => import('./components/LandingPage'));
import DebtorDetailModal from './components/DebtorDetailModal';
import { STORAGE_KEYS, LEGACY_STORAGE_KEYS, getStorageItem } from './constants/storageKeys';
import { useToast } from './hooks/useToast';
import { useAuth } from './hooks/useAuth';
import { useNavigation } from './hooks/useNavigation';
import { useDebts } from './hooks/useDebts';
import { useDebtFilters } from './hooks/useDebtFilters';
import { formatCurrency } from './hooks/useDebtCalculations';
import { 
  Menu, 
  LogOut, 
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // 1. Toast notifications hook
  const { toastMessage, triggerToast } = useToast();

  // 2. Auth management hook
  const { 
    currentUser, 
    authLoading, 
    showAuthModal, 
    setShowAuthModal, 
    handleLogout, 
    handleLoginSuccess 
  } = useAuth(triggerToast);

  // 3. Navigation & tab routing hook
  const { 
    activeSidebarOption, 
    setActiveSidebarOption, 
    handleSidebarOptionSelect 
  } = useNavigation(currentUser, authLoading, handleLogout);

  // 4. Debts data management & CRUD hook
  const {
    debts,
    handleSaveDebt: saveDebtHandler,
    confirmDeleteDebt: deleteDebtHandler,
    handleAddPayment: addPaymentHandler,
    handlePayFull,
    handleDeletePayment,
    handleImportBackup,
    confirmClearDatabase,
    confirmLoadDemoData,
    pendingNotificationsCount,
  } = useDebts(currentUser, triggerToast);

  // 5. Debt search, filtering & sorting hook
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    sortedDebts,
  } = useDebtFilters(debts);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Custom confirmation modals state
  const [debtIdToDelete, setDebtIdToDelete] = useState<string | null>(null);
  const [isClearDbConfirmOpen, setIsClearDbConfirmOpen] = useState(false);
  const [isLoadDemoConfirmOpen, setIsLoadDemoConfirmOpen] = useState(false);

  // Selected debt state
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);

  const activeSelectedDebt = useMemo(() => {
    if (!selectedDebt) return null;
    return debts.find((d) => d.id === selectedDebt.id) || selectedDebt;
  }, [debts, selectedDebt]);

  // Handlers binding selectedDebt
  const handleSaveDebtSubmit = (formData: {
    name: string;
    phone?: string;
    originalAmount: number;
    createdAt: string;
    dueDate?: string;
    description?: string;
  }) => {
    saveDebtHandler(formData, selectedDebt);
    setSelectedDebt(null);
  };

  const handleAddPaymentSubmit = (amount: number, date: string, note?: string) => {
    if (selectedDebt) {
      addPaymentHandler(selectedDebt, amount, date, note);
    }
    setSelectedDebt(null);
  };

  const handleDeleteDebtClick = (id: string) => {
    setDebtIdToDelete(id);
  };

  const handleConfirmDeleteDebt = () => {
    if (debtIdToDelete) {
      deleteDebtHandler(debtIdToDelete);
      setDebtIdToDelete(null);
    }
  };

  // Show Loading spinner during initial session check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Carregando PAGMEFY...</p>
      </div>
    );
  }

  // If currently on Landing Page and not logged in, render full standalone Landing Page!
  if (activeSidebarOption === 'landing' && !currentUser) {
    return (
      <React.Suspense fallback={
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4" />
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">Carregando PAGMEFY...</p>
        </div>
      }>
        <LandingPage
          liveDebts={debts}
          onEnterApp={() => {
            if (currentUser) {
              setActiveSidebarOption('dashboard');
            } else {
              setShowAuthModal(true);
              setActiveSidebarOption('dashboard');
            }
          }}
          onOpenAuth={() => {
            setShowAuthModal(true);
            setActiveSidebarOption('dashboard');
          }}
        />
      </React.Suspense>
    );
  }

  // Show Auth view if user is not authenticated or explicitly requested login
  if (!currentUser || showAuthModal) {
    return (
      <div className="relative">
        <AuthView 
          onLoginSuccess={(user) => {
            setShowAuthModal(false);
            handleLoginSuccess(user, () => {
              const savedTab = getStorageItem(STORAGE_KEYS.ACTIVE_TAB, LEGACY_STORAGE_KEYS.ACTIVE_TAB);
              setActiveSidebarOption(savedTab && savedTab !== 'landing' ? savedTab : 'dashboard');
            });
          }}
          onBackToLanding={() => {
            setShowAuthModal(false);
            setActiveSidebarOption('landing');
          }}
          onOpenSqlModal={() => setIsSqlModalOpen(true)}
        />
        <SqlModal 
          isOpen={isSqlModalOpen} 
          onClose={() => setIsSqlModalOpen(false)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white pb-16">
      
      {/* Permanent Left Sidebar */}
      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectOption={(opt) => handleSidebarOptionSelect(opt, () => setIsSqlModalOpen(true))}
        activeOption={activeSidebarOption}
        userName={currentUser.name}
        userEmail={currentUser.email}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onToggleExpand={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header - Menu Icon directly beside Dashboard Title */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 shadow-2xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            
            {/* Left group: Menu Icon directly beside View Title */}
            <div className="flex items-center gap-3.5">
              <button
                id="btn-toggle-sidebar"
                type="button"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label={isSidebarOpen ? "Fechar menu principal" : "Abrir menu principal"}
                className="p-2.5 bg-slate-50 hover:bg-emerald-50 active:bg-emerald-100 text-slate-800 hover:text-emerald-700 rounded-xl transition-all duration-200 cursor-pointer border border-slate-200 hover:border-emerald-200 shadow-xs flex items-center justify-center shrink-0 w-11 h-11 group"
                title={isSidebarOpen ? "Fechar Menu" : "Abrir Menu"}
              >
                <Menu className="w-5 h-5 text-slate-700 group-hover:text-emerald-700 transition-colors" />
              </button>

              <div>
                <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
                  {activeSidebarOption === 'dashboard' && 'Painel Dashboard'}
                  {activeSidebarOption === 'clientes' && 'Devedores & Cobranças'}
                  {activeSidebarOption === 'prazos' && 'Vencimentos'}
                  {activeSidebarOption === 'relatorios' && 'Relatórios Executivos'}
                  {activeSidebarOption === 'configuracoes' && 'Configurações'}
                </h1>
                <p className="text-[11px] font-semibold text-slate-400 mt-1">
                  {activeSidebarOption === 'dashboard' && 'Visão geral de recebíveis, indicadores e alertas rápidos'}
                  {activeSidebarOption === 'clientes' && 'Gestão unificada de devedores, histórico de cobranças e pagamentos'}
                  {activeSidebarOption === 'prazos' && 'Monitoramento de vencimentos e lembretes por data'}
                  {activeSidebarOption === 'relatorios' && 'Análise consolidada de recuperação de crédito'}
                  {activeSidebarOption === 'configuracoes' && 'Preferências do sistema, perfil e backup'}
                </p>
              </div>
            </div>

            {/* Right group: Controls, Notifications & User Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notification Icon Bell */}
              <button
                id="btn-header-notifications"
                type="button"
                onClick={() => setIsNotificationsModalOpen(true)}
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

              {/* User Avatar */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200/80">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center text-xs font-black uppercase">
                  {(() => {
                    if (!currentUser.name || !currentUser.name.trim()) return 'US';
                    const parts = currentUser.name.trim().split(/\s+/).filter(Boolean);
                    if (parts.length >= 2) {
                      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                    }
                    return parts[0].slice(0, 2).toUpperCase();
                  })()}
                </div>
                <span className="text-xs font-extrabold text-slate-800 max-w-[120px] truncate">
                  {currentUser.name}
                </span>
              </div>

              <button
                id="btn-header-logout"
                type="button"
                onClick={() => handleLogout(() => setActiveSidebarOption('landing'))}
                aria-label="Sair da conta"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Sair da Conta"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

          </div>
        </header>

        {/* Main Container Workspace */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSidebarOption}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            >
              {activeSidebarOption === 'dashboard' && (
                <Dashboard
                  debts={debts}
                  onOpenAddModal={() => {
                    setSelectedDebt(null);
                    setIsAddModalOpen(true);
                  }}
                  onPayFull={handlePayFull}
                  onAddPaymentClick={(d) => {
                    setSelectedDebt(d);
                    setIsPaymentModalOpen(true);
                  }}
                  onSelectOption={(opt) => {
                    if (opt === 'lembretes') {
                      setIsNotificationsModalOpen(true);
                    } else if (opt === 'devedores') {
                      setActiveSidebarOption('clientes');
                    } else {
                      setActiveSidebarOption(opt);
                    }
                  }}
                  onOpenNotifications={() => setIsNotificationsModalOpen(true)}
                />
              )}

              {activeSidebarOption === 'clientes' && (
                <DevedoresView
                  debts={debts}
                  sortedDebts={sortedDebts}
                  search={search}
                  setSearch={setSearch}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  onEdit={(d) => {
                    setSelectedDebt(d);
                    setIsEditModalOpen(true);
                  }}
                  onDelete={handleDeleteDebtClick}
                  onAddPaymentClick={(d) => {
                    setSelectedDebt(d);
                    setIsPaymentModalOpen(true);
                  }}
                  onPayFull={handlePayFull}
                  onDeletePayment={handleDeletePayment}
                  onOpenAddModal={() => {
                    setSelectedDebt(null);
                    setIsAddModalOpen(true);
                  }}
                />
              )}

              {activeSidebarOption === 'prazos' && (
                <PrazosVencimentosView 
                  debts={debts} 
                  onSelectDebt={(debt) => {
                    setSelectedDebt(debt);
                    setIsDetailModalOpen(true);
                  }}
                  onPayFull={handlePayFull}
                />
              )}

              {activeSidebarOption === 'relatorios' && (
                <React.Suspense fallback={
                  <div className="flex items-center justify-center p-12 text-slate-400">
                    <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mr-3" />
                    <span className="text-sm font-medium">Carregando Relatórios...</span>
                  </div>
                }>
                  <RelatoriosView 
                    debts={debts} 
                    onSelectDebt={(debt) => {
                      setSelectedDebt(debt);
                      setIsDetailModalOpen(true);
                    }}
                    onAddPaymentClick={(debt) => {
                      setSelectedDebt(debt);
                      setIsPaymentModalOpen(true);
                    }}
                    onPayFull={handlePayFull}
                  />
                </React.Suspense>
              )}

              {activeSidebarOption === 'configuracoes' && (
                <ConfiguracoesView
                  userName={currentUser.name}
                  userEmail={currentUser.email}
                  onOpenBackupModal={() => setIsBackupModalOpen(true)}
                  onOpenSqlModal={() => setIsSqlModalOpen(true)}
                  onLoadDemoData={() => setIsLoadDemoConfirmOpen(true)}
                  onClearDb={() => setIsClearDbConfirmOpen(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating toast notification banner */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 text-sm font-semibold max-w-md"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="flex-1">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <DebtModal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedDebt(null);
          }}
          onSubmit={handleSaveDebtSubmit}
          debtToEdit={activeSelectedDebt}
        />

        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedDebt(null);
          }}
          onSubmit={handleAddPaymentSubmit}
          debt={activeSelectedDebt}
        />

        <BackupModal
          isOpen={isBackupModalOpen}
          onClose={() => setIsBackupModalOpen(false)}
          debts={debts}
          onImport={handleImportBackup}
        />

        <SqlModal
          isOpen={isSqlModalOpen}
          onClose={() => setIsSqlModalOpen(false)}
        />

        <NotificationsModal
          isOpen={isNotificationsModalOpen}
          onClose={() => setIsNotificationsModalOpen(false)}
          debts={debts}
          onPayFull={handlePayFull}
          onOpenPaymentModal={(d) => {
            setSelectedDebt(d);
            setIsPaymentModalOpen(true);
          }}
        />

        <DebtorDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedDebt(null);
          }}
          debt={activeSelectedDebt}
          onAddPaymentClick={(d) => {
            setSelectedDebt(d);
            setIsDetailModalOpen(false);
            setIsPaymentModalOpen(true);
          }}
          onPayFull={handlePayFull}
          onEdit={(d) => {
            setSelectedDebt(d);
            setIsDetailModalOpen(false);
            setIsEditModalOpen(true);
          }}
          onDelete={(id) => {
            setIsDetailModalOpen(false);
            handleDeleteDebtClick(id);
          }}
          onDeletePayment={handleDeletePayment}
        />

        {/* Confirmation Modals */}
        {(() => {
          const debtToDelete = debts.find((d) => d.id === debtIdToDelete);

          return (
            <>
              <ConfirmModal
                isOpen={debtIdToDelete !== null}
                title="Excluir Cobrança"
                message={
                  debtToDelete ? (
                    <div className="space-y-3">
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                        Tem certeza de que deseja excluir permanentemente este registro de cobrança e todo o seu histórico financeiro?
                      </p>

                      <div className="p-3.5 bg-white rounded-2xl border border-rose-200/90 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-slate-500 font-semibold">Cliente / Devedor:</span>
                          <span className="font-extrabold text-slate-900 truncate max-w-[200px]">{debtToDelete.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-slate-500 font-semibold">Valor Inicial:</span>
                          <span className="font-bold text-slate-700 font-mono">{formatCurrency(debtToDelete.originalAmount)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-slate-500 font-semibold">Saldo Devedor Atual:</span>
                          <span className="font-black text-rose-600 font-mono">{formatCurrency(debtToDelete.currentAmount)}</span>
                        </div>
                        {debtToDelete.phone && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-semibold">Telefone:</span>
                            <span className="font-medium text-slate-600">{formatPhone(debtToDelete.phone)}</span>
                          </div>
                        )}
                        {debtToDelete.payments && debtToDelete.payments.length > 0 && (
                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                            <span className="font-medium">Histórico de Pagamentos:</span>
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                              {debtToDelete.payments.length} lançamento(s)
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] text-rose-600/90 font-bold flex items-center gap-1">
                        ⚠️ Esta ação removerá definitivamente este cliente de todas as telas e relatórios.
                      </p>
                    </div>
                  ) : (
                    "Tem certeza de que deseja excluir permanentemente este registro de cobrança e todo o seu histórico?"
                  )
                }
                confirmText="Sim, Excluir"
                type="danger"
                onClose={() => setDebtIdToDelete(null)}
                onConfirm={handleConfirmDeleteDebt}
              />

              <ConfirmModal
                isOpen={isClearDbConfirmOpen}
                title="Limpar Toda a Base de Dados"
                message={
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                      Esta ação apagará <strong>TODAS</strong> as cobranças e históricos registrados na base de dados.
                    </p>
                    <div className="p-3 bg-white rounded-xl border border-rose-200/90 text-xs space-y-1.5 shadow-2xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Total de Registros:</span>
                        <span className="font-extrabold text-slate-900">{debts.length} cobrança(s)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Saldo Total a Apagar:</span>
                        <span className="font-black text-rose-600 font-mono">
                          {formatCurrency(debts.reduce((acc, d) => acc + d.currentAmount, 0))}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-rose-600 font-bold">
                      ⚠️ Esta operação é irreversível!
                    </p>
                  </div>
                }
                confirmText="Limpar Tudo"
                type="danger"
                onClose={() => setIsClearDbConfirmOpen(false)}
                onConfirm={() => {
                  confirmClearDatabase();
                  setIsClearDbConfirmOpen(false);
                }}
              />

              <ConfirmModal
                isOpen={isLoadDemoConfirmOpen}
                title="Restaurar Dados Demonstrativos"
                message="Isso substituirá a base atual pelos registros demonstrativos padrão."
                confirmText="Restaurar"
                type="warning"
                onClose={() => setIsLoadDemoConfirmOpen(false)}
                onConfirm={() => {
                  confirmLoadDemoData();
                  setIsLoadDemoConfirmOpen(false);
                }}
              />
            </>
          );
        })()}

      </div>
    </div>
  );
}
