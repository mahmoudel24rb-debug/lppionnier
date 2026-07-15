import { FaArrowRight } from 'react-icons/fa';
import YardLine from './YardLine';
import { asset } from '@/lib/asset';

const CARDS = [
  {
    badge: '/assets/refonte/badge-1-footus.svg',
    alt: 'Écusson Football US',
    title: 'Football américain',
    chips: ['Au contact', 'Compétition', 'Seniors & U18'],
    desc: "Un sport de contact intense où stratégie, engagement et esprit d'équipe ne font qu'un. Semaine découverte offerte pour essayer.",
  },
  {
    badge: '/assets/refonte/badge-2-olympique.svg',
    alt: 'Écusson Sport Olympique · JO de Los Angeles 2028',
    title: 'Flag football',
    chips: ['Sans contact', 'Mixte', 'Tous niveaux'],
    desc: 'Rapide, spectaculaire et accessible : le flag devient olympique aux JO de Los Angeles 2028. Dès le plus jeune âge avec l’école de flag.',
  },
  {
    badge: '/assets/refonte/logo-pionniers.svg',
    alt: 'Logo Pionniers de Touraine',
    title: 'Faire vivre le club',
    chips: ['Bénévolat', 'Encadrement', 'Compétences'],
    desc: 'Coaching, arbitrage, événements, communication, partenariats : le club avance grâce à celles et ceux qui s’investissent à ses côtés.',
  },
];

export default function DisciplinesSection() {
  return (
    <section className="sc-sec sc-disciplines" id="sections">
      <YardLine n="20" />
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
              <img className="sc-card-badge" src={asset(c.badge)} alt={c.alt} />
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
