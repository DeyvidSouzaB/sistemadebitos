import { useMemo } from 'react';
import { Debt } from '../types';
import { getTodayString } from '../utils/dateUtils';

export interface MonthlyChartItem {
  monthKey: string;
  label: string;
  received: number;
  pending: number;
}

export function calculateDashboardMetrics(debts: Debt[], customTodayStr?: string) {
  const todayStr = customTodayStr || getTodayString();

  const totalRemaining = debts
    .filter((d) => d.status !== 'paid')
    .reduce((sum, d) => sum + d.currentAmount, 0);

  const currentMonthPrefix = todayStr.slice(0, 7);

  let totalReceivedThisMonth = 0;
  debts.forEach((debt) => {
    debt.payments.forEach((payment) => {
      const pDateStr = (payment.date || '').slice(0, 10);
      if (pDateStr && pDateStr.startsWith(currentMonthPrefix) && pDateStr <= todayStr) {
        totalReceivedThisMonth += payment.amount;
      }
    });
  });

  const overdueDebts = debts.filter(
    (d) => d.dueDate && d.dueDate.slice(0, 10) < todayStr && d.status !== 'paid' && d.currentAmount > 0
  );

  const totalOverdueAmount = overdueDebts.reduce((sum, d) => sum + d.currentAmount, 0);

  const activeNames = debts
    .filter((d) => d.status !== 'paid')
    .map((d) => d.name.trim().toLowerCase());
  const activeClientsCount = new Set(activeNames).size;

  const pendingDebts = debts.filter((d) => d.status !== 'paid');
  const upcomingDebts = [...pendingDebts]
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    })
    .slice(0, 5);

  const monthlyChartData: MonthlyChartItem[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yearStr = d.getFullYear();
    const monthNum = String(d.getMonth() + 1).padStart(2, '0');
    const monthKey = `${yearStr}-${monthNum}`;
    const label = d.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');

    let receivedSum = 0;
    let pendingSum = 0;

    debts.forEach((debt) => {
      debt.payments.forEach((p) => {
        const pDateStr = (p.date || '').slice(0, 10);
        if (pDateStr && pDateStr.startsWith(monthKey) && pDateStr <= todayStr) {
          receivedSum += p.amount;
        }
      });

      if (debt.dueDate && debt.dueDate.startsWith(monthKey) && debt.status !== 'paid') {
        pendingSum += debt.currentAmount;
      }
    });

    monthlyChartData.push({
      monthKey,
      label,
      received: receivedSum,
      pending: pendingSum,
    });
  }

  const maxChartValue = Math.max(
    ...monthlyChartData.map((item) => Math.max(item.received, item.pending)),
    100
  );

  const getStatusInfo = (debt: Debt) => {
    const isOverdue = debt.dueDate && debt.dueDate.slice(0, 10) < todayStr && debt.currentAmount > 0;
    const isToday = debt.dueDate && debt.dueDate.slice(0, 10) === todayStr && debt.currentAmount > 0;

    if (isOverdue) {
      return {
        label: 'Atrasado',
        colorClass: 'bg-rose-100 text-rose-700 border-rose-200',
        dotClass: 'bg-rose-500',
      };
    }
    if (isToday) {
      return {
        label: 'Vence Hoje',
        colorClass: 'bg-amber-100 text-amber-800 border-amber-200',
        dotClass: 'bg-amber-500',
      };
    }
    return {
      label: 'Em dia',
      colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      dotClass: 'bg-emerald-500',
    };
  };

  return {
    totalRemaining,
    totalReceivedThisMonth,
    overdueDebts,
    totalOverdueAmount,
    activeClientsCount,
    upcomingDebts,
    monthlyChartData,
    maxChartValue,
    getStatusInfo,
  };
}

export function useDashboardMetrics(debts: Debt[]) {
  return useMemo(() => calculateDashboardMetrics(debts), [debts]);
}
