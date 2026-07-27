import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import type { Intention } from '../types';

interface IntentionItemProps {
  intention: Intention;
  index: number;
  onToggle?: (idx: number) => void;
  readOnly?: boolean;
  showNote?: boolean;
}

export const IntentionItem: React.FC<IntentionItemProps> = ({
  intention,
  index,
  onToggle,
  readOnly = false,
  showNote = false,
}) => {
  const icon = intention.completed
    ? <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
    : <Circle className="w-5 h-5 text-gray-600 flex-shrink-0" />;

  return (
    <div
      className={[
        'flex items-start gap-3 p-3 rounded-xl transition-all duration-300',
        intention.completed ? 'bg-emerald-500/10' : 'bg-white/3',
        !readOnly ? 'cursor-pointer hover:bg-white/8' : '',
      ].join(' ')}
      onClick={() => !readOnly && onToggle?.(index)}
    >
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className={[
          'text-sm font-medium transition-all duration-300',
          intention.completed
            ? 'text-emerald-300 line-through decoration-emerald-500/50'
            : 'text-gray-200',
        ].join(' ')}>
          {intention.text}
        </p>
        {showNote && intention.note && (
          <p className="text-xs text-gray-500 mt-1">{intention.note}</p>
        )}
        {intention.completedAt && (
          <p className="text-xs text-gray-600 mt-0.5">
            Done at {new Date(intention.completedAt).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </div>
  );
};
