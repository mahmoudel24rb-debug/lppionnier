'use client';

import { useState } from 'react';
import { FaPhoneAlt, FaBars, FaTimes } from 'react-icons/fa';
import { asset } from '@/lib/asset';
import { useLang, LangToggle } from '@/lib/i18n';

// Ancres de la landing (une seule page) — doivent correspondre aux id des
// sections. `blog/` est une vraie route (concaténée à home qui finit par /).
const LINKS = [
  { href: '#top', fr: 'Accueil', en: 'Home' },
  { href: '#club', fr: 'Le club', en: 'The club' },
  { href: '#sections', fr: 'Nos sections', en: 'Our sections' },
  { href: '#adhesions', fr: 'Adhésions', en: 'Memberships' },
  { href: '#infos', fr: 'Infos pratiques', en: 'Practical info' },
  { href: 'blog/', fr: 'Blog', en: 'Blog' },
];

const PHONE = '07 87 01 80 26';
const PHONE_HREF = 'tel:+33787018026';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();
  const openTunnel = () => window.dispatchEvent(new Event('open-tunnel'));
  const joinLabel = lang === 'en' ? 'Join us' : 'Nous rejoindre';
  // Ancres préfixées par la home : depuis /mentions-legales, "#club" seul
  // pointerait vers une ancre inexistante de la page courante.
  const home = asset('/');

  return (
    <header className="rf-header">
      <nav className="rf-nav">
        <a href={`${home}#top`} aria-label={lang === 'en' ? 'Home' : 'Accueil'}>
          <img className="rf-logo" src={asset('/assets/refonte/logo-pionniers.svg')} alt="Pionniers de Touraine" />
        </a>

        <div className="rf-links">
          {LINKS.map((l) => (
            <a key={l.href} href={`${home}${l.href}`}>{lang === 'en' ? l.en : l.fr}</a>
          ))}
        </div>

        <div className="rf-right">
          <LangToggle />
          <a className="rf-phone" href={PHONE_HREF}>
            <FaPhoneAlt size={14} />
            <span>{PHONE}</span>
          </a>
          <button className="rf-join" data-open-tunnel onClick={openTunnel}>{joinLabel}</button>
          <button className="rf-burger" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            {open ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        <div className={`rf-mobile-menu ${open ? 'open' : ''}`}>
          {LINKS.map((l) => (
            <a key={l.href} href={`${home}${l.href}`} onClick={() => setOpen(false)}>{lang === 'en' ? l.en : l.fr}</a>
          ))}
          <a className="rf-phone-mobile" href={PHONE_HREF} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
            <FaPhoneAlt size={13} /> {PHONE}
          </a>
          <div style={{ padding: '4px 14px' }}><LangToggle /></div>
          <button className="rf-join" data-open-tunnel onClick={() => { setOpen(false); openTunnel(); }}>{joinLabel}</button>
        </div>
      </nav>
    </header>
  );
}
