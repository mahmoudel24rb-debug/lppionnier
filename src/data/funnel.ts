/**
 * Parcours d'orientation et de recrutement — Pionniers de Touraine.
 * Modélisé d'après TUNNELv2.2.
 *
 * Principe : l'utilisateur exprime d'abord sa MOTIVATION (arbre de choix),
 * puis découvre des OFFRES/MISSIONS détaillées filtrées selon son parcours.
 *
 * Arbre récursif : un nœud branchant a `question` + `children` ; un nœud
 * terminal a `offers` (fiches détaillées). `icon` = clé mappée dans funnelIcons.
 */

export type OfferSection = { heading: string; items: string[] };

export type Offer = {
  id: string;
  titre: string;
  punchline?: string;
  paragraphs?: string[];
  sections?: OfferSection[];
  quote?: string;
  tag: string;
};

export type Node = {
  id: string;
  label: string;
  desc?: string;
  icon: string;
  /** Prompt affiché quand on présente les enfants de ce nœud. */
  question?: string;
  children?: Node[];
  /** Nœud terminal : fiches détaillées. */
  offers?: Offer[];
};

const sec = (heading: string, ...items: string[]): OfferSection => ({ heading, items });

// ─────────────────────────────────────────────────────────────
// JOUER — fiches Découverte / Rejoindre, Jeunes / Seniors
// ─────────────────────────────────────────────────────────────
const FA_DECOUVRIR: Node = {
  id: 'fa-decouvrir', label: 'Découvrir le Football Américain', icon: 'decouvrir',
  desc: "Vivez l'expérience du terrain pendant une semaine et découvrez si ce sport est fait pour vous.",
  question: 'Pour qui ?',
  children: [
    {
      id: 'fa-dec-jeunes', label: 'Jeunes', icon: 'jeunes',
      desc: 'Une semaine pour découvrir le football américain dans un cadre adapté à votre âge.',
      offers: [{
        id: 'fa-dec-jeunes-o', titre: 'Semaine découverte — Jeunes',
        punchline: 'Une semaine pour découvrir le football américain.',
        paragraphs: [
          "Votre enfant souhaite essayer un sport collectif différent ? Grâce à notre semaine découverte offerte, il pourra participer aux entraînements de sa catégorie, découvrir les fondamentaux du football américain et vivre une première expérience au sein du club.",
          "Aucune expérience préalable n'est nécessaire.",
        ],
        sections: [sec('Au programme', "Participation aux entraînements de la section jeune", 'Découverte des bases du jeu', 'Encadrement par nos éducateurs', 'Immersion dans la vie du club')],
        tag: 'Semaine découverte offerte',
      }],
    },
    {
      id: 'fa-dec-seniors', label: 'Seniors', icon: 'seniors',
      desc: "Une semaine pour vivre l'expérience du football américain au sein de notre équipe senior.",
      offers: [{
        id: 'fa-dec-seniors-o', titre: 'Semaine découverte — Seniors',
        punchline: 'Une semaine pour découvrir un sport de contact unique.',
        paragraphs: [
          "Participez aux entraînements de notre section senior pendant une semaine et découvrez le football américain dans des conditions réelles de pratique.",
          "Vous découvrirez les fondamentaux du jeu, l'ambiance de l'équipe et les exigences d'une discipline où stratégie, engagement et esprit collectif occupent une place centrale.",
          "Aucune expérience préalable n'est nécessaire.",
        ],
        sections: [sec('Au programme', 'Participation aux entraînements seniors', 'Découverte des fondamentaux du jeu', 'Rencontre avec les coachs et les joueurs', "Immersion dans la vie de l'équipe")],
        tag: 'Semaine découverte offerte',
      }],
    },
  ],
};

