// Adhésions Pionniers de Touraine — tarifs réels (saison 2026/2027).
// Deux onglets par discipline dans la section Adhésions.
// Le bouton renvoie vers la campagne d'adhésion HelloAsso du club.
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

export const FOOT_US: Formule[] = [
  {
    name: 'Seniors',
    price: '249,99 €',
    period: '/saison',
    desc: ['Équipe D2 senior, championnat', 'au contact · nés en 2007', 'et avant.'],
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

export const FLAG: Formule[] = [
  {
    name: 'Seniors compétition',
    price: '150 €',
    period: '/saison',
    desc: ['Équipe D2 senior mixte,', 'sans contact · nés en 2008', 'et avant.'],
    features: ['Licence FFFA incluse', 'Championnat D2 mixte', 'Entraînements & matchs'],
    href: HELLOASSO,
    cta: "S'inscrire",
    tag: 'Compétition',
    paiement3x: '3 × 50 €',
  },
  {
    name: 'Seniors loisir',
    price: '100 €',
    period: '/saison',
    desc: ['Pratique loisir', 'sans compétition ·', 'nés en 2008 et avant.'],
    features: ['Licence FFFA incluse', 'Entraînements hebdomadaires', 'Format 5x5 sans contact'],
    href: HELLOASSO,
    cta: "S'inscrire",
    tag: 'Loisir',
  },
  {
    name: 'U15 & U18 compétition',
    price: '100 €',
    period: '/saison',
    desc: ['Équipes U15 (2012-2013)', 'et U18 (2009-2011)', 'en compétition.'],
    features: ['Licence FFFA incluse', 'Championnat jeunes', 'Encadrement diplômé'],
    href: HELLOASSO,
    cta: "S'inscrire",
    tag: 'Compétition',
  },
  {
    name: 'École de flag',
    price: '100 €',
    period: '/saison',
    desc: ['U9 à U13 ·', 'nés de 2014 à 2017.'],
    features: ['Licence FFFA incluse', 'Encadrement adapté', 'Découverte du flag'],
    href: HELLOASSO,
    cta: "S'inscrire",
    tag: 'École',
  },
];
