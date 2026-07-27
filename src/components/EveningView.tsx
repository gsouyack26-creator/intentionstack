import React, { useState } from 'react';
import { Moon, CheckCircle2, Sparkles } from 'lucide-react';
import { EnergyRating } from './EnergyRating';
import { IntentionItem } from './IntentionItem';
import type { DailyEntry, Intention } from '../types';

interface EveningViewProps {
  entry: DailyEntry | undefined;
  onSave: (updates: {
    intentions: Intention[];
    energyRating: number | undefined;
    reflection: string;
  }) => Promise<void>;
}

export const EveningView: React.FC<EveningViewProps> = ({ entry, onSave }) => {
  const [intentions, setIntentions] = useState<Intention[]>(entry?.intentions ?? []);
  const [energyRating, setEnergyRating] = useState<number | undefined>(entry?.energyRating);
  const [reflection, setReflection] = useState(entry?.reflection ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(entry?.eveningDone ?? false);

  const toggleIntention = (idx: number) => {
    if (saved) return;
    setIntentions(prev =>
      prev.map((i, n) =>
        n === idx
          ? {
              ...i,
              completed: !i.completed,
              completedAt: !i.completed ? new Date().toISOString() : undefined,
            }
          : i
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({ intentions, energyRating, reflection });
    setSaved(true);
    setIsSaving(false);
  };

  const completedCount = intentions.filter(i => i.completed).length;
  const total = intentions.length;

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <Moon className="w-12 h-12 text-purple-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-300 mb-2">No intentions set yet</h2>
        <p className="text-sm text-gray-500">Start your morning first to set today's intentions.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="bg-gradient-to-br from-[#1a0a0a] via-[#1a0d2a] to-[#0a0a0f] px-6 pt-8 pb-10">
        <div className="flex items-center gap-2 mb-1">
          <Moon className="w-5 h-5 text-purple-400" />
          <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">Evening Wrap</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">How did your day go?</h1>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 bg-[#0a0a0f]/60 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${total > 0 ? (completedCount / total) * 100 : 0}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-white">{completedCount}/{total}</span>
        </div>
      </div>

      <div className="flex-1 px-6 -mt-6 flex flex-col gap-4">
        <div className="bg-[#13131a] rounded-2xl border border-[#1e1e2a] p-5 shadow-xl">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Check off your intentions
          </h2>
          <div className="flex flex-col gap-2">
            {intentions.map((intention, idx) => (
              <IntentionItem
                key={idx}
                intention={intention}
                index={idx}
                onToggle={toggleIntention}
                readOnly={saved}
              />
            ))}
          </div>
        </div>

        <div className="bg-[#13131a] rounded-2xl border border-[#1e1e2a] p-5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Energy level today
          </h2>
          <EnergyRating value={energyRating} onChange={setEnergyRating} readOnly={saved} />
        </div>

        <div className="bg-[#13131a] rounded-2xl border border-[#1e1e2a] p-5">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Reflection <span className="text-gray-600 normal-case font-normal">(optional)</span>
          </h2>
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value.slice(0, 500))}
            disabled={saved}
            placeholder="Any wins, blockers, or thoughts?"
            rows={4}
            className="w-full bg-[#0a0a0f] border border-[#1e1e2a] rounded-xl px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 resize-none transition-colors disabled:opacity-60"
          />
          <p className="text-xs text-gray-600 text-right mt-1">{reflection.length}/500</p>
        </div>

        {saved ? (
          <div className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-emerald-400 font-semibold">Day wrapped up!</p>
              <p className="text-xs text-emerald-400/60">Great work today.</p>
            </div>
          </div>
        ) : (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 rounded-2xl font-bold text-black bg-gradient-to-r from-amber-500 to-purple-500 hover:from-amber-400 hover:to-purple-400 disabled:opacity-60 transition-all duration-200 flex items-center justify-center gap-2 mb-4"
          >
            <Sparkles className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Wrap Up Day'}
          </button>
        )}
      </div>
    </div>
  );
};
