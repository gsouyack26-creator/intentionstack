import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { todayKey } from '../utils/dates';
import type { DailyEntry, Intention } from '../types';

export function useToday() {
  const dateKey = todayKey();

  const entry = useLiveQuery(
    () => db.dailyEntries.where('date').equals(dateKey).first(),
    [dateKey]
  );

  const createEntry = async (intentions: Intention[]): Promise<DailyEntry> => {
    const newEntry: DailyEntry = {
      date: dateKey,
      intentions,
      morningDone: true,
      eveningDone: false,
      focusMinutes: 0,
      createdAt: new Date().toISOString(),
    };
    const id = await db.dailyEntries.add(newEntry);
    return { ...newEntry, id: id as number };
  };

  const updateEntry = async (updates: Partial<DailyEntry>): Promise<void> => {
    if (entry?.id !== undefined) {
      await db.dailyEntries.update(entry.id, updates);
    }
  };

  const addFocusMinutes = async (minutes: number): Promise<void> => {
    if (entry?.id !== undefined) {
      await db.dailyEntries.update(entry.id, {
        focusMinutes: (entry.focusMinutes || 0) + minutes,
      });
    }
  };

  return {
    entry,
    dateKey,
    isLoading: entry === undefined,
    morningDone: entry?.morningDone ?? false,
    eveningDone: entry?.eveningDone ?? false,
    createEntry,
    updateEntry,
    addFocusMinutes,
  };
}
