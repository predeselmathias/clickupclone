import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ASSIGNEES } from '@/lib/data';

interface Props {
  assigneeIds: string[];
  size?: 'sm' | 'md';
  showName?: boolean;
  className?: string;
  max?: number;
}

export function AssigneeAvatar({ assigneeIds, size = 'sm', showName = false, className, max = 3 }: Props) {
  const ids = Array.isArray(assigneeIds) ? assigneeIds : [assigneeIds];
  const people = ids
    .map((id) => ASSIGNEES.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  if (people.length === 0) return null;

  const dimensions = size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-xs';
  const ring = 'ring-2 ring-background dark:ring-card';
  const overflow = people.length - max;

  if (showName) {
    const first = people[0];
    const extra = people.length > 1 ? ` +${people.length - 1}` : '';
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Avatar className={cn(dimensions, 'ring-1 ring-white/40 dark:ring-white/10')}>
          <AvatarFallback className={cn(first.color, 'text-white font-semibold')}>
            {first.initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-foreground">
          {first.name}
          {extra}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center', className)}>
      <div className="flex -space-x-2">
        {people.slice(0, max).map((p) => (
          <Avatar key={p.id} className={cn(dimensions, ring)}>
            <AvatarFallback className={cn(p.color, 'text-white font-semibold')}>
              {p.initials}
            </AvatarFallback>
          </Avatar>
        ))}
        {overflow > 0 && (
          <div className={cn('flex items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold', dimensions, ring)}>
            +{overflow}
          </div>
        )}
      </div>
    </div>
  );
}
