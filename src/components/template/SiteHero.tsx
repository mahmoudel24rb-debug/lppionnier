'use client';

import { FaArrowRight, FaChevronDown } from 'react-icons/fa';
import { asset } from '@/lib/asset';

const BADGES = [
  { src: '/assets/refonte/badge-1-footus.webp', alt: 'Foot US & Flag' },
  { src: '/assets/refonte/badge-2-olympique.webp', alt: 'Sport Olympique' },
  { src: '/assets/refonte/badge-3-ppp.webp', alt: 'Programme PPP' },
  { src: '/assets/refonte/badge-4-u18.webp', alt: 'U18' },
  { src: '/assets/refonte/badge-5-ecole.webp', alt: 'École de Flag' },
];

export default function SiteHero() {
  const openTunnel = () => window.dispatchEvent(new Event('open-tunnel'));
  return (
    <section className="rf-hero">
      <div className="rf-hero-inner">
        <p className="rf-season">SAISON 2026/2027</p>
        <h1 className="rf-title">Rejoins les Pionniers de Touraine</h1>
        <p className="rf-sub">
          Football Américain &amp; Flag Football à Tours depuis 1987.
          <br />
          Choisis ta voie en quelques clics, sur le terrain ou à nos côtés pour faire vivre le club.
        </p>
        <button className="rf-cta" data-open-tunnel onClick={openTunnel}>
          Commencer le parcours <FaArrowRight size={15} />
        </button>
        <p className="rf-note">2 minutes · sans engagements</p>

        <div className="rf-badges">
          {BADGES.map((b) => (
            <img key={b.alt} src={asset(b.src)} alt={b.alt} />
          ))}
        </div>
      </div>

      <a href="#club" className="rf-chevron" aria-label="Défiler">
        <FaChevronDown size={26} />
      </a>
    </section>
  );
}
