import Link from 'next/link';
import { CtaQuiz, CtaTunnel } from '@/components/blog/CtaEncart';
import { asset } from '@/lib/asset';

/**
 * Article pilier — mot-clé : « pratiquer le football américain en France ».
 * Rédigé par un club (Pionniers de Touraine, fondé en 1987) qui parle à toute
 * la France, avec une section locale en fin d'article.
 */
export default function ArticlePratiquer() {
  return (
    <>
      <p>
        Tu regardes la NFL le dimanche soir, tu as vibré devant le Super Bowl, et une question
        commence à tourner dans ta tête : <strong>est-ce qu'on peut vraiment pratiquer le football
        américain en France ?</strong> La réponse est oui — et c'est beaucoup plus accessible que
        tu ne l'imagines. Il existe des clubs partout sur le territoire, des catégories pour tous
        les âges, une version sans contact pour celles et ceux qui ne veulent pas plaquer, et des
        semaines d'essai gratuites dans la plupart des clubs.
      </p>
      <p>
        Ce guide a été écrit par les <strong>Pionniers de Touraine</strong>, club de football
        américain et de flag football fondé à Tours en <strong>1987</strong> — l'un des plus
        anciens de France. En presque quarante ans, on a vu débuter des centaines de joueuses et
        de joueurs qui n'avaient jamais touché un ballon ovale. Voici tout ce qu'il faut savoir
        pour te lancer, où que tu sois en France.
      </p>

      <div className="blogc-toc">
        <p className="blogc-toc-title">Sommaire</p>
        <ol>
          <li><a href="#football-americain-en-france">Le football américain en France, ça existe vraiment ?</a></li>
          <li><a href="#quel-age">À quel âge peut-on commencer ?</a></li>
          <li><a href="#flag-ou-contact">Flag ou contact : quelle version choisir ?</a></li>
          <li><a href="#trouver-un-club">Comment trouver un club près de chez soi</a></li>
          <li><a href="#licence-prix">La licence : combien ça coûte ?</a></li>
          <li><a href="#equipement">L'équipement : ce qu'il faut (et ce que le club prête)</a></li>
          <li><a href="#premier-entrainement">À quoi ressemble un premier entraînement</a></li>
          <li><a href="#quel-poste">Quel poste est fait pour toi ?</a></li>
          <li><a href="#faq">Questions fréquentes</a></li>
          <li><a href="#touraine">Et si tu es en Touraine ?</a></li>
        </ol>
      </div>

      <h2 id="football-americain-en-france">Le football américain en France, ça existe vraiment ?</h2>
      <p>
        Oui, et depuis plus longtemps que beaucoup ne le pensent. Les premiers clubs français sont
        nés au début des années 1980, et la <strong>Fédération Française de Football Américain
        (FFFA)</strong> structure aujourd'hui la discipline sur tout le territoire : championnats
        nationaux et régionaux, équipes de France, formation des entraîneurs et des arbitres. On
        compte plus de deux cents clubs affiliés, des grandes métropoles aux villes moyennes, et
        des dizaines de milliers de pratiquantes et pratiquants entre le football américain
        « casqué », le flag football et le cheerleading.
      </p>
      <p>
        Le niveau français progresse d'ailleurs vite : des joueurs formés en France atteignent les
        championnats universitaires américains (NCAA), le championnat européen ELF, et l'équipe de
        France figure régulièrement parmi les meilleures nations européennes. Mais surtout — et
        c'est ce qui nous intéresse ici — <strong>le foot US en France est un sport de clubs de
        proximité</strong>, où l'immense majorité des licenciés a commencé adulte ou adolescent,
        sans aucune expérience préalable.
      </p>
      <p>
        Autre idée reçue à évacuer tout de suite : non, ce n'est pas un sport réservé aux
        « armoires à glace ». Une équipe de football américain a besoin de <em>tous</em> les
        gabarits : des rapides et légers, des grands aux longs bras, des costauds, des stratèges.
        C'est précisément ce qui en fait l'un des sports collectifs les plus inclusifs qui soient
        — chacun a un rôle taillé pour son profil.
      </p>

      <h2 id="quel-age">À quel âge peut-on commencer ?</h2>
      <p>
        À presque n'importe quel âge, à condition de choisir la bonne porte d'entrée :
      </p>
      <ul>
        <li>
          <strong>Enfants (dès 6-8 ans)</strong> : la plupart des clubs proposent une école de
          flag football, la version sans contact où le plaquage est remplacé par l'arrachage d'un
          « flag » accroché à la ceinture. On y apprend les passes, les courses, les tracés et la
          lecture du jeu, sans aucun choc.
        </li>
        <li>
          <strong>Adolescents</strong> : le contact arrive progressivement, en général autour de
          13 à 15 ans selon les clubs et les catégories, avec un équipement complet (casque,
          épaulière, protège-dents) et un apprentissage très encadré des techniques de plaquage.
        </li>
        <li>
          <strong>Adultes</strong> : c'est LA spécificité du foot US français — on peut débuter
          en senior à 20, 25, 30 ans et même au-delà, en contact comme en flag. La majorité des
          joueurs des championnats régionaux ont commencé adultes. Si le sujet te concerne, on a
          écrit un article entier pour répondre à la question :{' '}
          <Link href="/blog/commencer-le-football-americain-adulte/">commencer le football
          américain à l'âge adulte, est-ce trop tard ?</Link>
        </li>
      </ul>
      <p>
        Il n'y a donc pas de « bon âge » unique : il y a une pratique adaptée à chaque âge. Un
        enfant de 8 ans jouera au flag le samedi matin, un lycéen alternera flag et contact en
        catégorie jeunes, et un trentenaire qui n'a jamais fait de sport collectif pourra intégrer
        un groupe senior débutant à la rentrée.
      </p>

      <h2 id="flag-ou-contact">Flag ou contact : quelle version choisir ?</h2>
      <p>
        C'est la première vraie décision à prendre, et elle est plus simple qu'il n'y paraît. Le
        football américain se pratique en France sous deux formes principales :
      </p>
      <div className="blogc-table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Football américain (contact)</th>
              <th scope="col">Flag football</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Contact</th>
              <td>Plaquages, blocs — un vrai sport de combat collectif</td>
              <td>Aucun : on arrache un flag à la ceinture</td>
            </tr>
            <tr>
              <th scope="row">Équipement</th>
              <td>Casque, épaulière, protège-dents</td>
              <td>Une ceinture à flags, un short, des crampons</td>
            </tr>
            <tr>
              <th scope="row">Format</th>
              <td>11 contre 11 (ou 9v9 selon les niveaux)</td>
              <td>5 contre 5, terrain réduit</td>
            </tr>
            <tr>
              <th scope="row">Mixité</th>
              <td>Équipes masculines et féminines séparées en compétition</td>
              <td>Souvent mixte, notamment en loisir</td>
            </tr>
            <tr>
              <th scope="row">Pour qui ?</th>
              <td>Celles et ceux qui veulent le grand frisson du contact</td>
              <td>Enfants, reprise du sport, allergiques au plaquage — et les JO 2028 !</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Le flag n'est pas un « sous-foot US » : c'est une discipline à part entière, olympique à
        partir des <strong>Jeux de Los Angeles 2028</strong>, avec ses championnats et ses équipes
        de France. C'est aussi la meilleure porte d'entrée pour apprendre le jeu — les tracés, les
        lectures de défense, le timing des passes — avant, éventuellement, de passer au contact.
        On t'explique tout dans notre article{' '}
        <Link href="/blog/flag-football-cest-quoi/">le flag football, c'est quoi ?</Link>
      </p>
      <p>
        Notre conseil de club : <strong>ne choisis pas sur le papier, essaie les deux</strong>.
        Beaucoup de clubs (dont le nôtre) proposent une semaine ou plusieurs séances d'essai
        gratuites, souvent en début de saison mais aussi en cours d'année. Ton corps te dira très
        vite si le contact te fait vibrer ou si le flag te suffit largement.
      </p>

      <h2 id="trouver-un-club">Comment trouver un club près de chez soi</h2>
      <p>
        C'est l'étape la plus simple, et pourtant celle qui bloque le plus de monde. Trois
        méthodes qui fonctionnent :
      </p>
      <ul>
        <li>
          <strong>L'annuaire de la FFFA</strong> : le site de la fédération référence les clubs
          affiliés par région et par discipline (contact, flag, cheerleading). C'est la source la
          plus fiable pour vérifier qu'un club est bien affilié et assuré.
        </li>
        <li>
          <strong>Une recherche « football américain + ta ville »</strong> : les clubs français
          sont très présents sur Google et les réseaux sociaux. Tu tomberas presque toujours sur
          le site ou la page Instagram/Facebook du club le plus proche, avec les horaires
          d'entraînement et un moyen de contact.
        </li>
        <li>
          <strong>Le bouche-à-oreille</strong> : demande autour de toi — le foot US est une petite
          famille, et il y a de fortes chances qu'un collègue, un ami d'ami ou un ancien camarade
          de lycée joue ou ait joué quelque part.
        </li>
      </ul>
      <p>
        Une fois le club identifié, écris-lui ou présente-toi directement à un entraînement. Un
        vrai club de foot US accueille les débutants toute l'année : tu ne « déranges » jamais.
        Précise ton âge, ton envie (contact ou flag, jouer ou même aider le club autrement) et
        demande quand tu peux venir essayer. La réponse standard sera : « viens ce soir, prévois
        juste des crampons et une bouteille d'eau ».
      </p>

      <CtaQuiz />

      <h2 id="licence-prix">La licence : combien ça coûte ?</h2>
      <p>
        Pour jouer en compétition officielle, il faut une <strong>licence FFFA</strong>, délivrée
        par ton club. Elle comprend l'assurance sportive et l'accès aux championnats. Côté budget,
        compte en général <strong>entre 150 et 350 € par saison</strong> selon les clubs, les
        catégories et ce qui est inclus (maillot d'entraînement, prêt d'équipement, événements du
        club). Le flag est généralement moins cher que le contact, et les tarifs jeunes sont
        inférieurs aux tarifs seniors.
      </p>
      <p>
        Quelques points que les débutants ignorent souvent :
      </p>
      <ul>
        <li>
          Un <strong>certificat médical</strong> de non-contre-indication à la pratique du
          football américain (ou le questionnaire de santé selon ta situation) est demandé à
          l'inscription — comme dans tous les sports à licence.
        </li>
        <li>
          La plupart des clubs acceptent le <strong>paiement en plusieurs fois</strong>, et de
          nombreux dispositifs réduisent la facture : Pass'Sport, aides des comités
          d'entreprise, coupons sport, tarifs famille…
        </li>
        <li>
          Les <strong>séances d'essai sont gratuites</strong> presque partout : tu ne paies ta
          licence que lorsque tu décides de t'engager pour la saison.
        </li>
      </ul>
      <p>
        Rapporté au nombre d'entraînements (deux à trois par semaine pendant une saison qui court
        de septembre à juin), le foot US reste l'un des sports collectifs au meilleur rapport
        heures de jeu / prix — surtout quand le club prête l'équipement, et c'est justement le
        point suivant.
      </p>

      <h2 id="equipement">L'équipement : ce qu'il faut vraiment (et ce que le club prête)</h2>
      <p>
        L'image du débutant obligé d'acheter 600 € de matériel avant même son premier
        entraînement est un mythe. Voici la réalité :
      </p>
      <ul>
        <li>
          <strong>Pour essayer</strong> : une tenue de sport, des <strong>crampons</strong> (ceux
          de foot ou de rugby moulés font parfaitement l'affaire au début) et une bouteille d'eau.
          C'est tout.
        </li>
        <li>
          <strong>Pour le flag</strong> : la ceinture à flags est fournie par le club. Ton seul
          investissement personnel restera les crampons et éventuellement un protège-dents.
        </li>
        <li>
          <strong>Pour le contact</strong> : casque et épaulière sont indispensables — et la
          plupart des clubs, dont les Pionniers, <strong>prêtent un équipement complet aux
          débutants</strong> pour la première saison. Seul le protège-dents (quelques euros) doit
          être personnel, hygiène oblige.
        </li>
        <li>
          <strong>Plus tard, si tu accroches</strong> : tu pourras investir progressivement dans
          ton propre casque et ta propre épaulière, neufs ou d'occasion. Mais rien ne presse, et
          ton club saura te conseiller sur les tailles et les modèles.
        </li>
      </ul>
      <p>
        Autrement dit : <strong>le coût du matériel ne doit jamais t'empêcher de commencer</strong>.
        Si un club te demande d'acheter un équipement complet avant même d'avoir essayé, va voir
        le club d'à côté.
      </p>

      <h2 id="premier-entrainement">À quoi ressemble un premier entraînement</h2>
      <p>
        C'est la question qu'on nous pose le plus souvent, alors levons le mystère. Un
        entraînement type dure environ deux heures et suit à peu près toujours le même schéma :
      </p>
      <ul>
        <li>
          <strong>L'échauffement collectif</strong> (15-20 min) : course, mobilité, éducatifs
          d'appuis. Rien d'insurmontable — chacun à son rythme.
        </li>
        <li>
          <strong>Les fondamentaux par ateliers</strong> (30-40 min) : attraper un ballon, le
          porter, se mettre en position, courir un tracé. Les débutants sont regroupés avec un
          coach dédié : personne ne te jettera dans un plaquage le premier soir — dans les clubs
          sérieux, le contact ne s'apprend que progressivement, technique d'abord.
        </li>
        <li>
          <strong>Le travail par poste</strong> (30-40 min) : les receveurs travaillent leurs
          tracés, la ligne ses appuis, la défense ses lectures. En tant que débutant, tu tourneras
          sur plusieurs postes pour trouver celui qui te va.
        </li>
        <li>
          <strong>Le jeu</strong> (20-30 min) : situations d'équipe, souvent en effectif réduit ou
          en « touch » pour les nouveaux. C'est là que tu comprendras pourquoi ce sport rend
          accro : chaque action est un mini-scénario tactique.
        </li>
      </ul>
      <p>
        Côté ambiance, attends-toi à être accueilli chaleureusement. Le foot US français est un
        sport de passionnés en développement : chaque nouvelle recrue compte, et les vestiaires le
        savent. Tu seras probablement invité au troisième mi-temps avant même de connaître le nom
        de tous tes coéquipiers.
      </p>

      <CtaTunnel
        titre="Envie de vivre ce premier entraînement ?"
        texte="Si tu es dans la région de Tours, la semaine découverte des Pionniers est offerte : plusieurs séances d'essai, équipement prêté, zéro engagement."
        bouton="Je réserve ma semaine d'essai"
      />

      <h2 id="quel-poste">Quel poste est fait pour toi ?</h2>
      <p>
        Onze joueurs sur le terrain, et presque autant de métiers différents : le
        <strong> quarterback</strong> qui dirige l'attaque et lance, le <strong>running
        back</strong> qui perce les défenses ballon en main, les <strong>receveurs</strong> qui
        courent des tracés au cordeau, la <strong>ligne offensive</strong> — les colosses
        stratèges qui protègent leur quarterback —, la <strong>ligne défensive</strong> qui vit
        pour le sack, les <strong>linebackers</strong>, couteaux suisses de la défense, et les
        <strong> defensive backs</strong>, duellistes des airs. Grand, petit, massif, léger,
        explosif, endurant : <strong>chaque gabarit a un poste où il devient une arme</strong>.
      </p>
      <p>
        C'est exactement pour répondre à cette question qu'on a construit notre test :{' '}
        <Link href="/quel-poste-football-americain/">quel poste jouer au football
        américain ?</Link> Huit questions sur ton gabarit, tes qualités et ton rapport au
        contact, et notre algorithme de scouting — calibré sur les profils réels des joueurs NFL
        et universitaires — te propose le poste où tu as le plus de chances de t'éclater, en foot
        US ou en flag.
      </p>

      <h2 id="faq">Questions fréquentes</h2>
      <h3>Faut-il être costaud pour jouer au football américain ?</h3>
      <p>
        Non. Une équipe alignera le même soir un ailier de 65 kg et un lineman de 130 kg, et les
        deux seront décisifs. Le recrutement d'une équipe de foot US ressemble à un casting de
        film de braquage : il faut des profils radicalement différents pour que le plan
        fonctionne.
      </p>
      <h3>Est-ce que c'est dangereux ?</h3>
      <p>
        C'est un sport de contact, avec les risques inhérents — mais un contact
        <em> équipé, enseigné et arbitré</em>. Casque et épaulière homologués, apprentissage
        progressif du plaquage, règles strictes protégeant les joueurs : la pratique en club
        encadré n'a rien à voir avec les compilations de chocs vues sur les réseaux. Et si le
        contact ne te tente pas du tout, le flag t'offre le même sport, sans les plaquages.
      </p>
      <h3>Peut-on jouer sans connaître les règles ?</h3>
      <p>
        Oui — presque tout le monde débute comme ça. Il suffit de savoir qu'une attaque a quatre
        tentatives pour avancer de dix yards : tout le reste s'apprend sur le terrain, en jouant.
        Après un mois d'entraînements, tu regarderas un match de NFL en comprenant ce qui se
        passe. Promis.
      </p>
      <h3>Les filles peuvent-elles jouer ?</h3>
      <p>
        Évidemment. Le flag se pratique largement en mixte, des équipes et championnats féminins
        de contact existent, et l'équipe de France féminine de flag vise les JO de Los Angeles.
        Dans la plupart des clubs, les filles s'entraînent et jouent — au flag comme au casqué.
      </p>
      <h3>Quelle est la différence avec le rugby ?</h3>
      <p>
        Cousins lointains, jeux opposés. Au rugby, le jeu est continu et la passe se fait vers
        l'arrière ; au football américain, le jeu est découpé en actions de quelques secondes,
        préparées comme des coups d'échecs, et la passe vers l'avant est l'arme principale.
        Concrètement : le foot US demande moins d'endurance continue mais plus d'explosivité, et
        beaucoup plus de stratégie mémorisée — chaque équipe joue avec un « playbook » de
        dizaines de combinaisons. Les anciens rugbymen s'y reconvertissent d'ailleurs très bien,
        et l'inverse est vrai aussi.
      </p>
      <h3>Combien de temps dure un match ?</h3>
      <p>
        Quatre quart-temps de 12 minutes en France (temps de jeu arrêté), soit environ deux
        heures à deux heures trente au total avec les arrêts de chrono et la mi-temps. C'est un
        format d'après-midi : les matchs se jouent généralement le week-end, et l'équipe fait le
        déplacement ensemble — l'ambiance de bus fait partie intégrante du sport.
      </p>
      <h3>Quand commence la saison ? Peut-on s'inscrire en cours d'année ?</h3>
      <p>
        La saison sportive court de <strong>septembre à juin</strong> : la rentrée est le moment
        idéal pour débuter, avec les groupes de nouveaux. Mais les clubs accueillent des
        débutants toute l'année — en cours de saison, tu t'entraînes, tu progresses, et tu seras
        prêt pour la saison suivante.
      </p>

      <h2 id="touraine">Et si tu es en Touraine ? Viens essayer chez les Pionniers</h2>
      <p>
        Si tu vis à <strong>Tours ou en Indre-et-Loire</strong>, tu n'as même pas besoin de
        chercher : les Pionniers de Touraine t'attendent au <strong>Stade de la Chambrerie</strong>
        (Tours Nord). Foot US contact en senior et en jeunes, <strong>flag mixte</strong>, école
        de flag le samedi matin pour les enfants — et une <strong>semaine découverte
        offerte</strong>, équipement prêté, pour essayer sans rien débourser. Les tarifs à jour
        des adhésions sont détaillés sur <a href={`${asset('/')}#adhesions`}>notre page
        adhésions</a>.
      </p>
      <p>
        Clique sur le bouton ci-dessous, réponds à deux questions pour qu'on t'oriente vers le
        bon groupe, et on se voit à l'entraînement.
      </p>
    </>
  );
}