const FA_REJOINDRE: Node = {
  id: 'fa-rejoindre', label: 'Rejoindre une équipe', icon: 'rejoindre',
  desc: 'Intégrez nos effectifs et engagez-vous dans une saison sportive ambitieuse.',
  question: 'Pour qui ?',
  children: [
    {
      id: 'fa-rej-jeunes', label: 'Jeunes', icon: 'jeunes',
      desc: "Grandir, apprendre et s'épanouir à travers le sport.",
      offers: [{
        id: 'fa-rej-jeunes-o', titre: 'École de Football Américain — Jeunes',
        punchline: 'Développez votre potentiel dans un environnement structuré et bienveillant.',
        paragraphs: [
          "Notre école de football américain accueille les jeunes souhaitant pratiquer une discipline complète qui développe confiance en soi, respect, esprit d'équipe et dépassement de soi.",
          "Chaque joueur progresse à son rythme au sein d'un groupe adapté à son âge et encadré par des éducateurs investis dans son développement sportif et humain.",
        ],
        sections: [sec('Ce que nous proposons', 'Encadrement adapté à chaque catégorie', 'Apprentissage progressif du jeu', 'Développement physique et technique', 'Valeurs éducatives fortes', 'Participation aux rencontres et compétitions')],
        tag: 'Licence annuelle Jeune',
      }],
    },
    {
      id: 'fa-rej-seniors', label: 'Seniors', icon: 'seniors',
      desc: "Un programme exigeant ouvert à tous ceux qui sont prêts à s'investir pleinement.",
      offers: [{
        id: 'fa-rej-seniors-o', titre: 'Équipe Senior — Football Américain',
        punchline: 'Intégrez un programme conçu pour celles et ceux qui veulent progresser.',
        paragraphs: [
          "Au sein de notre section senior, nous accueillons aussi bien des débutants motivés que des joueurs expérimentés. Aucune expérience préalable n'est nécessaire. En revanche, nous demandons à chaque joueur un véritable engagement dans son parcours sportif.",
          "Notre équipe évolue dans le cadre du PPP – Pionniers Programme Performance, un environnement structuré qui vise à accompagner chaque athlète dans sa progression physique, technique, tactique et mentale.",
        ],
        sections: [
          sec('Ce que nous recherchons', 'Assiduité aux entraînements', 'Implication dans la vie du groupe', "Volonté d'apprendre et de progresser", 'Respect du cadre et des objectifs collectifs', 'Recherche constante de dépassement de soi'),
          sec('Ce que nous proposons', 'Un accompagnement structuré', 'Un suivi de progression', 'Un encadrement engagé', 'Une culture de performance accessible à tous', 'Une équipe ambitieuse et solidaire'),
        ],
        quote: "Le talent peut s'acquérir. L'engagement est un choix.",
        tag: 'Licence annuelle Senior',
      }],
    },
  ],
};

const FLAG_DECOUVRIR: Node = {
  id: 'flag-decouvrir', label: 'Découvrir le Flag Football', icon: 'decouvrir',
  desc: 'Essayez gratuitement pendant une semaine une discipline sans contact, dynamique, accessible et ouverte à tous.',
  question: 'Pour qui ?',
  children: [
    {
      id: 'flag-dec-jeunes', label: 'Jeunes', icon: 'jeunes',
      desc: 'Une semaine pour découvrir une discipline sans contact, ludique, rapide et accessible.',
      offers: [{
        id: 'flag-dec-jeunes-o', titre: 'Semaine découverte — Jeunes',
        punchline: 'Une semaine pour essayer le Flag Football.',
        paragraphs: ["Grâce à notre semaine découverte offerte, votre enfant participe aux entraînements de sa catégorie et découvre un sport collectif basé sur l'évitement, la vitesse et la coopération."],
        sections: [sec('Au programme', 'Participation aux entraînements jeunes', 'Découverte des règles du Flag Football', "Encadrement adapté à l'âge", 'Immersion dans la vie du club')],
        tag: 'Semaine découverte offerte',
      }],
    },
    {
      id: 'flag-dec-seniors', label: 'Seniors', icon: 'seniors',
      desc: 'Une semaine pour découvrir un sport sans contact, rapide, stratégique et accessible.',
      offers: [{
        id: 'flag-dec-seniors-o', titre: 'Semaine découverte — Seniors',
        punchline: 'Essayez le Flag Football dans des conditions réelles de pratique.',
        paragraphs: [
          "Participez aux entraînements de notre section Flag Football et découvrez une discipline moderne qui allie vitesse, lecture du jeu et esprit collectif.",
          'Accessible aux débutants comme aux sportifs confirmés.',
        ],
        sections: [sec('Au programme', 'Participation aux entraînements seniors', 'Découverte des fondamentaux', 'Rencontre avec les joueurs et les coachs', "Immersion dans l'équipe")],
        tag: 'Semaine découverte offerte',
      }],
    },
  ],
};

