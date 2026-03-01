import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Sparkles, RefreshCw, TrendingUp, Filter, SlidersHorizontal, Clock, Star, ArrowRight, X, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { FilterPanels } from "./filters/FilterPanels";
import { ComparateurHistory, saveComparison, type ComparisonHistory } from "./ComparateurHistory";
import { ComparaisonDetaillee } from "./ComparaisonDetaillee";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { offers } from "../data/offers";
import type { FilterState, UserType } from "../types";

interface ComparateurAdvancedProps {
  onSubscribe: (offerId: number) => void;
  userType: UserType;
  initialProduct?: string;
  onUserTypeChange?: (type: UserType) => void;
}

const productLabels = {
  auto: "🚗 Assurance Auto",
  habitation: "🏠 Assurance Habitation", 
  sante: "🏥 Assurance Santé",
  vie: "💰 Assurance Vie",
  per: "📊 PER Individuel",
  "per-individuel": "📊 PER Individuel",
  prevoyance: "🛡️ Assurance Prévoyance"
};

const productSuggestions = [
  "Auto jeune conducteur, assistance 0 km",
  "Habitation T3 Paris, franchise max 200€", 
  "Santé famille, téléconsultation incluse",
  "Vie épargne, fonds euros sécurisé",
  "PER individuel, gestion pilotée"
];

// Fonction utilitaire pour accéder de manière sécurisée aux propriétés des offres
function getOfferProperty(offer: any, key: string): any {
  if (!offer || typeof offer !== 'object') return undefined;
  
  // Gestion des propriétés imbriquées
  if (key.includes('.')) {
    const keys = key.split('.');
    let value = offer;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return undefined;
    }
    return value;
  }
  
  return offer[key];
}

// Fonction pour vérifier si une valeur correspond à un filtre
function matchesFilter(offerValue: any, filterValue: any): boolean {
  if (filterValue === undefined || filterValue === null || filterValue === '') {
    return true;
  }

  // Gestion des filtres de range (min/max)
  if (Array.isArray(filterValue) && filterValue.length === 2) {
    const [min, max] = filterValue;
    if (typeof offerValue === 'number') {
      return offerValue >= min && offerValue <= max;
    }
    return false;
  }

  // Gestion des filtres array (sélection multiple)
  if (Array.isArray(filterValue)) {
    if (Array.isArray(offerValue)) {
      return filterValue.some(v => offerValue.includes(v));
    } else {
      return filterValue.includes(offerValue);
    }
  }

  // Gestion des filtres simples
  return offerValue === filterValue;
}

