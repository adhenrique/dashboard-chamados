import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryData {
  category: string;
  count: number;
}

interface CategoryVolumeChartProps {
  data: CategoryData[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--success))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--muted-foreground))',
];

export const CategoryVolumeChart = ({ data }: CategoryVolumeChartProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.7s' }}>
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Ticket Volume by Category
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="40%"
              cy="50%"
              outerRadius={80}
              dataKey="count"
              nameKey="category"
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Legend 
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => (
                <span style={{ color: 'hsl(var(--muted-foreground))', fontSize: '12px' }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
