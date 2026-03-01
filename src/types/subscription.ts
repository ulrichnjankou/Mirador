// Types pour les données de souscription MIRADOR

export type InsuranceType = "auto" | "habitation" | "sante" | "prevoyance" | "vie" | "epargne";

export type SubscriptionStep = 1 | 2 | 3 | 4;

// Étape 1: Filtrer
// Étape 2: Comparer
// Étape 3: Tarif ferme (données produit)
// Étape 4: Souscrire (données client)

// ===== DONNÉES PRODUIT (Quote Input) =====

export interface QuoteInputAuto {
  // Profil conducteur
  age: number;
  permis_annees: number;
  bonus_malus: number;
  sinistres_36m: number;
  
  // Véhicule
  marque: string;
  modele: string;
  mise_en_circ: string; // format: "MM/YYYY"
  energie: "Essence" | "Diesel" | "Electrique" | "Hybride" | "GPL";
  puissance_fiscale: number;
  valeur_vehicule: number;
  usage: "Personnel" | "Professionnel" | "Mixte";
  stationnement: "Garage" | "Parking privé" | "Rue" | "Parking public";
  
  // Localisation
  code_postal: string;
}

export interface QuoteInputHabitation {
  // Logement
  type_logement: "Appartement" | "Maison";
  surface: number;
  pieces: number;
  code_postal: string;
  etage?: number; // si appartement
  
  // Sécurité & contenu
  securite: "Aucune" | "Verrous" | "Alarme" | "Alarme + Télésurveillance";
  valeur_contenu: number;
}

export interface QuoteInputSante {
  // Assuré
  age: number;
  situation_pro: "Salarié" | "Indépendant" | "Étudiant" | "Retraité" | "Sans emploi";
  regime_secu: "Général" | "Alsace-Moselle" | "Étudiant";
  departement: string;
  
  // Couverture souhaitée
  niveau_couverture: "Essentielle" | "Etendue" | "Premium";
}

export interface QuoteInputVie {
  // Projet
  versement_initial: number;
  versement_mensuel: number;
  horizon: number; // années
  
  // Gestion
  mandat: "Pilotée" | "Libre";
  uc_cible: number; // %
}

export type QuoteInput = QuoteInputAuto | QuoteInputHabitation | QuoteInputSante | QuoteInputVie;

// ===== TARIF FERME =====

export interface FirmQuote {
  offer_id: number;
  prix_annuel: number;
  prix_mensuel: number;
  franchise: number;
  garanties: string[];
  validite_jours: number;
  timestamp: string;
}

// ===== DONNÉES CLIENT (Souscription) =====

export interface ClientIdentity {
  civilite: "M." | "Mme" | "Autre";
  nom: string;
  prenom: string;
  date_naissance: string; // format: "YYYY-MM-DD"
  nationalite: string;
  
  type_doc: "CNI" | "Passeport" | "Titre de séjour";
  num_doc: string;
  date_expiration: string; // format: "YYYY-MM-DD"
}

export interface ClientContact {
  email: string;
  mobile: string;
  adresse: string;
  complement_adresse?: string;
  code_postal: string;
  ville: string;
  pays: string;
}

export interface ClientBanking {
  iban: string;
  bic?: string;
  titulaire: string;
}

export interface ClientDocuments {
  piece_recto: File | null;
  piece_verso: File | null;
  justif_domicile: File | null;
  rib: File | null;
}

export interface ClientKYC {
  pep: boolean; // Personne Politiquement Exposée
  sanctions: boolean;
  origine_fonds?: string;
}

export interface ClientConsents {
  rgpd_accepte: boolean;
  cgv_accepte: boolean;
  demarchage_commercial: boolean;
  date_acceptation?: string;
}

export interface ClientSignature {
  mode_paiement: "SEPA" | "CB";
  mandat_sepa_signe?: boolean;
  cb_token?: string;
  signature_electronique: string; // base64 ou URL
  horodatage: string;
}

export interface SubscriptionData {
  offer_id: number;
  quote_input: QuoteInput;
  firm_quote: FirmQuote;
  identity: ClientIdentity;
  contact: ClientContact;
  banking: ClientBanking;
  documents: ClientDocuments;
  kyc: ClientKYC;
  consents: ClientConsents;
  signature: ClientSignature;
}

// ===== FILTRES =====

export interface FiltersAuto {
  age?: number;
  permis_annees?: number;
  bonus_malus_max?: number;
  sinistres_36m_max?: number;
  puissance_fiscale_max?: number;
  valeur_vehicule_max?: number;
  formule?: "Tiers" | "Tiers+" | "Tous Risques";
  franchise_max?: number;
  assistance_0km?: boolean;
  nps_min?: number;
  delai_indemn_max?: number;
  budget_annuel_max?: number;
}

export interface FiltersHabitation {
  surface_max?: number;
  pieces_min?: number;
  vol_inclus?: boolean;
  degat_eaux_inclus?: boolean;
  franchise_max?: number;
  nps_min?: number;
  delai_indemn_max?: number;
  budget_annuel_max?: number;
}

export interface FiltersSante {
  niveau_couverture?: "Essentielle" | "Etendue" | "Premium";
  optique_min?: "Base" | "Confort" | "Premium";
  dentaire_min?: "Base" | "Confort" | "Premium";
  hosp_min?: "Base" | "Confort" | "Premium";
  tiers_payant?: boolean;
  delai_remboursement_max?: number;
  budget_mensuel_max?: number;
}

export interface FiltersVie {
  versement_min_max?: number;
  fonds_euro_requis?: boolean;
  mandat_pilotage?: boolean;
  frais_versement_max?: number;
  frais_gestion_uc_max?: number;
  rci_jours_max?: number;
  nps_min?: number;
}

export type Filters = FiltersAuto | FiltersHabitation | FiltersSante | FiltersVie;

// ===== ÉTAT DE SOUSCRIPTION =====

export type SubscriptionSubStep = 1 | 2 | 3 | 4 | 5;

export interface SubscriptionState {
  currentStep: 1 | 2 | 3 | 4;
  selectedOfferId: number | null;
  insuranceType: InsuranceType;
  quoteInput?: QuoteInput;
  firmQuote?: FirmQuote;
  identity?: ClientIdentity;
  contact?: ClientContact;
  banking?: ClientBanking;
  documents?: ClientDocuments;
  kyc?: ClientKYC;
  consents?: ClientConsents;
  signature?: ClientSignature;
}