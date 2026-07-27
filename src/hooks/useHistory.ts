import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { last30Days } from '../utils/dates';
import type { DailyEntry } from '../types';

export function useHistory() {
  const days30 = last30Days();
  const startDate = days30[0];

  const entries = useLiveQuery(
    () => db.dailyEntries.where('date').aboveOrEqual(startDate).reverse().sortBy('date'),
    [startDate]
  ) as DailyEntry[] | undefined;

  const allEntries = useLiveQuery(
    () => db.dailyEntries.orderBy('date').reverse().toArray(),
    []
  ) as DailyEntry[] | undefined;

  return {
    entries: entries ?? [],
    allEntries: allEntries ?? [],
    isLoading: entries === undefined,
    days30,
  };
}
