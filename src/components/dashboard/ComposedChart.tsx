import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Line,
    ComposedChart
} from 'recharts';
import {minutesToHHMM} from "@/lib/utils.ts";

interface DepartmentData {
  department: string;
  openTickets: number;
  avgCloseTime: number;
}

interface StackedDepartmentChartProps {
  data: DepartmentData[];
}

export const ComposedDepartmentChart = ({ data }: StackedDepartmentChartProps) => {
  return (
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Quantidade e tempo médio de resolução por setor
      </h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="department" />

                {/* Eixo da esquerda → Quantidade */}
                <YAxis yAxisId="left"/>

                {/* Eixo da direita → Tempo médio */}
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={minutesToHHMM}
                />

                <Tooltip
                    formatter={(value, name) => {
                        if (name === "Tempo médio de fechamento") {
                            return [minutesToHHMM(Number(value)), "Tempo médio"];
                        }
                        return [value, name];
                    }}
                />
                <Legend />

                {/* Barras */}
                <Bar
                    yAxisId="left"
                    dataKey="openTickets"
                    name="Total de chamados"
                    fill="hsl(var(--primary))"
                />

                {/* Linha */}
                <Line
                    yAxisId="right"
                    type="linear"
                    dataKey="avgCloseTime"
                    name="Tempo médio de fechamento"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                />
            </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
