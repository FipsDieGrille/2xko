import Link from 'next/link';
import Image from 'next/image';
import { characters } from '@/lib/characters';
import { getCombos } from '../../../../src/combos';

export default function RosterPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-heading text-2xl font-bold mb-1" style={{ color: '#eeeef4' }}>Roster</h1>
        <p className="text-sm mb-8" style={{ color: '#7777aa' }}>
          {characters.length} playable characters
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {characters.map((c) => {
            const comboCount = getCombos(c.id).length;
            return (
              <Link
                key={c.id}
                href={`/${c.id}`}
                className={`group relative rounded-xl overflow-hidden flex flex-col card-hover ${c.comingSoon ? 'opacity-50 pointer-events-none' : ''}`}
                style={{ backgroundColor: '#12121e', border: '1px solid #222244' }}
              >
                {c.imagePath ? (
                  <div className="relative w-full aspect-square overflow-hidden pt-2">
                    <Image
                      src={c.imagePath}
                      alt={c.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover object-top transition-transform duration-200 group-hover:scale-105"
                    />
                    {/* Gradient fade at bottom */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-12"
                      style={{ background: 'linear-gradient(transparent, #12121e)' }}
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square" style={{ backgroundColor: '#1a1a2e' }} />
                )}
                <div className="px-2 py-2 text-center">
                  <span className="font-heading text-sm font-bold block" style={{ color: '#eeeef4' }}>
                    {c.name}
                  </span>
                  <span className="text-[10px]" style={{ color: '#7777aa' }}>
                    {comboCount > 0 ? `${comboCount} combo${comboCount !== 1 ? 's' : ''}` : 'No combos yet'}
                  </span>
                </div>
                {c.comingSoon && (
                  <span
                    className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#6c5ce720', color: '#6c5ce7', border: '1px solid #6c5ce740' }}
                  >
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
