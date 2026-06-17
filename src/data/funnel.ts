/**
 * Arbre du tunnel « Nous rejoindre ».
 * -------------------------------------------------------------------------
 * Tout le contenu éditable du tunnel vit ici. Le club peut modifier les
 * libellés, équipes, postes et missions SANS toucher au code des composants.
 *
 * Hiérarchie :
 *   Branche (Pratiquer / Aider)
 *     └─ Choix (discipline ou domaine)
 *         └─ Annonce[] (poste / équipe / mission)  → bouton « S'engager »
 *
 * Les contenus ci-dessous sont des PLACEHOLDERS réalistes à valider par le club.
 */

export type IconName =
  | 'Zap'
  | 'HeartHandshake'
  | 'ShieldHalf'
  | 'Flag'
  | 'Megaphone'
  | 'Scale'
  | 'Briefcase'
  | 'Sparkles';

export type Annonce = {
  id: string;
  titre: string;
  sousTitre?: string;
  description: string;
  tags: string[];
  niveau?: string;
};

export type Choix = {
  key: string;
  label: string;
  sousLabel: string;
  icon: IconName;
  /** Intro affichée au-dessus des annonces de ce choix. */
  intro: string;
  annonces: Annonce[];
};

export type Branche = {
  key: 'pratiquer' | 'aider';
  label: string;
  sousLabel: string;
  icon: IconName;
  /** Question posée à l'étape 1 de la branche. */
  question: string;
  choix: Choix[];
};

