export const MORNING_QUOTES: string[] = [
  "The secret of getting ahead is getting started.",
  "Focus on being productive instead of busy.",
  "You don't have to be great to start, but you have to start to be great.",
  "Small daily improvements over time lead to stunning results.",
  "What you do today can improve all your tomorrows.",
  "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
  "Energy and persistence conquer all things.",
  "It's not about having time. It's about making time.",
  "One day or day one. You decide.",
  "Action is the foundational key to all success.",
  "Don't count the days. Make the days count.",
  "The only way to do great work is to love what you do.",
  "Your intentions shape your reality. Make them count.",
  "A goal without a plan is just a wish.",
  "Begin each day as if it were on purpose.",
  "Progress, not perfection.",
  "The morning is the rudder of the day.",
  "Set an intention and the universe conspires to help you.",
  "Today is a new opportunity to build the life you want.",
  "Start where you are. Use what you have. Do what you can.",
];

export function getDailyQuote(dateStr: string): string {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) % MORNING_QUOTES.length;
  }
  return MORNING_QUOTES[Math.abs(hash) % MORNING_QUOTES.length];
}
