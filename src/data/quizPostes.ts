/**
 * Quiz « Quel poste jouer au football américain ? » : données + scoring.
 *
 * Le gabarit (taille + poids saisis librement) est comparé aux profils réels par
 * poste via la table ANTHRO plus bas ; les questions n'apportent que les
 * préférences de jeu. Ordres de grandeur NFL Combine / NCAA :
 *   QB ~1m88/102kg, 40yd ~4.8s : direction de jeu, lecture
 *   RB ~1m78/97kg,  ~4.5s     : compact, explosif, porteur de balle
 *   WR ~1m83/91kg,  ~4.45s    : vitesse, mains, tracés
 *   TE ~1m93/114kg, ~4.7s     : hybride grand + costaud + mains
 *   OL ~1m93/141kg, ~5.2s     : masse, protection, technique
 *   DL ~1m90/129kg, ~4.9s     : masse explosive, pression
 *   LB ~1m85/109kg, ~4.65s    : polyvalence, plaquage, instinct
 *   DB ~1m80/93kg,  ~4.45s    : vitesse, duels, lecture des passes
 *   K  : pas de gabarit type, la frappe de balle prime (aucune entrée ANTHRO)
 * En flag (5v5, sans contact) : QB flag (précision/lecture), receveur
 * (appuis/mains), defensive back (couverture), blitzeur (course sur le QB) et le
 * profil double receveur + DB pour les joueurs complets.
 *
 * Le parcours est en deux branches : trois questions communes (âge, vitesse,
 * contact) puis trois questions propres à la discipline choisie par la réponse
 * « contact » (QUESTIONS_FOOTUS ou QUESTIONS_FLAG).
 */

export type PosteId =
  | 'qb' | 'rb' | 'wr' | 'te' | 'ol' | 'dl' | 'lb' | 'db' | 'k'
  | 'flag-qb' | 'flag-rec' | 'flag-db' | 'flag-blitz' | 'flag-double';

export type AgeGroup = 'moins16' | '16-19' | '20plus';
export type Discipline = 'foot-us' | 'flag';

/** Bornes de saisie de l'écran mensurations (garde-fou anti-faute de frappe). */
export const TAILLE_MIN = 120, TAILLE_MAX = 220, POIDS_MIN = 40, POIDS_MAX = 180;

export type Mensurations = { taille: number; poids: number };

export type Reponse = {
  id: string;
  fr: string;
  en: string;
  pts?: Partial<Record<PosteId, number>>;
};

export type Question = {
  id: string;
  fr: string;
  en: string;
  reponses: Reponse[];
};

/** Tronc commun : posé à tout le monde, la réponse « contact » choisit la branche. */
export const QUESTIONS_COMMUNES: Question[] = [
  {
    id: 'age',
    fr: 'Quel âge as-tu ?',
    en: 'How old are you?',
    reponses: [
      { id: 'moins16', fr: 'Moins de 16 ans', en: 'Under 16' },
      { id: '16-19', fr: '16 à 19 ans', en: '16 to 19' },
      { id: '20plus', fr: '20 ans et plus', en: '20 or older' },
    ],
  },
  {
    id: 'vitesse',
    fr: 'Côté vitesse ?',
    en: 'How fast are you?',
    reponses: [
      { id: 'explosif', fr: 'Explosif : je pars comme une balle', en: 'Explosive: I fly off the line', pts: { wr: 2, db: 2, rb: 2, 'flag-rec': 1, 'flag-db': 1 } },
      { id: 'moyen', fr: 'Dans la moyenne', en: 'About average', pts: { qb: 1, lb: 1, te: 1, 'flag-qb': 1 } },
      { id: 'puissant', fr: 'Plus puissant que rapide', en: 'More power than speed', pts: { ol: 2, dl: 1 } },
    ],
  },
  {
    id: 'contact',
    fr: 'Le contact physique ?',
    en: 'Physical contact?',
    reponses: [
      { id: 'adore', fr: 'J’adore : c’est ce qui m’attire', en: 'I love it: that’s the appeal', pts: { dl: 2, lb: 2, ol: 1, rb: 1 } },
      { id: 'ok', fr: 'Ça me tente, à apprendre', en: 'Curious, willing to learn', pts: { te: 1, rb: 1, lb: 1, db: 1 } },
      { id: 'evite', fr: 'Je préfère éviter les chocs', en: 'I’d rather avoid hits', pts: { 'flag-qb': 2, 'flag-rec': 2, 'flag-db': 2 } },
    ],
  },
];

