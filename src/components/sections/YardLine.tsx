import { asset } from '@/lib/asset';

/**
 * Marqueur de yards (séparateur de sections) : descente du milieu de
 * terrain vers l'en-but, 50 → 40 → 30 → 20 → 10 → PIONNIERS.
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
