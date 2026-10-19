import { LayoutList, Trello, Plus, Search, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { FilterPopover, type FilterState, EMPTY_FILTERS } from '@/components/FilterPopover';

interface Props {
  spaceName: string;
  folderName: string;
  listName: string;
  listIcon: string;
  listColor: string;
  view: 'list' | 'board';
  onViewChange: (v: 'list' | 'board') => void;
  onNewTask: () => void;
  taskCount: number;
  filteredCount: number;
  search: string;
  onSearchChange: (s: string) => void;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  showTaskActions: boolean;
}

export function Header({
  spaceName,
  folderName,
  listName,
  listIcon,
  listColor,
  view,
  onViewChange,
  onNewTask,
  taskCount,
  filteredCount,
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  theme,
  onToggleTheme,
  showTaskActions,
}: Props) {
  const IconC = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[listIcon] ?? Icons.List;
  const filtering = showTaskActions && (filters.statuses.length + filters.priorities.length + filters.assigneeIds.length > 0 || search.trim().length > 0);
  const count = filtering ? filteredCount : taskCount;

  return (
    <header className="flex flex-col gap-3 border-b border-border bg-background px-6 py-4">
      {/* Breadcrumb + title */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{spaceName}</span>
            <span>/</span>
            <span>{folderName}</span>
            <span>/</span>
            <span className="text-foreground font-medium">{listName}</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <IconC className={cn('h-5 w-5', listColor)} />
            <h1 className="text-xl font-semibold tracking-tight truncate">{listName}</h1>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {count} {count === 1 ? 'task' : 'tasks'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={onToggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {showTaskActions && (
            <FilterPopover filters={filters} onChange={onFiltersChange} />
          )}
          {showTaskActions && (
            <Button size="sm" onClick={onNewTask} className="gap-2 bg-brand text-white hover:bg-brand/90">
              <Plus className="h-4 w-4" /> New Task
            </Button>
          )}
        </div>
      </div>

      {/* View switch + search */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
          <button
            onClick={() => onViewChange('list')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              view === 'list' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <LayoutList className="h-3.5 w-3.5" /> List
          </button>
          <button
            onClick={() => onViewChange('board')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              view === 'board' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Trello className="h-3.5 w-3.5" /> Board
          </button>
        </div>

        {showTaskActions && (
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks in this list…"
              className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        )}
      </div>
    </header>
  );
}

export { EMPTY_FILTERS };
export type { FilterState };
