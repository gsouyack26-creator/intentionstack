import React, { useState, useEffect } from 'react';
import { Layout, type ViewName } from './components/Layout';
import { MorningView } from './components/MorningView';
import { FocusTimer } from './components/FocusTimer';
import { EveningView } from './components/EveningView';
import { HistoryView } from './components/HistoryView';
import { PatternView } from './components/PatternView';
import { OnboardingFlow } from './components/OnboardingFlow';
import { useToday } from './hooks/useToday';
import { useHistory } from './hooks/useHistory';
import { useSettings } from './hooks/useSettings';
import { useStreak } from './hooks/useStreak';
import type { Intention } from './types';

export default function App() {
  const { entry, morningDone, eveningDone, createEntry, updateEntry } = useToday();
  const { entries, allEntries } = useHistory();
  const { settings, isLoading: settingsLoading, update: updateSettings } = useSettings();
  const streak = useStreak(allEntries);

  const getDefaultView = (): ViewName => {
    if (!morningDone) return 'morning';
    if (morningDone && !eveningDone) return 'focus';
    return 'evening';
  };

  const [currentView, setCurrentView] = useState<ViewName>(getDefaultView);

  useEffect(() => {
    if (!morningDone) {
      setCurrentView('morning');
    }
  }, [morningDone]);

  const handleMorningSave = async (intentions: Intention[]) => {
    if (entry) {
      await updateEntry({ intentions, morningDone: true });
    } else {
      await createEntry(intentions);
    }
    setCurrentView('focus');
  };

  const handleEveningSave = async (updates: {
    intentions: Intention[];
    energyRating: number | undefined;
    reflection: string;
  }) => {
    await updateEntry({
      intentions: updates.intentions,
      energyRating: updates.energyRating,
      reflection: updates.reflection,
      eveningDone: true,
    });
  };

  const handleOnboardingComplete = async (intentions: Intention[]) => {
    if (entry) {
      await updateEntry({ intentions, morningDone: true });
    } else {
      await createEntry(intentions);
    }
    await updateSettings({ onboardingComplete: true });
    setCurrentView('focus');
  };

  if (settingsLoading || settings === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!settings.onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'morning':
        return (
          <MorningView
            entry={entry}
            onSave={handleMorningSave}
            onNavigateToFocus={() => setCurrentView('focus')}
          />
        );
      case 'focus':
        return <FocusTimer entry={entry} settings={settings} streak={streak} />;
      case 'evening':
        return <EveningView entry={entry} onSave={handleEveningSave} />;
      case 'history':
        return <HistoryView entries={allEntries} />;
      case 'patterns':
        return <PatternView entries={entries} allEntries={allEntries} streak={streak} />;
    }
  };

  return (
    <Layout
      currentView={currentView}
      onNavigate={setCurrentView}
      morningDone={morningDone}
      eveningDone={eveningDone}
    >
      {renderView()}
    </Layout>
  );
}