/** Branche foot US : posée si le contact est « adore » ou « ok ». */
export const QUESTIONS_FOOTUS: Question[] = [
  {
    id: 'role',
    fr: 'Ton rôle rêvé sur un terrain ?',
    en: 'Your dream role on the field?',
    reponses: [
      { id: 'diriger', fr: 'Diriger le jeu et lancer', en: 'Run the offense and throw', pts: { qb: 4 } },
      { id: 'attraper', fr: 'Attraper des passes', en: 'Catch passes', pts: { wr: 4, te: 2 } },
      { id: 'courir', fr: 'Courir avec le ballon', en: 'Run with the ball', pts: { rb: 4 } },
      { id: 'defendre', fr: 'Défendre et plaquer', en: 'Defend and tackle', pts: { lb: 3, db: 3, dl: 2 } },
      { id: 'proteger', fr: 'Protéger mes coéquipiers', en: 'Protect my teammates', pts: { ol: 4, dl: 1 } },
      { id: 'frapper', fr: 'Frapper le ballon au pied', en: 'Kick the ball', pts: { k: 10 } },
    ],
  },
  {
    id: 'mental',
    fr: 'Plutôt stratège ou instinctif ?',
    en: 'Strategist or instinctive?',
    reponses: [
      { id: 'stratege', fr: 'Stratège : je lis, j’anticipe', en: 'Strategist: I read and anticipate', pts: { qb: 2, ol: 1, db: 1 } },
      { id: 'instinctif', fr: 'Instinctif : je sens le jeu', en: 'Instinctive: I feel the game', pts: { rb: 1, dl: 1, lb: 1, wr: 1 } },
    ],
  },
  {
    id: 'effort',
    fr: 'Ton moteur ?',
    en: 'Your engine?',
    reponses: [
      { id: 'endurant', fr: 'Endurant : je répète les efforts', en: 'Endurance: I repeat efforts all day', pts: { wr: 1, db: 1, lb: 1 } },
      { id: 'sprinteur', fr: 'Tout dans l’explosion, puis je souffle', en: 'All-out bursts, then recover', pts: { ol: 1, dl: 1, rb: 1 } },
    ],
  },
];

/** Branche flag : posée si le contact est « evite ». */
export const QUESTIONS_FLAG: Question[] = [
  {
    id: 'kiff',
    fr: 'Sur un terrain, ton kiff c’est ?',
    en: 'On the field, what’s your thing?',
    reponses: [
      { id: 'attraper', fr: 'Attraper des passes', en: 'Catching passes', pts: { 'flag-rec': 4 } },
      { id: 'lancer', fr: 'Lancer des passes', en: 'Throwing passes', pts: { 'flag-qb': 4 } },
      { id: 'courir-ballon', fr: 'Courir ballon en main', en: 'Running with the ball', pts: { 'flag-rec': 3 } },
      { id: 'pression', fr: 'Mettre la pression sur le QB', en: 'Rushing the QB', pts: { 'flag-blitz': 4 } },
      { id: 'defendre', fr: 'Défendre les passes', en: 'Defending passes', pts: { 'flag-db': 4 } },
      // Le profil complet : traité à part dans computeResult (poste flag-double).
      { id: 'les-deux', fr: 'Attraper ET défendre', en: 'Catching AND defending', pts: {} },
    ],
  },
  {
    id: 'courir',
    fr: 'Courir, tu aimes ?',
    en: 'How do you feel about running?',
    reponses: [
      { id: 'adore', fr: 'J’adore courir partout', en: 'I love running everywhere', pts: { 'flag-blitz': 2, 'flag-db': 1, 'flag-rec': 1 } },
      { id: 'ca-va', fr: 'Ça va, sans plus', en: 'It’s fine', pts: {} },
      { id: 'le-moins', fr: 'Le moins possible', en: 'As little as possible', pts: { 'flag-qb': 2 } },
    ],
  },
  {
    id: 'ballon',
    fr: 'À l’aise ballon en main ?',
    en: 'Comfortable with the ball in your hands?',
    reponses: [
      { id: 'tres', fr: 'Très à l’aise', en: 'Very comfortable', pts: { 'flag-rec': 2, 'flag-qb': 2 } },
      { id: 'correct', fr: 'Correct', en: 'Decent', pts: {} },
      { id: 'pas-mon-fort', fr: 'Pas mon fort', en: 'Not my strength', pts: { 'flag-db': 2, 'flag-blitz': 2 } },
    ],
  },
];

