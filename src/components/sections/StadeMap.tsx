import { asset } from '@/lib/asset';

/**
 * Carte stylisée du stade (décorative, aux couleurs de la charte) :
 * rues ambre, Loire en bande claire, ballon Pionniers en marqueur central.
 * Cliquable vers Google Maps (adresse réelle du stade).
 */
const GOOGLE_MAPS =
  'https://www.google.com/maps/search/?api=1&query=Stade+de+la+Chambrerie+Rue+Tartifume+37100+Tours';

export default function StadeMap() {
  return (
    <a
      className="sc-map"
      href={GOOGLE_MAPS}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ouvrir l'itinéraire vers le Stade de la Chambrerie, 2-4 Rue de Tartifume, 37100 Tours, dans Google Maps"
    >
      <svg viewBox="0 0 800 500" role="img" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="mapbg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7e343a" />
            <stop offset="1" stopColor="#571f24" />
          </linearGradient>
          <radialGradient id="mapvignette" cx="0.5" cy="0.45" r="0.75">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.35" />
          </radialGradient>
        </defs>

        <rect width="800" height="500" fill="url(#mapbg)" />

        {/* îlots bâtis */}
        <g fill="#40161a" opacity="0.55">
          <rect x="60" y="70" width="110" height="70" rx="8" />
          <rect x="205" y="55" width="90" height="60" rx="8" />
          <rect x="120" y="185" width="95" height="75" rx="8" />
          <rect x="545" y="70" width="120" height="65" rx="8" />
          <rect x="640" y="180" width="105" height="80" rx="8" />
          <rect x="520" y="215" width="85" height="60" rx="8" />
          <rect x="90" y="330" width="120" height="60" rx="8" />
          <rect x="580" y="360" width="130" height="70" rx="8" />
          <rect x="300" y="380" width="100" height="65" rx="8" />
        </g>

        {/* la Loire */}
        <path
          d="M -20 430 C 150 400 300 355 430 330 C 560 305 700 300 830 320"
          fill="none" stroke="#d9d2c6" strokeWidth="36" strokeLinecap="round" opacity="0.85"
        />
        <path
          d="M -20 430 C 150 400 300 355 430 330 C 560 305 700 300 830 320"
          fill="none" stroke="#f3ede2" strokeWidth="3" strokeDasharray="1 14" strokeLinecap="round" opacity="0.5"
        />

        {/* rues secondaires */}
        <g fill="none" stroke="#ffad00" strokeWidth="3" strokeLinecap="round" opacity="0.3">
          <path d="M 40 25 L 25 300" />
          <path d="M 175 15 L 160 250" />
          <path d="M 320 0 L 310 200 L 340 320" />
          <path d="M 615 10 L 622 260" />
          <path d="M 740 40 L 748 300" />
          <path d="M 0 160 L 470 148" />
          <path d="M 90 305 L 400 285" />
          <path d="M 470 250 L 790 238" />
          <path d="M 470 448 L 800 430" />
          <path d="M 60 470 L 320 452" />
        </g>

        {/* axes principaux */}
        <g fill="none" stroke="#ffad00" strokeLinecap="round">
          <path d="M -10 95 C 200 82 520 78 810 92" strokeWidth="8" opacity="0.8" />
          <path d="M 470 0 C 462 160 468 330 452 500" strokeWidth="8" opacity="0.8" />
          <path d="M 0 218 C 240 205 560 198 800 182" strokeWidth="5.5" opacity="0.55" />
          <path d="M 232 0 C 240 140 228 330 250 500" strokeWidth="5.5" opacity="0.55" />
        </g>

        {/* quartiers */}
        <g
          fill="#fffaf0" opacity="0.5" fontSize="15" fontWeight="700"
          fontFamily="'Neuething', sans-serif" letterSpacing="2.5"
        >
          <text x="580" y="45">TOURS NORD</text>
          <text x="105" y="475">CENTRE-VILLE</text>
          <text x="620" y="345" fill="#efe8da" opacity="0.85">LA LOIRE</text>
        </g>

        <rect width="800" height="500" fill="url(#mapvignette)" />
      </svg>

      {/* marqueur : le ballon Pionniers, au niveau du stade */}
      <img
        className="sc-map-ballon"
        src={asset('/assets/refonte/ballon-pionniers.png')}
        alt=""
        loading="lazy"
      />

      {/* adresse */}
      <span className="sc-map-address">
        <strong>Stade de la Chambrerie</strong>
        <span>2-4 Rue de Tartifume, 37100 Tours</span>
      </span>
    </a>
  );
}
