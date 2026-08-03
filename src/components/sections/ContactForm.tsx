'use client';

import { useState, type FormEvent } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { asset } from '@/lib/asset';
import { track } from '@/lib/track';

/**
 * Formulaire de contact → public/contact.php (envoi vers
 * recrutement@pionniersdetouraine.fr, fonctionnel sur l'hébergement final).
 * Sur la démo GitHub Pages (pas de PHP), repli : message d'info + mailto
 * pré-rempli avec l'objet et le message saisis.
 */
const OBJETS = [
  'Recrutement - Je veux jouer au Foot US',
  'Recrutement - Je veux jouer au Flag Football',
  'Recrutement - Je veux aider le club',
];

const OBJET_KEY: Record<string, string> = {
  [OBJETS[0]]: 'foot-us',
  [OBJETS[1]]: 'flag',
  [OBJETS[2]]: 'aider',
};

const EMAIL = 'recrutement@pionniersdetouraine.fr';

type Statut = 'idle' | 'envoi' | 'envoye' | 'demo';

export default function ContactForm() {
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
        <h3 className="sc-panel-title">Nous contacter</h3>
        <p className="sc-form-ok">Message envoyé ! Le staff des Pionniers te répond très vite.</p>
      </div>
    );
  }

  return (
    <div className="sc-panel sc-contact-panel" id="contact">
      <h3 className="sc-panel-title">Nous contacter</h3>
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
          <label htmlFor="contact-objet">Objet</label>
          <select
            id="contact-objet"
            name="objet"
            value={objet}
            onChange={(e) => setObjet(e.target.value)}
            required
          >
            {OBJETS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
        <div className="sc-field">
          <label htmlFor="contact-nom">Nom</label>
          <input id="contact-nom" name="nom" required placeholder="Ton nom" />
        </div>
        <div className="sc-field">
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" required placeholder="prenom@email.com" />
        </div>
        <div className="sc-field sc-field--full">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            placeholder="Parle-nous de toi, de ton expérience ou de tes questions…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="sc-form-actions">
          <button type="submit" className="sc-btn" disabled={statut === 'envoi'}>
            {statut === 'envoi' ? 'Envoi…' : 'Envoyer'} <FaPaperPlane size={13} />
          </button>
          {statut === 'demo' && (
            <p className="sc-form-demo">
              L&apos;envoi direct sera actif sur le site final. En attendant :{' '}
              <a href={mailtoDemo}>nous écrire par email</a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
