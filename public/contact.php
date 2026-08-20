<?php
/**
 * Formulaire de contact : Pionniers de Touraine.
 * Envoie les messages à recrutement@pionniersdetouraine.fr.
 *
 * NOTE : la démo GitHub Pages n'exécute pas PHP : ce script est prévu pour
 * l'hébergement final (o2switch). Côté front, ContactForm bascule sur un
 * repli mailto si le POST échoue.
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

$objetsAutorises = [
    'Recrutement - Je veux jouer au Foot US',
    'Recrutement - Je veux jouer au Flag Football',
    'Recrutement - Je veux aider le club',
];

$objet   = trim((string)($_POST['objet'] ?? ''));
$nom     = trim((string)($_POST['nom'] ?? ''));
$email   = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if (
    !in_array($objet, $objetsAutorises, true)
    || $nom === '' || $message === ''
    || filter_var($email, FILTER_VALIDATE_EMAIL) === false
) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid']);
    exit;
}

$nom     = mb_substr(pnr_sans_retour_ligne($nom), 0, 120);
$email   = pnr_sans_retour_ligne($email);
$message = mb_substr($message, 0, 5000);

$corps = "Nouveau message depuis le site de recrutement\n\n"
    . "Objet : {$objet}\n"
    . "Nom : {$nom}\n"
    . "Email : {$email}\n\n"
    . "Message :\n{$message}\n";

$envoye = pnr_envoyer($objet, $corps, $email);
if (!$envoye) {
    http_response_code(500);
}
echo json_encode(['ok' => $envoye]);
