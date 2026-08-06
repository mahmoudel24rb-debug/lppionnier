'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Bascule de langue FR/EN côté client : même structure, mêmes images,
 * seul le contenu texte change. Persistée dans localStorage (pnr-lang).
 */
export type Lang = 'fr' | 'en';

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'fr',
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');

  useEffect(() => {
    if (window.localStorage.getItem('pnr-lang') === 'en') {
      setLangState('en');
      document.documentElement.lang = 'en';
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem('pnr-lang', l);
    document.documentElement.lang = l;
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** Sélecteur FR | EN (header desktop + menu mobile). */
export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="rf-lang" role="group" aria-label="Langue / Language">
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          className={lang === l ? 'on' : ''}
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