export const BRANCHES: Branche[] = [
  // ─────────────────────────── PRATIQUER ───────────────────────────
  {
    key: 'pratiquer',
    label: 'Pratiquer',
    sousLabel: 'Entrer sur le terrain et jouer',
    icon: 'Zap',
    question: 'Tu souhaites pratiquer…',
    choix: [
      {
        key: 'americain',
        label: 'Football américain',
        sousLabel: 'Le jeu au contact, casque & plaquages',
        icon: 'ShieldHalf',
        intro:
          'Choisis ton équipe : chaque section recrute à plusieurs postes. Débutant ou confirmé, il y a une place pour toi.',
        annonces: [
          {
            id: 'fa-senior',
            titre: 'Équipe Senior',
            sousTitre: 'Hommes · +18 ans · Championnat',
            description:
              "L'équipe fanion recrute sur l'ensemble des postes pour la saison à venir. Aucune expérience requise, formation assurée dès l'arrivée.",
            tags: [
              'Ligne offensive',
              'Ligne défensive',
              'Quarterback',
              'Receveur',
              'Linebacker',
              'Defensive back',
            ],
            niveau: 'Débutant accepté',
          },
          {
            id: 'fa-feminine',
            titre: 'Équipe Féminine',
            sousTitre: 'Femmes · +18 ans',
            description:
              "Une section féminine en plein essor. Viens découvrir le football américain dans un cadre bienveillant et compétitif.",
            tags: ['Tous postes', 'Initiation', 'Compétition'],
            niveau: 'Débutant accepté',
          },
          {
            id: 'fa-jeunes',
            titre: 'Section Jeunes',
            sousTitre: 'U16 & U19 · Cadets / Juniors',
            description:
              "Encadrement diplômé, progression technique et esprit d'équipe pour les jeunes joueurs. Premiers contacts en toute sécurité.",
            tags: ['U16', 'U19', 'École de football US'],
            niveau: 'Tous niveaux',
          },
        ],
      },
      {
        key: 'flag',
        label: 'Flag football',
        sousLabel: 'Sans contact, rapide et accessible',
        icon: 'Flag',
        intro:
          'Le flag, c’est le football US sans plaquage : on arrache un foulard. Mixte, rapide et ouvert à tous les âges.',
        annonces: [
          {
            id: 'flag-mixte',
            titre: 'Flag Adulte Mixte',
            sousTitre: '+16 ans · Loisir & compétition',
            description:
              'Format 5x5 dynamique, idéal pour débuter le football américain sans contact. Ambiance conviviale, matchs réguliers.',
            tags: ['Attaque', 'Défense', 'Mixte'],
            niveau: 'Débutant accepté',
          },
          {
            id: 'flag-feminine',
            titre: 'Flag Féminine',
            sousTitre: 'Femmes · +16 ans',
            description:
              'Discipline olympique en 2028 ! Rejoins une équipe féminine ambitieuse et participe à la montée en puissance du flag.',
            tags: ['Tous postes', 'Compétition', 'Olympique 2028'],
            niveau: 'Tous niveaux',
          },
          {
            id: 'flag-jeunes',
            titre: 'Flag Jeunes',
            sousTitre: 'U12 & U15',
            description:
              'La porte d’entrée idéale vers le football américain pour les enfants : motricité, jeu collectif et plaisir avant tout.',
            tags: ['U12', 'U15', 'École de sport'],
            niveau: 'Tous niveaux',
          },
        ],
      },
    ],
  },

  // ───────────────────────────── AIDER ─────────────────────────────
  {
    key: 'aider',
    label: 'Aider',
    sousLabel: 'Faire vivre le club hors du terrain',
    icon: 'HeartHandshake',
    question: 'Tu souhaites aider en…',
    choix: [
      {
        key: 'coacher',
        label: 'Coacher',
        sousLabel: 'Transmettre et faire progresser',
        icon: 'Megaphone',
        intro:
          'Encadre nos équipes et partage ta passion du jeu. Formations fédérales prises en charge par le club.',
        annonces: [
          {
            id: 'coach-assistant',
            titre: 'Coach assistant',
            sousTitre: 'Senior / Jeunes',
            description:
              "Épaule le staff sur les entraînements et les matchs. Une expérience du football US est un plus, mais la motivation prime.",
            tags: ['Entraînements', 'Stratégie', 'Week-end'],
            niveau: 'Formation assurée',
          },
          {
            id: 'coach-prepa',
            titre: 'Préparateur physique',
            sousTitre: 'Toutes équipes',
            description:
              'Construis et anime les séances de préparation physique. Idéal pour profils STAPS ou coachs sportifs.',
            tags: ['Préparation physique', 'Athlétisation', 'Suivi'],
            niveau: 'Profil sportif souhaité',
          },
        ],
      },
      {
        key: 'arbitrer',
        label: 'Arbitrer',
        sousLabel: 'Garant du jeu et des règles',
        icon: 'Scale',
        intro:
          'Deviens officiel : un rôle clé, recherché, et une autre façon de vivre le football américain de l’intérieur.',
        annonces: [
          {
            id: 'arb-terrain',
            titre: 'Officiel de terrain',
            sousTitre: 'Arbitre de champ',
            description:
              "Apprends à arbitrer les rencontres. Cursus de formation fédérale et accompagnement par des officiels expérimentés.",
            tags: ['Règlement', 'Match', 'Formation FFFA'],
            niveau: 'Débutant accepté',
          },
          {
            id: 'arb-table',
            titre: 'Officiel de table & chaîne',
            sousTitre: 'Chronomètre / down box',
            description:
              'Gère le chronomètre, le score et la chaîne lors des matchs à domicile. Un premier pas simple dans l’arbitrage.',
            tags: ['Chronométrage', 'Score', 'Bénévolat ponctuel'],
            niveau: 'Tous niveaux',
          },
        ],
      },
      {
        key: 'gerer',
        label: 'Gérer',
        sousLabel: "L'organisation et la logistique",
        icon: 'Briefcase',
        intro:
          'Le club tourne grâce à ses bénévoles d’organisation. Mets tes compétences au service du projet.',
        annonces: [
          {
            id: 'ger-event',
            titre: 'Responsable événementiel',
            sousTitre: 'Matchs & buvette',
            description:
              'Organise les jours de match : accueil, buvette, animations. Un rôle central et convivial.',
            tags: ['Événementiel', 'Logistique', 'Équipe'],
            niveau: 'Tous profils',
          },
          {
            id: 'ger-admin',
            titre: 'Trésorier·ère / Secrétaire',
            sousTitre: 'Bureau du club',
            description:
              'Participe à la gestion administrative et financière de l’association. Rigueur et discrétion appréciées.',
            tags: ['Administration', 'Comptabilité', 'Association'],
            niveau: 'Expérience appréciée',
          },
          {
            id: 'ger-materiel',
            titre: 'Logistique matériel',
            sousTitre: 'Équipements',
            description:
              'Gère le parc de matériel : casques, épaulières, ballons. Suivi des stocks et des commandes.',
            tags: ['Matériel', 'Stocks', 'Organisation'],
            niveau: 'Tous profils',
          },
        ],
      },
      {
        key: 'creer',
        label: 'Créer',
        sousLabel: "L'image et le contenu du club",
        icon: 'Sparkles',
        intro:
          'Donne de la voix et de l’image aux Pionniers. Le club cherche des créatifs pour rayonner.',
        annonces: [
          {
            id: 'cre-media',
            titre: 'Photographe / Vidéaste',
            sousTitre: 'Captation des matchs',
            description:
              'Immortalise les rencontres et crée du contenu fort pour nos réseaux. Matériel partagé avec le club.',
            tags: ['Photo', 'Vidéo', 'Réseaux sociaux'],
            niveau: 'Portfolio bienvenu',
          },
          {
            id: 'cre-graph',
            titre: 'Graphiste / Community manager',
            sousTitre: 'Identité & réseaux',
            description:
              'Conçois visuels, affiches et calendrier de publication. Fais grandir la communauté des Pionniers.',
            tags: ['Design', 'Instagram', 'Communication'],
            niveau: 'Tous niveaux',
          },
          {
            id: 'cre-speaker',
            titre: 'Speaker de match',
            sousTitre: 'Animation stade',
            description:
              'Anime l’ambiance les jours de match au micro. Énergie et bonne humeur indispensables !',
            tags: ['Animation', 'Micro', 'Jour de match'],
            niveau: 'Tous profils',
          },
        ],
      },
    ],
  },
];

export const getBranche = (key: string) =>
  BRANCHES.find((b) => b.key === key);
