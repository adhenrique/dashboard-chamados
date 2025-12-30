import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface DepartmentData {
  name: string;
  value: number;
}

interface Top5DepartmentChartProps {
  data: DepartmentData[];
}

export const Top5DepartmentChart = ({ data }: Top5DepartmentChartProps) => {
  return (
    <div className="glass-card animate-fade-in p-6" style={{ animationDelay: '0.4s' }}>
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">Top 5 Áreas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 16, right: 24, left: 40, bottom: 16 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis type="number" />

          <YAxis type="category" dataKey="name" width={120} />

          <Tooltip />

          <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
