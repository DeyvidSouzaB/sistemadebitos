import { describe, it, expect } from 'vitest';
import { calculateDashboardMetrics } from '../hooks/useDashboardMetrics';
import { Debt } from '../types';
import { getTodayString } from '../utils/dateUtils';

describe('useDashboardMetrics (calculateDashboardMetrics)', () => {
  const todayStr = getTodayString();
  const currentMonthPrefix = todayStr.slice(0, 7);

  const mockDebts: Debt[] = [
    {
      id: 'd1',
      name: 'Cliente A',
      originalAmount: 1000,
      currentAmount: 500,
      createdAt: `${currentMonthPrefix}-01`,
      dueDate: `${currentMonthPrefix}-15`,
      status: 'partial',
      payments: [
        { id: 'p1', date: `${currentMonthPrefix}-01`, amount: 500 },
      ],
    },
    {
      id: 'd2',
      name: 'Cliente B',
      originalAmount: 800,
      currentAmount: 800,
      createdAt: '2025-01-01',
      dueDate: '2025-02-01', // Overdue
      status: 'pending',
      payments: [],
    },
    {
      id: 'd3',
      name: 'Cliente A', // Duplicate active debtor name
      originalAmount: 300,
      currentAmount: 300,
      createdAt: `${currentMonthPrefix}-02`,
      dueDate: `${currentMonthPrefix}-20`,
      status: 'pending',
      payments: [],
    },
    {
      id: 'd4',
      name: 'Cliente C',
      originalAmount: 400,
      currentAmount: 0,
      createdAt: '2025-01-01',
      dueDate: '2025-01-10',
      status: 'paid',
      payments: [
        { id: 'p2', date: '2025-01-05', amount: 400 },
      ],
    },
  ];

  it('deve calcular corretamente o valor total restante a receber (totalRemaining)', () => {
    const metrics = calculateDashboardMetrics(mockDebts, todayStr);
    // d1 (500) + d2 (800) + d3 (300) = 1600
    expect(metrics.totalRemaining).toBe(1600);
  });

  it('deve calcular o total recebido no mês atual (totalReceivedThisMonth)', () => {
    const metrics = calculateDashboardMetrics(mockDebts, todayStr);
    // p1 (500) do d1 está no mês atual
    expect(metrics.totalReceivedThisMonth).toBe(500);
  });

  it('deve identificar cobranças em atraso e o valor total em atraso (overdueDebts)', () => {
    const metrics = calculateDashboardMetrics(mockDebts, todayStr);
    // d2 venceu em 2025-02-01 (atrasado)
    expect(metrics.overdueDebts.length).toBe(1);
    expect(metrics.overdueDebts[0].id).toBe('d2');
    expect(metrics.totalOverdueAmount).toBe(800);
  });

  it('deve contar devedores ativos únicos (activeClientsCount)', () => {
    const metrics = calculateDashboardMetrics(mockDebts, todayStr);
    // Cliente A e Cliente B têm débitos ativos (Cliente A aparece 2x, mas é 1 cliente único)
    expect(metrics.activeClientsCount).toBe(2);
  });
});