const FLAG_REJOINDRE: Node = {
  id: 'flag-rejoindre', label: 'Rejoindre une équipe', icon: 'rejoindre',
  desc: 'Intégrez une pratique en plein essor où vitesse, stratégie et esprit collectif sont au cœur du jeu.',
  question: 'Pour qui ?',
  children: [
    {
      id: 'flag-rej-jeunes', label: 'Jeunes', icon: 'jeunes',
      desc: 'Développez vos qualités physiques et collectives dans une discipline sans contact, moderne et accessible.',
      offers: [{
        id: 'flag-rej-jeunes-o', titre: 'Section Jeune — Flag Football',
        punchline: 'Rejoignez notre section jeune Flag Football.',
        paragraphs: ["Votre enfant évoluera dans un environnement favorisant la progression, le plaisir de jouer et l'apprentissage des valeurs du sport collectif."],
        sections: [sec('Ce que nous proposons', 'Encadrement adapté', 'Développement des qualités athlétiques', 'Apprentissage du jeu collectif', 'Participation aux rencontres et compétitions')],
        tag: 'Licence annuelle Jeune',
      }],
    },
    {
      id: 'flag-rej-seniors', label: 'Seniors', icon: 'seniors',
      desc: 'Rejoignez une discipline en plein développement ouverte à tous les profils.',
      offers: [{
        id: 'flag-rej-seniors-o', titre: 'Équipe Senior — Flag Football',
        punchline: 'Intégrez notre équipe Flag Football.',
        paragraphs: ["Que vous soyez débutant ou sportif confirmé, le Flag Football offre une pratique accessible, dynamique et stratégique où chacun peut trouver sa place."],
        sections: [sec('Ce que nous proposons', 'Entraînements réguliers', 'Encadrement structuré', 'Développement technique et tactique', 'Participation aux compétitions', 'Ambiance conviviale et ambitieuse')],
        tag: 'Licence annuelle Senior',
      }],
    },
  ],
};

// ─────────────────────────────────────────────────────────────
// INVESTISSEMENT — fiches missions détaillées
// ─────────────────────────────────────────────────────────────
const ORGANISER: Offer = {
  id: 'org-events', titre: "Équipe Organisation & Événements",
  punchline: 'Créez les moments forts qui font vivre le club.',
  paragraphs: [
    "Derrière chaque match, chaque tournoi et chaque événement se trouve une équipe qui prépare, coordonne et fait vivre ces moments de partage.",
    "En rejoignant l'équipe Organisation & Événements, vous contribuez directement à l'expérience vécue par les joueurs, les familles, les partenaires et les supporters.",
  ],
  sections: [
    sec('Vos missions', "Participer à l'organisation des matchs et rencontres", 'Contribuer à la préparation des tournois et événements', "Participer à l'accueil des participants et visiteurs", 'Aider à la coordination des équipes bénévoles', "Proposer des idées pour améliorer l'expérience club"),
    sec('Profil recherché', 'Vous aimez organiser et coordonner', 'Vous appréciez le travail en équipe', 'Vous êtes dynamique et volontaire', "Aucune expérience n'est nécessaire"),
    sec('Ce que vous y gagnerez', "Une expérience concrète dans l'organisation d'événements sportifs", 'Une immersion au cœur de la vie du club', 'De nouvelles rencontres et une aventure collective'),
  ],
  quote: 'Chaque grand événement commence par une équipe engagée en coulisses.',
  tag: 'Bénévolat',
};

const MATERIEL: Offer = {
  id: 'materiel-logistique', titre: 'Équipe Matériel & Logistique',
  punchline: 'Préparez les conditions de réussite du club.',
  paragraphs: [
    "Chaque entraînement, chaque match et chaque événement repose sur une organisation invisible mais indispensable : le matériel disponible, les équipements prêts et les besoins anticipés.",
    "En rejoignant l'équipe Matériel & Logistique, vous contribuez directement au bon fonctionnement du club en facilitant le travail des joueurs, des coachs et des bénévoles.",
  ],
  sections: [
    sec('Vos missions', 'Participer à la préparation et au rangement du matériel', 'Assurer le suivi des équipements du club', 'Aider à la mise en place des besoins logistiques', "Préparer les journées d'entraînement et de match"),
    sec('Profil recherché', "Sens pratique et esprit d'équipe", 'Organisation et fiabilité', "Envie d'aider concrètement"),
    sec('Ce que vous y gagnerez', 'Une immersion dans les coulisses du club', 'Une place essentielle dans la réussite collective', 'Une équipe de bénévoles engagés'),
  ],
  quote: 'Chaque réussite sportive commence par une bonne préparation.',
  tag: 'Bénévolat',
};

const ACCUEILLIR: Offer = {
  id: 'accueillir-o', titre: 'Équipe Accueil & Hospitalités',
  punchline: 'Offrez la meilleure expérience possible à tous les visiteurs du club.',
  paragraphs: ["Accueillez le public, les partenaires et les invités, et faites des jours de match un moment chaleureux pour tous."],
  sections: [sec('Vos missions', 'Accueil public', 'Accueil partenaires', 'Hospitalités')],
  tag: 'Bénévolat',
};

const ACCOMPAGNER: Offer = {
  id: 'accompagner-o', titre: 'Accompagnement & Sécurité',
  punchline: 'Veiller au bien-être et à la sécurité de chacun.',
  sections: [sec('Vos missions', 'Premiers secours', 'Assistance', 'Accompagnement des licenciés')],
  tag: 'Bénévolat',
};

