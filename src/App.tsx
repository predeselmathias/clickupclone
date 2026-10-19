import { useMemo, useState } from 'react';
import './App.css';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/use-theme';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ListView } from '@/components/ListView';
import { BoardView } from '@/components/BoardView';
import { NewTaskDialog, type NewTaskData } from '@/components/NewTaskDialog';
import { TaskDetail } from '@/components/TaskDetail';
import { SettingsDialog } from '@/components/SettingsDialog';
import { AddHierarchyDialog, type AddKind } from '@/components/AddHierarchyDialog';
import { InboxView } from '@/components/InboxView';
import { FavoritesView } from '@/components/FavoritesView';
import {
  TASKS,
  LISTS,
  FOLDERS,
  SPACES,
  type Task,
  type Status,
  type Space,
  type Folder,
  type List,
} from '@/lib/data';

type Selection =
  | { kind: 'list'; id: string }
  | { kind: 'inbox' }
  | { kind: 'favorites' };

const ICON_POOL = ['Sparkles', 'Bug', 'Search', 'ClipboardList', 'Mic', 'Plug', 'Database', 'Component', 'Gauge', 'Rocket', 'PenTool', 'Users', 'ListTodo', 'Flag', 'Target'];
const COLOR_POOL = ['text-blue-500', 'text-emerald-500', 'text-amber-500', 'text-purple-500', 'text-rose-500', 'text-cyan-500'];

