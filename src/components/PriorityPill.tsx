import { cn } from '@/lib/utils';
import { PRIORITIES, type Priority } from '@/lib/data';
import { ArrowUp, ArrowDown, Minus, Flame } from 'lucide-react';

const ICONS: Record<Priority, typeof ArrowUp> = {
  urgent: Flame,
  high: ArrowUp,
  normal: Minus,
  low: ArrowDown,
};

export function PriorityPill({ priority, showLabel = false, className }: { priority: Priority; showLabel?: boolean; className?: string }) {
  const p = PRIORITIES.find((x) => x.value === priority)!;
  const Icon = ICONS[priority];
  return (
    <div className={cn('inline-flex items-center gap-1.5 text-xs font-medium', p.color, className)}>
      <Icon className="h-3.5 w-3.5" />
      {showLabel && <span>{p.label}</span>}
    </div>
  );
}
