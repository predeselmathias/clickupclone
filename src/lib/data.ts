export type Status = 'todo' | 'in-progress' | 'review' | 'done';

export type Priority = 'urgent' | 'high' | 'normal' | 'low';

export interface Assignee {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Task {
  id: string;
  name: string;
  status: Status;
  priority: Priority;
  /** ISO string: yyyy-MM-ddTHH:mm */
  dueDate: string;
  assigneeIds: string[];
  createdById: string;
  listId: string;
  description?: string;
  tags?: string[];
}

export interface List {
  id: string;
  name: string;
  icon: string;
  color: string;
  folderId: string;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  spaceId: string;
}

export interface Space {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Workspace {
  id: string;
  name: string;
  color: string;
  initials: string;
}

export const STATUSES: { value: Status; label: string; color: string; badge: string }[] = [
  { value: 'todo', label: 'To Do', color: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600 border-slate-200' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'review', label: 'In Review', color: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'done', label: 'Done', color: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];

export const PRIORITIES: { value: Priority; label: string; color: string; dot: string }[] = [
  { value: 'urgent', label: 'Urgent', color: 'text-red-600', dot: 'bg-red-500' },
  { value: 'high', label: 'High', color: 'text-orange-600', dot: 'bg-orange-500' },
  { value: 'normal', label: 'Normal', color: 'text-blue-600', dot: 'bg-blue-500' },
  { value: 'low', label: 'Low', color: 'text-slate-500', dot: 'bg-slate-400' },
];

export const CURRENT_USER_ID = 'a1';
export const STATUS_ORDER: Status[] = ['todo', 'in-progress', 'review', 'done'];

export function nextStatus(s: Status): Status {
  const idx = STATUS_ORDER.indexOf(s);
  return STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
}

export function nextStatusLabel(s: Status): string {
  return STATUSES.find((x) => x.value === nextStatus(s))!.label;
}

export const ASSIGNEES: Assignee[] = [
  { id: 'a1', name: 'Elena Martin', initials: 'EM', color: 'bg-rose-500' },
  { id: 'a2', name: 'David Chen', initials: 'DC', color: 'bg-blue-500' },
  { id: 'a3', name: 'Sofia Rossi', initials: 'SR', color: 'bg-emerald-500' },
  { id: 'a4', name: 'Marcus Webb', initials: 'MW', color: 'bg-amber-500' },
  { id: 'a5', name: 'Priya Sharma', initials: 'PS', color: 'bg-purple-500' },
  { id: 'a6', name: 'Lucas Meyer', initials: 'LM', color: 'bg-cyan-500' },
  { id: 'a7', name: 'Aisha Khan', initials: 'AK', color: 'bg-pink-500' },
];

export const WORKSPACE: Workspace = {
  id: 'w1',
  name: 'Flowdesk HQ',
  color: 'bg-brand',
  initials: 'FH',
};

export const SPACES: Space[] = [
  { id: 's1', name: 'Product', color: 'text-blue-500', icon: 'Package' },
  { id: 's2', name: 'Engineering', color: 'text-emerald-500', icon: 'Code2' },
  { id: 's3', name: 'Marketing', color: 'text-amber-500', icon: 'Megaphone' },
  { id: 's4', name: 'Operations', color: 'text-purple-500', icon: 'Settings2' },
];

export const FOLDERS: Folder[] = [
  { id: 'f1', name: 'Roadmap Q4', icon: 'Map', spaceId: 's1' },
  { id: 'f2', name: 'Customer Feedback', icon: 'MessageSquare', spaceId: 's1' },
  { id: 'f3', name: 'Backend', icon: 'Server', spaceId: 's2' },
  { id: 'f4', name: 'Frontend', icon: 'Layout', spaceId: 's2' },
  { id: 'f5', name: 'Campaigns', icon: 'Rocket', spaceId: 's3' },
  { id: 'f6', name: 'Internal', icon: 'Building2', spaceId: 's4' },
];

export const LISTS: List[] = [
  { id: 'l1', name: 'New Features', icon: 'Sparkles', color: 'text-blue-500', folderId: 'f1' },
  { id: 'l2', name: 'Bug Fixes', icon: 'Bug', color: 'text-red-500', folderId: 'f1' },
  { id: 'l3', name: 'Research', icon: 'Search', color: 'text-purple-500', folderId: 'f1' },
  { id: 'l4', name: 'Surveys', icon: 'ClipboardList', color: 'text-amber-500', folderId: 'f2' },
  { id: 'l5', name: 'Interviews', icon: 'Mic', color: 'text-pink-500', folderId: 'f2' },
  { id: 'l6', name: 'API', icon: 'Plug', color: 'text-emerald-500', folderId: 'f3' },
  { id: 'l7', name: 'Database', icon: 'Database', color: 'text-cyan-500', folderId: 'f3' },
  { id: 'l8', name: 'Components', icon: 'Component', color: 'text-indigo-500', folderId: 'f4' },
  { id: 'l9', name: 'Performance', icon: 'Gauge', color: 'text-orange-500', folderId: 'f4' },
  { id: 'l10', name: 'Launch Plan', icon: 'Rocket', color: 'text-rose-500', folderId: 'f5' },
  { id: 'l11', name: 'Content', icon: 'PenTool', color: 'text-violet-500', folderId: 'f5' },
  { id: 'l12', name: 'Hiring', icon: 'Users', color: 'text-teal-500', folderId: 'f6' },
];

let creatorIdx = 0;
const t = (
  id: string,
  name: string,
  status: Status,
  priority: Priority,
  dueDate: string,
  assigneeId: string,
  listId: string,
  tags?: string[]
): Task => {
  const creator = ASSIGNEES[creatorIdx % ASSIGNEES.length].id;
  creatorIdx++;
  return {
    id,
    name,
    status,
    priority,
    dueDate: `${dueDate}T17:00`,
    assigneeIds: [assigneeId],
    createdById: creator,
    listId,
    tags,
  };
};

const tm = (
  id: string,
  name: string,
  status: Status,
  priority: Priority,
  dueDate: string,
  assigneeIds: string[],
  listId: string,
  tags?: string[]
): Task => {
  const creator = ASSIGNEES[creatorIdx % ASSIGNEES.length].id;
  creatorIdx++;
  return {
    id,
    name,
    status,
    priority,
    dueDate: `${dueDate}T17:00`,
    assigneeIds,
    createdById: creator,
    listId,
    tags,
  };
};

export const TASKS: Task[] = [
  // l1 — New Features
  tm('t1', 'Real-time collaboration cursors', 'in-progress', 'high', '2026-10-22', ['a2', 'a3'], 'l1', ['editor', 'realtime']),
  t('t2', 'AI task summary generator', 'todo', 'urgent', '2026-10-25', 'a5', 'l1', ['ai']),
  tm('t3', 'Custom dashboard widgets', 'review', 'normal', '2026-10-20', ['a1', 'a6'], 'l1', ['ui']),
  t('t4', 'Command palette (Cmd+K)', 'done', 'high', '2026-10-12', 'a6', 'l1', ['ux']),
  t('t5', 'Offline mode for boards', 'todo', 'low', '2026-11-05', 'a3', 'l1', ['pwa']),
  t('t6', 'Kanban WIP limits', 'in-progress', 'normal', '2026-10-28', 'a4', 'l1', ['board']),
  t('t7', 'Recurring task automation', 'todo', 'normal', '2026-11-10', 'a7', 'l1', ['automation']),

  // l2 — Bug Fixes
  t('t8', 'Avatar overflow on small screens', 'in-progress', 'urgent', '2026-10-19', 'a1', 'l2', ['ui', 'responsive']),
  t('t9', 'Date picker timezone shift', 'todo', 'high', '2026-10-23', 'a6', 'l2', ['date']),
  t('t10', 'Drag selection loses state', 'review', 'high', '2026-10-21', 'a2', 'l2', ['board']),
  t('t11', '404 on deep-linked list', 'done', 'normal', '2026-10-11', 'a4', 'l2', ['routing']),
  t('t12', 'Toast stacks overlap on iOS', 'todo', 'low', '2026-10-30', 'a7', 'l2', ['mobile']),

  // l3 — Research
  t('t13', 'Competitive analysis: Linear vs Asana', 'done', 'normal', '2026-10-08', 'a5', 'l3', ['research']),
  t('t14', 'User interview synthesis — Q3', 'in-progress', 'high', '2026-10-24', 'a3', 'l3', ['ux']),
  t('t15', 'Pricing page A/B test plan', 'todo', 'urgent', '2026-10-26', 'a1', 'l3', ['growth']),

  // l4 — Surveys
  t('t16', 'NPS survey Q4 distribution', 'in-progress', 'normal', '2026-10-27', 'a4', 'l4'),
  t('t17', 'Onboarding satisfaction poll', 'todo', 'low', '2026-11-02', 'a7', 'l4'),
  t('t18', 'Churn exit survey draft', 'review', 'high', '2026-10-20', 'a5', 'l4'),

  // l5 — Interviews
  t('t19', 'Power user session — Acme Co', 'todo', 'high', '2026-10-29', 'a3', 'l5'),
  t('t20', 'Switcher interview batch 2', 'done', 'normal', '2026-10-10', 'a1', 'l5'),

  // l6 — API
  t('t21', 'Rate limiting middleware', 'in-progress', 'urgent', '2026-10-19', 'a2', 'l6', ['infra']),
  t('t22', 'GraphQL schema v2', 'review', 'high', '2026-10-22', 'a6', 'l6', ['graphql']),
  t('t23', 'Webhook retry queue', 'todo', 'normal', '2026-11-01', 'a3', 'l6'),
  t('t24', 'OAuth scopes refactor', 'todo', 'high', '2026-11-08', 'a4', 'l6', ['auth']),

  // l7 — Database
  t('t25', 'Read replica for analytics', 'in-progress', 'high', '2026-10-25', 'a6', 'l7'),
  t('t26', 'Index audit on tasks table', 'done', 'normal', '2026-10-09', 'a2', 'l7'),
  t('t27', 'Partitioning for audit log', 'todo', 'low', '2026-11-15', 'a5', 'l7'),

  // l8 — Components
  t('t28', 'New ComboBox primitive', 'in-progress', 'normal', '2026-10-24', 'a1', 'l8', ['design-system']),
  t('t29', 'Toast v2 with queue', 'review', 'high', '2026-10-21', 'a7', 'l8', ['design-system']),
  t('t30', 'Empty state illustrations', 'todo', 'low', '2026-11-03', 'a3', 'l8'),
  t('t31', 'DateRangePicker', 'todo', 'normal', '2026-11-06', 'a4', 'l8'),

  // l9 — Performance
  t('t32', 'Bundle size < 250kb', 'in-progress', 'urgent', '2026-10-23', 'a6', 'l9', ['perf']),
  t('t33', 'List virtualization', 'review', 'high', '2026-10-20', 'a2', 'l9', ['perf']),
  t('t34', 'Image lazy-loading', 'done', 'normal', '2026-10-07', 'a4', 'l9'),

  // l10 — Launch Plan
  tm('t35', 'v2.0 launch checklist', 'in-progress', 'urgent', '2026-10-26', ['a1', 'a4', 'a7'], 'l10'),
  t('t36', 'Press kit assets', 'todo', 'normal', '2026-10-31', 'a3', 'l10'),
  t('t37', 'Launch livestream run-of-show', 'todo', 'high', '2026-11-04', 'a7', 'l10'),

  // l11 — Content
  t('t38', 'Blog: "Why we rebuilt the board"', 'review', 'normal', '2026-10-22', 'a5', 'l11'),
  t('t39', 'Docs: API reference update', 'in-progress', 'high', '2026-10-25', 'a6', 'l11'),
  t('t40', 'Changelog v2.0 draft', 'todo', 'normal', '2026-11-02', 'a4', 'l11'),

  // l12 — Hiring
  t('t41', 'Senior FE engineer — onsite loop', 'in-progress', 'high', '2026-10-28', 'a2', 'l12'),
  t('t42', 'Take-home assignment redesign', 'todo', 'normal', '2026-11-05', 'a1', 'l12'),
  t('t43', 'Onboarding handbook refresh', 'done', 'low', '2026-10-06', 'a7', 'l12'),
];
