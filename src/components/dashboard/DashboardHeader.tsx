import { RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DateRangeFilter, DateRange } from './DateRangeFilter';

interface DashboardHeaderProps {
  onRefresh: () => void;
  lastUpdated: Date;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export const DashboardHeader = ({ onRefresh, lastUpdated, dateRange, onDateRangeChange }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold gradient-text">Indicadores de chamados - Grupo Elyon</h1>
        <p className="text-muted-foreground mt-1">Análises e insights em tempo real</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="hidden sm:inline">Ultima atualização: {lastUpdated.toLocaleTimeString()}</span>
        </div>
        <DateRangeFilter value={dateRange} onChange={onDateRangeChange} />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          className="border-border hover:bg-secondary hover:text-accent"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>
    </div>
  );
};
