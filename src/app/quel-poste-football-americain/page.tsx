import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/template/SiteHeader';
import SiteFooter from '@/components/sections/SiteFooter';
import YardLine from '@/components/sections/YardLine';
import PositionQuiz from '@/components/quiz/PositionQuiz';
import '@/components/blog/blog.css';

const IS_DEMO = (process.env.NEXT_PUBLIC_BASE_PATH ?? '/lppionnier') !== '/';
const SITE = 'https://recrutement.pionniersdetouraine.fr';

export const metadata: Metadata = {
  title: 'Quel poste jouer au football américain ? Fais le test',
  description:
    'Taille, poids, vitesse, rapport au contact : réponds à 9 questions et découvre ton poste idéal au football américain ou au flag, calibré sur les profils NFL et NCAA.',
  ...(IS_DEMO
    ? {}
    : {
        alternates: { canonical: '/quel-poste-football-americain/' },
        openGraph: {
          type: 'website',
          title: 'Quel poste jouer au football américain ? Fais le test',
          description:
            'Un test de scouting en 9 questions pour trouver ton poste idéal, en foot US ou en flag football.',
          url: `${SITE}/quel-poste-football-americain/`,
          siteName: 'Pionniers de Touraine',
          locale: 'fr_FR',
          images: [{ url: `${SITE}/assets/refonte/fond-hero.webp` }],
        },
      }),
};

export default function QuizPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="blogc-hero" style={{ paddingBottom: 'clamp(24px, 3vw, 40px)' }}>
          <div className="blogc-hero-inner">
            <p className="sc-eyebrow">Le test des Pionniers</p>
            <h1 className="sc-title">Quel poste jouer au football américain ?</h1>
            <p className="sc-lead" style={{ margin: '18px auto 0' }}>
              Chaque gabarit a un poste où il devient une arme. Réponds à 9 questions et notre
              algorithme de scouting, calibré sur les gabarits réels des joueurs NFL et NCAA,
              te propose le tien, en foot US comme en flag.
            </p>
          </div>
        </section>

        <section className="sc-sec" style={{ paddingTop: 0 }}>
          <div className="sc-wrap">
            <PositionQuiz />
          </div>
        </section>

        {/* Contenu SEO indexable : les postes expliqués en bref */}
        <section className="sc-sec" style={{ paddingTop: 0 }}>
          <YardLine n="40" />
          <div className="sc-wrap">
            <p className="sc-eyebrow">Comprendre les postes</p>
            <h2 className="sc-title" style={{ fontSize: 'clamp(30px, 3.6vw, 48px)' }}>
              11 joueurs, 11 métiers différents
            </h2>
            <div className="sc-cards">
              <div className="sc-card" style={{ cursor: 'default' }}>
                <h3 className="sc-card-title">L'attaque</h3>
                <p className="sc-card-desc">
                  Le <strong>quarterback</strong> dirige le jeu et lance ; le <strong>running
                  back</strong> perce les défenses ballon en main ; les <strong>receveurs</strong>
                  courent des tracés précis pour attraper les passes ; le <strong>tight
                  end</strong>, hybride, bloque et attrape ; la <strong>ligne offensive</strong>
                  (les gabarits les plus costauds) protège le quarterback sur chaque action.
                </p>
              </div>
              <div className="sc-card" style={{ cursor: 'default' }}>
                <h3 className="sc-card-title">La défense</h3>
                <p className="sc-card-desc">
                  La <strong>ligne défensive</strong> attaque le quarterback adverse ; les
                  <strong> linebackers</strong>, polyvalents, plaquent et couvrent au cœur du
                  jeu ; les <strong>defensive backs</strong>, les plus rapides, jouent les duels
                  contre les receveurs et chassent l'interception.
                </p>
              </div>
              <div className="sc-card" style={{ cursor: 'default' }}>
                <h3 className="sc-card-title">Et au flag ?</h3>
                <p className="sc-card-desc">
                  En <strong>flag football</strong> (5 contre 5, sans contact, olympique aux JO
                  de Los Angeles 2028), on retrouve le quarterback, les receveurs et les
                  défenseurs : la vitesse et la lecture remplacent les plaquages. Notre test
                  t'oriente aussi vers ces postes si le contact n'est pas ton truc.
                </p>
              </div>
            </div>
            <p className="sc-lead" style={{ marginTop: 28 }}>
              Envie d'aller plus loin ? Lis notre{' '}
              <Link href="/blog/comment-pratiquer-le-football-americain-en-france/" style={{ color: 'var(--rf-amber)' }}>
                guide complet pour débuter le football américain en France
              </Link>{' '}
              ou découvre{' '}
              <Link href="/blog/flag-football-cest-quoi/" style={{ color: 'var(--rf-amber)' }}>
                le flag football
              </Link>.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
