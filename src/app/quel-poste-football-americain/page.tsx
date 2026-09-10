import type { Metadata } from 'next';
import SiteHeader from '@/components/template/SiteHeader';
import SiteFooter from '@/components/sections/SiteFooter';
import YardLine from '@/components/sections/YardLine';
import PositionQuiz from '@/components/quiz/PositionQuiz';
import '@/components/quiz/hero.css';

const IS_DEMO = (process.env.NEXT_PUBLIC_BASE_PATH ?? '/lppionnier') !== '/';
const SITE = 'https://recrutement.pionniersdetouraine.fr';

// Le test est un outil, pas un article de fond : l'explication des rôles vit
// sur le site principal (article de référence), le quiz garde l'intention outil.
const TITRE = 'Test : quel poste jouer ? | Pionniers de Touraine';
const DESCRIPTION =
  '8 questions sur ta taille, ton poids et ta vitesse : découvre le poste de football américain ou de flag qui te correspond, puis viens l’essayer à Tours.';
const ARTICLE_POSTES = 'https://pionniersdetouraine.fr/blog/postes-football-americain/';

export const metadata: Metadata = {
  title: TITRE,
  description: DESCRIPTION,
  ...(IS_DEMO
    ? {}
    : {
        robots: { index: true, follow: true },
        alternates: { canonical: '/quel-poste-football-americain/' },
        openGraph: {
          type: 'website',
          title: TITRE,
          description:
            'Un test de scouting en 8 questions pour trouver ton poste idéal, en foot US ou en flag football.',
          url: `${SITE}/quel-poste-football-americain/`,
          siteName: 'Pionniers de Touraine',
          locale: 'fr_FR',
          images: [{ url: `${SITE}/assets/refonte/fond-hero.webp` }],
        },
      }),
};

// Même entité que le site principal : `isPartOf` pointe sur son organisation.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE}/quel-poste-football-americain/#page`,
      url: `${SITE}/quel-poste-football-americain/`,
      name: 'Test : quel poste jouer ?',
      inLanguage: 'fr-FR',
      isPartOf: { '@id': 'https://pionniersdetouraine.fr/#organization' },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE}/quel-poste-football-americain/#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Test de poste',
          item: `${SITE}/quel-poste-football-americain/`,
        },
      ],
    },
  ],
};

export default function QuizPage() {
  return (
    <>
      {IS_DEMO ? null : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      )}
      <SiteHeader />
      <main>
        <section className="blogc-hero" style={{ paddingBottom: 'clamp(24px, 3vw, 40px)' }}>
          <div className="blogc-hero-inner">
            <p className="sc-eyebrow">Le test des Pionniers</p>
            <h1 className="sc-title">Fais le test de poste en 8 questions</h1>
            <p className="sc-lead" style={{ margin: '18px auto 0' }}>
              Chaque gabarit a un poste où il devient une arme. Réponds à 8 questions et notre
              algorithme de scouting, calibré sur les gabarits réels des joueurs NFL et NCAA,
              te propose le tien, en foot US comme en flag.
            </p>
            <p className="sc-lead" style={{ margin: '12px auto 0' }}>
              Tu veux d’abord comprendre les rôles ? Lis{' '}
              <a href={ARTICLE_POSTES} style={{ color: 'var(--rf-amber)' }}>
                les postes au football américain expliqués
              </a>
              , puis reviens faire le test.
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
              Les postes en bref
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
              <a
                href="https://pionniersdetouraine.fr/blog/comment-pratiquer-le-football-americain-en-france/"
                style={{ color: 'var(--rf-amber)' }}
              >
                guide complet pour débuter le football américain en France
              </a>{' '}
              ou découvre{' '}
              <a
                href="https://pionniersdetouraine.fr/blog/flag-football-cest-quoi/"
                style={{ color: 'var(--rf-amber)' }}
              >
                le flag football
              </a>
              , et pour le détail poste par poste,{' '}
              <a href={ARTICLE_POSTES} style={{ color: 'var(--rf-amber)' }}>
                le guide complet des postes
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
