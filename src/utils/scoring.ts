import type { DailyEntry } from '../types';

export function completionScore(entry: DailyEntry): number {
  if (!entry.intentions || entry.intentions.length === 0) return 0;
  const done = entry.intentions.filter(i => i.completed).length;
  return done / entry.intentions.length;
}

export function completionCount(entry: DailyEntry): number {
  return entry.intentions.filter(i => i.completed).length;
}

export function weeklyAverage(entries: DailyEntry[]): number {
  if (entries.length === 0) return 0;
  const scores = entries.map(completionScore);
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function streakCount(entries: DailyEntry[]): number {
  if (entries.length === 0) return 0;
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);
    const expectedStr = expected.toISOString().slice(0, 10);
    if (sorted[i].date !== expectedStr) break;
    if (completionCount(sorted[i]) >= 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function lifetimeStats(entries: DailyEntry[]): {
  totalIntentionsSet: number;
  totalIntentionsDone: number;
  totalFocusMinutes: number;
  completionRate: number;
} {
  const totalIntentionsSet = entries.reduce((acc, e) => acc + e.intentions.length, 0);
  const totalIntentionsDone = entries.reduce((acc, e) => acc + completionCount(e), 0);
  const totalFocusMinutes = entries.reduce((acc, e) => acc + (e.focusMinutes || 0), 0);
  const completionRate = totalIntentionsSet > 0 ? totalIntentionsDone / totalIntentionsSet : 0;
  return { totalIntentionsSet, totalIntentionsDone, totalFocusMinutes, completionRate };
}
