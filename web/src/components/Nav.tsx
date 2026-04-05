'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      className="sticky top-0 z-50 flex items-center justify-between px-6 h-14 glass"
      style={{
        borderBottom: '1px solid transparent',
        borderImage: 'linear-gradient(to right, #6c5ce7, transparent) 1',
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <Image src="/2xko-logo.svg" alt="2XKO" width={80} height={20} className="h-5 w-auto" />
        <span className="font-heading font-bold text-sm tracking-wide" style={{ color: '#6c5ce7' }}>HUB</span>
      </Link>
      <nav className="flex items-center gap-6">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-sm font-semibold transition-colors relative"
            style={{ color: isActive(href) ? '#6c5ce7' : '#7777aa' }}
          >
            {label}
            {isActive(href) && (
              <span
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: '#6c5ce7', boxShadow: '0 0 8px #6c5ce740' }}
              />
            )}
          </Link>
        ))}
      </nav>
    </header>
  );
}
