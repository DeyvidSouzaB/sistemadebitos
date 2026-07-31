/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Debt } from '../types';
import { useDashboardMetrics } from './useDashboardMetrics';

export function useDashboard(debts: Debt[]) {
  const metrics = useDashboardMetrics(debts);
  return metrics;
}

export { useDashboardMetrics };
