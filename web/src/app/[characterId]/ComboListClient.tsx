'use client';

import { useState, useMemo } from 'react';
import { ComboEntry } from '../../../../src/combos/types';
import { ComboCard } from '@/components/ComboCard';

type MeterFilter = 'all' | '0' | '1' | '2+';
type PositionFilter = 'all' | 'corner' | 'midscreen';
type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

export function ComboListClient({ combos }: { combos: ComboEntry[] }) {
  const [meter, setMeter] = useState<MeterFilter>('all');
  const [assist, setAssist] = useState<string>('all');
  const [position, setPosition] = useState<PositionFilter>('all');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [fuse, setFuse] = useState<string>('all');

  const partnerOptions = useMemo(() => {
    const partners = Array.from(new Set(combos.map(c => c.partner).filter(Boolean))) as string[];
    return partners.sort();
  }, [combos]);

  const fuseOptions = useMemo(() => {
    const fuses = Array.from(new Set(combos.map(c => c.fuse).filter(Boolean))) as string[];
    return fuses.sort();
  }, [combos]);

  const filtered = useMemo(() => combos.filter((c) => {
    if (meter === '0' && c.meter !== 0) return false;
    if (meter === '1' && c.meter !== 1) return false;
    if (meter === '2+' && c.meter < 2) return false;
    if (assist === 'solo' && c.hasAssist) return false;
    if (assist !== 'all' && assist !== 'solo' && c.partner !== assist) return false;
    if (position !== 'all' && c.position !== position && c.position !== 'anywhere') return false;
    if (difficulty !== 'all' && c.difficulty !== difficulty) return false;
    if (fuse !== 'all' && c.fuse !== fuse) return false;
    return true;
  }), [combos, meter, assist, position, difficulty, fuse]);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 rounded-xl" style={{ backgroundColor: '#12121e', border: '1px solid #222244' }}>
        <FilterGroup label="Meter">
          {(['all', '0', '1', '2+'] as MeterFilter[]).map((v) => (
            <Chip key={v} active={meter === v} onClick={() => setMeter(v)}>
              {v === 'all' ? 'Any' : v === '0' ? '0 bars' : v === '1' ? '1 bar' : '2+ bars'}
            </Chip>
          ))}
        </FilterGroup>
        <FilterGroup label="Assist">
          <Chip active={assist === 'all'} onClick={() => setAssist('all')}>Any</Chip>
          <Chip active={assist === 'solo'} onClick={() => setAssist('solo')}>Solo</Chip>
          {partnerOptions.map(p => (
            <Chip key={p} active={assist === p} onClick={() => setAssist(p)}>{p}</Chip>
          ))}
        </FilterGroup>
        <FilterGroup label="Position">
          {(['all', 'corner', 'midscreen'] as PositionFilter[]).map((v) => (
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
        {fuseOptions.length > 0 && (
          <FilterGroup label="Fuse">
            <Chip active={fuse === 'all'} onClick={() => setFuse('all')}>Any</Chip>
            {fuseOptions.map(f => (
              <Chip key={f} active={fuse === f} onClick={() => setFuse(f)}>{f}</Chip>
            ))}
          </FilterGroup>
        )}
      </div>

      <p className="text-xs mb-4" style={{ color: '#7777aa' }}>
        {filtered.length} combo{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <p className="text-center py-16" style={{ color: '#7777aa' }}>No combos match these filters.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((c) => <ComboCard key={c.id} combo={c} />)}
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#7777aa' }}>{label}</span>
      <div className="flex gap-1">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-1 rounded-full font-medium transition-all"
      style={{
        backgroundColor: active ? '#6c5ce7' : 'transparent',
        border: `1px solid ${active ? '#6c5ce7' : '#222244'}`,
        color: active ? '#fff' : '#7777aa',
        boxShadow: active ? '0 0 12px #6c5ce730' : 'none',
      }}
    >
      {children}
    </button>
  );
}
