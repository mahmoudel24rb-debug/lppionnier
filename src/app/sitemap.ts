import type { MetadataRoute } from 'next';

/**
 * sitemap.xml généré au build. Aucune condition démo/prod ici : le fichier est
 * bien produit sur la démo GitHub Pages, mais celle-ci est noindex (layout) et
 * interdite au crawl (robots.ts), donc sans conséquence.
 *
 * Build déterministe : pas de `new Date()` ni de `Date.now()`, uniquement des
 * dates en dur. Toutes les URLs se terminent par « / » (trailingSlash activé
 * côté Next). Le blog a migré vers le site racine (08/2026) : il n'est plus
 * listé ici, les anciennes URL /blog/* sont redirigées en 301 (.htaccess).
 */
const SITE = 'https://recrutement.pionniersdetouraine.fr';

// Date de dernière refonte des pages statiques (à mettre à jour à la main).
const DATE_PAGES = '2026-08-21';

export default function sitemap(): MetadataRoute.Sitemap {
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
      url: `${SITE}/mentions-legales/`,
      lastModified: DATE_PAGES,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
