import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sun, Moon, Monitor, Bell, Globe, User, Trash2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: 'light' | 'dark';
  onThemeChange: (t: 'light' | 'dark') => void;
  workspaceName: string;
  notifications: boolean;
  onNotificationsChange: (v: boolean) => void;
  compactView: boolean;
  onCompactChange: (v: boolean) => void;
  onResetData: () => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  theme,
  onThemeChange,
  workspaceName,
  notifications,
  onNotificationsChange,
  compactView,
  onCompactChange,
  onResetData,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your workspace appearance and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-2">
          {/* Appearance */}
          <Section icon={<Sun className="h-4 w-4" />} title="Appearance">
            <div className="grid gap-3">
              <div>
                <Label className="text-sm">Theme</Label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <ThemeOption
                    label="Light"
                    icon={<Sun className="h-4 w-4" />}
                    active={theme === 'light'}
                    onClick={() => onThemeChange('light')}
                  />
                  <ThemeOption
                    label="Dark"
                    icon={<Moon className="h-4 w-4" />}
                    active={theme === 'dark'}
                    onClick={() => onThemeChange('dark')}
                  />
                  <ThemeOption
                    label="System"
                    icon={<Monitor className="h-4 w-4" />}
                    active={false}
                    onClick={() => {
                      const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                      onThemeChange(sys);
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <Label className="text-sm">Compact view</Label>
                  <p className="text-xs text-muted-foreground">Tighter row spacing in lists.</p>
                </div>
                <Switch checked={compactView} onCheckedChange={onCompactChange} />
              </div>
            </div>
          </Section>

          {/* Notifications */}
          <Section icon={<Bell className="h-4 w-4" />} title="Notifications">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Task notifications</Label>
                <p className="text-xs text-muted-foreground">Get alerted on assignment and due dates.</p>
              </div>
              <Switch checked={notifications} onCheckedChange={onNotificationsChange} />
            </div>
          </Section>

          {/* Workspace */}
          <Section icon={<Globe className="h-4 w-4" />} title="Workspace">
            <div className="grid gap-2">
              <Label className="text-sm">Workspace name</Label>
              <div className="flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{workspaceName}</span>
              </div>
              <div className="grid gap-2">
                <Label className="text-sm">Default landing view</Label>
                <Select defaultValue="list">
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="list">List View</SelectItem>
                    <SelectItem value="board">Board View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Section>

          {/* Data */}
          <Section icon={<Download className="h-4 w-4" />} title="Data">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const data = JSON.stringify({ tasks: 'all' }, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'flowdesk-export.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="mr-2 h-3.5 w-3.5" /> Export data
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={onResetData}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Reset demo data
              </Button>
            </div>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ThemeOption({ label, icon, active, onClick }: { label: string; icon: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-all',
        active ? 'border-brand bg-brand/10 text-brand' : 'border-border text-muted-foreground hover:bg-accent'
      )}
    >
      {icon}
      {label}
    </button>
  );
}
