import { describe, it, expect } from 'vitest';
import { Debt } from '../types';
import { calculateSingleDebt, calculateDebtCollectionTotals } from '../hooks/useDebtCalculations';

describe('useDebtCalculations & calculateDebtCollectionTotals', () => {
  const mockDebts: Debt[] = [
    {
      id: 'debt_1',
      name: 'Cliente Um',
      originalAmount: 1000,
      currentAmount: 400,
      createdAt: '2026-01-01',
      dueDate: '2099-01-15', // Futuro
      status: 'partial',
      payments: [
        { id: 'p1', date: '2026-01-10', amount: 600 },
        { id: 'p2', date: '2099-12-31', amount: 200 }, // Futuro agendado
      ],
    },
    {
      id: 'debt_2',
      name: 'Cliente Dois',
      originalAmount: 500,
      currentAmount: 0,
      createdAt: '2026-01-01',
      dueDate: '2026-02-01',
      status: 'paid',
      payments: [
        { id: 'p3', date: '2026-01-20', amount: 500 },
      ],
    },
    {
      id: 'debt_3',
      name: 'Cliente Três',
      originalAmount: 300,
      currentAmount: 300,
      createdAt: '2026-01-01',
      dueDate: '2020-01-01', // Em atraso
      status: 'pending',
      payments: [],
    },
  ];

  it('deve calcular métricas de uma cobrança individual ignorando pagamentos futuros no totalPaid', () => {
    const single = calculateSingleDebt(mockDebts[0]);
    expect(single.totalPaid).toBe(600);
    expect(single.scheduledPaid).toBe(200);
    expect(single.paymentPercentage).toBe(60);
  });

  it('deve consolidar totais da coleção de cobranças usando a mesma fonte de verdade', () => {
    const totals = calculateDebtCollectionTotals(mockDebts);

    expect(totals.totalOriginal).toBe(1800);
    expect(totals.totalRemaining).toBe(700);
    expect(totals.totalPaid).toBe(1100); // 600 + 500
    expect(totals.totalScheduled).toBe(200);
    expect(totals.paidDebts.length).toBe(1);
    expect(totals.partialDebts.length).toBe(1);
    expect(totals.pendingDebts.length).toBe(1);
    expect(totals.overdueDebts.length).toBe(1);
    expect(totals.totalOverdueAmount).toBe(300);
    expect(totals.recoveryRate).toBe('61.1'); // (1100 / 1800) * 100
  });
});
