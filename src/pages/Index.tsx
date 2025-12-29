import { useState, useCallback, useEffect, useMemo } from 'react';
import { Ticket, TicketCheck } from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { generateTicketData } from '@/data/ticketData';
import { GaugeChart } from '@/components/dashboard/GaugeChart';
import { KPICard } from '@/components/dashboard/KPICard';
import { StackedDepartmentChart } from '@/components/dashboard/StackedDepartmentChart';
import { MonthlyComparisonChart } from '@/components/dashboard/MonthlyComparisonChart';
import { TicketHeatMap } from '@/components/dashboard/TicketHeatMap';
import { ResolutionRateIndicator } from '@/components/dashboard/ResolutionRateIndicator';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DateRange } from '@/components/dashboard/DateRangeFilter';
import { DailyResolutionRateChart } from "@/components/dashboard/DailyResolutionRateChart";
import { indicatorsService, ApiTicket } from '@/services/indicatorsService';
import { transformTicketsToHeatMap } from '@/utils/transformers';

const Index = () => {
  const [rawTickets, setRawTickets] = useState<ApiTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
    label: 'Mês atual',
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const tickets = await indicatorsService.getTickets(dateRange.from, dateRange.to);
      setRawTickets(tickets);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const dashboardData = useMemo(() => {
    const mockData = generateTicketData();

    if (loading && rawTickets.length === 0) return mockData;

    return {
      // --- DADOS REAIS (Migrados) ---
      heatMapData: transformTicketsToHeatMap(rawTickets),

      // --- DADOS MOCKADOS (Ainda a fazer) ---
      capacityIndex: mockData.capacityIndex,
      ticketsOpened: mockData.ticketsOpened,
      ticketsClosed: mockData.ticketsClosed,
      resolutionRate: mockData.resolutionRate,
      departmentData: mockData.departmentData,
      monthlyData: mockData.monthlyData,
      dailyResolutionData: mockData.dailyResolutionData
    };
  }, [rawTickets, loading]);

  // if (loading && rawTickets.length === 0) return <div className="p-8">Carregando painel...</div>;

  return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-[1600px] mx-auto">
          <DashboardHeader
              onRefresh={fetchDashboardData}
              lastUpdated={lastUpdated}
              dateRange={dateRange}
              onDateRangeChange={(range) => setDateRange(range)}
          />

          {/* Top row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <GaugeChart value={dashboardData.capacityIndex} label="Índice de capacidade operacional" />
            <KPICard
                title="Tickets abertos"
                value={dashboardData.ticketsOpened}
                icon={Ticket}
                trend={12}
                variant="accent"
            />
            <KPICard
                title="Tickets fechados"
                value={dashboardData.ticketsClosed}
                icon={TicketCheck}
                trend={8}
                variant="success"
            />
            <ResolutionRateIndicator rate={dashboardData.resolutionRate} />
          </div>

          {/* Middle row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <StackedDepartmentChart data={dashboardData.departmentData} />
            <StackedDepartmentChart data={dashboardData.departmentData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-3">
              <MonthlyComparisonChart data={dashboardData.monthlyData} />
            </div>

            <div className="lg:col-span-1">
              <DailyResolutionRateChart data={dashboardData.dailyResolutionData} />
            </div>
          </div>

          {/* Bottom row: Heat Map - AGORA COM DADOS REAIS */}
          <div className="grid grid-cols-1 gap-4">
            <TicketHeatMap data={dashboardData.heatMapData} />
          </div>
        </div>
      </div>
  );
};

export default Index;