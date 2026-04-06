'use client';

import { useState } from 'react';
import Image from 'next/image';
import { characters } from '@/lib/characters';
import { getFrameData } from '../../../../../src/framedata';
import { FrameDataTable } from '@/components/FrameDataTable';

export default function FrameDataPage() {
  const [selected, setSelected] = useState('ekko');
  const frameData = getFrameData(selected);

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-heading text-2xl font-bold mb-1" style={{ color: '#eeeef4' }}>Frame Data</h1>
        <p className="text-sm mb-8" style={{ color: '#7777aa' }}>Startup, active and recovery frames for every move</p>

        {/* Character selector */}
        <div className="flex flex-wrap gap-2 mb-8">
          {characters.map((c) => {
            const hasData = getFrameData(c.id).length > 0;
            const isActive = selected === c.id;
            return (
              <button
                key={c.id}
                onClick={() => hasData && setSelected(c.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: `1px solid ${isActive ? '#6c5ce7' : '#222244'}`,
                  backgroundColor: isActive ? '#6c5ce720' : 'transparent',
                  color: isActive ? '#eeeef4' : hasData ? '#aaaacc' : '#444466',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13px',
                  cursor: hasData ? 'pointer' : 'default',
                  opacity: hasData ? 1 : 0.4,
                  boxShadow: isActive ? '0 0 12px #6c5ce740' : 'none',
                }}
              >
                {c.imagePath && (
                  <Image
                    src={c.imagePath}
                    alt={c.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                    style={{ backgroundColor: '#6c5ce7' }}
                  />
                )}
                {c.name}
              </button>
            );
          })}
        </div>

        <FrameDataTable frameData={frameData} />
      </div>
    </main>
  );
}
