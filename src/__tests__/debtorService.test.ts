import { describe, it, expect } from 'vitest';
import { DebtorService } from '../services/debtorService';
import { Debt } from '../types';
import { getTodayString } from '../utils/dateUtils';

describe('DebtorService', () => {
  const todayStr = getTodayString();

  const mockDebts: Debt[] = [
    {
      id: 'd1',
      name: 'João Silva',
      originalAmount: 1000,
      currentAmount: 500,
      createdAt: '2026-01-01',
      dueDate: '2026-01-15',
      status: 'partial',
      payments: [{ id: 'p1', date: '2026-01-10', amount: 500 }],
    },
    {
      id: 'd2',
      name: 'Maria Oliveira',
      originalAmount: 600,
      currentAmount: 600,
      createdAt: '2025-01-01',
      dueDate: '2025-02-01', // Overdue
      status: 'pending',
      payments: [],
    },
    {
      id: 'd3',
      name: 'Carlos Pereira',
      originalAmount: 400,
      currentAmount: 0,
      createdAt: '2026-01-01',
      dueDate: '2026-01-10',
      status: 'paid',
      payments: [{ id: 'p2', date: '2026-01-05', amount: 400 }],
    },
  ];

  it('deve filtrar cobranças por status (paid, pending, partial)', () => {
    const paid = DebtorService.filterDebts(mockDebts, '', 'paid');
    expect(paid.length).toBe(1);
    expect(paid[0].id).toBe('d3');
  });

  it('deve filtrar cobranças por nome do devedor', () => {
    const filtered = DebtorService.filterDebts(mockDebts, 'Maria', 'all');
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Maria Oliveira');
  });

  it('deve calcular métricas consolidadas através do DebtorService.calculateMetrics', () => {
    const metrics = DebtorService.calculateMetrics(mockDebts);

    expect(metrics.totalOriginal).toBe(2000); // 1000 + 600 + 400
    expect(metrics.totalRemaining).toBe(1100); // 500 + 600
    expect(metrics.totalPaid).toBe(900); // 500 + 400
    expect(metrics.totalCount).toBe(3);
    expect(metrics.activeDebtorsCount).toBe(2);
  });
});
