import { Instagram, Facebook, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { asset } from '@/lib/asset';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink-950">
      {/* Bandeau CTA */}
      <div className="container-x">
        <div className="relative -mt-px overflow-hidden rounded-3xl border border-amber/20 bg-gradient-to-br from-bordeaux/40 via-ink-900 to-ink-900 p-10 text-center sm:p-14">
          <div className="pointer-events-none absolute inset-0 bg-radial-amber" />
          <h2 className="heading relative text-3xl sm:text-5xl">
            Prêt à devenir un Pionnier ?
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-zinc-300">
            Une porte, un clic, ta place dans l’équipe. Lance-toi dès maintenant.
          </p>
          <div className="relative mt-7">
            <a href="#rejoindre" className="btn-primary">
              Nous rejoindre
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="container-x py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <img
                src={asset('/assets/logo-club.png')}
                alt="Pionniers de Touraine"
                className="h-9 w-auto"
              />
              <span className="font-display text-lg font-semibold uppercase tracking-wide text-white">
                Pionniers <span className="text-amber">de Touraine</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              Club de football américain & flag football de la région de Tours.
              Le terrain n’attend que toi.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Mail, label: 'Email' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:border-amber/50 hover:text-amber"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Navigation
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  { href: '#club', label: 'Le club' },
                  { href: '#ppp', label: 'Programme PPP' },
                  { href: '#rejoindre', label: 'Nous rejoindre' },
                  { href: '#adhesions', label: 'Adhésions' },
                  { href: '#faq', label: 'Infos pratiques' },
                ].map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-zinc-400 transition-colors hover:text-amber"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Contact
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber" />
                  Tours, Touraine
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber" />
                  contact@pionniers-touraine.fr
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-zinc-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Pionniers de Touraine. Tous droits réservés.</p>
          <p>Maquette de démonstration — contenus à personnaliser.</p>
        </div>
      </div>
    </footer>
  );
}
