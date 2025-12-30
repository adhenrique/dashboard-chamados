import { ApiTicket } from '@/services/indicatorsService';
import { differenceInDays } from "date-fns";
import { DateRange } from "@/components/dashboard/DateRangeFilter.tsx";

const HISTORICAL_MAX = 159; // Outubro

export const transformTicketsToHeatMap = (tickets: ApiTicket[]) => {
    const daysLabel = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    const mapData = daysLabel.map(day => ({
        day,
        hours: Array.from({ length: 24 }, (_, h) => ({ hour: h, value: 0 }))
    }));

    tickets.forEach(ticket => {
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
}