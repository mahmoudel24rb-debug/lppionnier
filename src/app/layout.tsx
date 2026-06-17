import type { Metadata } from 'next';
import React from 'react';

// Styles du template Framer (reset + styles globaux), puis correctifs, puis
// recolorisation Pionniers. L'ordre compte : framer.css en premier.
import '@/components/template/framer.css';
import '@/components/template/overrides.css';
import '@/components/template/pionniers.css';

import MobileNav from '@/components/template/MobileNav';
import PricingToggle from '@/components/template/PricingToggle';

export const metadata: Metadata = {
  title: 'Pionniers de Touraine — Football Américain & Flag | Nous rejoindre',
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
        {/* îlots client : menu burger mobile + bascule des onglets tarifs */}
        <MobileNav />
        <PricingToggle />
      </body>
    </html>
  );
}
