'use client'

import { useState } from 'react'

const PHONE = /^(?:0|\+33 ?|0?0?33 ?|)([1-9] ?(?:[0-9] ?){8})$/
const EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

type Field = 'prenom' | 'nom' | 'telephone' | 'email' | 'message'
const EMPTY = { prenom: '', nom: '', telephone: '', email: '', message: '', website: '' }

function getUTM(): Record<string, string> | null {
  if (typeof document === 'undefined') return null
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
  const out: Record<string, string> = {}
  for (const c of document.cookie.split(';')) {
    const [k, val] = c.trim().split('=')
    if (keys.includes(k) && val) out[k] = decodeURIComponent(val)
  }
  return Object.keys(out).length ? out : null
}

const labelStyle: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 6, display: 'block' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '14px 16px', background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: 10, fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box' }
const errStyle: React.CSSProperties = { color: '#c0392b', fontSize: 13, marginTop: 5, display: 'block' }

export default function ContactForm() {
  const [v, setV] = useState(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((s) => ({ ...s, [k]: e.target.value }))

  const validate = () => {
    const er: Partial<Record<Field, string>> = {}
    if (v.prenom.trim().length < 2) er.prenom = 'Le prénom est obligatoire.'
    if (v.nom.trim().length < 2) er.nom = 'Le nom est obligatoire.'
    if (!PHONE.test(v.telephone.trim())) er.telephone = 'Numéro de téléphone invalide.'
    if (!EMAIL.test(v.email.trim())) er.email = 'Adresse email invalide.'
    if (v.message.trim().length < 10) er.message = 'Message trop court (10 caractères min).'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (sending) return
    if (!validate()) return
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...v, utm: getUTM() }),
      })
      const data = await res.json()
      if (data.success) setSent(true)
      else if (data.errors) setErrors(data.errors)
      else alert(data.message || 'Une erreur est survenue. Réessayez.')
    } catch {
      alert('Erreur de connexion. Réessayez.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div role="status" style={{ background: '#fff', borderRadius: 16, padding: 40, boxShadow: '0 20px 50px rgba(0,0,0,0.08)', textAlign: 'center', fontFamily: '"Inter", sans-serif' }}>
        <div style={{ fontSize: 40, color: '#376131', marginBottom: 12 }} aria-hidden="true">✓</div>
        <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 10px' }}>Message envoyé !</h3>
        <p style={{ color: '#525252', lineHeight: 1.6, margin: 0 }}>Merci, notre équipe vous répondra dans les plus brefs délais.</p>
      </div>
    )
  }

  // Rendu d'un champ avec label associé (htmlFor/id) + aria pour l'accessibilité
  const TextField = ({ f, label, type = 'text', autoComplete, placeholder }: { f: Field; label: string; type?: string; autoComplete?: string; placeholder?: string }) => {
    const id = `cf-${f}`
    const invalid = !!errors[f]
    const common = {
      id,
      value: v[f],
      onChange: set(f),
      placeholder,
      'aria-invalid': invalid,
      'aria-describedby': invalid ? `err-${f}` : undefined,
    }
    return (
      <div>
        <label htmlFor={id} style={labelStyle}>{label}</label>
        {f === 'message' ? (
          <textarea {...common} style={{ ...inputStyle, minHeight: 130, resize: 'vertical' }} />
        ) : (
          <input {...common} type={type} autoComplete={autoComplete} style={inputStyle} />
        )}
        {invalid && <span id={`err-${f}`} role="alert" style={errStyle}>{errors[f]}</span>}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ background: '#fff', borderRadius: 16, padding: 'clamp(28px,4vw,44px)', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', fontFamily: '"Inter", sans-serif' }}>
      <h3 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 26px' }}>Envoyez-nous un message</h3>

      {/* champ piège anti-spam (caché) */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={v.website} onChange={set('website')} style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} aria-hidden="true" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }} className="bg-cf-grid">
        {TextField({ f: 'prenom', label: 'Prénom', autoComplete: 'given-name', placeholder: 'Votre prénom' })}
        {TextField({ f: 'nom', label: 'Nom', autoComplete: 'family-name', placeholder: 'Votre nom' })}
        {TextField({ f: 'telephone', label: 'Téléphone', type: 'tel', autoComplete: 'tel', placeholder: '06 12 34 56 78' })}
        {TextField({ f: 'email', label: 'Email', type: 'email', autoComplete: 'email', placeholder: 'votre@email.com' })}
      </div>

      <div style={{ marginTop: 18 }}>
        {TextField({ f: 'message', label: 'Votre message', placeholder: 'Votre message…' })}
      </div>

      <button type="submit" disabled={sending} style={{ marginTop: 24, width: '100%', background: '#376131', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 70, padding: '17px', cursor: sending ? 'wait' : 'pointer', opacity: sending ? 0.7 : 1 }}>
        {sending ? 'Envoi…' : 'Envoyer'}
      </button>
      <p style={{ color: '#9a9a9a', fontSize: 12.5, lineHeight: 1.5, margin: '16px 0 0', textAlign: 'center' }}>
        Vos données sont utilisées uniquement pour vous recontacter. Voir nos <a href="/mentions-legales" style={{ color: '#376131' }}>mentions légales</a>.
      </p>
    </form>
  )
}