const COACH: Offer = {
  id: 'coach', titre: 'Coach',
  punchline: 'Transmettez votre passion et accompagnez la progression des joueurs.',
  paragraphs: [
    "Le coach est au cœur du développement sportif du club. Il accompagne les joueurs dans leur progression, transmet les fondamentaux du jeu et participe à la construction d'un collectif performant et soudé.",
    "Une expérience dans la discipline est un atout, mais ce n'est pas un prérequis : nous accompagnons chaque coach grâce à notre parcours de formation interne.",
  ],
  sections: [
    sec('Vos missions', "Préparer et animer les séances d'entraînement", 'Transmettre les fondamentaux techniques et tactiques', 'Accompagner la progression individuelle des joueurs', 'Participer à la construction du projet sportif', 'Collaborer avec les autres membres du staff'),
    sec('Profil recherché', 'Passion pour le sport et la transmission', 'Capacité à accompagner un groupe', "Esprit collectif et envie d'apprendre"),
    sec('Ce que nous proposons', 'Un accompagnement et une formation progressive', "L'intégration dans un staff structuré", 'Une expérience enrichissante dans l'+"'encadrement sportif"),
  ],
  quote: 'Un bon coach ne transmet pas seulement une technique, il fait grandir des personnes.',
  tag: 'Bénévolat',
};

const ASSISTANT_COACH: Offer = {
  id: 'assistant-coach', titre: 'Assistant Coach',
  punchline: 'Aidez le staff à préparer, analyser et faire progresser l'+"'équipe.",
  paragraphs: [
    "L'assistant coach joue un rôle essentiel dans les coulisses de la performance sportive. En soutien du coaching staff, vous contribuez à l'organisation des entraînements, au suivi des joueurs et à l'analyse du travail réalisé sur le terrain.",
    'Une première expérience sportive est appréciée, mais votre motivation et votre capacité à apprendre sont les critères principaux.',
  ],
  sections: [
    sec('Vos missions', 'Filmer les entraînements et les rencontres', "Participer à l'analyse vidéo", 'Aider à la préparation des séances', 'Participer au suivi des joueurs'),
    sec('Profil recherché', "Intérêt pour l'analyse sportive", "Sens de l'observation", 'Rigueur et organisation'),
  ],
  quote: 'Derrière chaque équipe performante, il y a un staff qui prépare, analyse et accompagne.',
  tag: 'Bénévolat',
};

const PREPA_PHYSIQUE: Offer = {
  id: 'prepa-physique', titre: 'Préparateur Physique',
  punchline: 'Développez le potentiel des athlètes et accompagnez leur progression.',
  paragraphs: [
    "La performance sportive ne se construit pas uniquement sur le terrain. Elle repose aussi sur la préparation physique, la prévention des blessures et le développement des qualités athlétiques.",
    "En rejoignant le staff, vous contribuez à accompagner les athlètes dans leur progression physique au sein d'un cadre structuré et ambitieux.",
  ],
  sections: [
    sec('Vos missions', 'Participer à la conception des programmes de préparation physique', 'Travailler sur la force, la vitesse, '+"l'explosivité et l'endurance", 'Participer aux échauffements et routines', 'Contribuer à la prévention des blessures'),
    sec('Profil recherché', 'Formation ou expérience en préparation physique appréciée', 'Intérêt pour la performance sportive', 'Connaissance du développement athlétique'),
  ],
  quote: "Faire progresser un athlète, c'est construire les capacités qui lui permettront de repousser ses limites.",
  tag: 'Bénévolat',
};

const ARBITRE: Offer = {
  id: 'arbitre', titre: 'Arbitre',
  punchline: 'Devenez un acteur essentiel du jeu et faites vivre la discipline.',
  paragraphs: [
    "Sans arbitre, il n'y a pas de rencontre. L'arbitrage joue un rôle central dans le développement du football américain et du flag football en garantissant le respect des règles, la sécurité des joueurs et la qualité des matchs.",
    'Passionné de sport, ancien joueur ou simplement curieux : nous vous accompagnons dans votre formation pour progresser dans ce rôle.',
  ],
  sections: [
    sec('Vos missions', "Participer à l'apprentissage et à l'application des règles", 'Arbitrer les rencontres du club et les événements', 'Garantir le bon déroulement des matchs', "Assurer la sécurité et l'équité du jeu"),
    sec('Profil recherché', "Intérêt pour le sport et le jeu collectif", "Sens de l'équité et de la responsabilité", 'Capacité à prendre des décisions'),
    sec('Ce que nous proposons', "Un accompagnement et une formation à l'arbitrage", "Une montée en compétence progressive", 'Des primes de match selon les missions réalisées'),
  ],
  quote: "L'arbitre ne regarde pas le jeu. Il permet au jeu d'exister.",
  tag: 'Indemnités de match',
};

