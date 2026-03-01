import { ArrowRight, Star, Euro, Shield, Award, TrendingUp, Clock, CheckCircle, AlertCircle, BarChart3, Brain, Target, Lightbulb, Users, Calculator } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "motion/react";

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
  coverageScore: number;
  serviceScore: number;
  lastUpdated: string;
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
}

interface PourquoiModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer | null;
  onSubscribe?: (offerId: number) => void;
}

const marketAverages = {
  auto: 650,
  habitation: 450,
  sante: 1200,
  vie: 200
};

// Composant de graphique circulaire personnalisé
function CircularProgressChart({ value, size = 120, strokeWidth = 8, color = "#3b82f6", backgroundColor = "#e5e7eb" }: {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{Math.round(value)}</span>
      </div>
    </div>
  );
}

export function PourquoiModal({ isOpen, onClose, offer, onSubscribe }: PourquoiModalProps) {
  if (!offer) return null;

  const marketAverage = marketAverages[offer.type as keyof typeof marketAverages] || 500;
  const savings = Math.max(0, marketAverage - offer.price);
  const priceAdvantage = Math.round((savings / marketAverage) * 100);

  // Calcul des scores détaillés selon les nouveaux critères
  const priceScore = Math.max(0, (marketAverage - offer.price) / marketAverage * 100);
  const priceWeight = Math.round(priceScore * 0.5); // 50%
  const coverageWeight = Math.round(offer.coverageScore * 0.25); // 25%
  const serviceWeight = Math.round(offer.serviceScore * 0.25); // 25%

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981"; // green
    if (score >= 60) return "#f59e0b"; // orange
    return "#ef4444"; // red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Bon";
    return "À améliorer";
  };

  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe(offer.id);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Analyse IA MIRADOR</DialogTitle>
              <DialogDescription className="text-base">
                <span className="font-medium text-foreground">{offer.insurer} - {offer.product}</span>
                <br />
                Découvrez pourquoi notre algorithme recommande cette offre selon vos critères
              </DialogDescription>
            </div>
          </motion.div>
        </DialogHeader>

        <Tabs defaultValue="score" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="score" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Score Global</span>
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Détail Critères</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Vs Marché</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Conseils IA</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="score" className="space-y-6 mt-6">
            {/* Score global avec graphique circulaire */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-primary/5 via-blue-50 to-indigo-50 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Star className="h-6 w-6 text-primary" />
                    <span>Score MIRADOR Global</span>
                    <Badge variant="outline" className="ml-auto">
                      {getScoreLabel(offer.score)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center space-x-12">
                    <div className="text-center">
                      <CircularProgressChart 
                        value={offer.score} 
                        size={160} 
                        color={getScoreColor(offer.score)}
                      />
                      <p className="mt-4 text-sm text-muted-foreground">
                        Score calculé selon l'algorithme MIRADOR v2.0
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.7, delay: 0.2 }}
                          className="flex items-center space-x-3 bg-white/60 rounded-lg p-4"
                        >
                          <Euro className="h-8 w-8 text-green-600" />
                          <div>
                            <div className="font-semibold">Prix (50%)</div>
                            <div className="text-sm text-muted-foreground">
                              {priceWeight}/50 points
                            </div>
                            <Progress value={(priceWeight / 50) * 100} className="w-20 h-2 mt-1" />
                          </div>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.7, delay: 0.4 }}
                          className="flex items-center space-x-3 bg-white/60 rounded-lg p-4"
                        >
                          <Shield className="h-8 w-8 text-blue-600" />
                          <div>
                            <div className="font-semibold">Couverture (25%)</div>
                            <div className="text-sm text-muted-foreground">
                              {coverageWeight}/25 points
                            </div>
                            <Progress value={(coverageWeight / 25) * 100} className="w-20 h-2 mt-1" />
                          </div>
                        </motion.div>

                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.7, delay: 0.6 }}
                          className="flex items-center space-x-3 bg-white/60 rounded-lg p-4"
                        >
                          <Award className="h-8 w-8 text-orange-600" />
                          <div>
                            <div className="font-semibold">Service (25%)</div>
                            <div className="text-sm text-muted-foreground">
                              {serviceWeight}/25 points
                            </div>
                            <Progress value={(serviceWeight / 25) * 100} className="w-20 h-2 mt-1" />
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommandation finale */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className={`border-2 ${offer.score >= 80 ? 'border-green-200 bg-green-50' : offer.score >= 60 ? 'border-orange-200 bg-orange-50' : 'border-red-200 bg-red-50'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${offer.score >= 80 ? 'bg-green-100' : offer.score >= 60 ? 'bg-orange-100' : 'bg-red-100'}`}>
                      {offer.score >= 80 ? '🏆' : offer.score >= 60 ? '👍' : '⚠️'}
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {offer.score >= 80 ? 'Recommandation Forte' : offer.score >= 60 ? 'Recommandation Positive' : 'À Étudier'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {offer.score >= 80 
                          ? 'Cette offre présente un excellent rapport qualité-prix-service' 
                          : offer.score >= 60 
                          ? 'Offre intéressante avec de bons atouts' 
                          : 'Offre correcte mais des alternatives peuvent être plus avantageuses'
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Analyse Prix */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-green-700">
                      <Euro className="h-5 w-5" />
                      <span>Analyse Prix (50%)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <CircularProgressChart 
                        value={Math.round(priceScore)} 
                        size={100} 
                        color="#059669"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Votre prix</span>
                        <span className="font-semibold">{offer.price}€/an</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Moyenne marché</span>
                        <span className="text-muted-foreground">{marketAverage}€/an</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Économie</span>
                        <span className={`font-bold ${savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {savings > 0 ? `+${savings}€` : `${Math.abs(savings)}€`}
                        </span>
                      </div>
                      <div className="text-xs text-center text-muted-foreground mt-2">
                        {priceAdvantage > 0 ? `${priceAdvantage}% moins cher` : `${Math.abs(priceAdvantage)}% plus cher`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Analyse Couverture */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-blue-700">
                      <Shield className="h-5 w-5" />
                      <span>Couverture (25%)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <CircularProgressChart 
                        value={offer.coverageScore} 
                        size={100} 
                        color="#0284c7"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <div className="font-medium mb-2">Garanties incluses :</div>
                        {offer.type === "auto" && offer.autoData && (
                          <ul className="text-xs space-y-1">
                            {offer.autoData.garanties.slice(0, 3).map((garantie, idx) => (
                              <li key={idx} className="flex items-center space-x-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{garantie}</span>
                              </li>
                            ))}
                            {offer.autoData.garanties.length > 3 && (
                              <li className="text-muted-foreground">+{offer.autoData.garanties.length - 3} autres</li>
                            )}
                          </ul>
                        )}
                        {offer.type === "habitation" && offer.habitationData && (
                          <ul className="text-xs space-y-1">
                            {offer.habitationData.garanties.slice(0, 3).map((garantie, idx) => (
                              <li key={idx} className="flex items-center space-x-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{garantie}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {offer.type === "sante" && offer.santeData && (
                          <ul className="text-xs space-y-1">
                            {offer.santeData.garanties.slice(0, 3).map((garantie, idx) => (
                              <li key={idx} className="flex items-center space-x-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{garantie}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Analyse Service */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-orange-700">
                      <Award className="h-5 w-5" />
                      <span>Service (25%)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <CircularProgressChart 
                        value={offer.serviceScore} 
                        size={100} 
                        color="#ea580c"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Note clients</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{offer.rating}/5</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium mb-2">Points forts :</div>
                        <ul className="text-xs space-y-1">
                          {offer.strengths.slice(0, 3).map((strength, idx) => (
                            <li key={idx} className="flex items-center space-x-1">
                              <Users className="h-3 w-3 text-orange-500" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    <span>Comparaison Financière</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-primary/10 to-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{offer.price}€</div>
                      <div className="text-sm text-muted-foreground">Prix annuel</div>
                      <div className="text-sm font-medium mt-1">{offer.monthlyPrice}€/mois</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>vs Moyenne marché</span>
                        <span className={savings > 0 ? 'text-green-600' : 'text-red-600'}>
                          {savings > 0 ? `-${priceAdvantage}%` : `+${Math.abs(priceAdvantage)}%`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Économie 5 ans</span>
                        <span className="font-bold text-green-600">
                          {savings > 0 ? `+${savings * 5}€` : `${savings * 5}€`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Franchise</span>
                        <span>{offer.franchise}€</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Position Marché</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold">Top {Math.max(1, Math.round((100 - offer.score) / 10))}%</div>
                      <div className="text-sm text-muted-foreground">des offres du marché</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Compétitivité prix</span>
                          <span>{Math.round(priceScore)}%</span>
                        </div>
                        <Progress value={priceScore} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Niveau couverture</span>
                          <span>{offer.coverageScore}%</span>
                        </div>
                        <Progress value={offer.coverageScore} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Qualité service</span>
                          <span>{offer.serviceScore}%</span>
                        </div>
                        <Progress value={offer.serviceScore} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6 mt-6">
            <div className="grid gap-6">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-blue-700">
                    <Brain className="h-5 w-5" />
                    <span>Analyse IA Personnalisée</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h5 className="font-medium text-green-700">✅ Points forts détectés</h5>
                        <ul className="space-y-2 text-sm">
                          {priceAdvantage > 0 && (
                            <li className="flex items-start space-x-2">
                              <Euro className="h-4 w-4 text-green-600 mt-0.5" />
                              <span>Prix {priceAdvantage}% sous la moyenne marché</span>
                            </li>
                          )}
                          {offer.coverageScore >= 80 && (
                            <li className="flex items-start space-x-2">
                              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                              <span>Couverture très complète ({offer.coverageScore}/100)</span>
                            </li>
                          )}
                          {offer.rating >= 4 && (
                            <li className="flex items-start space-x-2">
                              <Star className="h-4 w-4 text-orange-600 mt-0.5" />
                              <span>Excellente satisfaction client ({offer.rating}/5)</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-medium text-orange-700">⚠️ Points d'attention</h5>
                        <ul className="space-y-2 text-sm">
                          {offer.franchise > 300 && (
                            <li className="flex items-start space-x-2">
                              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                              <span>Franchise élevée ({offer.franchise}€)</span>
                            </li>
                          )}
                          {offer.coverageScore < 70 && (
                            <li className="flex items-start space-x-2">
                              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                              <span>Couverture limitée, vérifiez les exclusions</span>
                            </li>
                          )}
                          <li className="flex items-start space-x-2">
                            <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                            <span>Délai de carence à vérifier selon votre profil</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-white/60 p-4 rounded-lg">
                      <h5 className="font-medium mb-2 flex items-center space-x-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <span>Recommandation IA</span>
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {offer.score >= 80 
                          ? "Cette offre représente un excellent choix avec un rapport qualité-prix optimal. Notre IA recommande fortement cette souscription."
                          : offer.score >= 60 
                          ? "Cette offre présente de bons atouts mais pourrait être optimisée. Comparez avec 2-3 autres offres avant de décider."
                          : "Cette offre présente des limitations. Notre IA suggère d'explorer d'autres options mieux adaptées à vos besoins."
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-amber-700">
                    <Target className="h-5 w-5" />
                    <span>Méthodologie MIRADOR</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <p><strong>Prix (50%)</strong> : Comparaison avec 30 assureurs partenaires, données temps réel</p>
                    <p><strong>Couverture (25%)</strong> : Analyse de 50+ critères de garanties selon profil de risque</p>
                    <p><strong>Service (25%)</strong> : NPS clients réels + temps de traitement sinistres + accessibilité</p>
                    <p className="text-amber-700 italic mt-3">
                      🔄 Données mises à jour toutes les 6h • IA certifiée DDA/IDD • Algorithme audité par l'ACPR
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-between pt-6 border-t"
        >
          <div className="text-sm text-muted-foreground">
            🤖 Analyse générée par l'IA MIRADOR v2.0 • Conforme AI Act
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Continuer la comparaison
            </Button>
            <Button onClick={handleSubscribe} className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Souscrire cette offre</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}