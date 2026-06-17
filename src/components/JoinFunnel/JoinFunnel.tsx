'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BRANCHES, type Branche, type Choix, type Annonce } from '@/data/funnel';
import ChoiceTile from './ChoiceTile';
import AnnonceCard from './AnnonceCard';
import EngageForm from './EngageForm';
import Breadcrumb, { type Crumb } from './Breadcrumb';

export default function JoinFunnel() {
  const [branche, setBranche] = useState<Branche | null>(null);
  const [choix, setChoix] = useState<Choix | null>(null);
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [dir, setDir] = useState(1);

  // Étape dérivée de l'état
  const step = annonce ? 3 : choix ? 2 : branche ? 1 : 0;

  const go = (d: number) => setDir(d);

  const reset = () => {
    go(-1);
    setBranche(null);
    setChoix(null);
    setAnnonce(null);
  };

  const goToLevel = (level: number) => {
    go(-1);
    if (level <= 0) return reset();
    if (level <= 1) {
      setChoix(null);
      setAnnonce(null);
    } else if (level <= 2) {
      setAnnonce(null);
    }
  };

  const goBack = () => {
    go(-1);
    if (annonce) return setAnnonce(null);
    if (choix) return setChoix(null);
    if (branche) return setBranche(null);
  };

  const crumbs: Crumb[] = [];
  if (branche) crumbs.push({ label: branche.label, level: 1 });
  if (choix) crumbs.push({ label: choix.label, level: 2 });
  if (annonce) crumbs.push({ label: annonce.titre, level: 3 });

  // Animation directionnelle
  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -60 }),
  };

  return (
    <section id="rejoindre" className="relative scroll-mt-20 py-24 sm:py-32">
      {/* Halo de fond */}
      <div className="pointer-events-none absolute inset-0 bg-radial-amber" />

      <div className="container-x relative">
        {/* En-tête de section */}
        <div className="mb-12 text-center">
          <p className="eyebrow justify-center">Nous rejoindre</p>
          <h2 className="heading mt-3 text-4xl sm:text-5xl lg:text-6xl">
            Trouve ta place
            <span className="block text-amber">chez les Pionniers</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            En quelques clics, on te guide vers la bonne porte d&apos;entrée —
            sur le terrain ou à nos côtés pour faire vivre le club.
          </p>
        </div>

        {/* Indicateur d'étape + fil d'ariane */}
        {step > 0 && (
          <div className="mx-auto mb-2 max-w-5xl">
            <div className="mb-6 flex items-center justify-center gap-2">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    n <= step ? 'w-8 bg-amber' : 'w-4 bg-white/15'
                  }`}
                />
              ))}
            </div>
            <Breadcrumb crumbs={crumbs} onNavigate={goToLevel} onBack={goBack} />
          </div>
        )}

        <div className="mx-auto max-w-5xl">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step + (branche?.key ?? '') + (choix?.key ?? '')}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {/* ÉTAPE 0 — Pratiquer / Aider */}
              {step === 0 && (
                <>
                  <p className="mb-6 text-center text-lg font-medium text-zinc-300">
                    Tu souhaites…
                  </p>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {BRANCHES.map((b, i) => (
                      <ChoiceTile
                        key={b.key}
                        icon={b.icon}
                        label={b.label}
                        sousLabel={b.sousLabel}
                        index={i}
                        large
                        onClick={() => {
                          go(1);
                          setBranche(b);
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* ÉTAPE 1 — Choix dans la branche */}
              {step === 1 && branche && (
                <>
                  <p className="mb-6 text-center text-lg font-medium text-zinc-300">
                    {branche.question}
                  </p>
                  <div
                    className={`grid grid-cols-1 gap-5 ${
                      branche.choix.length > 2
                        ? 'sm:grid-cols-2 lg:grid-cols-4'
                        : 'sm:grid-cols-2'
                    }`}
                  >
                    {branche.choix.map((c, i) => (
                      <ChoiceTile
                        key={c.key}
                        icon={c.icon}
                        label={c.label}
                        sousLabel={c.sousLabel}
                        index={i}
                        large={branche.choix.length <= 2}
                        onClick={() => {
                          go(1);
                          setChoix(c);
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* ÉTAPE 2 — Annonces */}
              {step === 2 && choix && (
                <>
                  <p className="mx-auto mb-8 max-w-2xl text-center text-zinc-300">
                    {choix.intro}
                  </p>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {choix.annonces.map((a, i) => (
                      <AnnonceCard
                        key={a.id}
                        annonce={a}
                        index={i}
                        onEngage={(sel) => {
                          go(1);
                          setAnnonce(sel);
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* ÉTAPE 3 — Formulaire */}
              {step === 3 && annonce && branche && choix && (
                <EngageForm
                  annonce={annonce}
                  contexte={`${branche.label} · ${choix.label}`}
                  onRestart={reset}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
