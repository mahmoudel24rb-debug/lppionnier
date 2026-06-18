/**
 * Parcours d'orientation et de recrutement — Pionniers de Touraine.
 * Modélisé d'après TUNNELv1.pdf.
 *
 * Principe : l'utilisateur exprime d'abord sa MOTIVATION (arbre de choix),
 * puis découvre les OFFRES/MISSIONS filtrées selon son parcours.
 *
 * Arbre récursif : un nœud branchant a `question` + `children` ; un nœud
 * terminal a `offers`. Les `icon` sont des clés mappées dans funnelIcons.ts.
 */

export type IconName =
  | 'Jouer' | 'Investir' | 'Soutenir'
  | 'FootUS' | 'Flag'
  | 'Decouvrir' | 'Loisir' | 'Competition' | 'Jeune' | 'Senior'
  | 'Temps' | 'Experience' | 'Competences' | 'Reseau'
  | 'Organiser' | 'AiderTerrain' | 'Accueillir' | 'Accompagner'
  | 'Coaching' | 'Arbitrage' | 'Encadrement' | 'DevSportif'
  | 'Com' | 'Numerique' | 'Gestion' | 'Finance' | 'Juridique' | 'Creation' | 'Formation'
  | 'Partenariats' | 'DevClub' | 'Ecoles' | 'Projets' | 'Innover'
  | 'Don' | 'Partenaire' | 'Ressources' | 'Ambassadeur';

export type Offer = { titre: string; tags: string[] };

export type Node = {
  id: string;
  label: string;
  desc?: string;
  icon: IconName;
  /** Prompt affiché quand on présente les enfants de ce nœud. */
  question?: string;
  children?: Node[];
  /** Nœud terminal : offres/missions à afficher. */
  offers?: Offer[];
};

// ─── Offres réutilisables ───
const off = (titre: string, ...tags: string[]): Offer => ({ titre, tags });

// Objectifs joueur (partagés entre Foot US et Flag)
const objectifs = (discipline: string): Node[] => [
  { id: `obj-decouvrir-${discipline}`, label: 'Découvrir la discipline', icon: 'Decouvrir',
    offers: [off(`Séance découverte ${discipline}`, 'Essai gratuit', 'Sans engagement'), off('Journée portes ouvertes', 'Découverte')] },
  { id: `obj-loisir-${discipline}`, label: 'Pratiquer en loisir', icon: 'Loisir',
    offers: [off(`${discipline} loisir`, 'Licence', 'Convivial'), off('Entraînements hebdo', 'Loisir')] },
  { id: `obj-competition-${discipline}`, label: 'Progresser en compétition', icon: 'Competition',
    offers: [off(`Équipe compétition ${discipline}`, 'Championnat', 'Licence'), off('Préparation PPP', 'Performance')] },
  { id: `obj-jeune-${discipline}`, label: 'Rejoindre une équipe jeune', icon: 'Jeune',
    offers: [off('Section Jeunes (U16/U19)', 'Licence', 'Encadrement'), off('École de sport', 'Initiation')] },
  { id: `obj-senior-${discipline}`, label: 'Rejoindre une équipe senior', icon: 'Senior',
    offers: [off(`Équipe Senior ${discipline}`, 'Championnat', 'Licence'), off('Section féminine', 'Compétition')] },
];

const missions = (...o: Offer[]): Offer[] => o;

