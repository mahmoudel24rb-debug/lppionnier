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
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href="#rejoindre"], [data-open-tunnel]');
      if (a) {
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
