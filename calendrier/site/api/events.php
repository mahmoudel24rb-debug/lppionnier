<?php
/**
 * GET /api/events.php : flux public du calendrier.
 * Seuls les événements en visibilité « public » sont exposés ; le dépliage des
 * récurrences et des exceptions vit dans _events_common.php (partagé avec le
 * flux interne events-private.php).
 */
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';
require __DIR__ . '/_events_common.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    pnr_json(['ok' => false, 'error' => 'method'], 405);
}

$sorted = pnr_build_events(pnr_db(), true);

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
