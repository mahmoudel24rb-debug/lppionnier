import type { ComponentType } from 'react';
import ArticlePratiquer from '@/content/pratiquer-foot-us-france';
import ArticleFlag from '@/content/flag-football-cest-quoi';
import ArticleAdulte from '@/content/commencer-foot-us-adulte';

/**
 * Registre des articles du blog (FR uniquement — le SEO vise des requêtes
 * françaises). L'ordre du tableau = ordre d'affichage sur /blog/.
 * Le contenu de chaque article vit dans src/content/<slug>.tsx.
 */
export type ArticleMeta = {
  slug: string;
  /** H1 de l'article (et title SEO, tronqué si besoin via titleSeo) */
  titre: string;
  /** Variante courte pour le breadcrumb et les cartes */
  titreCourt: string;
  /** <title> exact (≤ 60 caractères de préférence) */
  titleSeo: string;
  /** Meta description (~150 caractères) */
  description: string;
  /** Clé d'emoji funnelIcons pour la carte d'archive */
  emoji: string;
  /** Dates ISO (affichées en français + datePublished/dateModified JSON-LD) */
  datePublication: string;
  dateModif: string;
  minutesLecture: number;
  motCle: string;
  content: ComponentType;
};

export const ARTICLES: ArticleMeta[] = [
  {
    slug: 'comment-pratiquer-le-football-americain-en-france',
    titre: 'Comment pratiquer le football américain en France : le guide complet pour débuter',
    titreCourt: 'Pratiquer le football américain en France',
    titleSeo: 'Pratiquer le football américain en France : guide débutant',
    description:
      'Âge, clubs, licence, équipement, premier entraînement : tout ce qu’il faut savoir pour débuter le football américain en France, expliqué par un club fondé en 1987.',
    emoji: 'foot-us',
    datePublication: '2026-08-20',
    dateModif: '2026-08-20',
    minutesLecture: 12,
    motCle: 'pratiquer le football américain en France',
    content: ArticlePratiquer,
  },
  {
    slug: 'flag-football-cest-quoi',
    titre: 'Le flag football, c’est quoi ? Règles, différences avec le foot US et JO 2028',
    titreCourt: 'Le flag football, c’est quoi ?',
    titleSeo: 'Le flag football, c’est quoi ? Règles et JO 2028',
    description:
      'Le flag football expliqué simplement : règles du 5 contre 5, différences avec le football américain, pourquoi il sera aux JO de Los Angeles 2028 et comment s’y mettre.',
    emoji: 'flag',
    datePublication: '2026-08-20',
    dateModif: '2026-08-20',
    minutesLecture: 11,
    motCle: 'flag football c’est quoi',
    content: ArticleFlag,
  },
  {
    slug: 'commencer-le-football-americain-adulte',
    titre: 'Commencer le football américain à l’âge adulte : est-ce trop tard ?',
    titreCourt: 'Commencer le foot US à l’âge adulte',
    titleSeo: 'Commencer le football américain adulte : trop tard ?',
    description:
      'Débuter le foot US à 25, 30 ou 35 ans ? Gabarit, condition physique, règles : on démonte les idées reçues et on explique comment se passe une première saison.',
    emoji: 'seniors',
    datePublication: '2026-08-20',
    dateModif: '2026-08-20',
    minutesLecture: 10,
    motCle: 'commencer le football américain adulte',
    content: ArticleAdulte,
  },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);

/** « 20 août 2026 » à partir d'une date ISO (sans dépendre de la locale runtime). */
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
export function dateFr(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MOIS[m - 1]} ${y}`;
}
