'use client';

import { useEffect, useRef, useState } from 'react';
import {
  QUESTIONS_COMMUNES,
  QUESTIONS_FOOTUS,
  QUESTIONS_FLAG,
  computeResult,
  TAILLE_MIN, TAILLE_MAX, POIDS_MIN, POIDS_MAX,
  type Mensurations,
  type Question,
  type QuizResult,
} from '@/data/quizPostes';
import { asset } from '@/lib/asset';
import { track } from '@/lib/track';
import { useLang } from '@/lib/i18n';
import './quiz.css';

const T = {
  fr: {
    introTag: 'Test de scouting · 2 minutes',
    introTitle: 'Quel poste est fait pour toi ?',
    introDesc:
      'Réponds à 8 questions sur ta taille, ton poids, tes qualités et ton rapport au contact. Notre algorithme de scouting, calibré sur les gabarits réels des joueurs NFL et NCAA, te propose ton poste idéal, en foot US ou en flag.',
    start: 'Lancer le test',
    back: 'Question précédente',
    mensuTitle: 'Tes mensurations',
    mensuTaille: 'Taille (cm)',
    mensuTaillePh: 'Ex : 183',
    mensuPoids: 'Poids (kg)',
    mensuPoidsPh: 'Ex : 96',
    mensuNext: 'Continuer',
    mensuKo: 'Entre une taille entre 120 et 220 cm et un poids entre 40 et 180 kg.',
    gateTag: 'Analyse prête',
    gateTitle: 'Ton rapport de scouting est prêt',
    gateDesc: 'Dis-nous où l’envoyer : ton poste s’affiche juste après.',
    prenom: 'Prénom',
    prenomPh: 'Ton prénom',
    email: 'Email',
    emailPh: 'prenom@email.com',
    voir: 'Voir mon poste',
    envoi: 'Analyse en cours…',
    note: 'Ton email sert uniquement au club pour te recontacter : jamais revendu, jamais de spam.',
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
    profilPrefix: 'Ton profil :',
    secondPrefix: 'Aussi compatible :',
    disclaimer: '* Ce test donne une orientation d’après ton gabarit et tes préférences : sur le terrain, l’avis des coachs fait foi.',
    cta: 'Candidater maintenant',
    ctaSub: 'Semaine découverte offerte chez les Pionniers de Touraine',
    lireFootUs: 'Lire le guide du débutant',
    lireFlag: 'Découvrir le flag football',
    retry: 'Refaire le test',
    leadKo: 'L’envoi de l’email n’a pas fonctionné. Ton résultat reste affiché, et tu peux nous écrire à',
  },
  en: {
    introTag: 'Scouting test · 2 minutes',
    introTitle: 'Which position fits you?',
    introDesc:
      'Answer 8 questions about your height, weight, strengths, and how you feel about contact. Our scouting algorithm, calibrated on real NFL and NCAA player profiles, suggests your ideal position, in tackle or flag.',
    start: 'Start the test',
    back: 'Previous question',
    mensuTitle: 'Your measurements',
    mensuTaille: 'Height (cm)',
    mensuTaillePh: 'Ex : 183',
    mensuPoids: 'Weight (kg)',
    mensuPoidsPh: 'Ex : 96',
    mensuNext: 'Continue',
    mensuKo: 'Enter a height between 120 and 220 cm and a weight between 40 and 180 kg.',
    gateTag: 'Analysis ready',
    gateTitle: 'Your scouting report is ready',
    gateDesc: 'Tell us where to send it: your position shows right after.',
    prenom: 'First name',
    prenomPh: 'Your first name',
    email: 'Email',
    emailPh: 'name@email.com',
    voir: 'See my position',
    envoi: 'Analyzing…',
    note: 'Your email is only used by the club to get back to you: never sold, never spammed.',
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
    profilPrefix: 'Your profile:',
    secondPrefix: 'Also a fit:',
    disclaimer: '* This test is an indication based on your build and preferences: on the field, the coaches’ assessment is final.',
    cta: 'Apply now',
    ctaSub: 'Free trial week with the Pionniers de Touraine',
    lireFootUs: 'Read the beginner guide',
    lireFlag: 'Discover flag football',
    retry: 'Retake the test',
    leadKo: 'The email could not be sent. Your result stays on screen, and you can write to us at',
  },
};

