/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  note?: string;
}

export interface Debt {
  id: string;
  name: string;
  phone?: string;
  originalAmount: number;
  currentAmount: number; // remaining outstanding amount
  createdAt: string;
  dueDate?: string;
  status: 'pending' | 'paid' | 'partial';
  description?: string;
  payments: PaymentHistory[];
}

export type DebtStatusFilter = 'all' | 'pending' | 'partial' | 'paid';
export type DebtSortOption =
  | 'createdAt_desc'
  | 'createdAt_asc'
  | 'dueDate_asc'
  | 'dueDate_desc'
  | 'name_asc'
  | 'name_desc'
  | 'amount_desc'
  | 'amount_asc';
