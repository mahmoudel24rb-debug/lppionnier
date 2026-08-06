'use client';

import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import YardLine from './YardLine';
import { FORMULES, type Formule } from '@/data/formules';
import { track } from '@/lib/track';
import { useLang } from '@/lib/i18n';

const T = {
  fr: {
    eyebrow: 'Adhésions · Saison 2026/2027',
    title1: 'Rejoins le club,',
    title2: 'choisis ta formule.',
    tabFoot: 'Football US',
    tabFlag: 'Flag football',
    p3x: 'Paiement en 3× possible ·',
    note: 'Licence FFFA incluse dans toutes les formules · Licence bénévole 6,90 € · Licence coach 20,50 € · Inscription en ligne via HelloAsso',
    donation: 'Vous souhaitez aider le club financièrement ?',
    donationCta: 'Faire une donation',
  },
  en: {
    eyebrow: 'Memberships · 2026/2027 season',
    title1: 'Join the club,',
    title2: 'pick your plan.',
    tabFoot: 'American football',
    tabFlag: 'Flag football',
    p3x: 'Pay in 3 installments ·',
    note: 'FFFA license included in every plan · Volunteer license €6.90 · Coach license €20.50 · Online registration via HelloAsso',
    donation: 'Would you like to support the club financially?',
    donationCta: 'Make a donation',
  },
};

function PriceCard({ f, p3x }: { f: Formule; p3x: string }) {
  return (
    <article className="sc-price-card">
      <div className="sc-price-head">
        <h3 className="sc-price-name">{f.name}</h3>
        <span className="sc-price-tag">{f.tag}</span>
      </div>
      <p className="sc-price-amount">
        {f.price} <span>{f.period}</span>
      </p>
      {f.paiement3x && <p className="sc-price-3x">{p3x} {f.paiement3x}</p>}
      <p className="sc-price-desc">
        {f.desc.map((ligne, i) => (
          <span key={ligne}>
            {i > 0 && <br />}
            {ligne}
          </span>
        ))}
      </p>
      <ul className="sc-price-features">
        {f.features.map((feat) => (
          <li key={feat}>
            <FaCheck size={11} /> {feat}
          </li>
        ))}
      </ul>
      <a className="sc-btn" href={f.href} target="_blank" rel="noopener noreferrer">
        {f.cta}
      </a>
    </article>
  );
}

export default function PricingSection() {
  const [tab, setTab] = useState<'foot-us' | 'flag'>('foot-us');
  const { lang } = useLang();
  const t = T[lang];
  const formules = tab === 'foot-us' ? FORMULES[lang].footUs : FORMULES[lang].flag;

  return (
    <section className="sc-sec" id="adhesions">
      <YardLine n="20" />
      <div className="sc-wrap">
        <div className="sc-pricing-head" data-reveal>
          <div>
            <p className="sc-eyebrow">{t.eyebrow}</p>
            <h2 className="sc-title">
              {t.title1}
              <br />
              {t.title2}
            </h2>
          </div>
          <div className="sc-tabs" role="tablist" aria-label="Discipline">
            {([['foot-us', t.tabFoot], ['flag', t.tabFlag]] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                className="sc-tab"
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div data-reveal>
          <div className={`sc-prices ${formules.length === 2 ? 'sc-prices--two' : formules.length === 4 ? 'sc-prices--four' : ''}`}>
            {formules.map((f) => (
              <PriceCard key={f.name} f={f} p3x={t.p3x} />
            ))}
          </div>
          <p className="sc-pricing-note">{t.note}</p>
        </div>
        {/* Bandeau donation : permanent, quel que soit l'onglet actif */}
        <div className="sc-donation" data-reveal>
          <p>{t.donation}</p>
          <a
            className="sc-btn"
            href="https://www.helloasso.com/associations/pionniers-de-touraine"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('cta-donation')}
          >
            {t.donationCta}
          </a>
        </div>
      </div>
    </section>
  );
}
