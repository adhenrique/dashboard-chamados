import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  variant: 'primary' | 'accent' | 'success';
  loading: boolean;
}

export const KPICard = ({
  title,
  value,
  icon: Icon,
  trend,
  variant,
  loading = false,
}: KPICardProps) => {
  const variantStyles = {
    primary: 'text-primary',
    accent: 'text-accent',
    success: 'text-success',
  };

  const bgStyles = {
    primary: 'bg-primary/10',
    accent: 'bg-accent/10',
    success: 'bg-success/10',
  };

  return (
    <div className="glass-card animate-fade-in relative p-6" style={{ animationDelay: '0.2s' }}>
      {loading && (
        <div className="absolute left-0 top-0 h-[100%] w-[100%] rounded-xl bg-white bg-opacity-70"></div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`mt-2 text-4xl font-bold ${variantStyles[variant]}`}>
            {value.toLocaleString()}
          </p>
          {trend !== undefined && (
            <p className={`mt-2 text-sm ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% da semana passada
            </p>
          )}
        </div>
        <div className={`rounded-lg p-3 ${bgStyles[variant]}`}>
          <Icon className={`h-6 w-6 ${variantStyles[variant].split(' ')[0]}`} />
        </div>
      </div>
    </div>
  );
};
