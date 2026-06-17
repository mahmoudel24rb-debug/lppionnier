import { Trophy, Users, Heart, Flame } from 'lucide-react';
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
    icon: Heart,
    title: 'Accueil',
    text: 'Débutant ou confirmé, jeune ou moins jeune : il y a une place et un rôle pour chacun.',
  },
  {
    icon: Trophy,
    title: 'Ambition',
    text: 'Un club tourné vers la compétition et la performance, avec des objectifs clairs chaque saison.',
  },
];

export default function ClubSection() {
  return (
    <section id="club" className="relative scroll-mt-20 py-24 sm:py-32">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <p className="eyebrow">Le club</p>
            <h2 className="heading mt-3 text-4xl sm:text-5xl">
              Le football américain
              <span className="block text-amber">au cœur de la Touraine</span>
            </h2>
            <p className="mt-6 text-zinc-400">
              Les Pionniers de Touraine font vivre le football américain et le
              flag football dans la région de Tours. Un club à taille humaine,
              animé par la passion du jeu et l’envie de transmettre.
            </p>
            <p className="mt-4 text-zinc-400">
              Que tu veuilles enfiler le casque, courir sans contact en flag, ou
              donner un coup de main hors du terrain, tu trouveras ta place parmi
              nous. {/* Contenu à personnaliser par le club. */}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: '2014', label: 'Saison après saison' },
                { value: '4', label: 'Équipes engagées' },
                { value: '∞', label: 'Bonne ambiance' },
              ].map((s) => (
                <div key={s.label} className="panel p-4 text-center">
                  <div className="font-display text-2xl font-semibold text-amber sm:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-wide text-zinc-500">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="panel p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber/15 text-amber ring-1 ring-amber/20">
                  <v.icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <h3 className="heading mt-4 text-xl">{v.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