type Step = 'intro' | number | 'gate' | 'analyse' | 'result';

/** Un écran du parcours : une question à choix, ou l'écran de mensurations. */
type Ecran = { kind: 'q'; q: Question } | { kind: 'mensu' };

/** 6 questions à choix + la taille + le poids saisis à l'écran mensurations. */
const TOTAL_ETAPES = 8;

/**
 * Parcours dynamique : âge, mensurations, vitesse, contact, puis les 3 questions
 * de la branche choisie par la réponse « contact ». Toujours 7 écrans.
 */
function branche(contact?: string): Question[] {
  return contact === 'evite' ? QUESTIONS_FLAG : QUESTIONS_FOOTUS;
}

function ecrans(contact?: string): Ecran[] {
  const [age, vitesse, contactQ] = QUESTIONS_COMMUNES;
  return [
    { kind: 'q', q: age },
    { kind: 'mensu' },
    { kind: 'q', q: vitesse },
    { kind: 'q', q: contactQ },
    ...branche(contact).map((q): Ecran => ({ kind: 'q', q })),
  ];
}

/**
 * Progression d'un écran : `dots` = points allumés (l'écran mensurations en
 * couvre deux, taille + poids, la barre se remplit donc jusqu'à 8 sur la
 * dernière question), `num` = numéro d'étape affiché sous la barre.
 */
function progression(s: Step): { dots: number; num: number } {
  if (typeof s === 'number') {
    if (s === 0) return { dots: 1, num: 1 };
    if (s === 1) return { dots: 3, num: 2 };
    const n = s + 2;
    return { dots: n, num: n };
  }
  return { dots: 0, num: 0 };
}

/** 183 → « 1m83 » (affichage FR uniquement, l'EN reste en cm). */
function formatTaille(cm: number): string {
  return `${Math.floor(cm / 100)}m${String(cm % 100).padStart(2, '0')}`;
}

