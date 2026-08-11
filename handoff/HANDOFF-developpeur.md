# Calendrier Pionniers de Touraine — Dossier d'intégration

Quatre pages web autonomes à intégrer au site du club : deux publiques (calendrier) et deux d'administration, en variantes ordinateur/tablette et téléphone.

## Fichiers livrés

| Fichier | Rôle | Public |
|---|---|---|
| `calendrier-desktop.dc.html` | Calendrier public — ordinateur & tablette | Joueurs & familles (lecture) |
| `calendrier-mobile.dc.html` | Calendrier public — téléphone | Joueurs & familles (lecture) |
| `admin-desktop.dc.html` | Saisie & gestion — ordinateur & tablette | Manager / bureau |
| `admin-mobile.dc.html` | Saisie & gestion — téléphone | Manager / bureau |
| `support.js` | Runtime commun, requis par les 4 pages | — |
| `emojis/` | Émojis personnalisés du club (PNG) | — |
| `fonts/` | Futura Extra Bold Condensed + Neuething Sans | — |
| `data/*.csv` | Jeux de données de départ (saison 2026-2027) | — |

Chaque page s'ouvre directement dans un navigateur. Aucune dépendance externe, aucun build, aucun npm. **Conserver l'arborescence telle quelle** : les pages chargent `support.js`, `emojis/` et `fonts/` en chemins relatifs.

---

## Choix de la variante mobile / desktop

Les deux variantes sont des pages distinctes (design réellement différent, pas juste du CSS responsive). Deux façons de router :

**Redirection côté serveur** (recommandé) — détection user-agent ou `sec-ch-ua-mobile`, puis service de la bonne page sur la même URL publique.

**Redirection côté client** — une page d'entrée qui teste la largeur :

```html
<script>
  var m = matchMedia('(max-width: 820px)').matches;
  location.replace(m ? 'calendrier-mobile.dc.html' : 'calendrier-desktop.dc.html');
</script>
```

Les liens internes sont déjà cohérents : le calendrier mobile pointe vers l'admin mobile, le desktop vers l'admin desktop, et chaque admin renvoie au calendrier de sa variante.

Intégration en iframe possible :

```html
<iframe src="calendrier-desktop.dc.html" style="width:100%;height:900px;border:0"></iframe>
```

---

## Comment les données circulent (état actuel)

Les événements sont stockés dans le **localStorage du navigateur** sous la clé `pionniers_events`.

- Les pages admin **écrivent** via 2 clés sources — `pionniers_recurrences` et `pionniers_single_events` — qu'elles déplient en `pionniers_events` (plus `pionniers_exceptions` pour les séances annulées/reportées).
- Les pages calendrier **lisent** `pionniers_events` en priorité.

⚠️ **Limite importante :** le localStorage est local à chaque navigateur et appareil. Ce que le manager saisit sur son ordinateur n'apparaît PAS sur le téléphone d'un joueur. Parfait pour une démo ou un usage mono-poste, insuffisant pour un vrai site multi-utilisateurs.

### Pour un déploiement partagé → 2 options

**Option A — Google Sheet (déjà supporté, rapide à mettre en place)**
Le calendrier sait lire une Google Sheet publiée en CSV.
- Chercher `sheetCsvUrl` dans la logique du calendrier et y mettre l'URL de publication CSV.
- Colonnes attendues : `section, titre, date, debut, fin, lieu, adresse, type, domicile, notes`
- `date` au format `YYYY-MM-DD`, heures `HH:MM`, `domicile` ∈ `oui` | `non` | vide
- Le manager gère la Sheet, le site la lit. Pas de backend à coder.

**Option B — API / base de données (le plus robuste)**
Remplacer la lecture localStorage par un `fetch()` vers une API renvoyant le même JSON. L'admin POST vers l'API au lieu d'écrire dans localStorage.

---

## Modèle de données (un événement)

```json
{
  "section": "footus",
  "titre": "Foot US – Journée 1",
  "date": "2027-01-31",
  "debut": "20:00",
  "fin": "22:30",
  "lieu": "Stade de la Chambrerie",
  "adresse": "Tours",
  "type": "Match",
  "domicile": "oui",
  "notes": "Journée de championnat"
}
```

### Récurrences

Un entraînement récurrent n'est PAS stocké comme 85 lignes, mais comme UNE règle :

```json
{
  "section": "flag",
  "titre": "Entr. Flag Senior",
  "days": [1, 4],
  "debut": "20:00", "fin": "22:30",
  "from": "2026-09-01", "to": "2027-06-30",
  "lieu": "Stade de la Chambrerie", "adresse": "Tours",
  "type": "Entraînement"
}
```

`days` : 0 = dimanche … 6 = samedi. Les exceptions (séance annulée ou reportée) vivent dans `pionniers_exceptions`. En passant à une API, il faut soit déplier les récurrences côté serveur, soit reproduire cette logique.

---

## Sécurité de la page Admin

⚠️ Le mot de passe (`pionniers` par défaut) est vérifié **côté client** — cela évite un accès accidentel, ce n'est pas une protection réelle. Pour un usage sérieux, placer les pages admin derrière une vraie authentification serveur (login du CMS, htaccess, ou auth de l'API).

---

## Sections & couleurs

| Section | Clé | Couleur |
|---|---|---|
| Foot US Senior | `footus` | `#c8383f` |
| Flag Senior | `flag` | `#FFAD00` |
| Foot US Junior | `footus_jr` | `#3B82C4` |
| Flag Junior | `flag_jr` | `#8B5CF6` |
| École de Flag | `ecole` | `#2B6E66` |
| Vie du club | `club` | `#9A6B4F` |

Fond de page `#eeeef0`, surfaces blanches, encre `#18181b`. Jaune de mise en avant `#FFAD00` pour les fonds/bordures et `#8a5c00` pour le jaune en texte (contraste). Typos : Futura Extra Bold Condensed (titres, `-4,5 %` d'interlettrage) et Neuething Sans Semi Expanded (texte).

---

## Fonctionnalités en place

**Calendrier** — 4 vues (Semaine, Mois, Agenda, Saison Juil→Juin navigable sur toutes les années) ; filtres par section (clic = isoler, Maj+clic = combiner) ; cartes « Prochain entraînement » et « Prochain match / tournoi » ; fiche événement avec ajout Google Agenda, `.ics` et lien partageable ; impression PDF en mode clair.

**Admin** — récurrences avec exceptions (annuler / reporter une séance), événements ponctuels, import et export CSV, suppression groupée, filtres par section.

**Mobile** — barre d'onglets basse, menu latéral, vue Semaine en liste verticale, vue Mois en pastilles, vue Saison sur 2 colonnes, zones tactiles ≥ 44px, zones sûres iPhone.

---

## Questions à trancher

1. Stockage partagé : Google Sheet (rapide) ou API/DB (robuste) ?
2. Authentification réelle des pages admin ?
3. Hébergement : sous-domaine, sous-dossier, ou iframe dans le site existant ?
4. Routage mobile/desktop : serveur ou client ?
