// Adhésions Pionniers de Touraine — tarifs réels (saison 2025-2026).
// Deux onglets par discipline dans la section Adhésions.
// Le bouton renvoie vers la page HelloAsso du club (à remplacer par l'URL réelle).
const HELLOASSO = 'https://www.helloasso.com/associations/pionniers-de-touraine';

export type Formule = {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  href: string;
  cta: string;
  /** Carte « option » (complément d'une formule, style distinct). */
  option?: boolean;
};

export const FOOT_US: Formule[] = [
  {
    name: 'Seniors',
    price: '220 €',
    period: '/saison',
    desc: 'Équipe senior, championnat au contact.',
    features: ['Licence FFFA incluse', 'Entraînements & matchs', 'Encadrement diplômé'],
    href: HELLOASSO,
    cta: "S'inscrire",
  },
  {
    name: 'Juniors U18',
    price: '160 €',
    period: '/saison',
    desc: 'Catégorie jeunes, jusqu’à 18 ans.',
    features: ['Licence FFFA incluse', 'Entraînements encadrés', 'Initiation au contact'],
    href: HELLOASSO,
    cta: "S'inscrire",
  },
  {
    name: 'Option matériel',
    price: '+100 €',
    period: '/saison',
    desc: 'Location de l’équipement complet.',
    features: ['Casque homologué', 'Épaulières', 'Restitution en fin de saison'],
    href: HELLOASSO,
    cta: 'Ajouter',
    option: true,
  },
];

export const FLAG: Formule[] = [
  {
    name: 'Mixte seniors',
    price: '120 €',
    period: '/saison',
    desc: 'Flag adulte mixte, sans contact.',
    features: ['Licence FFFA incluse', 'Format 5x5 dynamique', 'Loisir & compétition'],
    href: HELLOASSO,
    cta: "S'inscrire",
  },
  {
    name: 'Juniors & école',
    price: '70 €',
    period: '/saison',
    desc: 'Jeunes & école de flag football.',
    features: ['Licence FFFA incluse', 'Encadrement adapté', 'Découverte du flag'],
    href: HELLOASSO,
    cta: "S'inscrire",
  },
];
