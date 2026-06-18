'use client';

import { FaArrowRight, FaRegCompass } from 'react-icons/fa';

// Carte du hero : remplace l'ancien petit formulaire par un appel à lancer
// le parcours immersif plein écran.
export default function HeroCTA() {
  const open = () => window.dispatchEvent(new Event('open-tunnel'));
  return (
    <div
      id="rejoindre"
      style={{
        width: '100%', maxWidth: 440, scrollMarginTop: 90,
        background: 'rgba(20,14,16,0.55)', border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(14px)', borderRadius: 22, padding: 'clamp(26px,3.5vw,40px)',
        color: '#fff', fontFamily: '"Inter", sans-serif',
        boxShadow: '0 30px 70px -30px rgba(0,0,0,0.7)',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 54, height: 54, borderRadius: 14, background: 'rgba(245,163,0,0.14)', color: '#f5a300', border: '1px solid rgba(245,163,0,0.3)' }}>
        <FaRegCompass size={26} />
      </span>
      <h3 style={{ fontSize: 'clamp(22px,2.4vw,28px)', fontWeight: 700, letterSpacing: '-0.02em', margin: '20px 0 8px' }}>
        Trouve ta place chez les Pionniers
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.62)', lineHeight: 1.6, margin: '0 0 24px' }}>
        En quelques clics, exprime ta motivation — jouer, t&apos;investir ou soutenir — et on te guide vers les bonnes opportunités.
      </p>
      <button
        type="button"
        onClick={open}
        data-open-tunnel
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10, width: '100%', justifyContent: 'center',
          padding: '16px', borderRadius: 999, border: 'none', cursor: 'pointer',
          background: '#f5a300', color: '#0a0709', fontWeight: 800, fontSize: 16, fontFamily: 'inherit',
        }}
      >
        Commencer le parcours <FaArrowRight size={15} />
      </button>
      <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '14px 0 0' }}>
        2 minutes · sans engagement
      </p>
    </div>
  );
}
