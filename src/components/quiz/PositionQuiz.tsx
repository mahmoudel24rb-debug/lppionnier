'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { QUESTIONS, computeResult, type QuizResult } from '@/data/quizPostes';
import { asset } from '@/lib/asset';
import { track } from '@/lib/track';
import { useLang } from '@/lib/i18n';
import './quiz.css';

const T = {
  fr: {
    introTag: 'Test de scouting · 2 minutes',
    introTitle: 'Quel poste est fait pour toi ?',
    introDesc:
      'Réponds à 8 questions sur ton gabarit, tes qualités et ton rapport au contact. Notre algorithme de scouting — calibré sur les gabarits réels des joueurs NFL et NCAA — te propose ton poste idéal, en foot US ou en flag.',
    start: 'Lancer le test',
    back: 'Question précédente',
    gateTag: 'Analyse prête',
    gateTitle: 'Ton rapport de scouting est prêt',
    gateDesc: 'Dis-nous où l’envoyer : ton poste s’affiche juste après.',
    prenom: 'Prénom',
    prenomPh: 'Ton prénom',
    email: 'Email',
    emailPh: 'prenom@email.com',
    voir: 'Voir mon poste',
    envoi: 'Analyse en cours…',
    note: 'Ton email sert uniquement au club pour te recontacter — jamais revendu, jamais de spam.',
    scoutTag: 'Le scout analyse ton profil',
    scoutLines: [
      'Lecture de ton gabarit…',
      'Comparaison aux profils NFL Combine…',
      'Croisement vitesse / rôle préféré…',
      'Vérification côté flag 5v5…',
      'Profil identifié.',
    ],
    resultTagFoot: 'Ton poste en foot US',
    resultTagFlag: 'Ton poste en flag football',
    atoutsTitle: 'Pourquoi toi :',
    refsPrefix: 'Même famille de profil :',
    cta: 'Candidater maintenant',
    ctaSub: 'Semaine découverte offerte chez les Pionniers de Touraine',
    lire: 'Lire le guide du débutant',
    retry: 'Refaire le test',
    leadKo: 'L’envoi de l’email n’a pas fonctionné — ton résultat reste affiché, et tu peux nous écrire à',
  },
  en: {
    introTag: 'Scouting test · 2 minutes',
    introTitle: 'Which position fits you?',
    introDesc:
      'Answer 8 questions about your build, your strengths, and how you feel about contact. Our scouting algorithm — calibrated on real NFL and NCAA player profiles — suggests your ideal position, in tackle or flag.',
    start: 'Start the test',
    back: 'Previous question',
    gateTag: 'Analysis ready',
    gateTitle: 'Your scouting report is ready',
    gateDesc: 'Tell us where to send it — your position shows right after.',
    prenom: 'First name',
    prenomPh: 'Your first name',
    email: 'Email',
    emailPh: 'name@email.com',
    voir: 'See my position',
    envoi: 'Analyzing…',
    note: 'Your email is only used by the club to get back to you — never sold, never spammed.',
    scoutTag: 'The scout is reviewing your profile',
    scoutLines: [
      'Reading your frame…',
      'Comparing to NFL Combine profiles…',
      'Crossing speed with preferred role…',
      'Checking the 5v5 flag angle…',
      'Profile identified.',
    ],
    resultTagFoot: 'Your tackle football position',
    resultTagFlag: 'Your flag football position',
    atoutsTitle: 'Why you:',
    refsPrefix: 'Same profile family:',
    cta: 'Apply now',
    ctaSub: 'Free trial week with the Pionniers de Touraine',
    lire: 'Read the beginner guide',
    retry: 'Retake the test',
    leadKo: 'The email could not be sent — your result stays on screen, and you can write to us at',
  },
};

type Step = 'intro' | number | 'gate' | 'analyse' | 'result';

