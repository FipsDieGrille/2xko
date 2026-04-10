'use client';

import { useState } from 'react';
import { ComboEntry, ComboVariant } from '../../../src/combos/types';
import { getFullNotation, getBestVariant } from '../../../src/combos/utils';
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
  const hasVariants = combo.variants && combo.variants.length > 0;

  // Sort variants by damage descending so index 0 = best
  const sortedVariants = hasVariants
    ? [...combo.variants!].sort((a, b) => (b.damage ?? 0) - (a.damage ?? 0))
    : undefined;

  const [variantIdx, setVariantIdx] = useState(0);
  const activeVariant = sortedVariants?.[variantIdx];

  const notation = getFullNotation(combo, activeVariant);
  const damage = activeVariant ? activeVariant.damage : combo.damage;
  const damageMax = activeVariant ? activeVariant.damageMax : combo.damageMax;
  const hits = activeVariant ? activeVariant.hits : combo.hits;
  const meter = activeVariant ? activeVariant.meter : (combo.meter ?? 0);
  const meterGain = activeVariant ? activeVariant.meterGain : combo.meterGain;
  const variantNotes = activeVariant?.notes;

  const dmg = damage == null ? '?' : damageMax ? `${damage}–${damageMax}` : `${damage}`;
  const meterLabel = meter === 0 ? '0 bars' : meter === 1 ? '1 bar' : `${meter} bars`;
  const posLabel = combo.position === 'anywhere' ? 'Anywhere' : combo.position.charAt(0).toUpperCase() + combo.position.slice(1);
  const diffColor = combo.difficulty ? DIFFICULTY_COLOR[combo.difficulty] : '#444466';

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
          {combo.difficulty && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
              style={{ color: diffColor, backgroundColor: `${diffColor}15`, border: `1px solid ${diffColor}40` }}
            >
              {DIFFICULTY_LABEL[combo.difficulty]}
            </span>
          )}
        </div>

        <ComboNotation notation={notation} />

        <div className="flex flex-wrap gap-1.5 mt-2">
          <Badge label={`${dmg} dmg`} />
          {hits != null && <Badge label={`${hits} hits`} />}
          <Badge label={meterLabel} />
          {combo.position !== 'anywhere' && <Badge label={posLabel} />}
          {combo.hasAssist && <Badge label={combo.partner ?? 'Assist'} accent />}
          {combo.fuse && <Badge label={combo.fuse} accent />}
          {meterGain != null && <Badge label={`+${meterGain} meter`} />}
        </div>

        {(combo.notes || variantNotes) && (
          <p className="mt-2 text-xs italic" style={{ color: '#7777aa' }}>
            {[combo.notes, variantNotes].filter(Boolean).join(' — ')}
          </p>
        )}

        {/* Variant pill tabs */}
        {sortedVariants && sortedVariants.length > 1 && (
          <div className="flex items-center gap-1.5 mt-3">
            {sortedVariants.map((v, idx) => {
              const isActive = idx === variantIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setVariantIdx(idx)}
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-all"
                  style={{
                    color: isActive ? '#6c5ce7' : '#7777aa',
                    backgroundColor: isActive ? '#6c5ce715' : '#1a1a2e',
                    border: `1px solid ${isActive ? '#6c5ce7' : '#222244'}`,
                    boxShadow: isActive ? '0 0 8px #6c5ce730' : 'none',
                  }}
                >
                  {v.name ?? `v${idx + 1}`}
                </button>
              );
            })}
          </div>
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
