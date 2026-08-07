import React from 'react';

/**
 * Rend un texte dont les '\n' ne coupent la ligne QUE sur mobile.
 * Desktop : les segments s'enchaînent avec une espace (le <br> est masqué).
 * Mobile (≤ 720px) : le <br class="br-mobile"> reprend du service.
 * À utiliser pour les retours à la ligne éditoriaux demandés pour téléphone
 * sans changer le rendu desktop (voir .br-mobile dans refonte.css).
 */
export function mobileLines(text: string): React.ReactNode {
  const parts = text.split('\n');
  if (parts.length === 1) return text;
  return parts.map((p, i) => (
    <React.Fragment key={i}>
      {i > 0 && <br className="br-mobile" />}
      {i > 0 ? ` ${p}` : p}
    </React.Fragment>
  ));
}
