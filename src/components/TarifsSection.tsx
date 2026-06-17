import { Check, ArrowUpRight, ShieldHalf, Flag, Info } from 'lucide-react';
import Reveal from './Reveal';

// ⚙️ À remplacer par la vraie page HelloAsso du club.
const HELLOASSO_URL =
  'https://www.helloasso.com/associations/pionniers-de-touraine';

type Tarif = { label: string; prix: string };

const PLANS: {
  titre: string;
  icon: typeof ShieldHalf;
  tarifs: Tarif[];
  option?: string;
}[] = [
  {
    titre: 'Football américain',
    icon: ShieldHalf,
    tarifs: [
      { label: 'Seniors', prix: '220€' },
      { label: 'Juniors U18', prix: '160€' },
    ],
    option: 'Option location de matériel : 100€',
  },
  {
    titre: 'Flag football',
    icon: Flag,
    tarifs: [
      { label: 'Mixte Seniors', prix: '120€' },
      { label: 'Juniors & école de flag', prix: '70€' },
    ],
  },
];

export default function TarifsSection() {
  return (
    <section
      id="adhesions"
      className="relative scroll-mt-20 overflow-hidden border-y border-white/5 bg-gradient-to-b from-bordeaux/30 via-ink-950 to-ink-950 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-radial-amber" />

      <div className="container-x relative">
        <Reveal className="mx-auto mb-4 max-w-2xl text-center">
          <p className="eyebrow justify-center">Adhésions</p>
          <h2 className="heading mt-3 text-4xl sm:text-5xl lg:text-6xl">
            Tarifs <span className="text-amber">2025 — 2026</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-zinc-400">
            Prêt à t&apos;engager pour de bon ? L&apos;inscription se fait en
            ligne en quelques minutes sur Hello Asso.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {PLANS.map((plan, i) => (
            <Reveal
              key={plan.titre}
              delay={i * 0.1}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-850/80 p-8 backdrop-blur-sm transition-colors duration-300 hover:border-amber/40"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative flex items-center gap-3">
                <plan.icon className="h-7 w-7 text-amber" strokeWidth={1.5} />
                <h3 className="heading text-2xl text-amber">{plan.titre}</h3>
              </div>

              <ul className="relative mt-7 flex-1 space-y-4">
                {plan.tarifs.map((t) => (
                  <li
                    key={t.label}
                    className="flex items-center justify-between gap-4 border-b border-white/5 pb-4"
                  >
                    <span className="flex items-center gap-2.5 text-zinc-200">
                      <Check className="h-4 w-4 shrink-0 text-amber" />
                      {t.label}
                    </span>
                    <span className="font-display text-2xl font-semibold text-white">
                      {t.prix}
                    </span>
                  </li>
                ))}
              </ul>

              {plan.option && (
                <p className="relative mt-4 inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm italic text-zinc-400">
                  <Info className="h-4 w-4 shrink-0 text-amber" />
                  {plan.option}
                </p>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-12 text-center">
          <a
            href={HELLOASSO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            S&apos;inscrire sur Hello Asso
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <p className="mt-3 text-xs text-zinc-500">
            Paiement sécurisé · Inscription officielle de la saison
          </p>
        </Reveal>
      </div>
    </section>
  );
}
