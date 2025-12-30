import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

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
    <div className="glass-card animate-fade-in relative p-6" style={{ animationDelay: '0.4s' }}>
      {loading && (
        <div className="absolute left-0 top-0 z-40 h-[100%] w-[100%] rounded-xl bg-white bg-opacity-70"></div>
      )}
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">
        Volume mensal (Ultimos 4 meses)
      </h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
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
