import { useMemo } from 'react';
import type { DailyEntry } from '../types';
import { streakCount } from '../utils/scoring';

export function useStreak(entries: DailyEntry[]): number {
  return useMemo(() => streakCount(entries), [entries]);
}
