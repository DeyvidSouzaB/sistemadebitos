/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Debt } from '../types';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { DashboardHero } from './dashboard/DashboardHero';
import { DashboardMetricCards } from './dashboard/DashboardMetricCards';
import { DashboardChart } from './dashboard/DashboardChart';
import { DashboardUpcomingDebts } from './dashboard/DashboardUpcomingDebts';

interface DashboardProps {
  debts: Debt[];
  onSelectOption: (option: string) => void;
  onOpenAddModal: () => void;
  onPayFull: (debt: Debt) => void;
  onAddPaymentClick?: (debt: Debt) => void;
  onOpenNotifications?: () => void;
}

export default function Dashboard({
  debts,
  onSelectOption,
  onOpenAddModal,
  onPayFull,
  onOpenNotifications,
}: DashboardProps) {
  const {
    totalRemaining,
    totalReceivedThisMonth,
    overdueDebts,
    totalOverdueAmount,
    activeClientsCount,
    upcomingDebts,
    monthlyChartData,
    maxChartValue,
    getStatusInfo,
  } = useDashboardMetrics(debts);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 sm:space-y-7 text-slate-900 max-w-[1600px] mx-auto pb-10"
    >
      {/* 1. HERO HEADER */}
      <DashboardHero
        onOpenAddModal={onOpenAddModal}
        onSelectOption={onSelectOption}
        onOpenNotifications={onOpenNotifications}
        overdueCount={overdueDebts.length}
      />

      {/* 2. TOP METRIC CARDS */}
      <DashboardMetricCards
        totalRemaining={totalRemaining}
        totalReceivedThisMonth={totalReceivedThisMonth}
        totalOverdueAmount={totalOverdueAmount}
        overdueDebts={overdueDebts}
        activeClientsCount={activeClientsCount}
        onSelectOption={onSelectOption}
      />

      {/* 3. 6-MONTH EVOLUTION CHART */}
      <DashboardChart
        monthlyChartData={monthlyChartData}
        maxChartValue={maxChartValue}
      />

      {/* 4. UPCOMING DEBTS & AGENDA */}
      <DashboardUpcomingDebts
        upcomingDebts={upcomingDebts}
        onSelectOption={onSelectOption}
        onPayFull={onPayFull}
        getStatusInfo={getStatusInfo}
      />
    </motion.div>
  );
}
