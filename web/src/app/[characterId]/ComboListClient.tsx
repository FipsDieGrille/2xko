'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { ComboEntry } from '../../../../src/combos/types';
import { getComboMeter } from '../../../../src/combos/utils';
import { ComboCard } from '@/components/ComboCard';
import { ComboNotation } from '@/components/ComboNotation';

type MeterFilter = 'all' | '0' | '1' | '2+';
type PositionFilter = 'all' | 'corner' | 'midscreen';
type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

function comboMatchesMeter(combo: ComboEntry, filter: MeterFilter): boolean {
  if (filter === 'all') return true;
  if (combo.variants && combo.variants.length > 0) {
    return combo.variants.some((v) => {
      if (filter === '0') return v.meter === 0;
      if (filter === '1') return v.meter === 1;
      if (filter === '2+') return v.meter >= 2;
      return true;
    });
  }
  const m = combo.meter ?? 0;
  if (filter === '0') return m === 0;
  if (filter === '1') return m === 1;
  if (filter === '2+') return m >= 2;
  return true;
}

function StarterDropdown({
  value,
  active,
  onChange,
  options,
}: {
  value: string;
  active: boolean;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="flex flex-col gap-1 relative" ref={ref}>
      <span
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: active ? '#6c5ce7' : '#7777aa' }}
      >
        Starter
      </span>
      <button
        onClick={() => setOpen(!open)}
        className="text-left"
        style={{
          backgroundColor: '#1a1a2e',
          border: `1px solid ${active ? '#6c5ce7' : '#222244'}`,
          borderRadius: '8px',
          color: '#e0e0f0',
          fontSize: '13px',
          fontWeight: 600,
          padding: '4px 10px',
          cursor: 'pointer',
          width: '100%',
          boxShadow: active ? '0 0 10px #6c5ce730' : 'none',
          height: '33px',
          overflow: 'hidden',
        }}
      >
        {value === 'all' ? (
          <span style={{ color: '#e0e0f0' }}>Any</span>
        ) : (
          <div style={{ overflow: 'hidden', height: '16px' }}>
            <ComboNotation notation={value} compact />
          </div>
        )}
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 z-50 rounded-lg py-1"
          style={{ backgroundColor: '#333346', border: '1px solid #444466', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
        >
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors"
            style={{ color: value === 'all' ? '#6c5ce7' : '#e0e0f0', fontWeight: value === 'all' ? 700 : 400 }}
            onClick={() => { onChange('all'); setOpen(false); }}
          >
            Any
          </button>
          {options.map((s) => (
            <button
              key={s}
              className="w-full text-left px-3 py-1 hover:bg-white/5 transition-colors"
              style={{ color: value === s ? '#6c5ce7' : '#e0e0f0' }}
              onClick={() => { onChange(s); setOpen(false); }}
            >
              <ComboNotation notation={s} compact />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Dropdown({
  label,
  value,
  active,
  onChange,
  options,
}: {
  label: string;
  value: string;
  active: boolean;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: active ? '#6c5ce7' : '#7777aa' }}
      >
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          backgroundColor: '#1a1a2e',
          border: `1px solid ${active ? '#6c5ce7' : '#222244'}`,
          borderRadius: '8px',
          color: '#e0e0f0',
          fontSize: '13px',
          fontWeight: 600,
          padding: '6px 10px',
          outline: 'none',
          cursor: 'pointer',
          width: '100%',
          boxShadow: active ? '0 0 10px #6c5ce730' : 'none',
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

export function ComboListClient({ combos }: { combos: ComboEntry[] }) {
  const [meter, setMeter] = useState<MeterFilter>('all');
  const [assist, setAssist] = useState<string>('all');
  const [position, setPosition] = useState<PositionFilter>('all');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [fuse, setFuse] = useState<string>('all');
  const [starter, setStarter] = useState<string>('all');

  const partnerOptions = useMemo(() => {
    const partners = Array.from(new Set(combos.map(c => c.partner).filter(Boolean))) as string[];
    return partners.sort();
  }, [combos]);

  const fuseOptions = useMemo(() => {
    const fuses = Array.from(new Set(combos.map(c => c.fuse).filter(Boolean))) as string[];
    return fuses.sort();
  }, [combos]);

  const starterOptions = useMemo(() => {
    return Array.from(new Set(combos.map(c => c.starter))).sort();
  }, [combos]);

  const filtered = useMemo(() => combos.filter((c) => {
    if (!comboMatchesMeter(c, meter)) return false;
    if (assist === 'solo' && c.hasAssist) return false;
    if (assist !== 'all' && assist !== 'solo' && c.partner !== assist) return false;
    if (position !== 'all' && c.position !== position && c.position !== 'anywhere') return false;
    if (difficulty !== 'all' && c.difficulty !== difficulty) return false;
    if (fuse !== 'all' && c.fuse !== fuse) return false;
    if (starter !== 'all' && c.starter !== starter) return false;
    return true;
  }), [combos, meter, assist, position, difficulty, fuse, starter]);

  return (
    <div>
      {/* Filter bar */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6 p-4 rounded-xl" style={{ backgroundColor: '#12121e', border: '1px solid #222244' }}>
        <StarterDropdown
          value={starter}
          active={starter !== 'all'}
          onChange={setStarter}
          options={starterOptions}
        />
        <Dropdown
          label="Difficulty"
          value={difficulty}
          active={difficulty !== 'all'}
          onChange={(v) => setDifficulty(v as DifficultyFilter)}
          options={[
            { value: 'all', label: 'Any' },
            { value: 'beginner', label: 'BEG' },
            { value: 'intermediate', label: 'INT' },
            { value: 'advanced', label: 'ADV' },
          ]}
        />
        <Dropdown
          label="Position"
          value={position}
          active={position !== 'all'}
          onChange={(v) => setPosition(v as PositionFilter)}
          options={[
            { value: 'all', label: 'Any' },
            { value: 'corner', label: 'Corner' },
            { value: 'midscreen', label: 'Midscreen' },
          ]}
        />
        <Dropdown
          label="Meter"
          value={meter}
          active={meter !== 'all'}
          onChange={(v) => setMeter(v as MeterFilter)}
          options={[
            { value: 'all', label: 'Any' },
            { value: '0', label: '0 bars' },
            { value: '1', label: '1 bar' },
            { value: '2+', label: '2+ bars' },
          ]}
        />
        <Dropdown
          label="Assist"
          value={assist}
          active={assist !== 'all'}
          onChange={setAssist}
          options={[
            { value: 'all', label: 'Any' },
            { value: 'solo', label: 'Solo' },
            ...partnerOptions.map(p => ({ value: p, label: p })),
          ]}
        />
        <Dropdown
          label="Fuse"
          value={fuse}
          active={fuse !== 'all'}
          onChange={setFuse}
          options={[
            { value: 'all', label: 'Any' },
            ...fuseOptions.map(f => ({ value: f, label: f })),
          ]}
        />
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
