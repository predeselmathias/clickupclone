import { useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowRight, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task, Status, Priority } from '@/lib/data';
import { nextStatusLabel } from '@/lib/data';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityPill } from '@/components/PriorityPill';
import { DueDate } from '@/components/DueDate';
import { AssigneeAvatar } from '@/components/AssigneeAvatar';
import { BulkActionBar } from '@/components/BulkActionBar';

interface Props {
  tasks: Task[];
  onOpenTask: (id: string) => void;
  onAdvanceStatus: (id: string) => void;
  compact?: boolean;
  selected: Set<string>;
  onSelect: (sel: Set<string>) => void;
  onBulkStatus: (ids: string[], s: Status) => void;
  onBulkPriority: (ids: string[], p: Priority) => void;
  onBulkAdvance: (ids: string[]) => void;
  onBulkDelete: (ids: string[]) => void;
}

export function ListView({
  tasks,
  onOpenTask,
  onAdvanceStatus,
  compact,
  selected,
  onSelect,
  onBulkStatus,
  onBulkPriority,
  onBulkAdvance,
  onBulkDelete,
}: Props) {
  // Clear selection when the task list changes identity
  useEffect(() => {
    onSelect(new Set());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    onSelect(next);
  };

  const clear = () => onSelect(new Set());
  const selectedArr = Array.from(selected);
  const allSelected = tasks.length > 0 && selected.size === tasks.length;

  return (
    <div className="relative h-full overflow-auto scrollbar-thin">
      <BulkActionBar
        count={selected.size}
        onClear={clear}
        onSetStatus={(s) => { onBulkStatus(selectedArr, s); clear(); }}
        onSetPriority={(p) => { onBulkPriority(selectedArr, p); clear(); }}
        onAdvance={() => { onBulkAdvance(selectedArr); clear(); }}
        onDelete={() => { onBulkDelete(selectedArr); clear(); }}
      />

      <div className="min-w-[820px]">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(v) => onSelect(v ? new Set(tasks.map((t) => t.id)) : new Set())}
                />
              </TableHead>
              <TableHead className="w-[38%]">
                <button className="inline-flex items-center gap-1 font-medium">
                  Task Name <ArrowUpDown className="h-3 w-3 opacity-40" />
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Assignees</TableHead>
              <TableHead className="w-10 pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                  No tasks match your filters.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => {
                const isSel = selected.has(task.id);
                const isDone = task.status === 'done';
                return (
                  <TableRow
                    key={task.id}
                    onClick={() => onOpenTask(task.id)}
                    className={cn(
                      'group cursor-pointer border-border/60 transition-colors',
                      isSel ? 'bg-brand/5' : 'hover:bg-muted/40'
                    )}
                  >
                    <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={isSel} onCheckedChange={() => toggle(task.id)} />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className={cn('truncate', isDone && 'text-muted-foreground line-through')}>
                          {task.name}
                        </span>
                        {task.tags?.[0] && (
                          <span className="hidden sm:inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {task.tags[0]}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={task.status} />
                    </TableCell>
                    <TableCell>
                      <PriorityPill priority={task.priority} showLabel />
                    </TableCell>
                    <TableCell>
                      <DueDate date={task.dueDate} />
                    </TableCell>
                    <TableCell className="pr-4">
                      <AssigneeAvatar assigneeIds={task.assigneeIds} />
                    </TableCell>
                    <TableCell className="pr-4" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onAdvanceStatus(task.id)}
                        disabled={isDone}
                        title={isDone ? 'Already done' : `Move to ${nextStatusLabel(task.status)}`}
                        className={cn(
                          'inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                          isDone
                            ? 'text-muted-foreground/40 cursor-not-allowed'
                            : 'text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-brand/10 hover:text-brand'
                        )}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {tasks.length > 0 && (
        <div className="px-4 py-3 text-xs text-muted-foreground">
          {selected.size > 0 ? `${selected.size} selected` : `${tasks.length} tasks`} · Click a row for details · Hover for quick advance
        </div>
      )}
    </div>
  );
}
