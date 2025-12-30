import { api } from '@/lib/api';

export interface ApiTicket {
  id: number;
  createdTime: string;
  title: string;
  stageId: string;
  ufCrm24_1754569819149: number | string; // área
  ufCrm24_1754570026461: string; // Conexão com internet
  ufCrm24_1754570036525: string; // Queda de rede interna
  ufCrm24_1754570051823: string; // Computador travando
  ufCrm24_1754570077408: string; // Problema com login/senha
  ufCrm24_1754570088661: string; // Impressora com erro
  ufCrm24_1754570099018: string; // Falha em sistema interno
  ufCrm24_1754570115035: string; // Periféricos com defeito
  ufCrm24_1754570132406: string; // Outros Problemas
  ufCrm24_1758807154191: string; // Acesso
  movedTime: string;
}

export interface ApiResponse {
  result: {
    items: ApiTicket[];
  };
  total?: number;
}

const SPA_ENTITY_ID = 1068;

interface ApiFieldItem {
  ID: string;
  VALUE: string;
}

interface ApiFieldsResponse {
  result: {
    fields: {
      [key: string]: {
        items?: ApiFieldItem[];
        title?: string;
      };
    };
  };
}

const SECTOR_FIELD_KEY = 'ufCrm24_1754569819149';

export const indicatorsService = {
  getTickets: async (startDate: Date, endDate: Date) => {
    let allItems: ApiTicket[] = [];
    let start = 0;
    let hasMore = true;

    // Safety Brake: Limite de segurança para não travar o navegador
    // caso tenha 1 milhão de chamados
    const MAX_REQUESTS = 50; // 50 * 50 = 2500 itens max por vez
    let requestCount = 0;

    // Loop enquanto houver dados e não estourar o limite de segurança
    while (hasMore && requestCount < MAX_REQUESTS) {
      const payload = {
        entityTypeId: SPA_ENTITY_ID,
        select: [
          'id',
          'createdTime',
          'title',
          'stageId',
          'movedTime',
          'ufCrm24_1754569819149',
          'ufCrm24_1754570036525',
          'ufCrm24_1754570051823',
          'ufCrm24_1754570077408',
          'ufCrm24_1754570088661',
          'ufCrm24_1754570099018',
          'ufCrm24_1754570115035',
          'ufCrm24_1754570132406',
          'ufCrm24_1758807154191',
        ],
        order: { createdTime: 'DESC' },
        filter: {
          '>=createdTime': startDate.toISOString(),
          '<=createdTime': endDate.toISOString(),
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
        console.error('Erro na paginação do Bitrix:', error);
        hasMore = false; // Para o loop em caso de erro para não ficar infinito
      }
    }

    return allItems;
  },

  getSectorMap: async (): Promise<Record<string, string>> => {
    const response = await api.post<ApiFieldsResponse>('/crm.item.fields', {
      entityTypeId: SPA_ENTITY_ID,
    });

    const fieldData = response.data.result.fields[SECTOR_FIELD_KEY];
    const map: Record<string, string> = {};

    if (fieldData && fieldData.items) {
      fieldData.items.forEach((item) => {
        map[item.ID] = item.VALUE;
      });
    }

    return map;
  },
};
