import { useState, useCallback } from 'react';
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
import {DailyResolutionRateChart} from "@/components/dashboard/DailyResolutionRateChart.tsx";

const Index = () => {
  const [data, setData] = useState(generateTicketData());
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
    label: 'Mês atual',
  });

  const handleRefresh = useCallback(() => {
    setData(generateTicketData());
    setLastUpdated(new Date());
  }, []);

  const handleDateRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
    // TODO - fetch from api
    setData(generateTicketData());
    setLastUpdated(new Date());
  }, []);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        <DashboardHeader 
          onRefresh={handleRefresh} 
          lastUpdated={lastUpdated} 
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />
        
        {/* Top row: Gauge + KPIs + Resolution Rate */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <GaugeChart value={data.capacityIndex} label="Índice de capacidade operacional" />
          <KPICard 
            title="Tickets abertos"
            value={data.ticketsOpened} 
            icon={Ticket} 
            trend={12}
            variant="accent"
          />
          <KPICard 
            title="Tickets fechados"
            value={data.ticketsClosed} 
            icon={TicketCheck} 
            trend={8}
            variant="success"
          />
          <ResolutionRateIndicator rate={data.resolutionRate} />
        </div>

        {/* Middle row: Stacked Chart + Monthly Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <StackedDepartmentChart data={data.departmentData} />
          <StackedDepartmentChart data={data.departmentData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <div className="lg:col-span-3">
            <MonthlyComparisonChart data={data.monthlyData} />
          </div>

          <div className="lg:col-span-1">
            <DailyResolutionRateChart data={data.dailyResolutionData} />
          </div>
        </div>

        {/* Bottom row: Heat Map */}
        <div className="grid grid-cols-1 gap-4">
          <TicketHeatMap data={data.heatMapData} />
        </div>
      </div>
    </div>
  );
};

export default Index;
