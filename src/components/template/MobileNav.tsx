'use client'

import { useEffect, useState } from 'react'

// Le port SSR de Framer fournit le burger (data-framer-name="Mobile Menu Icon")
// mais PAS la logique d'ouverture (JS Framer non porté) ni le panneau de liens.
// Ce composant client, monté une fois dans le layout, câble tous les burgers
// présents (un par variante de header) et affiche un overlay plein écran.

const LINKS: { label: string; href: string; sub?: { label: string; href: string }[] }[] = [
  { label: 'Accueil', href: '/' },
  {
    label: 'Nos espaces',
    href: '/espaces',
    sub: [
      { label: 'Cours collectifs', href: '/services/cours' },
      { label: 'Entraînement fonctionnel', href: '/espaces/fonctionnel' },
      { label: 'Cross / Cardio', href: '/espaces/cross-cardio' },
    ],
  },
  { label: 'Services', href: '/services' },
  { label: 'Tarifs', href: '/tarifs' },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const burgers = Array.from(
      document.querySelectorAll('[data-framer-name="Mobile Menu Icon"]'),
    )
    const toggle = (e: Event) => {
      e.preventDefault()
      setOpen((v) => !v)
    }
    // activation clavier (Entrée / Espace) pour l'accessibilité du burger
    const onKey = (e: Event) => {
      const k = (e as KeyboardEvent).key
      if (k === 'Enter' || k === ' ') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    burgers.forEach((b) => {
      ;(b as HTMLElement).style.cursor = 'pointer'
      b.addEventListener('click', toggle)
      b.addEventListener('keydown', onKey)
    })
    return () =>
      burgers.forEach((b) => {
        b.removeEventListener('click', toggle)
        b.removeEventListener('keydown', onKey)
      })
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    document
      .querySelectorAll('[data-framer-name="Mobile Menu Icon"]')
      .forEach((b) => b.setAttribute('aria-expanded', String(open)))
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: 'rgba(15, 23, 18, 0.97)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        fontFamily: '"Inter", sans-serif',
        overflowY: 'auto',
      }}
    >
      <button
        aria-label="Fermer le menu"
        onClick={() => setOpen(false)}
        style={{
          alignSelf: 'flex-end',
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(255,255,255,0.12)',
          color: '#fff',
          fontSize: 24,
          lineHeight: '44px',
          cursor: 'pointer',
        }}
      >
        ×
      </button>

      <nav style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {LINKS.map((l) => (
          <div key={l.href}>
            <a
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                color: '#fff',
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                textDecoration: 'none',
                padding: '14px 0',
              }}
            >
              {l.label}
            </a>
            {l.sub && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 4, marginBottom: 6 }}>
                {l.sub.map((s) => (
                  <a
                    key={s.href}
                    href={s.href}
                    onClick={() => setOpen(false)}
                    style={{
                      color: 'rgba(255,255,255,0.65)',
                      fontSize: 17,
                      textDecoration: 'none',
                      padding: '7px 0',
                    }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <a
        href="/contact"
        onClick={() => setOpen(false)}
        style={{
          marginTop: 'auto',
          marginBottom: 12,
          display: 'block',
          textAlign: 'center',
          background: '#1f5e3a',
          color: '#fff',
          fontWeight: 700,
          fontSize: 18,
          textDecoration: 'none',
          padding: '18px',
          borderRadius: 70,
        }}
      >
        Nous rejoindre
      </a>
    </div>
  )
}
