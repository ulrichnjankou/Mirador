// Données complètes des 15 offres multi-acteurs MIRADOR

export interface ProductDocument {
  id: string;
  type: "IPID" | "Conditions Générales" | "Tableau Garanties" | "Notice Information" | "Fiche Produit";
  nom: string;
  url: string;
  taille?: string;
  pages?: number;
  derniere_maj?: string;
}

export interface OfferFull {
  id: number;
  assureur: string;
  categorie_distributeur: "Mutuelle" | "Bancassureur" | "Assureur Traditionnel" | "Insurtech";
  type_assurance: "auto" | "habitation" | "sante" | "prevoyance" | "vie" | "epargne";
  nom_offre: string;
  score_mirador: number;
  nps_client: number;
  prix_annuel: number;
  franchise: number;
  niveau_couverture: "Essentielle" | "Etendue" | "Premium" | "Tous Risques" | "Tiers" | "Tiers+";
  garanties_principales: string[];
  delai_indemn_j: number;
  lien_pdf_ipid: string;
  lien_cgv: string;
  documents?: ProductDocument[];
  label_meilleure_offre?: string;
  
  // Spécifique AUTO
  formule?: string;
  assistance_0km?: boolean;
  bonus_malus_min?: number;
  puissance_fiscale_max?: number;
  valeur_vehicule_max?: number;
  
  // Spécifique HABITATION
  surface_max?: number;
  vol_inclus?: boolean;
  degat_eaux_inclus?: boolean;
  
  // Spécifique SANTÉ-PRÉVOYANCE
  optique_lvl?: "Base" | "Confort" | "Premium";
  dentaire_lvl?: "Base" | "Confort" | "Premium";
  hosp_lvl?: "Base" | "Confort" | "Premium";
  tiers_payant?: boolean;
  delai_remboursement?: number;
  
  // Spécifique ÉPARGNE-VIE
  uc_min_pct?: number;
  fonds_euro_dispo?: boolean;
  mandat_pilotage?: boolean;
  frais_versement?: number;
  frais_gestion_uc?: number;
  versement_min?: number;
  rci_jours?: number;
}

