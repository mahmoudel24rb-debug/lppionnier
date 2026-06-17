/**
 * Préfixe les chemins d'assets avec le basePath GitHub Pages.
 *
 * En export statique, next/image n'ajoute PAS le basePath aux images
 * (avec images.unoptimized). On le fait donc manuellement ici pour que
 * les images se chargent aussi bien en local (basePath vide) que sur
 * https://mahmoudel24rb-debug.github.io/lppionnier/.
 *
 * Doit rester aligné avec `basePath` dans next.config.mjs.
 */
export const BASE_PATH =
  process.env.NODE_ENV === 'production' ? '/lppionnier' : '';

export const asset = (path: string) => `${BASE_PATH}${path}`;
