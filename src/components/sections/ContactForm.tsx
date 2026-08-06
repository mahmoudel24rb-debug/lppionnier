'use client';

import { useState, type FormEvent } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { asset } from '@/lib/asset';
import { track } from '@/lib/track';
import { useLang } from '@/lib/i18n';

/**
 * Formulaire de contact → public/contact.php (envoi vers
 * recrutement@pionniersdetouraine.fr, fonctionnel sur l'hébergement final).
 * Les VALEURS des objets restent en français (liste blanche côté PHP) ;
 * seuls les libellés affichés sont traduits.
 */
const OBJETS = [
  'Recrutement - Je veux jouer au Foot US',
  'Recrutement - Je veux jouer au Flag Football',
  'Recrutement - Je veux aider le club',
];

const OBJETS_EN = [
  'Recruitment - I want to play American football',
  'Recruitment - I want to play flag football',
  'Recruitment - I want to help the club',
];

const OBJET_KEY: Record<string, string> = {
  [OBJETS[0]]: 'foot-us',
  [OBJETS[1]]: 'flag',
  [OBJETS[2]]: 'aider',
};

const EMAIL = 'recrutement@pionniersdetouraine.fr';

const T = {
  fr: {
    title: 'Nous contacter',
    objet: 'Objet',
    nom: 'Nom',
    nomPh: 'Ton nom',
    email: 'Email',
    emailPh: 'prenom@email.com',
    message: 'Message',
    messagePh: 'Parle-nous de toi, de ton expérience ou de tes questions…',
    envoyer: 'Envoyer',
    envoi: 'Envoi…',
    ok: 'Message envoyé ! Le staff des Pionniers te répond très vite.',
    demo: "L'envoi direct sera actif sur le site final. En attendant :",
    demoLien: 'nous écrire par email',
  },
  en: {
    title: 'Contact us',
    objet: 'Subject',
    nom: 'Name',
    nomPh: 'Your name',
    email: 'Email',
    emailPh: 'name@email.com',
    message: 'Message',
    messagePh: 'Tell us about yourself, your experience or your questions…',
    envoyer: 'Send',
    envoi: 'Sending…',
    ok: 'Message sent! The Pionniers staff will get back to you very soon.',
    demo: 'Direct sending will be live on the final website. In the meantime:',
    demoLien: 'email us',
  },
};

type Statut = 'idle' | 'envoi' | 'envoye' | 'demo';

export default function ContactForm() {
  const { lang } = useLang();
  const t = T[lang];
  const [statut, setStatut] = useState<Statut>('idle');
  const [objet, setObjet] = useState(OBJETS[0]);
  const [message, setMessage] = useState('');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (statut === 'envoi') return;
    setStatut('envoi');
    track('contact-submit', { objet: OBJET_KEY[objet] ?? 'autre' });
    try {
      const res = await fetch(asset('/contact.php'), {
        method: 'POST',
        body: new FormData(e.currentTarget),
      });
      const data = res.ok ? await res.json().catch(() => null) : null;
      setStatut(data && data.ok ? 'envoye' : 'demo');
    } catch {
      setStatut('demo');
    }
  };

  const mailtoDemo = `mailto:${EMAIL}?subject=${encodeURIComponent(objet)}&body=${encodeURIComponent(message)}`;

  if (statut === 'envoye') {
    return (
      <div className="sc-panel sc-contact-panel" id="contact">
        <h3 className="sc-panel-title">{t.title}</h3>
        <p className="sc-form-ok">{t.ok}</p>
      </div>
    );
  }

  return (
    <div className="sc-panel sc-contact-panel" id="contact">
      <h3 className="sc-panel-title">{t.title}</h3>
      <form className="sc-form" onSubmit={onSubmit}>
        {/* Honeypot anti-spam : caché aux humains, rempli par les robots */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="sc-field-trap"
        />
        <div className="sc-field sc-field--full">
          <label htmlFor="contact-objet">{t.objet}</label>
          <select
            id="contact-objet"
            name="objet"
            value={objet}
            onChange={(e) => setObjet(e.target.value)}
            required
          >
            {OBJETS.map((o, i) => (
              <option key={o} value={o}>
                {lang === 'en' ? OBJETS_EN[i] : o}
              </option>
            ))}
          </select>
        </div>
        <div className="sc-field">
          <label htmlFor="contact-nom">{t.nom}</label>
          <input id="contact-nom" name="nom" required placeholder={t.nomPh} />
        </div>
        <div className="sc-field">
          <label htmlFor="contact-email">{t.email}</label>
          <input id="contact-email" name="email" type="email" required placeholder={t.emailPh} />
        </div>
        <div className="sc-field sc-field--full">
          <label htmlFor="contact-message">{t.message}</label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            placeholder={t.messagePh}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="sc-form-actions">
          <button type="submit" className="sc-btn" disabled={statut === 'envoi'}>
            {statut === 'envoi' ? t.envoi : t.envoyer} <FaPaperPlane size={13} />
          </button>
          {statut === 'demo' && (
            <p className="sc-form-demo">
              {t.demo} <a href={mailtoDemo}>{t.demoLien}</a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
