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

const SITE = 'https://recrutement.pionniersdetouraine.fr';
const TITRE = 'Rejoins les Pionniers de Touraine à Tours · Foot US et flag';
const DESCRIPTION =
  "Rejoins les Pionniers de Touraine : football américain, flag football, coaching, arbitrage et plus. Trouve ta place et engage-toi.";

export const metadata: Metadata = {
  title: TITRE,
  description: DESCRIPTION,
  ...(IS_DEMO
    ? { robots: { index: false, follow: false } }
    : {
        metadataBase: new URL(SITE),
        alternates: { canonical: '/' },
        openGraph: {
          type: 'website',
          locale: 'fr_FR',
          siteName: 'Pionniers de Touraine',
          title: TITRE,
          description: DESCRIPTION,
          url: '/',
          images: [{ url: `${SITE}/assets/refonte/fond-hero.webp` }],
        },
      }),
};

// Le sous-domaine décrit la MÊME entité que le site principal : on réutilise
// son `@id` d'organisation pour que Google ne voie qu'un seul club.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SportsClub',
      '@id': 'https://pionniersdetouraine.fr/#organization',
      name: 'Pionniers de Touraine',
      url: 'https://pionniersdetouraine.fr',
      foundingDate: '1987',
      sport: ['American Football', 'Flag Football'],
      telephone: '+33787018026',
      email: 'recrutement@pionniersdetouraine.fr',
      logo: 'https://pionniersdetouraine.fr/assets/refonte/logo-pionniers.svg',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Stade de la Chambrerie, Rue Tartifume',
        postalCode: '37100',
        addressLocality: 'Tours',
        addressRegion: 'Centre-Val de Loire',
        addressCountry: 'FR',
      },
      hasMap: 'https://maps.app.goo.gl/cnVghabaHrhx9qaQA',
      // Coordonnees relevees sur la fiche Google Business du club (10/09/2026).
      geo: { '@type': 'GeoCoordinates', latitude: 47.4167151, longitude: 0.7102265 },
      sameAs: [
        'https://www.facebook.com/p/Pionniers-de-Touraine-61578271450029/',
        'https://www.instagram.com/pionniersdetouraine/',
        'https://www.tiktok.com/@pionniersdetouraine',
        'https://maps.app.goo.gl/cnVghabaHrhx9qaQA',
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {/* Données structurées : le club, même @id que le site principal (prod uniquement). */}
        {IS_DEMO ? null : (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
          />
        )}
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
