'use client';

import { useEffect, useMemo, useRef } from 'react';
import { FaChevronRight, FaSearch } from 'react-icons/fa';
import { getAllOffers, type OfferCategory, type ResolvedOffer } from '@/data/funnel';
import { getEmoji } from '@/lib/funnelIcons';
import { track } from '@/lib/track';

type BoardCat = 'tous' | OfferCategory;

const FILTERS: { key: BoardCat; label: string }[] = [
  { key: 'tous', label: 'Tous' },
  { key: 'sportif', label: 'Sportif' },
  { key: 'associatif', label: 'Associatif' },
];

/** Normalisation insensible aux accents et à la casse. */
const norm = (s: string): string =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

type Props = {
  query: string;
  onQuery: (q: string) => void;
  cat: BoardCat;
  onCat: (c: BoardCat) => void;
  onSelect: (o: ResolvedOffer) => void;
};

export default function AllOffersBoard({ query, onQuery, cat, onCat, onSelect }: Props) {
  const all = useMemo(() => getAllOffers(), []);

  const results = useMemo(() => {
    const q = norm(query.trim());
    return all.filter((o) => {
      if (cat !== 'tous' && o.categorie !== cat) return false;
      if (!q) return true;
      return norm(`${o.titre} ${o.punchline ?? ''} ${o.tag}`).includes(q);
    });
  }, [all, query, cat]);

  // Recherche : un seul événement par montage, débouncé, sans le texte saisi.
  const searchTracked = useRef(false);
  useEffect(() => {
    if (searchTracked.current || query.trim().length < 2) return;
    const t = window.setTimeout(() => {
      if (searchTracked.current) return;
      searchTracked.current = true;
      track('all-search');
    }, 1000);
    return () => window.clearTimeout(t);
  }, [query]);

  const pickCat = (next: BoardCat) => {
    if (next === cat) return;
    onCat(next);
    track('all-filter', { cat: next });
  };

  const reset = () => { onQuery(''); onCat('tous'); };

  return (
    <div className="imt-stage imt-board-stage">
      <div className="imt-board">
        {/* outils fixes : seule la grille de résultats scrolle */}
        <div className="imt-board-tools">
          <span className="imt-search">
            <FaSearch size={13} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              aria-label="Rechercher une offre"
              placeholder="Rechercher une mission…"
            />
          </span>
          <div className="imt-filters" role="group" aria-label="Filtrer par catégorie">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`imt-pill ${cat === f.key ? 'on' : ''}`}
                aria-pressed={cat === f.key}
                onClick={() => pickCat(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="imt-board-count" aria-live="polite">
          {results.length} {results.length === 1 ? 'offre' : 'offres'}
        </p>

        <div className="imt-board-results">
        {results.length > 0 ? (
          <div className="imt-offers imt-offers-all">
            {results.map((o) => {
              return (
                <button key={o.id} className="imt-offer" onClick={() => onSelect(o)}>
                  <span className="imt-offer-head">
                    <span className="imt-offer-icon"><img src={getEmoji(o.icon)} alt="" /></span>
                    <span className="imt-tag">{o.tag}</span>
                  </span>
                  <h3 className="imt-offer-title">{o.titre}</h3>
                  {o.punchline && <p className="imt-offer-sub">{o.punchline}</p>}
                  <span className="imt-card-cta" style={{ marginTop: 14 }}>Voir l&apos;offre <FaChevronRight size={11} /></span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="imt-board-empty">
            <p>Aucune offre ne correspond à votre recherche.</p>
            <button type="button" className="imt-secondary" onClick={reset}>
              Réinitialiser les filtres
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
