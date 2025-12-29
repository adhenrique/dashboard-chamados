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
}

export const TicketHeatMap = ({ data }: TicketHeatMapProps) => {
  const getDynamicStyle = (value: number) => {
    if (value === 0) {
      return { backgroundColor: 'rgba(243, 244, 246, 1)' };
    }

    const intensity = Math.min(value / HEATMAP_CONFIG.MAX_VALUE, 1);
    const adjustedAlpha = (intensity * 0.8) + 0.2;

    return {
      backgroundColor: `hsl(var(--primary) / ${adjustedAlpha})`,
    };
  };

  const hours = [1, 5, 9, 13, 17, 21];

  return (
      <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Mapa de calor do volume de chamados
          </h3>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
          Max: {HEATMAP_CONFIG.MAX_VALUE} chamados
        </span>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour labels */}
            <div className="flex mb-2 ml-12">
              {hours.map((hour) => (
                  <div key={hour} className="flex-1 text-center text-xs text-muted-foreground">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
              ))}
            </div>

            {/* Heat map grid */}
            {data.map((dayData) => (
                <div key={dayData.day} className="flex items-center mb-1">
                  <span className="w-12 text-xs text-muted-foreground">{dayData.day}</span>
                  <div className="flex-1 flex gap-1">
                    {dayData.hours.map((hourData) => (
                        <Tooltip key={hourData.hour}>
                          <TooltipTrigger asChild>
                            <div
                                style={getDynamicStyle(hourData.value)}
                                className="flex-1 h-8 rounded-sm cursor-pointer transition-all hover:brightness-90 hover:scale-[1.02]"
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">
                              <span className="font-semibold">{dayData.day} - {hourData.hour}h</span>
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
            <div className="flex items-center justify-end mt-6 gap-3">
              <span className="text-xs text-muted-foreground">0</span>

              {/* Barra de Gradiente Visual para representar a escala */}
              <div
                  className="h-3 w-32 rounded-full"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(var(--primary) / 0.1), 
                      hsl(var(--primary) / 1))`
                  }}
              />

              <span className="text-xs text-muted-foreground">{HEATMAP_CONFIG.MAX_VALUE}+</span>
            </div>
          </div>
        </div>
      </div>
  );
};