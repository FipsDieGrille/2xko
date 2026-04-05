const ITEMS = [
  { label: 'Frame Data', description: 'Startup, active and recovery frames for every move', icon: '◈' },
  { label: 'Punish Finder', description: 'Find the optimal punish for any situation', icon: '🎯' },
];

export default function ReferencePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="font-heading text-2xl font-bold mb-1" style={{ color: '#eeeef4' }}>Reference</h1>
        <p className="text-sm mb-8" style={{ color: '#7777aa' }}>Raw data and lookup tools</p>
        <div className="flex flex-col gap-3">
          {ITEMS.map(({ label, description, icon }) => (
            <div
              key={label}
              className="flex items-center gap-0 rounded-xl overflow-hidden opacity-50"
              style={{ backgroundColor: '#12121e', border: '1px solid #222244' }}
            >
              <div className="w-1 self-stretch" style={{ backgroundColor: '#6c5ce7' }} />
              <div className="flex-1 px-5 py-4">
                <div className="flex items-center gap-3 mb-0.5">
                  <span style={{ color: '#6c5ce7' }}>{icon}</span>
                  <span className="font-heading font-bold" style={{ color: '#eeeef4' }}>{label}</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#6c5ce720', color: '#6c5ce7', border: '1px solid #6c5ce740' }}
                  >
                    Soon
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#7777aa' }}>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
