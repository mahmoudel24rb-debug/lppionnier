import Link from 'next/link';
import SiteHeader from '@/components/template/SiteHeader';
import SiteFooter from '@/components/sections/SiteFooter';
import YardLine from '@/components/sections/YardLine';
import { CtaTunnel } from './CtaEncart';
import { dateFr, type ArticleMeta } from '@/data/blog';
import { asset } from '@/lib/asset';
import './blog.css';

/**
 * Gabarit commun des articles : hero sombre (breadcrumb + H1 + méta),
 * zone de lecture claire (fond crème, texte sombre), CTA tunnel en fin
 * de page. Le contenu (children) est le composant de src/content/.
 */
export default function ArticleLayout({ article, children }: { article: ArticleMeta; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="blogc-hero">
          <div className="blogc-hero-inner">
            <nav className="blogc-crumbs" aria-label="Fil d'Ariane">
              <a href={asset('/')}>Accueil</a>
              <span className="sep">/</span>
              <Link href="/blog/">Blog</Link>
              <span className="sep">/</span>
              <span>{article.titreCourt}</span>
            </nav>
            <h1 className="sc-title">{article.titre}</h1>
            <p className="blogc-meta">
              Publié le <strong>{dateFr(article.datePublication)}</strong> · {article.minutesLecture} min de lecture ·
              par les <strong>Pionniers de Touraine</strong>
            </p>
          </div>
        </section>

        <div className="blogc-body">
          <article className="blogc-prose">
            {children}
            <CtaTunnel
              titre="Prêt à essayer en vrai ?"
              texte="Semaine découverte offerte aux Pionniers de Touraine : viens tester le foot US ou le flag au Stade de la Chambrerie, à Tours, sans engagement et sans matériel à acheter."
              bouton="Je tente la semaine découverte"
            />
          </article>
        </div>

        <YardLine n="endzone" />
      </main>
      <SiteFooter />
    </>
  );
}
