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
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('sc-in');
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
