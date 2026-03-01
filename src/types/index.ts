// Types centralisés pour l'application MIRADOR

// Type pour le segment utilisateur
export type UserType = 'particulier' | 'professionnel';

// Interface utilisateur
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  membershipLevel: string;
  points: number;
  isAdmin?: boolean;
}

// Type pour l'état des filtres
export interface FilterState {
  [key: string]: any;
}

// Interface pour les offres d'assurance
export interface Offer {
  id: number;
  insurer: string;
  product: string;
  price: number;
  monthlyPrice: number;
  score: number;
  coverage: string;
  coverageLevel?: string;
  franchise: number;
  rating: number;
  badges: string[];
  strengths: string[];
  guarantees?: string[];
  exclusions?: string[];
  type: string;
  segment: UserType;
  coverageScore: number;
  serviceScore: number;
  lastUpdated: string;
  nps?: number;
  responseTime?: string;
  claimProcessing?: string;
  
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

// Types pour les sinistres
export interface Sinistre {
  id: number;
  contratId: number;
  type: string;
  description: string;
  dateDeclaration: string;
  statut: 'En cours' | 'Indemnisé' | 'Refusé' | 'Clôturé';
  montantDemande: number;
  montantIndemnise: number;
  franchise: number;
  numeroSinistre: string;
}

// Types pour les contrats
export interface Contrat {
  id: number;
  type: string;
  assureur: string;
  produit: string;
  primeAnnuelle: number;
  primeMensuelle: number;
  dateEcheance: string;
  statut: 'Actif' | 'À recoter' | 'Expiré' | 'Suspendu';
  franchise: number;
  numeroContrat: string;
  dernierPaiement: string;
  prochainPaiement: string;
  garanties: string[];
  documents: string[];
  
  // Champs spécifiques selon le type
  vehicule?: string;
  logement?: string;
  beneficiaires?: string;
}

// Types pour l'historique de comparaison
export interface ComparisonHistory {
  id: string;
  timestamp: number;
  userType: UserType;
  product: string;
  filters: FilterState;
  resultsCount: number;
  bestOffer?: {
    insurer: string;
    price: number;
    score: number;
  };
  isFavorite: boolean;
  name?: string;
}

// Types pour les avantages fidélité
export interface LoyaltyAdvantage {
  id: number;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  available: boolean;
  expiryDate?: string;
  termsAndConditions: string;
  icon: string;
}

// Types pour les niveaux de fidélité
export type MembershipLevel = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Admin';

// Interface pour les notifications
export interface Notification {
  id: number;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Types pour les préférences utilisateur
export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  marketing: {
    newsletter: boolean;
    offers: boolean;
    surveys: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
    cookies: boolean;
  };
}

// Types pour les documents
export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'other';
  size: number;
  url: string;
  uploadDate: string;
  category: 'identity' | 'address' | 'income' | 'contract' | 'claim' | 'other';
}

// Types pour la signature électronique
export interface SignatureData {
  documentId: string;
  signatureValue: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

// Types pour les informations de paiement
export interface PaymentInfo {
  iban: string;
  bic: string;
  accountHolder: string;
  frequency: 'monthly' | 'quarterly' | 'annual';
  firstPaymentDate: string;
  joinLoyaltyProgram: boolean;
}

// Types pour les filtres de recherche
export interface SearchFilters {
  priceRange: [number, number];
  insurers: string[];
  coverageTypes: string[];
  franchiseMax: number;
  ratingMin: number;
  features: string[];
}

// Export de tous les types
export type {
  UserType,
  User,
  FilterState,
  Offer,
  Sinistre,
  Contrat,
  ComparisonHistory,
  LoyaltyAdvantage,
  MembershipLevel,
  Notification,
  UserPreferences,
  Document,
  SignatureData,
  PaymentInfo,
  SearchFilters
};