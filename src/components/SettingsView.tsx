import React, { useRef, useState } from 'react';
import {
  Download, Upload, FileJson, FileText, Sun, Moon,
  Bell, BellOff, Timer, Settings as SettingsIcon, AlertTriangle,
} from 'lucide-react';
import type { Settings } from '../types';
import { exportAllJSON, exportEntriesCSV, importJSON } from '../utils/export';
import { requestNotificationPermission } from '../utils/notifications';

interface SettingsViewProps {
  settings: Settings;
  onUpdate: (updates: Partial<Settings>) => Promise<void>;
}

interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ label, value, min, max, step = 1, unit = 'min', onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
    <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        className="w-8 h-8 rounded-lg bg-[var(--card-input)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:bg-amber-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold"
      >
        −
      </button>
      <span className="text-sm font-bold text-[var(--text-primary)] w-16 text-center">
        {value} {unit}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
        className="w-8 h-8 rounded-lg bg-[var(--card-input)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:bg-amber-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold"
      >
        +
      </button>
    </div>
  </div>
);

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'confirm' | 'success' | 'error'>('idle');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [notifStatus, setNotifStatus] = useState<string>('');

  const handleNotificationToggle = async () => {
    if (!settings.notificationsEnabled) {
      const perm = await requestNotificationPermission();
      if (perm === 'granted') {
        await onUpdate({ notificationsEnabled: true });
        setNotifStatus('');
      } else if (perm === 'denied') {
        setNotifStatus('Permission denied — enable notifications in browser settings.');
      } else {
        setNotifStatus('Permission not granted.');
      }
    } else {
      await onUpdate({ notificationsEnabled: false });
      setNotifStatus('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setImportStatus('confirm');
    e.target.value = '';
  };

  const handleImportConfirm = async () => {
    if (!pendingFile) return;
    try {
      await importJSON(pendingFile);
      setImportStatus('success');
    } catch {
      setImportStatus('error');
    }
    setPendingFile(null);
  };

  const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--border)] flex items-center gap-2">
        <span className="text-amber-400">{icon}</span>
        <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider">{title}</h2>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-5 px-6 py-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="w-5 h-5 text-amber-400" />
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Settings</h1>
      </div>

      {/* Timer Durations */}
      <Section title="Pomodoro Timer" icon={<Timer className="w-4 h-4" />}>
        <Stepper
          label="Focus session"
          value={settings.focusDuration}
          min={5} max={90} step={5}
          onChange={v => onUpdate({ focusDuration: v })}
        />
        <Stepper
          label="Short break"
          value={settings.shortBreakDuration}
          min={1} max={30} step={1}
          onChange={v => onUpdate({ shortBreakDuration: v })}
        />
        <Stepper
          label="Long break"
          value={settings.longBreakDuration}
          min={5} max={60} step={5}
          onChange={v => onUpdate({ longBreakDuration: v })}
        />
        <Stepper
          label="Sessions before long break"
          value={settings.sessionsBeforeLong}
          min={2} max={8} step={1}
          unit="sess"
          onChange={v => onUpdate({ sessionsBeforeLong: v })}
        />
      </Section>

      {/* Appearance */}
      <Section title="Appearance" icon={<Sun className="w-4 h-4" />}>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">Theme</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {settings.theme === 'dark' ? 'Dark mode' : 'Light mode'}
            </p>
          </div>
          <button
            onClick={() => onUpdate({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            className={[
              'relative w-14 h-7 rounded-full border transition-colors duration-300',
              settings.theme === 'light'
                ? 'bg-amber-400 border-amber-500'
                : 'bg-[var(--card-input)] border-[var(--border)]',
            ].join(' ')}
            aria-label="Toggle theme"
          >
            <span
              className={[
                'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 flex items-center justify-center',
                settings.theme === 'light' ? 'left-7' : 'left-0.5',
              ].join(' ')}
            >
              {settings.theme === 'light'
                ? <Sun className="w-3.5 h-3.5 text-amber-500" />
                : <Moon className="w-3.5 h-3.5 text-gray-400" />
              }
            </span>
          </button>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={<Bell className="w-4 h-4" />}>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">Enable notifications</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Morning reminder + break nudge</p>
          </div>
          <button
            onClick={handleNotificationToggle}
            className={[
              'relative w-14 h-7 rounded-full border transition-colors duration-300',
              settings.notificationsEnabled
                ? 'bg-emerald-500 border-emerald-600'
                : 'bg-[var(--card-input)] border-[var(--border)]',
            ].join(' ')}
            aria-label="Toggle notifications"
          >
            <span
              className={[
                'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 flex items-center justify-center',
                settings.notificationsEnabled ? 'left-7' : 'left-0.5',
              ].join(' ')}
            >
              {settings.notificationsEnabled
                ? <Bell className="w-3.5 h-3.5 text-emerald-500" />
                : <BellOff className="w-3.5 h-3.5 text-gray-400" />
              }
            </span>
          </button>
        </div>
        {notifStatus && (
          <p className="text-xs text-amber-400 pb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            {notifStatus}
          </p>
        )}
      </Section>

      {/* Data Export / Import */}
      <Section title="Data" icon={<Download className="w-4 h-4" />}>
        <div className="flex flex-col gap-2 py-3">
          <button
            onClick={exportAllJSON}
            className="flex items-center gap-3 w-full py-2.5 px-3 rounded-xl bg-[var(--card-input)] border border-[var(--border)] hover:border-amber-500/40 text-left transition-colors"
          >
            <FileJson className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Export JSON backup</p>
              <p className="text-xs text-[var(--text-muted)]">All data — entries, sessions, settings</p>
            </div>
          </button>

          <button
            onClick={exportEntriesCSV}
            className="flex items-center gap-3 w-full py-2.5 px-3 rounded-xl bg-[var(--card-input)] border border-[var(--border)] hover:border-purple-500/40 text-left transition-colors"
          >
            <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Export CSV</p>
              <p className="text-xs text-[var(--text-muted)]">Daily entries in spreadsheet format</p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 w-full py-2.5 px-3 rounded-xl bg-[var(--card-input)] border border-[var(--border)] hover:border-emerald-500/40 text-left transition-colors"
          >
            <Upload className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">Import JSON backup</p>
              <p className="text-xs text-[var(--text-muted)]">Restore from a previous export</p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {importStatus === 'confirm' && (
          <div className="mb-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm text-amber-300 font-medium mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Import "{pendingFile?.name}"?
            </p>
            <p className="text-xs text-amber-400/80 mb-3">
              This will merge data from the backup into your current database.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleImportConfirm}
                className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors"
              >
                Import
              </button>
              <button
                onClick={() => { setImportStatus('idle'); setPendingFile(null); }}
                className="flex-1 py-2 rounded-lg bg-[var(--card-input)] border border-[var(--border)] text-[var(--text-muted)] text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {importStatus === 'success' && (
          <p className="text-sm text-emerald-400 pb-3 flex items-center gap-1.5">
            ✓ Import complete — reload to see changes.
          </p>
        )}

        {importStatus === 'error' && (
          <p className="text-sm text-red-400 pb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Import failed — make sure the file is a valid IntentionStack backup.
          </p>
        )}
      </Section>
    </div>
  );
};
