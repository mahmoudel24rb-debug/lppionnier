<?php
/**
 * Lead magnet « Quel poste jouer ? » : Pionniers de Touraine.
 * Reçoit le lead du quiz (prénom + email + résultat) et l'envoie à
 * recrutement@pionniersdetouraine.fr via _mailer.php.
 *
 * NOTE : la démo GitHub Pages n'exécute pas PHP : le front affiche alors le
 * résultat sans capture d'email. Script prévu pour l'hébergement o2switch.
 */
declare(strict_types=1);

require __DIR__ . '/_mailer.php';

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method']);
    exit;
}

// Honeypot anti-spam : champ caché qu'un humain ne remplit jamais.
if (trim((string)($_POST['website'] ?? '')) !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

/**
 * Whitelists : les libellés viennent du serveur, jamais du client.
 * À RÉGÉNÉRER si les postes du quiz changent (src/data/quizPostes.ts).
 */
$postes = [
    'qb' => 'Quarterback',
    'rb' => 'Running Back',
    'wr' => 'Wide Receiver',
    'te' => 'Tight End',
    'ol' => 'Ligne Offensive',
    'dl' => 'Ligne Défensive',
    'lb' => 'Linebacker',
    'db' => 'Defensive Back',
    'flag-qb' => 'Quarterback (Flag)',
    'flag-rec' => 'Receveur (Flag)',
    'flag-def' => 'Défenseur (Flag)',
];
$disciplines = ['foot-us' => 'Foot US', 'flag' => 'Flag football'];
$ages = ['moins16' => 'Moins de 16 ans', '16-19' => '16 à 19 ans', '20plus' => '20 ans et plus'];

$prenom     = trim((string)($_POST['prenom'] ?? ''));
$email      = trim((string)($_POST['email'] ?? ''));
$poste      = trim((string)($_POST['poste'] ?? ''));
$discipline = trim((string)($_POST['discipline'] ?? ''));
$age        = trim((string)($_POST['age'] ?? ''));
$taille     = trim((string)($_POST['taille'] ?? ''));
$poids      = trim((string)($_POST['poids'] ?? ''));
$lang       = ($_POST['lang'] ?? 'fr') === 'en' ? 'en' : 'fr';

// Mensurations : entiers uniquement, bornées comme côté front (quizPostes.ts).
$tailleOk = ctype_digit($taille) && (int)$taille >= 120 && (int)$taille <= 220;
$poidsOk  = ctype_digit($poids) && (int)$poids >= 40 && (int)$poids <= 180;

if (
    $prenom === ''
    || filter_var($email, FILTER_VALIDATE_EMAIL) === false
    || !isset($postes[$poste])
    || !isset($disciplines[$discipline])
    || !isset($ages[$age])
    || !$tailleOk
    || !$poidsOk
) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid']);
    exit;
}

$prenom = mb_substr(pnr_sans_retour_ligne($prenom), 0, 80);
$email  = pnr_sans_retour_ligne($email);
$taille = (int)$taille;
$poids  = (int)$poids;

$sujet = "Lead quiz - {$postes[$poste]}";
$corps = "Nouveau lead depuis le quiz « Quel poste jouer ? »\n\n"
    . "Prénom : {$prenom}\n"
    . "Email : {$email}\n"
    . "Gabarit : {$taille} cm · {$poids} kg\n"
    . "Poste proposé : {$postes[$poste]}\n"
    . "Discipline : {$disciplines[$discipline]}\n"
    . "Tranche d'âge : {$ages[$age]}\n"
    . "Langue du site : {$lang}\n\n"
    . "Offre suggérée : semaine découverte "
    . ($discipline === 'flag' ? 'Flag' : 'Foot US') . ' · '
    . ($age === '20plus' ? 'Seniors' : 'Jeunes') . "\n";

$envoye = pnr_envoyer($sujet, $corps, $email);
if (!$envoye) {
    http_response_code(500);
}
echo json_encode(['ok' => $envoye]);
