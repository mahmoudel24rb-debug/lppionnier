/* Vacances scolaires et jours fériés affichés en fond du calendrier.
   Source : calendrier scolaire officiel de la zone B (académie Orléans-Tours)
   et liste légale des jours fériés. À rafraîchir chaque été, quand le
   calendrier de la saison suivante est publié.

   vacances : périodes sans école, bornes `from` et `to` INCLUSES.
   feries   : une date, un nom.

   Ce fichier est optionnel : si la constante n'est pas définie, le calendrier
   s'affiche normalement, sans bandeau. */
window.PIONNIERS_JOURS_SPECIAUX = {
  vacances: [
    { nom: "Vacances de la Toussaint", from: "2026-10-17", to: "2026-11-01" },
    { nom: "Vacances de Noël",         from: "2026-12-19", to: "2027-01-03" },
    { nom: "Vacances d'hiver",         from: "2027-02-20", to: "2027-03-07" },
    { nom: "Vacances de printemps",    from: "2027-04-17", to: "2027-05-02" },
    { nom: "Pont de l'Ascension",      from: "2027-05-06", to: "2027-05-09" },
    { nom: "Vacances d'été",           from: "2027-07-03", to: "2027-08-31" }
  ],
  feries: [
    { date: "2026-07-14", nom: "Fête nationale" },
    { date: "2026-08-15", nom: "Assomption" },
    { date: "2026-11-01", nom: "Toussaint" },
    { date: "2026-11-11", nom: "Armistice 1918" },
    { date: "2026-12-25", nom: "Noël" },
    { date: "2027-01-01", nom: "Jour de l'an" },
    { date: "2027-03-29", nom: "Lundi de Pâques" },
    { date: "2027-05-01", nom: "Fête du Travail" },
    { date: "2027-05-06", nom: "Ascension" },
    { date: "2027-05-08", nom: "Victoire 1945" },
    { date: "2027-05-17", nom: "Lundi de Pentecôte" },
    { date: "2027-07-14", nom: "Fête nationale" },
    { date: "2027-08-15", nom: "Assomption" }
  ]
};
