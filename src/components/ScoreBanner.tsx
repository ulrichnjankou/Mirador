import { useState } from "react";
import { TrendingUp, Info, HelpCircle, Award, Euro, Shield, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";

interface ScoreBannerProps {
  score: number;
  price: number;
  coverageScore?: number;
  serviceScore?: number;
  rank: number;
  totalOffers: number;
  insurer: string;
  isRecommended?: boolean;
}

export function ScoreBanner({
  score,
  price,
  coverageScore = 75,
  serviceScore = 80,
  rank,
  totalOffers,
  insurer,
  isRecommended = false
}: ScoreBannerProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600";
    if (score >= 70) return "text-orange-600";
    if (score >= 55) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-emerald-100 border-emerald-300";
    if (score >= 70) return "bg-orange-100 border-orange-300";
    if (score >= 55) return "bg-amber-100 border-amber-300";
    return "bg-red-100 border-red-300";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 85) return "from-emerald-500 to-emerald-600";
    if (score >= 70) return "from-orange-500 to-orange-600";
    if (score >= 55) return "from-amber-500 to-amber-600";
    return "from-red-500 to-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Très bon";
    if (score >= 55) return "Correct";
    return "À améliorer";
  };

  // Calcul détaillé des scores
  const priceScore = Math.round(((2000 - price) / 2000) * 100);
  const priceWeight = 50;
  const coverageWeight = 25;
  const serviceWeight = 25;
  
  const weightedPriceScore = (priceScore * priceWeight) / 100;
  const weightedCoverageScore = (coverageScore * coverageWeight) / 100;
  const weightedServiceScore = (serviceScore * serviceWeight) / 100;

  return (
    <Card className={`border-2 ${getScoreBgColor(score)} ${isRecommended ? 'ring-2 ring-purple-400/30' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Score principal */}
            <div className="relative">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getScoreGradient(score)} flex items-center justify-center text-white shadow-lg`}>
                <div className="text-center">
                  <div className="text-2xl font-bold">{score}</div>
                  <div className="text-xs">/ 100</div>
                </div>
              </div>
              {isRecommended && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-purple-600 text-white text-xs px-2 py-1">
                    <Award className="h-3 w-3 mr-1" />
                    #1
                  </Badge>
                </div>
              )}
            </div>

            {/* Informations du score */}
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-xl font-bold">Score MIRADOR</h4>
                {isRecommended && (
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                    Recommandé
                  </Badge>
                )}
              </div>
              <p className={`text-lg font-medium ${getScoreColor(score)}`}>
                {getScoreLabel(score)}
              </p>
              <p className="text-sm text-muted-foreground">
                Classé {rank}e sur {totalOffers} offres • {insurer}
              </p>
            </div>
          </div>

          {/* Bouton d'explication */}
          <Collapsible open={showExplanation} onOpenChange={setShowExplanation}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100">
                <HelpCircle className="h-4 w-4 mr-2" />
                Pourquoi ce score ?
                {showExplanation ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </CardHeader>

      <Collapsible open={showExplanation}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-6">
              {/* Méthodologie générale */}
              <Alert className="bg-purple-50 border-purple-200">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Méthodologie MIRADOR :</strong> Notre score combine 3 critères objectifs avec une pondération transparente. 
                  Plus le score est élevé, meilleur est le rapport qualité-prix de l'offre.
                </AlertDescription>
              </Alert>

              <Separator />

              {/* Décomposition détaillée */}
              <div className="space-y-4">
                <h5 className="font-medium flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Décomposition du score {score}/100</span>
                </h5>

                {/* Score Prix */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Prix (50%)</span>
                      <Badge variant="outline" className="text-xs">
                        {price}€/an
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{priceScore}/100</div>
                      <div className="text-xs text-muted-foreground">
                        = {weightedPriceScore.toFixed(1)} pts
                      </div>
                    </div>
                  </div>
                  <Progress value={priceScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Plus le prix est bas par rapport au marché, plus le score est élevé
                  </p>
                </div>

                {/* Score Couverture */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Couverture (25%)</span>
                      <Badge variant="outline" className="text-xs">
                        Garanties
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{coverageScore}/100</div>
                      <div className="text-xs text-muted-foreground">
                        = {weightedCoverageScore.toFixed(1)} pts
                      </div>
                    </div>
                  </div>
                  <Progress value={coverageScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Évaluation de l'étendue et qualité des garanties proposées
                  </p>
                </div>

                {/* Score Service */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">Service Client (25%)</span>
                      <Badge variant="outline" className="text-xs">
                        NPS
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{serviceScore}/100</div>
                      <div className="text-xs text-muted-foreground">
                        = {weightedServiceScore.toFixed(1)} pts
                      </div>
                    </div>
                  </div>
                  <Progress value={serviceScore} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Basé sur la satisfaction client, délais de traitement et qualité du support
                  </p>
                </div>

                <Separator />

                {/* Calcul final */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h6 className="font-medium mb-2">Calcul final du score</h6>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Prix (50%)</span>
                      <span>{weightedPriceScore.toFixed(1)} points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Couverture (25%)</span>
                      <span>{weightedCoverageScore.toFixed(1)} points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service (25%)</span>
                      <span>{weightedServiceScore.toFixed(1)} points</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Score total</span>
                      <span className={getScoreColor(score)}>{score}/100</span>
                    </div>
                  </div>
                </div>

                {/* Informations complémentaires */}
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h6 className="font-medium mb-1">Sources des données</h6>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Prix : Tarifs assureurs actualisés</li>
                      <li>• Couverture : Analyse contractuelle</li>
                      <li>• Service : Enquêtes NPS indépendantes</li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium mb-1">Mise à jour</h6>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Quotidienne pour les prix</li>
                      <li>• Mensuelle pour les garanties</li>
                      <li>• Trimestrielle pour le service</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}