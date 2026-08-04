/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, Suspense } from 'react';
import { Debt } from './types';
import ModalManager, { ModalType, DebtFormData } from './components/ModalManager';
import { STORAGE_KEYS, LEGACY_STORAGE_KEYS, getStorageItem } from './constants/storageKeys';
import { useToast } from './hooks/useToast';
import { useAuth } from './hooks/useAuth';
import { useNavigation } from './hooks/useNavigation';
import { useDebts } from './hooks/useDebts';
import { useDebtFilters } from './hooks/useDebtFilters';
import { motion, AnimatePresence } from 'motion/react';

// ── Lazy-loaded views — each gets its own JS chunk ────────────────────────────
import LandingPage from './components/LandingPage';
const AppShell        = React.lazy(() => import('./components/AppShell'));
const AuthView        = React.lazy(() => import('./components/AuthView'));
const SqlModal        = React.lazy(() => import('./components/SqlModal'));
const Dashboard       = React.lazy(() => import('./components/Dashboard'));
const DevedoresView   = React.lazy(() => import('./components/DevedoresView'));
const PrazosVencimentosView = React.lazy(() => import('./components/PrazosVencimentosView'));
const ConfiguracoesView     = React.lazy(() => import('./components/ConfiguracoesView'));
const RelatoriosView        = React.lazy(() => import('./components/RelatoriosView'));

