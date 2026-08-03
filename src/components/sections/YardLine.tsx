import { asset } from '@/lib/asset';

/**
 * Marqueur de yards (séparateur de sections) : la page descend le terrain,
 * 20 → 60, jusqu'à l'en-but (bandeau « PIONNIERS »).
 * SVG fournis par le designer (marquages terrain, fond transparent).
 */
export type YardKey = '20' | '30' | '40' | '50' | '60' | 'endzone';

export default function YardLine({ n }: { n: YardKey }) {
  return (
    <div className="sc-yard" aria-hidden="true">
      <img src={asset(`/assets/refonte/yards/${n === 'endzone' ? 'endzone' : `${n}y`}.svg`)} alt="" loading="lazy" />
    </div>
  );
}
