import Link from 'next/link';
import Image from 'next/image';
import { characters } from '@/lib/characters';

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0f0f1a' }}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#e0e0f0' }}>2XKO Combos</h1>
        <p className="mb-10 text-sm" style={{ color: '#8888aa' }}>Select a character to view their combo list</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {characters.map((c) => (
            <Link
              key={c.id}
              href={`/${c.id}`}
              className="group relative rounded-xl overflow-hidden flex flex-col items-center transition-transform hover:scale-105"
              style={{ backgroundColor: '#1a1a2e', border: '1px solid #333355' }}
            >
              {c.imagePath ? (
                <Image
                  src={c.imagePath}
                  alt={c.name}
                  width={160}
                  height={160}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square" style={{ backgroundColor: '#252540' }} />
              )}
              <span className="py-2 text-sm font-bold text-center w-full px-1" style={{ color: '#e0e0f0' }}>
                {c.name}
              </span>
              {c.comingSoon && (
                <span
                  className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: '#6c5ce7', color: '#fff' }}
                >
                  Soon
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
