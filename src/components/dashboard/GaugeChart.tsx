import { useEffect, useState } from 'react';

interface GaugeChartProps {
  value: number;
  label: string;
}

export const GaugeChart = ({ value, label }: GaugeChartProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const gaugeSize = 180;
  const maxStroke = (gaugeSize / 360) * circumference;
  const visualValue = Math.min(animatedValue, 100);
  const strokeDashoffset = maxStroke - (visualValue / 100) * maxStroke;

  const getColor = (val: number) => {
    if (val >= 80) return 'hsl(var(--destructive))';
    if (val >= 50) return 'hsl(var(--accent))';
    return 'hsl(var(--success))';
  };

  return (
      <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">{label}</h3>
        <div className="relative flex flex-col items-center justify-center">
          <svg
              width="160"
              height="80"
              viewBox="0 0 120 60"
              className="overflow-visible"
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={getColor(value)} stopOpacity="0.5" />
                <stop offset="100%" stopColor={getColor(value)} stopOpacity="1" />
              </linearGradient>
            </defs>
            <g transform="rotate(180, 60, 60)">
              <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${maxStroke} ${circumference}`}
              />
              <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={getColor(value)}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${maxStroke} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: `drop-shadow(0 0 4px ${getColor(value)})`,
                  }}
              />
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
            <span className="text-4xl font-bold text-foreground">{animatedValue}%</span>
            <span className="text-xs text-muted-foreground mt-1">Aceleração</span>
          </div>
        </div>
      </div>
  );
};