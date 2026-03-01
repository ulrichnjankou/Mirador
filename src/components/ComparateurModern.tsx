import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, Shield, Star, Eye, ArrowRight, TrendingUp, RefreshCw } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { VisuallyHidden } from "./ui/visually-hidden";
import { DefinitionTooltip } from "./DefinitionTooltip";
import { enrichedOffers, type EnrichedOffer } from "../data/enrichedOffers";
import { offers } from "../data/offers";
import { OfferDetail } from "./OfferDetail";
import type { UserType } from "../types";

interface ComparateurModernProps {
  onSubscribe: (offerId: number) => void;
  userType: UserType;
  initialProduct?: string;
  onUserTypeChange?: (type: UserType) => void;
}

// Garanties avec icônes et tooltips
const guaranteeIcons: { [key: string]: string } = {
  "Assistance 0km": "🚗",
  "Protection juridique": "⚖️",
  "Tous risques": "🛡️",
  "Vol/incendie": "🔒",
  "Vol et vandalisme": "🔒",
  "Véhicule de remplacement": "🚙",
  "Dégâts des eaux": "💧",
  "Incendie": "🔥",
  "Responsabilité civile": "👥",
  "Catastrophes naturelles": "🌪️",
  "Hospitalisation": "🏥",
  "Optique": "👓",
  "Dentaire": "🦷",
  "Téléconsultation": "💻",
  "Fonds euros": "💰",
  "Capital décès": "🛡️"
};