const GRAPHISTE: Offer = {
  id: 'graphiste', titre: 'Graphiste',
  punchline: 'Donnez une identité visuelle forte à notre projet.',
  paragraphs: ["Un club se construit aussi par son image. Nous recherchons un profil créatif capable de traduire notre identité, nos valeurs et nos ambitions à travers des supports visuels impactants."],
  sections: [
    sec('Vos missions', 'Créer des supports de communication', 'Concevoir des visuels pour les réseaux sociaux et événements', "Participer à l'évolution de l'identité graphique du club"),
    sec('Profil recherché', 'Maîtrise des outils de création graphique', "Sensibilité à l'identité visuelle et au branding", 'Portfolio ou réalisations appréciées'),
  ],
  tag: 'Bénévolat',
};

const PHOTOGRAPHE: Offer = {
  id: 'photographe', titre: 'Photographe',
  punchline: 'Capturez les moments qui racontent notre aventure.',
  paragraphs: ["Chaque match, chaque victoire et chaque moment collectif construit l'histoire du club. Nous recherchons un photographe capable de mettre en valeur l'énergie, les émotions et les coulisses de notre projet."],
  sections: [
    sec('Vos missions', 'Réaliser des prises de vue lors des matchs et événements', 'Capturer la vie du club et ses moments forts', 'Créer une banque d'+"'images exploitable", 'Mettre en valeur les joueurs, équipes et partenaires'),
    sec('Profil recherché', 'Maîtrise des techniques de photographie', "Sens du cadrage et de la narration visuelle", 'Expérience ou portfolio apprécié'),
  ],
  tag: 'Bénévolat',
};

const CM: Offer = {
  id: 'cm', titre: 'Community Manager',
  punchline: 'Faites grandir notre communauté et développez notre présence digitale.',
  paragraphs: ["Les réseaux sociaux sont une vitrine essentielle pour faire connaître le club, attirer de nouveaux pratiquants et valoriser notre aventure. Nous recherchons un profil capable de construire une présence digitale cohérente et engageante."],
  sections: [
    sec('Vos missions', 'Définir et animer la ligne éditoriale', 'Planifier et publier les contenus', "Développer l'engagement de la communauté", 'Valoriser les matchs, événements et actualités'),
    sec('Profil recherché', 'Expérience en gestion de réseaux sociaux', 'Maîtrise des codes des plateformes', 'Sens de la communication et de la narration'),
  ],
  tag: 'Bénévolat',
};

const VIDEASTE: Offer = {
  id: 'videaste', titre: 'Vidéaste / Monteur',
  punchline: "Faites vivre l'intensité du club à travers la vidéo.",
  paragraphs: ["Le sport se vit aussi par l'image. Nous recherchons un profil capable de transformer nos moments forts en contenus engageants pour notre communauté."],
  sections: [
    sec('Vos missions', 'Filmer les matchs, entraînements et événements', 'Réaliser des vidéos immersives', 'Monter des contenus pour les réseaux sociaux', 'Participer au développement de notre identité vidéo'),
    sec('Profil recherché', 'Maîtrise de la captation vidéo et du montage', 'Sens du rythme et de la narration', 'Portfolio ou réalisations appréciées'),
  ],
  tag: 'Bénévolat',
};

const WEB: Offer = {
  id: 'web', titre: 'Référent Digital & Web',
  punchline: 'Faites évoluer la vitrine numérique du club.',
  paragraphs: ["Le site internet est souvent le premier contact avec notre projet. Nous recherchons un profil capable de faire vivre, améliorer et optimiser notre présence en ligne afin d'accompagner le développement du club."],
  sections: [
    sec('Vos missions', 'Mettre à jour et faire évoluer le site internet', 'Intégrer les actualités, événements et contenus', "Optimiser les parcours de découverte et d'inscription"),
    sec('Profil recherché', 'Expérience en gestion de site web ou développement', 'Sensibilité à '+"l'expérience utilisateur", 'Autonomie et force de proposition'),
  ],
  tag: 'Bénévolat',
};

const MERCH: Offer = {
  id: 'merch', titre: 'Responsable Merchandising & Identité de Marque',
  punchline: "Construisez l'univers du club au-delà du terrain.",
  paragraphs: ["Un club ne se reconnaît pas uniquement par ses performances, mais aussi par son identité, ses couleurs et ses symboles. Nous recherchons un profil capable de développer et structurer l'univers merchandising du club."],
  sections: [
    sec('Vos missions', "Définir une vision merchandising cohérente", 'Développer les gammes textiles et produits du club', 'Participer à la création des collections joueurs et supporters'),
    sec('Profil recherché', 'Expérience en merchandising, textile ou marketing', "Sensibilité forte à l'identité visuelle", 'Esprit créatif et stratégique'),
  ],
  tag: 'Bénévolat',
};

