import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '2XKO Combos',
  description: 'Combo lists for every 2XKO character',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full" style={{ backgroundColor: '#0f0f1a', color: '#e0e0f0' }}>
        {children}
      </body>
    </html>
  );
}