function App() {
  const { theme, toggle: toggleTheme, setTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>(TASKS);
  const [spaces, setSpaces] = useState<Space[]>(SPACES);
  const [folders, setFolders] = useState<Folder[]>(FOLDERS);
  const [lists, setLists] = useState<List[]>(LISTS);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [selection, setSelection] = useState<Selection>({ kind: 'list', id: 'l1' });
  const [view, setView] = useState<'list' | 'board'>('list');
  const [search, setSearch] = useState('');

  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskDialogStatus, setTaskDialogStatus] = useState<Status | undefined>(undefined);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addKind, setAddKind] = useState<AddKind | null>(null);
  const [addParentId, setAddParentId] = useState<string | undefined>(undefined);

  const [notifications, setNotifications] = useState(true);
  const [compactView, setCompactView] = useState(false);

  const activeListId = selection.kind === 'list' ? selection.id : '';
  const activeList = lists.find((l) => l.id === activeListId) ?? lists[0];
  const activeFolder = folders.find((f) => f.id === activeList.folderId) ?? folders[0];
  const activeSpace = spaces.find((s) => s.id === activeFolder.spaceId) ?? spaces[0];

  const listTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks
      .filter((t) => t.listId === activeListId)
      .filter((t) => !q || t.name.toLowerCase().includes(q) || t.tags?.some((tag) => tag.includes(q)));
  }, [tasks, activeListId, search]);

  const inboxCount = useMemo(() => {
    const now = Date.now();
    return tasks.filter((t) => {
      if (t.status === 'done') return false;
      const due = new Date(t.dueDate).getTime();
      return due - now < 3 * 86400000;
    }).length;
  }, [tasks]);

  const detailTask = detailTaskId ? tasks.find((t) => t.id === detailTaskId) ?? null : null;

  const openTask = (id: string) => {
    setDetailTaskId(id);
    setDetailOpen(true);
  };

  const openAdd = (kind: AddKind, parentId?: string) => {
    setAddKind(kind);
    setAddParentId(parentId);
    setAddOpen(true);
  };

  const handleCreateTask = (data: NewTaskData) => {
    const newTask: Task = {
      id: `t-${Date.now()}`,
      ...data,
      listId: activeListId || lists[0].id,
    };
    setTasks((prev) => [newTask, ...prev]);
    toast({ title: 'Task created', description: `"${data.name}" added.` });
  };

  const handleUpdateTask = (id: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast({ title: 'Task deleted' });
  };

  const handleCreateHierarchy = (kind: AddKind, name: string, parentId: string, icon: string, color: string) => {
    if (kind === 'space') {
      const id = `s-${Date.now()}`;
      setSpaces((prev) => [...prev, { id, name, icon: icon || 'Package', color: color || COLOR_POOL[0] }]);
      toast({ title: 'Space created', description: `"${name}" is ready.` });
    } else if (kind === 'folder') {
      const space = spaces.find((s) => s.id === parentId) ?? spaces[0];
      const id = `f-${Date.now()}`;
      setFolders((prev) => [...prev, { id, name, icon: icon || 'Map', spaceId: space.id }]);
      toast({ title: 'Folder created', description: `"${name}" added to ${space.name}.` });
    } else if (kind === 'list') {
      const folder = folders.find((f) => f.id === parentId) ?? folders[0];
      const id = `l-${Date.now()}`;
      setLists((prev) => [...prev, { id, name, icon: icon || 'ListTodo', color: COLOR_POOL[prev.length % COLOR_POOL.length], folderId: folder.id }]);
      toast({ title: 'List created', description: `"${name}" added.` });
      setSelection({ kind: 'list', id });
    }
  };

  const toggleFavorite = (listId: string) => {
    setFavorites((prev) => (prev.includes(listId) ? prev.filter((x) => x !== listId) : [...prev, listId]));
  };

  const handleResetData = () => {
    setTasks(TASKS);
    setSpaces(SPACES);
    setFolders(FOLDERS);
    setLists(LISTS);
    setFavorites([]);
    setSelection({ kind: 'list', id: 'l1' });
    toast({ title: 'Demo data restored' });
    setSettingsOpen(false);
  };

  const onSelect = (sel: Selection) => {
    setSelection(sel);
    setSearch('');
  };

  const headerTitle = selection.kind === 'inbox' ? 'Inbox' : selection.kind === 'favorites' ? 'Favorites' : activeList.name;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        selection={selection}
        onSelect={onSelect}
        spaces={spaces}
        folders={folders}
        lists={lists}
        favoriteListIds={favorites}
        onToggleFavorite={toggleFavorite}
        onAdd={openAdd}
        onOpenSettings={() => setSettingsOpen(true)}
        inboxCount={inboxCount}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        <Header
          spaceName={activeSpace.name}
          folderName={activeFolder.name}
          listName={headerTitle}
          listIcon={selection.kind === 'list' ? activeList.icon : 'Inbox'}
          listColor={selection.kind === 'list' ? activeList.color : 'text-brand'}
          view={view}
          onViewChange={setView}
          onNewTask={() => { setTaskDialogStatus(undefined); setTaskDialogOpen(true); }}
          taskCount={selection.kind === 'list' ? listTasks.length : inboxCount}
          search={search}
          onSearchChange={setSearch}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenSettings={() => setSettingsOpen(true)}
          showTaskActions={selection.kind === 'list'}
        />

        <div className="flex-1 overflow-hidden">
          {selection.kind === 'inbox' ? (
            <InboxView tasks={tasks} onOpenTask={openTask} />
          ) : selection.kind === 'favorites' ? (
            <FavoritesView
              favoriteListIds={favorites}
              lists={lists}
              folders={folders}
              spaces={spaces}
              tasks={tasks}
              onOpenList={(id) => setSelection({ kind: 'list', id })}
            />
          ) : view === 'list' ? (
            <ListView tasks={listTasks} onOpenTask={openTask} compact={compactView} />
          ) : (
            <BoardView
              tasks={listTasks}
              onOpenTask={openTask}
              onQuickAdd={(status) => { setTaskDialogStatus(status); setTaskDialogOpen(true); }}
            />
          )}
        </div>
      </main>

      <NewTaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onCreate={handleCreateTask}
        listName={headerTitle}
        initialStatus={taskDialogStatus}
      />

      <TaskDetail
        task={detailTask}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        theme={theme}
        onThemeChange={setTheme}
        workspaceName="Flowdesk HQ"
        notifications={notifications}
        onNotificationsChange={setNotifications}
        compactView={compactView}
        onCompactChange={setCompactView}
        onResetData={handleResetData}
      />

      <AddHierarchyDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        kind={addKind}
        parentId={addParentId}
        spaces={spaces}
        onCreate={handleCreateHierarchy}
      />

      <Toaster />
    </div>
  );
}

export default App;
