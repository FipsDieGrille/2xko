'use client';

import { useState, useMemo } from 'react';
import { ComboEntry } from '../../../../src/combos/types';
import { ComboCard } from '@/components/ComboCard';

type MeterFilter = 'all' | '0' | '1' | '2+';
type AssistFilter = 'all' | 'no' | 'yes';
type PositionFilter = 'all' | 'anywhere' | 'corner' | 'midscreen';
type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

export function ComboListClient({ combos }: { combos: ComboEntry[] }) {
  const [meter, setMeter] = useState<MeterFilter>('all');
  const [assist, setAssist] = useState<AssistFilter>('all');
  const [position, setPosition] = useState<PositionFilter>('all');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');

  const filtered = useMemo(() => combos.filter((c) => {
    if (meter === '0' && c.meter !== 0) return false;
    if (meter === '1' && c.meter !== 1) return false;
    if (meter === '2+' && c.meter < 2) return false;
    if (assist === 'yes' && !c.hasAssist) return false;
    if (assist === 'no' && c.hasAssist) return false;
    if (position !== 'all' && c.position !== position) return false;
    if (difficulty !== 'all' && c.difficulty !== difficulty) return false;
    return true;
  }), [combos, meter, assist, position, difficulty]);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterGroup label="Meter">
          {(['all', '0', '1', '2+'] as MeterFilter[]).map((v) => (
            <Chip key={v} active={meter === v} onClick={() => setMeter(v)}>
              {v === 'all' ? 'Any' : v === '0' ? '0 bars' : v === '1' ? '1 bar' : '2+ bars'}
            </Chip>
          ))}
        </FilterGroup>
        <FilterGroup label="Assist">
          {(['all', 'no', 'yes'] as AssistFilter[]).map((v) => (
            <Chip key={v} active={assist === v} onClick={() => setAssist(v)}>
              {v === 'all' ? 'Any' : v === 'no' ? 'No assist' : 'With assist'}
            </Chip>
          ))}
        </FilterGroup>
        <FilterGroup label="Position">
          {(['all', 'anywhere', 'corner', 'midscreen'] as PositionFilter[]).map((v) => (
            <Chip key={v} active={position === v} onClick={() => setPosition(v)}>
              {v === 'all' ? 'Any' : v.charAt(0).toUpperCase() + v.slice(1)}
            </Chip>
          ))}
        </FilterGroup>
        <FilterGroup label="Difficulty">
          {(['all', 'beginner', 'intermediate', 'advanced'] as DifficultyFilter[]).map((v) => (
            <Chip key={v} active={difficulty === v} onClick={() => setDifficulty(v)}>
              {v === 'all' ? 'Any' : v === 'beginner' ? 'BEG' : v === 'intermediate' ? 'INT' : 'ADV'}
            </Chip>
          ))}
        </FilterGroup>
      </div>

      <p className="text-xs mb-4" style={{ color: '#8888aa' }}>
        {filtered.length} combo{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <p className="text-center py-16" style={{ color: '#8888aa' }}>No combos match these filters.</p>
      ) : (
        filtered.map((c) => <ComboCard key={c.id} combo={c} />)
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8888aa' }}>{label}</span>
      <div className="flex gap-1">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-1 rounded-full border font-medium transition-colors"
      style={{
        backgroundColor: active ? '#6c5ce7' : '#1a1a2e',
        borderColor: active ? '#6c5ce7' : '#333355',
        color: active ? '#fff' : '#8888aa',
      }}
    >
      {children}
    </button>
  );
}
