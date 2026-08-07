'use client';

import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaTimes, FaChevronLeft, FaChevronRight, FaCheck, FaPaperPlane } from 'react-icons/fa';
import { TUNNEL, SPONTANE, resolveOffer, type Node, type Offer, type OfferCategory } from '@/data/funnel';
import { TUNNEL_EN, SPONTANE_EN } from '@/data/funnel.en';
import { getEmoji } from '@/lib/funnelIcons';
import { asset } from '@/lib/asset';
import { track } from '@/lib/track';
import { useLang } from '@/lib/i18n';
import AllOffersBoard from './AllOffersBoard';
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

const UI = {
  fr: {
    back: 'Retour',
    close: 'Fermer',
    engage: "S'engager",
    merci: 'Merci !',
    all: 'Toutes les opportunités',
    forYou: 'Les opportunités pour vous',
    subSplit: 'Choisissez une option pour continuer',
    subCards: 'Sélectionnez ce qui vous correspond',
    subOffers: 'Choisissez une opportunité pour en savoir plus',
    subDone: 'Votre candidature a bien été envoyée',
    select: 'Sélectionner',
    prev: 'Précédent',
    next: 'Suivant',
    spontane: 'Faire une candidature spontanée',
    voirOffre: "Voir l'offre",
    voirToutes: 'Voir toutes les offres',
    prenom: 'Prénom',
    prenomPh: 'Ton prénom',
    nom: 'Nom',
    nomPh: 'Ton nom',
    email: 'Email',
    emailPh: 'prenom@email.com',
    tel: 'Téléphone',
    telPh: '06 12 34 56 78',
    offreVisee: 'Offre visée',
    message: 'Message',
    messagePh: 'Parle-nous de ta motivation…',
    envoyer: 'Envoyer ma candidature',
    envoiEnCours: 'Envoi en cours…',
    erreurAvant: "L'envoi n'a pas abouti. Réessaie dans un instant ou ",
    erreurLien: 'écris-nous directement par email',
    erreurApres: '.',
    merciPre: 'Merci pour ton engagement',
    merciSur: ' sur ',
    merciPost: '. Le staff des Pionniers te recontacte très vite.',
  },
  en: {
    back: 'Back',
    close: 'Close',
    engage: 'Get involved',
    merci: 'Thank you!',
    all: 'All opportunities',
    forYou: 'Opportunities for you',
    subSplit: 'Choose an option to continue',
    subCards: 'Select what suits you best',
    subOffers: 'Pick an opportunity to learn more',
    subDone: 'Your application has been sent',
    select: 'Select',
    prev: 'Previous',
    next: 'Next',
    spontane: 'Send an open application',
    voirOffre: 'View offer',
    voirToutes: 'View all offers',
    prenom: 'First name',
    prenomPh: 'Your first name',
    nom: 'Last name',
    nomPh: 'Your last name',
    email: 'Email',
    emailPh: 'name@email.com',
    tel: 'Phone',
    telPh: '+33 6 12 34 56 78',
    offreVisee: 'Selected offer',
    message: 'Message',
    messagePh: 'Tell us what motivates you…',
    envoyer: 'Send my application',
    envoiEnCours: 'Sending…',
    erreurAvant: 'Something went wrong. Try again in a moment or ',
    erreurLien: 'email us directly',
    erreurApres: '.',
    merciPre: 'Thank you for signing up',
    merciSur: ' for ',
    merciPost: '. The Pionniers staff will get back to you very soon.',
  },
};

