import { Flame, Users, HeartHandshake, Trophy } from 'lucide-react';
import Reveal from './Reveal';

const VALUES = [
  {
    icon: Flame,
    title: 'Dépassement',
    text: 'On vient pour progresser, repousser ses limites et donner le meilleur à chaque entraînement.',
  },
  {
    icon: Users,
    title: 'Collectif',
    text: 'Sur le terrain, chaque rôle compte. La force des Pionniers, c’est le groupe avant l’individu.',
  },
  {
    icon: HeartHandshake,
    title: 'Accueil',
    text: 'Débutant ou confirmé, jeune ou moins jeune : il y a une place et un rôle pour chacun.',
  },
  {
    icon: Trophy,
    title: 'Ambition',
    text: 'Un club tourné vers la compétition et la performance, avec des objectifs clairs chaque saison.',
  },
];

const STATS = [
  { value: '1987', label: 'Année de fondation' },
  { value: 'US & Flag', label: 'Deux disciplines' },
  { value: 'Tous publics', label: 'Hommes · Femmes · Jeunes' },
];

export default function ClubSection() {
  return (
    <section id="club" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start lg:gap-20">
          {/* Texte */}
          <Reveal className="lg:sticky lg:top-28">
            <p className="eyebrow">Le club</p>
            <h2 className="heading mt-3 text-4xl sm:text-5xl">
              Pionnier du football US
              <span className="block text-amber">en Touraine depuis 1987</span>
            </h2>
            <p className="mt-6 text-zinc-400">
              Plus de trente-cinq ans que les Pionniers de Touraine font vivre le
              football américain et le flag football dans la région de Tours. Un
              club à l’histoire profonde, porté par la passion du jeu et l’envie
              de transmettre.
            </p>
            <p className="mt-4 text-zinc-400">
              Enfiler le casque, courir sans contact en flag, ou donner un coup de
              main hors du terrain : chacun y trouve sa place.
            </p>

            <dl className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
              {STATS.map((s) => (
                <div key={s.label} className="bg-ink-900 px-4 py-5 text-center">
                  <dt className="font-display text-xl font-semibold text-amber sm:text-2xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1.5 text-[11px] leading-tight text-zinc-500">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Valeurs — cartes éditoriales */}
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal
                key={v.title}
                delay={i * 0.06}
                className="group relative bg-ink-950 p-7 transition-colors duration-300 hover:bg-ink-900"
              >
                <div className="flex items-center justify-between">
                  <v.icon
                    className="h-6 w-6 text-amber"
                    strokeWidth={1.5}
                  />
                  <span className="font-display text-sm font-semibold tabular-nums text-white/15 transition-colors group-hover:text-amber/40">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="heading mt-8 text-xl">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {v.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
