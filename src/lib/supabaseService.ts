/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured, isValidUUID } from './supabase';
import { Debt, PaymentHistory } from '../types';
import { STORAGE_KEYS, LEGACY_STORAGE_KEYS, getStorageItem } from '../constants/storageKeys';
import { getEffectivePaidAmount } from '../utils/dateUtils';

export interface SupabaseDebtRow {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  original_amount: number;
  current_amount: number;
  status: 'pending' | 'partial' | 'paid';
  description?: string;
  due_date?: string;
  created_at: string;
}

export interface SupabasePaymentRow {
  id: string;
  debt_id: string;
  user_id: string;
  amount: number;
  note?: string;
  payment_date: string;
  created_at: string;
}

// Map Supabase rows to App Debt model
function mapToAppDebt(debtRow: SupabaseDebtRow, paymentRows: SupabasePaymentRow[] = []): Debt {
  const payments: PaymentHistory[] = paymentRows.map(p => ({
    id: p.id,
    date: p.payment_date,
    amount: Number(p.amount),
    note: p.note || undefined,
  }));

  const origAmount = Number(debtRow.original_amount);
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const effectivePaid = payments.reduce((sum, p) => {
    const pDateStr = (p.date || '').slice(0, 10);
    return pDateStr <= todayStr ? sum + p.amount : sum;
  }, 0);

  const currentAmount = Math.max(0, Number((origAmount - effectivePaid).toFixed(2)));

  let status: 'pending' | 'partial' | 'paid' = 'pending';
  if (currentAmount === 0 && origAmount > 0) {
    status = 'paid';
  } else if (effectivePaid > 0) {
    status = 'partial';
  }

  return {
    id: debtRow.id,
    name: debtRow.name,
    phone: debtRow.phone || undefined,
    originalAmount: origAmount,
    currentAmount,
    createdAt: debtRow.created_at,
    dueDate: debtRow.due_date || undefined,
    status,
    description: debtRow.description || undefined,
    payments,
  };
}

export async function fetchUserDebtsFromDb(userId: string): Promise<Debt[]> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase não está configurado.');
  }

  if (!userId || !isValidUUID(userId)) {
    throw new Error('ID de usuário não é um UUID válido do Supabase.');
  }

  // Fetch all debts for current user
  const { data: debtsData, error: debtsError } = await supabase
    .from('debts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (debtsError) {
    console.warn('Supabase: Erro/Aviso ao buscar cobranças (usando local storage):', debtsError.message || debtsError);
    throw debtsError;
  }

  if (!debtsData || debtsData.length === 0) {
    return [];
  }

  // Fetch all payments for current user
  const { data: paymentsData, error: paymentsError } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('payment_date', { ascending: false });

  if (paymentsError) {
    console.warn('Supabase: Erro/Aviso ao buscar pagamentos:', paymentsError.message || paymentsError);
    // Even if payments query fails, return mapped debts
  }

  // Group payments by debt_id
  const paymentsByDebt: Record<string, SupabasePaymentRow[]> = {};
  (paymentsData || []).forEach((pmt) => {
    if (!paymentsByDebt[pmt.debt_id]) {
      paymentsByDebt[pmt.debt_id] = [];
    }
    paymentsByDebt[pmt.debt_id].push(pmt);
  });

  return debtsData.map((dRow) => mapToAppDebt(dRow, paymentsByDebt[dRow.id] || []));
}

export async function createDebtInDb(userId: string, formData: {
  name: string;
  phone?: string;
  originalAmount: number;
  createdAt: string;
  dueDate?: string;
  description?: string;
}): Promise<Debt> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase não configurado');
  }

  const newDebtRow = {
    user_id: userId,
    name: formData.name,
    phone: formData.phone || null,
    original_amount: formData.originalAmount,
    current_amount: formData.originalAmount,
    status: 'pending',
    description: formData.description || null,
    due_date: formData.dueDate || null,
    created_at: formData.createdAt || new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('debts')
    .insert([newDebtRow])
    .select()
    .single();

  if (error) throw error;
  return mapToAppDebt(data, []);
}