export default function ImmersiveTunnel({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const ui = UI[lang];
  const root = lang === 'en' ? TUNNEL_EN : TUNNEL;
  const spontane = lang === 'en' ? SPONTANE_EN : SPONTANE;

  const [path, setPath] = useState<Node[]>([root]);
  const [detail, setDetail] = useState<Offer | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [sent, setSent] = useState(false);
  // Envoi réel vers candidature.php (o2switch) ; sur la démo GitHub Pages le
  // POST échoue → message d'erreur avec repli mailto.
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);
  // État du job board remonté ici : conservé pendant un aller-retour fiche ↔ board.
  const [boardQuery, setBoardQuery] = useState('');
  const [boardCat, setBoardCat] = useState<'tous' | OfferCategory>('tous');

  // La langue ne peut changer que tunnel fermé (le toggle est sous l'overlay),
  // mais on resynchronise la racine par sécurité.
  useEffect(() => {
    setPath([root]);
    setDetail(null);
    setFormOpen(false);
    setShowAll(false);
    setSent(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Échap dans un champ rempli : on vide le focus, on ne ferme pas le tunnel.
      const el = document.activeElement;
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        if (el.value !== '') {
          el.blur();
          return;
        }
      }
      onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Mesure d'audience (anonyme : aucun texte saisi n'est envoyé).
  useEffect(() => { track('tunnel-open'); }, []);
  useEffect(() => { if (detail) track('offer-view', { id: detail.id }); }, [detail]);

  const select = (n: Node) => {
    setPath((p) => [...p, n]);
    if (n.offers && n.offers.length === 1) setDetail(n.offers[0]);
  };

  const spontaneous = () => setDetail(spontane);
  const openAll = () => { setDetail(null); setShowAll(true); track('all-open'); };

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
  const detailEmoji = detail ? getEmoji(resolveOffer(detail).icon) : null;

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
                '--p-color': p.amber ? 'rgba(255,173,0,0.55)' : 'rgba(110,32,27,0.7)',
                animationDelay: p.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* En-tête */}
      <div className="imt-top">
        <button className="imt-iconbtn" onClick={back} aria-label={ui.back}>
          <FaArrowLeft size={16} />
        </button>
        <img className="imt-logo" src={asset('/assets/logo-club.png')} alt="Pionniers de Touraine" />
        <button className="imt-iconbtn" onClick={onClose} aria-label={ui.close}>
          <FaTimes size={18} />
        </button>
      </div>

      {/* Titre (sauf en vue fiche détaillée) */}
      {view !== 'detail' && (
        <div className={`imt-head ${view === 'form' || view === 'offers' || view === 'all' ? 'imt-head-sm' : ''}`}>
          <h2 className="imt-q">
            {view === 'form' ? ui.engage : view === 'done' ? ui.merci : view === 'all' ? ui.all : view === 'offers' ? ui.forYou : current.question}
          </h2>
          <p className="imt-sub">
            {view === 'choices'
              ? isSplit ? ui.subSplit : ui.subCards
              : view === 'offers' || view === 'all'
              ? ui.subOffers
              : view === 'form'
              ? detail?.titre.replace(/\n/g, ' ')
              : ui.subDone}
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
            return (
              <div key={c.id} className="imt-half" onClick={() => select(c)}>
                <div className="imt-half-label">
                  <span className="imt-half-icon"><img src={getEmoji(c.icon)} alt="" /></span>
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
                return (
                  <button key={c.id} className="imt-card" onClick={() => select(c)}>
                    <span className="imt-card-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="imt-card-icon"><img src={getEmoji(c.icon)} alt="" /></span>
                    <h3 className="imt-card-title">{c.label}</h3>
                    {c.desc && <p className="imt-card-desc">{c.desc}</p>}
                    <span className="imt-card-cta">{ui.select} <FaChevronRight size={11} /></span>
                  </button>
                );
              })}
            </div>
            {current.children.length > 1 && canScroll && (
              <div className="imt-arrows">
                <button className="imt-arrow" onClick={() => scrollCards(-1)} aria-label={ui.prev}><FaChevronLeft size={14} /></button>
                <button className="imt-arrow" onClick={() => scrollCards(1)} aria-label={ui.next}><FaChevronRight size={14} /></button>
              </div>
            )}
          </div>
          {current.id === 'investir' && (
            <button className="imt-secondary" onClick={spontaneous}>{ui.spontane}</button>
          )}
         </div>
        </div>
      )}

      {/* ÉTAPE — liste des offres (si plusieurs) */}
      {view === 'offers' && current.offers && (
        <div className="imt-stage">
          <div className="imt-stage-col">
            <div className="imt-offers">
              {current.offers.map((o) => {
                return (
                  <button key={o.id} className="imt-offer" onClick={() => setDetail(o)}>
                    <span className="imt-offer-head">
                      <span className="imt-offer-icon"><img src={getEmoji(resolveOffer(o).icon)} alt="" /></span>
                      <span className="imt-tag">{o.tag}</span>
                    </span>
                    <h3 className="imt-offer-title">{o.titre}</h3>
                    {o.punchline && <p className="imt-offer-sub">{o.punchline}</p>}
                    <span className="imt-card-cta" style={{ marginTop: 14 }}>{ui.voirOffre} <FaChevronRight size={11} /></span>
                  </button>
                );
              })}
            </div>
            <button className="imt-secondary" onClick={openAll}>{ui.voirToutes}</button>
          </div>
        </div>
      )}

      {/* ÉTAPE — toutes les offres (affichage final) */}
      {view === 'all' && (
        <AllOffersBoard
          query={boardQuery}
          onQuery={setBoardQuery}
          cat={boardCat}
          onCat={setBoardCat}
          onSelect={setDetail}
        />
      )}

      {/* ÉTAPE — fiche détaillée */}
      {view === 'detail' && detail && (
        <div className="imt-stage imt-scroll">
          <article className="imt-detail">
            <div className="imt-detail-head">
              {detailEmoji && <span className="imt-offer-icon imt-detail-iconbadge"><img src={detailEmoji} alt="" /></span>}
              <span className="imt-tag imt-tag-lg">{detail.tag}</span>
            </div>
            <h2 className="imt-detail-title">{detail.titre}</h2>
            {detail.punchline && <p className="imt-detail-punch">{detail.punchline}</p>}
            {detail.paragraphs?.map((p, i) => <p key={i} className="imt-detail-p">{p}</p>)}
            {detail.sections?.map((s, i) => (
              <div key={i} className="imt-detail-sec">
                <h4>{s.heading}</h4>
                <ul>{s.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
              </div>
            ))}
            {detail.quote && <p className="imt-detail-quote">« {detail.quote} »</p>}
            <div className="imt-detail-actions">
              <button
                className="imt-btn imt-btn-amber imt-detail-cta"
                onClick={() => { track('cta-engage', { id: detail.id }); setSendError(false); setFormOpen(true); }}
              >
                {ui.engage} <FaChevronRight size={13} />
              </button>
              <button className="imt-secondary" onClick={openAll}>{ui.voirToutes}</button>
            </div>
          </article>
        </div>
      )}

      {/* ÉTAPE — formulaire */}
      {view === 'form' && detail && (
        <div className="imt-stage imt-scroll">
          <form
            className="imt-form"
            onSubmit={async (e) => {
              e.preventDefault();
              if (sending) return;
              const body = new FormData(e.currentTarget);
              setSending(true);
              setSendError(false);
              try {
                const res = await fetch(asset('/candidature.php'), { method: 'POST', body });
                const data = res.ok ? await res.json().catch(() => null) : null;
                if (data && data.ok) {
                  track('form-submit', { id: detail.id });
                  setSent(true);
                } else {
                  setSendError(true);
                }
              } catch {
                setSendError(true);
              } finally {
                setSending(false);
              }
            }}
          >
            {/* Honeypot anti-spam : caché aux humains, rempli par les robots */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sc-field-trap" />
            <input type="hidden" name="offre_id" value={detail.id} />
            <input type="hidden" name="lang" value={lang} />
            <div className="imt-form-grid">
              <div className="imt-field"><label>{ui.prenom}</label><input name="prenom" required placeholder={ui.prenomPh} /></div>
              <div className="imt-field"><label>{ui.nom}</label><input name="nom" required placeholder={ui.nomPh} /></div>
              <div className="imt-field"><label>{ui.email}</label><input name="email" type="email" required placeholder={ui.emailPh} /></div>
              <div className="imt-field"><label>{ui.tel}</label><input name="telephone" type="tel" placeholder={ui.telPh} /></div>
              <div className="imt-field full"><label>{ui.offreVisee}</label><input defaultValue={detail.titre.replace(/\n/g, ' ')} readOnly /></div>
              <div className="imt-field full"><label>{ui.message}</label><textarea name="message" rows={2} placeholder={ui.messagePh} /></div>
            </div>
            <button type="submit" className="imt-btn imt-btn-amber" style={{ marginTop: 18 }} disabled={sending}>
              {sending ? ui.envoiEnCours : ui.envoyer} <FaPaperPlane size={13} />
            </button>
            {sendError && (
              <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,180,120,0.9)', marginTop: 12 }}>
                {ui.erreurAvant}
                <a
                  href={`mailto:recrutement@pionniersdetouraine.fr?subject=${encodeURIComponent(`Candidature - ${detail.titre.replace(/\n/g, ' ')}`)}`}
                  style={{ color: '#ffad00', textDecoration: 'underline' }}
                >
                  {ui.erreurLien}
                </a>
                {ui.erreurApres}
              </p>
            )}
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
              {ui.merciPre}{detail ? <>{ui.merciSur}<strong style={{ color: '#ffad00' }}>{detail.titre.replace(/\n/g, ' ')}</strong></> : ''}{ui.merciPost}
            </p>
            <button className="imt-btn imt-btn-amber" style={{ width: 'auto', padding: '15px 28px 11px', marginTop: 22 }} onClick={onClose}>
              {ui.close}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
