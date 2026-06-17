'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import type { Annonce } from '@/data/funnel';

type Props = {
  annonce: Annonce;
  index: number;
  onEngage: (annonce: Annonce) => void;
};

export default function AnnonceCard({ annonce, index, onEngage }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-ink-850/70 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-amber/40"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="heading text-2xl text-white">{annonce.titre}</h3>
          {annonce.sousTitre && (
            <p className="mt-1 text-sm font-medium text-amber">
              {annonce.sousTitre}
            </p>
          )}
        </div>
        {annonce.niveau && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
            <BadgeCheck className="h-3.5 w-3.5" />
            {annonce.niveau}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        {annonce.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {annonce.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300"
          >
            {tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onEngage(annonce)}
        className="btn-primary mt-6 w-full sm:w-auto"
      >
        S&apos;engager
        <ArrowRight className="h-4 w-4" />
      </button>
    </motion.article>
  );
}
