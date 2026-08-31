<?php
/**
 * GET /api/events-private.php : flux interne du calendrier (session requise :
 * admin ou responsable de section).
 * Même dépliage que le flux public, mais sans filtre de visibilité : chaque
 * événement porte en plus son champ `visibilite` ('public' ou 'prive').
 * Jamais de cache : la réponse dépend de la session (pnr_json pose no-store).
 */
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';
require __DIR__ . '/_events_common.php';

pnr_require_member();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    pnr_json(['ok' => false, 'error' => 'method'], 405);
}

pnr_json(pnr_build_events(pnr_db(), false));