export default function PositionQuiz() {
  const { lang } = useLang();
  const t = T[lang];
  const [step, setStep] = useState<Step>('intro');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [tailleTxt, setTailleTxt] = useState('');
  const [poidsTxt, setPoidsTxt] = useState('');
  const [mensurations, setMensurations] = useState<Mensurations>({ taille: 0, poids: 0 });
  const [mensuKo, setMensuKo] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [sending, setSending] = useState(false);
  const [leadKo, setLeadKo] = useState(false);
  const started = useRef(false);

  // Écrans du parcours en cours (dépend de la branche choisie sur « contact »).
  const liste = ecrans(answers.contact);
  const ecran: Ecran | null = typeof step === 'number' ? (liste[step] ?? null) : null;

  const answer = (qId: string, rId: string) => {
    const next = { ...answers, [qId]: rId };
    // Changement de branche : on purge les réponses de l'autre branche pour ne
    // pas polluer le scoring si l'utilisateur est revenu sur la question contact.
    if (qId === 'contact') {
      const autre = rId === 'evite' ? QUESTIONS_FOOTUS : QUESTIONS_FLAG;
      for (const q of autre) delete next[q.id];
    }
    setAnswers(next);
    if (!started.current) { started.current = true; track('quiz-start'); }
    const idx = typeof step === 'number' ? step : 0;
    const total = ecrans(next.contact).length;
    if (idx + 1 < total) setStep(idx + 1);
    else { setResult(computeResult(next, mensurations)); setStep('gate'); }
  };

  const validerMensurations = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const taille = Number(tailleTxt.trim());
    const poids = Number(poidsTxt.trim());
    const ok =
      tailleTxt.trim() !== '' && poidsTxt.trim() !== ''
      && Number.isFinite(taille) && Number.isFinite(poids)
      && taille >= TAILLE_MIN && taille <= TAILLE_MAX
      && poids >= POIDS_MIN && poids <= POIDS_MAX;
    if (!ok) { setMensuKo(true); return; }
    setMensurations({ taille: Math.round(taille), poids: Math.round(poids) });
    setMensuKo(false);
    setStep(2);
  };

  const back = () => {
    if (typeof step === 'number') {
      if (step === 0) setStep('intro');
      else setStep(step - 1);
    } else if (step === 'gate') setStep(liste.length - 1);
  };

  const submitLead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending || !result) return;
    setSending(true);
    const body = new FormData(e.currentTarget);
    body.set('poste', result.poste.id);
    body.set('discipline', result.discipline);
    body.set('age', result.age);
    body.set('taille', String(mensurations.taille));
    body.set('poids', String(mensurations.poids));
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

  const restart = () => {
    setAnswers({});
    setTailleTxt(''); setPoidsTxt('');
    setMensurations({ taille: 0, poids: 0 });
    setMensuKo(false);
    setResult(null); setLeadKo(false);
    setStep(0);
  };

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

      {ecran?.kind === 'mensu' && (
        <div className="qz-fade">
          <div className="qz-progress" aria-hidden>
            {Array.from({ length: TOTAL_ETAPES }, (_, i) => (
              <span key={i} className={`qz-dot ${i < progression(step).dots ? 'on' : ''}`} />
            ))}
          </div>
          <p className="qz-sub">{`${progression(step).num} / ${TOTAL_ETAPES}`}</p>
          <h2 className="qz-q">{t.mensuTitle}</h2>
          <form className="qz-form" onSubmit={validerMensurations} noValidate>
            <div className="qz-measures">
              <div className="qz-field">
                <label htmlFor="qz-taille">{t.mensuTaille}</label>
                <input
                  id="qz-taille" name="taille" type="number" inputMode="numeric"
                  min={TAILLE_MIN} max={TAILLE_MAX} required
                  placeholder={t.mensuTaillePh}
                  value={tailleTxt}
                  onChange={(e) => setTailleTxt(e.target.value)}
                />
              </div>
              <div className="qz-field">
                <label htmlFor="qz-poids">{t.mensuPoids}</label>
                <input
                  id="qz-poids" name="poids" type="number" inputMode="numeric"
                  min={POIDS_MIN} max={POIDS_MAX} required
                  placeholder={t.mensuPoidsPh}
                  value={poidsTxt}
                  onChange={(e) => setPoidsTxt(e.target.value)}
                />
              </div>
            </div>
            {mensuKo && <p className="qz-error">{t.mensuKo}</p>}
            <div className="qz-actions" style={{ marginTop: 18 }}>
              <button className="sc-btn" type="submit">{t.mensuNext}</button>
            </div>
          </form>
          <button className="qz-back" type="button" onClick={back}>← {t.back}</button>
        </div>
      )}

      {ecran?.kind === 'q' && (
        <div className="qz-fade" key={ecran.q.id}>
          <div className="qz-progress" aria-hidden>
            {Array.from({ length: TOTAL_ETAPES }, (_, i) => (
              <span key={i} className={`qz-dot ${i < progression(step).dots ? 'on' : ''}`} />
            ))}
          </div>
          <p className="qz-sub">{`${progression(step).num} / ${TOTAL_ETAPES}`}</p>
          <h2 className="qz-q">{lang === 'en' ? ecran.q.en : ecran.q.fr}</h2>
          <div className="qz-answers" style={{ marginTop: 26 }}>
            {ecran.q.reponses.map((r) => (
              <button key={r.id} className="qz-answer" type="button" onClick={() => answer(ecran.q.id, r.id)}>
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
          <p className="qz-profil">
            {t.profilPrefix}{' '}
            {lang === 'en'
              ? `${mensurations.taille} cm · ${mensurations.poids} kg`
              : `${formatTaille(mensurations.taille)} · ${mensurations.poids} kg`}
          </p>
          {result.secondPoste && (
            <p className="qz-second">
              {t.secondPrefix} {lang === 'en' ? result.secondPoste.en : result.secondPoste.fr}
            </p>
          )}
          <p className="qz-disclaimer">{t.disclaimer}</p>
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
            {/* Lien secondaire contextuel vers le blog du site racine :
                article flag en flag, guide pilier sinon. */}
            <a
              className="sc-btn-ghost"
              href={result.discipline === 'flag'
                ? 'https://pionniersdetouraine.fr/blog/flag-football-cest-quoi/'
                : 'https://pionniersdetouraine.fr/blog/comment-pratiquer-le-football-americain-en-france/'}
            >
              {result.discipline === 'flag' ? t.lireFlag : t.lireFootUs}
            </a>
          </div>
          <p className="qz-note">{t.ctaSub}</p>
          <button className="qz-back" type="button" onClick={restart}>{t.retry}</button>
        </div>
      )}
    </div>
  );
}
