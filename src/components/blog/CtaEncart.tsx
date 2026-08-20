import Link from 'next/link';

/**
 * Encart CTA posé dans la zone de lecture claire des articles.
 * - variante « tunnel » : bouton data-open-tunnel (capté par TunnelLauncher,
 *   monté globalement dans le layout) — attention, ne jamais mettre le mot
 *   « rejoindre » dans un libellé de lien qui ne doit PAS ouvrir le tunnel.
 * - variante « quiz » : lien vers la page du test de poste.
 */
export function CtaTunnel({ titre, texte, bouton }: { titre: string; texte: string; bouton: string }) {
  return (
    <aside className="blogc-cta">
      <p className="blogc-cta-title">{titre}</p>
      <p>{texte}</p>
      <button className="sc-btn" data-open-tunnel type="button">{bouton}</button>
    </aside>
  );
}

export function CtaQuiz({ titre, texte, bouton }: { titre?: string; texte?: string; bouton?: string }) {
  return (
    <aside className="blogc-cta">
      <p className="blogc-cta-title">{titre ?? 'Quel poste est fait pour toi ?'}</p>
      <p>
        {texte ??
          'Réponds à 8 questions : notre algorithme de scouting, calibré sur les gabarits réels des joueurs NFL et NCAA, te propose ton poste idéal — foot US ou flag.'}
      </p>
      <Link className="sc-btn" href="/quel-poste-football-americain/">{bouton ?? 'Je fais le test'}</Link>
    </aside>
  );
}
