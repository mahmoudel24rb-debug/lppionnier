'use client'

import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ArrowRight,
} from 'lucide-react'
import { BRANCHES, type Branche, type Choix, type Annonce } from '@/data/funnel'
import { FUNNEL_ICONS } from '@/lib/funnelIcons'

const BORDEAUX = '#6e201b'
const AMBER = '#f5a300'
const INK = '#1a1a1a'
const GREY = '#6b6b6b'

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 'clamp(24px,3.5vw,38px)',
  boxShadow: '0 24px 60px rgba(74,21,18,0.12)',
  fontFamily: '"Inter", sans-serif',
  width: '100%',
}

export default function HeroTunnel() {
  const [branche, setBranche] = useState<Branche | null>(null)
  const [choix, setChoix] = useState<Choix | null>(null)
  const [annonce, setAnnonce] = useState<Annonce | null>(null)
  const [sent, setSent] = useState(false)

  const step = sent ? 4 : annonce ? 3 : choix ? 2 : branche ? 1 : 0

  const reset = () => {
    setBranche(null); setChoix(null); setAnnonce(null); setSent(false)
  }
  const back = () => {
    if (annonce) setAnnonce(null)
    else if (choix) setChoix(null)
    else if (branche) setBranche(null)
  }

  const eyebrow = (txt: string) => (
    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: AMBER }}>{txt}</p>
  )
  const title = (txt: string) => (
    <h3 style={{ fontSize: 'clamp(22px,2.4vw,28px)', fontWeight: 700, letterSpacing: '-0.02em', margin: '6px 0 22px', color: INK }}>{txt}</h3>
  )

  // ---- Confirmation ----
  if (step === 4 && annonce) {
    return (
      <div style={{ ...card, textAlign: 'center' }} role="status">
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#e8f3e8', color: '#2f7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <Check size={30} strokeWidth={2.5} />
        </div>
        <h3 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 10px', color: INK }}>Candidature envoyée&nbsp;!</h3>
        <p style={{ color: GREY, lineHeight: 1.6, margin: '0 auto', maxWidth: 320 }}>
          Merci pour ton engagement sur <strong style={{ color: BORDEAUX }}>{annonce.titre}</strong>. Le staff des Pionniers te recontacte très vite.
        </p>
        <button onClick={reset} style={btn('ghost')}>Revenir au début</button>
        <p style={{ color: '#a3a3a3', fontSize: 12, marginTop: 16 }}>Démo — aucune donnée n&apos;est réellement envoyée.</p>
      </div>
    )
  }

  // ---- Formulaire ----
  if (step === 3 && annonce && branche && choix) {
    return (
      <form style={card} onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
        <BackBar onBack={back} label={`${branche.label} · ${choix.label}`} />
        {eyebrow("S'engager")}
        {title(annonce.titre)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="bg-cf-grid">
          <Field label="Prénom" placeholder="Ton prénom" required />
          <Field label="Nom" placeholder="Ton nom" required />
          <Field label="Email" type="email" placeholder="prenom@email.com" required />
          <Field label="Téléphone" type="tel" placeholder="06 12 34 56 78" />
        </div>
        <div style={{ marginTop: 14 }}>
          <Field label="Poste / mission" defaultValue={annonce.titre} readOnly />
        </div>
        <button type="submit" style={btn('primary')}>
          S&apos;engager <ArrowRight size={17} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
        </button>
        <p style={{ color: '#a3a3a3', fontSize: 12, textAlign: 'center', margin: '14px 0 0' }}>Démo de présentation — le formulaire n&apos;envoie rien.</p>
      </form>
    )
  }

  // ---- Étapes de choix ----
  return (
    <div style={card}>
      {step > 0 && <BackBar onBack={back} label={branche ? (choix ? `${branche.label} · ${choix.label}` : branche.label) : ''} />}
      {eyebrow('Nous rejoindre')}
      {title(
        step === 0 ? 'Tu souhaites…' : step === 1 && branche ? branche.question : choix?.intro ?? ''
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {step === 0 && BRANCHES.map((b) => (
          <Tile key={b.key} icon={b.icon} label={b.label} sub={b.sousLabel} onClick={() => setBranche(b)} />
        ))}
        {step === 1 && branche && branche.choix.map((c) => (
          <Tile key={c.key} icon={c.icon} label={c.label} sub={c.sousLabel} onClick={() => setChoix(c)} />
        ))}
        {step === 2 && choix && choix.annonces.map((a) => (
          <AnnonceRow key={a.id} annonce={a} onClick={() => setAnnonce(a)} />
        ))}
      </div>
    </div>
  )
}

/* ---------- sous-composants ---------- */

function BackBar({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <button onClick={onBack} type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: GREY, fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
        <ChevronLeft size={16} /> Retour
      </button>
      {label && <span style={{ fontSize: 13, color: '#9a9a9a' }}>· {label}</span>}
    </div>
  )
}

function Tile({ icon, label, sub, onClick }: { icon: keyof typeof FUNNEL_ICONS; label: string; sub: string; onClick: () => void }) {
  const Icon = FUNNEL_ICONS[icon]
  const [h, setH] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
        padding: '14px 16px', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit',
        background: h ? '#fff' : '#faf7f3',
        border: `1px solid ${h ? AMBER : '#ececec'}`,
        transition: 'border-color .18s, background .18s',
      }}
    >
      <span style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: h ? AMBER : BORDEAUX, color: '#fff', transition: 'background .18s' }}>
        <Icon size={20} strokeWidth={2} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontSize: 16, fontWeight: 700, color: INK }}>{label}</span>
        <span style={{ display: 'block', fontSize: 13, color: GREY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</span>
      </span>
      <ChevronRight size={18} style={{ flexShrink: 0, color: h ? AMBER : '#c4c4c4', transition: 'color .18s' }} />
    </button>
  )
}

function AnnonceRow({ annonce, onClick }: { annonce: Annonce; onClick: () => void }) {
  const [h, setH] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'block', width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: 12,
        cursor: 'pointer', fontFamily: 'inherit',
        background: h ? '#fff' : '#faf7f3', border: `1px solid ${h ? AMBER : '#ececec'}`,
        transition: 'border-color .18s, background .18s',
      }}
    >
      <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: INK }}>{annonce.titre}</span>
        {annonce.niveau && <span style={{ fontSize: 11, fontWeight: 600, color: '#2f7d32' }}>{annonce.niveau}</span>}
      </span>
      {annonce.sousTitre && <span style={{ display: 'block', fontSize: 13, color: BORDEAUX, marginTop: 2 }}>{annonce.sousTitre}</span>}
      <span style={{ display: 'block', fontSize: 12.5, color: GREY, marginTop: 4 }}>{annonce.tags.slice(0, 3).join(' · ')}</span>
    </button>
  )
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: INK, marginBottom: 6 }}>{label}</label>
      <input {...rest} style={{ width: '100%', padding: '13px 15px', background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: 10, fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box' }} />
    </div>
  )
}

function btn(kind: 'primary' | 'ghost'): React.CSSProperties {
  if (kind === 'ghost') {
    return { marginTop: 22, background: 'none', border: `1px solid ${BORDEAUX}`, color: BORDEAUX, fontWeight: 700, fontSize: 15, borderRadius: 70, padding: '13px 26px', cursor: 'pointer', fontFamily: 'inherit' }
  }
  return { marginTop: 22, width: '100%', background: BORDEAUX, color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 70, padding: '16px', cursor: 'pointer', fontFamily: 'inherit' }
}
