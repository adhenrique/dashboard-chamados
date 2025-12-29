import { ComposedChart, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    Bar,
    Line, } from 'recharts';
import {minutesToHHMM} from "@/lib/utils.ts";

interface MonthlyData {
  month: string;
  tickets: number;
}

interface MonthlyComparisonChartProps {
  data: MonthlyData[];
}

export const MonthlyComparisonChart = ({ data }: MonthlyComparisonChartProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Volume mensal (Ultimos 4 meses)
      </h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Area
              type="linear"
              dataKey="tickets"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTickets)"
              name="Tickets"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
