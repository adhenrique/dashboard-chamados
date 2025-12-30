import { CheckCircle2 } from 'lucide-react';

interface ResolutionRateIndicatorProps {
  rate: number;
  loading: boolean;
}

export const ResolutionRateIndicator = ({ rate, loading }: ResolutionRateIndicatorProps) => {
  return (
    <div className="glass-card animate-fade-in relative p-6" style={{ animationDelay: '0.6s' }}>
      {loading && (
        <div className="absolute left-0 top-0 z-40 h-[100%] w-[100%] rounded-xl bg-white bg-opacity-70"></div>
      )}
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">Taxa de resolução</h3>
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="glow-success flex h-20 w-20 items-center justify-center rounded-full bg-success/20">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
        </div>
        <div>
          <p className="text-4xl font-bold text-success">{rate}%</p>
          <p className="mt-1 text-sm text-muted-foreground">Tickets resolvidos com sucesso</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-success transition-all duration-1000 ease-out"
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>
    </div>
  );
};
