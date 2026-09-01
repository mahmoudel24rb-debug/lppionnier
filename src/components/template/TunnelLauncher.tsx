'use client';

import { useEffect, useState } from 'react';
import { TUNNEL, getAllOffers } from '@/data/funnel';
import ImmersiveTunnel from './ImmersiveTunnel';

/**
 * Monte l'overlay du tunnel immersif et l'ouvre quand on clique sur n'importe
 * quel lien "#rejoindre" (boutons Nous rejoindre du header / hero / footer),
 * via l'événement custom `open-tunnel`, ou via un hash partageable :
 * `#rejoindre` (parcours), `#offres` (toutes les offres), `#offre-<id>` (fiche).
 */
export default function TunnelLauncher() {
  const [open, setOpen] = useState(false);
  // Offre à ouvrir directement (deep-link du quiz ou du hash) : null = parcours normal
  const [offerId, setOfferId] = useState<string | null>(null);
  // Ouvrir directement le job board « Toutes les offres » (hash #offres)
  const [all, setAll] = useState(false);

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
    // `open-tunnel` peut être un CustomEvent avec { detail: { offerId } }
    // (résultat du quiz) : les dispatchs historiques sans detail restent valides.
    const onEvent = (e: Event) => {
      setOfferId((e as CustomEvent<{ offerId?: string }>).detail?.offerId ?? null);
      setAll(false);
      setOpen(true);
    };
    // Deep-link par le hash (export statique : pas de route dédiée) :
    //   #rejoindre       → parcours normal
    //   #offres          → job board « Toutes les offres »
    //   #offre-<id>      → fiche de l'offre, si l'id existe vraiment
    const applyHash = () => {
      const hash = window.location.hash;
      if (hash === '#rejoindre') {
        setOfferId(null);
        setAll(false);
        setOpen(true);
        return;
      }
      if (hash === '#offres') {
        setOfferId(null);
        setAll(true);
        setOpen(true);
        return;
      }
      const m = /^#offre-(.+)$/.exec(hash);
      if (!m) return;
      // ids identiques FR/EN : valider sur l'arbre FR suffit
      const id = decodeURIComponent(m[1]);
      if (!getAllOffers(TUNNEL).some((o) => o.id === id)) return;
      setOfferId(id);
      setAll(false);
      setOpen(true);
    };
    applyHash();
    document.addEventListener('click', onClick);
    window.addEventListener('open-tunnel', onEvent);
    window.addEventListener('hashchange', applyHash);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('open-tunnel', onEvent);
      window.removeEventListener('hashchange', applyHash);
    };
  }, []);

  if (!open) return null;
  return (
    <ImmersiveTunnel
      initialOfferId={offerId ?? undefined}
      initialAll={all}
      onClose={() => { setOpen(false); setOfferId(null); setAll(false); }}
    />
  );
}
