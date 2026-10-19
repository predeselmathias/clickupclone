import { useMemo } from 'react';
import { Star, ArrowRight, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task, List, Space, Folder } from '@/lib/data';
import { STATUSES } from '@/lib/data';
import * as Icons from 'lucide-react';

interface Props {
  favoriteListIds: string[];
  lists: List[];
  folders: Folder[];
  spaces: Space[];
  tasks: Task[];
  onOpenList: (id: string) => void;
}

export function FavoritesView({ favoriteListIds, lists, folders, spaces, tasks, onOpenList }: Props) {
  const favLists = lists.filter((l) => favoriteListIds.includes(l.id));

  const counts = (listId: string) => {
    const listTasks = tasks.filter((t) => t.listId === listId);
    const done = listTasks.filter((t) => t.status === 'done').length;
    return { total: listTasks.length, done, pct: listTasks.length ? Math.round((done / listTasks.length) * 100) : 0 };
  };

  const spaceName = (list: List) => {
    const f = folders.find((x) => x.id === list.folderId);
    const s = f && spaces.find((x) => x.id === f.spaceId);
    return s?.name ?? '';
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <Star className="h-5 w-5 text-amber-500 fill-current" /> Favorites
          </h2>
          <p className="text-sm text-muted-foreground">
            {favLists.length > 0 ? 'Quick access to your starred lists.' : 'Star lists from the sidebar to pin them here.'}
          </p>
        </div>

        {favLists.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <Star className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium">No favorites yet</p>
            <p className="text-xs text-muted-foreground">Hover any list in the sidebar and click the star icon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {favLists.map((list) => {
              const c = counts(list.id);
              const IconC = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[list.icon] ?? Icons.List;
              return (
                <button
                  key={list.id}
                  onClick={() => onOpenList(list.id)}
                  className="group rounded-xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-brand/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <IconC className={cn('h-5 w-5', list.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate">{list.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{spaceName(list)}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      <ListTodo className="mr-1.5 inline h-3.5 w-3.5" />
                      {c.total} {c.total === 1 ? 'task' : 'tasks'}
                    </span>
                    <span className="font-medium">{c.pct}% done</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${c.pct}%` }} />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {STATUSES.map((s) => {
                      const n = tasks.filter((t) => t.listId === list.id && t.status === s.value).length;
                      if (n === 0) return null;
                      return (
                        <span key={s.value} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          <span className={cn('h-1.5 w-1.5 rounded-full', s.color)} />
                          {n} {s.label}
                        </span>
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
