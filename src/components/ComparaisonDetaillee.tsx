import React, { useState, useMemo } from "react";
import { 
  Star, Shield, Award, TrendingUp, Euro, Filter, Info
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DefinitionsGuide } from "./DefinitionsGuide";
import { OfferCard } from "./OfferCard";
import { OfferDetail } from "./OfferDetail";
import type { Offer, UserType } from "../types";

interface ComparaisonDetailleeProps {
  offers: Offer[];
  onSubscribe: (offerId: number) => void;
  userType: UserType;
  product: string;
}

// Options de tri
const sortOptions = [
  { value: "score", label: "Pertinence", icon: TrendingUp },
  { value: "price", label: "Prix croissant", icon: Euro },
  { value: "coverage", label: "Couverture", icon: Shield },
  { value: "rating", label: "Note client", icon: Star }
];

// Utilitaire pour extraire les garanties d'une offre
const getOfferGuarantees = (offer: Offer): string[] => {
  if (offer.guarantees) return offer.guarantees;
  
  // Extraire des données spécifiques selon le type
  if (offer.autoData?.garanties) return offer.autoData.garanties;
  if (offer.habitationData?.garanties) return offer.habitationData.garanties;
  if (offer.santeData?.garanties) return offer.santeData.garanties;
  if (offer.vieData?.garanties) return offer.vieData.garanties;
  if (offer.perData?.garanties) return offer.perData.garanties;
  
  // Garanties par défaut
  return ["Responsabilité civile", "Protection juridique", "Assistance"];
};

export function ComparaisonDetaillee({ 
  offers, 
  onSubscribe, 
  userType, 
  product 
}: ComparaisonDetailleeProps) {
  const [sortBy, setSortBy] = useState("score");
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);

  // Trier les offres selon le critère sélectionné
  const sortedOffers = useMemo(() => {
    const sorted = [...offers].sort((a, b) => {
      switch (sortBy) {
        case "price":
          return (a.price || 0) - (b.price || 0);
        case "coverage":
          return (b.coverageScore || 0) - (a.coverageScore || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default: // score
          return (b.score || 0) - (a.score || 0);
      }
    });
    return sorted;
  }, [offers, sortBy]);

  if (!offers || offers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-medium mb-2">Aucune offre à comparer</h3>
            <p className="text-sm">
              Aucune offre ne correspond à vos critères actuels
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si une offre est sélectionnée, afficher le détail
  if (selectedOfferId) {
    const selectedOffer = offers.find(o => o.id === selectedOfferId);
    if (selectedOffer) {
      return (
        <OfferDetail
          offer={selectedOffer}
          onBack={() => setSelectedOfferId(null)}
          onSubscribe={onSubscribe}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Guide des définitions repositionné en haut */}
      <DefinitionsGuide product={product} userType={userType} />

      {/* Header avec options de tri */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-1">
            {offers.length} offre{offers.length > 1 ? 's' : ''} disponible{offers.length > 1 ? 's' : ''}
          </h2>
          <p className="text-sm text-muted-foreground">
            Classées par pertinence selon nos critères de transparence
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Liste des offres en cartes */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedOffers.map((offer, index) => {
          const isRecommended = index === 0;
          
          return (
            <div key={offer.id} className="space-y-4">
              {/* Badge recommandé */}
              {isRecommended && (
                <div className="flex items-center justify-center">
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <Award className="h-3 w-3 mr-1" />
                    Meilleure offre
                  </Badge>
                </div>
              )}

              {/* Nouvelle carte d'offre épurée */}
              <OfferCard
                offer={{
                  id: offer.id,
                  insurer: offer.insurer,
                  product: offer.product,
                  price: offer.price,
                  franchise: offer.franchise,
                  score: offer.score,
                  coverageLevel: offer.coverage || "Standard",
                  guarantees: getOfferGuarantees(offer),
                  nps: offer.serviceScore
                }}
                onViewDetail={setSelectedOfferId}
                onSubscribe={onSubscribe}
              />
            </div>
          );
        })}
      </div>

      {/* Bandeau d'information méthodologique */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Méthodologie de classement MIRADOR</p>
              <p>
                Nos classements sont basés sur 3 critères objectifs : <strong>Prix (50%)</strong>, <strong>Couverture des garanties (25%)</strong> 
                et <strong>Qualité de service client/NPS (25%)</strong>. Les données sont actualisées quotidiennement et 
                notre algorithme est certifié par un organisme indépendant. Les synthèses IA des documents facilitent 
                la compréhension mais ne remplacent pas la lecture des documents officiels.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}