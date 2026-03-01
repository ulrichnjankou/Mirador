import { useState, useMemo } from "react";
import { Shield, ChevronRight, Check, Home } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { FiltersPanel } from "./comparator/FiltersPanel";
import { OffersGrid } from "./comparator/OffersGrid";
import { ProductDataSheet } from "./comparator/ProductDataSheet";
import { SubscriptionFlow } from "./comparator/SubscriptionFlow";
import { OfferDetail } from "./OfferDetail";
import { ProductDocumentSynthesis } from "./comparator/ProductDocumentSynthesis";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { VisuallyHidden } from "./ui/visually-hidden";
import { offersFull, type OfferFull } from "../data/offersFull";
import { offers } from "../data/offers";
import type { 
  InsuranceType, 
  FirmQuote,
  QuoteInput,
  FiltersAuto,
  FiltersHabitation,
  FiltersSante,
  FiltersVie
} from "../types/subscription";

interface ComparateurRefonteProps {
  onComplete?: (subscriptionId: string) => void;
  onNavigateHome?: () => void;
}

type SubscriptionStep = 1 | 2 | 3 | 4;

export function ComparateurRefonte({ onComplete, onNavigateHome }: ComparateurRefonteProps) {
  // État global
  const [currentStep, setCurrentStep] = useState<SubscriptionStep>(1);
  const [selectedType, setSelectedType] = useState<InsuranceType>("auto");
  const [filters, setFilters] = useState<any>({
    budget_annuel_max: 2000,
    franchise_max: 500,
    nps_min: 60
  });

  // État UI
  const [selectedOfferForSheet, setSelectedOfferForSheet] = useState<OfferFull | null>(null);
  const [selectedOfferForDetail, setSelectedOfferForDetail] = useState<OfferFull | null>(null);
  const [selectedOfferForDocuments, setSelectedOfferForDocuments] = useState<OfferFull | null>(null);
  const [selectedOfferForSubscription, setSelectedOfferForSubscription] = useState<OfferFull | null>(null);
  const [firmQuote, setFirmQuote] = useState<FirmQuote | null>(null);
  const [quoteInput, setQuoteInput] = useState<QuoteInput | null>(null);
  const [showSubscriptionFlow, setShowSubscriptionFlow] = useState(false);

  // Progression des étapes
  const steps = [
    { number: 1, label: "Filtrer", icon: Shield, completed: currentStep > 1 },
    { number: 2, label: "Comparer", icon: Shield, completed: currentStep > 2 },
    { number: 3, label: "Tarif définitif", icon: Shield, completed: currentStep > 3 },
    { number: 4, label: "Souscrire", icon: Shield, completed: currentStep === 4 }
  ];

  // Filtrage des offres
  const filteredOffers = useMemo(() => {
    let filtered = offersFull.filter(offer => {
      // Type d'assurance
      if (offer.type_assurance !== selectedType) return false;

      // Filtres AUTO
      if (selectedType === "auto") {
        const autoFilters = filters as FiltersAuto;
        if (autoFilters.formule && offer.formule !== autoFilters.formule) return false;
        if (autoFilters.franchise_max !== undefined && offer.franchise > autoFilters.franchise_max) return false;
        if (autoFilters.assistance_0km && !offer.assistance_0km) return false;
        if (autoFilters.nps_min !== undefined && offer.nps_client < autoFilters.nps_min) return false;
        if (autoFilters.budget_annuel_max !== undefined && offer.prix_annuel > autoFilters.budget_annuel_max) return false;
      }

      // Filtres HABITATION
      if (selectedType === "habitation") {
        const habFilters = filters as FiltersHabitation;
        if (habFilters.surface_max !== undefined && offer.surface_max && offer.surface_max > habFilters.surface_max) return false;
        if (habFilters.vol_inclus && !offer.vol_inclus) return false;
        if (habFilters.degat_eaux_inclus && !offer.degat_eaux_inclus) return false;
        if (habFilters.nps_min !== undefined && offer.nps_client < habFilters.nps_min) return false;
        if (habFilters.budget_annuel_max !== undefined && offer.prix_annuel > habFilters.budget_annuel_max) return false;
      }

      // Filtres SANTÉ
      if (selectedType === "sante") {
        const santeFilters = filters as FiltersSante;
        if (santeFilters.niveau_couverture && offer.niveau_couverture !== santeFilters.niveau_couverture) return false;
        if (santeFilters.tiers_payant && !offer.tiers_payant) return false;
        if (santeFilters.optique_min && offer.optique_lvl) {
          const levels = ["Base", "Confort", "Premium"];
          if (levels.indexOf(offer.optique_lvl) < levels.indexOf(santeFilters.optique_min)) return false;
        }
        if (santeFilters.dentaire_min && offer.dentaire_lvl) {
          const levels = ["Base", "Confort", "Premium"];
          if (levels.indexOf(offer.dentaire_lvl) < levels.indexOf(santeFilters.dentaire_min)) return false;
        }
        if (santeFilters.budget_mensuel_max !== undefined && offer.prix_annuel / 12 > santeFilters.budget_mensuel_max) return false;
      }

      // Filtres ÉPARGNE-VIE
      if (selectedType === "epargne") {
        const vieFilters = filters as FiltersVie;
        if (vieFilters.fonds_euro_requis && !offer.fonds_euro_dispo) return false;
        if (vieFilters.mandat_pilotage !== undefined && offer.mandat_pilotage !== vieFilters.mandat_pilotage) return false;
        if (vieFilters.versement_min_max !== undefined && offer.versement_min && offer.versement_min > vieFilters.versement_min_max) return false;
        if (vieFilters.frais_gestion_uc_max !== undefined && offer.frais_gestion_uc && offer.frais_gestion_uc > vieFilters.frais_gestion_uc_max) return false;
        if (vieFilters.nps_min !== undefined && offer.nps_client < vieFilters.nps_min) return false;
      }

      return true;
    });

    // Tri par score décroissant
    return filtered.sort((a, b) => b.score_mirador - a.score_mirador);
  }, [offersFull, selectedType, filters]);

  // Handlers
  const handleTypeChange = (type: InsuranceType) => {
    setSelectedType(type);
    // Réinitialiser les filtres selon le type
    if (type === "auto") {
      setFilters({ budget_annuel_max: 2000, franchise_max: 500, nps_min: 60 });
    } else if (type === "habitation") {
      setFilters({ budget_annuel_max: 500, surface_max: 250, nps_min: 60 });
    } else if (type === "sante") {
      setFilters({ budget_mensuel_max: 200, nps_min: 60 });
    } else if (type === "epargne") {
      setFilters({ versement_min_max: 500, frais_gestion_uc_max: 1.2, nps_min: 60 });
    }
    setCurrentStep(1);
  };

  const handleApplyFilters = () => {
    setCurrentStep(2);
  };

  const handleResetFilters = () => {
    handleTypeChange(selectedType);
  };

  const handleTarifFerme = (offer: OfferFull) => {
    setSelectedOfferForSheet(offer);
    setCurrentStep(3);
  };

  const handleVoirDetail = (offer: OfferFull) => {
    setSelectedOfferForDetail(offer);
  };

  const handleQuoteCalculated = (quote: FirmQuote, input: QuoteInput) => {
    setFirmQuote(quote);
    setQuoteInput(input);
  };

  const handleSubscribe = () => {
    // Sauvegarder l'offre pour le flux de souscription
    if (selectedOfferForSheet) {
      setSelectedOfferForSubscription(selectedOfferForSheet);
    }
    
    // Si quoteInput n'existe pas encore, créer un objet par défaut
    if (!quoteInput && firmQuote) {
      const defaultQuoteInput: QuoteInput = {
        insuranceType: selectedType,
        timestamp: new Date().toISOString()
      };
      setQuoteInput(defaultQuoteInput);
    }
    
    // Fermer le Sheet pour ouvrir le Dialog de souscription
    setSelectedOfferForSheet(null);
    
    setShowSubscriptionFlow(true);
    setCurrentStep(4);
  };

  const handleSubscriptionComplete = (confirmationData: any) => {
    setShowSubscriptionFlow(false);
    if (onComplete) {
      onComplete(confirmationData.subscriptionId);
    }
  };

  // Convertir OfferFull vers Offer pour OfferDetail
  const selectedOfferForDetailConverted = selectedOfferForDetail 
    ? offers.find(o => o.id === selectedOfferForDetail.id)
    : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header minimal */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-[#2563EB]" />
                <h1 className="text-2xl text-[#111827]">MIRADOR</h1>
              </div>
              <nav className="hidden md:flex items-center space-x-6">
                <button
                  onClick={onNavigateHome}
                  className="text-sm text-[#6B7280] hover:text-[#2563EB] transition-colors flex items-center space-x-1"
                >
                  <Home className="h-4 w-4" />
                  <span>Accueil</span>
                </button>
                <button className="text-sm text-[#2563EB] border-b-2 border-[#2563EB] pb-1">
                  Comparer
                </button>
                <button className="text-sm text-[#6B7280] hover:text-[#2563EB] transition-colors">
                  Avantages
                </button>
                <button className="text-sm text-[#6B7280] hover:text-[#2563EB] transition-colors">
                  Espace client
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Barre de progression des étapes */}
      <div className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${step.completed 
                      ? "bg-[#10B981] text-white" 
                      : currentStep === step.number 
                        ? "bg-[#2563EB] text-white" 
                        : "bg-white border-2 border-[#E5E7EB] text-[#6B7280]"
                    }
                  `}>
                    {step.completed ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{step.number}</span>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className={`text-sm ${
                      currentStep === step.number ? "text-[#2563EB]" : "text-[#6B7280]"
                    }`}>
                      Étape {step.number}
                    </p>
                    <p className={`text-xs ${
                      currentStep === step.number ? "text-[#111827]" : "text-[#6B7280]"
                    }`}>
                      {step.label}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className="h-0.5 bg-[#E5E7EB] relative">
                      <div 
                        className={`absolute inset-y-0 left-0 bg-[#10B981] transition-all duration-500 ${
                          step.completed ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Panneau Filtres */}
          <FiltersPanel
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
            filters={filters}
            onFiltersChange={setFilters}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
          />

          {/* Panneau Résultats */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl text-[#111827] mb-2">
                {currentStep === 1 ? "Configurez vos critères" : "Résultats de comparaison"}
              </h2>
              <p className="text-sm text-[#6B7280]">
                {filteredOffers.length} offre{filteredOffers.length > 1 ? 's' : ''} trouvée{filteredOffers.length > 1 ? 's' : ''} 
                {" • "}
                Classement par score MIRADOR (Prix 50%, Couverture 25%, Service 25%)
              </p>
            </div>

            <OffersGrid
              offers={filteredOffers}
              onTarifFerme={handleTarifFerme}
              onVoirDetail={handleVoirDetail}
              onVoirDocuments={setSelectedOfferForDocuments}
            />
          </main>
        </div>
      </div>

      {/* Sheet - Données Produit (Étape 3 - Tarif ferme) */}
      {selectedOfferForSheet && (
        <ProductDataSheet
          offer={selectedOfferForSheet}
          insuranceType={selectedType}
          onClose={() => setSelectedOfferForSheet(null)}
          onQuoteCalculated={handleQuoteCalculated}
          onSubscribe={handleSubscribe}
          firmQuote={firmQuote || undefined}
        />
      )}

      {/* Modal - Flow de souscription (Étape 4) */}
      {showSubscriptionFlow && selectedOfferForSubscription && firmQuote && (
        <SubscriptionFlow
          offer={selectedOfferForSubscription}
          firmQuote={firmQuote}
          subscriptionState={{
            currentStep: 4,
            selectedOfferId: selectedOfferForSubscription.id,
            insuranceType: selectedType,
            quoteInput: quoteInput || { insuranceType: selectedType, timestamp: new Date().toISOString() },
            firmQuote,
            identity: undefined,
            contact: undefined,
            banking: undefined,
            documents: undefined,
            kyc: undefined,
            consents: undefined,
            signature: undefined
          }}
          onUpdateState={() => {}}
          onComplete={handleSubscriptionComplete}
          onClose={() => {
            setShowSubscriptionFlow(false);
            setSelectedOfferForSubscription(null);
          }}
        />
      )}

      {/* Dialog - Détail de l'offre */}
      {selectedOfferForDetailConverted && (
        <Dialog 
          open={selectedOfferForDetail !== null} 
          onOpenChange={(open) => !open && setSelectedOfferForDetail(null)}
        >
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
            <VisuallyHidden>
              <DialogTitle>
                Détail de l'offre {selectedOfferForDetailConverted.insurer} - {selectedOfferForDetailConverted.product}
              </DialogTitle>
              <DialogDescription>
                Consultez les détails complets de l'offre d'assurance incluant les garanties, exclusions, documents et tarifs.
              </DialogDescription>
            </VisuallyHidden>
            <div className="p-6">
              <OfferDetail 
                offer={selectedOfferForDetailConverted}
                onBack={() => setSelectedOfferForDetail(null)}
                onSubscribe={(offerId) => {
                  setSelectedOfferForDetail(null);
                  const offer = offersFull.find(o => o.id === offerId);
                  if (offer) handleTarifFerme(offer);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog - Synthèse IA des documents */}
      <ProductDocumentSynthesis
        offer={selectedOfferForDocuments}
        isOpen={selectedOfferForDocuments !== null}
        onClose={() => setSelectedOfferForDocuments(null)}
      />

      {/* Bandeau de transparence fixe en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111827] text-white py-2 px-6 text-xs z-40">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <p>
            <span className="font-semibold">Méthodologie de classement :</span> Score MIRADOR calculé sur Prix (50%), Couverture (25%), Service/NPS (25%) • 
            <a href="#" className="underline ml-2 hover:text-[#10B981]">En savoir plus</a>
          </p>
          <p className="text-[#6B7280]">MIRADOR - L'assurance à la portée de tous</p>
        </div>
      </div>
    </div>
  );
}