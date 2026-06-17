'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export type Selection = { contexte: string; poste: string } | null;

const field =
  'w-full rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-amber/60 focus:bg-ink-950';
const label =
  'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500';

export default function RecruitForm({
  selection,
  onReset,
}: {
  selection: Selection;
  onReset: () => void;
}) {
  const [poste, setPoste] = useState(selection?.poste ?? '');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (selection?.poste) setPoste(selection.poste);
  }, [selection?.poste]);

  return (
    <div
      id="rejoindre"
      className="relative w-full max-w-md scroll-mt-24 rounded-3xl border border-white/10 bg-ink-850/90 p-7 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8"
    >
      {/* Liseré supérieur doré */}
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber/60 to-transparent" />

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="py-6 text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
              <Check className="h-7 w-7" strokeWidth={2.5} />
            </div>
            <h3 className="heading mt-5 text-2xl">Candidature envoyée</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm text-zinc-400">
              Merci pour ton engagement. Le staff des Pionniers te recontacte
              très vite.
            </p>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                onReset();
              }}
              className="mt-6 text-sm font-semibold text-amber transition hover:text-amber-400"
            >
              Envoyer une autre candidature
            </button>
            <p className="mt-4 text-[11px] text-zinc-600">
              Démo — aucune donnée n&apos;est réellement envoyée.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber">
              {selection?.contexte ?? 'Rejoindre le club'}
            </p>
            <h3 className="heading mt-1.5 text-2xl sm:text-[1.7rem]">
              S&apos;engager
            </h3>
            <p className="mt-1.5 text-sm text-zinc-400">
              Laisse-nous tes coordonnées, on revient vers toi pour t&apos;accueillir.
            </p>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={label}>Prénom</label>
                  <input className={field} placeholder="Prénom" required />
                </div>
                <div>
                  <label className={label}>Nom</label>
                  <input className={field} placeholder="Nom" required />
                </div>
              </div>
              <div>
                <label className={label}>Email</label>
                <input
                  type="email"
                  className={field}
                  placeholder="prenom@email.com"
                  required
                />
              </div>
              <div>
                <label className={label}>Téléphone</label>
                <input
                  type="tel"
                  className={field}
                  placeholder="06 12 34 56 78"
                />
              </div>
              <div>
                <label className={label}>Poste / mission</label>
                <input
                  className={field}
                  value={poste}
                  onChange={(e) => setPoste(e.target.value)}
                  placeholder="Sélectionne une option à gauche"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary mt-6 w-full">
              S&apos;engager
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-3 text-center text-[11px] text-zinc-600">
              Démo de présentation — le formulaire n&apos;envoie rien.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
