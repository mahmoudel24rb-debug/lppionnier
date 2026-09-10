'use client';

import Link from 'next/link';
import { asset } from '@/lib/asset';
import { useLang } from '@/lib/i18n';

// `external: true` = URL absolue (passerelle vers le site racine), les autres
// entrées sont relatives et préfixées par la home.
const NAV: { href: string; fr: string; en: string; external?: boolean }[] = [
  { href: '#top', fr: 'Accueil', en: 'Home' },
  { href: '#club', fr: 'Le club', en: 'The club' },
  { href: '#sections', fr: 'Nos sections', en: 'Our sections' },
  { href: '#adhesions', fr: 'Adhésions', en: 'Memberships' },
  { href: '#infos', fr: 'Infos pratiques', en: 'Practical info' },
  { href: 'https://pionniersdetouraine.fr/blog/', fr: 'Blog', en: 'Blog', external: true },
  { href: 'quel-poste-football-americain/', fr: 'Quel poste jouer ?', en: 'Which position?' },
];

// Liens rendus vers le site principal : le sous-domaine reçoit ses liens, il
// doit aussi en renvoyer (une seule entité, deux domaines).
const SITE_PRINCIPAL: { href: string; fr: string; en: string }[] = [
  {
    href: 'https://pionniersdetouraine.fr/football-americain/',
    fr: 'Football américain à Tours',
    en: 'American football in Tours',
  },
  {
    href: 'https://pionniersdetouraine.fr/flag-football/',
    fr: 'Flag football à Tours',
    en: 'Flag football in Tours',
  },
  {
    href: 'https://pionniersdetouraine.fr/ecole-de-flag/',
    fr: 'École de flag',
    en: 'Youth flag school',
  },
  {
    href: 'https://pionniersdetouraine.fr/blog/postes-football-americain/',
    fr: 'Les postes expliqués',
    en: 'Positions explained',
  },
  { href: 'https://pionniersdetouraine.fr/le-club/', fr: 'Le club', en: 'The club' },
];

const BADGES = [
  { src: '/assets/refonte/badge-1-footus.webp', alt: 'Foot US & Flag' },
  { src: '/assets/refonte/badge-2-olympique.webp', alt: 'Sport Olympique · JO de Los Angeles 2028' },
  { src: '/assets/refonte/badge-3-ppp.svg', alt: 'Programme PPP' },
  { src: '/assets/refonte/badge-4-u18.webp', alt: 'U18' },
  { src: '/assets/refonte/badge-5-ecole.webp', alt: 'École de Flag' },
];

const T = {
  fr: {
    tagline: 'Football américain & flag football à Tours depuis 1987. Sur le terrain ou à nos côtés, trouve ta place chez les Pionniers.',
    explorer: 'Explorer',
    contact: 'Contact',
    ecrire: 'Nous écrire',
    lieu: 'Tours, Touraine (37)',
    droits: 'Tous droits réservés.',
    mentions: 'Mentions légales',
    siteClub: 'Le site du club',
  },
  en: {
    tagline: 'American football & flag football in Tours since 1987. On the field or by our side, find your place with the Pionniers.',
    explorer: 'Explore',
    contact: 'Contact',
    ecrire: 'Write to us',
    lieu: 'Tours, Touraine, France',
    droits: 'All rights reserved.',
    mentions: 'Legal notice',
    siteClub: 'The club website',
  },
};

export default function SiteFooter() {
  const { lang } = useLang();
  const t = T[lang];
  return (
    <footer className="sc-footer">
      <div className="sc-wrap sc-footer-grid">
        <div>
          <img
            className="sc-footer-logo"
            src={asset('/assets/refonte/logo-pionniers.svg')}
            alt="Pionniers de Touraine"
            loading="lazy"
          />
          <p className="sc-footer-tagline">{t.tagline}</p>
          <div className="sc-footer-badges">
            {BADGES.map((b) => (
              <img key={b.alt} src={asset(b.src)} alt={b.alt} loading="lazy" />
            ))}
          </div>
        </div>
        <div>
          <h3 className="sc-footer-h">{t.explorer}</h3>
          <nav className="sc-footer-links">
            {NAV.map((l) => (
              // Ancres préfixées par la home : fonctionnent aussi depuis /mentions-legales.
              <a key={l.href} href={l.external ? l.href : `${asset('/')}${l.href}`}>
                {lang === 'en' ? l.en : l.fr}
              </a>
            ))}
          </nav>
          <h3 className="sc-footer-h" style={{ marginTop: 26 }}>
            {t.siteClub}
          </h3>
          <nav className="sc-footer-links">
            {SITE_PRINCIPAL.map((l) => (
              <a key={l.href} href={l.href}>
                {lang === 'en' ? l.en : l.fr}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <h3 className="sc-footer-h">{t.contact}</h3>
          <div className="sc-footer-links">
            <a href="tel:+33787018026">07 87 01 80 26</a>
            <a href="mailto:recrutement@pionniersdetouraine.fr">recrutement@pionniersdetouraine.fr</a>
            <a href={`${asset('/')}#contact`}>{t.ecrire}</a>
            <span style={{ fontSize: 14, letterSpacing: '-0.02em', color: 'var(--sc-cream-55)' }}>
              {t.lieu}
            </span>
          </div>
        </div>
      </div>
      <div className="sc-footer-bottom">
        <span>© {new Date().getFullYear()} Pionniers de Touraine · {t.droits}</span>
        <Link href="/mentions-legales/">{t.mentions}</Link>
      </div>
    </footer>
  );
}
