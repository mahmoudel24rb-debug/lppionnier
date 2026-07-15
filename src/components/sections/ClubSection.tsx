import YardLine from './YardLine';
import { asset } from '@/lib/asset';

const REPERES = [
  { label: '1987', txt: 'Fondation du club à Tours : le football américain arrive en Touraine.' },
  { label: 'Deux sports', txt: 'Football américain au contact, flag football sans contact : deux disciplines, une même intensité.' },
  { label: 'Pour tous', txt: 'Seniors, juniors U18 et école de flag : débutants bienvenus, aucune expérience exigée.' },
  { label: 'Cap 2028', txt: 'Le flag football devient olympique aux JO de Los Angeles.' },
];

export default function ClubSection() {
  return (
    <section className="sc-sec" id="club">
      <YardLine n="10" />
      <div className="sc-wrap sc-club-grid">
        <div data-reveal>
          <p className="sc-eyebrow">Le club</p>
          <h2 className="sc-title">
            Le football américain
            <br />
            au cœur de la Touraine.
          </h2>
          <p className="sc-lead">
            Depuis 1987, les Pionniers font vivre le football américain et le flag football à
            Tours : des athlètes qui se dépassent, un staff qui transmet, des bénévoles qui
            construisent. Sur le terrain ou à côté, chacun a sa place dans l&apos;effectif.
          </p>
          <ul className="sc-reperes">
            {REPERES.map((r) => (
              <li key={r.label}>
                <span className="sc-repere-label">{r.label}</span>
                <span className="sc-repere-txt">{r.txt}</span>
              </li>
            ))}
          </ul>
        </div>
        <figure className="sc-poster" data-reveal>
          <img
            src={asset('/assets/refonte/affiche-flag.jpg')}
            alt="Affiche du club : équipe flag mixte qualifiée en demi-finales de conférence"
            loading="lazy"
          />
          <figcaption>Flag mixte : qualifiés en demi-finales · Conférence Nord</figcaption>
        </figure>
      </div>
    </section>
  );
}
