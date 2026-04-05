'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/roster', label: 'Roster' },
  { href: '/match-prep', label: 'Match Prep' },
  { href: '/reference', label: 'Reference' },
];

export function Nav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 h-14"
      style={{ backgroundColor: '#0f0f1a', borderBottom: '1px solid #333355' }}
    >
      <Link
        href="/"
        className="font-bold text-lg tracking-tight"
        style={{ color: '#e0e0f0' }}
      >
        2XKO
      </Link>
      <nav className="flex items-center gap-6">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-sm font-semibold transition-colors"
            style={{ color: isActive(href) ? '#6c5ce7' : '#8888aa' }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