export const TUNNEL: Node = {
  id: 'root',
  label: 'Parcours',
  icon: 'Jouer',
  question: 'Quelle aventure vous attire ?',
  children: [
    // ───────────────────────── JOUEUR ─────────────────────────
    {
      id: 'jouer', label: 'Je veux jouer', icon: 'Jouer',
      desc: 'Découvrez la discipline qui vous correspond et rejoignez l’aventure sur le terrain.',
      question: 'Quelle pratique vous attire ?',
      children: [
        {
          id: 'foot-us', label: 'Football Américain', icon: 'FootUS',
          desc: 'Une discipline intense où stratégie, engagement et esprit d’équipe ne font qu’un.',
          question: 'Quel est votre objectif ?',
          children: objectifs('Foot US'),
        },
        {
          id: 'flag', label: 'Flag Football', icon: 'Flag',
          desc: 'Une pratique rapide, accessible et spectaculaire, ouverte à tous les profils.',
          question: 'Quel est votre objectif ?',
          children: objectifs('Flag'),
        },
      ],
    },

    // ─────────────────────── INVESTISSEMENT ───────────────────────
    {
      id: 'investir', label: 'Je veux m’investir dans le club', icon: 'Investir',
      desc: 'Mettez votre temps, votre énergie ou vos compétences au service du collectif.',
      question: 'Qu’avez-vous envie d’apporter ?',
      children: [
        {
          id: 'temps', label: 'Du temps et de l’énergie', icon: 'Temps',
          desc: 'J’aime être présent et donner un coup de main.',
          question: 'Comment souhaitez-vous aider ?',
          children: [
            { id: 'organiser', label: 'Organiser', icon: 'Organiser', desc: 'Créer les événements qui rassemblent joueurs, familles et supporters.',
              offers: missions(off('Organisation des matchs', 'Bénévolat'), off('Tournois', 'Bénévolat'), off('Événementiel', 'Bénévolat'), off('Déplacements', 'Bénévolat')) },
            { id: 'aider-terrain', label: 'Aider sur le terrain', icon: 'AiderTerrain', desc: 'Faire en sorte que tout fonctionne avant, pendant et après les rencontres.',
              offers: missions(off('Matériel', 'Bénévolat'), off('Logistique', 'Bénévolat'), off('Installation', 'Bénévolat'), off('Intendance', 'Bénévolat')) },
            { id: 'accueillir', label: 'Accueillir', icon: 'Accueillir', desc: 'Offrir la meilleure expérience possible à tous les visiteurs du club.',
              offers: missions(off('Accueil public', 'Bénévolat'), off('Accueil partenaires', 'Bénévolat'), off('Hospitalités', 'Bénévolat')) },
            { id: 'accompagner', label: 'Accompagner', icon: 'Accompagner', desc: 'Veiller au bien-être et à la sécurité de chacun.',
              offers: missions(off('Premiers secours', 'Formation', 'Bénévolat'), off('Assistance', 'Bénévolat'), off('Accompagnement des licenciés', 'Bénévolat')) },
          ],
        },
        {
          id: 'experience', label: 'Mon expérience sportive', icon: 'Experience',
          desc: 'J’aime transmettre, encadrer et faire progresser.',
          question: 'Dans quel domaine ?',
          children: [
            { id: 'coaching', label: 'Coaching', icon: 'Coaching', desc: 'Transmettre votre passion et faire progresser les pratiquants.',
              offers: missions(off('Coach Flag Football', 'Bénévolat', 'Formation', 'CDD'), off('Coach assistant Senior', 'Bénévolat', 'Formation')) },
            { id: 'arbitrage', label: 'Arbitrage', icon: 'Arbitrage', desc: 'Garantir l’équité du jeu et contribuer au développement de la discipline.',
              offers: missions(off('Arbitre Débutant', 'Formation', 'Bénévolat'), off('Officiel de table', 'Bénévolat')) },
            { id: 'encadrement', label: 'Encadrement d’équipe', icon: 'Encadrement', desc: 'Accompagner les joueurs et assurer le bon fonctionnement du collectif.',
              offers: missions(off('Manager d’équipe', 'Bénévolat'), off('Préparateur physique', 'Bénévolat', 'Stage')) },
            { id: 'dev-sportif', label: 'Développement sportif', icon: 'DevSportif', desc: 'Participer à la structuration et à la performance sportive du club.',
              offers: missions(off('Responsable performance (PPP)', 'Bénévolat', 'Freelance'), off('Analyste vidéo', 'Bénévolat', 'Stage')) },
          ],
        },
        {
          id: 'competences', label: 'Mes compétences professionnelles', icon: 'Competences',
          desc: 'Je peux mettre mon expertise au service du club.',
          question: 'Quelle expertise souhaitez-vous apporter ?',
          children: [
            { id: 'com', label: 'Communication & Marketing', icon: 'Com', desc: 'Faire rayonner le club auprès du public et des futurs licenciés.',
              offers: missions(off('Community Manager', 'Bénévolat', 'Stage', 'Alternance'), off('Chargé de communication', 'Bénévolat', 'Alternance')) },
            { id: 'numerique', label: 'Numérique & Technologie', icon: 'Numerique', desc: 'Développer les outils qui facilitent la gestion et la croissance du club.',
              offers: missions(off('Développeur Web', 'Bénévolat', 'Stage', 'Alternance', 'Freelance'), off('Data / outils', 'Bénévolat', 'Freelance')) },
            { id: 'gestion', label: 'Gestion & Administration', icon: 'Gestion', desc: 'Structurer l’organisation et préparer l’avenir du club.',
              offers: missions(off('Secrétaire général', 'Bénévolat'), off('Responsable administratif', 'Bénévolat')) },
            { id: 'finance', label: 'Finance & Financement', icon: 'Finance', desc: 'Trouver les ressources qui permettront au projet de grandir.',
              offers: missions(off('Trésorier', 'Bénévolat'), off('Chargé de subventions', 'Bénévolat', 'Freelance')) },
            { id: 'juridique', label: 'Juridique', icon: 'Juridique', desc: 'Sécuriser et accompagner le développement de l’association.',
              offers: missions(off('Conseil juridique', 'Bénévolat', 'Freelance')) },
            { id: 'creation', label: 'Création & Audiovisuel', icon: 'Creation', desc: 'Valoriser les actions du club par l’image et la création.',
              offers: missions(off('Photographe / Vidéaste', 'Bénévolat', 'Stage', 'Freelance'), off('Graphiste', 'Bénévolat', 'Freelance')) },
            { id: 'formation', label: 'Formation & Pédagogie', icon: 'Formation', desc: 'Partager vos connaissances et accompagner les bénévoles.',
              offers: missions(off('Formateur bénévoles', 'Bénévolat'), off('Tuteur jeunes', 'Bénévolat')) },
          ],
        },
        {
          id: 'reseau', label: 'Mon réseau et mes idées', icon: 'Reseau',
          desc: 'J’aime développer des projets et créer des opportunités.',
          question: 'Sur quoi voulez-vous agir ?',
          children: [
            { id: 'partenariats', label: 'Développer les partenariats', icon: 'Partenariats', desc: 'Créer des relations durables avec les acteurs du territoire.',
              offers: missions(off('Responsable Partenariats', 'Bénévolat', 'Freelance', 'CDI'), off('Chargé de mécénat', 'Bénévolat')) },
            { id: 'dev-club', label: 'Développer le club', icon: 'DevClub', desc: 'Imaginer et construire les prochaines étapes du projet.',
              offers: missions(off('Chargé de développement', 'Bénévolat', 'Freelance')) },
            { id: 'ecoles', label: 'Relations écoles & collectivités', icon: 'Ecoles', desc: 'Créer des passerelles avec les institutions locales.',
              offers: missions(off('Référent scolaire', 'Bénévolat'), off('Animateur interventions', 'Bénévolat', 'Stage')) },
            { id: 'projets', label: 'Piloter des projets', icon: 'Projets', desc: 'Transformer les idées en réalisations concrètes.',
              offers: missions(off('Chef de projet', 'Bénévolat', 'Freelance')) },
            { id: 'innover', label: 'Innover', icon: 'Innover', desc: 'Imaginer de nouvelles façons de faire grandir le club.',
              offers: missions(off('Pôle innovation', 'Bénévolat')) },
          ],
        },
      ],
    },

    // ───────────────────────── SOUTIEN ─────────────────────────
    {
      id: 'soutenir', label: 'Je veux soutenir le projet', icon: 'Soutenir',
      desc: 'Contribuez au développement du club et à son impact sur le territoire.',
      question: 'Comment souhaitez-vous soutenir le projet ?',
      children: [
        { id: 'don', label: 'Faire un don', icon: 'Don', desc: 'Contribuer directement au développement des activités du club.',
          offers: missions(off('Don ponctuel', 'Soutien', 'Déductible'), off('Don mensuel', 'Soutien')) },
        { id: 'partenaire', label: 'Devenir partenaire', icon: 'Partenaire', desc: 'Associer votre image à un projet sportif et humain ambitieux.',
          offers: missions(off('Sponsoring maillot', 'Partenariat'), off('Partenaire événement', 'Partenariat')) },
        { id: 'ressources', label: 'Apporter des ressources', icon: 'Ressources', desc: 'Mettre à disposition du matériel, des services ou des compétences.',
          offers: missions(off('Don de matériel', 'Soutien'), off('Mise à disposition', 'Soutien')) },
        { id: 'ambassadeur', label: 'Devenir ambassadeur', icon: 'Ambassadeur', desc: 'Faire connaître le club et ouvrir votre réseau.',
          offers: missions(off('Ambassadeur Pionniers', 'Bénévolat', 'Réseau')) },
      ],
    },
  ],
};
