import type { Metadata } from 'next';
import SiteHeader from '@/components/template/SiteHeader';
import SiteFooter from '@/components/sections/SiteFooter';

export const metadata: Metadata = {
  title: 'Mentions légales · Pionniers de Touraine',
  description:
    'Mentions légales du site des Pionniers de Touraine : éditeur, hébergement, propriété intellectuelle et données personnelles.',
};

// Cible de build : démo GitHub Pages (basePath non vide) ou prod o2switch.
const IS_DEMO = (process.env.NEXT_PUBLIC_BASE_PATH ?? '/lppionnier') !== '/';

export default function MentionsLegalesPage() {
  return (
    <>
      <SiteHeader />
      <main className="sc-sec sc-legal">
        <div className="sc-wrap">
          <p className="sc-eyebrow">Informations légales</p>
          <h1 className="sc-title">Mentions légales</h1>
          <p className="sc-lead">
            Informations relatives à l&apos;éditeur de ce site, à son hébergement et au traitement
            des données.
          </p>

          <div className="sc-legal-blocks">
            <section className="sc-panel">
              <h2 className="sc-panel-title">Éditeur du site</h2>
              <p className="sc-legal-text">
                Association Pionniers de Touraine
                <br />
                9bis rue de la victoire, 37000 Tours
                <br />
                <a href="mailto:shop@pionniersdetouraine.fr">shop@pionniersdetouraine.fr</a>
                <br />
                SIRET : 493 921 779 00051
              </p>
              <p className="sc-legal-text">
                Directeur de la publication : le président de l&apos;association.
              </p>
            </section>

            <section className="sc-panel">
              <h2 className="sc-panel-title">Objet du site</h2>
              <p className="sc-legal-text">
                Le site a pour objet la présentation du club, le recrutement de nouveaux membres
                (joueurs, joueuses, bénévoles et partenaires) ainsi que la diffusion
                d&apos;informations relatives à l&apos;association Pionniers de Touraine.
              </p>
            </section>

            <section className="sc-panel">
              <h2 className="sc-panel-title">Hébergement</h2>
              {IS_DEMO ? (
                <p className="sc-legal-text">
                  Ce site de démonstration est hébergé par GitHub, Inc. (GitHub Pages), 88 Colin P.
                  Kelly Jr Street, San Francisco, CA 94107, USA.
                </p>
              ) : (
                <p className="sc-legal-text">
                  Ce site est hébergé par o2switch, Chemin des Pardiaux, 63000 Clermont-Ferrand,
                  France · 04 44 44 60 40.
                </p>
              )}
            </section>

            <section className="sc-panel">
              <h2 className="sc-panel-title">Propriété intellectuelle</h2>
              <p className="sc-legal-text">
                L&apos;ensemble des contenus présents sur ce site (textes, logos, visuels, photos)
                est la propriété exclusive de l&apos;association ou de leurs auteurs respectifs.
                Toute reproduction, représentation ou diffusion, totale ou partielle, est interdite
                sans autorisation écrite préalable.
              </p>
            </section>

            <section className="sc-panel">
              <h2 className="sc-panel-title">Données personnelles</h2>
              {IS_DEMO ? (
                <p className="sc-legal-text">
                  Sur cette version de démonstration, les formulaires n&apos;enregistrent ni ne
                  transmettent aucune donnée.
                </p>
              ) : (
                <p className="sc-legal-text">
                  Les informations saisies dans les formulaires (candidature, contact) sont
                  transmises par email à l&apos;association, uniquement pour traiter votre demande.
                  Elles ne sont ni stockées sur le serveur, ni cédées à des tiers.
                </p>
              )}
              <p className="sc-legal-text">
                La mesure d&apos;audience éventuelle est réalisée sans cookies ni identifiant
                persistant (GoatCounter).
              </p>
              <p className="sc-legal-text">
                Pour toute question relative à vos données :{' '}
                <a href="mailto:shop@pionniersdetouraine.fr">shop@pionniersdetouraine.fr</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