export async function updateDebtInDb(userId: string, debtId: string, formData: {
  name: string;
  phone?: string;
  originalAmount: number;
  createdAt: string;
  dueDate?: string;
  description?: string;
}, currentPayments: PaymentHistory[]): Promise<Debt> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase não configurado');
  }

  const totalPaid = getEffectivePaidAmount(currentPayments);
  const currentAmount = Math.max(0, Number((formData.originalAmount - totalPaid).toFixed(2)));
  
  let status: 'pending' | 'partial' | 'paid' = 'pending';
  if (currentAmount === 0) {
    status = 'paid';
  } else if (totalPaid > 0) {
    status = 'partial';
  }

  const updateFields = {
    name: formData.name,
    phone: formData.phone || null,
    original_amount: formData.originalAmount,
    current_amount: currentAmount,
    status,
    description: formData.description || null,
    due_date: formData.dueDate || null,
    created_at: formData.createdAt,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('debts')
    .update(updateFields)
    .eq('id', debtId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;

  // Map back with existing payments
  const mappedPayments: SupabasePaymentRow[] = currentPayments.map(p => ({
    id: p.id,
    debt_id: debtId,
    user_id: userId,
    amount: p.amount,
    note: p.note,
    payment_date: p.date,
    created_at: p.date,
  }));

  return mapToAppDebt(data, mappedPayments);
}

export async function deleteDebtFromDb(userId: string, debtId: string): Promise<void> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase não configurado');
  }

  const { error } = await supabase
    .from('debts')
    .delete()
    .eq('id', debtId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function addPaymentToDb(
  userId: string, 
  debt: Debt, 
  amount: number, 
  note?: string, 
  paymentDate?: string
): Promise<{ updatedDebt: Debt; paymentId: string }> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase não configurado');
  }

  const pmtDate = paymentDate || new Date().toISOString();

  // 1. Insert payment record
  const { data: pmtData, error: pmtError } = await supabase
    .from('payments')
    .insert([{
      debt_id: debt.id,
      user_id: userId,
      amount,
      note: note || null,
      payment_date: pmtDate,
    }])
    .select()
    .single();

  if (pmtError) throw pmtError;

  // 2. Calculate effective totals (only payments up to today reduce current open balance)
  const allPayments = [
    ...debt.payments,
    {
      id: pmtData.id,
      date: pmtDate,
      amount,
      note,
    }
  ];

  const effectivePaid = getEffectivePaidAmount(allPayments);

  const newCurrentAmount = Math.max(0, Number((debt.originalAmount - effectivePaid).toFixed(2)));

  let newStatus: 'pending' | 'partial' | 'paid' = 'pending';
  if (newCurrentAmount === 0) {
    newStatus = 'paid';
  } else if (effectivePaid > 0) {
    newStatus = 'partial';
  }

  // 3. Update debt record
  const { data: updatedDebtRow, error: updateError } = await supabase
    .from('debts')
    .update({
      current_amount: newCurrentAmount,
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', debt.id)
    .eq('user_id', userId)
    .select()
    .single();

  if (updateError) throw updateError;

  return {
    updatedDebt: {
      ...debt,
      currentAmount: newCurrentAmount,
      status: newStatus,
      payments: allPayments,
    },
    paymentId: pmtData.id,
  };
}

export async function deletePaymentFromDb(
  userId: string, 
  debt: Debt, 
  paymentId: string
): Promise<Debt> {
  if (!supabase || !isSupabaseConfigured) {
    throw new Error('Supabase não configurado');
  }

  // 1. Delete payment row
  const { error: deleteError } = await supabase
    .from('payments')
    .delete()
    .eq('id', paymentId)
    .eq('user_id', userId);

  if (deleteError) throw deleteError;

  // 2. Calculate remaining payments
  const remainingPayments = debt.payments.filter(p => p.id !== paymentId);
  const totalPaid = getEffectivePaidAmount(remainingPayments);
  const newCurrentAmount = Math.max(0, Number((debt.originalAmount - totalPaid).toFixed(2)));

  let newStatus: 'pending' | 'partial' | 'paid' = 'pending';
  if (newCurrentAmount === 0 && debt.originalAmount > 0) {
    newStatus = 'paid';
  } else if (totalPaid > 0) {
    newStatus = 'partial';
  }

  // 3. Update debt row
  const { error: updateError } = await supabase
    .from('debts')
    .update({
      current_amount: newCurrentAmount,
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', debt.id)
    .eq('user_id', userId);

  if (updateError) throw updateError;

  return {
    ...debt,
    currentAmount: newCurrentAmount,
    status: newStatus,
    payments: remainingPayments,
  };
}

export interface SystemLiveStats {
  totalClients: number;
  totalDebts: number;
  totalRecoveredBrl: number;
  totalActiveStates: number;
  paidDebtsCount: number;
  successRate: number;
  systemUsersCount: number;
}

// Map Brazilian DDDs to State Codes to calculate real active states count
function getStatesCountFromPhones(phones: (string | undefined)[]): number {
  const dddToState: { [key: string]: string } = {
    '11': 'SP', '12': 'SP', '13': 'SP', '14': 'SP', '15': 'SP', '16': 'SP', '17': 'SP', '18': 'SP', '19': 'SP',
    '21': 'RJ', '22': 'RJ', '24': 'RJ',
    '27': 'ES', '28': 'ES',
    '31': 'MG', '32': 'MG', '33': 'MG', '34': 'MG', '35': 'MG', '37': 'MG', '38': 'MG',
    '41': 'PR', '42': 'PR', '43': 'PR', '44': 'PR', '45': 'PR', '46': 'PR',
    '47': 'SC', '48': 'SC', '49': 'SC',
    '51': 'RS', '53': 'RS', '54': 'RS', '55': 'RS',
    '61': 'DF',
    '62': 'GO', '64': 'GO',
    '63': 'TO',
    '65': 'MT', '66': 'MT',
    '67': 'MS',
    '68': 'AC',
    '69': 'RO',
    '71': 'BA', '73': 'BA', '74': 'BA', '75': 'BA', '77': 'BA',
    '79': 'SE',
    '81': 'PE', '87': 'PE',
    '82': 'AL',
    '83': 'PB',
    '84': 'RN',
    '85': 'CE', '88': 'CE',
    '86': 'PI', '89': 'PI',
    '91': 'PA', '93': 'PA', '94': 'PA',
    '92': 'AM', '97': 'AM',
    '95': 'RR',
    '96': 'AP',
    '98': 'MA', '99': 'MA',
  };

  const detectedStates = new Set<string>();
  for (const phone of phones) {
    if (!phone) continue;
    const digits = phone.replace(/\D/g, '');
    // Check first 2 digits if length >= 10 (standard Brazilian phone)
    if (digits.length >= 10) {
      const ddd = digits.substring(0, 2);
      if (dddToState[ddd]) {
        detectedStates.add(dddToState[ddd]);
      }
    }
  }

  return detectedStates.size > 0 ? detectedStates.size : (phones.filter(Boolean).length > 0 ? 1 : 0);
}

// Local storage reader helper for 100% real local data
export function getLocalStatsFromStorage(): SystemLiveStats {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return calculateStatsFromDebtsArray([]);
  }
  try {
    const allDebtsMap = new Map<string, Debt>();
    let foundAnyKey = false;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(STORAGE_KEYS.DEBTS_DB_PREFIX) || LEGACY_STORAGE_KEYS.DEBTS_DB_PREFIX.some(lk => key.startsWith(lk)))) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed: Debt[] = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              foundAnyKey = true;
              parsed.forEach(d => {
                if (d && d.id) {
                  allDebtsMap.set(d.id, d);
                }
              });
            }
          } catch (e) {}
        }
      }
    }

    if (foundAnyKey && allDebtsMap.size > 0) {
      return calculateStatsFromDebtsArray(Array.from(allDebtsMap.values()));
    }
  } catch (e) {
    console.warn('Erro ao ler localStorage para estatísticas ao vivo:', e);
  }

  return calculateStatsFromDebtsArray([]);
}

