import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const HEATMAP_CONFIG = {
  MIN_VALUE: 0,
  MAX_VALUE: 12,
};

interface HeatMapData {
  day: string;
  hours: { hour: number; value: number }[];
}

interface TicketHeatMapProps {
  data: HeatMapData[];
  loading: boolean;
}

export const TicketHeatMap = ({ data, loading }: TicketHeatMapProps) => {
  const getDynamicStyle = (value: number) => {
    if (value === 0) {
      return { backgroundColor: 'rgba(243, 244, 246, 1)' };
    }

    const intensity = Math.min(value / HEATMAP_CONFIG.MAX_VALUE, 1);
    const adjustedAlpha = intensity * 0.8 + 0.2;

    return {
      backgroundColor: `hsl(var(--primary) / ${adjustedAlpha})`,
    };
  };

  const hours = [1, 5, 9, 13, 17, 21];

  return (
    <div className="glass-card animate-fade-in relative p-6" style={{ animationDelay: '0.5s' }}>
      {loading && (
        <div className="absolute left-0 top-0 z-40 h-[100%] w-[100%] rounded-xl bg-white bg-opacity-70"></div>
      )}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Mapa de calor do volume de chamados
        </h3>
        <span className="rounded bg-secondary px-2 py-1 text-xs text-muted-foreground">
          Max: {HEATMAP_CONFIG.MAX_VALUE} chamados
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour labels */}
          <div className="mb-2 ml-12 flex">
            {hours.map((hour) => (
              <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Heat map grid */}
          {data.map((dayData) => (
            <div key={dayData.day} className="mb-1 flex items-center">
              <span className="w-12 text-xs text-muted-foreground">{dayData.day}</span>
              <div className="flex flex-1 gap-1">
                {dayData.hours.map((hourData) => (
                  <Tooltip key={hourData.hour}>
                    <TooltipTrigger asChild>
                      <div
                        style={getDynamicStyle(hourData.value)}
                        className="h-8 flex-1 cursor-pointer rounded-sm transition-all hover:scale-[1.02] hover:brightness-90"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        <span className="font-semibold">
                          {dayData.day} - {hourData.hour}h
                        </span>
                        <br />
                        Volume: {hourData.value}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}

          {/* Legenda Dinâmica (Gradient) */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <span className="text-xs text-muted-foreground">0</span>

            {/* Barra de Gradiente Visual para representar a escala */}
            <div
              className="h-3 w-32 rounded-full"
              style={{
                background: `linear-gradient(to right, 
                      hsl(var(--primary) / 0.1), 
                      hsl(var(--primary) / 1))`,
              }}
            />

            <span className="text-xs text-muted-foreground">{HEATMAP_CONFIG.MAX_VALUE}+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
