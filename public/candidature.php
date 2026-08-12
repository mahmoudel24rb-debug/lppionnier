<?php
/**
 * Formulaire de candidature du tunnel immersif — Pionniers de Touraine.
 * Reçoit les candidatures (offres du tunnel + candidature spontanée) et les
 * envoie à recrutement@pionniersdetouraine.fr via _mailer.php.
 *
 * NOTE : la démo GitHub Pages n'exécute pas PHP — le front bascule alors sur
 * un repli mailto. Ce script est prévu pour l'hébergement final (o2switch).
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
 * Whitelist des offres : id => titre FR (le titre vient du serveur, jamais du
 * client). Générée depuis getAllOffers() de src/data/funnel.ts + la candidature
 * spontanée — À RÉGÉNÉRER si les offres du tunnel changent.
 */
$offres = [
    'fa-dec-jeunes-o' => 'Semaine découverte · Jeunes (Foot US)',
    'fa-dec-seniors-o' => 'Semaine découverte · Seniors (Foot US)',
    'fa-rej-jeunes-o' => 'École de Football Américain · Jeunes',
    'fa-rej-seniors-o' => 'Équipe Senior · Football Américain',
    'flag-dec-jeunes-o' => 'Semaine découverte · Jeunes (Flag)',
    'flag-dec-seniors-o' => 'Semaine découverte · Seniors (Flag)',
    'flag-rej-jeunes-o' => 'Section Jeune · Flag Football',
    'flag-rej-seniors-o' => 'Équipe Senior · Flag Football',
    'org-events' => 'Équipe Organisation & Événements',
    'materiel-logistique' => 'Équipe Matériel & Logistique',
    'coach' => 'Coach',
    'assistant-coach' => 'Assistant Coach',
    'prepa-physique' => 'Préparateur Physique',
    'arbitre' => 'Arbitre',
    'graphiste' => 'Graphiste',
    'photographe' => 'Photographe',
    'cm' => 'Community Manager',
    'videaste' => 'Vidéaste / Monteur',
    'web' => 'Référent Digital & Web',
    'merch' => 'Responsable Merchandising & Identité de Marque',
    'gestion' => 'Équipe Gestion & Administration',
    'partenariats-prives' => 'Équipe Partenariats Privés',
    'territoire' => 'Équipe Territoire & Éducation',
    'pilotage-financier' => 'Équipe Pilotage Financier',
    'sante-partenaire' => 'Partenaire Santé & Performance',
    'sante-secours' => 'Équipe Secours & Accompagnement Athlètes',
    'don-o' => 'Faire un don au club',
    'partenaire-o' => 'Devenir partenaire du club',
    'ressources-o' => 'Apporter des ressources au club',
    'ambassadeur-o' => 'Devenir ambassadeur du club',
    'spontane' => 'Candidature spontanée',
];

$prenom    = trim((string)($_POST['prenom'] ?? ''));
$nom       = trim((string)($_POST['nom'] ?? ''));
$email     = trim((string)($_POST['email'] ?? ''));
$telephone = trim((string)($_POST['telephone'] ?? ''));
$annee     = trim((string)($_POST['annee_naissance'] ?? ''));
$connu     = trim((string)($_POST['connu'] ?? ''));
$message   = trim((string)($_POST['message'] ?? ''));
$offreId   = trim((string)($_POST['offre_id'] ?? ''));
$lang      = ($_POST['lang'] ?? 'fr') === 'en' ? 'en' : 'fr';

// « Comment as-tu connu le club ? » — valeurs autorisées (alignées sur le front)
$connuAutorises = [
    '', 'Réseaux sociaux', 'Bouche à oreille', 'Passage devant le stade',
    'Recherche Google', 'Événement ou démonstration', 'Presse / médias', 'Autre',
];

if (
    !isset($offres[$offreId])
    || $prenom === '' || $nom === ''
    || filter_var($email, FILTER_VALIDATE_EMAIL) === false
    || ($annee !== '' && !preg_match('/^(19[3-9]\d|20[0-2]\d)$/', $annee))
    || !in_array($connu, $connuAutorises, true)
) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'invalid']);
    exit;
}

$prenom    = mb_substr(pnr_sans_retour_ligne($prenom), 0, 80);
$nom       = mb_substr(pnr_sans_retour_ligne($nom), 0, 120);
$email     = pnr_sans_retour_ligne($email);
$telephone = mb_substr(pnr_sans_retour_ligne($telephone), 0, 30);
$message   = mb_substr($message, 0, 5000);
$titre     = $offres[$offreId];

$sujet = "Candidature - {$titre}";
$corps = "Nouvelle candidature depuis le site de recrutement\n\n"
    . "Offre : {$titre} ({$offreId})\n"
    . "Prénom : {$prenom}\n"
    . "Nom : {$nom}\n"
    . "Email : {$email}\n"
    . 'Téléphone : ' . ($telephone !== '' ? $telephone : '—') . "\n"
    . 'Année de naissance : ' . ($annee !== '' ? $annee : '—') . "\n"
    . 'A connu le club via : ' . ($connu !== '' ? $connu : '—') . "\n"
    . "Langue du site : {$lang}\n\n"
    . 'Message :' . "\n" . ($message !== '' ? $message : '—') . "\n";

$envoye = pnr_envoyer($sujet, $corps, $email);
if (!$envoye) {
    http_response_code(500);
}
echo json_encode(['ok' => $envoye]);
