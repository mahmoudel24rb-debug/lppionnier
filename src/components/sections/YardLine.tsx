import { asset } from '@/lib/asset';

/**
 * Marqueur de yards (séparateur de sections) : montée complète
 * 20 → 30 → 40 → 50 (milieu de terrain), puis descente à 10 juste
 * avant l'en-but, comme sur un vrai terrain.
 */
export type YardKey = '10' | '20' | '30' | '40' | '50' | 'endzone';

export default function YardLine({ n }: { n: YardKey }) {
  const file = n === 'endzone' ? 'endzone' : `${n}y`;
  return (
    <div className="sc-yard" aria-hidden="true">
      <img src={asset(`/assets/refonte/yards/${file}.svg`)} alt="" loading="lazy" />
    </div>
  );
}
