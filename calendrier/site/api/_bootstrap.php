<?php
/**
 * Socle commun de l'API du calendrier Pionniers.
 * - SQLite (PDO) : base créée au premier appel, stockée HORS racine web
 *   (../../calendrier-data par rapport à ce fichier → /home/<user>/calendrier-data
 *   en production, calendrier/calendrier-data en local).
 * - Session d'administration (cookie HttpOnly, SameSite=Lax, Secure en HTTPS).
 * - Helpers JSON + validations partagées.
 */
declare(strict_types=1);

const PNR_SECTIONS = ['footus', 'flag', 'footus_jr', 'flag_jr', 'ecole', 'club'];
const PNR_MAX_RECURRENCE_DAYS = 731; // amplitude max d'une récurrence : 2 ans

// ── Config (hash du mot de passe admin) ─────────────────────────────────────
// config.php définit PNR_ADMIN_HASH (password_hash). Voir config.php.example.
$configFile = __DIR__ . '/config.php';
if (is_file($configFile)) {
    require $configFile;
}

// ── Session ────────────────────────────────────────────────────────────────
function pnr_session_start(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_name('pnr_cal');
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'httponly' => true,
        'secure'   => (($_SERVER['HTTPS'] ?? '') !== ''),
        'samesite' => 'Lax',
    ]);
    session_start();
}

function pnr_is_admin(): bool
{
    pnr_session_start();
    return ($_SESSION['pnr_admin'] ?? false) === true;
}

function pnr_require_admin(): void
{
    if (!pnr_is_admin()) {
        pnr_json(['ok' => false, 'error' => 'auth'], 401);
    }
}

// ── Base ───────────────────────────────────────────────────────────────────
function pnr_data_dir(): string
{
    $dir = dirname(__DIR__, 2) . '/calendrier-data';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
        // ceinture + bretelles : même si le dossier finissait sous la racine web
        file_put_contents($dir . '/.htaccess', "Require all denied\n");
    }
    return $dir;
}

function pnr_db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $pdo = new PDO('sqlite:' . pnr_data_dir() . '/pionniers.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('PRAGMA foreign_keys = ON');
    $pdo->exec('PRAGMA journal_mode = WAL');
    $pdo->exec("CREATE TABLE IF NOT EXISTS recurrences (
        id TEXT PRIMARY KEY, section TEXT NOT NULL, titre TEXT NOT NULL,
        days TEXT NOT NULL, debut TEXT NOT NULL DEFAULT '', fin TEXT NOT NULL DEFAULT '',
        from_date TEXT NOT NULL, to_date TEXT NOT NULL,
        lieu TEXT NOT NULL DEFAULT '', adresse TEXT NOT NULL DEFAULT '',
        type TEXT NOT NULL DEFAULT 'Entraînement',
        updated_at TEXT NOT NULL DEFAULT (datetime('now')))");
    $pdo->exec("CREATE TABLE IF NOT EXISTS single_events (
        id TEXT PRIMARY KEY, section TEXT NOT NULL, titre TEXT NOT NULL,
        date TEXT NOT NULL, debut TEXT NOT NULL DEFAULT '', fin TEXT NOT NULL DEFAULT '',
        lieu TEXT NOT NULL DEFAULT '', adresse TEXT NOT NULL DEFAULT '',
        type TEXT NOT NULL DEFAULT '', domicile TEXT NOT NULL DEFAULT '',
        notes TEXT NOT NULL DEFAULT '', arbitres TEXT NOT NULL DEFAULT '',
        updated_at TEXT NOT NULL DEFAULT (datetime('now')))");
    $pdo->exec("CREATE TABLE IF NOT EXISTS recurrence_exceptions (
        recurrence_id TEXT NOT NULL REFERENCES recurrences(id) ON DELETE CASCADE,
        original_date TEXT NOT NULL,
        kind TEXT NOT NULL CHECK (kind IN ('cancelled','moved')),
        new_date TEXT, new_debut TEXT, new_fin TEXT, new_lieu TEXT,
        updated_at TEXT NOT NULL DEFAULT (datetime('now')),
        PRIMARY KEY (recurrence_id, original_date))");
    return $pdo;
}

// ── Helpers ────────────────────────────────────────────────────────────────
function pnr_json($data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function pnr_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '', true);
    return is_array($data) ? $data : [];
}

