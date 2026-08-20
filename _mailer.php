<?php
/**
 * Module d'envoi commun : Pionniers de Touraine.
 * Utilisé par contact.php et candidature.php (une seule implémentation d'envoi).
 * L'accès HTTP direct à ce fichier est bloqué par le .htaccess.
 *
 * BASCULE SMTP (recommandée dès qu'une boîte no-reply@ existe dans cPanel) :
 *  1. créer la boîte no-reply@pionniersdetouraine.fr dans cPanel → Comptes de messagerie ;
 *  2. déposer PHPMailer (src/PHPMailer.php, src/SMTP.php, src/Exception.php) dans /phpmailer/ ;
 *  3. passer PNR_USE_SMTP à true et remplir les 3 constantes SMTP ci-dessous.
 *  Hôte SMTP o2switch : le nom du serveur mutualisé (visible dans cPanel), port 465 (SSL).
 */
declare(strict_types=1);

const PNR_DESTINATAIRE = 'recrutement@pionniersdetouraine.fr';
const PNR_EXPEDITEUR   = 'no-reply@pionniersdetouraine.fr';

const PNR_USE_SMTP         = false;
const PNR_SMTP_HOTE        = ''; // ex. 'xxxx.o2switch.net'
const PNR_SMTP_PORT        = 465;
const PNR_SMTP_UTILISATEUR = ''; // ex. 'no-reply@pionniersdetouraine.fr'
const PNR_SMTP_MDP         = '';

/** Anti-injection d'en-têtes : aucun retour à la ligne dans les valeurs d'en-tête. */
function pnr_sans_retour_ligne(string $v): string
{
    return str_replace(["\r", "\n"], ' ', $v);
}

/** Envoie un email texte brut au club. Retourne true si l'envoi est accepté. */
function pnr_envoyer(string $sujet, string $corps, string $replyTo): bool
{
    $sujetEncode = '=?UTF-8?B?' . base64_encode(pnr_sans_retour_ligne($sujet)) . '?=';
    $entetes = implode("\r\n", [
        'From: ' . PNR_EXPEDITEUR,
        'Reply-To: ' . pnr_sans_retour_ligne($replyTo),
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
    ]);

    if (PNR_USE_SMTP && PNR_SMTP_HOTE !== '') {
        require_once __DIR__ . '/phpmailer/Exception.php';
        require_once __DIR__ . '/phpmailer/PHPMailer.php';
        require_once __DIR__ . '/phpmailer/SMTP.php';
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = PNR_SMTP_HOTE;
            $mail->Port       = PNR_SMTP_PORT;
            $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
            $mail->SMTPAuth   = true;
            $mail->Username   = PNR_SMTP_UTILISATEUR;
            $mail->Password   = PNR_SMTP_MDP;
            $mail->CharSet    = 'UTF-8';
            $mail->setFrom(PNR_EXPEDITEUR, 'Pionniers de Touraine');
            $mail->addAddress(PNR_DESTINATAIRE);
            $mail->addReplyTo(pnr_sans_retour_ligne($replyTo));
            $mail->Subject = $sujet;
            $mail->Body    = $corps;
            return $mail->send();
        } catch (Throwable $e) {
            return false;
        }
    }

    return mail(PNR_DESTINATAIRE, $sujetEncode, $corps, $entetes);
}
