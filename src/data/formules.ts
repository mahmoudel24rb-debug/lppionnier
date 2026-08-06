// Adhésions Pionniers de Touraine — tarifs réels (saison 2026/2027), FR + EN.
// Le bouton renvoie vers la campagne d'adhésion HelloAsso du club.
import type { Lang } from '@/lib/i18n';

const HELLOASSO =
  'https://www.helloasso.com/associations/pionniers-de-touraine/adhesions/adhesion-2026-2027';

export type Formule = {
  name: string;
  price: string;
  period: string;
  /** Description : une entrée par ligne (retours à la ligne contrôlés). */
  desc: string[];
  features: string[];
  href: string;
  cta: string;
  /** Étiquette de coin (haut droit de la carte) : Compétition / Loisir / École… */
  tag: string;
  /** Libellé de l'échéance en cas de paiement fractionné (ex. « 3 × 50 € »). */
  paiement3x?: string;
};

const FOOT_US_FR: Formule[] = [
  {
    name: 'Seniors',
    price: '249,99 €',
    period: '/saison',
    desc: ['Équipe D2 senior, championnat', 'au contact · nés en 2007 et avant.'],
    features: ['Licence FFFA incluse', 'Entraînements & matchs', 'Encadrement diplômé'],
    href: HELLOASSO,
    cta: "S'inscrire",
    tag: 'Compétition',
    paiement3x: '3 × 83,33 €',
  },
  {
    name: 'Juniors U18',
    price: '150 €',
    period: '/saison',
    desc: ['Équipe U18 ·', 'nés en 2009, 2010, 2011.'],
    features: ['Licence FFFA incluse', 'Entraînements encadrés', 'Initiation au contact'],
    href: HELLOASSO,
    cta: "S'inscrire",
    tag: 'Compétition',
    paiement3x: '3 × 50 €',
  },
];

const FLAG_FR: Formule[] = [
  {
    name: 'Seniors',
    price: '150 €',
    period: '/saison',
    desc: ['Équipe D2 senior mixte,', 'sans contact · nés en 2008', 'et avant.'],
    features: ['Licence FFFA incluse', 'Championnat mixte & Coupe de France', 'Entraînements & matchs'],
    href: HELLOASSO,
    cta: "S'inscrire",
    tag: 'Compétition',
    paiement3x: '3 × 50 €',
  },
  {
    name: 'Seniors',
    price: '100 €',
    period: '/saison',
    desc: ['Pratique loisir', 'sans compétition ·', 'nés en 2008 et avant.'],
    features: ['Licence FFFA incluse', 'Entraînements hebdomadaires', 'Format 5x5 sans contact'],
    href: HELLOASSO,
    cta: "S'inscrire",
    tag: 'Loisir',
  },
  {
    name: 'École de flag',
    price: '100 €',
    period: '/saison',
    desc: ['U9 à U17 · nés de 2010 à 2018.'],
    features: [
      'Licence FFFA incluse',
      'Encadrement diplômé',
      'Découverte du flag',
      'Championnat jeunes · U13 · U15 · U17',
      'Programme NFL Flag · U13 & U15',
    ],
    href: HELLOASSO,
    cta: "S'inscrire",
    tag: 'Junior',
  },
];

const FOOT_US_EN: Formule[] = [
  {
    name: 'Seniors',
    price: '€249.99',
    period: '/season',
    desc: ['D2 senior team, full-contact', 'league play · born in 2007 or earlier.'],
    features: ['FFFA license included', 'Practices & games', 'Certified coaching'],
    href: HELLOASSO,
    cta: 'Sign up',
    tag: 'Competition',
    paiement3x: '3 × €83.33',
  },
  {
    name: 'Juniors U18',
    price: '€150',
    period: '/season',
    desc: ['U18 team ·', 'born in 2009, 2010, 2011.'],
    features: ['FFFA license included', 'Supervised practices', 'Intro to contact play'],
    href: HELLOASSO,
    cta: 'Sign up',
    tag: 'Competition',
    paiement3x: '3 × €50',
  },
];

const FLAG_EN: Formule[] = [
  {
    name: 'Seniors',
    price: '€150',
    period: '/season',
    desc: ['Co-ed D2 senior team,', 'no contact · born in 2008', 'or earlier.'],
    features: ['FFFA license included', 'Co-ed league & French Cup', 'Practices & games'],
    href: HELLOASSO,
    cta: 'Sign up',
    tag: 'Competition',
    paiement3x: '3 × €50',
  },
  {
    name: 'Seniors',
    price: '€100',
    period: '/season',
    desc: ['Recreational play', 'no league games ·', 'born in 2008 or earlier.'],
    features: ['FFFA license included', 'Weekly practices', 'No-contact 5v5 format'],
    href: HELLOASSO,
    cta: 'Sign up',
    tag: 'Recreational',
  },
  {
    name: 'Flag academy',
    price: '€100',
    period: '/season',
    desc: ['U9 to U17 · born 2010 to 2018.'],
    features: [
      'FFFA license included',
      'Certified coaching',
      'Discover flag football',
      'Youth league · U13 · U15 · U17',
      'NFL Flag program · U13 & U15',
    ],
    href: HELLOASSO,
    cta: 'Sign up',
    tag: 'Junior',
  },
];

export const FORMULES: Record<Lang, { footUs: Formule[]; flag: Formule[] }> = {
  fr: { footUs: FOOT_US_FR, flag: FLAG_FR },
  en: { footUs: FOOT_US_EN, flag: FLAG_EN },
};
