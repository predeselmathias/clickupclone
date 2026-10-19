import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STATUSES, PRIORITIES, type Status, type Priority } from '@/lib/data';
import { CheckCircle2, Trash2, X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  count: number;
  onClear: () => void;
  onSetStatus: (s: Status) => void;
  onSetPriority: (p: Priority) => void;
  onAdvance: () => void;
  onDelete: () => void;
}

export function BulkActionBar({ count, onClear, onSetStatus, onSetPriority, onAdvance, onDelete }: Props) {
  if (count === 0) return null;
  return (
    <div className="absolute left-1/2 top-4 z-20 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-lg animate-fade-in">
      <span className="text-sm font-medium px-1">{count} selected</span>
      <div className="h-5 w-px bg-border" />

      <Button size="sm" variant="ghost" className="gap-1.5 h-8" onClick={onAdvance}>
        <ArrowRight className="h-3.5 w-3.5" /> Advance status
      </Button>

      <Select onValueChange={(v) => onSetStatus(v as Status)}>
        <SelectTrigger className="h-8 w-36">
          <SelectValue placeholder="Set status" />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              <span className="inline-flex items-center gap-2">
                <span className={cn('h-1.5 w-1.5 rounded-full', s.color)} />
                {s.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(v) => onSetPriority(v as Priority)}>
        <SelectTrigger className="h-8 w-36">
          <SelectValue placeholder="Set priority" />
        </SelectTrigger>
        <SelectContent>
          {PRIORITIES.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              <span className={cn('inline-flex items-center gap-2', p.color)}>
                <span className={cn('h-1.5 w-1.5 rounded-full', p.dot)} />
                {p.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button size="sm" variant="ghost" className="gap-1.5 h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onDelete}>
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </Button>

      <div className="h-5 w-px bg-border" />
      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onClear}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
