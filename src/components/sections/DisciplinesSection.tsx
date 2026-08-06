'use client';

import type { ReactNode } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import YardLine from './YardLine';
import { asset } from '@/lib/asset';
import { useLang, type Lang } from '@/lib/i18n';

type Badge = {
  src: string;
  alt: string;
  /** Logo très horizontal : hauteur réduite pour équilibrer la rangée. */
  wide?: boolean;
  /** Écusson U18 : artwork compact dans son cadre → hauteur augmentée. */
  u18?: boolean;
  /** Écusson PPP : artwork plein cadre → hauteur réduite. */
  ppp?: boolean;
};

type Card = {
  badges: Badge[];
  title: string;
  chips: string[];
  desc: ReactNode;
};

const CARDS: Record<Lang, Card[]> = {
  fr: [
    {
      badges: [
        { src: '/assets/refonte/badge-3-ppp.svg', alt: 'Écusson du Pionniers Programme Performance', ppp: true },
        { src: '/assets/refonte/badge-4-u18.svg', alt: 'Écusson de la catégorie U18', u18: true },
      ],
      title: 'Football américain',
      chips: ['Au contact', 'Compétition', 'Seniors & U18'],
      desc: (
        <>
          Un sport de contact intense où stratégie, engagement et esprit d&apos;équipe ne font
          qu&apos;un. <strong>Semaine découverte offerte</strong> pour essayer.
        </>
      ),
    },
    {
      badges: [
        { src: '/assets/refonte/badge-2-olympique.svg', alt: 'Écusson sport olympique · JO de Los Angeles 2028' },
        { src: '/assets/refonte/logo-nfl-flag.png', alt: 'Logo NFL FLAG', wide: true },
      ],
      title: 'Flag football',
      chips: ['Sans contact', 'Mixte', 'Tous niveaux'],
      desc: (
        <>
          Rapide, spectaculaire et accessible : le flag devient <strong>olympique</strong> aux JO de
          Los Angeles 2028. Dès le plus jeune âge avec l&apos;école de flag.
        </>
      ),
    },
    {
      badges: [{ src: '/assets/refonte/logo-pionniers.svg', alt: 'Logo des Pionniers de Touraine' }],
      title: 'Faire vivre le club',
      chips: ['Bénévolat', 'Encadrement', 'Compétences'],
      desc: (
        <>
          Coaching, arbitrage, événements, communication, partenariats : le club avance grâce à
          celles et ceux qui <strong>s&apos;investissent</strong> à ses côtés.
        </>
      ),
    },
  ],
  en: [
    {
      badges: [
        { src: '/assets/refonte/badge-3-ppp.svg', alt: 'Pionniers Programme Performance badge', ppp: true },
        { src: '/assets/refonte/badge-4-u18.svg', alt: 'U18 category badge', u18: true },
      ],
      title: 'American football',
      chips: ['Full contact', 'Competition', 'Seniors & U18'],
      desc: (
        <>
          An intense contact sport where strategy, commitment and team spirit become one.{' '}
          <strong>Free trial week</strong> to give it a go.
        </>
      ),
    },
    {
      badges: [
        { src: '/assets/refonte/badge-2-olympique.svg', alt: 'Olympic sport badge · 2028 Los Angeles Games' },
        { src: '/assets/refonte/logo-nfl-flag.png', alt: 'NFL FLAG logo', wide: true },
      ],
      title: 'Flag football',
      chips: ['No contact', 'Co-ed', 'All levels'],
      desc: (
        <>
          Fast, spectacular and open to all: flag becomes an <strong>Olympic</strong> sport at the
          2028 Los Angeles Games. From a young age with our flag academy.
        </>
      ),
    },
    {
      badges: [{ src: '/assets/refonte/logo-pionniers.svg', alt: 'Pionniers de Touraine logo' }],
      title: 'Keep the club going',
      chips: ['Volunteering', 'Coaching', 'Skills'],
      desc: (
        <>
          Coaching, officiating, events, communication, partnerships: the club moves forward thanks
          to those who <strong>get involved</strong> by its side.
        </>
      ),
    },
  ],
};

const T = {
  fr: {
    eyebrow: 'Nos sections',
    title: 'Choisis ton terrain.',
    lead: "Trois façons d'entrer dans l'aventure. Le parcours « Nous rejoindre » te guide vers la bonne en deux minutes.",
    cta: 'Trouver ma place',
  },
  en: {
    eyebrow: 'Our sections',
    title: 'Choose your field.',
    lead: 'Three ways into the adventure. The "Join us" journey guides you to the right one in two minutes.',
    cta: 'Find my place',
  },
};

export default function DisciplinesSection() {
  const { lang } = useLang();
  const t = T[lang];
  return (
    <section className="sc-sec sc-disciplines" id="sections">
      <YardLine n="40" />
      <div className="sc-wrap">
        <div data-reveal>
          <p className="sc-eyebrow">{t.eyebrow}</p>
          <h2 className="sc-title">{t.title}</h2>
          <p className="sc-lead">{t.lead}</p>
        </div>
        <div className="sc-cards" data-reveal>
          {CARDS[lang].map((c) => (
            <button key={c.title} type="button" className="sc-card" data-open-tunnel>
              <span className="sc-card-badges">
                {c.badges.map((b) => (
                  <img
                    key={b.src}
                    className={`sc-card-badge ${b.wide ? 'sc-card-badge--wide' : ''} ${b.u18 ? 'sc-card-badge--u18' : ''} ${b.ppp ? 'sc-card-badge--ppp' : ''}`}
                    src={asset(b.src)}
                    alt={b.alt}
                    loading="lazy"
                  />
                ))}
              </span>
              <h3 className="sc-card-title">{c.title}</h3>
              <div className="sc-chips">
                {c.chips.map((chip) => (
                  <span key={chip} className="sc-chip">
                    {chip}
                  </span>
                ))}
              </div>
              <p className="sc-card-desc">{c.desc}</p>
              <span className="sc-card-cta">
                {t.cta} <FaArrowRight size={12} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
