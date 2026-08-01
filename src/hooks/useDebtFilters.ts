import { useState, useMemo } from 'react';
import { Debt, DebtStatusFilter, DebtSortOption } from '../types';

export function filterDebts(debts: Debt[], search: string, statusFilter: DebtStatusFilter): Debt[] {
  const term = search.toLowerCase().trim();
  return debts.filter((d) => {
    const matchesSearch =
      !term ||
      d.name.toLowerCase().includes(term) ||
      (d.description && d.description.toLowerCase().includes(term));

    let matchesStatus = true;
    if (statusFilter === 'pending') matchesStatus = d.status === 'pending';
    if (statusFilter === 'partial') matchesStatus = d.status === 'partial';
    if (statusFilter === 'paid') matchesStatus = d.status === 'paid';

    return matchesSearch && matchesStatus;
  });
}

export function sortDebts(debts: Debt[], sortOption: DebtSortOption): Debt[] {
  return [...debts].sort((a, b) => {
    if (sortOption === 'createdAt_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortOption === 'createdAt_asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortOption === 'dueDate_asc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sortOption === 'dueDate_desc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    if (sortOption === 'name_asc') return a.name.localeCompare(b.name);
    if (sortOption === 'name_desc') return b.name.localeCompare(a.name);
    if (sortOption === 'amount_desc') return b.currentAmount - a.currentAmount;
    if (sortOption === 'amount_asc') return a.currentAmount - b.currentAmount;
    return 0;
  });
}

export function useDebtFilters(debts: Debt[]) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<DebtStatusFilter>('all');
  const [sortOption, setSortOption] = useState<DebtSortOption>('createdAt_desc');

  const filteredDebts = useMemo(() => {
    return filterDebts(debts, search, statusFilter);
  }, [debts, search, statusFilter]);

  const sortedDebts = useMemo(() => {
    return sortDebts(filteredDebts, sortOption);
  }, [filteredDebts, sortOption]);

  return {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    filteredDebts,
    sortedDebts,
  };
}
