/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Debt } from '../types';
import { PeriodFilterType, DateBasisType, getTodayString } from '../utils/dateUtils';
import { ReportService, ReportMetrics } from '../services/reportService';

export function useReports(debts: Debt[]) {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilterType>('this_month');
  const [dateBasis, setDateBasis] = useState<DateBasisType>('dueDate');

  // Custom date range state
  const [customStart, setCustomStart] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  });
  const [customEnd, setCustomEnd] = useState(() => getTodayString());

  // Pagination for payment history table
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Compute metrics using ReportService
  const metrics: ReportMetrics = useMemo(() => {
    return ReportService.calculateReportMetrics(
      debts,
      periodFilter,
      dateBasis,
      customStart,
      customEnd
    );
  }, [debts, periodFilter, dateBasis, customStart, customEnd]);

  // Pagination for payments list
  const totalItems = metrics.periodPayments.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const activePage = Math.min(currentPage, totalPages);

  const paginatedPayments = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return metrics.periodPayments.slice(start, start + pageSize);
  }, [metrics.periodPayments, activePage, pageSize]);

  return {
    isPdfModalOpen,
    setIsPdfModalOpen,
    periodFilter,
    setPeriodFilter,
    dateBasis,
    setDateBasis,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    currentPage: activePage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    paginatedPayments,
    metrics,
  };
}
