import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface StackedData {
  name: string;
  openTickets: number;
  avgCloseTime: number;
}

interface StackedDepartmentChartProps {
  data: StackedData[];
  loading: boolean;
}

export const StackedDepartmentChart = ({ data, loading }: StackedDepartmentChartProps) => {
  return (
    <div className="glass-card animate-fade-in relative p-6" style={{ animationDelay: '0.3s' }}>
      {loading && (
        <div className="absolute left-0 top-0 z-40 h-[100%] w-[100%] rounded-xl bg-white bg-opacity-70"></div>
      )}
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">
        Quantidade e tempo médio de resolução por setor
      </h3>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />

            {/* Eixo X com rotação para nomes longos */}
            <XAxis
              dataKey="name"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />

            {/* Eixo Y da Esquerda (Quantidade) */}
            <YAxis
              yAxisId="left"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              label={{
                value: 'Qtd Tickets',
                angle: -90,
                position: 'insideLeft',
                style: { fill: 'hsl(var(--muted-foreground))', fontSize: 10 },
              }}
            />

            {/* Eixo Y da Direita (Tempo) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              unit="h"
            />

            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
              cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
            />

            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => (
                <span style={{ color: 'hsl(var(--muted-foreground))' }}>{value}</span>
              )}
            />

            {/* BARRAS: Volume de Tickets (Eixo Esquerdo) */}
            <Bar
              yAxisId="left"
              dataKey="openTickets"
              fill="hsl(var(--primary))"
              name="Qtd de Tickets"
              radius={[4, 4, 0, 0]}
              barSize={30} // Largura fixa para ficar elegante
            />

            {/* LINHA: Tempo Médio (Eixo Direito) */}
            <Line
              yAxisId="right"
              type="monotone" // Curva suave
              dataKey="avgCloseTime"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              name="Tempo médio (hr)"
              dot={{ r: 4, fill: 'hsl(var(--accent))' }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
