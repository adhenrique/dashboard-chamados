// Generate dynamic ticket data for the dashboard

export const generateTicketData = () => {
  const departments = ['TI', 'RH', 'Comercial', 'Financeiro', 'Pré-impressão', 'Marketing'];
  const categories = ['Technical', 'Billing', 'General Inquiry', 'Bug Report', 'Feature Request', 'Account'];

  const minMinutes = 4 * 60;   // 240
  const maxMinutes = 52 * 60;  // 3120

  return {
    capacityIndex: Math.floor(Math.random() * 101),
    ticketsOpened: Math.floor(Math.random() * 200) + 150,
    ticketsClosed: Math.floor(Math.random() * 180) + 120,
    resolutionRate: Math.floor(Math.random() * 15) + 80, // 80-95%
    
    departmentData: departments.map(dept => ({
      department: dept,
      openTickets: Math.floor(Math.random() * 50) + 10,
      // avgCloseTime: Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes,
      avgCloseTime: Math.floor(Math.random() * 48) + 4, // hours
    })),

    top5DepartmentData: departments.map(dept => ({
      name: dept,
      value: Math.floor(Math.random() * 200) + 150,
    })),

    dailyResolutionData: [
      { name: 'No mesmo dia', value: Math.floor(Math.random() * 80) + 20 },
      { name: 'Mais de 1 dia', value: Math.floor(Math.random() * 80) + 20 },
    ],
    
    monthlyData: [
      { month: 'Sep', tickets: Math.floor(Math.random() * 100) + 200 },
      { month: 'Oct', tickets: Math.floor(Math.random() * 100) + 220 },
      { month: 'Nov', tickets: Math.floor(Math.random() * 100) + 180 },
      { month: 'Dec', tickets: Math.floor(Math.random() * 100) + 250 },
    ],

    monthlyData2: [
      { name: 'Sep', totalChamados: Math.floor(Math.random() * 100) + 200, tempoMedio: 100 },
      { name: 'Oct', totalChamados: Math.floor(Math.random() * 100) + 220, tempoMedio: 200 },
      { name: 'Nov', totalChamados: Math.floor(Math.random() * 100) + 180, tempoMedio: 300 },
      { name: 'Dec', totalChamados: Math.floor(Math.random() * 100) + 250, tempoMedio: 123 },
    ],
    
    heatMapData: generateHeatMapData(),
    
    categoryData: categories.map(cat => ({
      category: cat,
      count: Math.floor(Math.random() * 80) + 20,
    })),
  };
};

const generateHeatMapData = () => {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return days.map((day, dayIndex) => {
    const isWeekend = dayIndex >= 5;

    // Fator de redução: Fim de semana cai para 20% do volume
    const dayFactor = isWeekend ? 0.2 : 1.0;

    const hours = Array.from({ length: 24 }, (_, hour) => {
      let baseValue = 0;

      // Definição de Pico (Escala 0 a 10)
      if (hour >= 9 && hour <= 18) {
        if (hour >= 14 && hour <= 16) {
          baseValue = 8; // Pico alto (perto de 10)
        } else {
          baseValue = 4; // Média normal
        }
      } else if (hour > 18 && hour <= 21) {
        baseValue = 2; // Final de tarde
      } else {
        baseValue = 0; // Madrugada (maioria zero)
      }

      // Adiciona variação aleatória pequena (-1 a +2)
      const noise = Math.floor(Math.random() * 4) - 1;

      let finalValue = (baseValue + noise) * dayFactor;

      // Arredonda e garante limites (0 a 10, mas pode passar um pouco se o ruído for alto)
      finalValue = Math.max(0, Math.ceil(finalValue));

      return {
        hour,
        value: finalValue,
      };
    });

    return {
      day,
      hours,
    };
  });
};

export type TicketData = ReturnType<typeof generateTicketData>;
