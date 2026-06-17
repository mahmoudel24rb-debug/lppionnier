/** @type {import('next').NextConfig} */

// Sur GitHub Pages le site est servi sous /lppionnier.
// On désactive le basePath en dev pour garder localhost:3000 propre.
const isProd = process.env.NODE_ENV === 'production';
const repo = 'lppionnier';

const nextConfig = {
  output: 'export',
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
