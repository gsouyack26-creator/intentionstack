export function todayKey(): string {
  return formatDateKey(new Date());
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getDayOfWeek(dateStr?: string): string {
  const date = dateStr
    ? (() => { const [y,m,d] = dateStr.split('-').map(Number); return new Date(y, m-1, d); })()
    : new Date();
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function last30Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(formatDateKey(d));
  }
  return days;
}

export function last8Weeks(): { weekStart: string; weekEnd: string; label: string }[] {
  const weeks = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfThisWeek = new Date(today);
  startOfThisWeek.setDate(today.getDate() - dayOfWeek);

  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date(startOfThisWeek);
    weekStart.setDate(startOfThisWeek.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weeks.push({
      weekStart: formatDateKey(weekStart),
      weekEnd: formatDateKey(weekEnd),
      label: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }
  return weeks;
}

export function getWeekRange(date: Date): { start: string; end: string } {
  const d = new Date(date);
  const day = d.getDay();
  const start = new Date(d);
  start.setDate(d.getDate() - day);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: formatDateKey(start), end: formatDateKey(end) };
}

export function isToday(dateStr: string): boolean {
  return dateStr === todayKey();
}
