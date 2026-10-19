import { format, isPast, isToday, isThisWeek } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarClock } from 'lucide-react';

export function DueDate({ date, className, showTime = false }: { date: string; className?: string; showTime?: boolean }) {
  const d = new Date(date);
  const overdue = isPast(d) && !isToday(d);
  const today = isToday(d);
  const soon = !overdue && !today && isThisWeek(d);
  const hasTime = date.includes('T');

  const label = hasTime
    ? showTime
      ? format(d, 'MMM d · HH:mm')
      : format(d, 'MMM d')
    : format(d, 'MMM d');

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium',
        overdue && 'text-red-600',
        today && 'text-amber-600',
        soon && 'text-blue-600',
        !overdue && !today && !soon && 'text-muted-foreground',
        className
      )}
    >
      <CalendarClock className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}
