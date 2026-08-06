'use client';

import { FaChevronDown } from 'react-icons/fa';
import { ArrowRight } from 'lucide-react';
import { asset } from '@/lib/asset';
import { useLang } from '@/lib/i18n';

const BADGES = [
  { src: '/assets/refonte/badge-1-footus.svg', alt: 'Foot US & Flag' },
  { src: '/assets/refonte/badge-2-olympique.svg', alt: 'Sport Olympique · JO de Los Angeles 2028' },
  { src: '/assets/refonte/badge-3-ppp.svg', alt: 'Programme PPP' },
  { src: '/assets/refonte/badge-4-u18.svg', alt: 'U18' },
  { src: '/assets/refonte/badge-5-ecole.svg', alt: 'École de Flag' },
];

const T = {
  fr: {
    season: 'SAISON 2026/2027',
    title: 'Rejoins les Pionniers de Touraine',
    sub1: 'Football Américain & Flag Football à Tours depuis 1987.',
    sub2: 'Choisis ta voie en quelques clics, sur le terrain ou à nos côtés pour faire vivre le club.',
    cta: 'Commencer le parcours',
    note: '2 minutes · sans engagements',
    scroll: 'Défiler',
  },
  en: {
    season: 'SEASON 2026/2027',
    title: 'Join the Pionniers de Touraine',
    sub1: 'American Football & Flag Football in Tours since 1987.',
    sub2: 'Pick your path in a few clicks, on the field or by our side to keep the club going.',
    cta: 'Start the journey',
    note: '2 minutes · no commitment',
    scroll: 'Scroll',
  },
};

export default function SiteHero() {
  const { lang } = useLang();
  const t = T[lang];
  const openTunnel = () => window.dispatchEvent(new Event('open-tunnel'));
  return (
    <section className="rf-hero">
      <div className="rf-hero-inner">
        <p className="rf-season">{t.season}</p>
        <h1 className="rf-title">{t.title}</h1>
        <p className="rf-sub">
          {t.sub1}
          <br />
          {t.sub2}
        </p>
        <button className="rf-cta" data-open-tunnel onClick={openTunnel}>
          {t.cta}
          <span className="rf-cta-arrow"><ArrowRight size={17} strokeWidth={2.6} /></span>
        </button>
        <p className="rf-note">{t.note}</p>

        <div className="rf-badges">
          {BADGES.map((b) => (
            <img key={b.alt} src={asset(b.src)} alt={b.alt} />
          ))}
        </div>
      </div>

      <a href="#club" className="rf-chevron" aria-label={t.scroll}>
        <FaChevronDown size={26} />
      </a>
    </section>
  );
}
