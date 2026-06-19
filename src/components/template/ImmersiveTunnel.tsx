'use client';

import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaTimes, FaChevronLeft, FaChevronRight, FaCheck, FaPaperPlane } from 'react-icons/fa';
import { TUNNEL, SPONTANE, getAllOffers, type Node, type Offer } from '@/data/funnel';
import { getIcon } from '@/lib/funnelIcons';
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
  const [detail, setDetail] = useState<Offer | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [sent, setSent] = useState(false);

  const current = path[path.length - 1];
  const depth = path.length - 1;

  const cardsRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const scrollCards = (dir: number) => {
    const el = cardsRef.current;
    if (!el) return;
    const card = el.querySelector('.imt-card') as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };
  // Affiche les flèches uniquement si le carrousel déborde réellement
  useEffect(() => {
    const el = cardsRef.current;
    if (!el) { setCanScroll(false); return; }
    const check = () => setCanScroll(el.scrollWidth > el.clientWidth + 4);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  });

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
    if (n.offers && n.offers.length === 1) setDetail(n.offers[0]);
  };

  const spontaneous = () => setDetail(SPONTANE);
  const openAll = () => { setDetail(null); setShowAll(true); };

  const back = () => {
    if (sent) return setSent(false);
    if (formOpen) return setFormOpen(false);
    if (detail) {
      setDetail(null);
      // remonter d'un cran seulement si on venait d'un leaf à une seule offre
      if (!showAll && current.offers && current.offers.length === 1) setPath((p) => p.slice(0, -1));
      return;
    }
    if (showAll) return setShowAll(false);
    if (path.length > 1) return setPath((p) => p.slice(0, -1));
    onClose();
  };

  // Vue courante
  const view: 'choices' | 'offers' | 'detail' | 'form' | 'done' | 'all' = sent
    ? 'done'
    : formOpen
    ? 'form'
    : detail
    ? 'detail'
    : showAll
    ? 'all'
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

      {/* Titre (sauf en vue fiche détaillée) */}
      {view !== 'detail' && (
        <div className={`imt-head ${view === 'form' || view === 'offers' || view === 'all' ? 'imt-head-sm' : ''}`}>
          <h2 className="imt-q">
            {view === 'form' ? "S'engager" : view === 'done' ? 'Merci !' : view === 'all' ? 'Toutes les opportunités' : view === 'offers' ? 'Les opportunités pour vous' : current.question}
          </h2>
          <p className="imt-sub">
            {view === 'choices'
              ? isSplit ? 'Choisissez une option pour continuer' : 'Sélectionnez ce qui vous correspond'
              : view === 'offers' || view === 'all'
              ? 'Choisissez une opportunité pour en savoir plus'
              : view === 'form'
              ? detail?.titre
              : 'Votre candidature a bien été envoyée'}
          </p>
          {depth > 0 && view === 'choices' && (
            <div className="imt-progress" style={{ justifyContent: 'center', marginTop: 18, marginBottom: 26 }}>
              {[0, 1, 2, 3].map((n) => (
                <span key={n} className={`imt-dot ${n < depth ? 'on' : ''}`} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ÉTAPE — split (2 choix) */}
      {view === 'choices' && isSplit && current.children && (
        <div className="imt-split">
          <span className="imt-split-divider" />
          {current.children.map((c) => {
            const Icon = getIcon(c.icon);
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

      {/* ÉTAPE — carrousel (3+ choix) */}
      {view === 'choices' && !isSplit && current.children && (
        <div className="imt-stage">
         <div className="imt-stage-col">
          <div className="imt-carousel">
            <div className="imt-cards" ref={cardsRef}>
              {current.children.map((c, i) => {
                const Icon = getIcon(c.icon);
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
            {current.children.length > 1 && canScroll && (
              <div className="imt-arrows">
                <button className="imt-arrow" onClick={() => scrollCards(-1)} aria-label="Précédent"><FaChevronLeft size={14} /></button>
                <button className="imt-arrow" onClick={() => scrollCards(1)} aria-label="Suivant"><FaChevronRight size={14} /></button>
              </div>
            )}
          </div>
          {current.id === 'investir' && (
            <button className="imt-secondary" onClick={spontaneous}>Faire une candidature spontanée</button>
          )}
         </div>
        </div>
      )}

      {/* ÉTAPE — liste des offres (si plusieurs) */}
      {view === 'offers' && current.offers && (
        <div className="imt-stage">
          <div className="imt-stage-col">
            <div className="imt-offers">
              {current.offers.map((o) => (
                <button key={o.id} className="imt-offer" onClick={() => setDetail(o)}>
                  <span className="imt-tag">{o.tag}</span>
                  <h3 className="imt-offer-title">{o.titre}</h3>
                  {o.punchline && <p className="imt-offer-sub">{o.punchline}</p>}
                  <span className="imt-card-cta" style={{ marginTop: 14 }}>Voir l&apos;offre <FaChevronRight size={11} /></span>
                </button>
              ))}
            </div>
            <button className="imt-secondary" onClick={openAll}>Voir toutes les offres</button>
          </div>
        </div>
      )}

      {/* ÉTAPE — toutes les offres (affichage final) */}
      {view === 'all' && (
        <div className="imt-stage imt-scroll">
          <div className="imt-offers imt-offers-all">
            {getAllOffers().map((o) => (
              <button key={o.id} className="imt-offer" onClick={() => setDetail(o)}>
                <span className="imt-tag">{o.tag}</span>
                <h3 className="imt-offer-title">{o.titre}</h3>
                {o.punchline && <p className="imt-offer-sub">{o.punchline}</p>}
                <span className="imt-card-cta" style={{ marginTop: 14 }}>Voir l&apos;offre <FaChevronRight size={11} /></span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ÉTAPE — fiche détaillée */}
      {view === 'detail' && detail && (
        <div className="imt-stage imt-scroll">
          <article className="imt-detail">
            <div className="imt-detail-grid">
              <div>
                <span className="imt-tag imt-tag-lg">{detail.tag}</span>
                <h2 className="imt-detail-title">{detail.titre}</h2>
                {detail.punchline && <p className="imt-detail-punch">{detail.punchline}</p>}
                {detail.paragraphs?.map((p, i) => <p key={i} className="imt-detail-p">{p}</p>)}
                {detail.quote && <p className="imt-detail-quote">« {detail.quote} »</p>}
              </div>
              <div>
                {detail.sections?.map((s, i) => (
                  <div key={i} className="imt-detail-sec">
                    <h4>{s.heading}</h4>
                    <ul>{s.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="imt-detail-actions">
              <button className="imt-btn imt-btn-amber imt-detail-cta" onClick={() => setFormOpen(true)}>
                S&apos;engager <FaChevronRight size={13} />
              </button>
              <button className="imt-secondary" onClick={openAll}>Voir toutes les offres</button>
            </div>
          </article>
        </div>
      )}

      {/* ÉTAPE — formulaire */}
      {view === 'form' && detail && (
        <div className="imt-stage imt-scroll">
          <form className="imt-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="imt-form-grid">
              <div className="imt-field"><label>Prénom</label><input required placeholder="Ton prénom" /></div>
              <div className="imt-field"><label>Nom</label><input required placeholder="Ton nom" /></div>
              <div className="imt-field"><label>Email</label><input type="email" required placeholder="prenom@email.com" /></div>
              <div className="imt-field"><label>Téléphone</label><input type="tel" placeholder="06 12 34 56 78" /></div>
              <div className="imt-field full"><label>Offre visée</label><input defaultValue={detail.titre} readOnly /></div>
              <div className="imt-field full"><label>Message</label><textarea rows={2} placeholder="Parle-nous de ta motivation…" /></div>
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

      {/* ÉTAPE — confirmation */}
      {view === 'done' && (
        <div className="imt-stage">
          <div style={{ textAlign: 'center' }}>
            <span className="imt-card-icon" style={{ width: 84, height: 84, background: 'rgba(46,160,67,0.15)', borderColor: 'rgba(46,160,67,0.4)', color: '#3ad06a' }}>
              <FaCheck size={36} />
            </span>
            <p style={{ maxWidth: 420, margin: '20px auto 0', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Merci pour ton engagement{detail ? <> sur <strong style={{ color: '#f5a300' }}>{detail.titre}</strong></> : ''}. Le staff des Pionniers te recontacte très vite.
            </p>
            <button className="imt-btn imt-btn-amber" style={{ width: 'auto', padding: '13px 28px', marginTop: 22 }} onClick={onClose}>
              Fermer
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