export function ComparateurModern({ 
  onSubscribe, 
  userType, 
  initialProduct = "auto",
  onUserTypeChange 
}: ComparateurModernProps) {
  // États des filtres
  const [selectedType, setSelectedType] = useState<string>(initialProduct);
  const [maxBudget, setMaxBudget] = useState<number>(2000);
  const [maxFranchise, setMaxFranchise] = useState<number>(500);
  const [minScore, setMinScore] = useState<number>(70);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // État pour le détail d'offre
  const [selectedOfferForDetail, setSelectedOfferForDetail] = useState<number | null>(null);

  // Filtrage des offres
  const filteredOffers = useMemo(() => {
    let filtered = enrichedOffers.filter(offer => {
      // Filtre par segment utilisateur
      if (offer.segment !== userType) return false;
      
      // Filtre par type d'assurance
      if (selectedType !== "all" && offer.insuranceType !== selectedType) return false;
      
      // Filtre par budget
      if (offer.annualPrice > maxBudget) return false;
      
      // Filtre par franchise
      if (offer.franchise > maxFranchise) return false;
      
      // Filtre par score minimum
      if (offer.miradorScore < minScore) return false;
      
      // Filtre par recherche textuelle
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          offer.insurer.toLowerCase().includes(query) ||
          offer.offerName.toLowerCase().includes(query) ||
          offer.guaranteeCategories.some(g => g.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
    
    // Tri par score décroissant
    return filtered.sort((a, b) => b.miradorScore - a.miradorScore);
  }, [userType, selectedType, maxBudget, maxFranchise, minScore, searchQuery]);

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSelectedType(initialProduct);
    setMaxBudget(2000);
    setMaxFranchise(500);
    setMinScore(70);
    setSearchQuery("");
  };

  // Couleur du score
  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-[#10B981]";
    if (score >= 70) return "bg-[#2563EB]";
    return "bg-[#6B7280]";
  };

  // Trouver l'offre complète depuis les données d'offres originales
  const selectedOffer = selectedOfferForDetail 
    ? offers.find(o => o.id === selectedOfferForDetail)
    : null;

  return (
    <>
      <div className="flex gap-6">
        {/* Sidebar Filtres - 20-25% largeur */}
        <aside className="w-[280px] flex-shrink-0">
          <Card className="sticky top-24 bg-[#F9FAFB] border-[#E5E7EB]">
            <CardContent className="p-6 space-y-6">
              {/* En-tête filtres */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="h-5 w-5 text-[#2563EB]" />
                  <h3 className="text-[#111827]">Filtres</h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={resetFilters}
                  className="h-8 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Réinitialiser
                </Button>
              </div>

              <Separator />

              {/* Type d'assurance */}
              <div className="space-y-3">
                <Label className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-[#2563EB]" />
                  <span>Type d'assurance</span>
                </Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-white border-[#E5E7EB]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="auto">🚗 Auto</SelectItem>
                    <SelectItem value="habitation">🏠 Habitation</SelectItem>
                    <SelectItem value="sante">🏥 Santé</SelectItem>
                    <SelectItem value="vie">💰 Vie & Épargne</SelectItem>
                    <SelectItem value="prevoyance">🛡️ Prévoyance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Budget annuel max */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center space-x-2">
                    <span>Budget annuel max</span>
                    <DefinitionTooltip term="Budget annuel" />
                  </Label>
                  <span className="text-sm text-[#2563EB]">{maxBudget}€</span>
                </div>
                <Slider
                  value={[maxBudget]}
                  onValueChange={(val) => setMaxBudget(val[0])}
                  min={200}
                  max={3000}
                  step={50}
                  className="[&>span]:bg-[#2563EB]"
                />
                <div className="flex justify-between text-xs text-[#6B7280]">
                  <span>200€</span>
                  <span>3000€</span>
                </div>
              </div>

              {/* Franchise max */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center space-x-2">
                    <span>Franchise max</span>
                    <DefinitionTooltip term="Franchise" />
                  </Label>
                  <span className="text-sm text-[#2563EB]">{maxFranchise}€</span>
                </div>
                <Slider
                  value={[maxFranchise]}
                  onValueChange={(val) => setMaxFranchise(val[0])}
                  min={0}
                  max={1000}
                  step={50}
                  className="[&>span]:bg-[#2563EB]"
                />
                <div className="flex justify-between text-xs text-[#6B7280]">
                  <span>0€</span>
                  <span>1000€</span>
                </div>
              </div>

              {/* Score MIRADOR minimum */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center space-x-2">
                    <span>Score minimum</span>
                    <DefinitionTooltip term="Score MIRADOR" />
                  </Label>
                  <span className="text-sm text-[#2563EB]">{minScore}/100</span>
                </div>
                <Slider
                  value={[minScore]}
                  onValueChange={(val) => setMinScore(val[0])}
                  min={50}
                  max={100}
                  step={5}
                  className="[&>span]:bg-[#10B981]"
                />
                <div className="flex justify-between text-xs text-[#6B7280]">
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              <Separator />

              {/* Bouton Appliquer */}
              <Button 
                className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                size="lg"
              >
                Appliquer les filtres
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Zone principale des résultats */}
        <main className="flex-1">
          {/* Barre de recherche et en-tête */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl text-[#111827]">Résultats instantanés</h2>
                <p className="text-sm text-[#6B7280]">
                  Classement par pertinence selon vos critères • {filteredOffers.length} offre{filteredOffers.length > 1 ? 's' : ''} trouvée{filteredOffers.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                type="text"
                placeholder="Rechercher par assureur, garantie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white border-[#E5E7EB] focus:border-[#2563EB]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-[#6B7280] hover:text-[#111827]" />
                </button>
              )}
            </div>
          </div>

          {/* Grille de résultats - 3 colonnes */}
          {filteredOffers.length === 0 ? (
            <Card className="border-2 border-dashed border-[#E5E7EB] bg-[#F9FAFB]">
              <CardContent className="p-12 text-center">
                <Shield className="h-16 w-16 text-[#6B7280] mx-auto mb-4" />
                <h3 className="text-[#111827] mb-2">Aucune offre trouvée</h3>
                <p className="text-sm text-[#6B7280] mb-4">
                  Essayez d'ajuster vos filtres pour voir plus de résultats
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  Réinitialiser les filtres
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => (
                <OfferCardModern
                  key={offer.id}
                  offer={offer}
                  onSubscribe={onSubscribe}
                  getScoreColor={getScoreColor}
                  setSelectedOfferForDetail={setSelectedOfferForDetail}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Dialog pour le détail de l'offre */}
      {selectedOffer && (
        <Dialog open={selectedOfferForDetail !== null} onOpenChange={(open) => !open && setSelectedOfferForDetail(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
            <VisuallyHidden>
              <DialogHeader>
                <DialogTitle>
                  Détail de l'offre {selectedOffer.insurer} - {selectedOffer.product}
                </DialogTitle>
                <DialogDescription>
                  Consultez les détails complets de l'offre d'assurance incluant les garanties, exclusions, documents et tarifs.
                </DialogDescription>
              </DialogHeader>
            </VisuallyHidden>
            <div className="p-6">
              <OfferDetail 
                offer={selectedOffer}
                onBack={() => setSelectedOfferForDetail(null)}
                onSubscribe={(offerId) => {
                  setSelectedOfferForDetail(null);
                  onSubscribe(offerId);
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Composant carte d'offre moderne
function OfferCardModern({ 
  offer, 
  onSubscribe,
  getScoreColor,
  setSelectedOfferForDetail
}: { 
  offer: EnrichedOffer; 
  onSubscribe: (id: number) => void;
  getScoreColor: (score: number) => string;
  setSelectedOfferForDetail: (id: number | null) => void;
}) {
  return (
    <Card className="bg-white border-[#E5E7EB] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl">
      <CardContent className="p-6 space-y-4">
        {/* En-tête avec logo et badges */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-[#2563EB]" />
              </div>
              <div>
                <h3 className="text-[#111827]">{offer.insurer}</h3>
                <p className="text-sm text-[#6B7280]">{offer.offerName}</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          {offer.badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {offer.badges.map((badge, idx) => (
                <Badge 
                  key={idx}
                  variant={badge.includes("Meilleure") ? "default" : "outline"}
                  className={badge.includes("Meilleure") ? "bg-[#10B981] text-white" : ""}
                >
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Prix */}
        <div className="text-center py-3 bg-[#F9FAFB] rounded-lg">
          <div className="text-3xl text-[#2563EB]">
            {offer.annualPrice}€
          </div>
          <p className="text-xs text-[#6B7280] mt-1">
            {offer.monthlyPrice.toFixed(2)}€/mois • Franchise: {offer.franchise}€
          </p>
        </div>

        {/* Score MIRADOR */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-[#2563EB]" />
              <span className="text-sm text-[#111827]">Score MIRADOR</span>
            </div>
            <span className="text-[#111827]">{offer.miradorScore}/100</span>
          </div>
          <Progress 
            value={offer.miradorScore} 
            className={`h-2 [&>div]:${getScoreColor(offer.miradorScore)}`}
          />
        </div>

        <Separator />

        {/* Garanties principales */}
        <div className="space-y-2">
          <p className="text-sm text-[#111827]">Garanties principales</p>
          <div className="grid grid-cols-2 gap-2">
            {offer.mainGuarantees.slice(0, 4).map((guarantee, idx) => {
              const icon = guaranteeIcons[guarantee] || "✓";
              return (
                <div key={idx} className="flex items-start space-x-2 text-xs text-[#6B7280]">
                  <span className="flex-shrink-0">{icon}</span>
                  <span className="leading-tight">{guarantee}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-2 pt-2">
          <Button 
            variant="outline"
            className="w-full border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB]/5"
            onClick={() => setSelectedOfferForDetail(offer.id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Voir le détail
          </Button>
          
          <Button 
            onClick={() => onSubscribe(offer.id)}
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
          >
            Souscrire cette offre
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* NPS */}
        <div className="flex items-center justify-center space-x-2 text-xs text-[#6B7280] pt-2 border-t border-[#E5E7EB]">
          <TrendingUp className="h-3 w-3" />
          <span>Satisfaction client: {offer.nps}/100 NPS</span>
        </div>
      </CardContent>
    </Card>
  );
}