const GESTION: Offer = {
  id: 'gestion', titre: 'Équipe Gestion & Administration',
  punchline: 'Structurez le fonctionnement du club pour accompagner son développement.',
  paragraphs: ["Derrière un projet sportif ambitieux se trouve une organisation solide. Nous recherchons des profils capables d'apporter leur rigueur et leurs compétences pour accompagner la structuration de l'association."],
  sections: [
    sec('Vos missions', 'Participer au suivi administratif du club', 'Aider à structurer les procédures et outils internes', 'Soutenir les équipes dirigeantes dans leurs missions'),
    sec('Profil recherché', 'Expérience en gestion, administration ou organisation', 'Sens de la rigueur et de la méthode', "Autonomie et esprit d'équipe"),
  ],
  tag: 'Bénévolat',
};

const PARTENARIATS_PRIVES: Offer = {
  id: 'partenariats-prives', titre: 'Équipe Partenariats Privés',
  punchline: 'Créez les relations qui permettent au projet de grandir.',
  paragraphs: ["Un club grandit aussi grâce aux entreprises qui choisissent de s'engager à ses côtés. Vous contribuez à développer les relations avec les entreprises et à construire des collaborations durables."],
  sections: [
    sec('Vos missions', 'Identifier et contacter de nouvelles entreprises partenaires', 'Créer et entretenir une relation de confiance', 'Contribuer à la mise en valeur des partenaires'),
    sec('Profil recherché', 'Vous aimez le contact humain', "Vous avez un esprit commercial ou entrepreneurial", 'Vous souhaitez représenter un projet ambitieux'),
  ],
  quote: 'Chaque partenariat commence par une rencontre.',
  tag: 'Bénévolat',
};

const TERRITOIRE: Offer = {
  id: 'territoire', titre: 'Équipe Territoire & Éducation',
  punchline: "Faites grandir l'impact du club au-delà du terrain.",
  paragraphs: ["Un club sportif est aussi un acteur de son territoire. Vous participez à construire des relations avec les collectivités, les écoles et les structures locales pour développer de nouveaux projets autour du sport."],
  sections: [
    sec('Vos missions', 'Développer les relations avec les collectivités locales', 'Créer des liens avec les écoles et établissements', "Représenter le club auprès de structures partenaires"),
    sec('Profil recherché', 'Sens du relationnel', 'Intérêt pour les projets associatifs et sportifs', 'Capacité à créer des connexions'),
  ],
  quote: "Un club ne vit pas seulement dans ses infrastructures, il vit dans son territoire.",
  tag: 'Bénévolat',
};

const PILOTAGE_FIN: Offer = {
  id: 'pilotage-financier', titre: 'Équipe Pilotage Financier',
  punchline: 'Donnez au club les moyens de construire son ambition.',
  paragraphs: ["Un projet sportif en développement a besoin d'une vision claire de ses ressources. Vous contribuez à structurer le suivi économique du club et à accompagner les décisions stratégiques."],
  sections: [
    sec('Vos missions', 'Participer à la construction et au suivi des budgets', 'Mettre en place des outils de pilotage financier', "Participer à l'analyse économique des projets"),
    sec('Profil recherché', 'Expérience en gestion financière ou comptabilité', "À l'aise avec les chiffres et l'analyse", "Rigueur et sens de l'anticipation"),
  ],
  quote: 'Les ambitions se construisent avec une vision claire des moyens nécessaires pour les atteindre.',
  tag: 'Bénévolat',
};

const SANTE_PARTENAIRE: Offer = {
  id: 'sante-partenaire', titre: 'Partenaire Santé & Performance',
  punchline: 'Accompagnez les athlètes dans leur pratique et leur progression.',
  paragraphs: ["La performance sportive se construit aussi autour de la prévention et du suivi des athlètes. Nous souhaitons créer un réseau de professionnels de santé partenaires."],
  sections: [
    sec('Profils recherchés', 'Kinésithérapeutes', 'Ostéopathes', 'Nutritionnistes', 'Médecins du sport', "Professionnels de l'accompagnement des sportifs"),
    sec('Vos missions possibles', 'Accompagner les athlètes dans la prévention et la récupération', 'Apporter votre expertise sur la pratique sportive', 'Construire une relation durable avec le club'),
  ],
  quote: 'La performance commence par des athlètes bien accompagnés.',
  tag: 'Partenariat professionnel',
};