function pnr_uuid(): string
{
    $b = random_bytes(16);
    $b[6] = chr((ord($b[6]) & 0x0f) | 0x40);
    $b[8] = chr((ord($b[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($b), 4));
}

// ── Validations ────────────────────────────────────────────────────────────
function pnr_is_date(?string $v): bool
{
    if (!is_string($v) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $v)) {
        return false;
    }
    [$y, $m, $d] = array_map('intval', explode('-', $v));
    return checkdate($m, $d, $y);
}

function pnr_is_time_or_empty(?string $v): bool
{
    return $v === '' || $v === null || (is_string($v) && preg_match('/^([01]\d|2[0-3]):[0-5]\d$/', $v));
}

function pnr_clean(string $v, int $max = 300): string
{
    return mb_substr(trim(str_replace(["\r", "\n"], ' ', $v)), 0, $max);
}

/** Valide + normalise un événement ponctuel. Retourne [data, erreurs]. */
function pnr_validate_single(array $in): array
{
    $err = [];
    $d = [
        'section'  => trim((string)($in['section'] ?? '')),
        'titre'    => pnr_clean((string)($in['titre'] ?? ''), 200),
        'date'     => trim((string)($in['date'] ?? '')),
        'debut'    => trim((string)($in['debut'] ?? '')),
        'fin'      => trim((string)($in['fin'] ?? '')),
        'lieu'     => pnr_clean((string)($in['lieu'] ?? '')),
        'adresse'  => pnr_clean((string)($in['adresse'] ?? '')),
        'type'     => pnr_clean((string)($in['type'] ?? ''), 80),
        'domicile' => strtolower(trim((string)($in['domicile'] ?? ''))),
        'notes'    => mb_substr(trim((string)($in['notes'] ?? '')), 0, 2000),
        'arbitres' => pnr_clean((string)($in['arbitres'] ?? '')),
    ];
    if (!in_array($d['section'], PNR_SECTIONS, true)) $err[] = 'section';
    if ($d['titre'] === '')                            $err[] = 'titre';
    if (!pnr_is_date($d['date']))                      $err[] = 'date';
    if (!pnr_is_time_or_empty($d['debut']))            $err[] = 'debut';
    if (!pnr_is_time_or_empty($d['fin']))              $err[] = 'fin';
    if ($d['debut'] !== '' && $d['fin'] !== '' && $d['fin'] <= $d['debut']) $err[] = 'fin<=debut';
    if (!in_array($d['domicile'], ['', 'oui', 'non'], true)) $err[] = 'domicile';
    return [$d, $err];
}

/** Valide + normalise une récurrence. Retourne [data, erreurs]. */
function pnr_validate_recurrence(array $in): array
{
    $err = [];
    $days = $in['days'] ?? [];
    if (!is_array($days)) $days = [];
    $days = array_values(array_unique(array_map('intval', $days)));
    sort($days);
    $d = [
        'section'   => trim((string)($in['section'] ?? '')),
        'titre'     => pnr_clean((string)($in['titre'] ?? ''), 200),
        'days'      => $days,
        'debut'     => trim((string)($in['debut'] ?? '')),
        'fin'       => trim((string)($in['fin'] ?? '')),
        'from_date' => trim((string)($in['from'] ?? $in['from_date'] ?? '')),
        'to_date'   => trim((string)($in['to'] ?? $in['to_date'] ?? '')),
        'lieu'      => pnr_clean((string)($in['lieu'] ?? '')),
        'adresse'   => pnr_clean((string)($in['adresse'] ?? '')),
        'type'      => pnr_clean((string)($in['type'] ?? 'Entraînement'), 80),
    ];
    if (!in_array($d['section'], PNR_SECTIONS, true)) $err[] = 'section';
    if ($d['titre'] === '')                            $err[] = 'titre';
    if (!$days || array_diff($days, [0,1,2,3,4,5,6])) $err[] = 'days';
    if (!pnr_is_time_or_empty($d['debut']))            $err[] = 'debut';
    if (!pnr_is_time_or_empty($d['fin']))              $err[] = 'fin';
    if ($d['debut'] !== '' && $d['fin'] !== '' && $d['fin'] <= $d['debut']) $err[] = 'fin<=debut';
    if (!pnr_is_date($d['from_date']))                 $err[] = 'from';
    if (!pnr_is_date($d['to_date']))                   $err[] = 'to';
    if (!$err) {
        if ($d['from_date'] > $d['to_date']) {
            $err[] = 'from>to';
        } else {
            $span = (new DateTimeImmutable($d['to_date']))->diff(new DateTimeImmutable($d['from_date']))->days;
            if ($span > PNR_MAX_RECURRENCE_DAYS) $err[] = 'amplitude>2ans';
        }
    }
    return [$d, $err];
}
