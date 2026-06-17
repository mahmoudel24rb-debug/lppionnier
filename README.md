# Pionniers de Touraine — Landing / Recrutement

Maquette de présentation (démo) pour la rubrique **« Nous rejoindre »** du club de
football américain **Pionniers de Touraine**.

> ⚠️ Démo de rendu : le formulaire d'engagement n'envoie aucune donnée.

## Stack

- **Next.js 14** (App Router, export statique `output: 'export'`)
- **Tailwind CSS** · **Framer Motion** · **lucide-react**
- Déploiement **GitHub Pages** (`/lppionnier`)

## Développement

```bash
npm install
npm run dev      # http://localhost:3000
```

En dev le `basePath` est désactivé ; en build (production) il vaut `/lppionnier`
pour correspondre à l'URL GitHub Pages.

```bash
npm run build    # génère le site statique dans ./out
```

## Le tunnel « Nous rejoindre »

Machine à états animée (une seule page), définie dans
[`src/components/JoinFunnel/`](src/components/JoinFunnel/) :

```
Tu souhaites ?
 ├─ Pratiquer ─► Football américain / Flag football ─► annonces par équipe ─► S'engager ─► formulaire
 └─ Aider ─────► Coacher / Arbitrer / Gérer / Créer  ─► missions             ─► S'engager ─► formulaire
```

**Tout le contenu éditable** (branches, équipes, postes, missions) est centralisé
dans [`src/data/funnel.ts`](src/data/funnel.ts) — modifiable sans toucher au code.

## Déploiement

Push sur `main` → le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
build et publie sur GitHub Pages.

À activer une fois côté dépôt : **Settings → Pages → Source : GitHub Actions**.

URL : https://mahmoudel24rb-debug.github.io/lppionnier/

## Assets

`public/assets/` : `logo-club.png`, `logo-ppp.png`, `hero.jpg`.
