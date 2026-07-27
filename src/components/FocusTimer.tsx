import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, Flame, Clock, Target } from 'lucide-react';
import { TimerRing } from './TimerRing';
import { useFocusTimer } from '../hooks/useFocusTimer';
import type { DailyEntry, Settings } from '../types';

interface FocusTimerProps {
  entry: DailyEntry | undefined;
  settings: Settings | null;
  streak: number;
}

const PHASE_LABELS = {
  idle: 'READY',
  focus: 'FOCUS',
  shortBreak: 'SHORT BREAK',
  longBreak: 'LONG BREAK',
};

const PHASE_COLORS = {
  idle: 'text-[var(--text-muted)]',
  focus: 'text-amber-400',
  shortBreak: 'text-emerald-400',
  longBreak: 'text-purple-400',
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ entry, settings, streak }) => {
  const timer = useFocusTimer(
    settings?.focusDuration ?? 25,
    settings?.shortBreakDuration ?? 5,
    settings?.longBreakDuration ?? 15,
    settings?.sessionsBeforeLong ?? 4,
    settings?.notificationsEnabled ?? false
  );
  const sessionsBeforeLong = settings?.sessionsBeforeLong ?? 4;

  return (
    <div className="flex flex-col items-center px-6 pt-6 pb-4 gap-6">
      <div className="flex flex-col items-center gap-1">
        <span className={`text-xs font-bold tracking-[0.2em] uppercase ${PHASE_COLORS[timer.phase]}`}>
          {PHASE_LABELS[timer.phase]}
        </span>
      </div>

      <TimerRing progress={timer.progress} size={220} phase={timer.phase}>
        <span className="text-4xl font-mono font-bold text-[var(--text-primary)] tracking-tight">
          {formatTime(timer.secondsLeft)}
        </span>
        {timer.phase !== 'idle' && (
          <span className="text-xs text-[var(--text-muted)] mt-1 font-medium">
            {PHASE_LABELS[timer.phase]}
          </span>
        )}
      </TimerRing>

      <div className="flex flex-col items-center gap-1.5">
        <div className="flex gap-2">
          {Array.from({ length: sessionsBeforeLong }).map((_, i) => (
            <div
              key={i}
              className={[
                'w-2.5 h-2.5 rounded-full transition-all duration-300',
                i < (timer.sessionCount % sessionsBeforeLong)
                  ? 'bg-amber-400 scale-110'
                  : 'bg-[var(--border)]',
              ].join(' ')}
            />
          ))}
        </div>
        <span className="text-xs text-[var(--text-muted)]">
          Session {(timer.sessionCount % sessionsBeforeLong) + 1} of {sessionsBeforeLong}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={timer.reset}
          className="w-10 h-10 rounded-full bg-[var(--card)] border border-[var(--border)] hover:border-amber-500/40 flex items-center justify-center transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-[var(--text-muted)]" />
        </button>
        <button
          onClick={timer.isRunning ? timer.pause : timer.start}
          className={[
            'w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95',
            timer.phase === 'focus' || timer.phase === 'idle'
              ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/30'
              : 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/30',
          ].join(' ')}
        >
          {timer.isRunning
            ? <Pause className="w-7 h-7 text-black" />
            : <Play className="w-7 h-7 text-black ml-0.5" />
          }
        </button>
        <button
          onClick={timer.skip}
          className="w-10 h-10 rounded-full bg-[var(--card)] border border-[var(--border)] hover:border-amber-500/40 flex items-center justify-center transition-colors"
        >
          <SkipForward className="w-4 h-4 text-[var(--text-muted)]" />
        </button>
      </div>

      {entry?.intentions && (
        <div className="w-full bg-[var(--card)] rounded-2xl border border-[var(--border)] p-4">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Working on
          </p>
          <div className="flex flex-col gap-2">
            {entry.intentions.map((intention, idx) => (
              <button
                key={idx}
                onClick={() => timer.setSelectedIntention(
                  timer.selectedIntention === idx ? null : idx
                )}
                className={[
                  'text-left p-2.5 rounded-xl text-sm transition-all duration-200',
                  timer.selectedIntention === idx
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                    : 'bg-[var(--card-input)] border border-transparent text-[var(--text-muted)] hover:border-[var(--border)]',
                  intention.completed ? 'opacity-50 line-through' : '',
                ].join(' ')}
              >
                <span className="text-xs font-bold mr-2 opacity-60">{idx + 1}</span>
                {intention.text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="w-full grid grid-cols-3 gap-3">
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-3 text-center">
          <Target className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-[var(--text-primary)]">{timer.sessionCount}</p>
          <p className="text-xs text-[var(--text-muted)]">Sessions</p>
        </div>
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-3 text-center">
          <Clock className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-[var(--text-primary)]">{entry?.focusMinutes ?? 0}</p>
          <p className="text-xs text-[var(--text-muted)]">Minutes</p>
        </div>
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-3 text-center">
          <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-[var(--text-primary)]">{streak}</p>
          <p className="text-xs text-[var(--text-muted)]">Day streak</p>
        </div>
      </div>
    </div>
  );
};
