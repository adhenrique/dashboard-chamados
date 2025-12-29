import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  variant: 'primary' | 'accent' | 'success';
}

export const KPICard = ({ title, value, icon: Icon, trend, variant }: KPICardProps) => {
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
    <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-4xl font-bold mt-2 ${variantStyles[variant]}`}>
            {value.toLocaleString()}
          </p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trend >= 0 ? 'text-success' : 'text-destructive'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% da semana passada
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${bgStyles[variant]}`}>
          <Icon className={`w-6 h-6 ${variantStyles[variant].split(' ')[0]}`} />
        </div>
      </div>
    </div>
  );
};
