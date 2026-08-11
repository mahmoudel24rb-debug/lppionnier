<?php
/**
 * CRUD des événements ponctuels (session admin requise).
 *   GET                 → liste triée (date puis heure)
 *   POST {…}            → création → { ok, id }
 *   POST {bulk:[…]}     → import en masse (CSV parsé côté client) avec
 *                          dédoublonnage sur (section, titre, date, debut)
 *                          → rapport { inserted, duplicates, invalid[] }
 *   PUT ?id=… {…}       → mise à jour
 *   DELETE ?id=…        → suppression · DELETE ?all=1 → tout supprimer
 */
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

pnr_require_admin();
$db = pnr_db();
$method = $_SERVER['REQUEST_METHOD'] ?? '';
$id = trim((string)($_GET['id'] ?? ''));

if ($method === 'GET') {
    $rows = [];
    foreach ($db->query('SELECT * FROM single_events ORDER BY date, debut, rowid') as $e) {
        unset($e['updated_at']);
        $rows[] = $e;
    }
    pnr_json($rows);
}

if ($method === 'POST') {
    $body = pnr_body();

    // ── Import en masse ────────────────────────────────────────────────────
    if (isset($body['bulk']) && is_array($body['bulk'])) {
        $existing = [];
        foreach ($db->query('SELECT section, titre, date, debut FROM single_events') as $e) {
            $existing[$e['section'] . '|' . $e['titre'] . '|' . $e['date'] . '|' . $e['debut']] = true;
        }
        $inserted = 0;
        $duplicates = 0;
        $invalid = [];
        $st = $db->prepare('INSERT INTO single_events (id, section, titre, date, debut, fin, lieu, adresse, type, domicile, notes, arbitres)
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
        $db->beginTransaction();
        foreach ($body['bulk'] as $i => $in) {
            [$d, $err] = pnr_validate_single(is_array($in) ? $in : []);
            if ($err) {
                $invalid[] = ['ligne' => $i + 1, 'champs' => $err];
                continue;
            }
            $key = $d['section'] . '|' . $d['titre'] . '|' . $d['date'] . '|' . $d['debut'];
            if (isset($existing[$key])) {
                $duplicates++;
                continue;
            }
            $existing[$key] = true;
            $st->execute([pnr_uuid(), $d['section'], $d['titre'], $d['date'], $d['debut'], $d['fin'],
                          $d['lieu'], $d['adresse'], $d['type'], $d['domicile'], $d['notes'], $d['arbitres']]);
            $inserted++;
        }
        $db->commit();
        pnr_json(['ok' => true, 'inserted' => $inserted, 'duplicates' => $duplicates, 'invalid' => $invalid]);
    }

    // ── Création simple ────────────────────────────────────────────────────
    [$d, $err] = pnr_validate_single($body);
    if ($err) {
        pnr_json(['ok' => false, 'error' => 'invalid', 'fields' => $err], 422);
    }
    $newId = pnr_uuid();
    $db->prepare('INSERT INTO single_events (id, section, titre, date, debut, fin, lieu, adresse, type, domicile, notes, arbitres)
                  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
       ->execute([$newId, $d['section'], $d['titre'], $d['date'], $d['debut'], $d['fin'],
                  $d['lieu'], $d['adresse'], $d['type'], $d['domicile'], $d['notes'], $d['arbitres']]);
    pnr_json(['ok' => true, 'id' => $newId], 201);
}

if ($method === 'PUT') {
    if ($id === '') {
        pnr_json(['ok' => false, 'error' => 'id'], 400);
    }
    [$d, $err] = pnr_validate_single(pnr_body());
    if ($err) {
        pnr_json(['ok' => false, 'error' => 'invalid', 'fields' => $err], 422);
    }
    $st = $db->prepare("UPDATE single_events SET section=?, titre=?, date=?, debut=?, fin=?, lieu=?, adresse=?,
                        type=?, domicile=?, notes=?, arbitres=?, updated_at=datetime('now') WHERE id=?");
    $st->execute([$d['section'], $d['titre'], $d['date'], $d['debut'], $d['fin'], $d['lieu'], $d['adresse'],
                  $d['type'], $d['domicile'], $d['notes'], $d['arbitres'], $id]);
    pnr_json(['ok' => $st->rowCount() > 0], $st->rowCount() > 0 ? 200 : 404);
}

if ($method === 'DELETE') {
    if (($_GET['all'] ?? '') === '1') {
        $n = $db->exec('DELETE FROM single_events');
        pnr_json(['ok' => true, 'deleted' => $n]);
    }
    if ($id === '') {
        pnr_json(['ok' => false, 'error' => 'id'], 400);
    }
    $st = $db->prepare('DELETE FROM single_events WHERE id=?');
    $st->execute([$id]);
    pnr_json(['ok' => $st->rowCount() > 0], $st->rowCount() > 0 ? 200 : 404);
}

pnr_json(['ok' => false, 'error' => 'method'], 405);
