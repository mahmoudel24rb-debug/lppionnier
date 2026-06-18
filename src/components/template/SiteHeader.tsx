'use client';

import { useState } from 'react';
import { FaPhoneAlt, FaBars, FaTimes } from 'react-icons/fa';
import { asset } from '@/lib/asset';

const LINKS = [
  { href: '#top', label: 'Accueil' },
  { href: '#adhesions', label: 'Adhésion' },
  { href: '#club', label: 'Le club' },
  { href: '#sections', label: 'Boutique' },
  { href: '#sections', label: 'Partenaires' },
];

const PHONE = '06 07 08 09 10';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const openTunnel = () => window.dispatchEvent(new Event('open-tunnel'));

  return (
    <header className="rf-header" id="top">
      <nav className="rf-nav">
        <a href="#top" aria-label="Accueil">
          <img className="rf-logo" src={asset('/assets/refonte/logo-pionniers.svg')} alt="Pionniers de Touraine" />
        </a>

        <div className="rf-links">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href}>{l.label}</a>
          ))}
        </div>

        <div className="rf-right">
          <a className="rf-phone" href={`tel:${PHONE.replace(/\s/g, '')}`}>
            <FaPhoneAlt size={14} />
            <span>{PHONE}</span>
          </a>
          <button className="rf-join" data-open-tunnel onClick={openTunnel}>Nous rejoindre</button>
          <button className="rf-burger" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            {open ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        <div className={`rf-mobile-menu ${open ? 'open' : ''}`}>
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a className="rf-phone-mobile" href={`tel:${PHONE.replace(/\s/g, '')}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
            <FaPhoneAlt size={13} /> {PHONE}
          </a>
          <button className="rf-join" data-open-tunnel onClick={() => { setOpen(false); openTunnel(); }}>Nous rejoindre</button>
        </div>
      </nav>
    </header>
  );
}
