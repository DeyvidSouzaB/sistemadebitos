/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Debt, PaymentHistory, DebtStatusFilter, DebtSortOption } from '../types';
import { getTodayString, getEffectivePaidAmount } from '../utils/dateUtils';
import { 
  fetchUserDebtsFromDb, 
  createDebtInDb, 
  updateDebtInDb, 
  deleteDebtFromDb, 
  addPaymentToDb, 
  deletePaymentFromDb 
} from '../lib/supabaseService';
import { User } from '../hooks/useAuth';

export interface DebtorMetrics {
  totalOriginal: number;
  totalRemaining: number;
  totalPaid: number;
  totalOverdueAmount: number;
  overdueCount: number;
  activeDebtorsCount: number;
  totalCount: number;
}

export class DebtorService {
  /**
   * Fetches user debts from DB if authenticated with UUID, or falls back to storage.
   */
  static async fetchDebts(user: User | null): Promise<Debt[]> {
    if (user && user.id) {
      try {
        return await fetchUserDebtsFromDb(user.id);
      } catch (err) {
        console.warn('debtorService: Fallback to local cache due to DB error', err);
      }
    }
    return [];
  }

  /**
   * Filter debts by status, due date presets, custom dates, and search text
   */
  static filterDebts(
    debts: Debt[],
    search: string,
    statusFilter: DebtStatusFilter,
    dueDatePreset?: string,
    dueDateStart?: string,
    dueDateEnd?: string
  ): Debt[] {
    const todayStr = getTodayString();
    const cleanSearch = search.trim().toLowerCase();

    return debts.filter((debt) => {
      // 1. Status Filter
      const isOverdue = debt.dueDate && debt.dueDate.slice(0, 10) < todayStr && debt.currentAmount > 0;
      if (statusFilter === 'pending' && debt.status === 'paid') return false;
      if (statusFilter === 'pending' && debt.status !== 'pending' && !isOverdue) return false;
      if (statusFilter === 'partial' && debt.status !== 'partial') return false;
      if (statusFilter === 'paid' && debt.status !== 'paid') return false;

      // 2. Search Text
      if (cleanSearch) {
        const nameMatch = debt.name.toLowerCase().includes(cleanSearch);
        const phoneMatch = debt.phone ? debt.phone.includes(cleanSearch) : false;
        const descMatch = debt.description ? debt.description.toLowerCase().includes(cleanSearch) : false;
        if (!nameMatch && !phoneMatch && !descMatch) return false;
      }

      // 3. Due Date Presets
      if (dueDatePreset && dueDatePreset !== 'all') {
        if (!debt.dueDate) return false;
        const debtDueDateStr = debt.dueDate.slice(0, 10);

        if (dueDatePreset === 'overdue' && (!isOverdue || debt.status === 'paid')) return false;
        if (dueDatePreset === 'today' && debtDueDateStr !== todayStr) return false;
        if (dueDatePreset === 'this_week') {
          const today = new Date();
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);
          const nextWeekStr = nextWeek.toISOString().slice(0, 10);
          if (debtDueDateStr < todayStr || debtDueDateStr > nextWeekStr) return false;
        }
        if (dueDatePreset === 'this_month') {
          const yearMonth = new Date().toISOString().slice(0, 7);
          if (!debtDueDateStr.startsWith(yearMonth)) return false;
        }
        if (dueDatePreset === 'custom') {
          if (dueDateStart && debtDueDateStr < dueDateStart) return false;
          if (dueDateEnd && debtDueDateStr > dueDateEnd) return false;
        }
      }

      return true;
    });
  }

  /**
   * Sort debts based on selected DebtSortOption
   */
  static sortDebts(debts: Debt[], sortOption: DebtSortOption): Debt[] {
    const sorted = [...debts];

    switch (sortOption) {
      case 'amount_desc':
        return sorted.sort((a, b) => b.currentAmount - a.currentAmount);
      case 'amount_asc':
        return sorted.sort((a, b) => a.currentAmount - b.currentAmount);
      case 'dueDate_asc':
        return sorted.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        });
      case 'dueDate_desc':
        return sorted.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return b.dueDate.localeCompare(a.dueDate);
        });
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'createdAt_desc':
      default:
        return sorted.sort((a, b) => {
          const dateA = a.createdAt || '';
          const dateB = b.createdAt || '';
          return dateB.localeCompare(dateA);
        });
    }
  }

  /**
   * Calculate summary metrics for a list of debts
   */
  static calculateMetrics(debts: Debt[]): DebtorMetrics {
    const todayStr = getTodayString();

    let totalOriginal = 0;
    let totalRemaining = 0;
    let totalPaid = 0;
    let totalOverdueAmount = 0;
    let overdueCount = 0;
    const activeNames = new Set<string>();

    debts.forEach((debt) => {
      totalOriginal += debt.originalAmount || 0;
      totalRemaining += debt.currentAmount || 0;

      const paidForDebt = getEffectivePaidAmount(debt.payments);
      totalPaid += paidForDebt;

      const isOverdue = debt.dueDate && debt.dueDate.slice(0, 10) < todayStr && debt.currentAmount > 0;
      if (isOverdue) {
        totalOverdueAmount += debt.currentAmount;
        overdueCount += 1;
      }

      if (debt.status !== 'paid') {
        activeNames.add(debt.name.trim().toLowerCase());
      }
    });

    return {
      totalOriginal,
      totalRemaining,
      totalPaid,
      totalOverdueAmount,
      overdueCount,
      activeDebtorsCount: activeNames.size,
      totalCount: debts.length,
    };
  }
}
