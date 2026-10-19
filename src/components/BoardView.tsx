import { Plus, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUSES, nextStatusLabel, type Task, type Status } from '@/lib/data';
import { PriorityPill } from '@/components/PriorityPill';
import { DueDate } from '@/components/DueDate';
import { AssigneeAvatar } from '@/components/AssigneeAvatar';
import { useState } from 'react';

interface Props {
  tasks: Task[];
  onOpenTask: (id: string) => void;
  onQuickAdd: (status: Status) => void;
  onAdvanceStatus: (id: string) => void;
}

export function BoardView({ tasks, onOpenTask, onQuickAdd, onAdvanceStatus }: Props) {
  const [hoverCol, setHoverCol] = useState<Status | null>(null);

  const byStatus = (s: Status) => tasks.filter((t) => t.status === s);

  return (
    <div className="h-full overflow-auto scrollbar-thin">
      <div className="flex min-h-full gap-4 p-4">
        {STATUSES.map((col) => {
          const status = col.value;
          const items = byStatus(status);
          const isDoneCol = status === 'done';
          return (
            <div
              key={status}
              onMouseEnter={() => setHoverCol(status)}
              onMouseLeave={() => setHoverCol(null)}
              className="flex w-72 shrink-0 flex-col rounded-xl bg-muted/40"
            >
              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', col.color)} />
                  <span className="text-sm font-semibold">{col.label}</span>
                  <span className="rounded-full bg-background px-1.5 text-[10px] font-medium text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <button
                  onClick={() => onQuickAdd(status)}
                  className={cn(
                    'text-muted-foreground hover:text-foreground transition-opacity',
                    hoverCol === status && !isDoneCol ? 'opacity-100' : 'opacity-0'
                  )}
                  title="Add task to this column"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-2 px-2 pb-2 overflow-y-auto scrollbar-thin">
                {items.map((task) => {
                  const isDone = task.status === 'done';
                  return (
                    <div
                      key={task.id}
                      className="group rounded-lg border border-border bg-card p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-brand/30"
                    >
                      <button onClick={() => onOpenTask(task.id)} className="block w-full text-left">
                        <span className="text-sm font-medium leading-snug">{task.name}</span>
                        {task.tags && task.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {task.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <PriorityPill priority={task.priority} showLabel />
                            <DueDate date={task.dueDate} />
                          </div>
                          <AssigneeAvatar assigneeIds={task.assigneeIds} />
                        </div>
                      </button>
                      {!isDone && (
                        <button
                          onClick={() => onAdvanceStatus(task.id)}
                          title={`Move to ${nextStatusLabel(task.status)}`}
                          className="mt-2 w-full rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground opacity-0 transition-all hover:border-brand/40 hover:text-brand group-hover:opacity-100 flex items-center justify-center gap-1.5"
                        >
                          <ArrowRight className="h-3 w-3" /> Move to {nextStatusLabel(task.status)}
                        </button>
                      )}
                    </div>
                  );
                })}
                {items.length === 0 && !isDoneCol && (
                  <button
                    onClick={() => onQuickAdd(status)}
                    className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-brand/40 hover:text-brand transition-colors"
                  >
                    + Add task
                  </button>
                )}
                {items.length === 0 && isDoneCol && (
                  <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                    Completed tasks land here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