export function calculateStatsFromDebtsArray(debts: Debt[]): SystemLiveStats {
  const totalDebts = debts.length;

  if (totalDebts === 0) {
    return {
      totalClients: 0,
      totalDebts: 0,
      totalRecoveredBrl: 0,
      totalActiveStates: 0,
      paidDebtsCount: 0,
      successRate: 0,
      systemUsersCount: 1,
    };
  }

  const uniqueClients = new Set(debts.map(d => d.phone ? d.phone.trim() : d.name?.trim().toLowerCase()).filter(Boolean)).size;
  const paidDebtsCount = debts.filter(d => d.status === 'paid').length;
  
  const totalRecoveredBrl = debts.reduce((sum, d) => {
    const pmtSum = getEffectivePaidAmount(d.payments);
    return sum + pmtSum;
  }, 0);

  const phones = debts.map(d => d.phone);
  const totalActiveStates = getStatesCountFromPhones(phones);
  const successRate = totalDebts > 0 ? Math.round((paidDebtsCount / totalDebts) * 1000) / 10 : 0;

  return {
    totalClients: uniqueClients,
    totalDebts,
    totalRecoveredBrl,
    totalActiveStates,
    paidDebtsCount,
    successRate,
    systemUsersCount: 1,
  };
}

export async function fetchLiveSystemStats(): Promise<SystemLiveStats> {
  const localStats = getLocalStatsFromStorage();

  if (!supabase || !isSupabaseConfigured) {
    return localStats;
  }

  try {
    const [debtsRes, paymentsRes, profilesRes] = await Promise.all([
      supabase.from('debts').select('id, name, phone, status, original_amount, current_amount'),
      supabase.from('payments').select('amount'),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ]);

    interface DbDebtRow {
      phone?: string;
      name?: string;
      status?: string;
      original_amount?: number;
      current_amount?: number;
    }

    interface DbPaymentRow {
      amount?: number;
    }

    const debtsData: DbDebtRow[] = (debtsRes.data || []) as DbDebtRow[];
    const paymentsData: DbPaymentRow[] = (paymentsRes.data || []) as DbPaymentRow[];
    const systemUsersCount = (profilesRes && typeof profilesRes.count === 'number' && profilesRes.count > 0) ? profilesRes.count : 1;

    const totalDebts = debtsData.length;

    const uniqueClientsFromDebts = new Set(
      debtsData.map((d) => (d.phone ? d.phone.trim() : d.name?.trim().toLowerCase())).filter(Boolean)
    ).size;
    const totalClients = uniqueClientsFromDebts;

    const paidDebts = debtsData.filter((d) => d.status === 'paid');
    const paidDebtsCount = paidDebts.length;
    
    let totalRecoveredBrl = 0;
    if (paymentsData.length > 0) {
      totalRecoveredBrl = paymentsData.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    } else {
      totalRecoveredBrl = paidDebts.reduce((sum, d) => sum + (Number(d.original_amount) || Number(d.current_amount) || 0), 0);
    }

    const phones = debtsData.map((d) => d.phone);
    const totalActiveStates = getStatesCountFromPhones(phones);
    const successRate = totalDebts > 0 ? Math.round((paidDebtsCount / totalDebts) * 1000) / 10 : 0;

    const dbStats: SystemLiveStats = {
      totalClients,
      totalDebts,
      totalRecoveredBrl,
      totalActiveStates,
      paidDebtsCount,
      successRate,
      systemUsersCount,
    };

    // Combine DB metrics with local storage metrics to represent full real data
    return {
      totalClients: Math.max(dbStats.totalClients, localStats.totalClients),
      totalDebts: Math.max(dbStats.totalDebts, localStats.totalDebts),
      totalRecoveredBrl: Math.max(dbStats.totalRecoveredBrl, localStats.totalRecoveredBrl),
      totalActiveStates: Math.max(dbStats.totalActiveStates, localStats.totalActiveStates),
      paidDebtsCount: Math.max(dbStats.paidDebtsCount, localStats.paidDebtsCount),
      successRate: Math.max(dbStats.successRate, localStats.successRate),
      systemUsersCount: Math.max(dbStats.systemUsersCount || 1, localStats.systemUsersCount || 1),
    };
  } catch (err) {
    console.warn('Erro ao carregar estatísticas do Supabase, fallback para dados locais reais:', err);
    return localStats;
  }
}

