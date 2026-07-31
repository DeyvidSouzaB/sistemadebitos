import { useMemo } from 'react';
import { Debt } from '../types';
import { formatDate, isFutureDate, getEffectivePaidAmount, getScheduledPaidAmount, getTodayString } from '../utils/dateUtils';
import { formatPhone, getWhatsappUrl, buildWhatsappMessage } from '../utils/phoneUtils';

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val);
}

export function calculateSingleDebt(debt: Debt) {
  const totalPaid = getEffectivePaidAmount(debt.payments);
  const scheduledPaid = getScheduledPaidAmount(debt.payments);
  const scheduledPayments = (debt.payments || []).filter((p) => isFutureDate(p.date));
  const paymentPercentage = debt.originalAmount > 0 ? (totalPaid / debt.originalAmount) * 100 : 0;

  const todayStr = getTodayString();
  const isOverdue = Boolean(
    debt.dueDate && 
    debt.status !== 'paid' && 
    debt.dueDate.slice(0, 10) < todayStr
  );

  let initials = '??';
  if (debt.name) {
    const parts = debt.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts[0]) {
      initials = parts[0].substring(0, 2).toUpperCase();
    }
  }

  const rawMsgText = buildWhatsappMessage(debt);
  const whatsappUrl = getWhatsappUrl(debt.phone, rawMsgText);

  let statusColorConfig = {
    leftBar: 'bg-emerald-500',
    avatar: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  if (isOverdue) {
    statusColorConfig = {
      leftBar: 'bg-red-500',
      avatar: 'bg-red-50 text-red-600 border-red-100',
      badge: 'bg-red-50 text-red-700 border-red-200',
    };
  } else if (debt.status === 'paid') {
    statusColorConfig = {
      leftBar: 'bg-slate-400',
      avatar: 'bg-slate-100 text-slate-600 border-slate-200',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    };
  } else if (debt.status === 'partial') {
    statusColorConfig = {
      leftBar: 'bg-amber-500',
      avatar: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: 'bg-amber-50 text-amber-700 border-amber-100',
    };
  }

  return {
    totalPaid,
    scheduledPaid,
    scheduledPayments,
    paymentPercentage,
    isOverdue,
    initials,
    whatsappUrl,
    statusColorConfig,
    formatCurrency,
    formatDate,
    formatPhone,
  };
}

export function useDebtCalculations(debt: Debt) {
  return useMemo(() => calculateSingleDebt(debt), [debt]);
}

export function calculateDebtCollectionTotals(debts: Debt[]) {
  const todayStr = getTodayString();

  let totalOriginal = 0;
  let totalRemaining = 0;
  let totalPaid = 0;
  let totalScheduled = 0;
  let totalOverdueAmount = 0;

  const paidDebts: Debt[] = [];
  const partialDebts: Debt[] = [];
  const pendingDebts: Debt[] = [];
  const overdueDebts: Debt[] = [];

  debts.forEach((d) => {
    const origAmount = Number(d.originalAmount) || 0;
    const currAmount = Number(d.currentAmount) || 0;
    const effPaid = getEffectivePaidAmount(d.payments);
    const schedPaid = getScheduledPaidAmount(d.payments);

    totalOriginal += origAmount;
    totalRemaining += currAmount;
    totalPaid += effPaid;
    totalScheduled += schedPaid;

    const isPaid = d.status === 'paid' || currAmount <= 0;

    if (isPaid) {
      paidDebts.push(d);
    } else if (effPaid > 0 || d.status === 'partial') {
      partialDebts.push(d);
    } else {
      pendingDebts.push(d);
    }

    if (!isPaid && d.dueDate && d.dueDate.slice(0, 10) < todayStr) {
      overdueDebts.push(d);
      totalOverdueAmount += currAmount;
    }
  });

  // Round all totals to 2 decimal places to prevent floating point inaccuracies
  totalOriginal = Math.round(totalOriginal * 100) / 100;
  totalRemaining = Math.round(totalRemaining * 100) / 100;
  totalPaid = Math.round(totalPaid * 100) / 100;
  totalScheduled = Math.round(totalScheduled * 100) / 100;
  totalOverdueAmount = Math.round(totalOverdueAmount * 100) / 100;

  const recoveryRate = totalOriginal > 0 ? ((totalPaid / totalOriginal) * 100).toFixed(1) : '0';

  return {
    totalOriginal,
    totalRemaining,
    totalPaid,
    totalScheduled,
    totalOverdueAmount,
    totalCount: debts.length,
    paidDebts,
    partialDebts,
    pendingDebts,
    overdueDebts,
    recoveryRate,
    formatCurrency,
  };
}

export function useDebtCollectionCalculations(debts: Debt[]) {
  return useMemo(() => calculateDebtCollectionTotals(debts), [debts]);
}

