import Link from 'next/link';

const SECTIONS = [
  {
    href: '/roster',
    label: 'Roster',
    description: 'Browse every character and their combo lists. Filter by difficulty, meter, position and more.',
  },
  {
    href: '/match-prep',
    label: 'Match Prep',
    description: 'Matchup notes, team builder and okizeme setups to get you ready before you play.',
    soon: true,
  },
  {
    href: '/reference',
    label: 'Reference',
    description: 'Frame data and punish finder for every move in the game.',
    soon: true,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-3" style={{ color: '#e0e0f0' }}>2XKO Hub</h1>
        <p className="text-base mb-12" style={{ color: '#8888aa' }}>
          Community resource for combos, matchups and frame data.
        </p>
        <div className="flex flex-col gap-4">
          {SECTIONS.map(({ href, label, description, soon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-0 rounded-xl overflow-hidden transition-opacity hover:opacity-80"
              style={{
                backgroundColor: '#1a1a2e',
                border: '1px solid #333355',
                opacity: soon ? 0.5 : 1,
                pointerEvents: soon ? 'none' : 'auto',
              }}
            >
              <div className="w-1 self-stretch" style={{ backgroundColor: '#6c5ce7' }} />
              <div className="flex-1 px-6 py-5">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-lg" style={{ color: '#e0e0f0' }}>{label}</span>
                  {soon && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#6c5ce7', color: '#fff' }}>
                      Soon
                    </span>
                  )}
                </div>
                <p className="text-sm" style={{ color: '#8888aa' }}>{description}</p>
              </div>
              {!soon && <span className="text-xl pr-5" style={{ color: '#333355' }}>›</span>}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
