import type { Metadata } from 'next';
import { Inter, Oswald } from 'next/font/google';
import './globals.css';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Oswald : condensé, athlétique — parfait pour les gros titres sport.
const display = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pionniers de Touraine — Football Américain & Flag | Nous rejoindre',
  description:
    "Rejoins les Pionniers de Touraine : football américain, flag football, coaching, arbitrage et bien plus. Trouve ta place et engage-toi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
