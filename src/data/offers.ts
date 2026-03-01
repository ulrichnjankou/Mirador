// Base de données des offres d'assurance MIRADOR
// Données mockées pour simulation - En production, ces données viendraient d'une API

export interface Offer {
  id: number;
  insurer: string;
  product: string;
  price: number;
  monthlyPrice: number;
  score: number;
  coverage: string;
  franchise: number;
  rating: number;
  badges: string[];
  strengths: string[];
  type: string;
  segment: 'particulier' | 'professionnel';
  coverageScore: number;
  serviceScore: number;
  lastUpdated: string;
  
  // Données spécifiques par type d'assurance
  autoData?: {
    assistanceKm: number;
    protectionJuridique: boolean;
    bonusMalus: number;
    vehiculeRemplacement: boolean;
    garanties: string[];
  };
  
  habitationData?: {
    degatsEaux: boolean;
    vol: boolean;
    dependances: boolean;
    valeurMobilier: number;
    garanties: string[];
  };
  
  santeData?: {
    carence: number;
    optiqueDentaire: number;
    teleconsultation: boolean;
    hospitalisationPrivee: boolean;
    garanties: string[];
  };
  
  vieData?: {
    fondsEuros: number;
    unitesCompte: boolean;
    versementMin: number;
    fraisGestion: number;
    garanties: string[];
  };
  
  perData?: {
    deductionFiscale: number;
    gestionPilotee: boolean;
    sortieRente: boolean;
    sortieCapital: boolean;
    garanties: string[];
  };
}

