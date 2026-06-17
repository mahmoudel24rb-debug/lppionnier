'use client';

import { motion } from 'framer-motion';
import {
  Zap,
  HeartHandshake,
  ShieldHalf,
  Flag,
  Megaphone,
  Scale,
  Briefcase,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '@/data/funnel';

const ICONS: Record<IconName, LucideIcon> = {
  Zap,
  HeartHandshake,
  ShieldHalf,
  Flag,
  Megaphone,
  Scale,
  Briefcase,
  Sparkles,
};

type Props = {
  icon: IconName;
  label: string;
  sousLabel: string;
  onClick: () => void;
  index?: number;
  /** Grande tuile pour les étapes de choix principales. */
  large?: boolean;
};

export default function ChoiceTile({
  icon,
  label,
  sousLabel,
  onClick,
  index = 0,
  large = false,
}: Props) {
  const Icon = ICONS[icon];

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex flex-col items-start justify-between overflow-hidden rounded-2xl
        border border-white/10 bg-ink-850/70 p-6 text-left backdrop-blur-sm
        transition-colors duration-300 hover:border-amber/50
        ${large ? 'aspect-square sm:aspect-[4/3] lg:aspect-square' : 'min-h-[180px]'}`}
    >
      {/* Lueur dorée au hover */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <span
        className={`relative flex items-center justify-center rounded-xl bg-amber/15 text-amber ring-1 ring-amber/20
          transition-all duration-300 group-hover:bg-amber group-hover:text-ink-950
          ${large ? 'h-14 w-14' : 'h-12 w-12'}`}
      >
        <Icon className={large ? 'h-7 w-7' : 'h-6 w-6'} strokeWidth={2.2} />
      </span>

      <div className="relative mt-6">
        <h3
          className={`heading text-white ${
            large ? 'text-2xl sm:text-3xl' : 'text-xl'
          }`}
        >
          {label}
        </h3>
        <p className="mt-1.5 text-sm text-zinc-400">{sousLabel}</p>
      </div>

      <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-amber opacity-80 transition-all duration-300 group-hover:gap-2.5 group-hover:opacity-100">
        Choisir
        <ArrowRight className="h-4 w-4" />
      </span>
    </motion.button>
  );
}
