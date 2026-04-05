import Link from 'next/link';
import Image from 'next/image';
import { characters } from '@/lib/characters';
import { getCombos } from '../../../src/combos';

const SECTIONS = [
  {
    href: '/roster',
    label: 'Roster',
    description: 'Browse every character and their combo lists. Filter by difficulty, meter, position and more.',
    icon: '✦',
  },
  {
    href: '/match-prep',
    label: 'Match Prep',
    description: 'Matchup notes, team builder and okizeme setups to get you ready before you play.',
    icon: '⚔',
    soon: true,
  },
  {
    href: '/reference',
    label: 'Reference',
    description: 'Frame data and punish finder for every move in the game.',
    icon: '◈',
    soon: true,
  },
];

export default function HomePage() {
  const featured = characters.find((c) => c.id === 'caitlyn');
  const featuredCombos = featured ? getCombos(featured.id) : [];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 flex items-center gap-3 mb-4">
          <Image src="/2xko-logo.svg" alt="2XKO" width={240} height={60} className="h-14 sm:h-16 w-auto" />
          <span className="font-heading text-3xl sm:text-4xl font-bold gradient-text">HUB</span>
        </div>
        <p className="relative z-10 text-lg max-w-md mb-8" style={{ color: '#7777aa' }}>
          Your community resource for combos, matchups, and frame data.
        </p>
        <Link href="/roster" className="relative z-10 btn-primary text-sm tracking-wide">
          Browse Roster →
        </Link>
      </section>

      {/* Section Cards */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SECTIONS.map(({ href, label, description, icon, soon }) => (
            <Link
              key={href}
              href={href}
              className={`group relative rounded-xl overflow-hidden card-hover ${soon ? 'pointer-events-none opacity-50' : ''}`}
              style={{ backgroundColor: '#12121e', border: '1px solid #222244' }}
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg" style={{ color: '#6c5ce7' }}>{icon}</span>
                  <span className="font-heading font-bold" style={{ color: '#eeeef4' }}>{label}</span>
                  {soon && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#6c5ce720', color: '#6c5ce7', border: '1px solid #6c5ce740' }}
                    >
                      Soon
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#7777aa' }}>{description}</p>
                {!soon && (
                  <span className="inline-block mt-3 text-xs font-semibold" style={{ color: '#6c5ce7' }}>
                    Browse →
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Character */}
      {featured && (
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <h2 className="font-heading text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#7777aa' }}>
            Featured
          </h2>
          <Link
            href={`/${featured.id}`}
            className="flex items-center gap-5 rounded-xl p-5 card-hover"
            style={{ backgroundColor: '#12121e', border: '1px solid #222244' }}
          >
            {featured.imagePath && (
              <Image
                src={featured.imagePath}
                alt={featured.name}
                width={80}
                height={80}
                className="rounded-lg object-cover"
              />
            )}
            <div>
              <span className="font-heading font-bold text-lg" style={{ color: '#eeeef4' }}>
                {featured.name}
              </span>
              <p className="text-sm mt-0.5" style={{ color: '#7777aa' }}>
                {featuredCombos.length} combo{featuredCombos.length !== 1 ? 's' : ''} available — check them out
              </p>
            </div>
            <span className="ml-auto text-xl" style={{ color: '#6c5ce7' }}>›</span>
          </Link>
        </section>
      )}
    </main>
  );
}
