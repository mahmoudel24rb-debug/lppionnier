import type { Metadata } from 'next';
import React from 'react';
import Script from 'next/script';

// Charte refonte (header + hero + tokens), puis styles des sections.
// L'ordre compte : refonte.css définit les variables utilisées par sections.css.
import '@/components/template/refonte.css';
import '@/components/sections/sections.css';

import TunnelLauncher from '@/components/template/TunnelLauncher';
import { LangProvider } from '@/lib/i18n';
import RevealObserver from '@/components/sections/RevealObserver';
import { GC_SITE } from '@/lib/track';
import { asset } from '@/lib/asset';

// Démo GitHub Pages (basePath non vide) : noindex pour ne pas concurrencer la
// prod. Prod o2switch : indexable, avec canonical sur le sous-domaine officiel.
const IS_DEMO = (process.env.NEXT_PUBLIC_BASE_PATH ?? '/lppionnier') !== '/';

export const metadata: Metadata = {
  title: 'Pionniers de Touraine · Football Américain & Flag | Nous rejoindre',
  description:
    "Rejoins les Pionniers de Touraine : football américain, flag football, coaching, arbitrage et plus. Trouve ta place et engage-toi.",
  ...(IS_DEMO
    ? { robots: { index: false, follow: false } }
    : {
        metadataBase: new URL('https://recrutement.pionniersdetouraine.fr'),
        alternates: { canonical: '/' },
      }),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {/* Préchargements LCP : fond du hero + polices (les <link> preload sont
            valides dans <body> et traités immédiatement par le navigateur). */}
        <link rel="preload" as="image" href={asset('/assets/refonte/fond-hero.webp')} />
        <link rel="preload" as="font" type="font/otf" href={asset('/assets/fonts/FuturaStdCondensedExtraBd.otf')} crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/ttf" href={asset('/assets/fonts/NeuethingSans-RegularSemiExpanded.ttf')} crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/ttf" href={asset('/assets/fonts/NeuethingSans-BoldSemiExpanded.ttf')} crossOrigin="anonymous" />
        {/* Ancre réelle en haut du flux : le header est fixed (hors flux), un
            #top pointant sur lui ne déclenche aucun défilement. */}
        <div id="top" />
        <LangProvider>
          {children}
          {/* îlots client : tunnel immersif + apparitions au scroll */}
          <TunnelLauncher />
        </LangProvider>
        <RevealObserver />
        {/* mesure d'audience : activée seulement si un code site GoatCounter est renseigné (src/lib/track.ts) */}
        {GC_SITE ? (
          <Script
            data-goatcounter={`https://${GC_SITE}.goatcounter.com/count`}
            src="https://gc.zgo.at/count.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
