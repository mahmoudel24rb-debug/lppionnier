'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MapPin, ChevronDown } from 'lucide-react';
import { asset } from '@/lib/asset';

const STATS = [
  { value: '4', label: 'Équipes' },
  { value: '2', label: 'Disciplines' },
  { value: '100%', label: 'Esprit d’équipe' },
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Image de fond */}
      <img
        src={asset('/assets/hero.jpg')}
        alt="Joueur de football américain des Pionniers de Touraine"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Dégradés cinématographiques */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/40" />

      <div className="container-x relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <p className="eyebrow">
            <MapPin className="h-3.5 w-3.5" />
            Tours · Touraine
          </p>

          <h1 className="heading mt-4 text-5xl sm:text-7xl lg:text-8xl">
            Pionniers
            <span className="block text-amber">de Touraine</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-zinc-300">
            Football américain & flag football. Rejoins une équipe ambitieuse,
            quel que soit ton niveau ou ta façon de vivre le jeu — sur le terrain
            comme à nos côtés.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#rejoindre" className="btn-primary">
              Nous rejoindre
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#club" className="btn-ghost">
              Découvrir le club
            </a>
          </div>

          <div className="mt-12 flex gap-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-semibold text-white sm:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-xs uppercase tracking-wide text-zinc-400">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Indicateur scroll */}
      <a
        href="#club"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-zinc-500 transition-colors hover:text-amber"
        aria-label="Défiler"
      >
        <ChevronDown className="h-7 w-7 animate-bounce" />
      </a>
    </section>
  );
}
