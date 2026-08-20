import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/template/SiteHeader';
import SiteFooter from '@/components/sections/SiteFooter';
import YardLine from '@/components/sections/YardLine';
import { ARTICLES, dateFr } from '@/data/blog';
import { getEmoji } from '@/lib/funnelIcons';
import '@/components/blog/blog.css';

const IS_DEMO = (process.env.NEXT_PUBLIC_BASE_PATH ?? '/lppionnier') !== '/';

export const metadata: Metadata = {
  title: 'Blog football américain & flag | Pionniers de Touraine',
  description:
    'Guides et conseils pour débuter le football américain et le flag football : règles, équipement, clubs, postes. Par les Pionniers de Touraine, club fondé en 1987.',
  ...(IS_DEMO ? {} : { alternates: { canonical: '/blog/' } }),
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="blogc-hero">
          <div className="blogc-hero-inner">
            <p className="sc-eyebrow">Le blog des Pionniers</p>
            <h1 className="sc-title">Comprendre et débuter le foot US</h1>
            <p className="sc-lead" style={{ margin: '18px auto 0' }}>
              Guides écrits par un club de football américain fondé en 1987 : les règles, les
              postes, l'équipement, et tout ce qu'il faut pour te lancer, en France comme en
              Touraine.
            </p>
          </div>
        </section>

        <section className="sc-sec blogc-list">
          <YardLine n="20" />
          <div className="sc-wrap">
            <div className="sc-cards">
              {ARTICLES.map((a) => (
                <Link key={a.slug} className="sc-card" href={`/blog/${a.slug}/`}>
                  <span className="blogc-card-icon"><img src={getEmoji(a.emoji)} alt="" loading="lazy" /></span>
                  <h2 className="sc-card-title">{a.titreCourt}</h2>
                  <p className="sc-card-desc">{a.description}</p>
                  <span className="blogc-card-meta">{dateFr(a.datePublication)} · {a.minutesLecture} min de lecture</span>
                  <span className="sc-card-cta">Lire l'article</span>
                </Link>
              ))}
              <Link className="sc-card blogc-quiz-card" href="/quel-poste-football-americain/">
                <span className="blogc-card-icon"><img src={getEmoji('jouer')} alt="" loading="lazy" /></span>
                <h2 className="sc-card-title">Quel poste est fait pour toi ?</h2>
                <p className="sc-card-desc">
                  9 questions, un algorithme de scouting calibré sur les gabarits NFL et NCAA, et
                  ton poste idéal, en foot US ou en flag.
                </p>
                <span className="blogc-card-meta">Test interactif · 2 min</span>
                <span className="sc-card-cta">Faire le test</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
