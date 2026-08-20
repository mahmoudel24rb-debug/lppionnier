import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleLayout from '@/components/blog/ArticleLayout';
import { ARTICLES, getArticle } from '@/data/blog';

// Démo GitHub Pages : pas de canonical/OG absolus (et noindex hérité du layout).
const IS_DEMO = (process.env.NEXT_PUBLIC_BASE_PATH ?? '/lppionnier') !== '/';
const SITE = 'https://recrutement.pionniersdetouraine.fr';

// output:'export' impose la liste exhaustive des slugs au build.
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: `${article.titleSeo} | Pionniers de Touraine`,
    description: article.description,
    ...(IS_DEMO
      ? {}
      : {
          alternates: { canonical: `/blog/${article.slug}/` },
          openGraph: {
            type: 'article',
            title: article.titre,
            description: article.description,
            url: `${SITE}/blog/${article.slug}/`,
            siteName: 'Pionniers de Touraine',
            locale: 'fr_FR',
            publishedTime: article.datePublication,
            modifiedTime: article.dateModif,
            images: [{ url: `${SITE}/assets/refonte/fond-hero.webp` }],
          },
        }),
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();
  const Content = article.content;

  // JSON-LD : Article + fil d'Ariane (URLs prod uniquement — la démo est noindex).
  const jsonLd = IS_DEMO
    ? null
    : {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            headline: article.titre,
            description: article.description,
            datePublished: article.datePublication,
            dateModified: article.dateModif,
            inLanguage: 'fr-FR',
            mainEntityOfPage: `${SITE}/blog/${article.slug}/`,
            image: `${SITE}/assets/refonte/fond-hero.webp`,
            author: { '@type': 'SportsOrganization', name: 'Pionniers de Touraine', url: SITE },
            publisher: { '@type': 'SportsOrganization', name: 'Pionniers de Touraine', url: SITE },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog/` },
              { '@type': 'ListItem', position: 3, name: article.titreCourt, item: `${SITE}/blog/${article.slug}/` },
            ],
          },
        ],
      };

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <ArticleLayout article={article}>
        <Content />
      </ArticleLayout>
    </>
  );
}
