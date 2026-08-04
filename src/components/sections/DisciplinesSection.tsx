import type { ReactNode } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import YardLine from './YardLine';
import { asset } from '@/lib/asset';

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

const CARDS: Card[] = [
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
      {
        src: '/assets/refonte/badge-2-olympique.svg',
        alt: 'Écusson sport olympique · JO de Los Angeles 2028',
      },
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
    badges: [
      { src: '/assets/refonte/logo-pionniers.svg', alt: 'Logo des Pionniers de Touraine' },
    ],
    title: 'Faire vivre le club',
    chips: ['Bénévolat', 'Encadrement', 'Compétences'],
    desc: (
      <>
        Coaching, arbitrage, événements, communication, partenariats : le club avance grâce à
        celles et ceux qui <strong>s&apos;investissent</strong> à ses côtés.
      </>
    ),
  },
];

export default function DisciplinesSection() {
  return (
    <section className="sc-sec sc-disciplines" id="sections">
      <YardLine n="30" />
      <div className="sc-wrap">
        <div data-reveal>
          <p className="sc-eyebrow">Nos sections</p>
          <h2 className="sc-title">Choisis ton terrain.</h2>
          <p className="sc-lead">
            Trois façons d'entrer dans l'aventure. Le parcours « Nous rejoindre » te guide vers la
            bonne en deux minutes.
          </p>
        </div>
        <div className="sc-cards" data-reveal>
          {CARDS.map((c) => (
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
                Trouver ma place <FaArrowRight size={12} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
