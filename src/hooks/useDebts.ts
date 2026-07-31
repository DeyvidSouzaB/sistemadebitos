import { useState, useEffect, useMemo, useCallback } from 'react';
import { Debt, PaymentHistory } from '../types';
import { User } from './useAuth';
import { supabase, isSupabaseConfigured, isValidUUID } from '../lib/supabase';
import { STORAGE_KEYS, LEGACY_STORAGE_KEYS, getStorageItem, setStorageItem } from '../constants/storageKeys';
import { 
  fetchUserDebtsFromDb, 
  createDebtInDb, 
  updateDebtInDb, 
  deleteDebtFromDb, 
  addPaymentToDb, 
  deletePaymentFromDb 
} from '../lib/supabaseService';
import { getTodayString, formatDate, getEffectivePaidAmount } from '../utils/dateUtils';

export const INITIAL_DEBTS: Debt[] = [
  {
    id: 'debt-1',
    name: 'Carlos Silva Santos',
    phone: '(11) 90000-0000',
    originalAmount: 1200.00,
    currentAmount: 800.00,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'partial',
    description: 'Referente ao serviço de reforma da pintura da sala comercial.',
    payments: [
      {
        id: 'pmt-1-1',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 400.00,
        note: 'Sinal pago em dinheiro'
      }
    ]
  },
  {
    id: 'debt-2',
    name: 'Mariana Costa Albuquerque',
    phone: '(21) 90000-0000',
    originalAmount: 450.00,
    currentAmount: 450.00,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    description: 'Venda de kit de cosméticos e perfumes importados.',
    payments: []
  },
  {
    id: 'debt-3',
    name: 'Roberto de Souza Melo',
    phone: '(31) 90000-0000',
    originalAmount: 950.00,
    currentAmount: 0,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'paid',
    description: 'Compra de monitor gamer antigo da LG de 29 polegadas.',
    payments: [
      {
        id: 'pmt-3-1',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 950.00,
        note: 'Pix integral feito no vencimento'
      }
    ]
  },
  {
    id: 'debt-4',
    name: 'Amanda Vieira Dias',
    phone: '(41) 90000-0000',
    originalAmount: 1800.00,
    currentAmount: 1200.00,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'partial',
    description: 'Assessoria e planejamento estratégico de marketing digital.',
    payments: [
      {
        id: 'pmt-4-1',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 600.00,
        note: 'Primeira parcela via Pix'
      }
    ]
  }
];

export const LOCAL_STORAGE_KEY = STORAGE_KEYS.DEBTS_DB_PREFIX;

export type SyncStatus = 'synced' | 'local_only' | 'syncing' | 'error';

/**
 * Single Source of Truth (SSOT) Architecture Strategy:
 * - When Supabase is configured and the user has a valid UUID, Supabase PostgreSQL DB is the SSOT.
 * - LocalStorage is used as an optimistic cache for instant UI rendering, offline fallback, and guest sessions.
 * - On every remote mutation or Realtime event (`postgres_changes`), state is reconciled with Supabase and mirrored to LocalStorage.
 */
