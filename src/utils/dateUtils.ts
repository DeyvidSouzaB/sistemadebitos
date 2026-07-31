/**
 * Utility functions for date formatting and safe date string handling.
 * Prevents timezone offset shifts (e.g. UTC midnight rolling back 1 day in local time).
 */

export const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return '';

  // Extract YYYY-MM-DD pattern directly from string if available
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('pt-BR');
};

/**
 * Returns today's local date as a YYYY-MM-DD string
 */
export const getTodayString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Converts a YYYY-MM-DD date string to a safe midday ISO string (12:00:00Z)
 * to avoid timezone shifts when parsed in any local timezone.
 */
export const toSafeISOString = (dateStr: string): string => {
  if (!dateStr) return new Date().toISOString();
  if (dateStr.includes('T')) return dateStr;
  return `${dateStr}T12:00:00.000Z`;
};

/**
 * Checks if a given YYYY-MM-DD or ISO date string is in the future (strictly > today)
 */
export const isFutureDate = (dateStr?: string | null): boolean => {
  if (!dateStr) return false;
  const targetDateStr = dateStr.slice(0, 10);
  const todayStr = getTodayString();
  return targetDateStr > todayStr;
};

/**
 * Computes effective (already paid on or before today) payment sum safely
 */
export const getEffectivePaidAmount = (payments?: { date?: string; amount?: number | string }[]): number => {
  if (!Array.isArray(payments)) return 0;
  const todayStr = getTodayString();
  const rawSum = payments.reduce((sum, p) => {
    if (!p) return sum;
    const amount = Number(p.amount);
    if (isNaN(amount) || amount <= 0) return sum;
    const pDateStr = (p.date || '').slice(0, 10);
    return pDateStr <= todayStr ? sum + amount : sum;
  }, 0);
  return Number(rawSum.toFixed(2));
};

/**
 * Computes scheduled (future date > today) payment sum safely
 */
export const getScheduledPaidAmount = (payments?: { date?: string; amount?: number | string }[]): number => {
  if (!Array.isArray(payments)) return 0;
  const todayStr = getTodayString();
  const rawSum = payments.reduce((sum, p) => {
    if (!p) return sum;
    const amount = Number(p.amount);
    if (isNaN(amount) || amount <= 0) return sum;
    const pDateStr = (p.date || '').slice(0, 10);
    return pDateStr > todayStr ? sum + amount : sum;
  }, 0);
  return Number(rawSum.toFixed(2));
};

export type PeriodFilterType = 'all' | 'this_month' | 'last_month' | 'this_quarter' | 'this_year' | 'custom';
export type DateBasisType = 'dueDate' | 'createdAt' | 'paymentDate';

export const getPeriodDateRange = (
  period: PeriodFilterType, 
  customStart?: string, 
  customEnd?: string
): { startDate: string | null; endDate: string | null; label: string } => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  const pad = (n: number) => String(n).padStart(2, '0');

  if (period === 'all') {
    return { startDate: null, endDate: null, label: 'Todo o Histórico' };
  }

  if (period === 'this_month') {
    const start = `${year}-${pad(month + 1)}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const end = `${year}-${pad(month + 1)}-${pad(lastDay)}`;
    const monthName = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return { startDate: start, endDate: end, label: capitalizedMonth };
  }

  if (period === 'last_month') {
    const prevMonthDate = new Date(year, month - 1, 1);
    const pYear = prevMonthDate.getFullYear();
    const pMonth = prevMonthDate.getMonth();
    const start = `${pYear}-${pad(pMonth + 1)}-01`;
    const lastDay = new Date(pYear, pMonth + 1, 0).getDate();
    const end = `${pYear}-${pad(pMonth + 1)}-${pad(lastDay)}`;
    const monthName = prevMonthDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    return { startDate: start, endDate: end, label: capitalizedMonth };
  }

  if (period === 'this_quarter') {
    const qIndex = Math.floor(month / 3);
    const qStartMonth = qIndex * 3;
    const qEndMonth = qStartMonth + 2;
    const start = `${year}-${pad(qStartMonth + 1)}-01`;
    const lastDay = new Date(year, qEndMonth + 1, 0).getDate();
    const end = `${year}-${pad(qEndMonth + 1)}-${pad(lastDay)}`;
    return { startDate: start, endDate: end, label: `${qIndex + 1}º Trimestre de ${year}` };
  }

  if (period === 'this_year') {
    const start = `${year}-01-01`;
    const end = `${year}-12-31`;
    return { startDate: start, endDate: end, label: `Ano de ${year}` };
  }

  if (period === 'custom') {
    const start = customStart || `${year}-01-01`;
    const end = customEnd || getTodayString();
    return { 
      startDate: start, 
      endDate: end, 
      label: `Personalizado (${formatDate(start)} a ${formatDate(end)})` 
    };
  }

  return { startDate: null, endDate: null, label: 'Todo o Histórico' };
};