export type Poste = {
  id: PosteId;
  fr: string;
  en: string;
  /** fichier webp dans /assets/refonte/emojis/ */
  emoji: string;
  descFr: string;
  descEn: string;
  atouts: { fr: string; en: string }[];
  /** Références « même profil » (NFL / flag international) */
  refs: string;
};

export const POSTES: Record<PosteId, Poste> = {
  qb: {
    id: 'qb', fr: 'Quarterback', en: 'Quarterback', emoji: '19-ballon',
    descFr: 'Le chef d’orchestre. Tu lis la défense, tu annonces la stratégie et chaque action passe par tes mains.',
    descEn: 'The conductor. You read the defense, call the play, and every snap goes through your hands.',
    atouts: [
      { fr: 'Vision du jeu et sang-froid sous pression', en: 'Field vision and composure under pressure' },
      { fr: 'Leadership naturel : l’équipe joue à ton tempo', en: 'Natural leadership: the offense runs at your tempo' },
      { fr: 'La précision compte plus que la force brute', en: 'Accuracy beats raw arm strength' },
    ],
    refs: 'Patrick Mahomes · Joe Burrow',
  },
  rb: {
    id: 'rb', fr: 'Running Back', en: 'Running Back', emoji: '15-joueur-football-buste',
    descFr: 'Le porteur de balle : compact, explosif, insaisissable. Tu transformes un trou d’un mètre en touchdown.',
    descEn: 'The ball carrier: compact, explosive, elusive. You turn a one-yard crease into a touchdown.',
    atouts: [
      { fr: 'Explosivité et changements de direction', en: 'Burst and change of direction' },
      { fr: 'Gabarit compact difficile à plaquer', en: 'Compact frame that’s hard to bring down' },
      { fr: 'L’instinct du terrain : tu sens les espaces', en: 'Field instinct: you feel the open lanes' },
    ],
    refs: 'Saquon Barkley · Christian McCaffrey',
  },
  wr: {
    id: 'wr', fr: 'Wide Receiver', en: 'Wide Receiver', emoji: '28-football-americain',
    descFr: 'L’arme longue de l’attaque : tracés au cordeau, vitesse et mains sûres pour attraper tout ce qui vole.',
    descEn: 'The offense’s deep threat: crisp routes, speed, and sure hands for anything in the air.',
    atouts: [
      { fr: 'Vitesse et appuis tranchants', en: 'Speed and sharp cuts' },
      { fr: 'Des mains fiables sous pression', en: 'Reliable hands under pressure' },
      { fr: 'Les duels aériens sont ton terrain de jeu', en: 'You live for contested catches' },
    ],
    refs: 'Justin Jefferson · Tyreek Hill',
  },
  te: {
    id: 'te', fr: 'Tight End', en: 'Tight End', emoji: '25-maillot-senior',
    descFr: 'L’hybride : assez costaud pour bloquer, assez adroit pour attraper. Le couteau suisse préféré des coachs.',
    descEn: 'The hybrid: strong enough to block, skilled enough to catch. Every coach’s favorite Swiss army knife.',
    atouts: [
      { fr: 'Grand gabarit avec de vraies mains', en: 'Big frame with real hands' },
      { fr: 'Utile sur chaque action, passe ou course', en: 'Valuable on every snap, pass or run' },
      { fr: 'Cible favorite dans les zones denses', en: 'Go-to target in traffic' },
    ],
    refs: 'Travis Kelce · George Kittle',
  },
  ol: {
    id: 'ol', fr: 'Ligne Offensive', en: 'Offensive Line', emoji: '23-soutien-quatre-bras-inclusif',
    descFr: 'Les gardes du corps du quarterback. Puissance, technique et intelligence : aucune attaque n’existe sans vous.',
    descEn: 'The quarterback’s bodyguards. Power, technique, and smarts: no offense exists without you.',
    atouts: [
      { fr: 'La masse et la force comme fondations', en: 'Mass and strength as your foundation' },
      { fr: 'Le poste le plus technique du jeu', en: 'The most technical position in the game' },
      { fr: 'L’esprit d’équipe à l’état pur : tu joues pour les autres', en: 'Pure team spirit: you play for others' },
    ],
    refs: 'Trent Williams · Penei Sewell',
  },
  dl: {
    id: 'dl', fr: 'Ligne Défensive', en: 'Defensive Line', emoji: '26-pioche',
    descFr: 'Le premier rideau : ta mission est simple : traverser la ligne adverse et faire vivre un enfer au quarterback.',
    descEn: 'The first wall: your mission is simple : beat the man in front of you and make the quarterback’s life miserable.',
    atouts: [
      { fr: 'Puissance explosive dès le snap', en: 'Explosive power off the snap' },
      { fr: 'Le contact est ton élément naturel', en: 'Contact is your natural habitat' },
      { fr: 'Le sack : la sensation la plus addictive du jeu', en: 'The sack: the most addictive feeling in football' },
    ],
    refs: 'Aaron Donald · Myles Garrett',
  },
  lb: {
    id: 'lb', fr: 'Linebacker', en: 'Linebacker', emoji: '05-megaphone',
    descFr: 'Le cœur de la défense : tu plaques, tu couvres, tu lis le jeu et tu es partout où le ballon va.',
    descEn: 'The heart of the defense: you tackle, you cover, you read the play, and you’re everywhere the ball goes.',
    atouts: [
      { fr: 'Polyvalence totale : course et passe', en: 'Complete versatility: run and pass' },
      { fr: 'L’instinct de plaqueur', en: 'A tackler’s instinct' },
      { fr: 'Le moteur qui ne s’arrête jamais', en: 'A motor that never stops' },
    ],
    refs: 'Fred Warner · Roquan Smith',
  },
  db: {
    id: 'db', fr: 'Defensive Back', en: 'Defensive Back', emoji: '03-horloge',
    descFr: 'Le duelliste : seul face au receveur adverse, tu vis pour le duel, la lecture… et l’interception qui change un match.',
    descEn: 'The duelist: alone against the receiver, you live for the matchup, the read… and the game-changing interception.',
    atouts: [
      { fr: 'Vitesse et appuis de sprinteur', en: 'Sprinter speed and footwork' },
      { fr: 'Lecture du quarterback et anticipation', en: 'Reading the quarterback and anticipating routes' },
      { fr: 'Le cran de jouer les un-contre-un', en: 'The nerve to play one-on-one islands' },
    ],
    refs: 'Sauce Gardner · Minkah Fitzpatrick',
  },
  k: {
    id: 'k', fr: 'Kicker / Punter', en: 'Kicker / Punter', emoji: '09-arbitre-touchdown-mains-interieures',
    descFr: 'Le poste qui gagne les matchs au pied : coups d’envoi, dégagements et field goals, sang-froid obligatoire. Idéal ancien footballeur ou rugbyman.',
    descEn: 'The position that wins games with your foot: kickoffs, punts, and field goals, composure required. Ideal for a former soccer or rugby player.',
    atouts: [
      { fr: 'Une frappe de balle propre', en: 'A clean strike of the ball' },
      { fr: 'Le calme dans les moments chauds', en: 'Calm when the pressure is on' },
      { fr: 'Un rôle décisif sans besoin d’années de musculation', en: 'A decisive role without years in the weight room' },
    ],
    refs: 'Justin Tucker · Harrison Butker',
  },
  'flag-qb': {
    id: 'flag-qb', fr: 'Quarterback (Flag)', en: 'Quarterback (Flag)', emoji: '22-flag-football',
    descFr: 'Le cerveau du 5 contre 5 : lecture éclair, précision chirurgicale, zéro contact : que du jeu.',
    descEn: 'The brain of 5v5: split-second reads, surgical accuracy, zero contact : pure playmaking.',
    atouts: [
      { fr: 'Vision et vitesse de décision', en: 'Vision and decision speed' },
      { fr: 'La précision avant la puissance', en: 'Accuracy over arm strength' },
      { fr: 'Tu diriges chaque action de ton équipe', en: 'You run every snap your team plays' },
    ],
    refs: 'Le poste star du flag olympique · JO Los Angeles 2028',
  },
  'flag-rec': {
    id: 'flag-rec', fr: 'Receveur (Flag)', en: 'Receiver (Flag)', emoji: '20-joueuse-flag-buste-emoji-v3',
    descFr: 'L’artiste du flag : appuis tranchants, tracés précis, mains sûres : un mètre d’écart te suffit.',
    descEn: 'The flag artist: sharp cuts, precise routes, sure hands : one yard of separation is all you need.',
    atouts: [
      { fr: 'Agilité et changements de direction', en: 'Agility and change of direction' },
      { fr: 'Des mains fiables dans les moments chauds', en: 'Reliable hands when it matters' },
      { fr: 'Sans contact, ta vitesse fait la loi', en: 'With no contact, your speed rules' },
    ],
    refs: 'Le poste qui brille en 5v5 · JO Los Angeles 2028',
  },
  'flag-db': {
    id: 'flag-db', fr: 'Defensive Back (Flag)', en: 'Defensive Back (Flag)', emoji: '10-drapeau',
    descFr: 'Le mur du 5 contre 5, corner ou safety : lecture, placement, mains rapides, et l’interception qui retourne un match.',
    descEn: 'The wall of 5v5, corner or safety: reads, positioning, quick hands, and the interception that flips a game.',
    atouts: [
      { fr: 'Lecture du jeu', en: 'Play reading' },
      { fr: 'Réflexes d’arracheur de flags', en: 'Flag-pulling reflexes' },
      { fr: 'Le cran des un-contre-un', en: 'The nerve for one-on-one islands' },
    ],
    refs: 'Le mur du 5v5 · JO Los Angeles 2028',
  },
  'flag-blitz': {
    id: 'flag-blitz', fr: 'Blitzeur (Flag)', en: 'Rusher (Flag)', emoji: '16-drapeau-nfl-flag',
    descFr: 'La terreur des quarterbacks : sept mètres d’élan, zéro contact, une mission : arriver avant la passe.',
    descEn: 'Every quarterback’s nightmare: seven metres of run-up, zero contact, one mission: get there before the pass.',
    atouts: [
      { fr: 'Explosivité pure', en: 'Pure explosiveness' },
      { fr: 'Timing du départ', en: 'Timing off the snap' },
      { fr: 'Moteur inépuisable', en: 'A motor that never quits' },
    ],
    refs: 'Le chrono du 5v5 · JO Los Angeles 2028',
  },
  'flag-double': {
    id: 'flag-double', fr: 'Receveur + Defensive Back', en: 'Receiver + Defensive Back', emoji: '23-soutien-quatre-bras-inclusif',
    descFr: 'Le double plateau : tu attaques ET tu défends, le profil complet que tout coach de flag veut dans son cinq, avec le pick 6 en spécialité.',
    descEn: 'The two-way player: you attack AND you defend, the complete profile every flag coach wants in his five, with the pick 6 as your specialty.',
    atouts: [
      { fr: 'Des mains des deux côtés du ballon', en: 'Hands on both sides of the ball' },
      { fr: 'Vision offensive ET défensive', en: 'Offensive AND defensive vision' },
      { fr: 'Le profil à interceptions retournées en touchdown', en: 'The profile that turns interceptions into touchdowns' },
    ],
    refs: 'Le couteau suisse du 5v5 · JO Los Angeles 2028',
  },
};