export const offers: Offer[] = [
  // ===========================
  // ASSURANCE AUTO - PARTICULIER
  // ===========================
  {
    id: 1,
    insurer: "Groupama",
    product: "Auto Jeune Conducteur",
    price: 720,
    monthlyPrice: 60,
    score: 85,
    coverage: "Tous risques",
    franchise: 300,
    rating: 4.2,
    badges: ["Nouveau", "Jeune conducteur"],
    strengths: ["Prix attractif", "Assistance 24h", "Bonus fidélité"],
    type: "auto",
    segment: "particulier",
    coverageScore: 82,
    serviceScore: 88,
    lastUpdated: "2024-01-15",
    autoData: {
      assistanceKm: 0,
      protectionJuridique: true,
      bonusMalus: 1.0,
      vehiculeRemplacement: true,
      garanties: ["Responsabilité civile", "Tous risques", "Vol/incendie", "Assistance 0km", "Protection juridique"]
    }
  },
  {
    id: 2,
    insurer: "Maif",
    product: "Auto Sociétaire",
    price: 650,
    monthlyPrice: 54.17,
    score: 92,
    coverage: "Tous risques",
    franchise: 200,
    rating: 4.6,
    badges: ["Recommandé", "Éco-responsable"],
    strengths: ["Service client", "Mutuelle sans actionnaire", "Geste vert"],
    type: "auto",
    segment: "particulier",
    coverageScore: 95,
    serviceScore: 89,
    lastUpdated: "2024-01-20",
    autoData: {
      assistanceKm: 0,
      protectionJuridique: true,
      bonusMalus: 0.50,
      vehiculeRemplacement: true,
      garanties: ["Responsabilité civile", "Tous risques", "Catastrophes naturelles", "Assistance Europe", "Prêt véhicule"]
    }
  },
  {
    id: 3,
    insurer: "Direct Assurance",
    product: "Auto Connect",
    price: 590,
    monthlyPrice: 49.17,
    score: 78,
    coverage: "Tiers étendu",
    franchise: 400,
    rating: 4.0,
    badges: ["100% digital", "Prix serré"],
    strengths: ["Tarif compétitif", "Souscription rapide", "App mobile"],
    type: "auto",
    segment: "particulier",
    coverageScore: 75,
    serviceScore: 81,
    lastUpdated: "2024-01-18",
    autoData: {
      assistanceKm: 0,
      protectionJuridique: false,
      bonusMalus: 0.80,
      vehiculeRemplacement: false,
      garanties: ["Responsabilité civile", "Vol/incendie", "Bris de glace", "Assistance dépannage"]
    }
  },

  // ===========================
  // ASSURANCE HABITATION - PARTICULIER
  // ===========================
  {
    id: 11,
    insurer: "Allianz",
    product: "Multirisque Habitat",
    price: 420,
    monthlyPrice: 35,
    score: 88,
    coverage: "Multirisque complète",
    franchise: 150,
    rating: 4.4,
    badges: ["Complet", "Haut de gamme"],
    strengths: ["Couverture étendue", "Service premium", "Expertise rapide"],
    type: "habitation",
    segment: "particulier",
    coverageScore: 92,
    serviceScore: 84,
    lastUpdated: "2024-01-22",
    habitationData: {
      degatsEaux: true,
      vol: true,
      dependances: true,
      valeurMobilier: 50000,
      garanties: ["Incendie", "Dégâts des eaux", "Vol", "Catastrophes naturelles", "Responsabilité civile"]
    }
  },
  {
    id: 12,
    insurer: "Macif",
    product: "Habitation Tranquillité",
    price: 380,
    monthlyPrice: 31.67,
    score: 85,
    coverage: "Multirisque standard",
    franchise: 120,
    rating: 4.3,
    badges: ["Bon rapport qualité/prix", "Mutuelle"],
    strengths: ["Tarif attractif", "Service humain", "Garanties solides"],
    type: "habitation",
    segment: "particulier",
    coverageScore: 85,
    serviceScore: 85,
    lastUpdated: "2024-01-19",
    habitationData: {
      degatsEaux: true,
      vol: true,
      dependances: false,
      valeurMobilier: 30000,
      garanties: ["Incendie", "Dégâts des eaux", "Vol", "Responsabilité civile", "Bris de glace"]
    }
  },

  // ===========================
  // ASSURANCE SANTÉ - PARTICULIER
  // ===========================
  {
    id: 21,
    insurer: "Harmonie Mutuelle",
    product: "Santé Famille Plus",
    price: 1440,
    monthlyPrice: 120,
    score: 90,
    coverage: "Couverture famille",
    franchise: 0,
    rating: 4.5,
    badges: ["Famille", "Téléconsultation"],
    strengths: ["Couverture famille", "Téléconsultation", "Réseau de soins"],
    type: "sante",
    segment: "particulier",
    coverageScore: 93,
    serviceScore: 87,
    lastUpdated: "2024-01-25",
    santeData: {
      carence: 3,
      optiqueDentaire: 300,
      teleconsultation: true,
      hospitalisationPrivee: true,
      garanties: ["Soins courants", "Hospitalisation", "Optique", "Dentaire", "Téléconsultation"]
    }
  },
  {
    id: 22,
    insurer: "Malakoff Humanis",
    product: "Santé Essential",
    price: 960,
    monthlyPrice: 80,
    score: 82,
    coverage: "Couverture individuelle",
    franchise: 0,
    rating: 4.1,
    badges: ["Individuel", "Prix maîtrisé"],
    strengths: ["Tarif compétitif", "Tiers payant", "App dédiée"],
    type: "sante",
    segment: "particulier",
    coverageScore: 80,
    serviceScore: 84,
    lastUpdated: "2024-01-20",
    santeData: {
      carence: 6,
      optiqueDentaire: 200,
      teleconsultation: true,
      hospitalisationPrivee: false,
      garanties: ["Soins courants", "Hospitalisation", "Optique", "Dentaire"]
    }
  },

  // ===========================
  // ASSURANCE VIE - PARTICULIER
  // ===========================
  {
    id: 31,
    insurer: "Axa",
    product: "Vie Patrimoine",
    price: 200,
    monthlyPrice: 16.67,
    score: 87,
    coverage: "Épargne patrimoniale",
    franchise: 0,
    rating: 4.3,
    badges: ["Patrimoine", "Fonds diversifiés"],
    strengths: ["Gestion pilotée", "Diversification", "Fiscalité optimisée"],
    type: "vie",
    segment: "particulier",
    coverageScore: 88,
    serviceScore: 86,
    lastUpdated: "2024-01-23",
    vieData: {
      fondsEuros: 2.8,
      unitesCompte: true,
      versementMin: 1000,
      fraisGestion: 0.8,
      garanties: ["Fonds euros", "Unités de compte", "Gestion pilotée", "Transmission patrimoine"]
    }
  },

  // ===========================
  // PER INDIVIDUEL - PARTICULIER
  // ===========================
  {
    id: 41,
    insurer: "BNP Paribas",
    product: "PER Retraite Plus",
    price: 150,
    monthlyPrice: 12.5,
    score: 89,
    coverage: "Épargne retraite",
    franchise: 0,
    rating: 4.4,
    badges: ["PER", "Déduction fiscale"],
    strengths: ["Déduction fiscale", "Sortie flexible", "Gestion pro"],
    type: "per",
    segment: "particulier",
    coverageScore: 91,
    serviceScore: 87,
    lastUpdated: "2024-01-24",
    perData: {
      deductionFiscale: 10,
      gestionPilotee: true,
      sortieRente: true,
      sortieCapital: true,
      garanties: ["Déduction fiscale", "Gestion pilotée", "Sortie rente", "Sortie capital", "Transmission"]
    }
  },

  // ===========================
  // ASSURANCE PROFESSIONNELLE
  // ===========================
  {
    id: 51,
    insurer: "Hiscox",
    product: "RC Professionnelle",
    price: 850,
    monthlyPrice: 70.83,
    score: 91,
    coverage: "Responsabilité civile pro",
    franchise: 500,
    rating: 4.6,
    badges: ["Professionnel", "Sur-mesure"],
    strengths: ["Spécialiste RC Pro", "Couverture sur-mesure", "Accompagnement expert"],
    type: "rc-pro",
    segment: "professionnel",
    coverageScore: 94,
    serviceScore: 88,
    lastUpdated: "2024-01-26",
    autoData: {
      assistanceKm: 0,
      protectionJuridique: true,
      bonusMalus: 1.0,
      vehiculeRemplacement: false,
      garanties: ["RC Professionnelle", "Protection juridique", "Cyber-risques", "Perte d'exploitation"]
    }
  },
  {
    id: 52,
    insurer: "Axa Pro",
    product: "Multirisque Professionnelle",
    price: 1200,
    monthlyPrice: 100,
    score: 86,
    coverage: "Multirisque complète",
    franchise: 300,
    rating: 4.2,
    badges: ["Multirisque", "PME"],
    strengths: ["Couverture globale", "Réseau expert", "Service dédié PME"],
    type: "multirisque-pro",
    segment: "professionnel",
    coverageScore: 89,
    serviceScore: 83,
    lastUpdated: "2024-01-21",
    autoData: {
      assistanceKm: 0,
      protectionJuridique: true,
      bonusMalus: 1.0,
      vehiculeRemplacement: false,
      garanties: ["Locaux", "Matériel", "RC Professionnelle", "Perte d'exploitation", "Cyber-protection"]
    }
  },

  // ===========================
  // ASSURANCE AUTO SUPPLÉMENTAIRES
  // ===========================
  {
    id: 4,
    insurer: "Macif",
    product: "Auto Conducteur Expérimenté",
    price: 580,
    monthlyPrice: 48.33,
    score: 89,
    coverage: "Tous risques",
    franchise: 250,
    rating: 4.5,
    badges: ["Conducteur expérimenté", "Bonus maximum"],
    strengths: ["Tarif préférentiel", "Service personnalisé", "Bonus fidélité"],
    type: "auto",
    segment: "particulier",
    coverageScore: 90,
    serviceScore: 88,
    lastUpdated: "2024-01-16",
    autoData: {
      assistanceKm: 0,
      protectionJuridique: true,
      bonusMalus: 0.50,
      vehiculeRemplacement: true,
      garanties: ["Responsabilité civile", "Tous risques", "Assistance Europe", "Véhicule de remplacement", "Protection conducteur"]
    }
  },
  {
    id: 5,
    insurer: "Axa",
    product: "Auto Premium",
    price: 780,
    monthlyPrice: 65,
    score: 84,
    coverage: "Tous risques premium",
    franchise: 200,
    rating: 4.3,
    badges: ["Premium", "Service concierge"],
    strengths: ["Service premium", "Assistance VIP", "Véhicule haut de gamme"],
    type: "auto",
    segment: "particulier",
    coverageScore: 88,
    serviceScore: 80,
    lastUpdated: "2024-01-17",
    autoData: {
      assistanceKm: 0,
      protectionJuridique: true,
      bonusMalus: 0.70,
      vehiculeRemplacement: true,
      garanties: ["Responsabilité civile", "Tous risques", "Valeur à neuf", "Service concierge", "Assistance premium"]
    }
  },

  // ===========================
  // ASSURANCE HABITATION SUPPLÉMENTAIRES
  // ===========================
  {
    id: 13,
    insurer: "Generali",
    product: "Habitation Sérénité",
    price: 460,
    monthlyPrice: 38.33,
    score: 83,
    coverage: "Multirisque étendue",
    franchise: 180,
    rating: 4.1,
    badges: ["Sérénité", "Assistance étendue"],
    strengths: ["Assistance 24h/7j", "Garanties étendues", "Service réactif"],
    type: "habitation",
    segment: "particulier",
    coverageScore: 86,
    serviceScore: 80,
    lastUpdated: "2024-01-23",
    habitationData: {
      degatsEaux: true,
      vol: true,
      dependances: true,
      valeurMobilier: 40000,
      garanties: ["Incendie", "Dégâts des eaux", "Vol", "Jardin", "Assistance habitat"]
    }
  },

  // ===========================
  // ASSURANCE SANTÉ SUPPLÉMENTAIRES
  // ===========================
  {
    id: 23,
    insurer: "April",
    product: "Santé Jeune Actif",
    price: 720,
    monthlyPrice: 60,
    score: 79,
    coverage: "Jeune actif",
    franchise: 0,
    rating: 3.9,
    badges: ["Jeune", "Digital"],
    strengths: ["Tarif jeune", "App innovante", "Téléconsultation illimitée"],
    type: "sante",
    segment: "particulier",
    coverageScore: 76,
    serviceScore: 82,
    lastUpdated: "2024-01-21",
    santeData: {
      carence: 3,
      optiqueDentaire: 150,
      teleconsultation: true,
      hospitalisationPrivee: false,
      garanties: ["Soins courants", "Hospitalisation", "Téléconsultation", "Médecines douces"]
    }
  }
];

// Fonction utilitaire pour obtenir les offres par segment et type
export function getOffersBySegmentAndType(segment: 'particulier' | 'professionnel', type: string): Offer[] {
  return offers.filter(offer => offer.segment === segment && offer.type === type);
}

// Fonction utilitaire pour obtenir une offre par ID
export function getOfferById(id: number): Offer | undefined {
  return offers.find(offer => offer.id === id);
}

// Fonction utilitaire pour obtenir les types de produits disponibles
export function getAvailableProductTypes(segment: 'particulier' | 'professionnel'): string[] {
  const types = new Set(offers.filter(offer => offer.segment === segment).map(offer => offer.type));
  return Array.from(types);
}

// Fonction utilitaire pour obtenir les assureurs disponibles
export function getAvailableInsurers(): string[] {
  const insurers = new Set(offers.map(offer => offer.insurer));
  return Array.from(insurers);
}

export default offers;