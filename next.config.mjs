/** @type {import('next').NextConfig} */

// Deux cibles de build :
//  - démo GitHub Pages (défaut)      : servie sous /lppionnier
//  - prod o2switch (`npm run build:prod`) : servie à la racine de
//    recrutement.pionniersdetouraine.fr → NEXT_PUBLIC_BASE_PATH='/'
//    (sentinelle « racine » : une valeur VIDE ne serait pas inlinée par Next
//    dans les bundles client — voir src/lib/asset.ts, à garder aligné).
const rawBase = process.env.NEXT_PUBLIC_BASE_PATH ?? '/lppionnier';
const basePath = rawBase === '/' ? '' : rawBase;

const nextConfig = {
  output: 'export',
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Le template est généré par Framer (props CSS non standard comme cornerShape).
  // On n'impose pas le type-check/lint strict sur ce code machine.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
