'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Send, PartyPopper } from 'lucide-react';
import type { Annonce } from '@/data/funnel';

type Props = {
  annonce: Annonce;
  contexte: string; // ex: "Pratiquer · Football américain"
  onRestart: () => void;
};

const inputClass =
  'w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-amber/60 focus:ring-2 focus:ring-amber/20';

export default function EngageForm({ annonce, contexte, onRestart }: Props) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="panel mx-auto max-w-xl p-10 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
          <CheckCircle2 className="h-9 w-9" strokeWidth={2} />
        </div>
        <h3 className="heading mt-6 text-3xl text-white">
          Candidature envoyée !
        </h3>
        <p className="mx-auto mt-3 max-w-md text-zinc-400">
          Merci pour ton engagement sur{' '}
          <span className="font-semibold text-amber">{annonce.titre}</span>. Le
          staff des Pionniers de Touraine te recontacte très vite pour la suite.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400">
          <PartyPopper className="h-3.5 w-3.5 text-amber" />
          Démo — aucune donnée n&apos;est réellement envoyée
        </p>
        <div className="mt-8">
          <button type="button" onClick={onRestart} className="btn-ghost">
            Revenir au début
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="panel mx-auto max-w-2xl p-7 sm:p-9"
    >
      <p className="eyebrow">{contexte}</p>
      <h3 className="heading mt-2 text-3xl text-white">
        S&apos;engager · {annonce.titre}
      </h3>
      <p className="mt-2 text-sm text-zinc-400">
        Laisse tes coordonnées, on revient vers toi pour t&apos;accueillir.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Prénom
          </label>
          <input className={inputClass} placeholder="Ton prénom" required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Nom
          </label>
          <input className={inputClass} placeholder="Ton nom" required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Email
          </label>
          <input
            type="email"
            className={inputClass}
            placeholder="prenom@email.com"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Téléphone
          </label>
          <input
            type="tel"
            className={inputClass}
            placeholder="06 12 34 56 78"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Poste / mission visé
          </label>
          <input className={inputClass} defaultValue={annonce.titre} readOnly />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Message <span className="font-normal text-zinc-600">(optionnel)</span>
          </label>
          <textarea
            rows={4}
            className={`${inputClass} resize-none`}
            placeholder="Parle-nous de toi, ton expérience, tes dispos…"
          />
        </div>

        <div className="sm:col-span-2 mt-2 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-xs text-zinc-500">
            Démo de présentation — le formulaire n&apos;envoie rien.
          </p>
          <button type="submit" className="btn-primary w-full sm:w-auto">
            Envoyer ma candidature
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
