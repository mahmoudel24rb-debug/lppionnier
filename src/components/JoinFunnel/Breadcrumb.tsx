'use client';

import { ChevronLeft, Home, ChevronRight } from 'lucide-react';

export type Crumb = {
  label: string;
  /** Niveau cible quand on clique (0 = départ). */
  level: number;
};

type Props = {
  crumbs: Crumb[];
  onNavigate: (level: number) => void;
  onBack: () => void;
};

export default function Breadcrumb({ crumbs, onNavigate, onBack }: Props) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:border-amber/50 hover:text-amber"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour
      </button>

      <nav className="flex flex-wrap items-center gap-1 text-sm text-zinc-500">
        <button
          type="button"
          onClick={() => onNavigate(0)}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:text-amber"
        >
          <Home className="h-3.5 w-3.5" />
          Nous rejoindre
        </button>

        {crumbs.map((c) => (
          <span key={c.level} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-zinc-700" />
            <button
              type="button"
              onClick={() => onNavigate(c.level)}
              className="rounded-md px-2 py-1 font-medium text-zinc-300 transition-colors hover:text-amber"
            >
              {c.label}
            </button>
          </span>
        ))}
      </nav>
    </div>
  );
}
