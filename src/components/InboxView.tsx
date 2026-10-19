import { useMemo } from 'react';
import { formatDistanceToNow, isPast, isToday } from 'date-fns';
import { Bell, CheckCircle2, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/lib/data';
import { LISTS, FOLDERS, SPACES, ASSIGNEES } from '@/lib/data';
import { StatusBadge } from '@/components/StatusBadge';
import { PriorityPill } from '@/components/PriorityPill';
import { AssigneeAvatar } from '@/components/AssigneeAvatar';
import { Button } from '@/components/ui/button';

interface Props {
  tasks: Task[];
  onOpenTask: (id: string) => void;
}

interface InboxItem {
  task: Task;
  type: 'overdue' | 'due-today' | 'due-soon' | 'assigned';
  message: string;
  priority: number;
}

export function InboxView({ tasks, onOpenTask }: Props) {
  const items = useMemo<InboxItem[]>(() => {
    const now = new Date();
    const out: InboxItem[] = [];
    for (const task of tasks) {
      const due = new Date(task.dueDate);
      if (task.status !== 'done') {
        if (isPast(due) && !isToday(due)) {
          out.push({ task, type: 'overdue', message: 'Task is overdue', priority: 0 });
        } else if (isToday(due)) {
          out.push({ task, type: 'due-today', message: 'Due today', priority: 1 });
        } else {
          const diff = due.getTime() - now.getTime();
          if (diff < 3 * 86400000) {
            out.push({ task, type: 'due-soon', message: `Due in ${formatDistanceToNow(due)}`, priority: 2 });
          }
        }
      }
    }
    return out.sort((a, b) => a.priority - b.priority || new Date(a.task.dueDate).getTime() - new Date(b.task.dueDate).getTime());
  }, [tasks]);

  const listName = (id: string) => LISTS.find((l) => l.id === id)?.name ?? 'Unknown';
  const spaceFor = (listId: string) => {
    const l = LISTS.find((x) => x.id === listId);
    const f = l && FOLDERS.find((x) => x.id === l.folderId);
    const s = f && SPACES.find((x) => x.id === f.spaceId);
    return s?.name ?? '';
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="mx-auto max-w-2xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Inbox</h2>
          <p className="text-sm text-muted-foreground">
            {items.length > 0 ? `${items.length} item${items.length === 1 ? '' : 's'} need your attention.` : "You're all caught up!"}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <p className="mt-3 text-sm font-medium">Nothing in your inbox</p>
            <p className="text-xs text-muted-foreground">Overdue and upcoming tasks will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map(({ task, type, message }) => {
              const icon =
                type === 'overdue' ? <AlertCircle className="h-4 w-4 text-red-500" /> :
                type === 'due-today' ? <Clock className="h-4 w-4 text-amber-500" /> :
                <Bell className="h-4 w-4 text-blue-500" />;
              return (
                <button
                  key={task.id}
                  onClick={() => onOpenTask(task.id)}
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-brand/30 hover:shadow-sm"
                >
                  <div className="mt-0.5">{icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{task.name}</span>
                      <span className={cn(
                        'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                        type === 'overdue' ? 'bg-red-50 text-red-700' : type === 'due-today' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'
                      )}>
                        {message}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{spaceFor(task.listId)} · {listName(task.listId)}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <StatusBadge status={task.status} />
                      <PriorityPill priority={task.priority} showLabel />
                      <span className="ml-auto"><AssigneeAvatar assigneeId={task.assigneeId} /></span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
