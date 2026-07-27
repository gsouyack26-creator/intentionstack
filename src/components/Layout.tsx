import React from 'react';
import { Sun, Timer, Moon, BookOpen, BarChart2, Settings, SunMedium } from 'lucide-react';

export type ViewName = 'morning' | 'focus' | 'evening' | 'history' | 'patterns' | 'settings';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
  morningDone?: boolean;
  eveningDone?: boolean;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

const NAV_ITEMS: { id: ViewName; label: string; icon: React.ReactNode }[] = [
  { id: 'morning', label: 'Morning', icon: <Sun className="w-5 h-5" /> },
  { id: 'focus', label: 'Focus', icon: <Timer className="w-5 h-5" /> },
  { id: 'evening', label: 'Evening', icon: <Moon className="w-5 h-5" /> },
  { id: 'history', label: 'History', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'patterns', label: 'Patterns', icon: <BarChart2 className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onNavigate,
  morningDone,
  eveningDone,
  theme = 'dark',
  onToggleTheme,
}) => {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col max-w-lg mx-auto relative">
      {/* Theme toggle — floating top-right */}
      {onToggleTheme && (
        <button
          onClick={onToggleTheme}
          aria-label="Toggle light/dark mode"
          className="fixed top-3 right-3 z-50 w-9 h-9 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          style={{ maxWidth: 'calc(50vw + 256px - 12px)' }}
        >
          {theme === 'dark'
            ? <SunMedium className="w-4 h-4 text-amber-400" />
            : <Moon className="w-4 h-4 text-[var(--text-muted)]" />
          }
        </button>
      )}

      <main className="flex-1 overflow-y-auto pb-20">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-[var(--nav-bg)]/95 backdrop-blur-xl border-t border-[var(--border)] z-50">
        <div className="flex items-stretch">
          {NAV_ITEMS.map(item => {
            const isActive = currentView === item.id;
            const hasDot =
              (item.id === 'morning' && !morningDone) ||
              (item.id === 'evening' && morningDone && !eveningDone);
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={[
                  'flex-1 flex flex-col items-center gap-1 py-3 px-1 relative transition-all duration-200',
                  isActive
                    ? 'text-amber-400'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
                ].join(' ')}
              >
                {item.icon}
                <span className="text-[9px] font-medium">{item.label}</span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-400 rounded-full" />
                )}
                {hasDot && !isActive && (
                  <span className="absolute top-2 right-1/4 w-1.5 h-1.5 bg-amber-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
};