export const offersFull: OfferFull[] = [
  // === AUTO (5 offres) ===
  {
    id: 1,
    assureur: "MAIF",
    categorie_distributeur: "Mutuelle",
    type_assurance: "auto",
    nom_offre: "Auto Sociétaire Tous Risques",
    score_mirador: 92,
    nps_client: 75,
    prix_annuel: 680,
    franchise: 300,
    niveau_couverture: "Tous Risques",
    garanties_principales: [
      "Assistance 0km",
      "Protection juridique",
      "Bris de glace sans franchise",
      "Véhicule de remplacement",
      "Garantie conducteur"
    ],
    delai_indemn_j: 15,
    lien_pdf_ipid: "/docs/maif-auto-ipid.pdf",
    lien_cgv: "/docs/maif-auto-cgv.pdf",
    documents: [
      {
        id: "maif-auto-ipid",
        type: "IPID",
        nom: "Document d'Information sur le Produit d'Assurance Auto",
        url: "https://www.maif.fr/content/pdf/assurance-auto/ipid-auto-maif.pdf",
        taille: "245 Ko",
        pages: 3,
        derniere_maj: "01/09/2024"
      },
      {
        id: "maif-auto-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales Assurance Auto MAIF",
        url: "https://www.maif.fr/content/pdf/assurance-auto/cg-auto-maif.pdf",
        taille: "1.2 Mo",
        pages: 28,
        derniere_maj: "01/01/2024"
      },
      {
        id: "maif-auto-tableau",
        type: "Tableau Garanties",
        nom: "Tableau récapitulatif des garanties Auto",
        url: "https://www.maif.fr/content/pdf/assurance-auto/tableau-garanties-auto.pdf",
        taille: "180 Ko",
        pages: 2,
        derniere_maj: "01/09/2024"
      }
    ],
    label_meilleure_offre: "Meilleure offre globale",
    formule: "Tous Risques",
    assistance_0km: true,
    bonus_malus_min: 0.5,
    puissance_fiscale_max: 20,
    valeur_vehicule_max: 80000
  },
  {
    id: 2,
    assureur: "Groupama",
    categorie_distributeur: "Mutuelle",
    type_assurance: "auto",
    nom_offre: "Auto Famille Confort",
    score_mirador: 88,
    nps_client: 71,
    prix_annuel: 620,
    franchise: 350,
    niveau_couverture: "Tous Risques",
    garanties_principales: [
      "Assistance 0km",
      "Protection juridique",
      "Vol et incendie",
      "Bris de glace",
      "Catastrophes naturelles"
    ],
    delai_indemn_j: 20,
    lien_pdf_ipid: "/docs/groupama-auto-ipid.pdf",
    lien_cgv: "/docs/groupama-auto-cgv.pdf",
    documents: [
      {
        id: "groupama-auto-ipid",
        type: "IPID",
        nom: "IPID Auto Famille",
        url: "https://www.groupama.fr/documents/ipid-auto-famille.pdf",
        taille: "230 Ko",
        pages: 3,
        derniere_maj: "15/08/2024"
      },
      {
        id: "groupama-auto-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales Auto Groupama",
        url: "https://www.groupama.fr/documents/cg-auto-groupama.pdf",
        taille: "1.5 Mo",
        pages: 32,
        derniere_maj: "01/01/2024"
      },
      {
        id: "groupama-auto-fiche",
        type: "Fiche Produit",
        nom: "Fiche produit Auto Famille Confort",
        url: "https://www.groupama.fr/documents/fiche-auto-famille.pdf",
        taille: "320 Ko",
        pages: 4,
        derniere_maj: "15/08/2024"
      }
    ],
    label_meilleure_offre: "Meilleur rapport qualité/prix",
    formule: "Tous Risques",
    assistance_0km: true,
    bonus_malus_min: 0.6,
    puissance_fiscale_max: 18,
    valeur_vehicule_max: 60000
  },
  {
    id: 3,
    assureur: "AXA",
    categorie_distributeur: "Assureur Traditionnel",
    type_assurance: "auto",
    nom_offre: "Auto Zen Premium",
    score_mirador: 86,
    nps_client: 68,
    prix_annuel: 750,
    franchise: 250,
    niveau_couverture: "Tous Risques",
    garanties_principales: [
      "Assistance 0km étendue",
      "Protection juridique renforcée",
      "Garantie valeur à neuf 2 ans",
      "Véhicule de remplacement premium",
      "Assistance voyage Europe"
    ],
    delai_indemn_j: 12,
    lien_pdf_ipid: "/docs/axa-auto-ipid.pdf",
    lien_cgv: "/docs/axa-auto-cgv.pdf",
    documents: [
      {
        id: "axa-auto-ipid",
        type: "IPID",
        nom: "IPID Auto Zen AXA",
        url: "https://www.axa.fr/content/dam/axa-fr/documents/ipid-auto-zen.pdf",
        taille: "260 Ko",
        pages: 3,
        derniere_maj: "01/10/2024"
      },
      {
        id: "axa-auto-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales AXA Auto",
        url: "https://www.axa.fr/content/dam/axa-fr/documents/cg-auto.pdf",
        taille: "1.8 Mo",
        pages: 35,
        derniere_maj: "01/01/2024"
      },
      {
        id: "axa-auto-tableau",
        type: "Tableau Garanties",
        nom: "Tableau des garanties Auto Zen",
        url: "https://www.axa.fr/content/dam/axa-fr/documents/tableau-auto-zen.pdf",
        taille: "195 Ko",
        pages: 2,
        derniere_maj: "01/10/2024"
      },
      {
        id: "axa-auto-notice",
        type: "Notice Information",
        nom: "Notice d'information Auto Premium",
        url: "https://www.axa.fr/content/dam/axa-fr/documents/notice-auto-premium.pdf",
        taille: "850 Ko",
        pages: 12,
        derniere_maj: "01/01/2024"
      }
    ],
    label_meilleure_offre: "Service le plus rapide",
    formule: "Tous Risques",
    assistance_0km: true,
    bonus_malus_min: 0.5,
    puissance_fiscale_max: 25,
    valeur_vehicule_max: 100000
  },
  {
    id: 4,
    assureur: "Allianz",
    categorie_distributeur: "Assureur Traditionnel",
    type_assurance: "auto",
    nom_offre: "Auto Essentielle Tiers+",
    score_mirador: 82,
    nps_client: 65,
    prix_annuel: 420,
    franchise: 400,
    niveau_couverture: "Tiers+",
    garanties_principales: [
      "Responsabilité civile",
      "Vol et incendie",
      "Bris de glace",
      "Assistance >50km",
      "Protection juridique"
    ],
    delai_indemn_j: 25,
    lien_pdf_ipid: "/docs/allianz-auto-ipid.pdf",
    lien_cgv: "/docs/allianz-auto-cgv.pdf",
    documents: [
      {
        id: "allianz-auto-ipid",
        type: "IPID",
        nom: "IPID Auto Essentielle",
        url: "https://www.allianz.fr/content/documents/ipid-auto-essentielle.pdf",
        taille: "215 Ko",
        pages: 3,
        derniere_maj: "20/09/2024"
      },
      {
        id: "allianz-auto-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales Auto Allianz",
        url: "https://www.allianz.fr/content/documents/cg-auto.pdf",
        taille: "1.3 Mo",
        pages: 30,
        derniere_maj: "01/01/2024"
      },
      {
        id: "allianz-auto-fiche",
        type: "Fiche Produit",
        nom: "Fiche produit Auto Essentielle",
        url: "https://www.allianz.fr/content/documents/fiche-auto-essentielle.pdf",
        taille: "280 Ko",
        pages: 3,
        derniere_maj: "20/09/2024"
      }
    ],
    formule: "Tiers+",
    assistance_0km: false,
    bonus_malus_min: 0.7,
    puissance_fiscale_max: 15,
    valeur_vehicule_max: 40000
  },
  {
    id: 5,
    assureur: "Luko",
    categorie_distributeur: "Insurtech",
    type_assurance: "auto",
    nom_offre: "Auto 100% Digital",
    score_mirador: 84,
    nps_client: 72,
    prix_annuel: 540,
    franchise: 300,
    niveau_couverture: "Tous Risques",
    garanties_principales: [
      "Assistance 0km",
      "Protection juridique digitale",
      "Déclaration sinistre 2min",
      "Indemnisation express",
      "Bonus écologique"
    ],
    delai_indemn_j: 10,
    lien_pdf_ipid: "/docs/luko-auto-ipid.pdf",
    lien_cgv: "/docs/luko-auto-cgv.pdf",
    documents: [
      {
        id: "luko-auto-ipid",
        type: "IPID",
        nom: "IPID Auto 100% Digital",
        url: "https://www.luko.eu/documents/ipid-auto-digital.pdf",
        taille: "190 Ko",
        pages: 2,
        derniere_maj: "01/11/2024"
      },
      {
        id: "luko-auto-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales Luko Auto",
        url: "https://www.luko.eu/documents/cg-auto.pdf",
        taille: "980 Ko",
        pages: 22,
        derniere_maj: "01/09/2024"
      },
      {
        id: "luko-auto-tableau",
        type: "Tableau Garanties",
        nom: "Tableau garanties Auto Digital",
        url: "https://www.luko.eu/documents/tableau-garanties-auto.pdf",
        taille: "165 Ko",
        pages: 2,
        derniere_maj: "01/11/2024"
      }
    ],
    formule: "Tous Risques",
    assistance_0km: true,
    bonus_malus_min: 0.5,
    puissance_fiscale_max: 20,
    valeur_vehicule_max: 70000
  },

  // === HABITATION (3 offres) ===
  {
    id: 6,
    assureur: "MACIF",
    categorie_distributeur: "Mutuelle",
    type_assurance: "habitation",
    nom_offre: "Habitation Garantie des Accidents de la Vie",
    score_mirador: 90,
    nps_client: 76,
    prix_annuel: 285,
    franchise: 150,
    niveau_couverture: "Etendue",
    garanties_principales: [
      "Dégâts des eaux",
      "Incendie et explosion",
      "Vol et vandalisme",
      "Catastrophes naturelles",
      "Responsabilité civile vie privée",
      "Protection juridique"
    ],
    delai_indemn_j: 18,
    lien_pdf_ipid: "/docs/macif-hab-ipid.pdf",
    lien_cgv: "/docs/macif-hab-cgv.pdf",
    documents: [
      {
        id: "macif-hab-ipid",
        type: "IPID",
        nom: "IPID Habitation GAV MACIF",
        url: "https://www.macif.fr/content/pdf/habitation/ipid-hab-gav.pdf",
        taille: "220 Ko",
        pages: 3,
        derniere_maj: "01/09/2024"
      },
      {
        id: "macif-hab-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales Habitation",
        url: "https://www.macif.fr/content/pdf/habitation/cg-habitation.pdf",
        taille: "1.4 Mo",
        pages: 30,
        derniere_maj: "01/01/2024"
      },
      {
        id: "macif-hab-tableau",
        type: "Tableau Garanties",
        nom: "Tableau garanties Habitation GAV",
        url: "https://www.macif.fr/content/pdf/habitation/tableau-garanties-hab.pdf",
        taille: "200 Ko",
        pages: 2,
        derniere_maj: "01/09/2024"
      }
    ],
    label_meilleure_offre: "Meilleure offre globale",
    surface_max: 250,
    vol_inclus: true,
    degat_eaux_inclus: true
  },
  {
    id: 7,
    assureur: "Generali",
    categorie_distributeur: "Assureur Traditionnel",
    type_assurance: "habitation",
    nom_offre: "Habitation Patrimoine Premium",
    score_mirador: 87,
    nps_client: 70,
    prix_annuel: 380,
    franchise: 100,
    niveau_couverture: "Premium",
    garanties_principales: [
      "Tous risques mobilier",
      "Objets de valeur garantis",
      "Dommages électriques",
      "Jardin et dépendances",
      "Assistance 24/7",
      "Relogement premium"
    ],
    delai_indemn_j: 15,
    lien_pdf_ipid: "/docs/generali-hab-ipid.pdf",
    lien_cgv: "/docs/generali-hab-cgv.pdf",
    documents: [
      {
        id: "generali-hab-ipid",
        type: "IPID",
        nom: "IPID Habitation Patrimoine",
        url: "https://www.generali.fr/documents/ipid-habitation-patrimoine.pdf",
        taille: "270 Ko",
        pages: 3,
        derniere_maj: "15/09/2024"
      },
      {
        id: "generali-hab-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales Habitation Premium",
        url: "https://www.generali.fr/documents/cg-habitation-premium.pdf",
        taille: "1.6 Mo",
        pages: 34,
        derniere_maj: "01/01/2024"
      },
      {
        id: "generali-hab-notice",
        type: "Notice Information",
        nom: "Notice d'information Patrimoine",
        url: "https://www.generali.fr/documents/notice-habitation-patrimoine.pdf",
        taille: "780 Ko",
        pages: 10,
        derniere_maj: "15/09/2024"
      }
    ],
    surface_max: 500,
    vol_inclus: true,
    degat_eaux_inclus: true
  },
  {
    id: 8,
    assureur: "Crédit Agricole Assurances",
    categorie_distributeur: "Bancassureur",
    type_assurance: "habitation",
    nom_offre: "Habitation Essentielle",
    score_mirador: 83,
    nps_client: 67,
    prix_annuel: 220,
    franchise: 200,
    niveau_couverture: "Essentielle",
    garanties_principales: [
      "Dégâts des eaux",
      "Incendie",
      "Vol > 500€",
      "Responsabilité civile",
      "Catastrophes naturelles"
    ],
    delai_indemn_j: 22,
    lien_pdf_ipid: "/docs/ca-hab-ipid.pdf",
    lien_cgv: "/docs/ca-hab-cgv.pdf",
    documents: [
      {
        id: "ca-hab-ipid",
        type: "IPID",
        nom: "IPID Habitation Essentielle CA",
        url: "https://www.ca-assurances.com/documents/ipid-habitation-essentielle.pdf",
        taille: "210 Ko",
        pages: 3,
        derniere_maj: "10/09/2024"
      },
      {
        id: "ca-hab-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales Habitation CA",
        url: "https://www.ca-assurances.com/documents/cg-habitation.pdf",
        taille: "1.1 Mo",
        pages: 26,
        derniere_maj: "01/01/2024"
      },
      {
        id: "ca-hab-fiche",
        type: "Fiche Produit",
        nom: "Fiche produit Habitation Essentielle",
        url: "https://www.ca-assurances.com/documents/fiche-habitation-essentielle.pdf",
        taille: "250 Ko",
        pages: 3,
        derniere_maj: "10/09/2024"
      }
    ],
    surface_max: 150,
    vol_inclus: true,
    degat_eaux_inclus: true
  },

  // === SANTÉ (4 offres) ===
  {
    id: 9,
    assureur: "MGEN",
    categorie_distributeur: "Mutuelle",
    type_assurance: "sante",
    nom_offre: "Santé Active Premium",
    score_mirador: 91,
    nps_client: 78,
    prix_annuel: 1680,
    franchise: 0,
    niveau_couverture: "Premium",
    garanties_principales: [
      "Hospitalisation 200%",
      "Optique 450€/an",
      "Dentaire 500%",
      "Médecines douces 200€",
      "Téléconsultation illimitée",
      "Tiers payant intégral"
    ],
    delai_indemn_j: 0,
    lien_pdf_ipid: "/docs/mgen-sante-ipid.pdf",
    lien_cgv: "/docs/mgen-sante-cgv.pdf",
    documents: [
      {
        id: "mgen-sante-ipid",
        type: "IPID",
        nom: "IPID Santé Active Premium",
        url: "https://www.mgen.fr/documents/ipid-sante-active-premium.pdf",
        taille: "280 Ko",
        pages: 3,
        derniere_maj: "01/10/2024"
      },
      {
        id: "mgen-sante-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales Santé MGEN",
        url: "https://www.mgen.fr/documents/cg-sante-mgen.pdf",
        taille: "1.7 Mo",
        pages: 38,
        derniere_maj: "01/01/2024"
      },
      {
        id: "mgen-sante-tableau",
        type: "Tableau Garanties",
        nom: "Tableau des garanties Santé Premium",
        url: "https://www.mgen.fr/documents/tableau-garanties-premium.pdf",
        taille: "320 Ko",
        pages: 4,
        derniere_maj: "01/10/2024"
      },
      {
        id: "mgen-sante-notice",
        type: "Notice Information",
        nom: "Notice d'information Santé Active",
        url: "https://www.mgen.fr/documents/notice-sante-active.pdf",
        taille: "950 Ko",
        pages: 14,
        derniere_maj: "01/01/2024"
      }
    ],
    label_meilleure_offre: "Meilleure couverture santé",
    optique_lvl: "Premium",
    dentaire_lvl: "Premium",
    hosp_lvl: "Premium",
    tiers_payant: true,
    delai_remboursement: 3
  },
  {
    id: 10,
    assureur: "April",
    categorie_distributeur: "Assureur Traditionnel",
    type_assurance: "sante",
    nom_offre: "Santé First Confort",
    score_mirador: 86,
    nps_client: 72,
    prix_annuel: 1320,
    franchise: 0,
    niveau_couverture: "Etendue",
    garanties_principales: [
      "Hospitalisation 150%",
      "Optique 300€/an",
      "Dentaire 300%",
      "Pharmacie 100%",
      "Téléconsultation",
      "Tiers payant partiel"
    ],
    delai_indemn_j: 0,
    lien_pdf_ipid: "/docs/april-sante-ipid.pdf",
    lien_cgv: "/docs/april-sante-cgv.pdf",
    documents: [
      {
        id: "april-sante-ipid",
        type: "IPID",
        nom: "IPID Santé First Confort",
        url: "https://www.april.fr/documents/ipid-sante-first-confort.pdf",
        taille: "240 Ko",
        pages: 3,
        derniere_maj: "15/09/2024"
      },
      {
        id: "april-sante-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales Santé April",
        url: "https://www.april.fr/documents/cg-sante-april.pdf",
        taille: "1.3 Mo",
        pages: 32,
        derniere_maj: "01/01/2024"
      },
      {
        id: "april-sante-tableau",
        type: "Tableau Garanties",
        nom: "Tableau garanties Santé First",
        url: "https://www.april.fr/documents/tableau-sante-first.pdf",
        taille: "280 Ko",
        pages: 3,
        derniere_maj: "15/09/2024"
      }
    ],
    optique_lvl: "Confort",
    dentaire_lvl: "Confort",
    hosp_lvl: "Confort",
    tiers_payant: true,
    delai_remboursement: 5
  },
  {
    id: 11,
    assureur: "Société Générale Assurances",
    categorie_distributeur: "Bancassureur",
    type_assurance: "sante",
    nom_offre: "Santé Essentielle",
    score_mirador: 80,
    nps_client: 65,
    prix_annuel: 960,
    franchise: 0,
    niveau_couverture: "Essentielle",
    garanties_principales: [
      "Hospitalisation 100%",
      "Optique 150€/an",
      "Dentaire 150%",
      "Pharmacie 100%",
      "Consultations généralistes"
    ],
    delai_indemn_j: 0,
    lien_pdf_ipid: "/docs/sg-sante-ipid.pdf",
    lien_cgv: "/docs/sg-sante-cgv.pdf",
    documents: [
      {
        id: "sg-sante-ipid",
        type: "IPID",
        nom: "IPID Santé Essentielle SG",
        url: "https://assurances.societegenerale.fr/documents/ipid-sante-essentielle.pdf",
        taille: "210 Ko",
        pages: 3,
        derniere_maj: "01/09/2024"
      },
      {
        id: "sg-sante-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales Santé SG",
        url: "https://assurances.societegenerale.fr/documents/cg-sante.pdf",
        taille: "1.1 Mo",
        pages: 28,
        derniere_maj: "01/01/2024"
      },
      {
        id: "sg-sante-fiche",
        type: "Fiche Produit",
        nom: "Fiche produit Santé Essentielle",
        url: "https://assurances.societegenerale.fr/documents/fiche-sante-essentielle.pdf",
        taille: "230 Ko",
        pages: 3,
        derniere_maj: "01/09/2024"
      }
    ],
    optique_lvl: "Base",
    dentaire_lvl: "Base",
    hosp_lvl: "Base",
    tiers_payant: false,
    delai_remboursement: 7
  },
  {
    id: 12,
    assureur: "LCL",
    categorie_distributeur: "Bancassureur",
    type_assurance: "sante",
    nom_offre: "Santé Famille Confort",
    score_mirador: 84,
    nps_client: 69,
    prix_annuel: 1440,
    franchise: 0,
    niveau_couverture: "Etendue",
    garanties_principales: [
      "Hospitalisation 180%",
      "Optique 350€/an",
      "Dentaire 400%",
      "Médecines douces 100€",
      "Téléconsultation",
      "Forfait prévention 50€"
    ],
    delai_indemn_j: 0,
    lien_pdf_ipid: "/docs/lcl-sante-ipid.pdf",
    lien_cgv: "/docs/lcl-sante-cgv.pdf",
    documents: [
      {
        id: "lcl-sante-ipid",
        type: "IPID",
        nom: "IPID Santé Famille Confort LCL",
        url: "https://www.lcl.fr/assurances/documents/ipid-sante-famille.pdf",
        taille: "250 Ko",
        pages: 3,
        derniere_maj: "20/09/2024"
      },
      {
        id: "lcl-sante-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales Santé LCL",
        url: "https://www.lcl.fr/assurances/documents/cg-sante-lcl.pdf",
        taille: "1.25 Mo",
        pages: 30,
        derniere_maj: "01/01/2024"
      },
      {
        id: "lcl-sante-tableau",
        type: "Tableau Garanties",
        nom: "Tableau garanties Santé Famille",
        url: "https://www.lcl.fr/assurances/documents/tableau-sante-famille.pdf",
        taille: "290 Ko",
        pages: 3,
        derniere_maj: "20/09/2024"
      }
    ],
    optique_lvl: "Confort",
    dentaire_lvl: "Confort",
    hosp_lvl: "Confort",
    tiers_payant: true,
    delai_remboursement: 4
  },

  // === ÉPARGNE-VIE (3 offres) ===
  {
    id: 13,
    assureur: "CNP Assurances",
    categorie_distributeur: "Assureur Traditionnel",
    type_assurance: "epargne",
    nom_offre: "Épargne Avenir Pilotée",
    score_mirador: 89,
    nps_client: 74,
    prix_annuel: 0,
    franchise: 0,
    niveau_couverture: "Premium",
    garanties_principales: [
      "Fonds euro 2.5%",
      "Gestion pilotée",
      "350+ supports UC",
      "Arbitrages gratuits",
      "Versements libres dès 100€",
      "Rachat partiel J+3"
    ],
    delai_indemn_j: 0,
    lien_pdf_ipid: "/docs/cnp-vie-ipid.pdf",
    lien_cgv: "/docs/cnp-vie-cgv.pdf",
    documents: [
      {
        id: "cnp-vie-ipid",
        type: "IPID",
        nom: "IPID Assurance Vie Avenir Pilotée",
        url: "https://www.cnp.fr/documents/ipid-avenir-pilotee.pdf",
        taille: "290 Ko",
        pages: 3,
        derniere_maj: "01/10/2024"
      },
      {
        id: "cnp-vie-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales Assurance Vie CNP",
        url: "https://www.cnp.fr/documents/cg-assurance-vie.pdf",
        taille: "2.1 Mo",
        pages: 45,
        derniere_maj: "01/01/2024"
      },
      {
        id: "cnp-vie-notice",
        type: "Notice Information",
        nom: "Notice d'information Épargne Avenir",
        url: "https://www.cnp.fr/documents/notice-epargne-avenir.pdf",
        taille: "1.2 Mo",
        pages: 18,
        derniere_maj: "01/10/2024"
      },
      {
        id: "cnp-vie-fiche",
        type: "Fiche Produit",
        nom: "Fiche produit Gestion Pilotée",
        url: "https://www.cnp.fr/documents/fiche-gestion-pilotee.pdf",
        taille: "350 Ko",
        pages: 4,
        derniere_maj: "01/10/2024"
      }
    ],
    label_meilleure_offre: "Meilleur rendement fonds euro",
    uc_min_pct: 0,
    fonds_euro_dispo: true,
    mandat_pilotage: true,
    frais_versement: 0,
    frais_gestion_uc: 0.85,
    versement_min: 100,
    rci_jours: 3
  },
  {
    id: 14,
    assureur: "Cardif",
    categorie_distributeur: "Bancassureur",
    type_assurance: "epargne",
    nom_offre: "Épargne Libre Gestion",
    score_mirador: 85,
    nps_client: 70,
    prix_annuel: 0,
    franchise: 0,
    niveau_couverture: "Etendue",
    garanties_principales: [
      "Fonds euro 2.2%",
      "Gestion libre",
      "250+ supports UC",
      "Frais réduits",
      "Versements dès 500€",
      "Rachat partiel J+5"
    ],
    delai_indemn_j: 0,
    lien_pdf_ipid: "/docs/cardif-vie-ipid.pdf",
    lien_cgv: "/docs/cardif-vie-cgv.pdf",
    documents: [
      {
        id: "cardif-vie-ipid",
        type: "IPID",
        nom: "IPID Assurance Vie Libre Gestion",
        url: "https://www.cardif.fr/documents/ipid-libre-gestion.pdf",
        taille: "260 Ko",
        pages: 3,
        derniere_maj: "15/09/2024"
      },
      {
        id: "cardif-vie-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales Cardif Épargne",
        url: "https://www.cardif.fr/documents/cg-epargne-cardif.pdf",
        taille: "1.8 Mo",
        pages: 40,
        derniere_maj: "01/01/2024"
      },
      {
        id: "cardif-vie-tableau",
        type: "Tableau Garanties",
        nom: "Tableau des frais et garanties",
        url: "https://www.cardif.fr/documents/tableau-frais-garanties.pdf",
        taille: "310 Ko",
        pages: 3,
        derniere_maj: "15/09/2024"
      }
    ],
    uc_min_pct: 0,
    fonds_euro_dispo: true,
    mandat_pilotage: false,
    frais_versement: 2,
    frais_gestion_uc: 0.95,
    versement_min: 500,
    rci_jours: 5
  },
  {
    id: 15,
    assureur: "La Banque Postale Assurances",
    categorie_distributeur: "Bancassureur",
    type_assurance: "epargne",
    nom_offre: "Épargne Accessible",
    score_mirador: 81,
    nps_client: 68,
    prix_annuel: 0,
    franchise: 0,
    niveau_couverture: "Essentielle",
    garanties_principales: [
      "Fonds euro 1.8%",
      "Gestion libre simplifiée",
      "100+ supports UC",
      "Sans frais d'entrée",
      "Versements dès 300€",
      "Rachat partiel J+7"
    ],
    delai_indemn_j: 0,
    lien_pdf_ipid: "/docs/lbp-vie-ipid.pdf",
    lien_cgv: "/docs/lbp-vie-cgv.pdf",
    documents: [
      {
        id: "lbp-vie-ipid",
        type: "IPID",
        nom: "IPID Épargne Accessible LBP",
        url: "https://www.labanquepostale.fr/documents/ipid-epargne-accessible.pdf",
        taille: "230 Ko",
        pages: 3,
        derniere_maj: "10/09/2024"
      },
      {
        id: "lbp-vie-cg",
        type: "Conditions Générales",
        nom: "Conditions Générales Assurance Vie LBP",
        url: "https://www.labanquepostale.fr/documents/cg-assurance-vie.pdf",
        taille: "1.5 Mo",
        pages: 36,
        derniere_maj: "01/01/2024"
      },
      {
        id: "lbp-vie-fiche",
        type: "Fiche Produit",
        nom: "Fiche produit Épargne Accessible",
        url: "https://www.labanquepostale.fr/documents/fiche-epargne-accessible.pdf",
        taille: "270 Ko",
        pages: 3,
        derniere_maj: "10/09/2024"
      }
    ],
    uc_min_pct: 0,
    fonds_euro_dispo: true,
    mandat_pilotage: false,
    frais_versement: 0,
    frais_gestion_uc: 1.1,
    versement_min: 300,
    rci_jours: 7
  }
];