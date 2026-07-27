import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, BookOpen } from 'lucide-react';
import type { DailyEntry } from '../types';
import { formatDate, isToday } from '../utils/dates';
import { completionCount } from '../utils/scoring';
import { energyEmoji } from './EnergyRating';
import { EmptyState } from './EmptyState';

interface HistoryViewProps {
  entries: DailyEntry[];
}

function CompletionBadge({ count, total }: { count: number; total: number }) {
  const pct = total > 0 ? count / total : 0;
  const color = pct === 1
    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    : pct >= 0.5
      ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      : 'bg-gray-700/50 text-gray-400 border-gray-600/30';
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>
      {count}/{total}
    </span>
  );
}

function EntryRow({ entry }: { entry: DailyEntry }) {
  const [expanded, setExpanded] = useState(false);
  const count = completionCount(entry);
  const today = isToday(entry.date);

  return (
    <div className="bg-[#13131a] rounded-xl border border-[#1e1e2a] overflow-hidden">
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/3 transition-colors"
      >
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-200">
              {today ? 'Today' : formatDate(entry.date)}
            </span>
            {today && (
              <span className="text-xs bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full">Today</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <CompletionBadge count={count} total={entry.intentions.length} />
            {entry.energyRating && (
              <span className="text-sm" title={`Energy: ${entry.energyRating}/5`}>
                {energyEmoji(entry.energyRating)}
              </span>
            )}
            {entry.focusMinutes > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {entry.focusMinutes}m
              </span>
            )}
          </div>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-gray-500" />
          : <ChevronDown className="w-4 h-4 text-gray-500" />
        }
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#1e1e2a]">
          <div className="pt-3 flex flex-col gap-2">
            {entry.intentions.map((intention, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className={`mt-0.5 text-sm ${intention.completed ? 'text-emerald-400' : 'text-gray-600'}`}>
                  {intention.completed ? '✓' : '○'}
                </span>
                <span className={`text-sm ${intention.completed ? 'text-gray-300 line-through decoration-gray-500' : 'text-gray-400'}`}>
                  {intention.text}
                </span>
              </div>
            ))}
            {entry.reflection && (
              <div className="mt-3 p-3 bg-white/3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Reflection</p>
                <p className="text-sm text-gray-300 italic">"{entry.reflection}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export const HistoryView: React.FC<HistoryViewProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <EmptyState
        title="No history yet"
        description="Complete your first morning ritual to start building your intention history."
        icon={<BookOpen className="w-8 h-8 text-amber-400/60" />}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3 px-6 py-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-white">History</h2>
        <span className="text-xs text-gray-500">{entries.length} entries</span>
      </div>
      {entries.map(entry => (
        <EntryRow key={entry.id ?? entry.date} entry={entry} />
      ))}
    </div>
  );
};
