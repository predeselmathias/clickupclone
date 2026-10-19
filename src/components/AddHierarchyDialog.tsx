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
import { Folder, List, Plus } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Space } from '@/lib/data';

export type AddKind = 'space' | 'folder' | 'list';

const SPACE_ICONS = ['Package', 'Code2', 'Megaphone', 'Settings2', 'Briefcase', 'FlaskConical', 'GraduationCap', 'HeartPulse', 'Palette', 'Wallet'];
const SPACE_COLORS = ['text-blue-500', 'text-emerald-500', 'text-amber-500', 'text-purple-500', 'text-rose-500', 'text-cyan-500', 'text-orange-500', 'text-pink-500', 'text-teal-500', 'text-indigo-500'];
const FOLDER_ICONS = ['Map', 'MessageSquare', 'Server', 'Layout', 'Rocket', 'Building2', 'Archive', 'Box', 'Inbox', 'Folder'];
const LIST_ICONS = ['Sparkles', 'Bug', 'Search', 'ClipboardList', 'Mic', 'Plug', 'Database', 'Component', 'Gauge', 'Rocket', 'PenTool', 'Users', 'ListTodo', 'Flag', 'Target', 'Calendar'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: AddKind | null;
  parentId?: string;
  spaces: Space[];
  onCreate: (kind: AddKind, name: string, parentId: string, icon: string, color: string) => void;
}

function IconPicker({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-8 gap-1.5">
      {options.map((name) => {
        const C = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ?? Icons.Hash;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
              value === name ? 'border-brand bg-brand/10 text-brand' : 'border-border text-muted-foreground hover:bg-accent'
            )}
          >
            <C className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}

function ColorPicker({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((color) => {
        const C = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[color.replace('text-', '').replace('-500', '').charAt(0).toUpperCase() + color.replace('text-', '').replace('-500', '').slice(1)] ?? Icons.Circle;
        return (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full border-2 transition',
              value === color ? 'border-foreground' : 'border-transparent'
            )}
          >
            <C className={cn('h-4 w-4', color)} />
          </button>
        );
      })}
    </div>
  );
}

export function AddHierarchyDialog({ open, onOpenChange, kind, parentId, spaces, onCreate }: Props) {
  const [name, setName] = useState('');
  const [selectedParent, setSelectedParent] = useState(parentId ?? spaces[0]?.id ?? '');
  const [icon, setIcon] = useState('Package');
  const [color, setColor] = useState(SPACE_COLORS[0]);

  useEffect(() => {
    if (open) {
      setName('');
      setSelectedParent(parentId ?? spaces[0]?.id ?? '');
      setIcon(kind === 'space' ? 'Package' : kind === 'folder' ? 'Map' : 'ListTodo');
      setColor(SPACE_COLORS[0]);
    }
  }, [open, kind, parentId, spaces]);

  const icons = kind === 'space' ? SPACE_ICONS : kind === 'folder' ? FOLDER_ICONS : LIST_ICONS;
  const title = kind === 'space' ? 'New Space' : kind === 'folder' ? 'New Folder' : 'New List';
  const desc =
    kind === 'space'
      ? 'Create a new space to group related work.'
      : kind === 'folder'
      ? 'Create a folder inside a space.'
      : 'Create a list inside a folder.';

  const submit = () => {
    if (!name.trim() || !kind) return;
    onCreate(kind, name.trim(), selectedParent, icon, color);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {kind === 'folder' ? <Folder className="h-4 w-4 text-brand" /> : kind === 'list' ? <List className="h-4 w-4 text-brand" /> : <Plus className="h-4 w-4 text-brand" />}
            {title}
          </DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={kind === 'space' ? 'e.g. Design' : kind === 'folder' ? 'e.g. Sprint 12' : 'e.g. Backlog'}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
            />
          </div>

          {kind === 'folder' && (
            <div className="grid gap-2">
              <Label>Space</Label>
              <Select value={selectedParent} onValueChange={setSelectedParent}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {spaces.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Icon</Label>
            <IconPicker options={icons} value={icon} onChange={setIcon} />
          </div>

          {kind === 'space' && (
            <div className="grid gap-2">
              <Label>Color</Label>
              <ColorPicker options={SPACE_COLORS} value={color} onChange={setColor} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!name.trim()} className="bg-brand text-white hover:bg-brand/90">
            Create {kind === 'space' ? 'space' : kind === 'folder' ? 'folder' : 'list'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
