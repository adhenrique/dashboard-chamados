import { Clock, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { DateRange, DateRangeFilter } from './DateRangeFilter';

interface DashboardHeaderProps {
  onRefresh: () => void;
  isLoading?: boolean;
  lastUpdated: Date;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export const DashboardHeader = ({
  onRefresh,
  isLoading = false,
  lastUpdated,
  dateRange,
  onDateRangeChange,
}: DashboardHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="gradient-text text-3xl font-bold">Indicadores de chamados - Grupo Elyon</h1>
        <p className="mt-1 text-muted-foreground">Análises e insights em tempo real</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">
            Ultima atualização: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
        <DateRangeFilter value={dateRange} onChange={onDateRangeChange} />
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="border-border hover:bg-secondary hover:text-accent"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>
    </div>
  );
};
