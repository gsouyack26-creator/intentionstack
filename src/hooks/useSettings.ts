import { useState, useEffect } from 'react';
import { db, getSettings, updateSettings } from '../db/db';
import type { Settings } from '../types';
import { useLiveQuery } from 'dexie-react-hooks';

export function useSettings() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    getSettings().then(() => setInitialized(true));
  }, []);

  const settings = useLiveQuery(
    () => db.settings.toCollection().first(),
    []
  ) as Settings | undefined;

  // Apply light/dark class to <html> whenever theme changes
  useEffect(() => {
    if (!settings) return;
    if (settings.theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [settings?.theme]);

  const update = async (updates: Partial<Settings>) => {
    await updateSettings(updates);
  };

  return {
    settings: settings ?? null,
    isLoading: !initialized || settings === undefined,
    update,
  };
}