// Fonction d'analyse IA pour extraire des filtres du prompt
function analyzePromptForFilters(prompt: string, userType: UserType): { 
  detectedProduct: string | null, 
  detectedUserType: UserType | null, 
  suggestedFilters: FilterState 
} {
  const lowerPrompt = prompt.toLowerCase();
  
  // Détection du type d'utilisateur
  let detectedUserType: UserType | null = null;
  if (lowerPrompt.includes('pro') || lowerPrompt.includes('entreprise') || lowerPrompt.includes('société')) {
    detectedUserType = 'professionnel';
  } else if (lowerPrompt.includes('particulier') || lowerPrompt.includes('personnel')) {
    detectedUserType = 'particulier';
  }
  
  // Détection du produit
  let detectedProduct: string | null = null;
  if (lowerPrompt.includes('auto') || lowerPrompt.includes('voiture') || lowerPrompt.includes('véhicule')) {
    detectedProduct = 'auto';
  } else if (lowerPrompt.includes('habitation') || lowerPrompt.includes('logement') || lowerPrompt.includes('maison') || lowerPrompt.includes('appartement')) {
    detectedProduct = 'habitation';
  } else if (lowerPrompt.includes('santé') || lowerPrompt.includes('mutuelle') || lowerPrompt.includes('médical')) {
    detectedProduct = 'sante';
  } else if (lowerPrompt.includes('vie') && (lowerPrompt.includes('assurance') || lowerPrompt.includes('épargne'))) {
    detectedProduct = 'vie';
  } else if (lowerPrompt.includes('per') || lowerPrompt.includes('retraite')) {
    detectedProduct = 'per';
  }
  
  // Extraction des filtres basés sur le contenu
  const suggestedFilters: FilterState = {};
  
  // Détection de prix/budget
  const priceMatches = lowerPrompt.match(/(\d+)\s*€|budget\s*(\d+)|maximum\s*(\d+)|max\s*(\d+)/g);
  if (priceMatches) {
    const prices = priceMatches.map(match => parseInt(match.replace(/\D/g, ''))).filter(p => p > 0);
    if (prices.length > 0) {
      const maxPrice = Math.max(...prices);
      suggestedFilters.priceRange = [0, maxPrice];
    }
  }
  
  // Détection de franchise
  const franchiseMatches = lowerPrompt.match(/franchise\s*(\d+)|franchise\s*max\s*(\d+)/g);
  if (franchiseMatches) {
    const franchises = franchiseMatches.map(match => parseInt(match.replace(/\D/g, ''))).filter(f => f > 0);
    if (franchises.length > 0) {
      suggestedFilters.franchiseMax = Math.max(...franchises);
    }
  }
  
  // Détection spécifique auto
  if (detectedProduct === 'auto') {
    if (lowerPrompt.includes('jeune conducteur') || lowerPrompt.includes('jeune')) {
      suggestedFilters.driverProfile = 'young';
    }
    if (lowerPrompt.includes('assistance') || lowerPrompt.includes('dépannage')) {
      suggestedFilters.hasAssistance = true;
    }
    if (lowerPrompt.includes('tous risques')) {
      suggestedFilters.coverage = 'comprehensive';
    }
    if (lowerPrompt.includes('0 km') || lowerPrompt.includes('0km')) {
      suggestedFilters.assistanceKm = 0;
    }
  }
  
  // Détection spécifique habitation
  if (detectedProduct === 'habitation') {
    if (lowerPrompt.includes('t2') || lowerPrompt.includes('t3') || lowerPrompt.includes('t4')) {
      const roomMatch = lowerPrompt.match(/t(\d)/);
      if (roomMatch) {
        suggestedFilters.roomCount = parseInt(roomMatch[1]);
      }
    }
    if (lowerPrompt.includes('paris') || lowerPrompt.includes('île-de-france')) {
      suggestedFilters.location = 'paris';
    }
  }
  
  // Détection spécifique santé
  if (detectedProduct === 'sante') {
    if (lowerPrompt.includes('famille')) {
      suggestedFilters.coverageType = 'family';
    }
    if (lowerPrompt.includes('téléconsultation') || lowerPrompt.includes('teleconsultation')) {
      suggestedFilters.teleconsultation = true;
    }
    if (lowerPrompt.includes('optique') || lowerPrompt.includes('dentaire')) {
      suggestedFilters.opticalDental = true;
    }
  }
  
  return { detectedProduct, detectedUserType, suggestedFilters };
}

