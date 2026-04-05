const ITEMS = [
  { label: 'Matchups', description: 'Notes and tips for every character matchup' },
  { label: 'Team Builder', description: 'Find the best duo for your playstyle' },
  { label: 'Okizeme', description: 'Post-knockdown setups by character and position' },
];

export default function MatchPrepPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#e0e0f0' }}>Match Prep</h1>
        <p className="text-sm mb-8" style={{ color: '#8888aa' }}>Everything you need before you play</p>
        <div className="flex flex-col gap-3">
          {ITEMS.map(({ label, description }) => (
            <div
              key={label}
              className="flex items-center gap-0 rounded-xl overflow-hidden opacity-45"
              style={{ backgroundColor: '#1a1a2e', border: '1px solid #333355' }}
            >
              <div className="w-1 self-stretch" style={{ backgroundColor: '#6c5ce7' }} />
              <div className="flex-1 px-5 py-4">
                <div className="flex items-center gap-3 mb-0.5">
                  <span className="font-bold" style={{ color: '#e0e0f0' }}>{label}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#6c5ce7', color: '#fff' }}>Soon</span>
                </div>
                <p className="text-sm" style={{ color: '#8888aa' }}>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