const SANTE_SECOURS: Offer = {
  id: 'sante-secours', titre: 'Équipe Secours & Accompagnement Athlètes',
  punchline: 'Contribuez à la sécurité et au bien-être des pratiquants.',
  paragraphs: ["Dans un sport engagé comme le football américain, la sécurité des joueurs est une priorité. Nous recherchons des personnes souhaitant contribuer à l'accompagnement des athlètes lors des entraînements, matchs et événements."],
  sections: [
    sec('Profils recherchés', 'Titulaires du PSC1 ou formations premiers secours', 'Infirmiers', 'Secouristes', 'Passionnés de la prévention santé'),
    sec('Profil recherché', 'Sens des responsabilités', 'Calme et réactivité', "Esprit d'équipe"),
  ],
  quote: "Protéger les joueurs, c'est aussi participer à leur progression.",
  tag: 'Bénévolat',
};

// fiche générique simple (branches listées sans détail dans le PDF)
const simple = (id: string, titre: string, punchline: string, tag = 'Bénévolat'): Offer => ({ id, titre, punchline, tag });

// ─────────────────────────────────────────────────────────────
// SOUTIEN
// ─────────────────────────────────────────────────────────────
const DON: Offer = {
  id: 'don-o', titre: 'Faire un don au club',
  punchline: 'Soutenez directement le développement de notre projet.',
  paragraphs: [
    "Chaque contribution permet au club de continuer à grandir, développer ses équipes, améliorer ses conditions de pratique et construire un projet sportif durable.",
    'Votre soutien participe concrètement à donner les moyens nécessaires à nos ambitions.',
  ],
  sections: [
    sec('Votre contribution peut permettre de', 'Développer nos actions sportives', 'Accompagner nos pratiquants', 'Améliorer nos équipements', "Soutenir la formation et l'encadrement"),
    sec('Comment soutenir', 'Don ponctuel', 'Soutien régulier', 'Participation à une action spécifique'),
  ],
  quote: 'Derrière chaque projet ambitieux, il y a une communauté qui choisit de soutenir son développement.',
  tag: 'Soutien au projet',
};

const PARTENAIRE: Offer = {
  id: 'partenaire-o', titre: 'Devenir partenaire du club',
  punchline: 'Associez votre image à une aventure sportive et humaine.',
  paragraphs: ["Le partenariat permet aux entreprises de rejoindre un projet en développement, de soutenir une dynamique locale et de construire une relation gagnant-gagnant avec notre communauté."],
  sections: [
    sec("Devenir partenaire, c'est pouvoir", 'Valoriser votre image auprès de notre communauté', 'Soutenir un projet sportif local', 'Développer votre visibilité autour du club', 'Créer des relations durables'),
  ],
  quote: 'Un partenariat réussi crée de la valeur pour les deux parties.',
  tag: 'Partenariat',
};

const RESSOURCES: Offer = {
  id: 'ressources-o', titre: 'Apporter des ressources au club',
  punchline: "Aidez le projet autrement qu'avec du temps ou de l'argent.",
  paragraphs: ["Un club grandit grâce aux personnes et aux ressources qui l'entourent. Votre contribution peut prendre de nombreuses formes et répondre à des besoins concrets."],
  sections: [
    sec('Vous pouvez nous accompagner avec', 'Du matériel', 'Des équipements', 'Des services', 'Des compétences'),
    sec('Votre aide peut permettre de', 'Améliorer les conditions de pratique', "Faciliter l'organisation du club", 'Accélérer certains projets'),
  ],
  quote: "Parfois, la meilleure façon d'aider est simplement d'apporter ce dont le projet a besoin.",
  tag: 'Soutien au projet',
};

const AMBASSADEUR: Offer = {
  id: 'ambassadeur-o', titre: 'Devenir ambassadeur du club',
  punchline: 'Faites connaître le projet autour de vous.',
  paragraphs: ["Un club se développe aussi grâce aux personnes qui parlent de lui, partagent son histoire et créent des connexions. En devenant ambassadeur, vous participez au rayonnement du club auprès de votre réseau."],
  sections: [
    sec('Vos missions', 'Parler du projet autour de vous', 'Partager nos actualités et événements', 'Mettre en relation le club avec des personnes intéressées', 'Représenter les valeurs du club'),
    sec('Profil recherché', "Fierté d'appartenir au projet", "Envie de partager une aventure collective", 'Goût du contact et du réseau'),
  ],
  quote: "Chaque grande communauté commence par des personnes qui choisissent de raconter son histoire.",
  tag: 'Ambassadeur',
};

