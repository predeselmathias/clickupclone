import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PRIORITIES, STATUSES, ASSIGNEES, type Status, type Priority } from '@/lib/data';
import { AssigneeAvatar } from '@/components/AssigneeAvatar';
import { Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterState {
  statuses: Status[];
  priorities: Priority[];
  assigneeIds: string[];
}

export const EMPTY_FILTERS: FilterState = { statuses: [], priorities: [], assigneeIds: [] };

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function FilterPopover({ filters, onChange }: Props) {
  const activeCount =
    filters.statuses.length + filters.priorities.length + filters.assigneeIds.length;
  const hasFilters = activeCount > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn('gap-2', hasFilters ? 'border-brand text-brand' : 'text-muted-foreground')}>
          <Filter className="h-3.5 w-3.5" /> Filter
          {hasFilters && <Badge className="ml-1 bg-brand text-white">{activeCount}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="text-sm font-semibold">Filters</span>
          {hasFilters && (
            <button
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              onClick={() => onChange(EMPTY_FILTERS)}
            >
              <X className="h-3 w-3" /> Clear all
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto scrollbar-thin">
          <Section title="Status">
            {STATUSES.map((s) => (
              <FilterRow
                key={s.value}
                checked={filters.statuses.includes(s.value)}
                onClick={() => onChange({ ...filters, statuses: toggle(filters.statuses, s.value) })}
              >
                <span className={cn('h-2 w-2 rounded-full', s.color)} />
                {s.label}
              </FilterRow>
            ))}
          </Section>
          <Separator />
          <Section title="Priority">
            {PRIORITIES.map((p) => (
              <FilterRow
                key={p.value}
                checked={filters.priorities.includes(p.value)}
                onClick={() => onChange({ ...filters, priorities: toggle(filters.priorities, p.value) })}
              >
                <span className={cn('h-2 w-2 rounded-full', p.dot)} />
                <span className={p.color}>{p.label}</span>
              </FilterRow>
            ))}
          </Section>
          <Separator />
          <Section title="Assignee">
            {ASSIGNEES.map((a) => (
              <FilterRow
                key={a.id}
                checked={filters.assigneeIds.includes(a.id)}
                onClick={() => onChange({ ...filters, assigneeIds: toggle(filters.assigneeIds, a.id) })}
              >
                <AssigneeAvatar assigneeIds={[a.id]} size="md" />
                <span>{a.name}</span>
              </FilterRow>
            ))}
          </Section>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-2 py-2">
      <div className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function FilterRow({ checked, onClick, children }: { checked: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
    >
      <Checkbox checked={checked} className="data-[state=checked]:bg-brand data-[state=checked]:border-brand" />
      <span className="flex items-center gap-2 flex-1">{children}</span>
    </button>
  );
}
