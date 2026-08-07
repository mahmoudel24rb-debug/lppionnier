'use client';

import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';

/**
 * Vidéo en boucle du bloc PPP (5,5 Mo) : chargée seulement à l'approche du
 * viewport (l'affiche sert de poster en attendant), muette, en boucle.
 * Si l'utilisateur préfère les animations réduites, la vidéo ne démarre pas
 * et l'affiche reste visible.
 */
export default function PPPVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Chargement + décodage du premier frame WebM (2,6 Mo) déplacés dans un
    // temps mort du thread principal, loin des frames de scroll.
    const pendantTempsMort = (cb: () => void) =>
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(cb, { timeout: 1500 })
        : window.setTimeout(cb, 200);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            io.disconnect();
            pendantTempsMort(() => {
              video.src = asset('/assets/refonte/bloc-ppp.webm');
              video.play().catch(() => {
                /* autoplay refusé : le poster reste affiché */
              });
            });
          }
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={asset('/assets/refonte/affiche-ppp.jpg')}
      aria-label="Vidéo du Pionniers Programme Performance : les athlètes du club à l'entraînement"
    />
  );
}
