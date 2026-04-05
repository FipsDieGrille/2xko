import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { href: '/roster', label: 'Roster' },
  { href: '/match-prep', label: 'Match Prep' },
  { href: '/reference', label: 'Reference' },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t" style={{ borderColor: '#222244' }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-4">
          <Image src="/2xko-logo.svg" alt="2XKO" width={80} height={20} className="h-5 w-auto" />
          <span className="font-heading font-bold text-sm tracking-wide" style={{ color: '#6c5ce7' }}>HUB</span>
        </div>
        <p className="text-sm mb-6" style={{ color: '#7777aa' }}>
          A fan-made resource. Not affiliated with Riot Games.
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm mb-6" style={{ color: '#7777aa' }}>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-white transition-colors">
              {label}
            </Link>
          ))}
          <span style={{ color: '#222244' }}>|</span>
          <a
            href="https://github.com/FipsDieGrille/2xko"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>
        <p className="text-xs" style={{ color: '#444466' }}>&copy; 2026</p>
      </div>
    </footer>
  );
}
