'use client';

import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaTimes, FaChevronLeft, FaChevronRight, FaCheck, FaPaperPlane } from 'react-icons/fa';
import { TUNNEL, type Node, type Offer } from '@/data/funnel';
import { FUNNEL_ICONS } from '@/lib/funnelIcons';
import { asset } from '@/lib/asset';
import './immersive.css';

const PARTICLES = Array.from({ length: 22 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const r = (n: number) => ((seed * (n + 1)) % 100) / 100;
  return {
    left: `${Math.round(r(1) * 100)}%`,
    top: `${Math.round(r(2) * 100)}%`,
    size: 6 + Math.round(r(3) * 12),
    dur: `${12 + Math.round(r(4) * 12)}s`,
    delay: `${-Math.round(r(5) * 12)}s`,
    x: `${Math.round((r(6) - 0.5) * 80)}px`,
    y: `${Math.round((r(7) - 0.5) * 80)}px`,
    amber: i % 3 === 0,
  };
});

export default function ImmersiveTunnel({ onClose }: { onClose: () => void }) {
  const [path, setPath] = useState<Node[]>([TUNNEL]);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [sent, setSent] = useState(false);

  const current = path[path.length - 1];
  const depth = path.length - 1;

  const cardsRef = useRef<HTMLDivElement>(null);
  const scrollCards = (dir: number) => {
    const el = cardsRef.current;
    if (!el) return;
    const card = el.querySelector('.imt-card') as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const select = (n: Node) => {
    setPath((p) => [...p, n]);
  };
  const back = () => {
    if (sent) return setSent(false);
    if (offer) return setOffer(null);
    if (path.length > 1) setPath((p) => p.slice(0, -1));
    else onClose();
  };

  // Vue courante
  const view: 'choices' | 'offers' | 'form' | 'done' = sent
    ? 'done'
    : offer
    ? 'form'
    : current.offers
    ? 'offers'
    : 'choices';

  const isSplit = view === 'choices' && current.children?.length === 2;

  return (
    <div className="imt-overlay" role="dialog" aria-modal="true">
      {/* particules */}
      <div className="imt-particles" aria-hidden>
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="imt-particle"
            style={
              {
                left: p.left, top: p.top, width: p.size, height: p.size,
                '--p-dur': p.dur, '--p-delay': p.delay, '--p-x': p.x, '--p-y': p.y,
                '--p-color': p.amber ? 'rgba(245,163,0,0.55)' : 'rgba(110,32,27,0.7)',
                animationDelay: p.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* En-tête */}
      <div className="imt-top">
        <button className="imt-iconbtn" onClick={back} aria-label="Retour">
          <FaArrowLeft size={16} />
        </button>
        <img className="imt-logo" src={asset('/assets/logo-club.png')} alt="Pionniers de Touraine" />
        <button className="imt-iconbtn" onClick={onClose} aria-label="Fermer">
          <FaTimes size={18} />
        </button>
      </div>

      {/* Titre */}
      <div className="imt-head">
        <h2 className="imt-q">
          {view === 'form'
            ? "S'engager"
            : view === 'done'
            ? 'Merci !'
            : view === 'offers'
            ? 'Les opportunités pour vous'
            : current.question}
        </h2>
        <p className="imt-sub">
          {view === 'choices'
            ? isSplit
              ? 'Choisissez une option pour continuer'
              : 'Sélectionnez ce qui vous correspond'
            : view === 'offers'
            ? 'Choisissez une offre pour vous engager'
            : view === 'form'
            ? offer?.titre
            : 'Votre candidature a bien été envoyée'}
        </p>
        {depth > 0 && view !== 'done' && (
          <div className="imt-progress" style={{ justifyContent: 'center', marginTop: 16 }}>
            {[0, 1, 2, 3].map((n) => (
              <span key={n} className={`imt-dot ${n < depth ? 'on' : ''}`} />
            ))}
          </div>
        )}
      </div>

      {/* Corps */}
      {view === 'choices' && isSplit && current.children && (
        <div className="imt-split">
          <span className="imt-split-divider" />
          {current.children.map((c) => {
            const Icon = FUNNEL_ICONS[c.icon];
            return (
              <div key={c.id} className="imt-half" onClick={() => select(c)}>
                <div className="imt-half-label">
                  <span className="imt-half-icon"><Icon size={64} /></span>
                  <h3 className="imt-half-title">{c.label}</h3>
                  {c.desc && <p className="imt-half-desc">{c.desc}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === 'choices' && !isSplit && current.children && (
        <div className="imt-stage">
          <div className="imt-carousel">
            {current.children.length > 1 && (
              <button className="imt-arrow imt-arrow-prev" onClick={() => scrollCards(-1)} aria-label="Précédent">
                <FaChevronLeft size={18} />
              </button>
            )}
            <div className="imt-cards" ref={cardsRef}>
              {current.children.map((c, i) => {
                const Icon = FUNNEL_ICONS[c.icon];
                return (
                  <button key={c.id} className="imt-card" onClick={() => select(c)}>
                    <span className="imt-card-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="imt-card-icon"><Icon size={30} /></span>
                    <h3 className="imt-card-title">{c.label}</h3>
                    {c.desc && <p className="imt-card-desc">{c.desc}</p>}
                    <span className="imt-card-cta">Sélectionner <FaChevronRight size={11} /></span>
                  </button>
                );
              })}
            </div>
            {current.children.length > 1 && (
              <button className="imt-arrow imt-arrow-next" onClick={() => scrollCards(1)} aria-label="Suivant">
                <FaChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {view === 'offers' && current.offers && (
        <div className="imt-stage">
          <div className="imt-offers">
            {current.offers.map((o) => (
              <div key={o.titre} className="imt-offer">
                <h3 className="imt-offer-title">{o.titre}</h3>
                <div className="imt-tags">
                  {o.tags.map((t) => <span key={t} className="imt-tag">{t}</span>)}
                </div>
                <button className="imt-btn" onClick={() => setOffer(o)}>
                  S&apos;engager <FaChevronRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'form' && offer && (
        <div className="imt-stage">
          <form className="imt-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="imt-form-grid">
              <div className="imt-field"><label>Prénom</label><input required placeholder="Ton prénom" /></div>
              <div className="imt-field"><label>Nom</label><input required placeholder="Ton nom" /></div>
              <div className="imt-field full"><label>Email</label><input type="email" required placeholder="prenom@email.com" /></div>
              <div className="imt-field full"><label>Téléphone</label><input type="tel" placeholder="06 12 34 56 78" /></div>
              <div className="imt-field full"><label>Offre visée</label><input defaultValue={offer.titre} readOnly /></div>
              <div className="imt-field full"><label>Message</label><textarea rows={3} placeholder="Parle-nous de ta motivation…" /></div>
            </div>
            <button type="submit" className="imt-btn imt-btn-amber" style={{ marginTop: 18 }}>
              Envoyer ma candidature <FaPaperPlane size={13} />
            </button>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 12 }}>
              Démo de présentation : le formulaire n&apos;envoie rien.
            </p>
          </form>
        </div>
      )}

      {view === 'done' && (
        <div className="imt-stage">
          <div style={{ textAlign: 'center' }}>
            <span className="imt-card-icon" style={{ width: 84, height: 84, background: 'rgba(46,160,67,0.15)', borderColor: 'rgba(46,160,67,0.4)', color: '#3ad06a' }}>
              <FaCheck size={36} />
            </span>
            <p style={{ maxWidth: 420, margin: '20px auto 0', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Merci pour ton engagement{offer ? <> sur <strong style={{ color: '#f5a300' }}>{offer.titre}</strong></> : ''}. Le staff des Pionniers te recontacte très vite.
            </p>
            <button className="imt-btn imt-btn-amber" style={{ width: 'auto', padding: '13px 28px', marginTop: 22 }} onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Bas : retour */}
      {view !== 'done' && (
        <div className="imt-bottom">
          <button className="imt-back" onClick={back}>
            <FaArrowLeft size={13} /> {path.length > 1 || offer ? 'Retour' : 'Quitter'}
          </button>
        </div>
      )}
    </div>
  );
}