export function ComparateurAdvanced({ 
  onSubscribe, 
  userType, 
  initialProduct = "auto",
  onUserTypeChange 
}: ComparateurAdvancedProps) {
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [filters, setFilters] = useState<FilterState>({});
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAiAnalysis, setShowAiAnalysis] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string>("");
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Filtrer les offres selon les critères avec gestion d'erreur sécurisée
  const filteredOffers = useMemo(() => {
    try {
      if (!Array.isArray(offers)) {
        console.warn("Offers data is not an array");
        return [];
      }

      const result = offers.filter(offer => {
        // Vérification de base de l'offre
        if (!offer || typeof offer !== 'object') {
          return false;
        }

        // Filtrer par segment utilisateur et produit
        const offerSegment = getOfferProperty(offer, 'segment');
        const offerType = getOfferProperty(offer, 'type');
        
        if (offerSegment !== userType || offerType !== selectedProduct) {
          return false;
        }

        // Appliquer les filtres spécifiques seulement s'il y en a
        if (Object.keys(filters).length === 0) {
          return true; // Pas de filtres = on montre tout
        }

        // Vérifier chaque filtre
        for (const [key, value] of Object.entries(filters)) {
          // Gestion spéciale pour priceRange
          if (key === 'priceRange' && Array.isArray(value) && value.length === 2) {
            const [min, max] = value;
            if (offer.price < min || offer.price > max) {
              return false;
            }
            continue;
          }

          // Gestion spéciale pour franchiseMax
          if (key === 'franchiseMax' && Array.isArray(value) && value.length === 2) {
            const [min, max] = value;
            if (offer.franchise < min || offer.franchise > max) {
              return false;
            }
            continue;
          }

          // Filtres spécifiques Auto
          if (offer.autoData) {
            if (key === 'hasAssistance' && value === true) {
              if (offer.autoData.assistanceKm === undefined) {
                return false;
              }
              continue;
            }
            if (key === 'assistanceKm' && value !== undefined) {
              if (offer.autoData.assistanceKm !== value) {
                return false;
              }
              continue;
            }
            if (key === 'coverage' && value !== undefined) {
              if (offer.coverage.toLowerCase() !== value.toLowerCase() && 
                  !offer.coverage.toLowerCase().includes(value.toLowerCase())) {
                return false;
              }
              continue;
            }
          }

          // Filtres spécifiques Santé
          if (offer.santeData) {
            if (key === 'teleconsultation' && value === true) {
              if (!offer.santeData.teleconsultation) {
                return false;
              }
              continue;
            }
            if (key === 'opticalDental' && value === true) {
              if (!offer.santeData.optiqueDentaire || offer.santeData.optiqueDentaire < 100) {
                return false;
              }
              continue;
            }
          }

          // Filtres spécifiques Vie
          if (offer.vieData) {
            if (key === 'investmentAmount' && Array.isArray(value) && value.length === 2) {
              const [min, max] = value;
              if (offer.vieData.versementMin < min || offer.vieData.versementMin > max) {
                return false;
              }
              continue;
            }
            if (key === 'managementType') {
              if (value === 'euro_fund' && !offer.vieData.fondsEuros) {
                return false;
              }
              if (value === 'units' && !offer.vieData.unitesCompte) {
                return false;
              }
              continue;
            }
          }

          // Pour les autres filtres, essayer la méthode générique
          const offerValue = getOfferProperty(offer, key);
          if (!matchesFilter(offerValue, value)) {
            return false;
          }
        }

        return true;
      });
      
      return result;
    } catch (error) {
      console.error("Error filtering offers:", error);
      return [];
    }
  }, [userType, selectedProduct, filters]);

  // Trier les offres par score avec gestion d'erreur
  const sortedOffers = useMemo(() => {
    try {
      return [...filteredOffers].sort((a, b) => {
        const scoreA = getOfferProperty(a, 'score') || 0;
        const scoreB = getOfferProperty(b, 'score') || 0;
        return scoreB - scoreA;
      });
    } catch (error) {
      console.error("Error sorting offers:", error);
      return filteredOffers;
    }
  }, [filteredOffers]);

  const handleProductChange = useCallback((product: string) => {
    setSelectedProduct(product);
    setFilters({});
    setHasSearched(true);
    setShowAiAnalysis(false);
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleAiPromptSubmit = useCallback(async () => {
    if (!aiPrompt.trim()) return;
    
    setShowAiAnalysis(true);
    setIsLoading(true);
    
    try {
      // Simulation d'analyse IA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Analyser le prompt pour extraire des filtres
      const analysisResult = analyzePromptForFilters(aiPrompt, userType);
      
      // Appliquer les changements détectés
      if (analysisResult.detectedUserType && analysisResult.detectedUserType !== userType && onUserTypeChange) {
        onUserTypeChange(analysisResult.detectedUserType);
      }
      
      if (analysisResult.detectedProduct && analysisResult.detectedProduct !== selectedProduct) {
        setSelectedProduct(analysisResult.detectedProduct);
      }
      
      // Appliquer les filtres suggérés
      if (Object.keys(analysisResult.suggestedFilters).length > 0) {
        setFilters(analysisResult.suggestedFilters);
        setShowFilters(true);
      }
      
      // Générer un message d'analyse
      let analysisMessage = "🤖 Analyse IA terminée : ";
      const changes = [];
      
      if (analysisResult.detectedProduct) {
        changes.push(`produit détecté (${productLabels[analysisResult.detectedProduct as keyof typeof productLabels]})`);
      }
      if (analysisResult.detectedUserType) {
        changes.push(`profil détecté (${analysisResult.detectedUserType})`);
      }
      if (Object.keys(analysisResult.suggestedFilters).length > 0) {
        changes.push(`${Object.keys(analysisResult.suggestedFilters).length} filtres appliqués`);
      }
      
      if (changes.length > 0) {
        analysisMessage += changes.join(", ");
      } else {
        analysisMessage += "recherche effectuée";
      }
      
      setAiAnalysisResult(analysisMessage);
      setHasSearched(true);

      // Sauvegarder automatiquement la comparaison
      const bestOffer = sortedOffers.length > 0 ? {
        insurer: getOfferProperty(sortedOffers[0], 'insurer') || 'Inconnu',
        price: getOfferProperty(sortedOffers[0], 'price') || 0,
        score: getOfferProperty(sortedOffers[0], 'score') || 0
      } : undefined;

      saveComparison(
        userType,
        selectedProduct,
        analysisResult.suggestedFilters,
        sortedOffers.length,
        bestOffer
      );
    } catch (error) {
      console.error("Error during AI analysis:", error);
      setAiAnalysisResult("❌ Erreur lors de l'analyse IA");
    } finally {
      setIsLoading(false);
    }
  }, [aiPrompt, userType, selectedProduct, onUserTypeChange, sortedOffers]);

  const handleRestoreComparison = useCallback((history: ComparisonHistory) => {
    try {
      // Restaurer tous les paramètres de la comparaison
      if (history.userType !== userType && onUserTypeChange) {
        onUserTypeChange(history.userType);
      }
      
      setSelectedProduct(history.product);
      setFilters(history.filters || {});
      setHasSearched(true);
      setShowFilters(Object.keys(history.filters || {}).length > 0);
    } catch (error) {
      console.error("Error restoring comparison:", error);
    }
  }, [userType, onUserTypeChange]);

  const rotateSuggestion = useCallback(() => {
    setSuggestionIndex((prev) => (prev + 1) % productSuggestions.length);
  }, []);

  // Afficher les résultats par défaut dès le démarrage
  useEffect(() => {
    setHasSearched(true);
  }, [selectedProduct, userType]);

  const productOptions = userType === 'particulier' 
    ? ['auto', 'habitation', 'sante', 'vie', 'per-individuel', 'prevoyance']
    : ['rc-pro', 'multirisque-pro', 'flotte-auto', 'sante-collective'];

  // Composant Sidebar pour les filtres
  const FilterSidebar = ({ className = "" }: { className?: string }) => (
    <div className={`space-y-4 ${className}`}>
      {/* Header des filtres */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-4 w-4" />
          <h3 className="font-medium">Filtres</h3>
          {Object.keys(filters).length > 0 && (
            <Badge className="bg-primary/10 text-primary text-xs">
              {Object.keys(filters).length}
            </Badge>
          )}
        </div>
        {!sidebarCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(true)}
            className="lg:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Sélection produit compacte */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Produit</label>
        <div className="grid grid-cols-1 gap-2">
          {productOptions.map((product) => (
            <Button
              key={product}
              variant={selectedProduct === product ? "default" : "outline"}
              onClick={() => handleProductChange(product)}
              className="h-8 justify-start text-xs"
              size="sm"
            >
              {productLabels[product as keyof typeof productLabels] || product}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Filtres avancés */}
      <div className="space-y-4">
        <FilterPanels
          segment={userType}
          product={selectedProduct}
          onFiltersChange={handleFiltersChange}
          resultsCount={sortedOffers.length}
          initialFilters={filters}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {/* Layout principal avec sidebar */}
      <div className="flex gap-6 w-full">
        {/* Sidebar desktop - Filtres à gauche */}
        <div className={`hidden lg:block transition-all duration-300 shrink-0 ${
          sidebarCollapsed ? 'w-12' : 'w-80'
        }`}>
          <div className="sticky top-4">
            {sidebarCollapsed ? (
              <Card className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(false)}
                  className="w-full"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Card>
            ) : (
              <Card className="p-4 max-h-[85vh] overflow-y-auto">
                <FilterSidebar />
              </Card>
            )}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Header avec IA - Plus compact */}
          <Card className="bg-gradient-to-r from-primary/5 to-blue/5 border-primary/20">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold">
                      Comparateur MIRADOR
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      IA • {sortedOffers.length} offres {userType}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Bouton filtres mobile */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="lg:hidden">
                          <Menu className="h-4 w-4 mr-2" />
                          Filtres
                          {Object.keys(filters).length > 0 && (
                            <Badge className="ml-2 bg-primary/10 text-primary text-xs">
                              {Object.keys(filters).length}
                            </Badge>
                          )}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80 p-4">
                        <SheetHeader>
                          <SheetTitle>Filtres de recherche</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4">
                          <FilterSidebar />
                        </div>
                      </SheetContent>
                    </Sheet>

                    <ComparateurHistory 
                      onRestoreComparison={handleRestoreComparison}
                      className="shrink-0"
                    />
                  </div>
                </div>
                
                {/* Prompt IA - Plus compact */}
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <Sparkles className="absolute left-3 top-3 h-4 w-4 text-primary" />
                      <Input
                        placeholder={productSuggestions[suggestionIndex]}
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="pl-10"
                        onKeyPress={(e) => e.key === 'Enter' && handleAiPromptSubmit()}
                      />
                    </div>
                    <Button 
                      onClick={handleAiPromptSubmit}
                      disabled={!aiPrompt.trim() || isLoading}
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Suggestions compactes */}
                  <div className="flex flex-wrap gap-1">
                    {productSuggestions.slice(0, 2).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs px-2"
                        onClick={() => setAiPrompt(suggestion)}
                      >
                        {suggestion.slice(0, 25)}...
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs px-2"
                      onClick={rotateSuggestion}
                    >
                      + Plus
                    </Button>
                  </div>

                  {showAiAnalysis && aiAnalysisResult && (
                    <Alert className="bg-green-50 border-green-200">
                      <Sparkles className="h-4 w-4" />
                      <AlertDescription className="text-green-800 text-sm">
                        {aiAnalysisResult}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Résultats - Affichage direct après IA */}
          {hasSearched && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Résultats instantanés
                </h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {sortedOffers.length} offres
                  </Badge>
                  {sortedOffers.length > 0 && (
                    <Badge className="bg-green-100 text-green-800">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trié par pertinence
                    </Badge>
                  )}
                </div>
              </div>

              {sortedOffers.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="font-medium mb-2">Aucune offre disponible</h3>
                      <p className="text-sm">
                        Aucune offre ne correspond à vos critères pour le produit "{selectedProduct}" en tant que {userType}
                      </p>
                      <div className="mt-4">
                        <Button variant="outline" onClick={() => setFilters({})}>
                          Réinitialiser les filtres
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <ComparaisonDetaillee 
                  offers={sortedOffers} 
                  onSubscribe={onSubscribe}
                  userType={userType}
                  product={selectedProduct}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}