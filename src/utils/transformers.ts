import {
  differenceInDays,
  differenceInHours,
  format,
  isSameDay,
  isSameMonth,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { DateRange } from '@/components/dashboard/DateRangeFilter.tsx';
import { ApiTicket } from '@/services/indicatorsService';
import { CATEGORY_FIELD_MAP } from '@/utils/constants.ts';

const HISTORICAL_MAX = 159; // Outubro

interface DepartmentData {
  name: string;
  openTickets: number;
  avgCloseTime: number;
}

interface CategoryData {
  name: string;
  openTickets: number;
  avgCloseTime: number;
}

interface MonthlyData {
  month: string;
  tickets: number;
}

export const transformTicketsToHeatMap = (tickets: ApiTicket[]) => {
  const daysLabel = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  const mapData = daysLabel.map((day) => ({
    day,
    hours: Array.from({ length: 24 }, (_, h) => ({ hour: h, value: 0 })),
  }));

  tickets.forEach((ticket) => {
    if (!ticket.createdTime) return;
    const date = new Date(ticket.createdTime);
    const hour = date.getHours();
    const jsDay = date.getDay();
    const arrayIndex = jsDay === 0 ? 6 : jsDay - 1;

    if (mapData[arrayIndex]?.hours[hour]) {
      mapData[arrayIndex].hours[hour].value += 1;
    }
  });

  return mapData;
};

export const transformTicketsToCapacityData = (totalCreated: number, dateRange: DateRange) => {
  let gaugeValue: number;
  const daysInRange = Math.max(1, differenceInDays(dateRange.to!, dateRange.from!) + 1);

  if (daysInRange >= 28) {
    gaugeValue = (totalCreated / HISTORICAL_MAX) * 100;
  } else {
    const dailyRate = totalCreated / daysInRange;
    const projectedMonthlyVolume = dailyRate * 30;
    gaugeValue = (projectedMonthlyVolume / HISTORICAL_MAX) * 100;
  }

  return Math.round(gaugeValue);
};

export const transformTicketsToDepartmentData = (
  tickets: ApiTicket[],
  sectorMap: Record<string, string>,
): DepartmentData[] => {
  const groups: Record<string, { count: number; totalDurationHours: number; closedCount: number }> =
    {};

  Object.values(sectorMap).forEach((sectorName) => {
    groups[sectorName] = { count: 0, totalDurationHours: 0, closedCount: 0 };
  });

  tickets.forEach((ticket) => {
    const sectorId = String(ticket.ufCrm24_1754569819149 || '');
    const sectorName = sectorMap[sectorId] || 'Sem Setor';

    if (!groups[sectorName]) {
      groups[sectorName] = { count: 0, totalDurationHours: 0, closedCount: 0 };
    }

    const group = groups[sectorName];

    group.count += 1;

    if (ticket.stageId === 'DT1068_48:SUCCESS' && ticket.movedTime) {
      const created = new Date(ticket.createdTime);
      const closed = new Date(ticket.movedTime);
      const hours = differenceInHours(closed, created);
      const validHours = Math.max(0, hours);

      group.totalDurationHours += validHours;
      group.closedCount += 1;
    }
  });

  return Object.keys(groups)
    .map((deptName) => {
      const data = groups[deptName];
      const avgTime =
        data.closedCount > 0 ? Math.round(data.totalDurationHours / data.closedCount) : 0;

      return {
        name: deptName,
        openTickets: data.count,
        avgCloseTime: avgTime,
      };
    })
    .sort((a, b) => b.openTickets - a.openTickets);
};

export const transformTicketsToCategoryData = (tickets: ApiTicket[]): CategoryData[] => {
  const groups: Record<string, { count: number; totalDurationHours: number; closedCount: number }> =
    {};

  Object.values(CATEGORY_FIELD_MAP).forEach((catName) => {
    groups[catName] = { count: 0, totalDurationHours: 0, closedCount: 0 };
  });
  groups['Sem Categoria'] = { count: 0, totalDurationHours: 0, closedCount: 0 };

  tickets.forEach((ticket) => {
    let ticketCategory = 'Sem Categoria';

    for (const [fieldId, label] of Object.entries(CATEGORY_FIELD_MAP)) {
      if (ticket[fieldId] === 'Y' || ticket[fieldId] === true) {
        ticketCategory = label;
        break;
      }
    }

    const group = groups[ticketCategory];

    if (!group) return;

    group.count += 1;

    if (ticket.stageId === 'DT1068_48:SUCCESS' && ticket.movedTime) {
      const created = new Date(ticket.createdTime);
      const closed = new Date(ticket.movedTime);
      const hours = Math.max(0, differenceInHours(closed, created));

      group.totalDurationHours += hours;
      group.closedCount += 1;
    }
  });

  return Object.keys(groups)
    .map((catName) => {
      const data = groups[catName];
      const avgTime =
        data.closedCount > 0 ? Math.round(data.totalDurationHours / data.closedCount) : 0;

      return {
        name: catName,
        openTickets: data.count,
        avgCloseTime: avgTime,
      };
    })
    .filter((item) => item.openTickets > 0) // remove categorias zeradas pra não poluir
    .sort((a, b) => b.openTickets - a.openTickets);
};

export const transformTicketsToMonthlyTrend = (tickets: ApiTicket[]): MonthlyData[] => {
  const today = new Date();
  const monthsToShow = 4;
  const result: MonthlyData[] = [];

  for (let i = monthsToShow - 1; i >= 0; i--) {
    const dateRef = subMonths(today, i);
    const monthKey = format(dateRef, 'MMM', { locale: ptBR }); // "jan", "fev"

    const count = tickets.filter((t) => {
      const ticketDate = new Date(t.createdTime);
      return isSameMonth(ticketDate, dateRef);
    }).length;

    const label = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);

    result.push({
      month: label,
      tickets: count,
    });
  }

  return result;
};

export const transformTicketsToDailyResolution = (tickets: ApiTicket[]) => {
  let sameDayCount = 0;
  let moreThanOneDayCount = 0;

  tickets.forEach((ticket) => {
    if (ticket.stageId !== 'DT1068_48:SUCCESS' || !ticket.movedTime) return;

    const created = new Date(ticket.createdTime);
    const closed = new Date(ticket.movedTime);

    if (isSameDay(created, closed)) {
      sameDayCount++;
    } else {
      moreThanOneDayCount++;
    }
  });

  return [
    { name: 'No mesmo dia', value: sameDayCount },
    { name: 'Mais de 1 dia', value: moreThanOneDayCount },
  ];
};
