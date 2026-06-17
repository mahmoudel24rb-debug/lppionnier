// Adhésions Pionniers de Touraine — tarifs réels (saison 2025-2026).
// Les deux onglets de la section tarifs sont repurposés en disciplines :
//   MENSUEL  -> Football américain
//   COURTES  -> Flag football
// Le bouton renvoie vers la page HelloAsso du club (à remplacer par l'URL réelle).
const HELLOASSO = 'https://www.helloasso.com/associations/pionniers-de-touraine'

export const MENSUEL = [
  { name: 'SENIORS', price: '220 €', period: '/saison', desc: 'Équipe senior, championnat au contact.', features: ['Licence FFFA incluse', 'Entraînements & matchs', 'Encadrement diplômé'], href: HELLOASSO, cta: "S'inscrire" },
  { name: 'JUNIORS U18', price: '160 €', period: '/saison', desc: 'Catégorie jeunes, jusqu’à 18 ans.', features: ['Licence FFFA incluse', 'Entraînements encadrés', 'Initiation au contact'], href: HELLOASSO, cta: "S'inscrire" },
  { name: 'OPTION MATÉRIEL', price: '+100 €', period: '/saison', desc: 'Location de l’équipement complet.', features: ['Casque homologué', 'Épaulières', 'Restitution en fin de saison'], href: HELLOASSO, cta: "Ajouter" },
]

export const COURTES = [
  { name: 'MIXTE SENIORS', price: '120 €', period: '/saison', desc: 'Flag adulte mixte, sans contact.', features: ['Licence FFFA incluse', 'Format 5x5 dynamique', 'Loisir & compétition'], href: HELLOASSO, cta: "S'inscrire" },
  { name: 'JUNIORS & ÉCOLE', price: '70 €', period: '/saison', desc: 'Jeunes & école de flag football.', features: ['Licence FFFA incluse', 'Encadrement adapté', 'Découverte du flag'], href: HELLOASSO, cta: "S'inscrire" },
]
