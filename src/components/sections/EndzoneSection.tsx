'use client';

import { ArrowRight } from 'lucide-react';
import YardLine from './YardLine';

/**
 * CTA final — l'en-but au bout de la descente de terrain.
 * Reprend le bouton exact du hero (.rf-cta) pour boucler la boucle.
 */
export default function EndzoneSection() {
  const openTunnel = () => window.dispatchEvent(new Event('open-tunnel'));
  return (
    <section className="sc-sec sc-endzone">
      <YardLine n="endzone" />
      <div className="sc-wrap" data-reveal>
        <p className="sc-eyebrow">Kickoff · Saison 2026/2027</p>
        <h2 className="sc-title">
          Prêt à entrer
          <br />
          sur le terrain ?
        </h2>
        <p className="sc-lead" style={{ maxWidth: 560 }}>
          Performer sur le terrain, t&apos;investir ou soutenir le projet :
          <br />
          réponds à quelques questions
          <br />
          et le staff des Pionniers te recontacte.
        </p>
        <button className="rf-cta" data-open-tunnel onClick={openTunnel}>
          Commencer le parcours
          <span className="rf-cta-arrow">
            <ArrowRight size={17} strokeWidth={2.6} />
          </span>
        </button>
        <p className="rf-note">2 minutes · sans engagements</p>
      </div>
    </section>
  );
}
