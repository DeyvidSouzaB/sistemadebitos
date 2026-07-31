/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Debt, DebtStatusFilter, DebtSortOption } from '../types';
import { DebtorService, DebtorMetrics } from '../services/debtorService';

export function useDebtors(debts: Debt[]) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DebtStatusFilter>('all');
  const [sortOption, setSortOption] = useState<DebtSortOption>('createdAt_desc');

  // Filtered & Sorted debts using DebtorService
  const filteredDebts = useMemo(() => {
    return DebtorService.filterDebts(debts, search, statusFilter);
  }, [debts, search, statusFilter]);

  const sortedDebts = useMemo(() => {
    return DebtorService.sortDebts(filteredDebts, sortOption);
  }, [filteredDebts, sortOption]);

  const metrics: DebtorMetrics = useMemo(() => {
    return DebtorService.calculateMetrics(debts);
  }, [debts]);

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    filteredDebts,
    sortedDebts,
    metrics,
  };
}
