'use client';

import YardLine from './YardLine';
import StadeMap from './StadeMap';
import ContactForm from './ContactForm';
import { useLang } from '@/lib/i18n';

const T = {
  fr: {
    eyebrow: 'Infos pratiques',
    title: "On t'attend au stade.",
    horairesTitle: 'Entraînements',
    horaires: [
      { cat: 'Seniors · Foot US compétition', heures: 'Lun & Ven · 20h00 à 23h00 / Mer · 21h00 à 23h00' },
      { cat: 'Flag mixte seniors', heures: 'Lun & Jeu · 20h15 à 22h45' },
      { cat: 'Juniors · Foot US', heures: 'Lun & Jeu · 19h00 à 21h00' },
      { cat: 'Flag mixte juniors', heures: 'Jeudi · 19h00 à 20h30' },
      { cat: 'École de flag', heures: 'Samedi · 10h00 à 12h00' },
    ],
  },
  en: {
    eyebrow: 'Practical info',
    title: "We'll see you at the stadium.",
    horairesTitle: 'Practice schedule',
    horaires: [
      { cat: 'Seniors · Tackle football', heures: 'Mon & Fri · 8–11 pm / Wed · 9–11 pm' },
      { cat: 'Co-ed senior flag', heures: 'Mon & Thu · 8:15–10:45 pm' },
      { cat: 'Juniors · Tackle football', heures: 'Mon & Thu · 7:00–9:00 pm' },
      { cat: 'Co-ed junior flag', heures: 'Thursday · 7:00–8:30 pm' },
      { cat: 'Flag academy', heures: 'Saturday · 10 am–12 pm' },
    ],
  },
};

export default function InfosSection() {
  const { lang } = useLang();
  const t = T[lang];
  return (
    <section className="sc-sec" id="infos">
      <YardLine n="10" />
      <div className="sc-wrap">
        <div data-reveal>
          <p className="sc-eyebrow">{t.eyebrow}</p>
          <h2 className="sc-title">{t.title}</h2>
        </div>
        <div className="sc-infos-grid" data-reveal>
          <StadeMap />
          <div className="sc-panel">
            <h3 className="sc-panel-title">{t.horairesTitle}</h3>
            <div className="sc-horaires">
              {t.horaires.map((h) => (
                <div key={h.cat} className="sc-horaire">
                  <span className="sc-horaire-cat">{h.cat}</span>
                  <span className="sc-horaire-time">{h.heures}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="sc-contact-block" data-reveal>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
