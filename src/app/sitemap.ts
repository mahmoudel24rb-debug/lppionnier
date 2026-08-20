import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/data/blog';

/**
 * sitemap.xml généré au build. Aucune condition démo/prod ici : le fichier est
 * bien produit sur la démo GitHub Pages, mais celle-ci est noindex (layout) et
 * interdite au crawl (robots.ts), donc sans conséquence.
 *
 * Build déterministe : pas de `new Date()` ni de `Date.now()`, uniquement des
 * dates en dur ou issues des `dateModif` du registre d'articles.
 * Toutes les URLs se terminent par « / » (trailingSlash activé côté Next).
 */
const SITE = 'https://recrutement.pionniersdetouraine.fr';

// Date de dernière refonte des pages statiques (à mettre à jour à la main).
const DATE_PAGES = '2026-08-21';

export default function sitemap(): MetadataRoute.Sitemap {
  // lastModified de l'archive = la plus récente des mises à jour d'articles.
  // Les dates sont au format ISO 'AAAA-MM-JJ', donc l'ordre lexicographique
  // suffit à les comparer (pas besoin d'instancier un Date).
  const dernierArticle = ARTICLES.reduce(
    (max, article) => (article.dateModif > max ? article.dateModif : max),
    ARTICLES[0]?.dateModif ?? DATE_PAGES,
  );

  return [
    {
      url: `${SITE}/`,
      lastModified: DATE_PAGES,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE}/quel-poste-football-americain/`,
      lastModified: DATE_PAGES,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE}/blog/`,
      lastModified: dernierArticle,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...ARTICLES.map((article) => ({
      url: `${SITE}/blog/${article.slug}/`,
      lastModified: article.dateModif,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${SITE}/mentions-legales/`,
      lastModified: DATE_PAGES,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
