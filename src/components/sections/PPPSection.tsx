import YardLine from './YardLine';
import { asset } from '@/lib/asset';
import PPPVideo from './PPPVideo';

export default function PPPSection() {
  return (
    <section className="sc-sec">
      <YardLine n="40" />
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
            <p className="sc-eyebrow">Pionniers Programme Performance</p>
            <h2 className="sc-title">La méthode maison pour viser plus haut.</h2>
            <p className="sc-lead">
              Préparation physique, technique, tactique et mentale : <strong>le PPP</strong>{' '}
              structure <strong>la progression</strong> de chaque athlète, à chaque entraînement.
              Débutant motivé ou joueur confirmé : <strong>tous les profils de joueurs</strong>{' '}
              progressent dans un cadre exigeant et accessible.
            </p>
            <button type="button" className="sc-btn" data-open-tunnel>
              Rejoindre le programme
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
