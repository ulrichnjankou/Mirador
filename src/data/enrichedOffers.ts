// Base de données enrichie des offres d'assurance MIRADOR
// 15 offres variées avec marques de référence

export interface EnrichedOffer {
  id: number;
  insurer: string;
  offerName: string;
  insuranceType: 'auto' | 'habitation' | 'sante' | 'prevoyance' | 'vie';
  annualPrice: number;
  franchise: number;
  miradorScore: number; // 0-100
  guaranteeCategories: string[];
  nps: number; // Score de satisfaction client
  isBestOffer: boolean;
  coverageLevel: string;
  detailLink: string;
  segment: 'particulier' | 'professionnel';
  // Détails supplémentaires
  monthlyPrice: number;
  badges: string[];
  strengths: string[];
  mainGuarantees: string[];
}

export const enrichedOffers: EnrichedOffer[] = [
  // AUTO
  {
    id: 1,
    insurer: "MAIF",
    offerName: "Auto Sociétaire",
    insuranceType: "auto",
    annualPrice: 650,
    monthlyPrice: 54.17,
    franchise: 200,
    miradorScore: 92,
    guaranteeCategories: ["Responsabilité civile", "Tous risques", "Assistance", "Protection juridique"],
    nps: 89,
    isBestOffer: true,
    coverageLevel: "Tous risques",
    detailLink: "/offre/1",
    segment: "particulier",
    badges: ["Meilleure offre", "Éco-responsable"],
    strengths: ["Service client exceptionnel", "Mutuelle éthique", "Bonus écologique"],
    mainGuarantees: ["Assistance 0km", "Protection juridique", "Véhicule de remplacement", "Vol/incendie"]
  },
  {
    id: 2,
    insurer: "Groupama",
    offerName: "Auto Jeune Conducteur",
    insuranceType: "auto",
    annualPrice: 720,
    monthlyPrice: 60,
    franchise: 300,
    miradorScore: 85,
    guaranteeCategories: ["Responsabilité civile", "Tous risques", "Assistance"],
    nps: 82,
    isBestOffer: false,
    coverageLevel: "Tous risques",
    detailLink: "/offre/2",
    segment: "particulier",
    badges: ["Jeune conducteur"],
    strengths: ["Prix attractif jeunes", "Assistance 24/7", "Bonus fidélité"],
    mainGuarantees: ["Assistance 0km", "Protection juridique", "Tous risques", "Vol/incendie"]
  },
  {
    id: 3,
    insurer: "AXA",
    offerName: "Auto Premium",
    insuranceType: "auto",
    annualPrice: 890,
    monthlyPrice: 74.17,
    franchise: 150,
    miradorScore: 88,
    guaranteeCategories: ["Responsabilité civile", "Tous risques", "Assistance Premium", "Protection juridique"],
    nps: 85,
    isBestOffer: false,
    coverageLevel: "Tous risques Premium",
    detailLink: "/offre/3",
    segment: "particulier",
    badges: ["Premium"],
    strengths: ["Couverture maximale", "Réseau international", "Service conciergerie"],
    mainGuarantees: ["Assistance 0km Europe", "Véhicule de remplacement garanti", "Protection juridique étendue", "Accessoires et équipements"]
  },

  // HABITATION
  {
    id: 4,
    insurer: "MACIF",
    offerName: "Multirisque Habitation",
    insuranceType: "habitation",
    annualPrice: 280,
    monthlyPrice: 23.33,
    franchise: 150,
    miradorScore: 90,
    guaranteeCategories: ["Dégâts des eaux", "Vol", "Incendie", "Catastrophes naturelles"],
    nps: 87,
    isBestOffer: true,
    coverageLevel: "Multirisque complète",
    detailLink: "/offre/4",
    segment: "particulier",
    badges: ["Meilleure offre", "Rapport qualité/prix"],
    strengths: ["Prix compétitif", "Service réactif", "Indemnisation rapide"],
    mainGuarantees: ["Dégâts des eaux", "Vol et vandalisme", "Incendie", "Responsabilité civile"]
  },
  {
    id: 5,
    insurer: "Allianz",
    offerName: "Habitat Sérénité",
    insuranceType: "habitation",
    annualPrice: 320,
    monthlyPrice: 26.67,
    franchise: 200,
    miradorScore: 86,
    guaranteeCategories: ["Dégâts des eaux", "Vol", "Incendie", "Dépendances"],
    nps: 83,
    isBestOffer: false,
    coverageLevel: "Multirisque",
    detailLink: "/offre/5",
    segment: "particulier",
    badges: ["Assureur leader"],
    strengths: ["Réseau mondial", "Expertise reconnue", "Options personnalisables"],
    mainGuarantees: ["Protection complète logement", "Dépendances incluses", "Biens de valeur", "Jardin et extérieur"]
  },
  {
    id: 6,
    insurer: "MAAF",
    offerName: "Habitation Essentielle",
    insuranceType: "habitation",
    annualPrice: 240,
    monthlyPrice: 20,
    franchise: 250,
    miradorScore: 81,
    guaranteeCategories: ["Dégâts des eaux", "Incendie", "Vol"],
    nps: 79,
    isBestOffer: false,
    coverageLevel: "Essentielle",
    detailLink: "/offre/6",
    segment: "particulier",
    badges: ["Économique"],
    strengths: ["Prix mini", "Souscription simple", "Sans engagement"],
    mainGuarantees: ["Dégâts des eaux", "Incendie", "Vol garanti", "RC vie privée"]
  },

  // SANTÉ
  {
    id: 7,
    insurer: "Harmonie Mutuelle",
    offerName: "Santé Famille",
    insuranceType: "sante",
    annualPrice: 1450,
    monthlyPrice: 120.83,
    franchise: 0,
    miradorScore: 91,
    guaranteeCategories: ["Hospitalisation", "Optique", "Dentaire", "Médecine courante"],
    nps: 88,
    isBestOffer: true,
    coverageLevel: "Renforcé",
    detailLink: "/offre/7",
    segment: "particulier",
    badges: ["Meilleure offre", "Famille"],
    strengths: ["Couverture famille complète", "Téléconsultation", "Tiers payant étendu"],
    mainGuarantees: ["Hospitalisation 200%", "Optique 400€/an", "Dentaire renforcé", "Téléconsultation illimitée"]
  },
  {
    id: 8,
    insurer: "April",
    offerName: "Santé Digital",
    insuranceType: "sante",
    annualPrice: 980,
    monthlyPrice: 81.67,
    franchise: 0,
    miradorScore: 84,
    guaranteeCategories: ["Hospitalisation", "Médecine courante", "Prévention"],
    nps: 81,
    isBestOffer: false,
    coverageLevel: "Standard",
    detailLink: "/offre/8",
    segment: "particulier",
    badges: ["100% digital"],
    strengths: ["Prix attractif", "100% en ligne", "Remboursements rapides"],
    mainGuarantees: ["Hospitalisation 150%", "Médecine courante", "Prévention incluse", "Application mobile"]
  },
  {
    id: 9,
    insurer: "Generali",
    offerName: "Santé Premium",
    insuranceType: "sante",
    annualPrice: 1850,
    monthlyPrice: 154.17,
    franchise: 0,
    miradorScore: 89,
    guaranteeCategories: ["Hospitalisation", "Optique", "Dentaire", "Médecine douce"],
    nps: 86,
    isBestOffer: false,
    coverageLevel: "Premium",
    detailLink: "/offre/9",
    segment: "particulier",
    badges: ["Premium", "Médecines douces"],
    strengths: ["Remboursements élevés", "Médecines alternatives", "Chambre individuelle"],
    mainGuarantees: ["Hospitalisation 300%", "Optique 600€/an", "Ostéopathie 6 séances", "Dentaire haut de gamme"]
  },

  // VIE & ÉPARGNE
  {
    id: 10,
    insurer: "CNP Assurances",
    offerName: "Vie Épargne Sécurisée",
    insuranceType: "vie",
    annualPrice: 1200,
    monthlyPrice: 100,
    franchise: 0,
    miradorScore: 87,
    guaranteeCategories: ["Fonds euros", "Versements libres", "Transmission"],
    nps: 84,
    isBestOffer: false,
    coverageLevel: "Sécurisé",
    detailLink: "/offre/10",
    segment: "particulier",
    badges: ["Épargne sûre"],
    strengths: ["Fonds euros performant", "Garantie capital", "Fiscalité avantageuse"],
    mainGuarantees: ["Fonds euros 2.8%", "Versements dès 50€", "Disponibilité totale", "Avance sur contrat"]
  },
  {
    id: 11,
    insurer: "BNP Paribas Cardif",
    offerName: "Vie Patrimoniale",
    insuranceType: "vie",
    annualPrice: 2500,
    monthlyPrice: 208.33,
    franchise: 0,
    miradorScore: 90,
    guaranteeCategories: ["Fonds euros", "Unités de compte", "Gestion pilotée", "Transmission"],
    nps: 87,
    isBestOffer: true,
    coverageLevel: "Patrimonial",
    detailLink: "/offre/11",
    segment: "particulier",
    badges: ["Meilleure offre", "Gestion pilotée"],
    strengths: ["Large choix supports", "Expertise bancaire", "Conseil dédié"],
    mainGuarantees: ["200+ supports UC", "Gestion pilotée gratuite", "Arbitrages illimités", "Succession optimisée"]
  },
  {
    id: 12,
    insurer: "Crédit Agricole Assurances",
    offerName: "Vie Projet",
    insuranceType: "vie",
    annualPrice: 1500,
    monthlyPrice: 125,
    franchise: 0,
    miradorScore: 85,
    guaranteeCategories: ["Fonds euros", "Unités de compte", "Versements programmés"],
    nps: 82,
    isBestOffer: false,
    coverageLevel: "Dynamique",
    detailLink: "/offre/12",
    segment: "particulier",
    badges: ["Réseau bancaire"],
    strengths: ["Proximité agences", "Conseil personnalisé", "Solutions diversifiées"],
    mainGuarantees: ["Fonds euros 2.5%", "Versements programmés", "150+ supports", "Retrait partiel"]
  },

  // PRÉVOYANCE
  {
    id: 13,
    insurer: "SwissLife",
    offerName: "Prévoyance Essentielle",
    insuranceType: "prevoyance",
    annualPrice: 420,
    monthlyPrice: 35,
    franchise: 0,
    miradorScore: 88,
    guaranteeCategories: ["Incapacité", "Invalidité", "Décès"],
    nps: 85,
    isBestOffer: true,
    coverageLevel: "Complète",
    detailLink: "/offre/13",
    segment: "particulier",
    badges: ["Meilleure offre", "Protection famille"],
    strengths: ["Couverture complète", "Expertise suisse", "Versement rapide"],
    mainGuarantees: ["Rente invalidité", "Capital décès 100k€", "Maintien de salaire", "Assistance psychologique"]
  },
  {
    id: 14,
    insurer: "AG2R La Mondiale",
    offerName: "Prévoyance Modulaire",
    insuranceType: "prevoyance",
    annualPrice: 380,
    monthlyPrice: 31.67,
    franchise: 90,
    miradorScore: 86,
    guaranteeCategories: ["Incapacité", "Invalidité", "Rente éducation"],
    nps: 83,
    isBestOffer: false,
    coverageLevel: "Modulable",
    detailLink: "/offre/14",
    segment: "particulier",
    badges: ["Modulable"],
    strengths: ["Options personnalisables", "Prix compétitif", "Accompagnement social"],
    mainGuarantees: ["Indemnités journalières", "Rente invalidité", "Rente éducation", "Services d'assistance"]
  },
  {
    id: 15,
    insurer: "La Banque Postale",
    offerName: "Prévoyance Solidaire",
    insuranceType: "prevoyance",
    annualPrice: 340,
    monthlyPrice: 28.33,
    franchise: 90,
    miradorScore: 82,
    guaranteeCategories: ["Incapacité", "Décès", "Obsèques"],
    nps: 80,
    isBestOffer: false,
    coverageLevel: "Essentielle",
    detailLink: "/offre/15",
    segment: "particulier",
    badges: ["Prix mini", "Accessible"],
    strengths: ["Tarif accessible", "Souscription simplifiée", "Service public"],
    mainGuarantees: ["Capital décès 50k€", "Indemnités journalières", "Capital obsèques 5k€", "Assistance juridique"]
  }
];
