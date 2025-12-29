import { api } from '@/lib/api';

export interface ApiTicket {
    id: number;
    createdTime: string;
    title: string;
    stageId: string;
}

export interface ApiResponse {
    result: {
        items: ApiTicket[];
    };
    total?: number;
}

const SPA_ENTITY_ID = 1068;

export const indicatorsService = {
    getTickets: async (startDate: Date, endDate: Date) => {
        let allItems: ApiTicket[] = [];
        let start = 0;
        let hasMore = true;

        // Safety Brake: Limite de segurança para não travar o navegador
        // caso tenha 1 milhão de chamados (opcional, mas recomendado)
        const MAX_REQUESTS = 50; // 50 * 50 = 2500 itens max por vez
        let requestCount = 0;

        // Loop enquanto houver dados e não estourar o limite de segurança
        while (hasMore && requestCount < MAX_REQUESTS) {
            const payload = {
                entityTypeId: SPA_ENTITY_ID,
                select: ['id', 'createdTime', 'title', 'stageId'],
                order: { createdTime: 'DESC' },
                filter: {
                    ">=createdTime": startDate.toISOString(),
                    "<=createdTime": endDate.toISOString(),
                },
                start: start,
            };

            try {
                const response = await api.post<ApiResponse>('/crm.item.list', payload);
                const items = response.data.result.items;

                // Adiciona os itens dessa página ao array principal
                allItems = [...allItems, ...items];

                // Lógica de Paginação do Bitrix:
                // Se vieram menos de 50 itens, significa que acabou a lista
                if (items.length < 50) {
                    hasMore = false;
                } else {
                    // Se vieram 50, prepara o próximo lote
                    start += 50;
                }

                requestCount++;

            } catch (error) {
                console.error("Erro na paginação do Bitrix:", error);
                hasMore = false; // Para o loop em caso de erro para não ficar infinito
            }
        }

        return allItems;
    }
};