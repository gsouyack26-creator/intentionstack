import Dexie, { type EntityTable } from 'dexie';
import type { DailyEntry, FocusSession, Settings } from '../types';

class IntentionStackDB extends Dexie {
  dailyEntries!: EntityTable<DailyEntry, 'id'>;
  focusSessions!: EntityTable<FocusSession, 'id'>;
  settings!: EntityTable<Settings, 'id'>;

  constructor() {
    super('IntentionStackDB');
    this.version(1).stores({
      dailyEntries: '++id, &date, morningDone, eveningDone',
      focusSessions: '++id, date, type, completedAt',
      settings: '++id',
    });
  }
}

export const db = new IntentionStackDB();

export async function getSettings(): Promise<Settings> {
  const existing = await db.settings.toCollection().first();
  if (existing) return existing;
  const defaults: Settings = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLong: 4,
    notificationsEnabled: false,
    theme: 'dark',
    onboardingComplete: false,
  };
  const id = await db.settings.add(defaults);
  return { ...defaults, id: id as number };
}

export async function updateSettings(updates: Partial<Settings>): Promise<void> {
  const existing = await db.settings.toCollection().first();
  if (existing?.id !== undefined) {
    await db.settings.update(existing.id, updates);
  }
}
