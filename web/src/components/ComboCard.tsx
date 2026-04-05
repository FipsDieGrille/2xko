'use client';

import { ComboEntry } from '../../../src/combos/types';
import { ComboNotation } from './ComboNotation';

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: 'BEG',
  intermediate: 'INT',
  advanced: 'ADV',
};

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: '#22c55e',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
};

export function ComboCard({ combo }: { combo: ComboEntry }) {
  const dmg = combo.damage == null
    ? '?'
    : combo.damageMax
    ? `${combo.damage}–${combo.damageMax}`
    : `${combo.damage}`;

  const meterLabel = combo.meter === 0 ? '0 bars' : combo.meter === 1 ? '1 bar' : `${combo.meter} bars`;
  const posLabel = combo.position === 'anywhere' ? 'Any' : combo.position.charAt(0).toUpperCase() + combo.position.slice(1);
  const diffColor = DIFFICULTY_COLOR[combo.difficulty];

  return (
    <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: '#1a1a2e', border: '1px solid #333355' }}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-sm" style={{ color: '#e0e0f0' }}>{combo.name}</span>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded border"
          style={{ color: diffColor, borderColor: diffColor }}
        >
          {DIFFICULTY_LABEL[combo.difficulty]}
        </span>
      </div>

      <ComboNotation notation={combo.notation} />

      <div className="flex flex-wrap gap-2 mt-2">
        <Badge label={`💥 ${dmg} dmg`} />
        <Badge label={`⚡ ${meterLabel}`} />
        <Badge label={`📍 ${posLabel}`} />
        {combo.hasAssist && <Badge label={`🤝 ${combo.partner ?? 'Assist'}`} />}
        {combo.meterGain != null && <Badge label={`📈 +${combo.meterGain} meter`} />}
      </div>

      {combo.notes && (
        <p className="mt-2 text-xs italic" style={{ color: '#8888aa' }}>{combo.notes}</p>
      )}
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#252540', color: '#8888aa' }}>
      {label}
    </span>
  );
}
