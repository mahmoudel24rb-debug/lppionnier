<?php
/**
 * Dépliage partagé du calendrier (events.php public / events-private.php privé).
 * Portage fidèle du dépliage `_syncCalendar()` du handoff :
 *   récurrences dépliées jour par jour (bornes incluses, jours getDay 0=Dim),
 *   exceptions appliquées (annulée → occurrence conservée et marquée `cancelled`
 *   avec son motif ; masquée `removed` → omise ; reportée → nouvelle date/heure/
 *   lieu, marquée `moved` + `original_date`, libellé « (reporté) » côté client),
 *   occurrences normales : domicile 'oui', notes '' (comportement d'origine),
 *   puis événements ponctuels tels quels, tri stable par date seule.
 * Chaque événement porte un id stable : rec:{uuid}:{date} ou ev:{uuid}.
 * Ce fichier n'est jamais appelé directement (préfixe `_`, bloqué en .htaccess).
 */
declare(strict_types=1);

/**
 * @param bool $publicOnly true : flux public (visibilite='public' seulement)
 *                         false : flux interne (tout, avec le champ visibilite)
 * @return array liste d'événements triée par date
 */
function pnr_build_events(PDO $db, bool $publicOnly): array
{
    $all = [];

    // ── Phase 1 : récurrences ──────────────────────────────────────────────
    $exceptions = [];
    foreach ($db->query('SELECT * FROM recurrence_exceptions') as $x) {
        $exceptions[$x['recurrence_id'] . '_' . $x['original_date']] = $x;
    }

    $sqlRec = 'SELECT * FROM recurrences' . ($publicOnly ? " WHERE visibilite = 'public'" : '');
    foreach ($db->query($sqlRec) as $r) {
        $days = array_map('intval', json_decode($r['days'], true) ?: []);
        if (!$days) {
            continue;
        }
        $d   = new DateTimeImmutable($r['from_date']);
        $end = new DateTimeImmutable($r['to_date']);
        $guard = 0;
        while ($d <= $end && $guard < 800) {
            // getDay() JS : 0 = dimanche … 6 = samedi ('w' PHP est identique)
            if (in_array((int)$d->format('w'), $days, true)) {
                $guard++;
                $iso = $d->format('Y-m-d');
                $ex  = $exceptions[$r['id'] . '_' . $iso] ?? null;
                $kind = $ex ? (string)$ex['kind'] : '';
                $ev = null;
                if ($kind === 'removed') {
                    // occurrence supprimée de l'affichage
                } elseif ($kind === 'moved') {
                    $ev = [
                        'id' => 'rec:' . $r['id'] . ':' . $iso,
                        'section' => $r['section'], 'titre' => $r['titre'],
                        'date'  => $ex['new_date'],
                        'debut' => ($ex['new_debut'] !== null && $ex['new_debut'] !== '') ? $ex['new_debut'] : $r['debut'],
                        'fin'   => ($ex['new_fin']   !== null && $ex['new_fin']   !== '') ? $ex['new_fin']   : $r['fin'],
                        'lieu'  => ($ex['new_lieu']  !== null && $ex['new_lieu']  !== '') ? $ex['new_lieu']  : $r['lieu'],
                        'adresse' => $r['adresse'], 'type' => $r['type'],
                        'domicile' => 'oui', 'notes' => '', 'arbitres' => '',
                        'moved' => true, 'original_date' => $iso,
                    ];
                } else {
                    $ev = [
                        'id' => 'rec:' . $r['id'] . ':' . $iso,
                        'section' => $r['section'], 'titre' => $r['titre'],
                        'date' => $iso, 'debut' => $r['debut'], 'fin' => $r['fin'],
                        'lieu' => $r['lieu'], 'adresse' => $r['adresse'], 'type' => $r['type'],
                        'domicile' => 'oui', 'notes' => '', 'arbitres' => '',
                    ];
                    if ($kind === 'cancelled') {
                        // séance annulée : affichée grisée, avec son motif
                        $ev['cancelled'] = true;
                        $ev['motif'] = (string)($ex['motif'] ?? '');
                    }
                }
                if ($ev !== null) {
                    if (!$publicOnly) {
                        $ev['visibilite'] = $r['visibilite'];
                    }
                    $all[] = $ev;
                }
            }
            $d = $d->modify('+1 day');
        }
    }

    // ── Phase 2 : ponctuels ────────────────────────────────────────────────
    $sqlEv = 'SELECT * FROM single_events' . ($publicOnly ? " WHERE visibilite = 'public'" : '');
    foreach ($db->query($sqlEv) as $e) {
        $ev = [
            'id' => 'ev:' . $e['id'],
            'section' => $e['section'], 'titre' => $e['titre'],
            'date' => $e['date'], 'debut' => $e['debut'], 'fin' => $e['fin'],
            'lieu' => $e['lieu'], 'adresse' => $e['adresse'], 'type' => $e['type'],
            'domicile' => $e['domicile'], 'notes' => $e['notes'], 'arbitres' => $e['arbitres'],
        ];
        if (!$publicOnly) {
            $ev['visibilite'] = $e['visibilite'];
        }
        $all[] = $ev;
    }

    // ── Phase 3 : tri stable par date seule (identique à l'original) ───────
    $order = array_keys($all);
    usort($order, function ($a, $b) use ($all) {
        return [$all[$a]['date'], $a] <=> [$all[$b]['date'], $b];
    });
    return array_map(fn($i) => $all[$i], $order);
}
