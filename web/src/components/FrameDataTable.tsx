'use client';

import { useState } from 'react';
import { FrameDataEntry } from '../../../../src/framedata/types';
import { ComboNotation } from './ComboNotation';

type SortKey = 'move' | 'attackLevel' | 'damage' | 'startup' | 'onHitMin' | 'onBlockMin' | 'meterGain';
type SortDir = 'asc' | 'desc';

function fmt(min: number | null, max: number | null): { text: string; color: string } {
  if (min === null) return { text: '—', color: '#555577' };
  const fmtNum = (n: number) => (n > 0 ? `+${n}` : `${n}`);
  const text = min === max ? fmtNum(min) : `${fmtNum(min)} ~ ${fmtNum(max!)}`;
  const color = min >= 0 ? '#22c55e' : '#ef4444';
  return { text, color };
}

function cell(v: number | string | null): string {
  if (v === null || v === '') return '—';
  return String(v);
}

function levelColor(lvl: string | null): string {
  if (!lvl) return '#555577';
  if (lvl === 'LOW') return '#f59e0b';
  if (lvl === 'HIGH') return '#60a5fa';
  return '#a78bfa';
}

function sortRows(rows: FrameDataEntry[], key: SortKey, dir: SortDir): FrameDataEntry[] {
  return [...rows].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
    return dir === 'asc' ? cmp : -cmp;
  });
}

export function FrameDataTable({ frameData }: { frameData: FrameDataEntry[] }) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  if (frameData.length === 0) {
    return (
      <p className="text-center py-16" style={{ color: '#7777aa' }}>
        No frame data available yet.
      </p>
    );
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const rows = sortKey ? sortRows(frameData, sortKey, sortDir) : frameData;

  const indicator = (key: SortKey) => {
    if (sortKey !== key) return <span style={{ opacity: 0.25 }}> ↕</span>;
    return <span style={{ color: '#6c5ce7' }}>{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>;
  };

  const th = (key: SortKey, label: string, right = false) => (
    <th
      className={`${right ? 'text-right' : 'text-left'} text-[11px] font-bold uppercase tracking-wider py-2 px-3 whitespace-nowrap select-none`}
      style={{ color: sortKey === key ? '#a78bfa' : '#7777aa', cursor: 'pointer' }}
      onClick={() => handleSort(key)}
    >
      {label}{indicator(key)}
    </th>
  );

  const tdLeft = 'py-1 px-3 text-sm whitespace-nowrap align-middle text-left';
  const tdRight = 'py-1 px-3 text-sm whitespace-nowrap align-middle text-right';

  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid #222244' }}>
      <table className="w-full border-collapse">
        <thead>
          <tr style={{ backgroundColor: '#12121e', borderBottom: '1px solid #222244' }}>
            {th('move', 'Move')}
            {th('attackLevel', 'Atk Lvl', true)}
            {th('damage', 'Dmg', true)}
            {th('startup', 'Startup', true)}
            {th('onHitMin', 'On Hit', true)}
            {th('onBlockMin', 'On Block', true)}
            {th('meterGain', 'Meter Gain', true)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const hit = fmt(row.onHitMin, row.onHitMax);
            const block = fmt(row.onBlockMin, row.onBlockMax);
            const rowBg = i % 2 === 0 ? '#0d0d1a' : '#111122';
            return (
              <tr key={row.move} style={{ backgroundColor: rowBg, borderBottom: '1px solid #1a1a33' }}>
                <td className={tdLeft}>
                  <ComboNotation notation={row.move} />
                </td>
                <td className={tdRight} style={{ color: levelColor(row.attackLevel), fontWeight: 600 }}>
                  {row.attackLevel ?? '—'}
                </td>
                <td className={tdRight} style={{ color: '#eeeef4' }}>{cell(row.damage)}</td>
                <td className={tdRight} style={{ color: '#eeeef4' }}>{cell(row.startup)}</td>
                <td className={tdRight} style={{ color: hit.color, fontWeight: 600 }}>{hit.text}</td>
                <td className={tdRight} style={{ color: block.color, fontWeight: 600 }}>{block.text}</td>
                <td className={tdRight} style={{ color: '#a78bfa' }}>{cell(row.meterGain)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
