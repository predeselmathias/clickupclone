import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ASSIGNEES,
  PRIORITIES,
  STATUSES,
  CURRENT_USER_ID,
  type Priority,
  type Status,
} from '@/lib/data';
import { AssigneeAvatar } from '@/components/AssigneeAvatar';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NewTaskData {
  name: string;
  status: Status;
  priority: Priority;
  dueDate: string;
  assigneeIds: string[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: NewTaskData) => void;
  listName: string;
  initialStatus?: Status;
}

const CREATABLE_STATUSES = STATUSES.filter((s) => s.value !== 'done');

function parseDateAndTime(iso: string): { date: Date; time: string } {
  const [d, t] = iso.split('T');
  return { date: new Date(d), time: t ?? '17:00' };
}

export function NewTaskDialog({ open, onOpenChange, onCreate, listName, initialStatus }: Props) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<Status>(initialStatus ?? 'todo');
  const [priority, setPriority] = useState<Priority>('normal');
  const { date: initialDate, time: initialTime } = parseDateAndTime(
    format(new Date(Date.now() + 7 * 86400000), "yyyy-MM-dd'T'17:00")
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(initialDate);
  const [dueTime, setDueTime] = useState<string>(initialTime);
  const [assigneeIds, setAssigneeIds] = useState<string[]>([CURRENT_USER_ID]);

  const reset = () => {
    setName('');
    setStatus(initialStatus ?? 'todo');
    setPriority('normal');
    setDueDate(initialDate);
    setDueTime(initialTime);
    setAssigneeIds([CURRENT_USER_ID]);
  };

  useEffect(() => {
    if (open && initialStatus) setStatus(initialStatus);
  }, [open, initialStatus]);

  const toggleAssignee = (id: string) => {
    setAssigneeIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const submit = () => {
    if (!name.trim()) return;
    const dateStr = dueDate ? format(dueDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    onCreate({
      name: name.trim(),
      status,
      priority,
      dueDate: `${dateStr}T${dueTime}`,
      assigneeIds: assigneeIds.length ? assigneeIds : [CURRENT_USER_ID],
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-brand" />
            New Task
          </DialogTitle>
          <DialogDescription>
            Add a task to <span className="font-medium text-foreground">{listName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="task-name">Task name</Label>
            <Input
              id="task-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Improve onboarding flow"
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CREATABLE_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      <span className="inline-flex items-center gap-2">
                        <span className={cn('h-1.5 w-1.5 rounded-full', s.color)} />
                        {s.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
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
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Due date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'MMM d, yyyy') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="due-time">Due time</Label>
              <Input
                id="due-time"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Assignees</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-between font-normal">
                  <span className="flex items-center gap-2 truncate">
                    {assigneeIds.length > 0 ? (
                      <AssigneeAvatar assigneeIds={assigneeIds} />
                    ) : (
                      <span className="text-muted-foreground">Select people…</span>
                    )}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start">
                <div className="max-h-64 overflow-y-auto scrollbar-thin p-1">
                  {ASSIGNEES.map((a) => {
                    const checked = assigneeIds.includes(a.id);
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
            {assigneeIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {assigneeIds.map((id) => {
                  const a = ASSIGNEES.find((x) => x.id === id);
                  if (!a) return null;
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs">
                      <AssigneeAvatar assigneeIds={[id]} />
                      {a.name}
                      <button
                        type="button"
                        onClick={() => toggleAssignee(id)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!name.trim()} className="bg-brand text-white hover:bg-brand/90">
            Create task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
