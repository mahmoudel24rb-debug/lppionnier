'use client';

import YardLine from './YardLine';
import PPPVideo from './PPPVideo';
import { asset } from '@/lib/asset';
import { useLang } from '@/lib/i18n';

const T = {
  fr: {
    eyebrow: 'Pionniers Programme Performance',
    title: 'La méthode maison pour viser plus haut.',
    lead: (
      <>
        Préparation physique, technique, tactique et mentale : <strong>le PPP</strong> structure{' '}
        <strong>la progression</strong> de chaque athlète,
        <br />à chaque entraînement. Débutant motivé ou
        joueur confirmé : <strong>tous les profils de joueurs</strong> progressent dans un cadre
        exigeant et accessible.
      </>
    ),
    cta: 'Rejoindre le programme',
  },
  en: {
    eyebrow: 'Pionniers Programme Performance',
    title: 'Our in-house method to aim higher.',
    lead: (
      <>
        Physical, technical, tactical and mental preparation: <strong>the PPP</strong> structures{' '}
        <strong>the progression</strong> of every athlete,
        <br />at every practice. Motivated beginner or
        seasoned player: <strong>every player profile</strong> improves within a demanding yet
        accessible framework.
      </>
    ),
    cta: 'Join the program',
  },
};

export default function PPPSection() {
  const { lang } = useLang();
  const t = T[lang];
  return (
    <section className="sc-sec">
      <YardLine n="30" />
      <div className="sc-wrap">
        <div className="sc-ppp-panel" data-reveal>
          <figure className="sc-ppp-poster" style={{ margin: 0 }}>
            <PPPVideo />
          </figure>
          <div className="sc-ppp-body">
            <img
              className="sc-ppp-logo"
              src={asset('/assets/logo-ppp.png')}
              alt="Logo PPP"
              loading="lazy"
            />
            <p className="sc-eyebrow">{t.eyebrow}</p>
            <h2 className="sc-title">{t.title}</h2>
            <p className="sc-lead">{t.lead}</p>
            <button type="button" className="sc-btn" data-open-tunnel>
              {t.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
