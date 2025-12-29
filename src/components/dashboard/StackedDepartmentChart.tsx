import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface DepartmentData {
  department: string;
  openTickets: number;
  avgCloseTime: number;
}

interface StackedDepartmentChartProps {
  data: DepartmentData[];
}

export const StackedDepartmentChart = ({ data }: StackedDepartmentChartProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Quantidade e tempo médio de resolução por setor
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="department"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
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
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span style={{ color: 'hsl(var(--muted-foreground))' }}>{value}</span>}
            />
            <Bar
              yAxisId="left"
              dataKey="openTickets"
              stackId="a"
              fill="hsl(var(--primary))"
              name="Qtd de Tickets"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              yAxisId="left"
              dataKey="avgCloseTime"
              stackId="a"
              fill="hsl(var(--accent))"
              name="Tempo médio (hr)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
