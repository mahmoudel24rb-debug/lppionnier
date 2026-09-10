import SiteHeader from '@/components/template/SiteHeader';
import SiteHero from '@/components/template/SiteHero';
import ClubSection from '@/components/sections/ClubSection';
import DisciplinesSection from '@/components/sections/DisciplinesSection';
import PPPSection from '@/components/sections/PPPSection';
import PricingSection from '@/components/sections/PricingSection';
import InfosSection from '@/components/sections/InfosSection';
import EndzoneSection from '@/components/sections/EndzoneSection';
import SiteFooter from '@/components/sections/SiteFooter';
import { FORMULES, type Formule } from '@/data/formules';

const IS_DEMO = (process.env.NEXT_PUBLIC_BASE_PATH ?? '/lppionnier') !== '/';
const SITE = 'https://recrutement.pionniersdetouraine.fr';

/** '249,99 €' → 249.99 · null si la formule n'affiche pas de prix chiffré. */
function prixEnNombre(prix: string): number | null {
  const chiffres = prix.replace(/[^\d,.]/g, '').replace(',', '.');
  const n = Number.parseFloat(chiffres);
  return Number.isFinite(n) ? n : null;
}

/**
 * Offres d'adhésion : générées depuis les tarifs FR réels (src/data/formules.ts),
 * jamais saisies en dur ici. PricingSection étant un composant client, le script
 * est émis depuis la page (composant serveur).
 */
function offresAdhesion() {
  const disciplines: [string, Formule[]][] = [
    ['Football américain', FORMULES.fr.footUs],
    ['Flag football', FORMULES.fr.flag],
  ];
  return disciplines.flatMap(([discipline, formules]) =>
    formules.flatMap((f) => {
      const price = prixEnNombre(f.price);
      if (price === null) return [];
      return [
        {
          '@type': 'Offer',
          name: `${discipline} · ${f.name} · ${f.tag}`,
          price,
          priceCurrency: 'EUR',
          category: 'Adhésion',
          url: `${SITE}/#adhesions`,
          offeredBy: { '@id': 'https://pionniersdetouraine.fr/#organization' },
          description: `${f.desc.join(' ')} ${f.features.join(' · ')}.`,
        },
      ];
    }),
  );
}

const JSON_LD_OFFRES = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE}/#page`,
      url: `${SITE}/`,
      name: 'Rejoindre les Pionniers de Touraine à Tours',
      inLanguage: 'fr-FR',
      isPartOf: { '@id': 'https://pionniersdetouraine.fr/#organization' },
      about: { '@id': 'https://pionniersdetouraine.fr/#organization' },
    },
    ...offresAdhesion(),
  ],
};

export default function Home() {
  return (
    <>
      {IS_DEMO ? null : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_OFFRES) }}
        />
      )}
      <SiteHeader />
      <SiteHero />
      <ClubSection />
      <DisciplinesSection />
      <PPPSection />
      <PricingSection />
      <InfosSection />
      <EndzoneSection />
      <SiteFooter />
    </>
  );
}
