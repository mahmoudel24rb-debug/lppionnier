<?php
/**
 * CRUD des récurrences (session requise : admin ou responsable de section, qui
 * ne peut agir que sur sa propre section).
 *   GET               → liste (avec le nombre d'exceptions par récurrence)
 *   POST {…}          → création  → { ok, id }
 *   PUT ?id=…  {…}    → mise à jour complète (section et type inclus)
 *   DELETE ?id=…      → suppression (exceptions purgées en cascade)
 */
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

pnr_require_member();
$db = pnr_db();
$method = $_SERVER['REQUEST_METHOD'] ?? '';
$id = trim((string)($_GET['id'] ?? ''));

/** Section de la récurrence, ou null si elle n'existe pas. */
function pnr_recurrence_section(PDO $db, string $id): ?string
{
    $st = $db->prepare('SELECT section FROM recurrences WHERE id=?');
    $st->execute([$id]);
    $s = $st->fetchColumn();
    return $s === false ? null : (string)$s;
}

if ($method === 'GET') {
    $rows = [];
    $q = $db->query('SELECT r.*, (SELECT COUNT(*) FROM recurrence_exceptions x WHERE x.recurrence_id = r.id) AS nb_exceptions
                     FROM recurrences r ORDER BY r.rowid');
    foreach ($q as $r) {
        $rows[] = [
            'id' => $r['id'], 'section' => $r['section'], 'titre' => $r['titre'],
            'days' => array_map('intval', json_decode($r['days'], true) ?: []),
            'debut' => $r['debut'], 'fin' => $r['fin'],
            'from' => $r['from_date'], 'to' => $r['to_date'],
            'lieu' => $r['lieu'], 'adresse' => $r['adresse'], 'type' => $r['type'],
            'visibilite' => $r['visibilite'],
            'nb_exceptions' => (int)$r['nb_exceptions'],
        ];
    }
    pnr_json($rows);
}

if ($method === 'POST' || $method === 'PUT') {
    [$d, $err] = pnr_validate_recurrence(pnr_body());
    if ($err) {
        pnr_json(['ok' => false, 'error' => 'invalid', 'fields' => $err], 422);
    }
    if ($method === 'POST') {
        if (!pnr_can_edit_section($d['section'])) {
            pnr_json(['ok' => false, 'error' => 'forbidden'], 403);
        }
        $d['id'] = pnr_uuid();
        $db->prepare('INSERT INTO recurrences (id, section, titre, days, debut, fin, from_date, to_date, lieu, adresse, type, visibilite)
                      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
           ->execute([$d['id'], $d['section'], $d['titre'], json_encode($d['days']), $d['debut'], $d['fin'],
                      $d['from_date'], $d['to_date'], $d['lieu'], $d['adresse'], $d['type'], $d['visibilite']]);
        pnr_json(['ok' => true, 'id' => $d['id']], 201);
    }
    if ($id === '') {
        pnr_json(['ok' => false, 'error' => 'id'], 400);
    }
    $section = pnr_recurrence_section($db, $id);
    if ($section === null) {
        pnr_json(['ok' => false], 404);
    }
    // droit sur la ligne existante ET sur la section demandée (pas de réassignation)
    if (!pnr_can_edit_section($section) || !pnr_can_edit_section($d['section'])) {
        pnr_json(['ok' => false, 'error' => 'forbidden'], 403);
    }
    $st = $db->prepare("UPDATE recurrences SET section=?, titre=?, days=?, debut=?, fin=?, from_date=?, to_date=?,
                        lieu=?, adresse=?, type=?, visibilite=?, updated_at=datetime('now') WHERE id=?");
    $st->execute([$d['section'], $d['titre'], json_encode($d['days']), $d['debut'], $d['fin'],
                  $d['from_date'], $d['to_date'], $d['lieu'], $d['adresse'], $d['type'], $d['visibilite'], $id]);
    pnr_json(['ok' => $st->rowCount() > 0], $st->rowCount() > 0 ? 200 : 404);
}

if ($method === 'DELETE') {
    if ($id === '') {
        pnr_json(['ok' => false, 'error' => 'id'], 400);
    }
    $section = pnr_recurrence_section($db, $id);
    if ($section === null) {
        pnr_json(['ok' => false], 404);
    }
    if (!pnr_can_edit_section($section)) {
        pnr_json(['ok' => false, 'error' => 'forbidden'], 403);
    }
    $st = $db->prepare('DELETE FROM recurrences WHERE id=?');
    $st->execute([$id]);
    pnr_json(['ok' => $st->rowCount() > 0], $st->rowCount() > 0 ? 200 : 404);
}

pnr_json(['ok' => false, 'error' => 'method'], 405);
