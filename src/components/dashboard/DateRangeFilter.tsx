import { useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, subWeeks, subMonths, subYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange as DayPickerRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
  label: string;
};

const presets = [
  { label: 'Hoje', getValue: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
  { label: 'Ontem', getValue: () => { const d = subDays(new Date(), 1); return { from: startOfDay(d), to: endOfDay(d) }; } },
  { label: 'Esta Semana', getValue: () => ({ from: startOfWeek(new Date(), { locale: ptBR }), to: endOfWeek(new Date(), { locale: ptBR }) }) },
  { label: 'Mês Atual', getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }) },
  { label: 'Mês Passado', getValue: () => { const d = subMonths(new Date(), 1); return { from: startOfMonth(d), to: endOfMonth(d) }; } },
  { label: 'Ano Atual', getValue: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }) },
];

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export const DateRangeFilter = ({ value, onChange }: DateRangeFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [range, setRange] = useState<DayPickerRange | undefined>({
    from: value.from,
    to: value.to
  });

  const handlePresetSelect = (preset: typeof presets[0]) => {
    const { from, to } = preset.getValue();
    const newRange = { from, to };
    setRange(newRange);
    onChange({ ...newRange, label: preset.label });
    setIsOpen(false);
  };

  const handleApply = () => {
    if (range?.from && range?.to) {
      onChange({
        from: range.from,
        to: range.to,
        label: `${format(range.from, 'dd/MM/yy')} - ${format(range.to, 'dd/MM/yy')}`,
      });
      setIsOpen(false);
    }
  };

  return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="justify-start text-left font-normal border-border hover:bg-secondary hover:text-accent">
            <CalendarDays className="mr-2 h-4 w-4" />
            {value.label || "Selecionar período"}
            <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0 flex flex-col md:flex-row">
          <div className="flex flex-col border-b md:border-b-0 md:border-r border-border p-2 bg-muted/20">
            <p className="text-[10px] font-bold uppercase text-muted-foreground px-3 py-2">Atalhos</p>
            {presets.map((preset) => (
                <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "justify-start font-normal my-[2px]",
                        value.label === preset.label && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => handlePresetSelect(preset)}
                >
                  {preset.label}
                </Button>
            ))}
          </div>

          <div className="p-3">
            <Calendar
                initialFocus
                mode="range"
                numberOfMonths={2}
                defaultMonth={range?.to || new Date()}
                selected={range}
                onSelect={setRange}
            />
            <div className="flex items-center justify-end gap-2 mt-4 border-t pt-4">
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button
                  size="sm"
                  onClick={handleApply}
                  disabled={!range?.from || !range?.to}
              >
                Aplicar
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
  );
};