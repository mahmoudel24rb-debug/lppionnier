import { asset } from '@/lib/asset';

/**
 * Marqueur de yards (séparateur de sections) : montée complète
 * 20 → 30 → 40 → 50 (milieu de terrain), puis descente juste avant
 * l'en-but. La clé '20b' réutilise le SVG 20y.
 * TODO : remplacer '20b' par le fichier 10y.svg dès réception du designer
 * (descente 50 → 10 avant l'en-but, comme demandé).
 */
export type YardKey = '20' | '30' | '40' | '50' | '20b' | 'endzone';

export default function YardLine({ n }: { n: YardKey }) {
  const file = n === 'endzone' ? 'endzone' : `${n.replace('b', '')}y`;
  return (
    <div className="sc-yard" aria-hidden="true">
      <img src={asset(`/assets/refonte/yards/${file}.svg`)} alt="" loading="lazy" />
    </div>
  );
}
