import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/Nav';

export const metadata: Metadata = {
  title: '2XKO Hub',
  description: 'Combos, matchups, frame data and more for 2XKO',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full" style={{ backgroundColor: '#0f0f1a', color: '#e0e0f0' }}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
