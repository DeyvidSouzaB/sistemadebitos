import { useMemo } from 'react';
import { Debt } from '../types';

export const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const WEEKDAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export interface CalendarCell {
  dayNum: number;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
}

export function useCalendarData(
  debts: Debt[],
  selectedYear: number,
  selectedMonth: number,
  todayStr: string
) {
  // Index debts by YYYY-MM-DD
  const debtsByDate = useMemo(() => {
    const map: Record<string, Debt[]> = {};
    debts.forEach((d) => {
      if (!d.dueDate) return;
      const dateKey = d.dueDate.slice(0, 10);
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(d);
    });
    return map;
  }, [debts]);

  // Calculate calendar grid cells
  const calendarGridCells = useMemo(() => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const startWeekday = firstDay.getDay(); // 0 = Sunday
    const daysInCurrentMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const cells: CalendarCell[] = [];

    // 1. Previous month padding days
    for (let i = startWeekday - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonthIdx = selectedMonth === 0 ? 11 : selectedMonth - 1;
      const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
      const mStr = String(prevMonthIdx + 1).padStart(2, '0');
      const dStr = String(dayNum).padStart(2, '0');
      const dateStr = `${prevYear}-${mStr}-${dStr}`;

      cells.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isPast: dateStr < todayStr
      });
    }

    // 2. Current month days
    const mStr = String(selectedMonth + 1).padStart(2, '0');
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dStr = String(d).padStart(2, '0');
      const dateStr = `${selectedYear}-${mStr}-${dStr}`;

      cells.push({
        dayNum: d,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        isPast: dateStr < todayStr
      });
    }

    // 3. Next month padding days to complete 35 or 42 grid items
    const remainingSlots = (cells.length > 35 ? 42 : 35) - cells.length;
    const nextMonthIdx = selectedMonth === 11 ? 0 : selectedMonth + 1;
    const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
    const nextMStr = String(nextMonthIdx + 1).padStart(2, '0');

    for (let n = 1; n <= remainingSlots; n++) {
      const dStr = String(n).padStart(2, '0');
      const dateStr = `${nextYear}-${nextMStr}-${dStr}`;

      cells.push({
        dayNum: n,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        isPast: dateStr < todayStr
      });
    }

    return cells;
  }, [selectedYear, selectedMonth, todayStr]);

  // Active month statistics
  const monthStats = useMemo(() => {
    const currentMonthPrefix = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
    
    let totalCount = 0;
    let totalAmount = 0;
    let overdueAmount = 0;
    let todayAmount = 0;
    let upcomingAmount = 0;
    let paidAmount = 0;

    debts.forEach((d) => {
      if (!d.dueDate) return;
      const dPrefix = d.dueDate.slice(0, 7);
      if (dPrefix === currentMonthPrefix) {
        totalCount++;
        totalAmount += d.currentAmount;

        const dateStr = d.dueDate.slice(0, 10);
        if (d.status === 'paid') {
          paidAmount += d.currentAmount;
        } else if (dateStr < todayStr) {
          overdueAmount += d.currentAmount;
        } else if (dateStr === todayStr) {
          todayAmount += d.currentAmount;
        } else {
          upcomingAmount += d.currentAmount;
        }
      }
    });

    return {
      totalCount,
      totalAmount,
      overdueAmount,
      todayAmount,
      upcomingAmount,
      paidAmount
    };
  }, [debts, selectedYear, selectedMonth, todayStr]);

  // 12-Month Year Summary Statistics
  const yearlyStats = useMemo(() => {
    return MONTH_NAMES.map((name, idx) => {
      const mStr = `${selectedYear}-${String(idx + 1).padStart(2, '0')}`;
      let count = 0;
      let total = 0;
      let overdue = 0;
      let pending = 0;
      let paid = 0;

      debts.forEach((d) => {
        if (!d.dueDate) return;
        if (d.dueDate.slice(0, 7) === mStr) {
          count++;
          total += d.currentAmount;
          const dateStr = d.dueDate.slice(0, 10);
          if (d.status === 'paid') {
            paid += d.currentAmount;
          } else if (dateStr < todayStr) {
            overdue += d.currentAmount;
          } else {
            pending += d.currentAmount;
          }
        }
      });

      return {
        monthIdx: idx,
        name,
        count,
        total,
        overdue,
        pending,
        paid
      };
    });
  }, [debts, selectedYear, todayStr]);

  return {
    debtsByDate,
    calendarGridCells,
    monthStats,
    yearlyStats,
  };
}
