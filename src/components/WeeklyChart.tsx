import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import type { DailyEntry } from '../types';
import { last8Weeks } from '../utils/dates';
import { completionScore } from '../utils/scoring';

interface WeeklyChartProps {
  entries: DailyEntry[];
  type?: 'completion' | 'energy';
  title?: string;
  theme?: 'dark' | 'light';
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({
  entries,
  type = 'completion',
  title,
  theme = 'dark',
}) => {
  const weeks = last8Weeks();

  const data = weeks.map(week => {
    const weekEntries = entries.filter(
      e => e.date >= week.weekStart && e.date <= week.weekEnd
    );
    if (type === 'completion') {
      const avg = weekEntries.length > 0
        ? weekEntries.reduce((acc, e) => acc + completionScore(e), 0) / weekEntries.length * 100
        : null;
      return { label: week.label, value: avg !== null ? Math.round(avg) : null };
    } else {
      const withEnergy = weekEntries.filter(e => e.energyRating);
      const avg = withEnergy.length > 0
        ? withEnergy.reduce((acc, e) => acc + (e.energyRating ?? 0), 0) / withEnergy.length
        : null;
      return { label: week.label, value: avg !== null ? Math.round(avg * 10) / 10 : null };
    }
  });

  const color = type === 'completion' ? '#f59e0b' : '#8b5cf6';
  const isDark = theme === 'dark';

  const tooltipFormatter = (value: number | string | readonly (number | string)[] | undefined): [string, string] => {
    if (type === 'completion') return [`${value ?? 0}%`, 'Completion'];
    return [`${value ?? 0}`, 'Energy'];
  };

  const gridColor = isDark ? '#1e1e2a' : '#e5e7eb';
  const tickColor = isDark ? '#6b7280' : '#9ca3af';
  const tooltipBg = isDark ? '#13131a' : '#ffffff';
  const tooltipBorder = isDark ? '#1e1e2a' : '#e5e7eb';
  const tooltipText = isDark ? '#e5e7eb' : '#111827';

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-semibold text-[var(--text-muted)] mb-3">{title}</h3>}
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="label"
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
          />
          <YAxis
            domain={type === 'completion' ? [0, 100] : [0, 5]}
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '8px',
              color: tooltipText,
              fontSize: 12,
            }}
            formatter={tooltipFormatter}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 3 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
