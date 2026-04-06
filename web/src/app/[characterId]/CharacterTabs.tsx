'use client';

import { useState } from 'react';
import { ComboEntry } from '../../../../src/combos/types';
import { FrameDataEntry } from '../../../../src/framedata/types';
import { ComboListClient } from './ComboListClient';
import { FrameDataTable } from '@/components/FrameDataTable';

type Tab = 'combos' | 'framedata';

export function CharacterTabs({
  combos,
  frameData,
}: {
  combos: ComboEntry[];
  frameData: FrameDataEntry[];
}) {
  const [tab, setTab] = useState<Tab>('combos');

  const tabStyle = (t: Tab) => ({
    padding: '8px 20px',
    borderRadius: '8px',
    fontWeight: 700,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    backgroundColor: tab === t ? '#6c5ce7' : 'transparent',
    color: tab === t ? '#fff' : '#7777aa',
    border: `1px solid ${tab === t ? '#6c5ce7' : '#222244'}`,
    boxShadow: tab === t ? '0 0 12px #6c5ce740' : 'none',
  });

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button style={tabStyle('combos')} onClick={() => setTab('combos')}>
          Combos <span style={{ opacity: 0.6, fontWeight: 400 }}>({combos.length})</span>
        </button>
        <button style={tabStyle('framedata')} onClick={() => setTab('framedata')}>
          Frame Data {frameData.length === 0 && <span style={{ opacity: 0.5, fontWeight: 400, fontSize: '11px' }}>soon</span>}
        </button>
      </div>

      {tab === 'combos' && <ComboListClient combos={combos} />}
      {tab === 'framedata' && <FrameDataTable frameData={frameData} />}
    </div>
  );
}
