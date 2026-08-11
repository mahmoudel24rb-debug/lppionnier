<?php
/**
 * Authentification de l'admin du calendrier.
 *   GET             → { ok, admin }              (état de session)
 *   POST {password} → connexion (rate-limit : 5 échecs / 15 min / IP)
 *   POST {action:"logout"} → déconnexion
 * Le hash du mot de passe vit dans config.php (PNR_ADMIN_HASH), jamais en clair.
 */
declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

pnr_session_start();
$method = $_SERVER['REQUEST_METHOD'] ?? '';

if ($method === 'GET') {
    pnr_json(['ok' => true, 'admin' => pnr_is_admin()]);
}
if ($method !== 'POST') {
    pnr_json(['ok' => false, 'error' => 'method'], 405);
}

$body = pnr_body();

if (($body['action'] ?? '') === 'logout') {
    $_SESSION = [];
    session_destroy();
    pnr_json(['ok' => true]);
}

if (!defined('PNR_ADMIN_HASH') || PNR_ADMIN_HASH === '') {
    pnr_json(['ok' => false, 'error' => 'config', 'message' => 'config.php absent : mot de passe admin non configuré.'], 500);
}

// ── Rate-limit par IP (fichier JSON dans le dossier de données) ────────────
$ip = $_SERVER['REMOTE_ADDR'] ?? '?';
$throttleFile = pnr_data_dir() . '/login-throttle.json';
$throttle = [];
if (is_file($throttleFile)) {
    $throttle = json_decode((string)file_get_contents($throttleFile), true) ?: [];
}
$now = time();
$fails = array_values(array_filter($throttle[$ip] ?? [], fn($t) => $t > $now - 900));
if (count($fails) >= 5) {
    pnr_json(['ok' => false, 'error' => 'throttled', 'message' => 'Trop de tentatives. Réessaie dans 15 minutes.'], 429);
}

$password = (string)($body['password'] ?? '');
if ($password !== '' && password_verify($password, PNR_ADMIN_HASH)) {
    unset($throttle[$ip]);
    file_put_contents($throttleFile, json_encode($throttle));
    session_regenerate_id(true);
    $_SESSION['pnr_admin'] = true;
    pnr_json(['ok' => true, 'admin' => true]);
}

$fails[] = $now;
$throttle[$ip] = $fails;
file_put_contents($throttleFile, json_encode($throttle));
usleep(400000); // freine aussi les rafales
pnr_json(['ok' => false, 'error' => 'password'], 401);
