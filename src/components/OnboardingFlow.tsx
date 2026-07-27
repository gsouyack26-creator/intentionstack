import React, { useState } from 'react';
import { Sparkles, Target, Timer, ChevronRight } from 'lucide-react';
import type { Intention } from '../types';

interface OnboardingFlowProps {
  onComplete: (intentions: Intention[]) => Promise<void>;
}

const PLACEHOLDERS = [
  "What's the one thing that must get done today?",
  "What will make today feel successful?",
  "What do you want to make progress on?",
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [texts, setTexts] = useState(['', '', '']);
  const [isSaving, setIsSaving] = useState(false);

  const handleFinish = async () => {
    setIsSaving(true);
    const intentions: Intention[] = texts.map(t => ({
      text: t.trim() || '(tap to set)',
      completed: false,
    }));
    await onComplete(intentions);
    setIsSaving(false);
  };

  if (step === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#1a0d3a] via-[#0d1b3a] to-[#0a0a0f] px-6 py-12">
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white mb-3">IntentionStack</h1>
            <p className="text-gray-300 text-lg">Your daily focus ritual.</p>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-sm text-left">
            {[
              { icon: <Target className="w-5 h-5 text-amber-400" />, title: 'Set 3 daily intentions', desc: 'Morning: define what matters most today.' },
              { icon: <Timer className="w-5 h-5 text-purple-400" />, title: 'Focus with Pomodoro', desc: 'Work in focused 25-min sprints.' },
              { icon: <Sparkles className="w-5 h-5 text-emerald-400" />, title: 'Review your evening', desc: 'Check off, rate your energy, reflect.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="mt-0.5">{item.icon}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setStep(1)}
            className="w-full max-w-sm py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            Get Started <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 1) {
    const canProceed = texts.some(t => t.trim().length > 0);
    return (
      <div className="flex flex-col min-h-screen bg-[var(--bg)] px-6 py-12">
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            {[0, 1, 2].map(i => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= 1 ? 'bg-amber-500' : 'bg-[var(--border)]'}`} />
            ))}
          </div>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Step 2 of 3</p>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-1">Set your first 3 intentions</h2>
          <p className="text-[var(--text-muted)] text-sm mt-1">What matters most to you today?</p>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          {texts.map((text, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-2">
                <span className="text-amber-400 text-sm font-bold">{idx + 1}</span>
              </div>
              <textarea
                value={text}
                onChange={e => setTexts(prev => prev.map((t, i) => i === idx ? e.target.value : t))}
                placeholder={PLACEHOLDERS[idx]}
                rows={2}
                className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-secondary)] placeholder-gray-500 focus:outline-none focus:border-amber-500/50 resize-none"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => setStep(2)}
          disabled={!canProceed}
          className="mt-6 w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold text-lg transition-all flex items-center justify-center gap-2"
        >
          Continue <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] px-6 py-12">
      <div className="mb-6">
        <div className="flex gap-2 mb-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-1 flex-1 rounded-full bg-amber-500" />
          ))}
        </div>
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Step 3 of 3</p>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-1">Your first focus session</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">Here's how Pomodoro works:</p>
      </div>
      <div className="flex flex-col gap-3 mb-8">
        {[
          { time: '25 min', label: 'Deep work sprint', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { time: '5 min', label: 'Short break', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { time: 'After 4', label: '15-min long break', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        ].map(item => (
          <div key={item.time} className={`flex items-center gap-4 p-4 rounded-xl border ${item.bg}`}>
            <span className={`text-2xl font-black ${item.color}`}>{item.time}</span>
            <span className="text-[var(--text-secondary)] text-sm">{item.label}</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleFinish}
        disabled={isSaving}
        className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-lg transition-all flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5" />
        {isSaving ? 'Setting up...' : "Let's go!"}
      </button>
    </div>
  );
};
