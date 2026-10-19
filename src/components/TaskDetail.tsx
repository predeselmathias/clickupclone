import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { AssigneeAvatar } from '@/components/AssigneeAvatar';
import {
  ASSIGNEES,
  PRIORITIES,
  STATUSES,
  LISTS,
  FOLDERS,
  SPACES,
  type Task,
  type Status,
  type Priority,
} from '@/lib/data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Trash2, Check, ChevronDown, ArrowRight, UserPlus } from 'lucide-react';

interface Props {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, patch: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onAdvanceStatus: (id: string) => void;
  nextStatusLabel?: string;
}

function splitDateTime(iso: string): { date: Date; time: string } {
  const [d, t] = iso.split('T');
  return { date: new Date(d), time: t ?? '17:00' };
}

export function TaskDetail({ task, open, onOpenChange, onUpdate, onDelete, onAdvanceStatus, nextStatusLabel }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setName(task?.name ?? '');
    setDescription(task?.description ?? '');
  }, [task?.id, task?.name, task?.description]);

  if (!task) return null;

  const list = LISTS.find((l) => l.id === task.listId);
  const folder = list ? FOLDERS.find((f) => f.id === list.folderId) : undefined;
  const space = folder ? SPACES.find((s) => s.id === folder.spaceId) : undefined;
  const creator = ASSIGNEES.find((a) => a.id === task.createdById);
  const { date: dueDateValue, time: dueTimeValue } = splitDateTime(task.dueDate);
  const isDone = task.status === 'done';

  const commitName = () => {
    if (name.trim() && name !== task.name) onUpdate(task.id, { name: name.trim() });
  };
  const commitDescription = () => {
    if (description !== (task.description ?? '')) onUpdate(task.id, { description });
  };

  const toggleAssignee = (id: string) => {
    const has = task.assigneeIds.includes(id);
    onUpdate(task.id, {
      assigneeIds: has ? task.assigneeIds.filter((x) => x !== id) : [...task.assigneeIds, id],
    });
  };

  const updateDue = (date?: Date, time?: string) => {
    const d = date ?? dueDateValue;
    const t = time ?? dueTimeValue;
    onUpdate(task.id, { dueDate: `${format(d, 'yyyy-MM-dd')}T${t}` });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 pt-6 pb-2">
          <SheetDescription>
            {space?.name} / {folder?.name} / {list?.name}
          </SheetDescription>
          <SheetTitle className="sr-only">{task.name}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 pb-6">
          {/* Title */}
          <textarea
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={commitName}
            rows={2}
            className="w-full resize-none rounded-md border border-transparent bg-transparent px-2 py-1 text-2xl font-semibold tracking-tight focus:border-input focus:bg-background focus:outline-none"
          />

          {/* Created by */}
          <div className="mt-1 flex items-center gap-2 px-2 text-xs text-muted-foreground">
            <span>Created by</span>
            {creator && (
              <span className="inline-flex items-center gap-1.5">
                <AssigneeAvatar assigneeIds={[creator.id]} />
                <span className="font-medium text-foreground">{creator.name}</span>
              </span>
            )}
          </div>

          {/* Attributes (single source of truth) */}
          <div className="mt-4 grid gap-3">
            <Row label="Status">
              <Select value={task.status} onValueChange={(v) => onUpdate(task.id, { status: v as Status })}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
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
            </Row>

            <Row label="Priority">
              <Select value={task.priority} onValueChange={(v) => onUpdate(task.id, { priority: v as Priority })}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
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
            </Row>

            <Row label="Assignees">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-56 justify-between font-normal">
                    <span className="flex items-center gap-2 truncate">
                      {task.assigneeIds.length > 0 ? (
                        <AssigneeAvatar assigneeIds={task.assigneeIds} />
                      ) : (
                        <span className="text-muted-foreground">No one assigned</span>
                      )}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0" align="start">
                  <div className="max-h-64 overflow-y-auto scrollbar-thin p-1">
                    {ASSIGNEES.map((a) => {
                      const checked = task.assigneeIds.includes(a.id);
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => toggleAssignee(a.id)}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                        >
                          <Checkbox checked={checked} className="data-[state=checked]:bg-brand data-[state=checked]:border-brand" />
                          <AssigneeAvatar assigneeIds={[a.id]} size="md" />
                          <span className="flex-1 text-left">{a.name}</span>
                          {checked && <Check className="h-4 w-4 text-brand" />}
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </Row>

            <Row label="Due date">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="justify-start font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dueDateValue, 'MMM d, yyyy')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDateValue}
                      onSelect={(d) => d && updateDue(d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  value={dueTimeValue}
                  onChange={(e) => updateDue(undefined, e.target.value)}
                  className="w-28"
                />
              </div>
            </Row>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="mt-5">
              <Label className="text-xs text-muted-foreground">Tags</Label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mt-6">
            <Label htmlFor="desc" className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={commitDescription}
              placeholder="Add more detail about this task…"
              className="mt-1.5 min-h-[120px]"
            />
          </div>

          {/* Quick add assignee shortcut if nobody assigned */}
          {task.assigneeIds.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full justify-center gap-2"
              onClick={() => toggleAssignee(ASSIGNEES[0].id)}
            >
              <UserPlus className="h-4 w-4" /> Assign someone
            </Button>
          )}
        </div>

        {/* Footer with advance + delete */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              onDelete(task.id);
              onOpenChange(false);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
          <Button
            size="sm"
            className="gap-2 bg-brand text-white hover:bg-brand/90"
            onClick={() => onAdvanceStatus(task.id)}
            disabled={isDone}
          >
            {isDone ? 'Completed' : `Move to ${nextStatusLabel ?? 'next'}`}
            {!isDone && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[90px_1fr] items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
