import { asset } from '@/lib/asset';

/**
 * Emojis 3D du pack designers (EMOJIS PIONNIERS, cf. « Plan emojis »),
 * compressés dans public/assets/refonte/emojis/.
 * Clé = `icon` des nœuds/offres du tunnel (src/data/funnel.ts).
 */
const MAP: Record<string, string> = {
  // Étape 1
  jouer: '19-ballon',
  investir: '07-handshake',
  soutenir: '11-coeur-club',
  // Pratique
  'foot-us': '28-football-americain',
  flag: '22-flag-football',
  // Sous-branches joueur (football américain)
  decouvrir: '24-lanterne',
  rejoindre: '25-maillot-senior',
  jeunes: '01-biberon',
  seniors: '15-joueur-football-buste',
  // Sous-branches joueur (flag)
  'rejoindre-flag': '20-joueuse-flag-buste-emoji-v3',
  'jeunes-flag': '16-drapeau-nfl-flag',
  'seniors-flag': '17-drapeau-la28',
  // Investissement
  temps: '03-horloge',
  experience: '18-chapeau-etudiant',
  competences: '14-briefcase',
  organiser: '02-calendrier',
  materiel: '26-pioche',
  coaching: '04-sifflet',
  arbitrage: '09-arbitre-touchdown-mains-interieures',
  com: '05-megaphone',
  gestion: '08-dossier',
  finance: '06-billet',
  sante: '13-croix-sante',
  // Soutien
  don: '12-soutien-main-coeur',
  partenaire: '23-soutien-quatre-bras-inclusif',
  ressources: '21-carton-ecru',
  ambassadeur: '10-drapeau',
};

/** Chemin de l'emoji d'une clé du tunnel (ballon par défaut). */
export const getEmoji = (key: string): string =>
  asset(`/assets/refonte/emojis/${MAP[key] ?? '19-ballon'}.png`);
