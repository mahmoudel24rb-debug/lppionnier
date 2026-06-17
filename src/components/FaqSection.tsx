'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Reveal from './Reveal';

const FAQ = [
  {
    q: 'Faut-il déjà avoir joué pour s’inscrire ?',
    a: 'Non, aucune expérience n’est requise. La majorité de nos joueurs ont débuté au club. L’encadrement t’accompagne dès ta première séance.',
  },
  {
    q: 'À partir de quel âge peut-on pratiquer ?',
    a: 'Le flag football est accessible dès le plus jeune âge (sections U12/U15), et le football américain au contact à partir des catégories jeunes puis adultes.',
  },
  {
    q: 'Où et quand ont lieu les entraînements ?',
    a: 'Les entraînements se déroulent dans la région de Tours. Les jours et horaires précis dépendent de l’équipe — informations communiquées lors de ta prise de contact.',
  },
  {
    q: 'Peut-on aider sans jouer ?',
    a: 'Absolument ! Coaching, arbitrage, organisation, communication… le club a besoin de bénévoles dans de nombreux domaines. La rubrique « Aider » te guide.',
  },
  {
    q: 'Combien coûte une saison ?',
    a: 'La cotisation et l’équipement varient selon la discipline et la catégorie. Ces informations te seront détaillées au moment de l’inscription.',
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="panel w-full p-5 text-left transition-colors hover:border-amber/30"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold text-white">{q}</span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber/15 text-amber">
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </div>
      <div
        className={`grid transition-all duration-300 ${
          open ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <p className="overflow-hidden text-sm leading-relaxed text-zinc-400">
          {a}
        </p>
      </div>
    </button>
  );
}

export default function FaqSection() {
  return (
    <section id="faq" className="relative scroll-mt-20 py-24 sm:py-28">
      <div className="container-x">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow justify-center">Infos pratiques</p>
          <h2 className="heading mt-3 text-4xl sm:text-5xl">
            Questions fréquentes
          </h2>
        </Reveal>

        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <Item q={f.q} a={f.a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
