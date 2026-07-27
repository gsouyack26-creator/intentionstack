import React from 'react';
import { Flame, Target, Clock, TrendingUp, BarChart2 } from 'lucide-react';
import type { DailyEntry } from '../types';
import { StreakHeatmap } from './StreakHeatmap';
import { WeeklyChart } from './WeeklyChart';
import { lifetimeStats } from '../utils/scoring';
import { EmptyState } from './EmptyState';

interface PatternViewProps {
  entries: DailyEntry[];
  allEntries: DailyEntry[];
  streak: number;
  theme?: 'dark' | 'light';
}

function StatCard({
  icon,
  value,
  label,
  color = 'text-amber-400',
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: string;
}) {
  return (
    <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4 flex items-center gap-3">
      <div className={`${color} flex-shrink-0`}>{icon}</div>
      <div>
        <p className="text-xl font-bold text-[var(--text-primary)]">{value}</p>
        <p className="text-xs text-[var(--text-muted)]">{label}</p>
      </div>
    </div>
  );
}

export const PatternView: React.FC<PatternViewProps> = ({ entries, allEntries, streak, theme = 'dark' }) => {
  const stats = lifetimeStats(allEntries);

  if (allEntries.length === 0) {
    return (
      <EmptyState
        title="No patterns yet"
        description="Complete a few days of intentions to see your trends and patterns."
        icon={<BarChart2 className="w-8 h-8 text-purple-400/60" />}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5 px-6 py-6">
      <h2 className="text-lg font-bold text-[var(--text-primary)]">Patterns</h2>

      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-500/30 p-5 flex items-center gap-4">
        <div className="text-5xl">🔥</div>
        <div>
          <p className="text-4xl font-black text-[var(--text-primary)]">{streak}</p>
          <p className="text-amber-300 font-semibold">day streak</p>
          <p className="text-xs text-amber-400/60 mt-0.5">Consecutive days with at least 1 intention done</p>
        </div>
      </div>

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5">
        <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-4">
          30-Day Heatmap
        </h3>
        <StreakHeatmap entries={entries} theme={theme} />
      </div>

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5">
        <WeeklyChart entries={allEntries} type="completion" title="Weekly Completion %" theme={theme} />
      </div>

      <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5">
        <WeeklyChart entries={allEntries} type="energy" title="Average Energy (weekly)" theme={theme} />
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Lifetime Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Clock className="w-5 h-5" />} value={`${Math.round(stats.totalFocusMinutes / 60)}h`} label="Focus hours" color="text-amber-400" />
          <StatCard icon={<Target className="w-5 h-5" />} value={stats.totalIntentionsSet} label="Intentions set" color="text-purple-400" />
          <StatCard icon={<Flame className="w-5 h-5" />} value={stats.totalIntentionsDone} label="Completed" color="text-emerald-400" />
          <StatCard icon={<TrendingUp className="w-5 h-5" />} value={`${Math.round(stats.completionRate * 100)}%`} label="Completion rate" color="text-blue-400" />
        </div>
      </div>
    </div>
  );
};
