import { Dumbbell, Brain, Target, HeartPulse } from 'lucide-react';
import Reveal from './Reveal';
import { asset } from '@/lib/asset';

const PILIERS = [
  {
    icon: Dumbbell,
    title: 'Préparation physique',
    text: 'Force, vitesse, explosivité : un athlétisation encadrée et progressive.',
  },
  {
    icon: Target,
    title: 'Technique & tactique',
    text: 'Maîtrise des postes, lecture du jeu et schémas, à l’entraînement comme en match.',
  },
  {
    icon: Brain,
    title: 'Mental & cohésion',
    text: 'Gestion de la pression, esprit d’équipe et culture de la gagne.',
  },
  {
    icon: HeartPulse,
    title: 'Suivi & récupération',
    text: 'Prévention des blessures, nutrition et récupération pour durer toute la saison.',
  },
];

export default function PPPSection() {
  return (
    <section
      id="ppp"
      className="relative scroll-mt-20 overflow-hidden border-y border-white/5 bg-ink-900/60 py-24 sm:py-32"
    >
      {/* Lueur bordeaux/ambre */}
      <div className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-bordeaux/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-amber/10 blur-3xl" />

      <div className="container-x relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <Reveal className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="relative">
              <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-amber/20 blur-3xl" />
              <img
                src={asset('/assets/logo-ppp.png')}
                alt="Programme de Performance des Pionniers (PPP)"
                className="h-44 w-auto drop-shadow-[0_8px_30px_rgba(245,163,0,0.25)] sm:h-56"
              />
            </div>
            <p className="eyebrow mt-8">Le programme</p>
            <h2 className="heading mt-3 text-4xl sm:text-5xl">
              P.P.P.
              <span className="block text-amber">
                Programme de Performance des Pionniers
              </span>
            </h2>
            <p className="mt-5 max-w-md text-zinc-400">
              Notre méthode maison pour faire progresser chaque joueur, du
              premier entraînement jusqu’au plus haut niveau de jeu. Un
              encadrement structuré, exigeant et bienveillant.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PILIERS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} className="panel p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-bordeaux/40 text-amber ring-1 ring-amber/20">
                  <p.icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <h3 className="heading mt-4 text-xl">{p.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
