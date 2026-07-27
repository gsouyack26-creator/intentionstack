import React from 'react';

interface EnergyRatingProps {
  value: number | undefined;
  onChange: (value: number) => void;
  readOnly?: boolean;
}

const ENERGY_EMOJIS = ['😴', '😐', '🙂', '😄', '🔥'];
const ENERGY_LABELS = ['Drained', 'Low', 'Okay', 'Good', 'Fired Up'];

export const EnergyRating: React.FC<EnergyRatingProps> = ({ value, onChange, readOnly = false }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-3">
        {ENERGY_EMOJIS.map((emoji, idx) => {
          const rating = idx + 1;
          const isSelected = value === rating;
          return (
            <button
              key={rating}
              onClick={() => !readOnly && onChange(rating)}
              disabled={readOnly}
              className={[
                'flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200',
                isSelected
                  ? 'bg-amber-500/20 ring-2 ring-amber-500 scale-110'
                  : 'hover:bg-white/5 hover:scale-105',
                readOnly ? 'cursor-default' : 'cursor-pointer',
              ].join(' ')}
            >
              <span className="text-2xl">{emoji}</span>
              <span className={`text-xs font-medium ${isSelected ? 'text-amber-400' : 'text-gray-500'}`}>
                {rating}
              </span>
            </button>
          );
        })}
      </div>
      {value && (
        <p className="text-sm text-amber-400 font-medium">{ENERGY_LABELS[value - 1]}</p>
      )}
    </div>
  );
};

export function energyEmoji(level: number | undefined): string {
  if (!level) return '—';
  return ENERGY_EMOJIS[(level - 1)] ?? '—';
}
