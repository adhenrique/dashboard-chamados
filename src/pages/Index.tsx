import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import { Ticket, TicketCheck } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DailyResolutionRateChart } from '@/components/dashboard/DailyResolutionRateChart';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DateRange } from '@/components/dashboard/DateRangeFilter';
import { GaugeChart } from '@/components/dashboard/GaugeChart';
import { KPICard } from '@/components/dashboard/KPICard';
import { MonthlyComparisonChart } from '@/components/dashboard/MonthlyComparisonChart';
import { ResolutionRateIndicator } from '@/components/dashboard/ResolutionRateIndicator';
import { StackedDepartmentChart } from '@/components/dashboard/StackedDepartmentChart';
import { TicketHeatMap } from '@/components/dashboard/TicketHeatMap';
import { ApiTicket, indicatorsService } from '@/services/indicatorsService';
import {
  transformTicketsToCapacityData,
  transformTicketsToCategoryData,
  transformTicketsToDailyResolution,
  transformTicketsToDepartmentData,
  transformTicketsToHeatMap,
  transformTicketsToMonthlyTrend,
} from '@/utils/transformers';

const Index = () => {
  const [rawTickets, setRawTickets] = useState<ApiTicket[]>([]);
  const [trendTickets, setTrendTickets] = useState<ApiTicket[]>([]);
  const [sectorMap, setSectorMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
    label: 'Mês atual',
  });

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const today = new Date();
        const trendStartDate = startOfMonth(subMonths(today, 3));
        const trendEndDate = endOfMonth(today);

        const [map, trendData] = await Promise.all([
          indicatorsService.getSectorMap(),
          indicatorsService.getTickets(trendStartDate, trendEndDate),
        ]);

        setSectorMap(map);
        setTrendTickets(trendData);
      } catch (error) {
        console.error('Erro ao carregar dados estáticos:', error);
      }
    };

    fetchStaticData();
  }, []);

  const fetchDynamicData = useCallback(async () => {
    if (!dateRange.from || !dateRange.to) return;

    try {
      setLoading(true);

      const filteredData = await indicatorsService.getTickets(dateRange.from, dateRange.to);

      setRawTickets(filteredData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Erro ao buscar tickets filtrados:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchDynamicData();
  }, [fetchDynamicData]);

  const fetchDashboardData = useCallback(async () => {
    if (!dateRange.from || !dateRange.to) return;

    try {
      setLoading(true);

      const today = new Date();
      const trendStartDate = startOfMonth(subMonths(today, 3));
      const trendEndDate = endOfMonth(today);

      const [filteredData, trendData] = await Promise.all([
        indicatorsService.getTickets(dateRange.from, dateRange.to),
        indicatorsService.getTickets(trendStartDate, trendEndDate),
      ]);

      setRawTickets(filteredData);
      setTrendTickets(trendData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  const dashboardData = useMemo(() => {
    const totalCreated = rawTickets.length;
    const totalClosed = rawTickets.filter(
      (ticket) => ticket.stageId === 'DT1068_48:SUCCESS',
    ).length;

    const calculatedResolutionRate =
      totalCreated > 0 ? Math.round((totalClosed / totalCreated) * 100) : 0;

    const departmentChartData =
      Object.keys(sectorMap).length > 0
        ? transformTicketsToDepartmentData(rawTickets, sectorMap)
        : [];

    const categoryChartData = transformTicketsToCategoryData(rawTickets);
    const monthlyTrendData = transformTicketsToMonthlyTrend(trendTickets);
    const dailyResolutionChartData = transformTicketsToDailyResolution(rawTickets);

    return {
      heatMapData: transformTicketsToHeatMap(rawTickets),
      capacityIndex: transformTicketsToCapacityData(totalCreated, dateRange), // Sua função do gauge
      ticketsOpened: totalCreated,
      ticketsClosed: totalClosed,
      resolutionRate: calculatedResolutionRate,
      departmentData: departmentChartData,
      categoryData: categoryChartData,
      monthlyData: monthlyTrendData,
      dailyResolutionData: dailyResolutionChartData,
    };
  }, [rawTickets, sectorMap, trendTickets, dateRange]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        <DashboardHeader
          onRefresh={fetchDashboardData}
          lastUpdated={lastUpdated}
          dateRange={dateRange}
          onDateRangeChange={(range) => setDateRange(range)}
          isLoading={loading}
        />

        {/* Top row */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <GaugeChart
            value={dashboardData.capacityIndex}
            label="Índice de capacidade operacional"
            loading={loading}
          />
          <KPICard
            title="Tickets abertos"
            value={dashboardData.ticketsOpened}
            icon={Ticket}
            variant="accent"
            loading={loading}
          />
          <KPICard
            title="Tickets fechados"
            value={dashboardData.ticketsClosed}
            icon={TicketCheck}
            variant="success"
            loading={loading}
          />
          <ResolutionRateIndicator rate={dashboardData.resolutionRate} loading={loading} />
        </div>

        {/* Middle row */}
        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <StackedDepartmentChart data={dashboardData.departmentData} loading={loading} />
          <StackedDepartmentChart data={dashboardData.categoryData} loading={loading} />
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <MonthlyComparisonChart data={dashboardData.monthlyData} loading={loading} />
          </div>

          <div className="lg:col-span-1">
            <DailyResolutionRateChart data={dashboardData.dailyResolutionData} loading={loading} />
          </div>
        </div>

        {/* Bottom row: Heat Map - AGORA COM DADOS REAIS */}
        <div className="grid grid-cols-1 gap-4">
          <TicketHeatMap data={dashboardData.heatMapData} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Index;
