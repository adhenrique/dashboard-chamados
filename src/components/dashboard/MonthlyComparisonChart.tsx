import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';

interface MonthlyData {
  month: string;
  tickets: number;
}

interface MonthlyComparisonChartProps {
  data: MonthlyData[];
    loading: boolean;
}

export const MonthlyComparisonChart = ({ data, loading }: MonthlyComparisonChartProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in relative" style={{ animationDelay: '0.4s' }}>
        {loading && <div className="absolute top-0 left-0 w-[100%] h-[100%] bg-white bg-opacity-70 rounded-xl z-40"></div>}
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Volume mensal (Ultimos 4 meses)
      </h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
            <Area
              type="linear"
              dataKey="tickets"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTickets)"
              name="Tickets"
            >
                <LabelList
                    dataKey="tickets"
                    position="top"
                    fill="hsl(var(--foreground))"
                    fontSize={12}
                />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
