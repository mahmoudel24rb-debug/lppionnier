'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import {
  BRANCHES,
  type Branche,
  type Choix,
  type Annonce,
} from '@/data/funnel';
import { FUNNEL_ICONS } from '@/lib/funnelIcons';
import { asset } from '@/lib/asset';
import RecruitForm, { type Selection } from './RecruitForm';

export default function RecruitHero() {
  const [branche, setBranche] = useState<Branche | null>(null);
  const [choix, setChoix] = useState<Choix | null>(null);
  const [annonce, setAnnonce] = useState<Annonce | null>(null);

  const step = choix ? 2 : branche ? 1 : 0;

  const reset = () => {
    setBranche(null);
    setChoix(null);
    setAnnonce(null);
  };
  const back = () => {
    if (choix) {
      setChoix(null);
      setAnnonce(null);
    } else if (branche) setBranche(null);
  };

  const selection: Selection =
    branche && choix
      ? { contexte: `${branche.label} · ${choix.label}`, poste: annonce?.titre ?? '' }
      : branche
      ? { contexte: branche.label, poste: '' }
      : null;

  const heading =
    step === 0
      ? 'Tu souhaites…'
      : step === 1 && branche
      ? branche.question
      : choix?.intro ?? '';

  return (
    <section
      id="top"
      className="relative grid min-h-[100svh] grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]"
    >
      {/* ───────────── Colonne gauche : visuel + tunnel ───────────── */}
      <div className="relative flex flex-col justify-center overflow-hidden px-5 pb-16 pt-28 sm:px-10 lg:pb-20 lg:pt-32">
        <img
          src={asset('/assets/hero.jpg')}
          alt="Joueur de football américain des Pionniers de Touraine"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/85 to-ink-950/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-xl lg:mx-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber">
            <span className="h-1.5 w-1.5 rounded-full bg-amber" />
            Recrutement · Saison 2025-2026
          </span>

          <h1 className="heading mt-5 text-5xl sm:text-6xl lg:text-7xl">
            Deviens un
            <span className="block text-amber">Pionnier.</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-zinc-300 sm:text-lg">
            Football américain & flag football à Tours depuis 1987. Choisis ta
            voie en quelques clics — on t&apos;accueille, débutant ou confirmé.
          </p>

          {/* Navigation du tunnel */}
          <div className="mt-9">
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition hover:text-amber"
              >
                <ChevronLeft className="h-4 w-4" />
                Retour
              </button>
            )}

            <p className="mb-3 text-sm font-medium text-zinc-300">{heading}</p>

            <AnimatePresence mode="wait">
              <motion.div
                key={step + (branche?.key ?? '') + (choix?.key ?? '')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="flex flex-col gap-2.5"
              >
                {step === 0 &&
                  BRANCHES.map((b) => (
                    <Tile
                      key={b.key}
                      icon={b.icon}
                      label={b.label}
                      sub={b.sousLabel}
                      onClick={() => setBranche(b)}
                    />
                  ))}

                {step === 1 &&
                  branche &&
                  branche.choix.map((c) => (
                    <Tile
                      key={c.key}
                      icon={c.icon}
                      label={c.label}
                      sub={c.sousLabel}
                      onClick={() => setChoix(c)}
                    />
                  ))}

                {step === 2 &&
                  choix &&
                  choix.annonces.map((a) => (
                    <AnnonceRow
                      key={a.id}
                      annonce={a}
                      selected={annonce?.id === a.id}
                      onClick={() => setAnnonce(a)}
                    />
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="mt-9 text-xs uppercase tracking-[0.16em] text-zinc-500">
            Club historique · Fondé en 1987 · Tours, Touraine
          </p>
        </div>
      </div>

      {/* ───────────── Colonne droite : formulaire ───────────── */}
      <div className="relative flex items-center justify-center border-t border-white/5 bg-ink-900 px-5 py-16 lg:border-l lg:border-t-0 lg:py-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(245,163,0,0.10),transparent_60%)]" />
        <div className="relative">
          <RecruitForm selection={selection} onReset={reset} />
        </div>
      </div>
    </section>
  );
}

/* ───────────── Sous-composants ───────────── */

function Tile({
  icon,
  label,
  sub,
  onClick,
}: {
  icon: keyof typeof FUNNEL_ICONS;
  label: string;
  sub: string;
  onClick: () => void;
}) {
  const Icon = FUNNEL_ICONS[icon];
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3.5 rounded-xl border border-white/10 bg-ink-900/70 px-4 py-3 text-left backdrop-blur transition-colors duration-200 hover:border-amber/50 hover:bg-ink-850"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-amber ring-1 ring-white/10 transition-colors group-hover:bg-amber group-hover:text-ink-950 group-hover:ring-amber">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-semibold uppercase tracking-wide text-white">
          {label}
        </span>
        <span className="block truncate text-xs text-zinc-400">{sub}</span>
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-amber" />
    </button>
  );
}

function AnnonceRow({
  annonce,
  selected,
  onClick,
}: {
  annonce: Annonce;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-start gap-3.5 rounded-xl border px-4 py-3 text-left backdrop-blur transition-colors duration-200 ${
        selected
          ? 'border-amber/60 bg-amber/10'
          : 'border-white/10 bg-ink-900/70 hover:border-amber/40 hover:bg-ink-850'
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
          selected
            ? 'border-amber bg-amber text-ink-950'
            : 'border-white/25 text-transparent'
        }`}
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="font-display text-base font-semibold uppercase tracking-wide text-white">
            {annonce.titre}
          </span>
          {annonce.niveau && (
            <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-emerald-300/90">
              {annonce.niveau}
            </span>
          )}
        </span>
        {annonce.sousTitre && (
          <span className="block text-xs text-amber/90">{annonce.sousTitre}</span>
        )}
        <span className="mt-1 block truncate text-xs text-zinc-500">
          {annonce.tags.slice(0, 3).join(' · ')}
        </span>
      </span>
    </button>
  );
}
