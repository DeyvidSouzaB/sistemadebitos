import { describe, it, expect } from 'vitest';
import { Debt } from '../types';
import { getEffectivePaidAmount, getScheduledPaidAmount, getTodayString } from '../utils/dateUtils';

describe('Cálculos Financeiros e Status de Cobrança', () => {
  const mockDebt: Debt = {
    id: 'debt_1',
    name: 'João Silva',
    originalAmount: 500,
    currentAmount: 500,
    createdAt: '2026-01-01',
    dueDate: '2026-02-01',
    status: 'pending',
    payments: [],
  };

  it('deve calcular status como "pending" quando não há pagamentos efetuados', () => {
    const totalPaid = getEffectivePaidAmount(mockDebt.payments);
    const currentAmount = Math.max(0, mockDebt.originalAmount - totalPaid);
    const status = currentAmount <= 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'pending';

    expect(totalPaid).toBe(0);
    expect(currentAmount).toBe(500);
    expect(status).toBe('pending');
  });

  it('deve calcular status como "partial" quando há pagamento parcial efetivado', () => {
    const payments = [
      { id: 'p1', date: '2026-01-10', amount: 200, note: 'Entrada' },
    ];
    const totalPaid = getEffectivePaidAmount(payments);
    const currentAmount = Math.max(0, mockDebt.originalAmount - totalPaid);
    const status = currentAmount <= 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'pending';

    expect(totalPaid).toBe(200);
    expect(currentAmount).toBe(300);
    expect(status).toBe('partial');
  });

  it('deve calcular status como "paid" quando o total pago atinge ou supera o valor original', () => {
    const payments = [
      { id: 'p1', date: '2026-01-10', amount: 300, note: '1ª parcela' },
      { id: 'p2', date: '2026-01-20', amount: 200, note: '2ª parcela' },
    ];
    const totalPaid = getEffectivePaidAmount(payments);
    const currentAmount = Math.max(0, mockDebt.originalAmount - totalPaid);
    const status = currentAmount <= 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'pending';

    expect(totalPaid).toBe(500);
    expect(currentAmount).toBe(0);
    expect(status).toBe('paid');
  });

  it('não deve considerar pagamentos agendados para o futuro no cálculo do valor pago efetivo', () => {
    const today = getTodayString();
    const payments = [
      { id: 'p1', date: '2026-01-10', amount: 100 }, // Efetivado
      { id: 'p2', date: '2099-12-31', amount: 400 }, // Agendado futuro
    ];

    const effectivePaid = getEffectivePaidAmount(payments);
    const scheduledPaid = getScheduledPaidAmount(payments);
    const currentAmount = Math.max(0, mockDebt.originalAmount - effectivePaid);
    const status = currentAmount <= 0 ? 'paid' : effectivePaid > 0 ? 'partial' : 'pending';

    expect(effectivePaid).toBe(100);
    expect(scheduledPaid).toBe(400);
    expect(currentAmount).toBe(400);
    expect(status).toBe('partial');
  });

  it('deve lidar corretamente com imprecisões de ponto flutuante em centavos', () => {
    const originalAmount = 100.30;
    const payments = [
      { id: 'p1', date: '2026-01-01', amount: 33.10 },
      { id: 'p2', date: '2026-01-02', amount: 33.10 },
      { id: 'p3', date: '2026-01-03', amount: 34.10 },
    ];

    const totalPaid = Number(getEffectivePaidAmount(payments).toFixed(2));
    const currentAmount = Math.max(0, Number((originalAmount - totalPaid).toFixed(2)));
    const status = currentAmount <= 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'pending';

    expect(totalPaid).toBe(100.30);
    expect(currentAmount).toBe(0);
    expect(status).toBe('paid');
  });
});
