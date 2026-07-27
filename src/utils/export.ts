import { db } from '../db/db';

function downloadBlob(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function exportAllJSON(): Promise<void> {
  const [dailyEntries, focusSessions, settings] = await Promise.all([
    db.dailyEntries.toArray(),
    db.focusSessions.toArray(),
    db.settings.toArray(),
  ]);

  const backup = {
    exportedAt: new Date().toISOString(),
    version: 1,
    dailyEntries,
    focusSessions,
    settings,
  };

  const filename = `intentionstack-backup-${new Date().toISOString().slice(0, 10)}.json`;
  downloadBlob(JSON.stringify(backup, null, 2), filename, 'application/json');
}

export async function exportEntriesCSV(): Promise<void> {
  const entries = await db.dailyEntries.toArray();

  const headers = [
    'date',
    'intention1', 'intention1_completed',
    'intention2', 'intention2_completed',
    'intention3', 'intention3_completed',
    'energyRating',
    'focusMinutes',
    'reflection',
    'morningDone',
    'eveningDone',
  ];

  const escape = (v: string | number | boolean | undefined): string => {
    if (v === undefined || v === null) return '';
    const str = String(v);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = entries.map(e => {
    const i = e.intentions;
    return [
      escape(e.date),
      escape(i[0]?.text ?? ''),
      escape(i[0]?.completed ?? false),
      escape(i[1]?.text ?? ''),
      escape(i[1]?.completed ?? false),
      escape(i[2]?.text ?? ''),
      escape(i[2]?.completed ?? false),
      escape(e.energyRating),
      escape(e.focusMinutes),
      escape(e.reflection),
      escape(e.morningDone),
      escape(e.eveningDone),
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  const filename = `intentionstack-entries-${new Date().toISOString().slice(0, 10)}.csv`;
  downloadBlob(csv, filename, 'text/csv');
}

interface BackupData {
  version?: number;
  dailyEntries?: unknown[];
  focusSessions?: unknown[];
  settings?: unknown[];
}

export async function importJSON(file: File): Promise<void> {
  const text = await file.text();
  const data: BackupData = JSON.parse(text);

  if (data.dailyEntries && Array.isArray(data.dailyEntries)) {
    await db.dailyEntries.bulkPut(data.dailyEntries as Parameters<typeof db.dailyEntries.bulkPut>[0]);
  }
  if (data.focusSessions && Array.isArray(data.focusSessions)) {
    await db.focusSessions.bulkPut(data.focusSessions as Parameters<typeof db.focusSessions.bulkPut>[0]);
  }
  if (data.settings && Array.isArray(data.settings)) {
    await db.settings.bulkPut(data.settings as Parameters<typeof db.settings.bulkPut>[0]);
  }
}
