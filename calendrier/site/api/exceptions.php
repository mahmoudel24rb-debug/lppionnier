<?php
/**
 * Exceptions de récurrence : séance annulée, masquée ou reportée (session
 * requise : admin ou responsable de la section de la récurrence visée).
 *   GET ?recurrence_id=…                      → exceptions de la règle
 *   PUT {recurrence_id, original_date, kind, motif?, new_date?, new_debut?, new_fin?, new_lieu?}
 *       → pose/remplace l'exception (upsert)
 *       kind : 'cancelled' (affichée barrée, motif facultatif),
 *              'removed'   (retirée du calendrier),
 *              'moved'     (reportée)
 *   DELETE {recurrence_id, original_date}     → RÉTABLIT la séance d'origine
 */
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

pnr_require_member();
$db = pnr_db();
$method = $_SERVER['REQUEST_METHOD'] ?? '';

if ($method === 'GET') {
    $rid = trim((string)($_GET['recurrence_id'] ?? ''));
    if ($rid === '') {
        pnr_json(['ok' => false, 'error' => 'recurrence_id'], 400);
    }
    $st = $db->prepare('SELECT recurrence_id, original_date, kind, motif, new_date, new_debut, new_fin, new_lieu
                        FROM recurrence_exceptions WHERE recurrence_id=? ORDER BY original_date');
    $st->execute([$rid]);
    pnr_json($st->fetchAll(PDO::FETCH_ASSOC));
}

$body = pnr_body();
$rid = trim((string)($body['recurrence_id'] ?? ''));
$orig = trim((string)($body['original_date'] ?? ''));

if ($rid === '' || !pnr_is_date($orig)) {
    pnr_json(['ok' => false, 'error' => 'invalid', 'fields' => ['recurrence_id/original_date']], 422);
}
$exists = $db->prepare('SELECT section FROM recurrences WHERE id=?');
$exists->execute([$rid]);
$section = $exists->fetchColumn();
if ($section === false) {
    pnr_json(['ok' => false, 'error' => 'recurrence'], 404);
}
if (!pnr_can_edit_section((string)$section)) {
    pnr_json(['ok' => false, 'error' => 'forbidden'], 403);
}

if ($method === 'DELETE') {
    $st = $db->prepare('DELETE FROM recurrence_exceptions WHERE recurrence_id=? AND original_date=?');
    $st->execute([$rid, $orig]);
    pnr_json(['ok' => $st->rowCount() > 0], $st->rowCount() > 0 ? 200 : 404);
}

if ($method === 'PUT') {
    $kind = (string)($body['kind'] ?? '');
    $nd = trim((string)($body['new_date'] ?? ''));
    $ndeb = trim((string)($body['new_debut'] ?? ''));
    $nfin = trim((string)($body['new_fin'] ?? ''));
    $nlieu = pnr_clean((string)($body['new_lieu'] ?? ''));
    // le motif n'a de sens que pour une séance annulée mais affichée
    $motif = $kind === 'cancelled' ? pnr_clean((string)($body['motif'] ?? ''), 140) : '';
    $err = [];
    if (!in_array($kind, ['cancelled', 'moved', 'removed'], true)) $err[] = 'kind';
    if ($kind === 'moved') {
        if (!pnr_is_date($nd))              $err[] = 'new_date';
        if (!pnr_is_time_or_empty($ndeb))   $err[] = 'new_debut';
        if (!pnr_is_time_or_empty($nfin))   $err[] = 'new_fin';
        // « report » vers la même date sans aucun autre changement = non-sens
        if (!$err && $nd === $orig && $ndeb === '' && $nfin === '' && $nlieu === '') $err[] = 'report_identique';
    }
    if ($err) {
        pnr_json(['ok' => false, 'error' => 'invalid', 'fields' => $err], 422);
    }
    $db->prepare('INSERT INTO recurrence_exceptions (recurrence_id, original_date, kind, motif, new_date, new_debut, new_fin, new_lieu)
                  VALUES (?,?,?,?,?,?,?,?)
                  ON CONFLICT(recurrence_id, original_date) DO UPDATE SET
                    kind=excluded.kind, motif=excluded.motif, new_date=excluded.new_date,
                    new_debut=excluded.new_debut, new_fin=excluded.new_fin, new_lieu=excluded.new_lieu,
                    updated_at=datetime(\'now\')')
       ->execute([$rid, $orig, $kind, $motif,
                  $kind === 'moved' ? $nd : null,
                  $kind === 'moved' ? $ndeb : null,
                  $kind === 'moved' ? $nfin : null,
                  $kind === 'moved' ? $nlieu : null]);
    pnr_json(['ok' => true]);
}

pnr_json(['ok' => false, 'error' => 'method'], 405);
