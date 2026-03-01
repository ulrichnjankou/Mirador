import { useState } from "react";
import { Search, Sparkles, Star, Info, FileText, TrendingDown, Zap, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { ComparaisonDetaillee } from "./ComparaisonDetaillee";
import { DocumentModal } from "./DocumentModal";
import { PourquoiModal } from "./PourquoiModal";

interface Offer {
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
}

const mockOffers: Offer[] = [
  {
    id: 1,
    insurer: "AXA",
    product: "Auto Essentiel",
    price: 480,
    monthlyPrice: 40,
    score: 95,
    coverage: "Complète",
    franchise: 300,
    rating: 4.2,
    badges: ["IPID", "CG"],
    strengths: ["Prix compétitif", "Couverture étendue", "Service client"],
    type: "auto"
  },
  {
    id: 2,
    insurer: "Groupama",
    product: "Auto Serenité",
    price: 520,
    monthlyPrice: 43,
    score: 88,
    coverage: "Premium",
    franchise: 250,
    rating: 4.0,
    badges: ["IPID", "CG"],
    strengths: ["Franchise réduite", "Assistance 24h/7j", "Réseau partenaires"],
    type: "auto"
  },
  {
    id: 3,
    insurer: "MAIF",
    product: "Auto Tranquillité",
    price: 495,
    monthlyPrice: 41,
    score: 92,
    coverage: "Complète",
    franchise: 350,
    rating: 4.5,
    badges: ["IPID", "CG"],
    strengths: ["Excellent service", "Gestion sinistre rapide", "Mutuelle"],
    type: "auto"
  },
  {
    id: 4,
    insurer: "Allianz",
    product: "Auto Premium",
    price: 550,
    monthlyPrice: 46,
    score: 85,
    coverage: "Haut de gamme",
    franchise: 200,
    rating: 4.1,
    badges: ["IPID", "CG"],
    strengths: ["Garanties étendues", "Service premium", "Véhicule de remplacement"],
    type: "auto"
  },
  {
    id: 5,
    insurer: "Generali",
    product: "Auto Confort",
    price: 510,
    monthlyPrice: 43,
    score: 87,
    coverage: "Complète",
    franchise: 280,
    rating: 4.3,
    badges: ["IPID", "CG"],
    strengths: ["Bon rapport qualité-prix", "Réseau expert", "Application mobile"],
    type: "auto"
  },
  {
    id: 6,
    insurer: "Harmonie Mutuelle",
    product: "Habitation Sécurité",
    price: 380,
    monthlyPrice: 32,
    score: 89,
    coverage: "Complète",
    franchise: 200,
    rating: 4.1,
    badges: ["IPID", "CG"],
    strengths: ["Prix attractif", "Couverture étendue", "Service rapide"],
    type: "habitation"
  },
  {
    id: 7,
    insurer: "Matmut",
    product: "Santé Plus",
    price: 840,
    monthlyPrice: 70,
    score: 91,
    coverage: "Intégrale",
    franchise: 0,
    rating: 4.4,
    badges: ["IPID", "CG"],
    strengths: ["Remboursement 200%", "Réseau de soins", "Téléconsultation"],
    type: "sante"
  },
  {
    id: 8,
    insurer: "CNP Assurances",
    product: "Vie Excellence",
    price: 120,
    monthlyPrice: 10,
    score: 87,
    coverage: "Fonds euros + UC",
    franchise: 0,
    rating: 4.3,
    badges: ["IPID", "CG"],
    strengths: ["Rendement attractif", "Gestion pilotée", "Succession optimisée"],
    type: "vie"
  }
];

const marketAverages = {
  auto: 650,
  habitation: 450,
  sante: 1200,
  vie: 200
};

interface ComparateurProps {
  onSubscribe?: (offerId: number) => void;
}

export function Comparateur({ onSubscribe }: ComparateurProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOffers, setSelectedOffers] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("tous");
  const [showComparison, setShowComparison] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [showAllOffers, setShowAllOffers] = useState(false);
  
  const [documentModal, setDocumentModal] = useState<{
    isOpen: boolean;
    type: 'IPID' | 'CG';
    insurer: string;
    product: string;
  }>({
    isOpen: false,
    type: 'IPID',
    insurer: '',
    product: ''
  });
  
  const [pourquoiModal, setPourquoiModal] = useState<{
    isOpen: boolean;
    offer: Offer | null;
  }>({
    isOpen: false,
    offer: null
  });

  const handleOfferSelect = (offerId: number) => {
    setSelectedOffers(prev => {
      if (prev.includes(offerId)) {
        return prev.filter(id => id !== offerId);
      } else if (prev.length < 3) {
        return [...prev, offerId];
      }
      return prev;
    });
  };

  const handleAISearch = () => {
    if (!searchQuery.trim()) return;
    
    const query = searchQuery.toLowerCase();
    let detectedProduct = "tous";
    let analysisText = "";

    // Analyse IA améliorée
    if (query.includes('auto') || query.includes('voiture') || query.includes('véhicule') || query.includes('km')) {
      detectedProduct = 'auto';
      analysisText = "🚗 Besoin d'assurance auto détecté";
    } else if (query.includes('habitation') || query.includes('maison') || query.includes('logement') || query.includes('appartement')) {
      detectedProduct = 'habitation';
      analysisText = "🏠 Besoin d'assurance habitation détecté";
    } else if (query.includes('santé') || query.includes('mutuelle') || query.includes('médecin') || query.includes('dentaire')) {
      detectedProduct = 'sante';
      analysisText = "🏥 Besoin d'assurance santé détecté";
    } else if (query.includes('vie') || query.includes('épargne') || query.includes('succession') || query.includes('placement')) {
      detectedProduct = 'vie';
      analysisText = "💰 Besoin d'assurance vie détecté";
    } else {
      analysisText = "🤖 Analyse en cours... Précisez votre besoin pour un meilleur ciblage";
    }

    setSelectedProduct(detectedProduct);
    setAiAnalysisResult(analysisText);
    
    // Effacer l'analyse après 5 secondes
    setTimeout(() => setAiAnalysisResult(null), 5000);
  };

  const handleSubscribe = (offerId: number) => {
    const offer = mockOffers.find(o => o.id === offerId);
    if (offer && onSubscribe) {
      onSubscribe(offerId);
    } else {
      // Navigation directe vers signature si pas de callback
      console.log("Navigation vers signature pour l'offre:", offer);
    }
  };

  const handleShowPourquoi = (offer: Offer) => {
    setPourquoiModal({
      isOpen: true,
      offer: offer
    });
  };

  const handleDocumentClick = (type: 'IPID' | 'CG', insurer: string, product: string) => {
    setDocumentModal({
      isOpen: true,
      type,
      insurer,
      product
    });
  };

  const filteredOffers = selectedProduct === "tous" 
    ? mockOffers 
    : mockOffers.filter(offer => offer.type === selectedProduct);

  // Affichage limité : 3 premiers résultats, puis 2 autres avec le bouton "Plus d'offres"
  const displayedOffers = showAllOffers ? filteredOffers : filteredOffers.slice(0, 3);
  const additionalOffers = filteredOffers.slice(3, 5);
  const hasMoreOffers = filteredOffers.length > 3;

  // Calcul des économies moyennes
  const averageSavings = filteredOffers.length > 0 
    ? Math.round(filteredOffers.reduce((acc, offer) => {
        const marketAverage = marketAverages[offer.type as keyof typeof marketAverages] || 500;
        return acc + Math.max(0, marketAverage - offer.price);
      }, 0) / filteredOffers.length)
    : 0;

  const totalPotentialSavings = filteredOffers.reduce((acc, offer) => {
    const marketAverage = marketAverages[offer.type as keyof typeof marketAverages] || 500;
    return acc + Math.max(0, marketAverage - offer.price);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Banner économies */}
      {averageSavings > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Économies moyennes : {averageSavings}€/an
                </span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-green-600" />
                <span className="text-green-700">
                  Potentiel total : {totalPotentialSavings}€ d'économies
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Banner preuve d'efficacité */}
      <div className="bg-primary text-primary-foreground p-4 rounded-lg">
        <div className="flex items-center justify-center space-x-4 text-sm">
          <span>⚡ 60s pour comparer</span>
          <Separator orientation="vertical" className="h-4 bg-primary-foreground/20" />
          <span>📊 62% des utilisateurs trouvent mieux</span>
          <Separator orientation="vertical" className="h-4 bg-primary-foreground/20" />
          <span>🔄 Données mises à jour : {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Recherche IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Décrivez votre besoin en langage naturel</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ex: Je roule 12 000 km/an, bonus 0,5, assistance 0 km, franchise ≤ 300€"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              />
            </div>
            <Button onClick={handleAISearch} disabled={!searchQuery.trim()}>
              <Sparkles className="h-4 w-4 mr-2" />
              Analyser avec IA
            </Button>
          </div>

          {/* Résultat de l'analyse IA */}
          {aiAnalysisResult && (
            <Alert className="mb-4">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>{aiAnalysisResult}</AlertDescription>
            </Alert>
          )}

          {/* Filtre par produit */}
          <div className="mb-4">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par produit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les produits</SelectItem>
                <SelectItem value="auto">Assurance Auto</SelectItem>
                <SelectItem value="habitation">Assurance Habitation</SelectItem>
                <SelectItem value="sante">Assurance Santé</SelectItem>
                <SelectItem value="vie">Assurance Vie</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      <div className="flex items-center justify-between">
        <h2>Offres recommandées ({filteredOffers.length})</h2>
        <Badge variant="outline">Panel exhaustif - 30 assureurs</Badge>
      </div>

      {/* Affichage des 3 premiers résultats */}
      <div className="grid gap-4">
        {displayedOffers.map((offer, index) => {
          const marketAverage = marketAverages[offer.type as keyof typeof marketAverages] || 500;
          const savings = Math.max(0, marketAverage - offer.price);
          const savingsPercentage = Math.round((savings / marketAverage) * 100);

          return (
            <Card key={offer.id} className={`cursor-pointer transition-all ${selectedOffers.includes(offer.id) ? 'ring-2 ring-primary' : ''} ${index === 0 ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''}`}>
              <CardContent className="p-6">
                {index === 0 && (
                  <Badge className="mb-3 bg-yellow-400 text-yellow-900 hover:bg-yellow-500">
                    ⭐ Meilleure offre
                  </Badge>
                )}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg">{offer.insurer}</h3>
                      <Badge variant="secondary">{offer.product}</Badge>
                      {savings > 0 && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          -{savingsPercentage}% vs marché
                        </Badge>
                      )}
                      <div className="flex space-x-1">
                        {offer.badges.map((badge) => (
                          <Button
                            key={badge}
                            variant="outline"
                            size="sm"
                            className="text-xs h-6 px-2"
                            onClick={() => handleDocumentClick(
                              badge as 'IPID' | 'CG',
                              offer.insurer,
                              offer.product
                            )}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            {badge}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Prix annuel</p>
                        <p className="text-lg font-semibold text-primary">{offer.price}€</p>
                        <p className="text-sm text-muted-foreground">{offer.monthlyPrice}€/mois</p>
                        {savings > 0 && (
                          <p className="text-xs text-green-600">Économie: {savings}€</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Couverture</p>
                        <p>{offer.coverage}</p>
                        <div className="mt-1">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">RC</Badge>
                            <Badge variant="outline" className="text-xs">Vol</Badge>
                            <Badge variant="outline" className="text-xs">Incendie</Badge>
                            <Badge variant="outline" className="text-xs">Assistance</Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Franchise</p>
                        <p>{offer.franchise}€</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Note service</p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{offer.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOfferSelect(offer.id)}
                        >
                          {selectedOffers.includes(offer.id) ? 'Désélectionner' : 'Comparer'}
                        </Button>
                        <Button size="sm" onClick={() => handleSubscribe(offer.id)}>
                          Souscrire
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleShowPourquoi(offer)}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Pourquoi ?
                      </Button>
                    </div>
                  </div>
                  
                  <div className="ml-4 text-right">
                    <div className="text-2xl font-semibold text-primary">{offer.score}</div>
                    <div className="text-sm text-muted-foreground">Score global</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bouton pour afficher plus d'offres */}
      {hasMoreOffers && !showAllOffers && (
        <Card className="border-dashed border-2">
          <CardContent className="p-6 text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowAllOffers(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Voir {additionalOffers.length} offres supplémentaires</span>
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Découvrez d'autres options qui pourraient vous convenir
            </p>
          </CardContent>
        </Card>
      )}

      {/* Affichage des offres supplémentaires */}
      {showAllOffers && (
        <div className="grid gap-4">
          {additionalOffers.map((offer) => {
            const marketAverage = marketAverages[offer.type as keyof typeof marketAverages] || 500;
            const savings = Math.max(0, marketAverage - offer.price);
            const savingsPercentage = Math.round((savings / marketAverage) * 100);

            return (
              <Card key={offer.id} className={`cursor-pointer transition-all ${selectedOffers.includes(offer.id) ? 'ring-2 ring-primary' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg">{offer.insurer}</h3>
                        <Badge variant="secondary">{offer.product}</Badge>
                        {savings > 0 && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            -{savingsPercentage}% vs marché
                          </Badge>
                        )}
                        <div className="flex space-x-1">
                          {offer.badges.map((badge) => (
                            <Button
                              key={badge}
                              variant="outline"
                              size="sm"
                              className="text-xs h-6 px-2"
                              onClick={() => handleDocumentClick(
                                badge as 'IPID' | 'CG',
                                offer.insurer,
                                offer.product
                              )}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              {badge}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Prix annuel</p>
                          <p className="text-lg font-semibold text-primary">{offer.price}€</p>
                          <p className="text-sm text-muted-foreground">{offer.monthlyPrice}€/mois</p>
                          {savings > 0 && (
                            <p className="text-xs text-green-600">Économie: {savings}€</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Couverture</p>
                          <p>{offer.coverage}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Franchise</p>
                          <p>{offer.franchise}€</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Note service</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{offer.rating}/5</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOfferSelect(offer.id)}
                          >
                            {selectedOffers.includes(offer.id) ? 'Désélectionner' : 'Comparer'}
                          </Button>
                          <Button size="sm" onClick={() => handleSubscribe(offer.id)}>
                            Souscrire
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleShowPourquoi(offer)}
                        >
                          <Info className="h-4 w-4 mr-1" />
                          Pourquoi ?
                        </Button>
                      </div>
                    </div>
                    
                    <div className="ml-4 text-right">
                      <div className="text-2xl font-semibold text-primary">{offer.score}</div>
                      <div className="text-sm text-muted-foreground">Score global</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selectedOffers.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span>{selectedOffers.length} offre(s) sélectionnée(s) pour comparaison</span>
              <Button onClick={() => setShowComparison(true)}>
                Comparer en détail
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modales */}
      {showComparison && (
        <ComparaisonDetaillee
          offers={mockOffers.filter(o => selectedOffers.includes(o.id))}
          onClose={() => setShowComparison(false)}
          onSubscribe={handleSubscribe}
        />
      )}

      <DocumentModal
        isOpen={documentModal.isOpen}
        onClose={() => setDocumentModal(prev => ({ ...prev, isOpen: false }))}
        type={documentModal.type}
        insurer={documentModal.insurer}
        product={documentModal.product}
      />

      <PourquoiModal
        isOpen={pourquoiModal.isOpen}
        onClose={() => setPourquoiModal({ isOpen: false, offer: null })}
        offer={pourquoiModal.offer}
      />
    </div>
  );
}