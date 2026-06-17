/** @type {import('next').NextConfig} */

// Sur GitHub Pages le site est servi sous /lppionnier.
const repo = 'lppionnier';

// Le template Framer code ses chemins d'assets en absolu (/lppionnier/assets/...),
// on fixe donc le basePath en permanence (dev + prod) pour rester cohérent.
const nextConfig = {
  output: 'export',
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
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
