import Link from 'next/link';
import { CtaQuiz, CtaTunnel } from '@/components/blog/CtaEncart';

/**
 * Article. Mot-clé : « flag football c'est quoi » (+ angle JO Los Angeles 2028).
 */
export default function ArticleFlag() {
  return (
    <>
      <p>
        Le <strong>flag football</strong> est la version sans contact du football américain : au
        lieu de plaquer le porteur du ballon, on lui arrache un « flag », un ruban accroché à sa
        ceinture par un scratch. Tout le reste y est : les passes spectaculaires, les tracés, les
        feintes, la stratégie… mais sans les chocs. Résultat : un sport mixte, accessible dès
        l'enfance, qui explose partout dans le monde au point de devenir <strong>discipline
        olympique aux Jeux de Los Angeles 2028</strong>.
      </p>
      <p>
        Chez les Pionniers de Touraine, on pratique le flag depuis des années, des enfants de
        l'école de flag du samedi matin aux adultes de l'équipe mixte du lundi soir. Voici tout ce
        qu'il faut savoir : les règles expliquées simplement, les différences avec le foot US
        « casqué », pourquoi les JO vont tout changer, et comment t'y mettre dès cette saison.
      </p>

      <h2 id="regles">Les règles du flag football, expliquées en 3 minutes</h2>
      <p>
        Si tu n'as jamais regardé un match de football américain, voici l'essentiel. Et si tu en
        as déjà vu, tu vas reconnaître exactement le même jeu, en version condensée :
      </p>
      <ul>
        <li>
          <strong>5 contre 5</strong>, sur un terrain réduit (environ 50 yards de long, soit la
          moitié d'un terrain classique), des mi-temps courtes : le format international est
          rapide et intense.
        </li>
        <li>
          <strong>Le but : marquer des touchdowns.</strong> L'attaque part de sa moitié de terrain
          et doit amener le ballon dans la zone d'en-but adverse, par la passe ou par la course.
          Un touchdown vaut 6 points, suivi d'une transformation à 1 ou 2 points tentée près de
          l'en-but.
        </li>
        <li>
          <strong>Quatre tentatives pour avancer.</strong> L'attaque dispose de quatre
          « downs » pour franchir la mi-terrain, puis quatre autres pour marquer. Chaque action
          démarre par un snap au quarterback, qui lance ou transmet le ballon.
        </li>
        <li>
          <strong>Le « plaquage » = arracher un flag.</strong> Dès qu'un défenseur retire un flag
          de la ceinture du porteur du ballon, l'action s'arrête là où il se trouvait. Aucun
          contact volontaire n'est autorisé : ni plaquage, ni bloc, ni écran. C'est LA règle qui
          change tout.
        </li>
        <li>
          <strong>Les interceptions comptent double plaisir :</strong> une défense qui attrape
          une passe adverse peut remonter le ballon et marquer. Les retournements de situation
          sont permanents : c'est ce qui rend les matchs si spectaculaires.
        </li>
      </ul>
      <p>
        L'équipement se résume à une ceinture à flags, un protège-dents, des crampons et un
        ballon. Pas de casque, pas d'épaulière : tu peux jouer ton premier match une semaine
        après ta première séance.
      </p>

      <h2 id="action-type">Une action type, racontée</h2>
      <p>
        Pour te projeter, voici à quoi ressemblent dix secondes de flag. Ton équipe attaque à 25
        mètres de l'en-but. Dans le huddle, ta quarterback annonce la combinaison : toi, tu cours
        un « out » à cinq mètres : droit devant, puis coupe sèche vers la touche. Snap. Tu
        exploses sur tes trois premiers appuis, ton défenseur recule, tu plantes ta coupe. Un
        mètre d'écart, c'est assez. Le ballon arrive fort, tu le prends à deux mains, pivote,
        remonte le terrain. Un défenseur plonge sur ta ceinture : tu sens le scratch céder à
        l'instant où tu franchis la ligne des dix mètres. L'action est finie, huit mètres
        gagnés, tout le monde se relève en souriant, et on remet ça dans vingt secondes.
        Multiplie par quarante actions et tu as un match : une accumulation de duels éclairs, de
        décisions et de petites victoires. Aucun chrono de course à pied ne t'offrira jamais ça.
      </p>

      <h2 id="origines">D'où vient le flag football ?</h2>
      <p>
        Le flag est né aux États-Unis au milieu du XXe siècle, d'abord dans les bases
        militaires puis dans les écoles et les entraînements, partout où l'on voulait jouer au
        football sans les risques du plaquage. Longtemps considéré comme un simple outil
        d'initiation, il est devenu une discipline à part entière : championnats scolaires et
        universitaires américains (notamment féminins, en pleine explosion), circuits
        internationaux sous l'égide de l'IFAF, et championnats nationaux dans des dizaines de
        pays, dont la France, où la FFFA organise la pratique en clubs. La consécration
        olympique de 2028 n'est donc pas un caprice du calendrier : c'est l'aboutissement de
        trente ans de croissance continue d'un format qui a résolu la grande contradiction du
        football américain : garder l'intelligence et le spectacle du jeu, retirer les impacts.
      </p>

      <h2 id="differences">Flag ou foot US casqué : les vraies différences</h2>
      <p>
        Le flag n'est pas un football américain « au rabais » : c'est le même sport, recentré sur
        la vitesse, la précision et la lecture du jeu. Concrètement :
      </p>
      <ul>
        <li>
          <strong>Le contact.</strong> Au casqué, plaquer et bloquer font partie du jeu et
          s'apprennent avec un équipement complet. Au flag, le contact est interdit : la défense
          gagne par le placement et l'anticipation, pas par l'impact.
        </li>
        <li>
          <strong>Le rythme.</strong> À 5 contre 5 sur terrain réduit, tout le monde touche le
          ballon, tout le monde défend, tout le monde court : beaucoup plus de ballons joués par
          personne qu'à 11 contre 11.
        </li>
        <li>
          <strong>La mixité.</strong> Le flag se pratique très largement en équipes mixtes,
          notamment en loisir et dans de nombreux championnats. Sur un terrain de flag, ce qui
          compte, c'est le tracé et les mains, pas le gabarit.
        </li>
        <li>
          <strong>La porte d'entrée.</strong> Le flag est le chemin le plus court pour comprendre
          le football américain : mêmes tracés, mêmes lectures, mêmes termes. Beaucoup de joueurs
          de casqué sont passés par le flag, et beaucoup de joueurs de flag n'éprouvent jamais
          le besoin d'aller au contact, et c'est très bien aussi.
        </li>
      </ul>
      <p>
        Envie de comparer en détail les deux pratiques, les équipements et les coûts ? Notre{' '}
        <Link href="/blog/comment-pratiquer-le-football-americain-en-france/">guide complet pour
        débuter le football américain en France</Link> consacre une section entière au choix
        entre flag et contact.
      </p>

      <h2 id="jo-2028">Les JO de Los Angeles 2028 : pourquoi tout le monde parle du flag</h2>
      <p>
        En octobre 2023, le Comité International Olympique a officialisé l'entrée du flag
        football au programme des <strong>Jeux Olympiques de Los Angeles 2028</strong>, en tournoi
        masculin et féminin à 5 contre 5. Pour un sport encore confidentiel en France il y a dix
        ans, c'est un séisme :
      </p>
      <ul>
        <li>
          <strong>La NFL pousse fort</strong> : la ligue américaine investit massivement dans le
          flag mondial, et des stars NFL ont déjà annoncé rêver des Jeux. L'exposition médiatique
          du flag va exploser d'ici 2028.
        </li>
        <li>
          <strong>La France est concernée au premier chef</strong> : nos équipes de France de
          flag, masculine et féminine, figurent parmi les nations européennes compétitives, et
          une qualification olympique se joue dès maintenant, dans les clubs, avec la génération
          qui s'entraîne aujourd'hui.
        </li>
        <li>
          <strong>Les clubs français recrutent</strong> : partout en France, les sections flag
          s'ouvrent ou s'agrandissent. C'est le meilleur moment de l'histoire de ce sport pour
          s'y mettre : dans cinq ans, tu pourras dire que tu jouais « avant les JO ».
        </li>
      </ul>
      <p>
        Et ce n'est pas qu'un argument marketing : l'effet olympique, c'est plus de moyens pour
        la formation, plus de tournois, plus de médiatisation, et à terme des sections flag dans
        les écoles. Le flag de 2028 ressemblera au handball de 1992 : un sport qui bascule dans
        une autre dimension.
      </p>

      <CtaQuiz
        titre="Flag ou casqué : quel profil es-tu ?"
        texte="Réponds à 9 questions (gabarit, poids, vitesse, rapport au contact) et notre algorithme de scouting te dit quel poste te correspond, en flag comme en foot US."
        bouton="Je découvre mon poste"
      />

      <h2 id="postes">Les postes au flag : cinq rôles, cinq personnalités</h2>
      <p>
        À 5 contre 5, chaque joueur compte double. Voici les rôles types d'une équipe de flag.
        Tu vas vite reconnaître le tien :
      </p>
      <ul>
        <li>
          <strong>Le quarterback (QB)</strong> : le cerveau. Il annonce la combinaison, lit la
          défense en deux secondes et distribue le ballon. Pas besoin d'un canon à la place du
          bras : au flag, la précision et la vitesse de décision priment sur la puissance.
        </li>
        <li>
          <strong>Le centre</strong> : il snappe le ballon au QB puis devient immédiatement une
          option de passe courte. Poste sous-coté, adoré des joueurs malins qui savent se rendre
          disponibles.
        </li>
        <li>
          <strong>Les receveurs</strong> : les artistes. Leurs armes : des appuis tranchants, des
          tracés précis au mètre près et des mains sûres. C'est le poste rêvé des profils vifs et
          des anciens joueurs de sports de raquette ou de basket.
        </li>
        <li>
          <strong>Le rusher</strong> (en défense) : le seul autorisé à traverser pour presser le
          quarterback, en partant à sept mètres. Explosivité pure et timing : le poste qui fait
          lever les bancs quand le QB adverse doit se débarrasser du ballon en catastrophe.
        </li>
        <li>
          <strong>Les défenseurs</strong> : mi-cornerbacks, mi-safeties, ils couvrent les
          receveurs, lisent les yeux du QB et chassent l'interception. Les meilleurs arracheurs
          de flags gagnent des matchs à eux seuls.
        </li>
      </ul>
      <p>
        Tu hésites sur ton profil ? Notre <Link href="/quel-poste-football-americain/">test de
        poste</Link> couvre aussi les rôles du flag : il t'orientera en neuf questions.
      </p>

      <h2 id="lexique">Le petit lexique pour survivre à ta première séance</h2>
      <p>
        Le flag parle anglais, mais rassure-toi : dix mots suffisent pour tout comprendre.
      </p>
      <ul>
        <li><strong>Snap</strong> : la remise du ballon qui lance chaque action.</li>
        <li><strong>Down</strong> : une tentative. L'attaque en a quatre pour franchir la mi-terrain, puis quatre pour marquer.</li>
        <li><strong>Touchdown (TD)</strong> : 6 points, le ballon franchit la ligne d'en-but.</li>
        <li><strong>Conversion</strong> : la transformation à 1 ou 2 points tentée après un touchdown.</li>
        <li><strong>Route (tracé)</strong> : le chemin précis que court un receveur (slant, out, go, post…).</li>
        <li><strong>Blitz / rush</strong> : la pression sur le quarterback.</li>
        <li><strong>Interception</strong> : passe volée par la défense, qui peut contre-attaquer dans la foulée.</li>
        <li><strong>Flag guarding</strong> : protéger son flag avec la main ou le bras. Interdit, et pénalisé.</li>
        <li><strong>Playbook</strong> : le recueil des combinaisons de ton équipe.</li>
        <li><strong>Huddle</strong> : le regroupement éclair où le QB annonce la combinaison avant chaque action.</li>
      </ul>

      <h2 id="physique">Le flag est-il vraiment moins physique ? Parlons cash</h2>
      <p>
        « Sans contact » ne veut pas dire « sans effort ». Un match de flag, c'est une succession
        de sprints, de changements de direction et de duels d'appuis : cardio et cuisses
        travaillent sérieusement, et tu finiras tes premières séances heureux et lessivé. En
        revanche, ce que le flag retire, ce sont les <strong>impacts</strong> : pas de plaquages,
        pas de blocs, pas de chocs tête contre tête. Résultat : un profil de risque comparable à
        celui des autres sports de course et d'appuis (l'entorse de cheville reste la blessure
        classique), très loin des contraintes du casqué. C'est précisément ce qui en fait le
        format idéal pour reprendre le sport après des années de pause, ou pour durer : au flag,
        on joue encore à 45 ans, et personne ne trouve ça remarquable.
      </p>
      <p>
        Autre atout que les débutants découvrent vite : les <strong>remplacements illimités</strong>.
        Tu gères ton intensité, tu souffles quand tu en as besoin, et tu montes en volume au fil
        des semaines. Le flag est exigeant avec ceux qui veulent la gagne, et indulgent avec ceux
        qui reviennent de loin. Les deux dans la même équipe.
      </p>

      <h2 id="pour-qui">À qui s'adresse le flag football ?</h2>
      <p>
        À peu près tout le monde, et ce n'est pas une formule. Dans une même semaine, notre
        section flag voit passer :
      </p>
      <ul>
        <li>
          <strong>Des enfants de 6 à 12 ans</strong>, pour qui le flag est le format d'initiation
          idéal : on apprend à attraper, courir des tracés et lire le jeu, sans aucun choc, dans
          un cadre ultra-ludique. C'est l'école de flag du samedi matin.
        </li>
        <li>
          <strong>Des ados et jeunes adultes</strong> qui découvrent le football américain par le
          flag avant, parfois, de basculer vers le casqué : le geste technique est le même, seule
          la finition change.
        </li>
        <li>
          <strong>Des adultes qui reprennent le sport</strong> : cardio réel mais sans impacts,
          intensité modulable, apprentissage rapide : le flag est probablement le sport collectif
          le plus indulgent qui soit pour un retour après des années de pause. On en parle aussi
          dans notre article <Link href="/blog/commencer-le-football-americain-adulte/">commencer
          le foot US à l'âge adulte</Link>.
        </li>
        <li>
          <strong>Des joueuses et joueurs de casqué</strong> qui viennent y travailler leurs
          mains, leurs tracés et leur vitesse pendant l'intersaison.
        </li>
        <li>
          <strong>Des groupes d'amis et des couples</strong>, parce qu'un sport mixte où l'on
          peut débuter ensemble le même soir, il n'y en a pas tant que ça.
        </li>
      </ul>
      <p>
        Côté condition physique : si tu peux enchaîner quelques sprints de vingt mètres avec des
        pauses, tu peux jouer au flag. L'endurance et la vitesse viennent en jouant, et les
        remplacements sont illimités.
      </p>

      <h2 id="commencer">Comment commencer le flag football ?</h2>
      <p>
        Le mode d'emploi tient en trois lignes : trouve un club affilié FFFA près de chez toi
        (l'annuaire de la fédération ou une recherche « flag football + ta ville » suffisent),
        écris-lui, et viens essayer : une tenue de sport et des crampons moulés suffisent, le
        club fournit ceintures et ballons. La licence flag est en général plus abordable que la
        licence contact, et les séances d'essai sont gratuites dans la plupart des clubs.
      </p>
      <p>
        Un conseil de coach pour ta première séance : ne stresse pas sur les règles. Retiens
        juste « quatre tentatives pour avancer, pas de contact, arrache le flag », et le reste
        viendra en jouant. Au bout de trois séances, tu appelleras les tracés par leur nom
        anglais comme tout le monde.
      </p>

      <h2 id="faq">Questions fréquentes sur le flag football</h2>
      <h3>Le flag football est-il mixte ?</h3>
      <p>
        Très largement, oui. En loisir et dans beaucoup de championnats, filles et garçons
        jouent dans la même équipe. C'est même l'un des rares sports collectifs où débuter en
        couple ou entre amis de gabarits différents fonctionne naturellement. En compétition
        internationale (et aux JO 2028), les tournois sont séparés masculin/féminin.
      </p>
      <h3>À partir de quel âge un enfant peut-il jouer ?</h3>
      <p>
        Dès 6-8 ans dans la plupart des écoles de flag. Le format est parfait pour les enfants :
        pas de contact, beaucoup de courses et de jeux de ballon, des règles simples. C'est
        aussi, de plus en plus, le format retenu par l'école et le sport scolaire pour faire
        découvrir le football américain.
      </p>
      <h3>Faut-il avoir joué au foot US pour se mettre au flag ?</h3>
      <p>
        Pas du tout : la majorité des joueurs de flag n'ont jamais porté de casque. Dans l'autre
        sens, le flag est la meilleure école pour ensuite passer au contact si l'envie vient :
        mêmes tracés, mêmes lectures, même vocabulaire.
      </p>
      <h3>Que faut-il acheter pour commencer ?</h3>
      <p>
        Des crampons moulés (foot ou rugby) et un protège-dents. La ceinture à flags et les
        ballons sont fournis par le club. Budget de départ : moins de 50 €, souvent avec des
        affaires que tu possèdes déjà.
      </p>

      <CtaTunnel
        titre="Essaie le flag cette semaine"
        texte="Si tu es à Tours ou dans les environs, l'équipe flag mixte des Pionniers accueille les débutants toute l'année : première semaine offerte, ceinture et ballon fournis."
        bouton="Je viens essayer le flag"
      />

      <h2 id="tours">Le flag à Tours : l'école du samedi et l'équipe mixte des Pionniers</h2>
      <p>
        En Touraine, le flag football, c'est chez les <strong>Pionniers de Touraine</strong>, au
        Stade de la Chambrerie à Tours :
      </p>
      <ul>
        <li>
          <strong>L'école de flag</strong>, le samedi matin (10h-12h), pour les enfants : éveil
          au jeu, motricité, premiers tracés, dans l'esprit ludique d'un sport sans contact.
        </li>
        <li>
          <strong>Le flag mixte seniors</strong>, deux soirs par semaine (lundi et jeudi), pour
          les adultes : du débutant complet au joueur confirmé, filles et garçons dans la même
          équipe.
        </li>
        <li>
          <strong>Les juniors</strong>, qui alternent flag et foot US dans leur formation.
        </li>
      </ul>
      <p>
        Et comme pour toutes nos sections, la <strong>semaine découverte est offerte</strong> :
        tu viens, tu essaies, et tu décides ensuite. À cinq ans des Jeux de Los Angeles, il n'y
        aura jamais eu de meilleur moment pour attraper ton premier flag.
      </p>
    </>
  );
}