export default function PositionQuiz() {
  const { lang } = useLang();
  const t = T[lang];
  const [step, setStep] = useState<Step>('intro');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [sending, setSending] = useState(false);
  const [leadKo, setLeadKo] = useState(false);
  const started = useRef(false);

  const answer = (qId: string, rId: string) => {
    const next = { ...answers, [qId]: rId };
    setAnswers(next);
    if (!started.current) { started.current = true; track('quiz-start'); }
    const idx = typeof step === 'number' ? step : 0;
    if (idx + 1 < QUESTIONS.length) setStep(idx + 1);
    else { setResult(computeResult(next)); setStep('gate'); }
  };

  const back = () => {
    if (typeof step === 'number') setStep(step === 0 ? 'intro' : step - 1);
    else if (step === 'gate') setStep(QUESTIONS.length - 1);
  };

  const submitLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending || !result) return;
    setSending(true);
    const body = new FormData(e.currentTarget);
    body.set('poste', result.poste.id);
    body.set('discipline', result.discipline);
    body.set('age', result.age);
    body.set('lang', lang);
    try {
      const res = await fetch(asset('/quiz.php'), { method: 'POST', body });
      const data = res.ok ? await res.json().catch(() => null) : null;
      if (data && data.ok) track('quiz-lead');
      else setLeadKo(true);
    } catch {
      // Démo GitHub Pages (pas de PHP) ou réseau : le résultat s'affiche quand même.
      setLeadKo(true);
    } finally {
      setSending(false);
      setStep('analyse');
    }
  };

  // Écran d'analyse « scout » : 2,8 s puis résultat.
  useEffect(() => {
    if (step !== 'analyse') return;
    const id = setTimeout(() => {
      setStep('result');
      if (result) track('quiz-complete', { poste: result.poste.id });
    }, 2800);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const apply = () => {
    if (!result) return;
    track('quiz-apply', { offre: result.offerId });
    window.dispatchEvent(new CustomEvent('open-tunnel', { detail: { offerId: result.offerId } }));
  };

  const restart = () => { setAnswers({}); setResult(null); setLeadKo(false); setStep(0); };

  return (
    <div className="qz-zone">
      {step === 'intro' && (
        <div className="qz-fade">
          <p className="qz-sub">{t.introTag}</p>
          <h2 className="qz-q">{t.introTitle}</h2>
          <p className="qz-result-desc">{t.introDesc}</p>
          <div className="qz-actions">
            <button className="sc-btn" type="button" onClick={() => setStep(0)}>{t.start}</button>
          </div>
        </div>
      )}

      {typeof step === 'number' && (
        <div className="qz-fade" key={step}>
          <div className="qz-progress" aria-hidden>
            {QUESTIONS.map((_, i) => <span key={i} className={`qz-dot ${i <= step ? 'on' : ''}`} />)}
          </div>
          <p className="qz-sub">{`${step + 1} / ${QUESTIONS.length}`}</p>
          <h2 className="qz-q">{lang === 'en' ? QUESTIONS[step].en : QUESTIONS[step].fr}</h2>
          <div className="qz-answers" style={{ marginTop: 26 }}>
            {QUESTIONS[step].reponses.map((r) => (
              <button key={r.id} className="qz-answer" type="button" onClick={() => answer(QUESTIONS[step].id, r.id)}>
                {lang === 'en' ? r.en : r.fr}
              </button>
            ))}
          </div>
          <button className="qz-back" type="button" onClick={back}>← {t.back}</button>
        </div>
      )}

      {step === 'gate' && (
        <div className="qz-fade">
          <p className="qz-sub">{t.gateTag}</p>
          <h2 className="qz-q">{t.gateTitle}</h2>
          <p className="qz-result-desc" style={{ marginBottom: 24 }}>{t.gateDesc}</p>
          <form className="qz-form" onSubmit={submitLead}>
            {/* Honeypot anti-spam : caché aux humains, rempli par les robots */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sc-field-trap" />
            <div className="qz-field">
              <label htmlFor="qz-prenom">{t.prenom}</label>
              <input id="qz-prenom" name="prenom" required placeholder={t.prenomPh} />
            </div>
            <div className="qz-field">
              <label htmlFor="qz-email">{t.email}</label>
              <input id="qz-email" name="email" type="email" required placeholder={t.emailPh} />
            </div>
            <div className="qz-actions" style={{ marginTop: 18 }}>
              <button className="sc-btn" type="submit" disabled={sending}>{sending ? t.envoi : t.voir}</button>
            </div>
            <p className="qz-note">{t.note}</p>
          </form>
          <button className="qz-back" type="button" onClick={back}>← {t.back}</button>
        </div>
      )}

      {step === 'analyse' && (
        <div className="qz-fade">
          <p className="qz-sub">{t.scoutTag}</p>
          <div className="qz-scout">
            {t.scoutLines.map((l, i) => (
              <p key={l} className="qz-scout-line" style={{ animationDelay: `${i * 0.5}s` }}>{l}</p>
            ))}
          </div>
        </div>
      )}

      {step === 'result' && result && (
        <div className="qz-fade">
          <span className="qz-result-badge">
            <img src={asset(`/assets/refonte/emojis/${result.poste.emoji}.webp`)} alt="" />
          </span>
          <p className="qz-result-tag">{result.discipline === 'flag' ? t.resultTagFlag : t.resultTagFoot}</p>
          <h2 className="qz-q">{lang === 'en' ? result.poste.en : result.poste.fr}</h2>
          <p className="qz-result-desc">{lang === 'en' ? result.poste.descEn : result.poste.descFr}</p>
          <ul className="qz-atouts">
            {result.poste.atouts.map((a) => <li key={a.fr}>{lang === 'en' ? a.en : a.fr}</li>)}
          </ul>
          <p className="qz-refs">{t.refsPrefix} {result.poste.refs}</p>
          {leadKo && (
            <p className="qz-note">
              {t.leadKo}{' '}
              <a href="mailto:recrutement@pionniersdetouraine.fr" style={{ color: 'var(--rf-amber)' }}>
                recrutement@pionniersdetouraine.fr
              </a>
            </p>
          )}
          <div className="qz-actions">
            <button className="sc-btn" type="button" onClick={apply}>{t.cta}</button>
            <Link className="sc-btn-ghost" href="/blog/comment-pratiquer-le-football-americain-en-france/">{t.lire}</Link>
          </div>
          <p className="qz-note">{t.ctaSub}</p>
          <button className="qz-back" type="button" onClick={restart}>{t.retry}</button>
        </div>
      )}
    </div>
  );
}
