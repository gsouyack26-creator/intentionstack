const MORNING_KEY_PREFIX = 'notif_morning_';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
}

export function fireNotification(title: string, body: string): void {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  try {
    new Notification(title, {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
    });
  } catch {
    // Some browsers block notifications in certain contexts
  }
}

export function maybeFireMorningReminder(): void {
  const todayKey = new Date().toISOString().slice(0, 10);
  const lsKey = `${MORNING_KEY_PREFIX}${todayKey}`;
  if (localStorage.getItem(lsKey)) return;

  const hour = new Date().getHours();
  if (hour < 8) return; // too early

  fireNotification(
    '🌅 IntentionStack',
    "Set your intentions for today — what will make today meaningful?"
  );
  localStorage.setItem(lsKey, '1');
}

export function fireBreakNotification(isLongBreak: boolean): void {
  fireNotification(
    isLongBreak ? '☕ Long break time!' : '🌿 Break time!',
    isLongBreak
      ? 'Great work! Take a 15-minute rest, you earned it.'
      : 'Nice focus sprint! Take a 5-minute breather.'
  );
}