// ─────────────────────────────────────────────────────────────
// ARBRE COMPLET
// ─────────────────────────────────────────────────────────────
export const TUNNEL: Node = {
  id: 'root', label: 'Parcours', icon: 'jouer',
  question: 'Quelle aventure vous attire ?',
  children: [
    {
      id: 'jouer', label: 'Je veux jouer', icon: 'jouer',
      desc: "Découvrez la discipline qui vous correspond et rejoignez l'aventure sur le terrain.",
      question: 'Quelle pratique vous attire ?',
      children: [
        {
          id: 'foot-us', label: 'Football Américain', icon: 'foot-us',
          desc: "Un sport de contact intense où stratégie, engagement et esprit d'équipe ne font qu'un.",
          question: 'Que souhaitez-vous faire ?',
          children: [FA_DECOUVRIR, FA_REJOINDRE],
        },
        {
          id: 'flag', label: 'Flag Football', icon: 'flag',
          desc: 'Une pratique sans contact, rapide et spectaculaire. Sport olympique aux JO de Los Angeles 2028, ouverte à tous les profils.',
          question: 'Que souhaitez-vous faire ?',
          children: [FLAG_DECOUVRIR, FLAG_REJOINDRE],
        },
      ],
    },
    {
      id: 'investir', label: "Je veux m'investir dans le club", icon: 'investir',
      desc: 'Mettez votre temps, votre énergie ou vos compétences au service du collectif.',
      question: "Qu'avez-vous envie d'apporter ?",
      children: [
        {
          id: 'temps', label: "Du temps et de l'énergie", icon: 'temps',
          desc: "J'aime être présent et donner un coup de main.",
          question: 'Comment souhaitez-vous aider ?',
          children: [
            { id: 'organiser', label: 'Organiser', icon: 'organiser', desc: 'Créer les événements qui rassemblent joueurs, familles et supporters.', offers: [ORGANISER] },
            { id: 'materiel', label: 'Aider sur le terrain', icon: 'materiel', desc: 'Faire en sorte que tout fonctionne avant, pendant et après les rencontres.', offers: [MATERIEL] },
          ],
        },
        {
          id: 'experience', label: 'Mon expérience sportive', icon: 'experience',
          desc: "J'aime transmettre, encadrer et faire progresser.",
          question: 'Dans quel domaine ?',
          children: [
            { id: 'coaching', label: 'Coaching', icon: 'coaching', desc: 'Transmettre votre passion et faire progresser les pratiquants.', offers: [COACH, ASSISTANT_COACH, PREPA_PHYSIQUE] },
            { id: 'arbitrage', label: 'Arbitrage', icon: 'arbitrage', desc: "Garantir l'équité du jeu et contribuer au développement de la discipline.", offers: [ARBITRE] },
          ],
        },
        {
          id: 'competences', label: 'Mes compétences professionnelles', icon: 'competences',
          desc: 'Je peux mettre mon expertise au service du club.',
          question: 'Quelle expertise souhaitez-vous apporter ?',
          children: [
            { id: 'com-creation', label: 'Communication & Création', icon: 'com', desc: 'Faire rayonner le club auprès du public et des futurs licenciés.', offers: [GRAPHISTE, PHOTOGRAPHE, CM, VIDEASTE, WEB, MERCH] },
            { id: 'gestion', label: 'Gestion & Administration', icon: 'gestion', desc: "Structurer l'organisation et préparer l'avenir du club.", offers: [GESTION] },
            { id: 'finance', label: 'Réseau, Commerce & Financement', icon: 'finance', desc: 'Trouver les ressources qui permettront au projet de grandir.', offers: [PARTENARIATS_PRIVES, TERRITOIRE, PILOTAGE_FIN] },
            { id: 'sante', label: 'Santé & bien-être', icon: 'sante', desc: "Contribuez à la sécurité et à l'accompagnement des pratiquants.", offers: [SANTE_PARTENAIRE, SANTE_SECOURS] },
          ],
        },
      ],
    },
    {
      id: 'soutenir', label: 'Je veux soutenir le projet', icon: 'soutenir',
      desc: 'Contribuez au développement du club et à son impact sur le territoire.',
      question: 'Comment souhaitez-vous soutenir le projet ?',
      children: [
        { id: 'don', label: 'Faire un don', icon: 'don', desc: 'Contribuer directement au développement des activités du club.', offers: [DON] },
        { id: 'partenaire', label: 'Devenir partenaire', icon: 'partenaire', desc: 'Associer votre image à un projet sportif et humain ambitieux.', offers: [PARTENAIRE] },
        { id: 'ressources', label: 'Apporter des ressources', icon: 'ressources', desc: 'Mettre à disposition du matériel, des services ou des compétences.', offers: [RESSOURCES] },
        { id: 'ambassadeur', label: 'Devenir ambassadeur', icon: 'ambassadeur', desc: 'Faire connaître le club et ouvrir votre réseau.', offers: [AMBASSADEUR] },
      ],
    },
  ],
};
