import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { STATUSES, type Status } from '@/lib/data';

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const s = STATUSES.find((x) => x.value === status)!;
  return (
    <Badge variant="outline" className={cn(s.badge, 'gap-1.5 font-medium', className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', s.color)} />
      {s.label}
    </Badge>
  );
}
