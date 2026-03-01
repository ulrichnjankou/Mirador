import { Shield, Check, AlertCircle, Star, TrendingUp, Eye } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";

interface OfferCardProps {
  offer: {
    id: number;
    insurer: string;
    product: string;
    price: number;
    franchise: number;
    score: number;
    coverageLevel: string;
    guarantees: string[];
    nps?: number;
  };
  onViewDetail: (offerId: number) => void;
  onSubscribe: (offerId: number) => void;
}

// Icônes des garanties clés
const guaranteeIcons: { [key: string]: any } = {
  "Assistance 0km": "🚗",
  "Protection juridique": "⚖️",
  "Tous risques": "🛡️",
  "Vol et vandalisme": "🔒",
  "Dégâts des eaux": "💧",
  "Incendie": "🔥",
  "Responsabilité civile": "👥",
  "Bris de glace": "🪟",
  "Catastrophes naturelles": "🌪️",
  "Téléconsultation": "💻",
  "Hospitalisation": "🏥",
  "Optique et dentaire": "👓"
};

export function OfferCard({ offer, onViewDetail, onSubscribe }: OfferCardProps) {
  // Couleur du score selon la valeur
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-blue-600 bg-blue-100";
    if (score >= 40) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  // Couleur de la barre de progression
  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "[&>div]:bg-green-600";
    if (score >= 60) return "[&>div]:bg-blue-600";
    if (score >= 40) return "[&>div]:bg-orange-600";
    return "[&>div]:bg-red-600";
  };

  // Top 3-4 garanties clés pour affichage
  const keyGuarantees = offer.guarantees.slice(0, 4);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* En-tête : Logo + Nom assureur */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{offer.insurer}</h3>
                <p className="text-sm text-muted-foreground">{offer.product}</p>
              </div>
            </div>
            
            {/* Badge du niveau de couverture */}
            <Badge variant="outline" className="text-xs">
              {offer.coverageLevel}
            </Badge>
          </div>

          <Separator className="my-4" />

          {/* Prix annuel en gros */}
          <div className="text-center py-2">
            <div className="text-4xl text-primary mb-1">
              {offer.price}€
            </div>
            <p className="text-sm text-muted-foreground">
              par an • Franchise: {offer.franchise}€
            </p>
          </div>

          <Separator className="my-4" />

          {/* Score MIRADOR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm">Score MIRADOR</span>
              </div>
              <div className={`px-3 py-1 rounded-full ${getScoreColor(offer.score)}`}>
                <span className="font-semibold">{offer.score}/100</span>
              </div>
            </div>
            
            <Progress 
              value={offer.score} 
              className={`h-2 ${getScoreBarColor(offer.score)}`}
            />
            
            <p className="text-xs text-muted-foreground text-center">
              Prix 50% • Couverture 25% • Service 25%
            </p>
          </div>

          <Separator className="my-4" />

          {/* 3-4 Garanties clés */}
          <div className="space-y-2">
            <h4 className="text-sm flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <span>Garanties principales</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {keyGuarantees.map((guarantee, index) => {
                const emoji = guaranteeIcons[guarantee] || "✓";
                return (
                  <div 
                    key={index} 
                    className="flex items-start space-x-2 text-sm"
                  >
                    <span className="flex-shrink-0">{emoji}</span>
                    <span className="text-muted-foreground text-xs leading-tight">
                      {guarantee}
                    </span>
                  </div>
                );
              })}
            </div>
            {offer.guarantees.length > 4 && (
              <p className="text-xs text-primary text-center pt-2">
                + {offer.guarantees.length - 4} autres garanties
              </p>
            )}
          </div>

          {/* CTA clair */}
          <div className="space-y-2 pt-2">
            <Button 
              onClick={() => onViewDetail(offer.id)}
              variant="outline"
              className="w-full"
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir le détail
            </Button>
            
            <Button 
              onClick={() => onSubscribe(offer.id)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Souscrire cette offre
            </Button>
          </div>

          {/* Indicateur NPS si disponible */}
          {offer.nps !== undefined && (
            <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground pt-2 border-t">
              <TrendingUp className="h-3 w-3" />
              <span>Satisfaction client: {offer.nps}/100 NPS</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
