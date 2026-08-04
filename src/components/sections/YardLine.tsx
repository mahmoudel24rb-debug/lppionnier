import { asset } from '@/lib/asset';

/**
 * Marqueur de yards (séparateur de sections) : montée 20 → 40 → 50
 * (milieu de terrain), puis descente 40 → 20 avant l'en-but, comme sur
 * un vrai terrain. Les clés '40b'/'20b' réutilisent les mêmes SVG.
 * TODO : remplacer '20b' par le fichier 10y.svg dès réception du designer.
 */
export type YardKey = '20' | '40' | '50' | '40b' | '20b' | 'endzone';

export default function YardLine({ n }: { n: YardKey }) {
  const file = n === 'endzone' ? 'endzone' : `${n.replace('b', '')}y`;
  return (
    <div className="sc-yard" aria-hidden="true">
      <img src={asset(`/assets/refonte/yards/${file}.svg`)} alt="" loading="lazy" />
    </div>
  );
}
