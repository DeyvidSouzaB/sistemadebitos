import { describe, it, expect } from 'vitest';
import {
  formatDate,
  getTodayString,
  toSafeISOString,
  isFutureDate,
  getEffectivePaidAmount,
  getScheduledPaidAmount,
  getPeriodDateRange,
} from '../utils/dateUtils';

describe('dateUtils - Manipulação Segura de Datas e Pagamentos', () => {
  it('formatDate deve formatar datas YYYY-MM-DD corretamente para DD/MM/YYYY sem deslocamento de fuso horário', () => {
    expect(formatDate('2026-05-15')).toBe('15/05/2026');
    expect(formatDate('2026-12-31')).toBe('31/12/2026');
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });

  it('getTodayString deve retornar data no formato YYYY-MM-DD', () => {
    const today = getTodayString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('toSafeISOString deve anexar T12:00:00.000Z para evitar regressão de fuso horário', () => {
    expect(toSafeISOString('2026-06-20')).toBe('2026-06-20T12:00:00.000Z');
  });

  it('isFutureDate deve diferenciar datas futuras de datas passadas/atuais', () => {
    const today = getTodayString();
    const pastDate = '2020-01-01';
    const futureDate = '2099-12-31';

    expect(isFutureDate(pastDate)).toBe(false);
    expect(isFutureDate(today)).toBe(false);
    expect(isFutureDate(futureDate)).toBe(true);
    expect(isFutureDate(null)).toBe(false);
  });

  it('getEffectivePaidAmount deve somar apenas pagamentos até a data atual', () => {
    const today = getTodayString();
    const payments = [
      { date: '2026-01-01', amount: 100 },
      { date: today, amount: 50 },
      { date: '2099-12-31', amount: 200 }, // Futuro
    ];

    expect(getEffectivePaidAmount(payments)).toBe(150);
  });

  it('getScheduledPaidAmount deve somar apenas pagamentos agendados no futuro', () => {
    const today = getTodayString();
    const payments = [
      { date: '2026-01-01', amount: 100 },
      { date: today, amount: 50 },
      { date: '2099-12-31', amount: 200 }, // Futuro
    ];

    expect(getScheduledPaidAmount(payments)).toBe(200);
  });

  it('getPeriodDateRange deve retornar intervalos de datas corretos', () => {
    const allRange = getPeriodDateRange('all');
    expect(allRange.startDate).toBeNull();
    expect(allRange.endDate).toBeNull();

    const thisMonthRange = getPeriodDateRange('this_month');
    expect(thisMonthRange.startDate).toMatch(/^\d{4}-\d{2}-01$/);

    const customRange = getPeriodDateRange('custom', '2026-01-01', '2026-06-30');
    expect(customRange.startDate).toBe('2026-01-01');
    expect(customRange.endDate).toBe('2026-06-30');
  });
});
