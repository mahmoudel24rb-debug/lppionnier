'use client';

import { useCallback, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { asset } from '@/lib/asset';
import { useLang } from '@/lib/i18n';

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
  altEn: string;
  legendeEn: string;
};

const SLIDES: Slide[] = [
  {
    src: '/assets/slideshow/slide-win-g7.jpg',
    alt: 'Affiche de la victoire 47 à 07 des Pionniers contre les Ankou en football américain',
    legende: 'Victoire 47 à 07 contre les Ankou',
    altEn: "Poster of the Pionniers 47-07 win over the Ankou in American football",
    legendeEn: "A 47-07 win over the Ankou",
  },
  {
    src: '/assets/slideshow/slide-match-footus.jpg',
    alt: 'Ligne de scrimmage des Pionniers de Touraine pendant un match de football américain',
    legende: 'Les seniors en match · © Hugo Faury',
    altEn: "Pionniers de Touraine line of scrimmage during an American football game",
    legendeEn: "Seniors on game day · © Hugo Faury",
  },
  {
    src: '/assets/slideshow/slide-affiche-game5.jpg',
    alt: 'Affiche du match de football américain Pionniers contre Dockers au stade de la Chambrerie',
    legende: 'Affiche : Pionniers vs Dockers',
    altEn: "Game poster: Pionniers vs Dockers at the Chambrerie stadium",
    legendeEn: "Game poster: Pionniers vs Dockers",
  },
  {
    src: '/assets/slideshow/affiche-flag.jpg',
    alt: "Affiche du club : l'équipe de flag mixte qualifiée en demi-finales de la Conférence Nord",
    legende: 'Flag mixte : qualifiés en demi-finales',
    altEn: "Club poster: the mixed flag team qualified for the North Conference semi-finals",
    legendeEn: "Mixed flag: semi-final bound",
  },
  {
    src: '/assets/slideshow/slide-flag-quarts.jpg',
    alt: 'Équipe de flag mixte des Pionniers lors de la journée 1 des quarts de finale de la phase nationale',
    legende: 'Quarts de finale · phase nationale',
    altEn: "Pionniers mixed flag team at day 1 of the national quarter-finals",
    legendeEn: "National quarter-finals",
  },
  {
    src: '/assets/slideshow/slide-affiche-quarts.jpg',
    alt: 'Affiche des quarts de finale de la phase nationale de flag à Rennes',
    legende: 'Affiche : 1/4 de finale à Rennes',
    altEn: "Poster for the national flag quarter-finals in Rennes",
    legendeEn: "Poster: quarter-finals in Rennes",
  },
  {
    src: '/assets/slideshow/slide-ecole-camp.jpg',
    alt: 'Affiche du Mini Flag Camp Spring Édition des Pionniers au stade de la Chambrerie',
    legende: 'Mini Flag Camp · Spring Édition',
    altEn: "Mini Flag Camp Spring Edition poster at the Chambrerie stadium",
    legendeEn: "Mini Flag Camp · Spring Edition",
  },
  {
    src: '/assets/slideshow/slide-ecole-flag.jpg',
    alt: 'Deux jeunes joueuses de l’école de flag des Pionniers en plein duel à l’entraînement',
    legende: 'L’école de flag en action',
    altEn: "Two young flag academy players in a duel at practice",
    legendeEn: "The flag academy in action",
  },
  {
    src: '/assets/slideshow/slide-selection-u17.jpg',
    alt: 'Affiche de Gabriel Ayad Valla, defensive back des Pionniers, sélectionné en Équipe de France U17',
    legende: 'Gabriel Ayad Valla en Équipe de France U17',
    altEn: "Poster of Gabriel Ayad Valla, Pionniers defensive back, selected for the France U17 national team",
    legendeEn: "Gabriel Ayad Valla on the France U17 team",
  },
  {
    src: '/assets/slideshow/slide-joueurs.jpg',
    alt: 'Deux joueurs de football américain des Pionniers de Touraine',
    legende: 'Nos joueurs seniors · © Hugo Faury',
    altEn: "Two Pionniers de Touraine American football players",
    legendeEn: "Our senior players · © Hugo Faury",
  },
  {
    src: '/assets/slideshow/slide-flag-seniors.jpg',
    alt: 'Joueurs de flag seniors des Pionniers de Touraine en tournoi',
    legende: 'Le flag seniors en tournoi',
    altEn: "Pionniers senior flag players at a tournament",
    legendeEn: "Senior flag at a tournament",
  },
];

const DELAI = 4500;

export default function ClubSlideshow() {
  const { lang } = useLang();
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
      aria-label={lang === 'en' ? 'Club photos and posters' : 'Photos et affiches du club'}
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
            alt={lang === 'en' ? s.altEn : s.alt}
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
              aria-label={lang === 'en' ? 'Previous photo' : 'Photo précédente'}
            >
              <FaChevronLeft size={13} />
            </button>
            <button
              type="button"
              className="sc-slide-nav sc-slide-nav--next"
              onClick={suivant}
              aria-label={lang === 'en' ? 'Next photo' : 'Photo suivante'}
            >
              <FaChevronRight size={13} />
            </button>
          </>
        )}
      </div>

      <p className="sc-slide-legende">{lang === 'en' ? SLIDES[index].legendeEn : SLIDES[index].legende}</p>

      {total > 1 && (
        <div className="sc-slide-dots">
          {SLIDES.map((s, i) => (
            <button
              key={s.src}
              type="button"
              className={`sc-slide-dot ${i === index ? 'is-active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={lang === 'en' ? `Show photo ${i + 1} of ${total}` : `Afficher la photo ${i + 1} sur ${total}`}
              aria-current={i === index ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
