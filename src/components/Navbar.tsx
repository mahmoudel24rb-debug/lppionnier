'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { asset } from '@/lib/asset';

const LINKS = [
  { href: '#club', label: 'Le club' },
  { href: '#ppp', label: 'Programme PPP' },
  { href: '#rejoindre', label: 'Nous rejoindre' },
  { href: '#adhesions', label: 'Adhésions' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between sm:h-20">
        <a href="#top" className="flex items-center gap-3">
          <img
            src={asset('/assets/logo-club.png')}
            alt="Pionniers de Touraine"
            className="h-8 w-auto sm:h-10"
          />
          <span className="hidden font-display text-lg font-semibold uppercase tracking-wide text-white sm:block">
            Pionniers <span className="text-amber">de Touraine</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-zinc-300 transition-colors hover:text-amber"
            >
              {l.label}
            </a>
          ))}
          <a href="#rejoindre" className="btn-primary !px-5 !py-2.5">
            Nous rejoindre
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white md:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="border-t border-white/10 bg-ink-950/95 backdrop-blur-md md:hidden">
          <nav className="container-x flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-zinc-200 transition-colors hover:bg-white/5 hover:text-amber"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#rejoindre"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2"
            >
              Nous rejoindre
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
