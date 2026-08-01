/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Debt } from '../types';
import { PeriodFilterType, DateBasisType, getPeriodDateRange, getTodayString } from '../utils/dateUtils';
import { calculateDebtCollectionTotals } from '../hooks/useDebtCalculations';

export interface ReportPaymentItem {
  id: string;
  date: string;
  amount: number;
  note?: string;
  debtorName: string;
  debtId: string;
}

export interface PieChartItem {
  name: string;
  value: number;
  color: string;
  count: number;
  percentage: string;
}

export interface ReportMetrics {
  filteredDebts: Debt[];
  periodPayments: ReportPaymentItem[];
  totalOriginal: number;
  totalRemaining: number;
  totalPaid: number;
  totalScheduled: number;
  totalOverdueAmount: number;
  totalCount: number;
  paidDebts: Debt[];
  partialDebts: Debt[];
  pendingDebts: Debt[];
  overdueDebts: Debt[];
  recoveryRate: string;
  topDebtors: Debt[];
  isUsingOverallTopDebtors: boolean;
  pieChartData: PieChartItem[];
  periodLabel: string;
}

export class ReportService {
  /**
   * Filters debts and payments according to date range and basis, computing executive metrics.
   */
  static calculateReportMetrics(
    debts: Debt[],
    periodFilter: PeriodFilterType,
    dateBasis: DateBasisType,
    customStart: string,
    customEnd: string
  ): ReportMetrics {
    const { startDate, endDate, label: periodLabel } = getPeriodDateRange(
      periodFilter,
      customStart,
      customEnd
    );

    // Filter debts according to basis and date window
    const filteredDebts = debts.filter((d) => {
      if (!startDate || !endDate) return true;

      if (dateBasis === 'dueDate') {
        const targetDate = (d.dueDate || d.createdAt || '').slice(0, 10);
        return targetDate >= startDate && targetDate <= endDate;
      }
      if (dateBasis === 'createdAt') {
        const targetDate = (d.createdAt || '').slice(0, 10);
        return targetDate >= startDate && targetDate <= endDate;
      }
      if (dateBasis === 'paymentDate') {
        const hasPaymentInPeriod = (d.payments || []).some((p) => {
          const pDate = (p.date || '').slice(0, 10);
          return pDate >= startDate && pDate <= endDate;
        });
        const dueInPeriod = d.dueDate
          ? d.dueDate.slice(0, 10) >= startDate && d.dueDate.slice(0, 10) <= endDate
          : false;
        return hasPaymentInPeriod || dueInPeriod;
      }
      return true;
    });

    // Payments inside the active period window
    const todayStr = getTodayString();
    const periodPayments: ReportPaymentItem[] = debts
      .flatMap((d) =>
        (d.payments || [])
          .filter((p) => {
            const pDate = (p.date || '').slice(0, 10);
            if (pDate > todayStr) return false;
            if (startDate && endDate) {
              return pDate >= startDate && pDate <= endDate;
            }
            return true;
          })
          .map((p) => ({
            id: p.id,
            date: p.date,
            amount: Number(p.amount) || 0,
            note: p.note,
            debtorName: d.name,
            debtId: d.id,
          }))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Single source of truth calculation on filtered subset
    const totals = calculateDebtCollectionTotals(filteredDebts);

    // Compute total paid in period vs overall
    let totalPaid = totals.totalPaid;
    if (periodFilter !== 'all') {
      const rawSum = periodPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      totalPaid = Math.round(rawSum * 100) / 100;
    }

    // Compute total scheduled
    let totalScheduled = totals.totalScheduled;
    if (periodFilter !== 'all') {
      const rawSum = filteredDebts.reduce((sum, d) => {
        const pSum = (d.payments || []).reduce((s, p) => {
          const pDate = (p.date || '').slice(0, 10);
          if (pDate > todayStr) {
            if (startDate && endDate) {
              return pDate >= startDate && pDate <= endDate ? s + (Number(p.amount) || 0) : s;
            }
            return s + (Number(p.amount) || 0);
          }
          return s;
        }, 0);
        return sum + pSum;
      }, 0);
      totalScheduled = Math.round(rawSum * 100) / 100;
    }

    const recoveryRate =
      totals.totalOriginal > 0
        ? ((totalPaid / totals.totalOriginal) * 100).toFixed(1)
        : '0';

    // Top 5 debtors with largest open balance in period (or overall fallback)
    const periodTopDebtors = [...filteredDebts]
      .filter((d) => d.currentAmount > 0)
      .sort((a, b) => b.currentAmount - a.currentAmount)
      .slice(0, 5);

    const overallTopDebtors = [...debts]
      .filter((d) => d.currentAmount > 0)
      .sort((a, b) => b.currentAmount - a.currentAmount)
      .slice(0, 5);

    const isUsingOverallTopDebtors = periodTopDebtors.length === 0 && overallTopDebtors.length > 0;
    const topDebtors = periodTopDebtors.length > 0 ? periodTopDebtors : overallTopDebtors;

    // Pie chart distribution
    const paidCount = totals.paidDebts.length;
    const partialCount = totals.partialDebts.length;
    const pendingCount = totals.pendingDebts.length;
    const totalCount = totals.totalCount;

    let pieChartData: PieChartItem[];
    if (totalCount === 0) {
      pieChartData = [{ name: 'Sem dados', value: 1, color: '#e2e8f0', count: 0, percentage: '0' }];
    } else {
      pieChartData = [
        {
          name: 'Quitados',
          value: paidCount,
          color: '#10b981',
          count: paidCount,
          percentage: totalCount > 0 ? ((paidCount / totalCount) * 100).toFixed(1) : '0',
        },
        {
          name: 'Pagamento Parcial',
          value: partialCount,
          color: '#f59e0b',
          count: partialCount,
          percentage: totalCount > 0 ? ((partialCount / totalCount) * 100).toFixed(1) : '0',
        },
        {
          name: 'Pendentes',
          value: pendingCount,
          color: '#f43f5e',
          count: pendingCount,
          percentage: totalCount > 0 ? ((pendingCount / totalCount) * 100).toFixed(1) : '0',
        },
      ].filter((item) => item.value > 0);
    }

    return {
      filteredDebts,
      periodPayments,
      totalOriginal: totals.totalOriginal,
      totalRemaining: totals.totalRemaining,
      totalPaid,
      totalScheduled,
      totalOverdueAmount: totals.totalOverdueAmount,
      totalCount: totals.totalCount,
      paidDebts: totals.paidDebts,
      partialDebts: totals.partialDebts,
      pendingDebts: totals.pendingDebts,
      overdueDebts: totals.overdueDebts,
      recoveryRate,
      topDebtors,
      isUsingOverallTopDebtors,
      pieChartData,
      periodLabel,
    };
  }
}
