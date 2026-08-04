'use client';

import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import YardLine from './YardLine';
import { FOOT_US, FLAG, type Formule } from '@/data/formules';
import { track } from '@/lib/track';

const TABS = [
  { key: 'foot-us', label: 'Football US', formules: FOOT_US },
  { key: 'flag', label: 'Flag football', formules: FLAG },
] as const;

function PriceCard({ f }: { f: Formule }) {
  return (
    <article className="sc-price-card">
      <span className="sc-price-tag">{f.tag}</span>
      <h3 className="sc-price-name">{f.name}</h3>
      <p className="sc-price-amount">
        {f.price} <span>{f.period}</span>
      </p>
      {f.paiement3x && <p className="sc-price-3x">Paiement en 3× possible · {f.paiement3x}</p>}
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
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('foot-us');
  const active = TABS.find((t) => t.key === tab)!;

  return (
    <section className="sc-sec" id="adhesions">
      <YardLine n="20" />
      <div className="sc-wrap">
        <div className="sc-pricing-head" data-reveal>
          <div>
            <p className="sc-eyebrow">Adhésions · Saison 2026/2027</p>
            <h2 className="sc-title">
              Rejoins le club,
              <br />
              choisis ta formule.
            </h2>
          </div>
          <div className="sc-tabs" role="tablist" aria-label="Discipline">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                className="sc-tab"
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div data-reveal>
          <div
            className={`sc-prices ${
              active.formules.length === 2
                ? 'sc-prices--two'
                : active.formules.length === 4
                  ? 'sc-prices--four'
                  : ''
            }`}
          >
            {active.formules.map((f) => (
              <PriceCard key={f.name} f={f} />
            ))}
          </div>
          <p className="sc-pricing-note">
            Licence FFFA incluse dans toutes les formules · Licence bénévole 6,90 € · Licence coach
            20,50 € · Inscription en ligne via HelloAsso
          </p>
        </div>
        {/* Bandeau donation : permanent, quel que soit l'onglet actif */}
        <div className="sc-donation" data-reveal>
          <p>Vous souhaitez aider le club financièrement ?</p>
          <a
            className="sc-btn"
            href="https://www.helloasso.com/associations/pionniers-de-touraine"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('cta-donation')}
          >
            Faire une donation
          </a>
        </div>
      </div>
    </section>
  );
}
