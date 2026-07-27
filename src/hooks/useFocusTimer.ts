import { useState, useEffect, useRef, useCallback } from 'react';
import type { TimerPhase } from '../types';
import { db } from '../db/db';
import { todayKey } from '../utils/dates';
import { playTimerEnd, playBreakEnd } from '../utils/sounds';

interface FocusTimerState {
  phase: TimerPhase;
  secondsLeft: number;
  sessionCount: number;
  isRunning: boolean;
  selectedIntention: number | null;
}

interface UseFocusTimerReturn extends FocusTimerState {
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  setSelectedIntention: (idx: number | null) => void;
  totalSeconds: number;
  progress: number;
}

export function useFocusTimer(
  focusDuration = 25,
  shortBreakDuration = 5,
  longBreakDuration = 15,
  sessionsBeforeLong = 4
): UseFocusTimerReturn {
  const [state, setState] = useState<FocusTimerState>({
    phase: 'idle',
    secondsLeft: focusDuration * 60,
    sessionCount: 0,
    isRunning: false,
    selectedIntention: null,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getDuration = useCallback((phase: TimerPhase): number => {
    switch (phase) {
      case 'focus': return focusDuration * 60;
      case 'shortBreak': return shortBreakDuration * 60;
      case 'longBreak': return longBreakDuration * 60;
      default: return focusDuration * 60;
    }
  }, [focusDuration, shortBreakDuration, longBreakDuration]);

  const handlePhaseComplete = useCallback(async (currentState: FocusTimerState) => {
    if (currentState.phase === 'focus') {
      playTimerEnd();
      await db.focusSessions.add({
        date: todayKey(),
        intentionIndex: currentState.selectedIntention ?? undefined,
        durationMinutes: focusDuration,
        completedAt: new Date().toISOString(),
        type: 'focus',
      });
      const today = await db.dailyEntries.where('date').equals(todayKey()).first();
      if (today?.id !== undefined) {
        await db.dailyEntries.update(today.id, {
          focusMinutes: (today.focusMinutes || 0) + focusDuration,
        });
      }
      const newSessionCount = currentState.sessionCount + 1;
      const nextPhase: TimerPhase = newSessionCount % sessionsBeforeLong === 0
        ? 'longBreak' : 'shortBreak';
      setState(prev => ({
        ...prev,
        phase: nextPhase,
        secondsLeft: getDuration(nextPhase),
        sessionCount: newSessionCount,
        isRunning: false,
      }));
    } else {
      playBreakEnd();
      setState(prev => ({
        ...prev,
        phase: 'focus',
        secondsLeft: getDuration('focus'),
        isRunning: false,
      }));
    }
  }, [focusDuration, sessionsBeforeLong, getDuration]);

  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          if (prev.secondsLeft <= 1) {
            clearInterval(intervalRef.current!);
            handlePhaseComplete(prev);
            return { ...prev, secondsLeft: 0, isRunning: false };
          }
          return { ...prev, secondsLeft: prev.secondsLeft - 1 };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isRunning, handlePhaseComplete]);

  const start = useCallback(() => {
    setState(prev => {
      const phase = prev.phase === 'idle' ? 'focus' : prev.phase;
      return {
        ...prev,
        phase,
        secondsLeft: prev.phase === 'idle' ? getDuration('focus') : prev.secondsLeft,
        isRunning: true,
      };
    });
  }, [getDuration]);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'focus',
      secondsLeft: getDuration('focus'),
      isRunning: false,
    }));
  }, [getDuration]);

  const skip = useCallback(() => {
    setState(prev => {
      const nextPhase: TimerPhase = prev.phase === 'focus'
        ? (prev.sessionCount % sessionsBeforeLong === sessionsBeforeLong - 1
            ? 'longBreak' : 'shortBreak')
        : 'focus';
      return {
        ...prev,
        phase: nextPhase,
        secondsLeft: getDuration(nextPhase),
        isRunning: false,
        sessionCount: prev.phase === 'focus' ? prev.sessionCount + 1 : prev.sessionCount,
      };
    });
  }, [sessionsBeforeLong, getDuration]);

  const setSelectedIntention = useCallback((idx: number | null) => {
    setState(prev => ({ ...prev, selectedIntention: idx }));
  }, []);

  const totalSeconds = getDuration(state.phase === 'idle' ? 'focus' : state.phase);
  const progress = state.phase === 'idle'
    ? 0
    : (totalSeconds - state.secondsLeft) / totalSeconds;

  return { ...state, start, pause, reset, skip, setSelectedIntention, totalSeconds, progress };
}
