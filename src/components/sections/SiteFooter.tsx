import { asset } from '@/lib/asset';

const NAV = [
  { href: '#top', label: 'Accueil' },
  { href: '#club', label: 'Le club' },
  { href: '#sections', label: 'Nos sections' },
  { href: '#adhesions', label: 'Adhésions' },
  { href: '#rejoindre', label: 'Nous rejoindre' },
];

const BADGES = [
  { src: '/assets/refonte/badge-1-footus.svg', alt: 'Foot US & Flag' },
  { src: '/assets/refonte/badge-2-olympique.svg', alt: 'Sport Olympique · JO de Los Angeles 2028' },
  { src: '/assets/refonte/badge-3-ppp.svg', alt: 'Programme PPP' },
  { src: '/assets/refonte/badge-4-u18.svg', alt: 'U18' },
  { src: '/assets/refonte/badge-5-ecole.svg', alt: 'École de Flag' },
];

export default function SiteFooter() {
  return (
    <footer className="sc-footer">
      <div className="sc-wrap sc-footer-grid">
        <div>
          <img
            className="sc-footer-logo"
            src={asset('/assets/refonte/logo-pionniers.svg')}
            alt="Pionniers de Touraine"
            loading="lazy"
          />
          <p className="sc-footer-tagline">
            Football américain &amp; flag football à Tours depuis 1987. Sur le terrain ou à nos
            côtés, trouve ta place chez les Pionniers.
          </p>
          <div className="sc-footer-badges">
            {BADGES.map((b) => (
              <img key={b.alt} src={asset(b.src)} alt={b.alt} loading="lazy" />
            ))}
          </div>
        </div>
        <div>
          <h3 className="sc-footer-h">Explorer</h3>
          <nav className="sc-footer-links">
            {NAV.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <h3 className="sc-footer-h">Contact</h3>
          <div className="sc-footer-links">
            <a href="tel:0600000000">06 00 00 00 00</a>
            <a href="mailto:contact@pionniers-touraine.fr">contact@pionniers-touraine.fr</a>
            <span style={{ fontSize: 14, letterSpacing: '-0.02em', color: 'var(--sc-cream-55)' }}>
              Tours, Touraine (37)
            </span>
          </div>
        </div>
      </div>
      <div className="sc-footer-bottom">
        <span>© Pionniers de Touraine · Tous droits réservés.</span>
        <span>
          Réalisé par <strong>DGL Agency</strong>
        </span>
      </div>
    </footer>
  );
}
