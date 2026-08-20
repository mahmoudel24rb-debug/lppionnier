import type { MetadataRoute } from 'next';

/**
 * robots.txt généré au build, avec deux comportements selon la cible :
 *  - démo GitHub Pages (basePath non vide) : tout est interdit au crawl, en
 *    cohérence avec le noindex posé par metadata.robots dans src/app/layout.tsx
 *    (la démo ne doit jamais concurrencer la prod dans l'index) ;
 *  - prod o2switch (NEXT_PUBLIC_BASE_PATH='/') : crawl autorisé partout et
 *    déclaration du sitemap sur le domaine officiel.
 */
const IS_DEMO = (process.env.NEXT_PUBLIC_BASE_PATH ?? '/lppionnier') !== '/';

export default function robots(): MetadataRoute.Robots {
  if (IS_DEMO) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://recrutement.pionniersdetouraine.fr/sitemap.xml',
  };
}