const FOOT_US: PosteId[] = ['qb', 'rb', 'wr', 'te', 'ol', 'dl', 'lb', 'db', 'k'];
/** Ordre de départage côté flag (le poste flag-double est attribué à part). */
const FLAG: PosteId[] = ['flag-rec', 'flag-db', 'flag-blitz', 'flag-qb'];

/**
 * Profils anthropométriques par poste (foot US uniquement : en flag, le gabarit
 * ne discrimine pas les rôles ; le kicker non plus, sa frappe seule compte).
 *
 * Calibrés sur les moyennes NFL Combine / NCAA (QB ~1m89/102 kg, RB ~1m79/97,
 * WR ~1m85/91, TE ~1m93/114, OL ~1m94/140, DL ~1m90/115-137, LB ~1m87/105-109,
 * DB ~1m83/84-93), décalées d'environ -10 % sur le poids et -3 % sur la taille
 * pour le niveau club français, avec des écarts-types élargis (un club amateur
 * recrute des morphologies bien plus dispersées qu'une draft).
 *
 * muH : taille moyenne en cm · sigmaH : écart-type taille
 * muW : poids moyen en kg  · sigmaW : écart-type poids
 */
const ANTHRO: Record<string, { muH: number; sigmaH: number; muW: number; sigmaW: number }> = {
  qb: { muH: 185, sigmaH: 7, muW: 92, sigmaW: 12 },
  rb: { muH: 177, sigmaH: 6, muW: 88, sigmaW: 12 },
  wr: { muH: 181, sigmaH: 7, muW: 82, sigmaW: 10 },
  te: { muH: 189, sigmaH: 6, muW: 103, sigmaW: 12 },
  ol: { muH: 186, sigmaH: 8, muW: 122, sigmaW: 18 },
  dl: { muH: 184, sigmaH: 8, muW: 108, sigmaW: 16 },
  lb: { muH: 181, sigmaH: 7, muW: 95, sigmaW: 12 },
  db: { muH: 178, sigmaH: 7, muW: 78, sigmaW: 10 },
};