export function useDebts(currentUser: User | null, triggerToast: (msg: string) => void) {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');

  // Manual or automatic re-sync with Supabase server (SSOT)
  const resyncWithServer = useCallback(async () => {
    if (!currentUser) return;
    if (isSupabaseConfigured && supabase && isValidUUID(currentUser.id)) {
      try {
        setSyncStatus('syncing');
        const freshDebts = await fetchUserDebtsFromDb(currentUser.id);
        setDebts(freshDebts);
        setStorageItem(`${LOCAL_STORAGE_KEY}_${currentUser.id}`, JSON.stringify(freshDebts));
        setSyncStatus('synced');
      } catch (err) {
        console.warn('Falha na ressincronização com o servidor:', err);
        setSyncStatus('error');
      }
    } else {
      setSyncStatus('local_only');
    }
  }, [currentUser]);

  // Save to local cache helper
  const updateDebtsState = useCallback((
    newDebtsOrUpdater: Debt[] | ((prev: Debt[]) => Debt[])
  ) => {
    setDebts((prev) => {
      const updated = typeof newDebtsOrUpdater === 'function' ? newDebtsOrUpdater(prev) : newDebtsOrUpdater;
      if (currentUser) {
        setStorageItem(`${LOCAL_STORAGE_KEY}_${currentUser.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  }, [currentUser]);

  // Load User Debts
  useEffect(() => {
    if (!currentUser) return;

    async function loadDebts() {
      setDataLoading(true);

      if (isSupabaseConfigured && supabase && isValidUUID(currentUser!.id)) {
        try {
          setSyncStatus('syncing');
          const dbDebts = await fetchUserDebtsFromDb(currentUser!.id);
          setDebts(dbDebts);
          setStorageItem(`${LOCAL_STORAGE_KEY}_${currentUser!.id}`, JSON.stringify(dbDebts));
          setSyncStatus('synced');
        } catch (err) {
          console.warn('Falha ao carregar do Supabase Database. Usando cache local:', err);
          loadLocalFallback();
          setSyncStatus('error');
        } finally {
          setDataLoading(false);
        }
      } else {
        loadLocalFallback();
        setSyncStatus('local_only');
        setDataLoading(false);
      }
    }

    function loadLocalFallback() {
      const userKey = `${LOCAL_STORAGE_KEY}_${currentUser!.id}`;
      const legacyUserKeys = LEGACY_STORAGE_KEYS.DEBTS_DB_PREFIX.map(lk => `${lk}_${currentUser!.id}`).concat(LEGACY_STORAGE_KEYS.DEBTS_DB_PREFIX);
      
      const raw = getStorageItem(userKey, legacyUserKeys);
      if (raw) {
        try {
          setDebts(JSON.parse(raw));
        } catch (e) {
          setDebts(INITIAL_DEBTS);
        }
      } else {
        setDebts(INITIAL_DEBTS);
        setStorageItem(userKey, JSON.stringify(INITIAL_DEBTS));
      }
    }

    loadDebts();
  }, [currentUser]);

  // Real-time Subscriptions & Storage Listener
  useEffect(() => {
    if (!currentUser) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `${LOCAL_STORAGE_KEY}_${currentUser.id}` && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setDebts(parsed);
        } catch (err) {
          console.error('Erro ao sincronizar via storage:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    let realtimeChannel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null;

    if (isSupabaseConfigured && supabase && isValidUUID(currentUser.id)) {
      const refreshDebtsFromDb = async () => {
        try {
          const freshDebts = await fetchUserDebtsFromDb(currentUser.id);
          setDebts(freshDebts);
          setStorageItem(`${LOCAL_STORAGE_KEY}_${currentUser.id}`, JSON.stringify(freshDebts));
        } catch (e) {
          console.warn('Atualização em tempo real não aplicável:', e);
        }
      };

      realtimeChannel = supabase
        .channel(`realtime_user_${currentUser.id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'debts',
            filter: `user_id=eq.${currentUser.id}`,
          },
          () => refreshDebtsFromDb()
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'payments',
            filter: `user_id=eq.${currentUser.id}`,
          },
          () => refreshDebtsFromDb()
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (realtimeChannel && supabase) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [currentUser]);

  // CRUD: Create or Update Debt
  const handleSaveDebt = useCallback(async (
    formData: {
      name: string;
      phone?: string;
      originalAmount: number;
      createdAt: string;
      dueDate?: string;
      description?: string;
    },
    selectedDebt: Debt | null
  ) => {
    if (!currentUser) return;

    if (selectedDebt) {
      const targetId = selectedDebt.id;
      const targetPayments = selectedDebt.payments;

      updateDebtsState((prevDebts) =>
        prevDebts.map((d) => {
          if (d.id === targetId) {
            const totalPaid = getEffectivePaidAmount(d.payments);
            const currentAmount = Math.max(0, Number((formData.originalAmount - totalPaid).toFixed(2)));
            const status: 'pending' | 'partial' | 'paid' = currentAmount === 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'pending';

            return {
              ...d,
              name: formData.name,
              phone: formData.phone,
              originalAmount: formData.originalAmount,
              currentAmount,
              createdAt: formData.createdAt,
              dueDate: formData.dueDate,
              description: formData.description,
              status,
            };
          }
          return d;
        })
      );
      triggerToast(`Cobrança de "${formData.name}" editada!`);

      if (isSupabaseConfigured && supabase && isValidUUID(currentUser.id)) {
        try {
          const updatedDebt = await updateDebtInDb(currentUser.id, targetId, formData, targetPayments);
          updateDebtsState((prevDebts) =>
            prevDebts.map((d) => (d.id === targetId ? updatedDebt : d))
          );
        } catch (err) {
          console.warn('Falha no Supabase ao editar, mantido localmente:', err);
        }
      }
    } else {
      const tempId = 'debt_' + Math.random().toString(36).substring(2, 11);
      const newDebt: Debt = {
        id: tempId,
        name: formData.name,
        phone: formData.phone,
        originalAmount: formData.originalAmount,
        currentAmount: formData.originalAmount,
        createdAt: formData.createdAt,
        dueDate: formData.dueDate,
        status: 'pending',
        description: formData.description,
        payments: [],
      };
      updateDebtsState((prevDebts) => [newDebt, ...prevDebts]);
      triggerToast(`Nova cobrança para "${formData.name}" criada!`);

      if (isSupabaseConfigured && supabase && isValidUUID(currentUser.id)) {
        try {
          const createdDebt = await createDebtInDb(currentUser.id, formData);
          updateDebtsState((prevDebts) =>
            prevDebts.map((d) => (d.id === tempId ? createdDebt : d))
          );
        } catch (err) {
          console.warn('Falha no Supabase ao criar, mantido localmente:', err);
        }
      }
    }
  }, [currentUser, triggerToast, updateDebtsState]);

  // CRUD: Delete Debt
  const confirmDeleteDebt = useCallback(async (debtIdToDelete: string) => {
    if (!currentUser) return;

    updateDebtsState((prevDebts) => prevDebts.filter((d) => d.id !== debtIdToDelete));
    triggerToast('Cobrança removida!');

    if (isSupabaseConfigured && supabase && isValidUUID(currentUser.id)) {
      try {
        await deleteDebtFromDb(currentUser.id, debtIdToDelete);
      } catch (err) {
        console.warn('Falha no Supabase ao excluir, removida localmente:', err);
      }
    }
  }, [currentUser, triggerToast, updateDebtsState]);

  // CRUD: Add Partial Payment
  const handleAddPayment = useCallback(async (
    targetDebt: Debt,
    amount: number,
    date: string,
    note?: string
  ) => {
    if (!currentUser) return;

    const todayStr = getTodayString();
    const isFuturePmt = date.slice(0, 10) > todayStr;
    const tempPmtId = 'pmt_' + Math.random().toString(36).substring(2, 11);

    updateDebtsState((prevDebts) =>
      prevDebts.map((d) => {
        if (d.id === targetDebt.id) {
          const newPayment: PaymentHistory = {
            id: tempPmtId,
            date,
            amount,
            note,
          };
          const updatedPayments = [...d.payments, newPayment];
          
          const effectivePaid = getEffectivePaidAmount(updatedPayments);

          const currentAmount = Math.max(0, Number((d.originalAmount - effectivePaid).toFixed(2)));
          const status = currentAmount <= 0 ? 'paid' : effectivePaid > 0 ? 'partial' : 'pending';

          return {
            ...d,
            payments: updatedPayments,
            currentAmount,
            status,
          };
        }
        return d;
      })
    );

    const formattedVal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
    if (isFuturePmt) {
      triggerToast(`Pagamento de ${formattedVal} AGENDADO para ${formatDate(date)}!`);
    } else {
      triggerToast(`Pagamento de ${formattedVal} registrado para "${targetDebt.name}"!`);
    }

    if (isSupabaseConfigured && supabase && isValidUUID(currentUser.id)) {
      try {
        const { updatedDebt } = await addPaymentToDb(currentUser.id, targetDebt, amount, note, date);
        updateDebtsState((prevDebts) =>
          prevDebts.map((d) => (d.id === targetDebt.id ? updatedDebt : d))
        );
      } catch (err) {
        console.warn('Falha no Supabase ao registrar pagamento, mantido localmente:', err);
      }
    }
  }, [currentUser, triggerToast, updateDebtsState]);

  // CRUD: Full Fast Settlement
  const handlePayFull = useCallback(async (debt: Debt) => {
    if (!currentUser) return;

    const todayIso = new Date().toISOString();
    const payAmount = debt.currentAmount > 0 ? debt.currentAmount : debt.originalAmount;

    updateDebtsState((prevDebts) =>
      prevDebts.map((d) => {
        if (d.id === debt.id) {
          const fullPayment: PaymentHistory = {
            id: 'pmt_' + Math.random().toString(36).substring(2, 11),
            date: todayIso,
            amount: payAmount,
            note: 'Quitação integral rápida',
          };
          return {
            ...d,
            payments: [...d.payments, fullPayment],
            currentAmount: 0,
            status: 'paid' as const,
          };
        }
        return d;
      })
    );

    triggerToast(`Cobrança de "${debt.name}" quitada!`);

    if (isSupabaseConfigured && supabase && isValidUUID(currentUser.id)) {
      try {
        const { updatedDebt } = await addPaymentToDb(
          currentUser.id, 
          debt, 
          payAmount, 
          'Quitação integral rápida',
          todayIso
        );
        updateDebtsState((prevDebts) =>
          prevDebts.map((d) => (d.id === debt.id ? updatedDebt : d))
        );
      } catch (err) {
        console.warn('Falha no Supabase ao quitar, mantido localmente:', err);
      }
    }
  }, [currentUser, triggerToast, updateDebtsState]);

  // CRUD: Delete individual payment
  const handleDeletePayment = useCallback(async (debtId: string, paymentId: string) => {
    if (!currentUser) return;
    const targetDebt = debts.find((d) => d.id === debtId);
    if (!targetDebt) return;

    updateDebtsState((prevDebts) =>
      prevDebts.map((d) => {
        if (d.id === debtId) {
          const updatedPayments = d.payments.filter((p) => p.id !== paymentId);
          const totalPaid = getEffectivePaidAmount(updatedPayments);
          const currentAmount = Math.max(0, Number((d.originalAmount - totalPaid).toFixed(2)));
          const status: 'pending' | 'partial' | 'paid' = currentAmount === d.originalAmount ? 'pending' : currentAmount === 0 ? 'paid' : 'partial';

          return {
            ...d,
            payments: updatedPayments,
            currentAmount,
            status,
          };
        }
        return d;
      })
    );
    triggerToast('Pagamento removido!');

    if (isSupabaseConfigured && supabase && isValidUUID(currentUser.id)) {
      try {
        const updatedDebt = await deletePaymentFromDb(currentUser.id, targetDebt, paymentId);
        updateDebtsState((prevDebts) =>
          prevDebts.map((d) => (d.id === debtId ? updatedDebt : d))
        );
      } catch (err) {
        console.warn('Falha no Supabase ao excluir pagamento, removido localmente:', err);
      }
    }
  }, [currentUser, debts, triggerToast, updateDebtsState]);

  // Import Backup Callback
  const handleImportBackup = useCallback((importedDebts: Debt[], mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      updateDebtsState(importedDebts);
    } else {
      const debtMap = new Map<string, Debt>(debts.map(d => [d.id, d]));
      importedDebts.forEach(d => {
        debtMap.set(d.id, d);
      });
      updateDebtsState(Array.from(debtMap.values()));
    }
  }, [debts, updateDebtsState]);

  // Clear Database
  const confirmClearDatabase = useCallback(() => {
    updateDebtsState([]);
    triggerToast('Toda a base de dados foi limpa.');
  }, [triggerToast, updateDebtsState]);

  // Load Demo Data
  const confirmLoadDemoData = useCallback(() => {
    updateDebtsState(INITIAL_DEBTS);
    triggerToast('Dados demonstrativos recarregados com sucesso.');
  }, [triggerToast, updateDebtsState]);

  // Notifications Count
  const pendingNotificationsCount = useMemo(() => {
    return debts.filter(d => {
      if (d.status === 'paid' || d.currentAmount <= 0 || !d.dueDate) return false;
      const due = d.dueDate.slice(0, 10);
      const in5Days = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      return due <= in5Days;
    }).length;
  }, [debts]);

  return {
    debts,
    dataLoading,
    syncStatus,
    resyncWithServer,
    updateDebtsState,
    handleSaveDebt,
    confirmDeleteDebt,
    handleAddPayment,
    handlePayFull,
    handleDeletePayment,
    handleImportBackup,
    confirmClearDatabase,
    confirmLoadDemoData,
    pendingNotificationsCount,
  };
}
