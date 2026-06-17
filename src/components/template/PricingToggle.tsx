'use client'

import { useEffect } from 'react'

// Le port SSR fournit le toggle Sportix (Toggle Wrapper > 2x Toggle "Mensuel"/"Annuel")
// mais sans logique. Ce composant client, monté dans le layout :
//  - renomme "Annuel" -> "Courtes durées"
//  - câble les clics pour basculer body[data-pricing] = mensuel | courtes
//  - applique l'état actif (la pilule coulissante d'origine est masquée en CSS)
// Les grilles affichent le bon jeu de cartes via CSS ([data-ptab] + body[data-pricing]).

export default function PricingToggle() {
  useEffect(() => {
    const wrappers = Array.from(
      document.querySelectorAll<HTMLElement>('[data-framer-name="Toggle Wrapper"]'),
    )
    if (!wrappers.length) return

    const ACTIVE = { bg: 'var(--token-fcc50f27-48bf-4381-8929-2fd53a7bb0e3, rgb(55, 97, 49))', fg: 'rgb(255,255,255)' }
    const cleanups: (() => void)[] = []

    const setTab = (tab: 'mensuel' | 'courtes') => {
      document.body.setAttribute('data-pricing', tab)
      for (const w of wrappers) {
        const toggles = Array.from(w.querySelectorAll<HTMLElement>('[data-framer-name="Toggle"]'))
        toggles.forEach((t, idx) => {
          const isActive = (idx === 0 && tab === 'mensuel') || (idx === 1 && tab === 'courtes')
          t.style.backgroundColor = isActive ? ACTIVE.bg : 'transparent'
          t.style.borderRadius = '50px'
          t.style.transition = 'background-color .2s ease'
          const p = t.querySelector<HTMLElement>('p, .framer-text')
          if (p) p.style.color = isActive ? ACTIVE.fg : 'var(--token-fcc50f27-48bf-4381-8929-2fd53a7bb0e3, rgb(55, 97, 49))'
        })
      }
    }

    for (const w of wrappers) {
      const toggles = Array.from(w.querySelectorAll<HTMLElement>('[data-framer-name="Toggle"]'))
      // renomme le 2e onglet
      const second = toggles[1]?.querySelector('p, .framer-text')
      if (second && /annuel|yearly/i.test(second.textContent || '')) second.textContent = 'Courtes durées'

      const onM = () => setTab('mensuel')
      const onC = () => setTab('courtes')
      toggles[0]?.addEventListener('click', onM)
      toggles[1]?.addEventListener('click', onC)
      toggles.forEach((t) => (t.style.cursor = 'pointer'))
      cleanups.push(() => {
        toggles[0]?.removeEventListener('click', onM)
        toggles[1]?.removeEventListener('click', onC)
      })
    }

    setTab('mensuel') // état initial
    return () => cleanups.forEach((c) => c())
  }, [])

  return null
}
