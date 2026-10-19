import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Settings,
  Inbox,
  Star,
  Hash,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  WORKSPACE,
  type Space,
  type Folder,
  type List,
} from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AddKind } from '@/components/AddHierarchyDialog';

type Selection =
  | { kind: 'list'; id: string }
  | { kind: 'inbox' }
  | { kind: 'favorites' };

interface Props {
  selection: Selection;
  onSelect: (sel: Selection) => void;
  spaces: Space[];
  folders: Folder[];
  lists: List[];
  favoriteListIds: string[];
  onToggleFavorite: (listId: string) => void;
  onAdd: (kind: AddKind, parentId?: string) => void;
  onOpenSettings: () => void;
  inboxCount: number;
}

function IconByName({ name, className }: { name: string; className?: string }) {
  const C = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ?? Hash;
  return <C className={className} />;
}

export function Sidebar({
  selection,
  onSelect,
  spaces,
  folders,
  lists,
  favoriteListIds,
  onToggleFavorite,
  onAdd,
  onOpenSettings,
  inboxCount,
}: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    spaces.forEach((s) => (init[s.id] = true));
    folders.forEach((f) => (init[f.id] = true));
    return init;
  });
  const [query, setQuery] = useState('');

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));
  const activeListId = selection.kind === 'list' ? selection.id : '';

  const filteredLists = (folderId: string) =>
    lists.filter((l) => l.folderId === folderId && l.name.toLowerCase().includes(query.toLowerCase()));
  const filteredFolders = (spaceId: string) =>
    folders.filter((f) => f.spaceId === spaceId).filter(
      (f) => f.name.toLowerCase().includes(query.toLowerCase()) || filteredLists(f.id).length > 0
    );
  const filteredSpaces = spaces.filter(
    (s) => s.name.toLowerCase().includes(query.toLowerCase()) || filteredFolders(s.id).length > 0
  );

  const addMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuItem onSelect={() => onAdd('space')}><Plus className="mr-2 h-4 w-4" /> New Space</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onAdd('folder')}><Plus className="mr-2 h-4 w-4" /> New Folder</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onAdd('list')}><Plus className="mr-2 h-4 w-4" /> New List</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderList = (list: List, depth: number) => {
    const active = list.id === activeListId;
    const fav = favoriteListIds.includes(list.id);
    return (
      <div
        key={list.id}
        className="group relative flex items-center"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <button
          onClick={() => onSelect({ kind: 'list', id: list.id })}
          className={cn(
            'flex flex-1 items-center gap-2 py-1.5 pr-2 text-sm rounded-md transition-colors min-w-0',
            active
              ? 'bg-brand/10 text-brand font-medium'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          <IconByName name={list.icon} className={cn('h-3.5 w-3.5 shrink-0', active ? 'text-brand' : list.color)} />
          <span className="truncate">{list.name}</span>
        </button>
        <button
          onClick={() => onToggleFavorite(list.id)}
          className={cn(
            'mr-1 shrink-0 transition-opacity',
            fav ? 'opacity-100 text-amber-500' : 'opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-amber-500'
          )}
          title={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className={cn('h-3 w-3', fav && 'fill-current')} />
        </button>
      </div>
    );
  };

  const renderFolder = (folder: Folder, depth: number) => {
    const listsIn = filteredLists(folder.id);
    const isOpen = expanded[folder.id] ?? true;
    return (
      <div key={folder.id} className="group">
        <div
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          className="group flex items-center gap-1 py-1 pr-2 text-sm"
        >
          <button
            onClick={() => toggle(folder.id)}
            className="flex items-center gap-1.5 flex-1 min-w-0 text-foreground/80 hover:text-foreground"
          >
            {isOpen ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
            <IconByName name={folder.icon} className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate font-medium">{folder.name}</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onSelect={() => onAdd('list', folder.id)}>
                <Plus className="mr-2 h-4 w-4" /> New list
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onAdd('folder', folder.spaceId)}>
                <Plus className="mr-2 h-4 w-4" /> New folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isOpen && (
          <div className="flex flex-col gap-0.5 pb-1">
            {listsIn.length > 0 ? (
              listsIn.map((l) => renderList(l, depth + 1))
            ) : (
              <span style={{ paddingLeft: `${(depth + 1) * 12 + 28}px` }} className="text-xs text-muted-foreground/60 py-1">
                No lists
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSpace = (space: Space) => {
    const foldersIn = filteredFolders(space.id);
    const isOpen = expanded[space.id] ?? true;
    return (
      <div key={space.id} className="group">
        <div className="flex items-center gap-1 py-1.5 pr-2">
          <button
            onClick={() => toggle(space.id)}
            className="flex items-center gap-1.5 flex-1 min-w-0"
          >
            {isOpen ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
            <IconByName name={space.icon} className={cn('h-4 w-4 shrink-0', space.color)} />
            <span className="truncate text-sm font-semibold text-foreground">{space.name}</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onSelect={() => onAdd('folder', space.id)}>
                <Plus className="mr-2 h-4 w-4" /> New folder
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => onAdd('list')}>
                <Plus className="mr-2 h-4 w-4" /> New list
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isOpen && (
          <div className="flex flex-col gap-0.5 ml-1">
            {foldersIn.map((f) => renderFolder(f, 1))}
          </div>
        )}
      </div>
    );
  };

  const isFavoriteView = selection.kind === 'favorites';
  const isInboxView = selection.kind === 'inbox';

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card">
      {/* Workspace header */}
      <button
        onClick={onOpenSettings}
        className="flex items-center gap-2 px-3 py-3 border-b border-border text-left hover:bg-accent/50 transition-colors"
      >
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-white text-xs font-bold', WORKSPACE.color)}>
          {WORKSPACE.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{WORKSPACE.name}</div>
          <div className="text-[11px] text-muted-foreground">Free plan</div>
        </div>
        <Settings className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Quick links */}
      <div className="px-2 py-2 border-b border-border">
        <button
          onClick={() => onSelect({ kind: 'inbox' })}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
            isInboxView ? 'bg-brand/10 text-brand font-medium' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          <Inbox className="h-4 w-4" /> Inbox
          {inboxCount > 0 && (
            <span className={cn(
              'ml-auto rounded-full px-1.5 text-[10px] font-semibold',
              isInboxView ? 'bg-brand/20 text-brand' : 'bg-brand/10 text-brand'
            )}>
              {inboxCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onSelect({ kind: 'favorites' })}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors',
            isFavoriteView ? 'bg-amber-50 text-amber-700 font-medium' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
        >
          <Star className="h-4 w-4" /> Favorites
          {favoriteListIds.length > 0 && (
            <span className="ml-auto rounded-full bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground">
              {favoriteListIds.length}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full rounded-md border border-input bg-background pl-7 pr-2 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2">
        <div className="flex items-center justify-between px-1 pb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Spaces</span>
          {addMenu}
        </div>
        {filteredSpaces.map(renderSpace)}
        {filteredSpaces.length === 0 && (
          <p className="px-2 py-4 text-xs text-muted-foreground">No results</p>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-3 py-2.5">
        <Button variant="outline" size="sm" onClick={onOpenSettings} className="w-full justify-start gap-2 text-muted-foreground">
          <Settings className="h-3.5 w-3.5" /> Workspace settings
        </Button>
      </div>
    </aside>
  );
}
