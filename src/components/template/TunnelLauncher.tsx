'use client';

import { useEffect, useState } from 'react';
import ImmersiveTunnel from './ImmersiveTunnel';

/**
 * Monte l'overlay du tunnel immersif et l'ouvre quand on clique sur n'importe
 * quel lien "#rejoindre" (boutons Nous rejoindre du header / hero / footer)
 * ou via l'événement custom `open-tunnel`.
 */
export default function TunnelLauncher() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Libellés de CTA qui ouvrent le tunnel (en plus de #rejoindre / data-open-tunnel)
    const CTA = ['nous rejoindre', 'découvrir le club', 'commencer le parcours'];
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest?.('.imt-overlay')) return; // ne pas interférer dans l'overlay
      const el = target?.closest?.('a, button') as HTMLElement | null;
      if (!el) return;
      const href = el.getAttribute('href');
      const txt = (el.textContent || '').trim().toLowerCase();
      const isCTA =
        href === '#rejoindre' ||
        el.hasAttribute('data-open-tunnel') ||
        txt.includes('rejoindre') ||
        CTA.includes(txt);
      if (isCTA) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onEvent = () => setOpen(true);
    // Deep-link : ouvrir directement si l'URL contient #rejoindre
    if (window.location.hash === '#rejoindre') setOpen(true);
    document.addEventListener('click', onClick);
    window.addEventListener('open-tunnel', onEvent);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('open-tunnel', onEvent);
    };
  }, []);

  if (!open) return null;
  return <ImmersiveTunnel onClose={() => setOpen(false)} />;
}
