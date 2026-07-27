import React, { useState } from 'react';
import { Sun, Pencil, Lock } from 'lucide-react';
import { getDayOfWeek, todayKey } from '../utils/dates';
import { getDailyQuote } from '../utils/quotes';
import { IntentionItem } from './IntentionItem';
import type { DailyEntry, Intention } from '../types';

interface MorningViewProps {
  entry: DailyEntry | undefined;
  onSave: (intentions: Intention[]) => Promise<void>;
  onNavigateToFocus: () => void;
}

const PLACEHOLDERS = [
  "What's the one thing that must get done today?",
  "What will make today feel successful?",
  "What do you want to make progress on?",
];

export const MorningView: React.FC<MorningViewProps> = ({ entry, onSave, onNavigateToFocus }) => {
  const [texts, setTexts] = useState<string[]>(
    entry?.intentions.map(i => i.text) ?? ['', '', '']
  );
  const [isEditing, setIsEditing] = useState(!entry?.morningDone);
  const [isSaving, setIsSaving] = useState(false);

  const dayOfWeek = getDayOfWeek();
  const quote = getDailyQuote(todayKey());
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  const handleSave = async () => {
    const validTexts = texts.filter(t => t.trim().length > 0);
    if (validTexts.length < 1) return;
    setIsSaving(true);
    const intentions: Intention[] = texts.map(t => ({
      text: t.trim() || '(empty)',
      completed: false,
    }));
    await onSave(intentions);
    setIsEditing(false);
    setIsSaving(false);
  };

  const canSave = texts.some(t => t.trim().length > 0);

  return (
    <div className="flex flex-col min-h-full">
      <div className="bg-gradient-to-br from-[#1a0d3a] via-[#0d1b3a] to-[#0a0a0f] px-6 pt-8 pb-10">
        <div className="flex items-center gap-2 mb-1">
          <Sun className="w-5 h-5 text-amber-400" />
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Good morning</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">{dayOfWeek}</h1>
        <p className="text-gray-400 text-sm">{today}</p>
        <div className="mt-4 border-l-2 border-amber-500/40 pl-3">
          <p className="text-gray-300 text-sm italic">"{quote}"</p>
        </div>
      </div>

      <div className="flex-1 px-6 -mt-6">
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Today's Intentions</h2>
            {entry?.morningDone && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-amber-400 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="flex flex-col gap-3">
              {texts.map((text, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-3">
                    <span className="text-amber-400 text-xs font-bold">{idx + 1}</span>
                  </div>
                  <textarea
                    value={text}
                    onChange={e => setTexts(prev => prev.map((t, i) => (i === idx ? e.target.value : t)))}
                    placeholder={PLACEHOLDERS[idx]}
                    rows={2}
                    className="flex-1 bg-[var(--card-input)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-secondary)] placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-none transition-colors"
                  />
                </div>
              ))}
              <button
                onClick={handleSave}
                disabled={!canSave || isSaving}
                className="mt-2 w-full py-3 rounded-xl font-semibold text-sm text-black bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-500 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Lock In My Intentions'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {entry?.intentions.map((intention, idx) => (
                <IntentionItem key={idx} intention={intention} index={idx} readOnly />
              ))}
              <button
                onClick={onNavigateToFocus}
                className="mt-3 w-full py-3 rounded-xl font-semibold text-sm text-black bg-amber-500 hover:bg-amber-400 transition-all duration-200"
              >
                Start Focus Session
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-xs text-purple-300">
            Limit yourself to 3 intentions. Focus beats volume every time.
          </p>
        </div>
      </div>
    </div>
  );
};
