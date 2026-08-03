'use client';

import { useCallback, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { asset } from '@/lib/asset';

/**
 * Diaporama de la section « Le club ».
 *
 * Pour ajouter une photo : déposer le fichier dans public/assets/slideshow/
 * puis ajouter une entrée ici (affiches de matchs, photos de matchs, flag,
 * foot US, école de flag). L'ordre du tableau est l'ordre de défilement.
 */
type Slide = {
  src: string;
  alt: string;
  legende: string;
};

const SLIDES: Slide[] = [
  {
    src: '/assets/slideshow/affiche-flag.jpg',
    alt: "Affiche du club : l'équipe de flag mixte qualifiée en demi-finales de la Conférence Nord",
    legende: 'Flag mixte : qualifiés en demi-finales · Conférence Nord',
  },
  {
    src: '/assets/slideshow/affiche-ppp.jpg',
    alt: 'Affiche du Pionniers Programme Performance : préparation physique, technique, tactique et mentale',
    legende: 'PPP : le Pionniers Programme Performance',
  },
];

const DELAI = 4500;

export default function ClubSlideshow() {
  const [index, setIndex] = useState(0);
  const [enPause, setEnPause] = useState(false);
  const [animationReduite, setAnimationReduite] = useState(false);
  const total = SLIDES.length;

  const suivant = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const precedent = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  // Respect de la préférence système « animations réduites ».
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setAnimationReduite(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Défilement automatique, suspendu au survol / focus.
  useEffect(() => {
    if (animationReduite || enPause || total < 2) return;
    const id = window.setInterval(suivant, DELAI);
    return () => window.clearInterval(id);
  }, [animationReduite, enPause, suivant, total]);

  return (
    <div
      className="sc-slideshow"
      role="region"
      aria-roledescription="carrousel"
      aria-label="Photos et affiches du club"
      onMouseEnter={() => setEnPause(true)}
      onMouseLeave={() => setEnPause(false)}
      onFocusCapture={() => setEnPause(true)}
      onBlurCapture={() => setEnPause(false)}
    >
      <div className="sc-slide-stage">
        {SLIDES.map((s, i) => (
          <img
            key={s.src}
            className={`sc-slide ${i === index ? 'is-active' : ''}`}
            src={asset(s.src)}
            alt={s.alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            aria-hidden={i === index ? undefined : true}
          />
        ))}

        {total > 1 && (
          <>
            <button
              type="button"
              className="sc-slide-nav sc-slide-nav--prev"
              onClick={precedent}
              aria-label="Photo précédente"
            >
              <FaChevronLeft size={13} />
            </button>
            <button
              type="button"
              className="sc-slide-nav sc-slide-nav--next"
              onClick={suivant}
              aria-label="Photo suivante"
            >
              <FaChevronRight size={13} />
            </button>
          </>
        )}
      </div>

      <p className="sc-slide-legende">{SLIDES[index].legende}</p>

      {total > 1 && (
        <div className="sc-slide-dots">
          {SLIDES.map((s, i) => (
            <button
              key={s.src}
              type="button"
              className={`sc-slide-dot ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Afficher la photo ${i + 1} sur ${total}`}
              aria-current={i === index ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
