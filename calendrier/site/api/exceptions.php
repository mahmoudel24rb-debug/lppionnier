<?php
/**
 * Exceptions de récurrence : séance annulée ou reportée (session admin requise).
 *   GET ?recurrence_id=…                      → exceptions de la règle
 *   PUT {recurrence_id, original_date, kind, new_date?, new_debut?, new_fin?, new_lieu?}
 *       → pose/remplace l'exception (upsert)
 *   DELETE {recurrence_id, original_date}     → RÉTABLIT la séance d'origine
 */
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

pnr_require_admin();
$db = pnr_db();
$method = $_SERVER['REQUEST_METHOD'] ?? '';

if ($method === 'GET') {
    $rid = trim((string)($_GET['recurrence_id'] ?? ''));
    if ($rid === '') {
        pnr_json(['ok' => false, 'error' => 'recurrence_id'], 400);
    }
    $st = $db->prepare('SELECT recurrence_id, original_date, kind, new_date, new_debut, new_fin, new_lieu
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
$exists = $db->prepare('SELECT 1 FROM recurrences WHERE id=?');
$exists->execute([$rid]);
if (!$exists->fetchColumn()) {
    pnr_json(['ok' => false, 'error' => 'recurrence'], 404);
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
    $err = [];
    if (!in_array($kind, ['cancelled', 'moved'], true)) $err[] = 'kind';
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
    $db->prepare('INSERT INTO recurrence_exceptions (recurrence_id, original_date, kind, new_date, new_debut, new_fin, new_lieu)
                  VALUES (?,?,?,?,?,?,?)
                  ON CONFLICT(recurrence_id, original_date) DO UPDATE SET
                    kind=excluded.kind, new_date=excluded.new_date, new_debut=excluded.new_debut,
                    new_fin=excluded.new_fin, new_lieu=excluded.new_lieu, updated_at=datetime(\'now\')')
       ->execute([$rid, $orig, $kind,
                  $kind === 'moved' ? $nd : null,
                  $kind === 'moved' ? $ndeb : null,
                  $kind === 'moved' ? $nfin : null,
                  $kind === 'moved' ? $nlieu : null]);
    pnr_json(['ok' => true]);
}

pnr_json(['ok' => false, 'error' => 'method'], 405);
