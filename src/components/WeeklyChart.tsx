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
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({
  entries,
  type = 'completion',
  title,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tooltipFormatter = (value: any): [string, string] => {
    if (type === 'completion') return [`${value}%`, 'Completion'];
    return [`${value}`, 'Energy'];
  };

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-semibold text-gray-400 mb-3">{title}</h3>}
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2a" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: '#1e1e2a' }}
            tickLine={false}
          />
          <YAxis
            domain={type === 'completion' ? [0, 100] : [0, 5]}
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#13131a',
              border: '1px solid #1e1e2a',
              borderRadius: '8px',
              color: '#e5e7eb',
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
