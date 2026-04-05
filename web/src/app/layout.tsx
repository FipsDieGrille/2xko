import type { Metadata } from 'next';
import { Exo_2, Inter } from 'next/font/google';
import './globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';

const exo2 = Exo_2({
  subsets: ['latin'],
  variable: '--font-exo2',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '2XKO Hub',
  description: 'Combos, matchups, frame data and more for 2XKO',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${exo2.variable} ${inter.variable}`}>
      <body className="min-h-full flex flex-col" style={{ backgroundColor: '#080810', color: '#eeeef4' }}>
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
