'use client';

import { ArrowRight } from 'lucide-react';
import YardLine from './YardLine';
import { useLang } from '@/lib/i18n';

/**
 * CTA final — l'en-but au bout de la descente de terrain.
 * Reprend le bouton exact du hero (.rf-cta) pour boucler la boucle.
 */
const T = {
  fr: {
    eyebrow: 'Kickoff · Saison 2026/2027',
    title1: 'Prêt à entrer',
    title2: 'sur le terrain ?',
    lead: ['Performer sur le terrain, t’investir', 'ou soutenir le projet :', 'réponds à quelques questions', 'et le staff des Pionniers te recontacte.'],
    cta: 'Commencer le parcours',
    note: '2 minutes · sans engagements',
  },
  en: {
    eyebrow: 'Kickoff · 2026/2027 season',
    title1: 'Ready to step',
    title2: 'onto the field?',
    lead: ['Compete on the field, get involved', 'or support the project:', 'answer a few questions', 'and the Pionniers staff will get back to you.'],
    cta: 'Start the journey',
    note: '2 minutes · no commitment',
  },
};

export default function EndzoneSection() {
  const { lang } = useLang();
  const t = T[lang];
  const openTunnel = () => window.dispatchEvent(new Event('open-tunnel'));
  return (
    <section className="sc-sec sc-endzone">
      <YardLine n="endzone" />
      <div className="sc-wrap" data-reveal>
        <p className="sc-eyebrow">{t.eyebrow}</p>
        <h2 className="sc-title">
          {t.title1}
          <br />
          {t.title2}
        </h2>
        <p className="sc-lead" style={{ maxWidth: 560 }}>
          {t.lead.map((ligne, i) => (
            <span key={ligne}>
              {i > 0 && <br />}
              {ligne}
            </span>
          ))}
        </p>
        <button className="rf-cta" data-open-tunnel onClick={openTunnel}>
          {t.cta}
          <span className="rf-cta-arrow">
            <ArrowRight size={17} strokeWidth={2.6} />
          </span>
        </button>
        <p className="rf-note">{t.note}</p>
      </div>
    </section>
  );
}
