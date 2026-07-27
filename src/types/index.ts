export interface Intention {
  text: string;
  completed: boolean;
  completedAt?: string;
  note?: string;
}

export interface DailyEntry {
  id?: number;
  date: string;
  intentions: Intention[];
  energyRating?: number;
  reflection?: string;
  morningDone: boolean;
  eveningDone: boolean;
  focusMinutes: number;
  createdAt: string;
}

export interface FocusSession {
  id?: number;
  date: string;
  intentionIndex?: number;
  durationMinutes: number;
  completedAt: string;
  type: 'focus' | 'shortBreak' | 'longBreak';
}

export interface Settings {
  id?: number;
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLong: number;
  notificationsEnabled: boolean;
  theme: 'dark' | 'light';
  onboardingComplete: boolean;
}

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;
export type TimerPhase = 'idle' | 'focus' | 'shortBreak' | 'longBreak';
