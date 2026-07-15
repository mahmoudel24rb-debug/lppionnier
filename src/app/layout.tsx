import type { Metadata } from 'next';
import React from 'react';

// Charte refonte (header + hero + tokens), puis styles des sections.
// L'ordre compte : refonte.css définit les variables utilisées par sections.css.
import '@/components/template/refonte.css';
import '@/components/sections/sections.css';

import TunnelLauncher from '@/components/template/TunnelLauncher';
import RevealObserver from '@/components/sections/RevealObserver';

export const metadata: Metadata = {
  title: 'Pionniers de Touraine · Football Américain & Flag | Nous rejoindre',
  description:
    "Rejoins les Pionniers de Touraine : football américain, flag football, coaching, arbitrage et plus. Trouve ta place et engage-toi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}
        {/* îlots client : tunnel immersif + apparitions au scroll */}
        <TunnelLauncher />
        <RevealObserver />
      </body>
    </html>
  );
}
