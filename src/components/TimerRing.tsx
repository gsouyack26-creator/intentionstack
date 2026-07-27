import React from 'react';
import type { TimerPhase } from '../types';

interface TimerRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  phase: TimerPhase;
  children?: React.ReactNode;
}

export const TimerRing: React.FC<TimerRingProps> = ({
  progress,
  size = 260,
  strokeWidth = 8,
  phase,
  children,
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const getColor = () => {
    switch (phase) {
      case 'focus': return '#f59e0b';
      case 'shortBreak': return '#10b981';
      case 'longBreak': return '#8b5cf6';
      default: return '#374151';
    }
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute top-0 left-0 -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e1e2a"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
        />
      </svg>
      <div className="z-10 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};