export default function App() {
  // ── Global hooks ──────────────────────────────────────────────────────────
  const { toast, toastMessage, triggerToast } = useToast();
  const { currentUser, authLoading, showAuthModal, setShowAuthModal, handleLogout, handleLoginSuccess } =
    useAuth(triggerToast);
  const { activeSidebarOption, setActiveSidebarOption, handleSidebarOptionSelect } =
    useNavigation(currentUser, authLoading, handleLogout);
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
  const { search, setSearch, statusFilter, setStatusFilter, sortOption, setSortOption, sortedDebts } =
    useDebtFilters(debts);

  // ── Consolidated modal state ──────────────────────────────────────────────
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [debtIdToDelete, setDebtIdToDelete] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ── Selected debt (always kept in sync with live list) ────────────────────
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const activeSelectedDebt = useMemo(
    () => (selectedDebt ? debts.find((d) => d.id === selectedDebt.id) ?? selectedDebt : null),
    [debts, selectedDebt]
  );

  // ── Convenience openers & closers ──────────────────────────────────────────
  const closeModal = () => { setActiveModal(null); setSelectedDebt(null); };
  const openAddModal = () => { setSelectedDebt(null); setActiveModal('add'); };
  const openPaymentModal = (debt: Debt) => { setSelectedDebt(debt); setActiveModal('payment'); };
  const openEditModal = (debt: Debt) => { setSelectedDebt(debt); setActiveModal('edit'); };
  const openDetailModal = (debt: Debt) => { setSelectedDebt(debt); setActiveModal('detail'); };

  // ── Action handlers ───────────────────────────────────────────────────────
  const handleSaveDebtSubmit = (formData: DebtFormData) => {
    saveDebtHandler(formData, selectedDebt);
    closeModal();
  };

  const handleAddPaymentSubmit = (amount: number, date: string, note?: string) => {
    if (selectedDebt) addPaymentHandler(selectedDebt, amount, date, note);
    closeModal();
  };

  const handleConfirmDeleteDebt = () => {
    if (debtIdToDelete) { deleteDebtHandler(debtIdToDelete); setDebtIdToDelete(null); }
  };

  // ── Route guards (early returns) ──────────────────────────────────────────
  if (!currentUser && !showAuthModal) {
    return (
      <LandingPage
        liveDebts={debts}
        onEnterApp={() => setShowAuthModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
      />
    );
  }

  if (!currentUser || showAuthModal) {
    return (
      <Suspense fallback={null}>
        <div className="relative">
          <AuthView
            onLoginSuccess={(user) => {
              setShowAuthModal(false);
              handleLoginSuccess(user, () => {
                const savedTab = getStorageItem(STORAGE_KEYS.ACTIVE_TAB, LEGACY_STORAGE_KEYS.ACTIVE_TAB);
                setActiveSidebarOption(savedTab && savedTab !== 'landing' ? savedTab : 'dashboard');
              });
            }}
            onBackToLanding={() => { setShowAuthModal(false); setActiveSidebarOption('landing'); }}
            onOpenSqlModal={() => setActiveModal('sql')}
          />
          <Suspense fallback={null}>
            <SqlModal isOpen={activeModal === 'sql'} onClose={closeModal} />
          </Suspense>
        </div>
      </Suspense>
    );
  }

  // ── Main authenticated app ────────────────────────────────────────────────
  return (
    <>
      <Suspense fallback={null}>
        <AppShell
          activeSidebarOption={activeSidebarOption}
          currentUser={currentUser}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          pendingNotificationsCount={pendingNotificationsCount}
          toast={toast}
          toastMessage={toastMessage}
          onOpenNotifications={() => setActiveModal('notifications')}
          onLogout={() => handleLogout(() => setActiveSidebarOption('landing'))}
          onSelectSidebarOption={(opt) => handleSidebarOptionSelect(opt, () => setActiveModal('sql'))}
          onOpenSqlModal={() => setActiveModal('sql')}
        >
          {/* ── View router ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSidebarOption}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
            >
              {activeSidebarOption === 'dashboard' && (
                <Suspense fallback={null}>
                  <Dashboard
                    debts={debts}
                    onOpenAddModal={openAddModal}
                    onPayFull={handlePayFull}
                    onAddPaymentClick={openPaymentModal}
                    onSelectOption={(opt) => {
                      if (opt === 'lembretes') setActiveModal('notifications');
                      else if (opt === 'devedores') setActiveSidebarOption('clientes');
                      else setActiveSidebarOption(opt);
                    }}
                    onOpenNotifications={() => setActiveModal('notifications')}
                  />
                </Suspense>
              )}

              {activeSidebarOption === 'clientes' && (
                <Suspense fallback={null}>
                  <DevedoresView
                    debts={debts}
                    sortedDebts={sortedDebts}
                    search={search}
                    setSearch={setSearch}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    onEdit={openEditModal}
                    onDelete={setDebtIdToDelete}
                    onAddPaymentClick={openPaymentModal}
                    onPayFull={handlePayFull}
                    onDeletePayment={handleDeletePayment}
                    onOpenAddModal={openAddModal}
                  />
                </Suspense>
              )}

              {activeSidebarOption === 'prazos' && (
                <Suspense fallback={null}>
                  <PrazosVencimentosView
                    debts={debts}
                    onSelectDebt={openDetailModal}
                    onPayFull={handlePayFull}
                  />
                </Suspense>
              )}

              {activeSidebarOption === 'relatorios' && (
                <Suspense fallback={null}>
                  <RelatoriosView
                    debts={debts}
                    onSelectDebt={openDetailModal}
                    onAddPaymentClick={openPaymentModal}
                    onPayFull={handlePayFull}
                  />
                </Suspense>
              )}

              {activeSidebarOption === 'configuracoes' && (
                <Suspense fallback={null}>
                  <ConfiguracoesView
                    userName={currentUser.name}
                    userEmail={currentUser.email}
                    onOpenBackupModal={() => setActiveModal('backup')}
                    onOpenSqlModal={() => setActiveModal('sql')}
                    onLoadDemoData={() => setActiveModal('confirm_load_demo')}
                    onClearDb={() => setActiveModal('confirm_clear_db')}
                  />
                </Suspense>
              )}
            </motion.div>
          </AnimatePresence>
        </AppShell>
      </Suspense>

      {/* ── All modals (rendered outside AppShell for correct stacking) ── */}
      <ModalManager
        activeModal={activeModal}
        debtIdToDelete={debtIdToDelete}
        debts={debts}
        activeSelectedDebt={activeSelectedDebt}
        onCloseModal={closeModal}
        onCancelDelete={() => setDebtIdToDelete(null)}
        onSaveDebt={handleSaveDebtSubmit}
        onAddPayment={handleAddPaymentSubmit}
        onImportBackup={handleImportBackup}
        onPayFull={handlePayFull}
        onDeletePayment={handleDeletePayment}
        onOpenPaymentModal={(debt) => { setSelectedDebt(debt); setActiveModal('payment'); }}
        onOpenEditModal={(debt) => { setSelectedDebt(debt); setActiveModal('edit'); }}
        onDeleteFromDetail={(id) => { setActiveModal(null); setDebtIdToDelete(id); }}
        onConfirmDeleteDebt={handleConfirmDeleteDebt}
        onConfirmClearDb={() => { confirmClearDatabase(); closeModal(); }}
        onConfirmLoadDemo={() => { confirmLoadDemoData(); closeModal(); }}
      />
    </>
  );
}
