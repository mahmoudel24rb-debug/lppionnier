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
// Aligné sur next.config.mjs : '/lppionnier' pour la démo GitHub Pages,
// '/' (sentinelle = racine) pour la prod o2switch (npm run build:prod).
// NB : la sentinelle n'est pas '' car Next n'inline pas une variable vide
// dans les bundles client (le repli '/lppionnier' se réactiverait en prod).
const raw = process.env.NEXT_PUBLIC_BASE_PATH ?? '/lppionnier';
export const BASE_PATH = raw === '/' ? '' : raw;

export const asset = (path: string) => `${BASE_PATH}${path}`;
