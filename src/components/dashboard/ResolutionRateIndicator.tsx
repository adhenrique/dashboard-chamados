import { CheckCircle2 } from 'lucide-react';

interface ResolutionRateIndicatorProps {
  rate: number;
    loading: boolean;
}

export const ResolutionRateIndicator = ({ rate, loading }: ResolutionRateIndicatorProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in relative" style={{ animationDelay: '0.6s' }}>
      {loading && <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-white bg-opacity-70 rounded-xl z-40"></div>}
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Taxa de resolução</h3>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center glow-success">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
        </div>
        <div>
          <p className="text-4xl font-bold text-success">{rate}%</p>
          <p className="text-sm text-muted-foreground mt-1">Tickets resolvidos com sucesso</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-success rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>
    </div>
  );
};
