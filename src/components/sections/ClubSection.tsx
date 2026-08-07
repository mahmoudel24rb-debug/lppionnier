'use client';

import YardLine from './YardLine';
import ClubSlideshow from './ClubSlideshow';
import { useLang } from '@/lib/i18n';

const T = {
  fr: {
    eyebrow: 'Le club',
    title1: 'Le football américain',
    title2: 'au cœur de la Touraine.',
    lead: "Depuis 1987, les Pionniers font vivre le football américain et le flag football à Tours :\ndes athlètes qui se dépassent, un staff qui transmet, des bénévoles qui construisent.\nSur le terrain ou à côté, chacun a sa place dans l'effectif.",
    reperes: [
      { label: '1987', txt: 'Fondation du club à Tours :\nle football américain arrive\nen Touraine.' },
      { label: 'Deux sports', txt: 'Football américain au contact, flag football sans contact : deux disciplines, une même intensité.' },
      { label: 'Pour tous', txt: 'Seniors, juniors U18 et école\nde flag : débutants bienvenus,\naucune expérience exigée.' },
      { label: 'Cap 2028', txt: 'Le flag football devient olympique aux JO de Los Angeles.' },
    ],
  },
  en: {
    eyebrow: 'The club',
    title1: 'American football',
    title2: 'in the heart of Touraine.',
    lead: 'Since 1987, the Pionniers have kept American football and flag football alive in Tours:\nathletes pushing their limits, a staff passing the game on, volunteers building the club.\nOn the field or beside it, everyone has a place on the roster.',
    reperes: [
      { label: '1987', txt: 'The club is founded in Tours:\nAmerican football arrives\nin Touraine.' },
      { label: 'Two sports', txt: 'Full-contact American football, no-contact flag football: two disciplines, one intensity.' },
      { label: 'For everyone', txt: 'Seniors, U18 juniors and the\nflag academy: beginners welcome,\nno experience required.' },
      { label: '2028 ahead', txt: 'Flag football becomes an Olympic sport at the Los Angeles Games.' },
    ],
  },
};

export default function ClubSection() {
  const { lang } = useLang();
  const t = T[lang];
  return (
    <section className="sc-sec" id="club">
      <YardLine n="50" />
      <div className="sc-wrap sc-club-grid">
        <div data-reveal>
          <p className="sc-eyebrow">{t.eyebrow}</p>
          <h2 className="sc-title">
            {t.title1}
            <br />
            {t.title2}
          </h2>
          <p className="sc-lead">{t.lead}</p>
          <ul className="sc-reperes">
            {t.reperes.map((r) => (
              <li key={r.label}>
                <span className="sc-repere-label">{r.label}</span>
                <span className="sc-repere-txt">{r.txt}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="sc-club-media" data-reveal>
          <ClubSlideshow />
        </div>
      </div>
    </section>
  );
}