export type QuizResult = {
  poste: Poste;
  /** 2e poste du classement (null pour le profil double flag). */
  secondPoste: Poste | null;
  discipline: Discipline;
  age: AgeGroup;
  offerId: string;
};

/**
 * Calcule le résultat à partir des réponses { questionId: reponseId } et des
 * mensurations saisies.
 *
 * Score foot US = compatibilité de gabarit (gaussienne 2D sur taille et poids,
 * max 8 points quand le profil colle pile) + points de préférences.
 * Score flag = préférences + un petit bonus de gabarit atypique (petit ou grand)
 * sur les postes de défense.
 */
export function computeResult(answers: Record<string, string>, mensurations: Mensurations): QuizResult {
  const discipline: Discipline = answers.contact === 'evite' ? 'flag' : 'foot-us';
  const scores = {} as Record<PosteId, number>;
  (Object.keys(POSTES) as PosteId[]).forEach((p) => { scores[p] = 0; });

  // Seules les questions réellement posées comptent : tronc commun + branche.
  const posees = [
    ...QUESTIONS_COMMUNES,
    ...(discipline === 'flag' ? QUESTIONS_FLAG : QUESTIONS_FOOTUS),
  ];
  for (const q of posees) {
    const r = q.reponses.find((x) => x.id === answers[q.id]);
    if (!r?.pts) continue;
    for (const [p, n] of Object.entries(r.pts)) scores[p as PosteId] += n as number;
  }

  if (discipline === 'flag') {
    // Gabarit atypique : les petits gabarits vont vite au sol, les grands
    // couvrent l'espace. Les deux profitent aux postes défensifs du 5v5.
    if (mensurations.taille < 175) { scores['flag-db'] += 1; scores['flag-blitz'] += 1; }
    if (mensurations.taille > 185) { scores['flag-db'] += 1; scores['flag-blitz'] += 1; }
  } else {
    // Bonus anthropométrique : uniquement sur les postes foot US référencés.
    for (const p of FOOT_US) {
      const a = ANTHRO[p];
      if (!a) continue;
      const zh = (mensurations.taille - a.muH) / a.sigmaH;
      const zw = (mensurations.poids - a.muW) / a.sigmaW;
      scores[p] += 8 * Math.exp(-(zh * zh + zw * zw) / 2);
    }
  }

  const age = (answers.age as AgeGroup) ?? '20plus';
  const jeunes = age !== '20plus';
  const offerId =
    discipline === 'flag'
      ? (jeunes ? 'flag-dec-jeunes-o' : 'flag-dec-seniors-o')
      : (jeunes ? 'fa-dec-jeunes-o' : 'fa-dec-seniors-o');

  // Profil complet en flag : attaque ET défense, sans passer par le classement.
  if (discipline === 'flag' && answers.kiff === 'les-deux') {
    return { poste: POSTES['flag-double'], secondPoste: null, discipline, age, offerId };
  }

  // Kicker : choisir « Frapper le ballon au pied » garantit le résultat, quel que
  // soit le gabarit (sinon une anthropométrie qui colle bien à un autre poste
  // pouvait dépasser les 10 points du kicker). La 2e piste = meilleur poste de
  // champ, calculée sur le classement sans le kicker.
  if (discipline === 'foot-us' && answers.role === 'frapper') {
    const champ = FOOT_US.filter((p) => p !== 'k').sort((a, b) => scores[b] - scores[a]);
    return { poste: POSTES['k'], secondPoste: POSTES[champ[0]] ?? null, discipline, age, offerId };
  }

  const pool = discipline === 'flag' ? FLAG : FOOT_US;
  // Départage stable : à points égaux, l'ordre du pool tranche (postes « accessibles » d'abord côté flag).
  const classement = pool.slice().sort((a, b) => scores[b] - scores[a]);
  const best = classement[0];
  const second = classement[1] ?? null;
  return {
    poste: POSTES[best],
    secondPoste: second ? POSTES[second] : null,
    discipline,
    age,
    offerId,
  };
}
