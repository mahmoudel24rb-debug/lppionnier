# Pionniers de Touraine — Landing / Recrutement

Landing page (démo) pour la rubrique **« Nous rejoindre »** du club de
football américain **Pionniers de Touraine**.

> ⚠️ Démo de rendu : le formulaire d'engagement n'envoie aucune donnée.

## Stack

- **Next.js 14** (App Router, export statique `output: 'export'`)
- **react-icons** · **lucide-react** (CSS custom, pas de Tailwind dans les vues)
- Déploiement **GitHub Pages** (`/lppionnier`)

## Design

Charte issue de la maquette Figma du hero, appliquée à toute la page :

- Couleurs : crème `#fffaf0`, ambre `#ffad00` (CTA glossy), bordeaux `#6f2c30`,
  fond `#140708` + texture topographique (`fond-hero.webp`)
- Typos : **Futura Condensed** ExtraBold (titres, majuscules) / **Neuething** (corps)
- Fil conducteur : la page « descend le terrain » — marqueurs de yards
  10 → 50 entre les sections, jusqu'à l'en-but (CTA final)

## Structure

- `src/components/template/` — header, hero, tunnel immersif (+ `refonte.css`, `immersive.css`)
- `src/components/sections/` — sections après le hero : Club, Disciplines, PPP,
  Adhésions, Infos pratiques, En-but, Footer (+ `sections.css`)
- `src/data/funnel.ts` — **tout le contenu du tunnel** (branches, offres, missions),
  éditable sans toucher aux composants
- `src/data/formules.ts` — tarifs des adhésions (onglets Football US / Flag)
- `src/lib/asset.ts` — préfixe `basePath` GitHub Pages (aligné sur `next.config.mjs`)

## Le tunnel « Nous rejoindre »

Machine à états animée plein écran (`ImmersiveTunnel.tsx`), ouverte par tout
CTA `data-open-tunnel`, l'événement `open-tunnel` ou le hash `#rejoindre` :

```
Quelle aventure vous attire ?
 ├─ Performer ─► Football américain / Flag ─► Découvrir ou Rejoindre ─► fiches ─► formulaire
 ├─ M'investir ─► Temps / Expérience sportive / Compétences ─► missions ─► formulaire
 └─ Soutenir ──► Don / Partenariat / Ressources / Ambassadeur ─► fiches ─► formulaire
```

## Développement

```bash
npm install
npm run dev      # http://localhost:3000/lppionnier
npm run build    # génère le site statique dans ./out
```

Le `basePath` vaut `/lppionnier` en dev **et** en prod (chemins d'assets absolus).

## Déploiement

Push sur `main` → le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
build et publie sur GitHub Pages.

URL : https://mahmoudel24rb-debug.github.io/lppionnier/
