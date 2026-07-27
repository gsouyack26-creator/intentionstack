import React from 'react';
import type { DailyEntry } from '../types';
import { last30Days, formatDateShort } from '../utils/dates';
import { completionCount } from '../utils/scoring';

interface StreakHeatmapProps {
  entries: DailyEntry[];
  theme?: 'dark' | 'light';
}

function getCellColor(count: number, hasEntry: boolean, isDark: boolean): string {
  if (isDark) {
    if (!hasEntry) return '#111827';
    if (count === 0) return '#1f2937';
    if (count === 1) return '#1d4ed8';
    if (count === 2) return '#2563eb';
    return '#3b82f6';
  } else {
    if (!hasEntry) return '#f3f4f6';
    if (count === 0) return '#dbeafe';
    if (count === 1) return '#93c5fd';
    if (count === 2) return '#60a5fa';
    return '#3b82f6';
  }
}

export const StreakHeatmap: React.FC<StreakHeatmapProps> = ({ entries, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const days = last30Days();
  const entryMap = new Map(entries.map(e => [e.date, e]));
  const cols = 6;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {days.map((day, idx) => {
          const entry = entryMap.get(day);
          const count = entry ? completionCount(entry) : 0;
          const color = getCellColor(count, !!entry, isDark);
          const isToday = idx === days.length - 1;

          return (
            <div key={day} className="relative group">
              <div
                className={['w-full aspect-square rounded-md transition-all duration-200 hover:opacity-90',
                  isToday ? 'ring-1 ring-amber-400' : '',
                ].join(' ')}
                style={{ backgroundColor: color }}
              />
              <div className={[
                'absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity text-xs',
                isDark ? 'bg-gray-800 text-white' : 'bg-gray-700 text-white',
              ].join(' ')}>
                {formatDateShort(day)}: {count}/3
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 justify-end mt-1">
        <span className="text-xs text-[var(--text-muted)]">Less</span>
        {[0, 1, 2, 3].map(n => (
          <div key={n} className="w-3 h-3 rounded-sm" style={{ backgroundColor: getCellColor(n, n > 0, isDark) }} />
        ))}
        <span className="text-xs text-[var(--text-muted)]">More</span>
      </div>
    </div>
  );
};
