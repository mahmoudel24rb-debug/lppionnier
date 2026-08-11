<?php
/**
 * GET /api/events.php — flux public du calendrier.
 * Portage fidèle du dépliage `_syncCalendar()` du handoff :
 *   récurrences dépliées jour par jour (bornes incluses, jours getDay 0=Dim),
 *   exceptions appliquées (annulée → omise ; reportée → nouvelle date/heure/lieu,
 *   marquée `moved` + `original_date`, libellé « (reporté) » généré côté client),
 *   occurrences normales : domicile 'oui', notes '' (comportement d'origine),
 *   puis événements ponctuels tels quels, tri stable par date seule.
 * Chaque événement porte un id stable : rec:{uuid}:{date} ou ev:{uuid}.
 */
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    pnr_json(['ok' => false, 'error' => 'method'], 405);
}

$db = pnr_db();
$all = [];

// ── Phase 1 : récurrences ──────────────────────────────────────────────────
$exceptions = [];
foreach ($db->query('SELECT * FROM recurrence_exceptions') as $x) {
    $exceptions[$x['recurrence_id'] . '_' . $x['original_date']] = $x;
}

foreach ($db->query('SELECT * FROM recurrences') as $r) {
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
            if ($ex && $ex['kind'] === 'cancelled') {
                // occurrence supprimée
            } elseif ($ex && $ex['kind'] === 'moved') {
                $all[] = [
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
                $all[] = [
                    'id' => 'rec:' . $r['id'] . ':' . $iso,
                    'section' => $r['section'], 'titre' => $r['titre'],
                    'date' => $iso, 'debut' => $r['debut'], 'fin' => $r['fin'],
                    'lieu' => $r['lieu'], 'adresse' => $r['adresse'], 'type' => $r['type'],
                    'domicile' => 'oui', 'notes' => '', 'arbitres' => '',
                ];
            }
        }
        $d = $d->modify('+1 day');
    }
}

// ── Phase 2 : ponctuels ────────────────────────────────────────────────────
foreach ($db->query('SELECT * FROM single_events') as $e) {
    $all[] = [
        'id' => 'ev:' . $e['id'],
        'section' => $e['section'], 'titre' => $e['titre'],
        'date' => $e['date'], 'debut' => $e['debut'], 'fin' => $e['fin'],
        'lieu' => $e['lieu'], 'adresse' => $e['adresse'], 'type' => $e['type'],
        'domicile' => $e['domicile'], 'notes' => $e['notes'], 'arbitres' => $e['arbitres'],
    ];
}

// ── Phase 3 : tri stable par date seule (identique à l'original) ───────────
$order = array_keys($all);
usort($order, function ($a, $b) use ($all) {
    return [$all[$a]['date'], $a] <=> [$all[$b]['date'], $b];
});
$sorted = array_map(fn($i) => $all[$i], $order);

// ── Cache HTTP (ETag) ──────────────────────────────────────────────────────
$payload = json_encode($sorted, JSON_UNESCAPED_UNICODE);
$etag = '"' . md5($payload) . '"';
header('ETag: ' . $etag);
header('Cache-Control: no-cache');
if (($_SERVER['HTTP_IF_NONE_MATCH'] ?? '') === $etag) {
    http_response_code(304);
    exit;
}
header('Content-Type: application/json; charset=utf-8');
echo $payload;
