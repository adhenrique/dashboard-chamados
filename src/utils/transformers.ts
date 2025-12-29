import { ApiTicket } from '@/services/indicatorsService';

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