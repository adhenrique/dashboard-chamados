import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
    PieLabelRenderProps,
} from 'recharts';

interface DailyResolutionData {
    name: string;
    value: number;
}

interface DailyResolutionRateChartProps {
    data: DailyResolutionData[];
}

const RADIAN = Math.PI / 180;
const COLORS = ['hsl(var(--success))', 'hsl(var(--accent))'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
    if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
        return null;
    }

    // @ts-expect-error as variáveis podem ser numero ou string
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const ncx = Number(cx);
    const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const ncy = Number(cy);
    const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central">
            {`${((percent ?? 1) * 100).toFixed(0)}%`}
        </text>
    );
};

export const DailyResolutionRateChart = ({ data }: DailyResolutionRateChartProps) => {
    return (
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Taxa de resolução no mesmo dia
            </h3>
            <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="40%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            nameKey="name"
                            labelLine={false}
                            label={renderCustomizedLabel}
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
}