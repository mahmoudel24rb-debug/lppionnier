/**
 * Build de production o2switch : site servi à la racine de
 * recrutement.pionniersdetouraine.fr → basePath vide.
 * (Script Node plutôt que `VAR= next build` pour rester compatible Windows.)
 *
 * Post-traitement : les CSS (refonte.css, sections.css, immersive.css) codent
 * les polices et fonds en dur avec le préfixe /lppionnier/ — Next ne réécrit
 * pas les url() des feuilles de style. On les ramène à la racine ici.
 */
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const r = spawnSync('npx', ['next', 'build'], {
  stdio: 'inherit',
  shell: true,
  // '/' = sentinelle « racine » (une valeur vide ne serait pas inlinée par Next).
  env: { ...process.env, NEXT_PUBLIC_BASE_PATH: '/' },
});
if ((r.status ?? 1) !== 0) process.exit(r.status ?? 1);

const cssDir = join('out', '_next', 'static', 'css');
let retouches = 0;
for (const f of readdirSync(cssDir)) {
  if (!f.endsWith('.css')) continue;
  const chemin = join(cssDir, f);
  const avant = readFileSync(chemin, 'utf8');
  const apres = avant.replaceAll('/lppionnier/assets/', '/assets/');
  if (apres !== avant) {
    writeFileSync(chemin, apres);
    retouches++;
  }
}
console.log(`build:prod OK — ${retouches} fichier(s) CSS ramené(s) à la racine.`);
