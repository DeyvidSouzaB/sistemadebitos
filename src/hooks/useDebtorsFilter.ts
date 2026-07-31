/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Debt, DebtStatusFilter, DebtSortOption } from '../types';
import { getTodayString } from '../utils/dateUtils';

export type DueDatePreset = 'all' | 'overdue' | 'today' | 'this_week' | 'this_month' | 'custom';

export function useDebtorsFilter(
  debts: Debt[],
  sortedDebts: Debt[],
  search: string,
  statusFilter: DebtStatusFilter,
  sortOption: DebtSortOption
) {
  // View toggle ('grid' vs 'table')
  const [viewType, setViewType] = useState<'grid' | 'table'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'grid';
    }
    return 'table';
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setViewType('grid');
    }
  }, []);

  // Due date filter states
  const [dueDatePreset, setDueDatePreset] = useState<DueDatePreset>('all');
  const [dueDateStart, setDueDateStart] = useState<string>('');
  const [dueDateEnd, setDueDateEnd] = useState<string>('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const todayStr = getTodayString();

  // Reset page to 1 whenever search, statusFilter, sortOption, or due date filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortOption, dueDatePreset, dueDateStart, dueDateEnd]);

  // Date filtering logic
  const dateFilteredDebts = useMemo(() => {
    return sortedDebts.filter((d) => {
      if (dueDatePreset === 'all' && !dueDateStart && !dueDateEnd) return true;

      if (!d.dueDate) return false;
      const debtDueDateStr = d.dueDate.slice(0, 10);

      if (dueDatePreset === 'overdue') {
        return debtDueDateStr < todayStr && d.status !== 'paid';
      }
      if (dueDatePreset === 'today') {
        return debtDueDateStr === todayStr;
      }
      if (dueDatePreset === 'this_week') {
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().slice(0, 10);
        return debtDueDateStr >= todayStr && debtDueDateStr <= nextWeekStr;
      }
      if (dueDatePreset === 'this_month') {
        const now = new Date();
        const yearMonth = now.toISOString().slice(0, 7);
        return debtDueDateStr.startsWith(yearMonth);
      }
      if (dueDatePreset === 'custom' || dueDateStart || dueDateEnd) {
        if (dueDateStart && debtDueDateStr < dueDateStart) return false;
        if (dueDateEnd && debtDueDateStr > dueDateEnd) return false;
        return true;
      }

      return true;
    });
  }, [sortedDebts, dueDatePreset, dueDateStart, dueDateEnd, todayStr]);

  // Aggregated Key Metrics
  const metrics = useMemo(() => {
    const overdueDebts = debts.filter(
      (d) => d.dueDate && d.dueDate.slice(0, 10) < todayStr && d.status !== 'paid'
    );
    const totalOverdueAmount = overdueDebts.reduce((sum, d) => sum + d.currentAmount, 0);
    const totalOpenAmount = debts
      .filter((d) => d.status !== 'paid')
      .reduce((sum, d) => sum + d.currentAmount, 0);
    const activeDebtorsCount = new Set(
      debts.filter((d) => d.status !== 'paid').map((d) => d.name.trim().toLowerCase())
    ).size;

    return {
      totalOverdueAmount,
      overdueCount: overdueDebts.length,
      totalOpenAmount,
      activeDebtorsCount,
    };
  }, [debts, todayStr]);

  // Pagination calculations
  const totalItems = dateFilteredDebts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const activePage = Math.min(currentPage, totalPages);

  const paginatedDebts = useMemo(() => {
    return dateFilteredDebts.slice((activePage - 1) * pageSize, activePage * pageSize);
  }, [dateFilteredDebts, activePage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Tab counts
  const totalCount = debts.length;
  const overdueCount = debts.filter(
    (d) => d.dueDate && d.dueDate.slice(0, 10) < todayStr && d.status !== 'paid'
  ).length;
  const pendingCount = debts.filter((d) => d.status === 'pending').length;
  const partialCount = debts.filter((d) => d.status === 'partial').length;
  const paidCount = debts.filter((d) => d.status === 'paid').length;

  return {
    viewType,
    setViewType,
    dueDatePreset,
    setDueDatePreset,
    dueDateStart,
    setDueDateStart,
    dueDateEnd,
    setDueDateEnd,
    currentPage: activePage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    paginatedDebts,
    dateFilteredDebts,
    handlePageChange,
    metrics,
    counts: {
      totalCount,
      overdueCount,
      pendingCount,
      partialCount,
      paidCount,
    },
    todayStr,
  };
}
