'use client';

import { useEffect } from 'react';

/**
 * Îlot client : révèle au scroll les éléments marqués [data-reveal]
 * (fade + translation, désactivé si prefers-reduced-motion via CSS).
 */
export default function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!els.length) return;
    // Fin d'animation : on libère la couche promue par le will-change du CSS
    // (transitionend, avec un délai de secours si l'événement ne vient pas).
    const libererCouche = (el: Element) => {
      const fini = () => {
        (el as HTMLElement).style.willChange = 'auto';
        el.removeEventListener('transitionend', fini);
      };
      el.addEventListener('transitionend', fini);
      window.setTimeout(fini, 800);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('sc-in');
            libererCouche(e.target);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
