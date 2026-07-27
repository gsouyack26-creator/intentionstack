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

  const update = async (updates: Partial<Settings>) => {
    await updateSettings(updates);
  };

  return {
    settings: settings ?? null,
    isLoading: !initialized || settings === undefined,
    update,
  };
}
