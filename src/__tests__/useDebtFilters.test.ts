import { describe, it, expect } from 'vitest';
import { filterDebts, sortDebts } from '../hooks/useDebtFilters';
import { Debt } from '../types';

describe('useDebtFilters (filterDebts & sortDebts)', () => {
  const mockDebts: Debt[] = [
    {
      id: 'd1',
      name: 'Bruno Alves',
      originalAmount: 1000,
      currentAmount: 1000,
      createdAt: '2026-01-10T10:00:00Z',
      dueDate: '2026-02-10T10:00:00Z',
      status: 'pending',
      description: 'Serviço de marcenaria',
      payments: [],
    },
    {
      id: 'd2',
      name: 'Ana Souza',
      originalAmount: 500,
      currentAmount: 200,
      createdAt: '2026-01-05T10:00:00Z',
      dueDate: '2026-01-25T10:00:00Z',
      status: 'partial',
      description: 'Venda de roupas',
      payments: [{ id: 'p1', date: '2026-01-15', amount: 300 }],
    },
    {
      id: 'd3',
      name: 'Carlos Santos',
      originalAmount: 800,
      currentAmount: 0,
      createdAt: '2026-01-01T10:00:00Z',
      dueDate: '2026-01-10T10:00:00Z',
      status: 'paid',
      description: 'Consultoria TI',
      payments: [{ id: 'p2', date: '2026-01-08', amount: 800 }],
    },
  ];

  it('deve filtrar cobranças por termo de busca no nome', () => {
    const filtered = filterDebts(mockDebts, 'Ana', 'all');
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Ana Souza');
  });

  it('deve filtrar cobranças por termo de busca na descrição', () => {
    const filtered = filterDebts(mockDebts, 'marcenaria', 'all');
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('d1');
  });

  it('deve filtrar por status (pending, partial, paid)', () => {
    const pending = filterDebts(mockDebts, '', 'pending');
    expect(pending.length).toBe(1);
    expect(pending[0].id).toBe('d1');

    const paid = filterDebts(mockDebts, '', 'paid');
    expect(paid.length).toBe(1);
    expect(paid[0].id).toBe('d3');
  });

  it('deve ordenar por nome ascendente e descendente', () => {
    const asc = sortDebts(mockDebts, 'name_asc');
    expect(asc[0].name).toBe('Ana Souza');

    const desc = sortDebts(mockDebts, 'name_desc');
    expect(desc[0].name).toBe('Carlos Santos');
  });

  it('deve ordenar por valor devedor (amount_desc / amount_asc)', () => {
    const desc = sortDebts(mockDebts, 'amount_desc');
    expect(desc[0].currentAmount).toBe(1000);

    const asc = sortDebts(mockDebts, 'amount_asc');
    expect(asc[0].currentAmount).toBe(0);
  });
});
