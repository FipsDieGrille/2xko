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
    <div
      className="rounded-xl p-4 flex gap-0 overflow-hidden"
      style={{ backgroundColor: '#12121e', border: '1px solid #222244' }}
    >
      {/* Accent left border */}
      <div className="w-1 -ml-4 -my-4 mr-4 shrink-0" style={{ backgroundColor: diffColor }} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-heading font-bold text-sm" style={{ color: '#eeeef4' }}>{combo.name}</span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ color: diffColor, backgroundColor: `${diffColor}15`, border: `1px solid ${diffColor}40` }}
          >
            {DIFFICULTY_LABEL[combo.difficulty]}
          </span>
        </div>

        <ComboNotation notation={combo.notation} />

        <div className="flex flex-wrap gap-1.5 mt-2">
          <Badge label={`${dmg} dmg`} />
          <Badge label={`${meterLabel}`} />
          <Badge label={posLabel} />
          {combo.hasAssist && <Badge label={combo.partner ?? 'Assist'} accent />}
          {combo.meterGain != null && <Badge label={`+${combo.meterGain} meter`} />}
        </div>

        {combo.notes && (
          <p className="mt-2 text-xs italic" style={{ color: '#7777aa' }}>{combo.notes}</p>
        )}
      </div>
    </div>
  );
}

function Badge({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span
      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: accent ? '#6c5ce715' : '#1a1a2e',
        color: accent ? '#6c5ce7' : '#7777aa',
        border: `1px solid ${accent ? '#6c5ce740' : '#222244'}`,
      }}
    >
      {label}
    </span>
  );
}
