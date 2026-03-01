import { useState } from "react";
import { 
  Shield, Check, X, Euro, AlertCircle, ArrowLeft, 
  FileText, HelpCircle, Star, TrendingUp, Clock, Phone,
  Download, ExternalLink, Sparkles, ChevronDown, ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { DocumentSynthesis } from "./DocumentSynthesis";

import type { Offer } from "../types";

interface OfferDetailProps {
  offer: Offer;
  onBack: () => void;
  onSubscribe: (offerId: number) => void;
}

// Définitions des termes techniques (pour tooltips)
const definitions: { [key: string]: string } = {
  "Franchise": "Montant restant à votre charge en cas de sinistre",
  "Responsabilité civile": "Couvre les dommages causés aux tiers",
  "Protection juridique": "Assistance juridique et frais d'avocat",
  "Assistance 0km": "Dépannage dès le premier kilomètre",
  "Tous risques": "Couverture maximale incluant vos propres dommages",
  "Bris de glace": "Réparation/remplacement des vitres du véhicule",
  "Vol et vandalisme": "Protection contre le vol et les dégradations",
  "Catastrophes naturelles": "Dommages dus aux événements climatiques majeurs",
  "Téléconsultation": "Consultation médicale à distance",
  "Hospitalisation": "Prise en charge des frais d'hôpital",
  "NPS": "Net Promoter Score - indicateur de satisfaction client"
};

// Détails des exclusions communes
const exclusionDetails: { [key: string]: string } = {
  "Conduite en état d'ivresse": "Accidents survenus sous l'influence d'alcool ou de stupéfiants",
  "Usage professionnel non déclaré": "Utilisation du véhicule à des fins commerciales sans option souscrite",
  "Catastrophes naturelles non déclarées": "Événements non reconnus par arrêté de catastrophe naturelle",
  "Dommages intentionnels": "Dommages causés volontairement par l'assuré",
  "Usure normale": "Détérioration naturelle liée à l'usage du bien"
};

export function OfferDetail({ offer, onBack, onSubscribe }: OfferDetailProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["guarantees", "pricing"]));

  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  // Calcul du prix mensuel si non fourni
  const monthlyPrice = offer.monthlyPrice || Math.round(offer.price / 12);

  // Extraction des garanties
  const guarantees = offer.guarantees || 
                     offer.autoData?.garanties || 
                     offer.habitationData?.garanties || 
                     offer.santeData?.garanties || 
                     offer.vieData?.garanties || 
                     offer.perData?.garanties || 
                     ["Responsabilité civile", "Protection juridique", "Assistance"];

  // Couleur du score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "[&>div]:bg-green-600";
    if (score >= 60) return "[&>div]:bg-blue-600";
    if (score >= 40) return "[&>div]:bg-orange-600";
    return "[&>div]:bg-red-600";
  };

  // Exclusions par défaut si non fournies
  const exclusions = offer.exclusions || [
    "Conduite en état d'ivresse",
    "Usage professionnel non déclaré",
    "Catastrophes naturelles non déclarées",
    "Dommages intentionnels"
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Bouton retour */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux résultats
      </Button>

      {/* En-tête de l'offre - Compact */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Colonne 1 : Infos assureur */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl">{offer.insurer}</h2>
                  <p className="text-sm text-muted-foreground">{offer.product}</p>
                </div>
              </div>
              <Badge className="text-xs">{offer.coverageLevel || offer.coverage || "Standard"}</Badge>
            </div>

            {/* Colonne 2 : Prix */}
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">Prime annuelle</p>
              <div className="text-4xl text-primary">
                {offer.price}€
              </div>
              <p className="text-xs text-muted-foreground">
                Soit {monthlyPrice}€/mois
              </p>
              <Badge variant="outline" className="text-xs">
                Franchise: {offer.franchise}€
              </Badge>
            </div>

            {/* Colonne 3 : Score */}
            <div className="space-y-3">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-xs">Score MIRADOR</span>
                </div>
                <div className={`text-3xl ${getScoreColor(offer.score)}`}>
                  {offer.score}/100
                </div>
              </div>
              <Progress 
                value={offer.score} 
                className={`h-2 ${getScoreBarColor(offer.score)}`}
              />
              <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground">
                <div className="text-center">
                  <div>💰</div>
                  <div>50%</div>
                </div>
                <div className="text-center">
                  <div>🛡️</div>
                  <div>25%</div>
                </div>
                <div className="text-center">
                  <div>⭐</div>
                  <div>25%</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Principal sticky en haut */}
      <Card className="border-2 border-primary/30 bg-primary/5 sticky top-4 z-10">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-lg mb-0.5">Prêt à souscrire ?</h3>
              <p className="text-sm text-muted-foreground">
                Finalisez votre souscription en ligne en quelques minutes
              </p>
            </div>
            <Button 
              size="lg"
              onClick={() => onSubscribe(offer.id)}
              className="bg-primary hover:bg-primary/90 px-8"
            >
              <Shield className="h-5 w-5 mr-2" />
              Souscrire cette offre
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Garanties - Toujours ouvert */}
      <Card>
        <Collapsible open={openSections.has("guarantees")} onOpenChange={() => toggleSection("guarantees")}>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Garanties incluses ({guarantees.length})</span>
                </CardTitle>
                {openSections.has("guarantees") ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                {guarantees.map((guarantee, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-start space-x-2 p-3 rounded-lg border bg-green-50/50 hover:bg-green-50 transition-colors cursor-help">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{guarantee}</p>
                          </div>
                          <HelpCircle className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{definitions[guarantee] || "Garantie standard de l'assurance"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>

              {/* Infos service client */}
              {(offer.nps || offer.responseTime || offer.claimProcessing) && (
                <div className="bg-blue-50 rounded-lg p-4 space-y-3 mt-4">
                  <h4 className="flex items-center space-x-2 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span>Qualité de service</span>
                  </h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    {offer.nps && (
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-blue-600" />
                        <div className="text-sm">
                          <p className="font-medium">NPS: {offer.nps}/100</p>
                          <p className="text-xs text-muted-foreground">Satisfaction client</p>
                        </div>
                      </div>
                    )}
                    {offer.responseTime && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <div className="text-sm">
                          <p className="font-medium">{offer.responseTime}</p>
                          <p className="text-xs text-muted-foreground">Temps de réponse</p>
                        </div>
                      </div>
                    )}
                    {offer.claimProcessing && (
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <div className="text-sm">
                          <p className="font-medium">{offer.claimProcessing}</p>
                          <p className="text-xs text-muted-foreground">Traitement sinistre</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Section 2: Tarifs & Options */}
      <Card>
        <Collapsible open={openSections.has("pricing")} onOpenChange={() => toggleSection("pricing")}>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Euro className="h-5 w-5 text-primary" />
                  <span>Tarifs & Options</span>
                </CardTitle>
                {openSections.has("pricing") ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tarification */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium mb-3">Tarification détaillée</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-muted/30 rounded-lg text-sm">
                      <span>Prime annuelle</span>
                      <span className="font-semibold">{offer.price}€</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded-lg text-sm">
                      <span>Mensualisation</span>
                      <span className="font-semibold">{monthlyPrice}€/mois</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded-lg text-sm">
                      <span>Franchise</span>
                      <span className="font-semibold">{offer.franchise}€</span>
                    </div>
                    <div className="flex justify-between p-2 bg-green-50 rounded-lg border border-green-200 text-sm">
                      <span>Frais de dossier</span>
                      <span className="font-semibold text-green-600">0€</span>
                    </div>
                  </div>
                </div>

                {/* Options supplémentaires */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium mb-3">Options disponibles</h3>
                  <div className="space-y-2">
                    {[
                      { name: "Garantie conducteur", price: "+12€/mois" },
                      { name: "Véhicule de remplacement", price: "+8€/mois" },
                      { name: "Protection juridique renforcée", price: "+5€/mois" },
                      { name: "Assistance étendue", price: "+10€/mois" }
                    ].map((option, index) => (
                      <div key={index} className="flex justify-between p-2 border rounded-lg hover:bg-muted/30 transition-colors text-sm">
                        <span>{option.name}</span>
                        <span className="text-primary">{option.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modes de paiement */}
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <h4 className="text-sm font-medium mb-2">Modes de paiement acceptés</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">💳 Carte bancaire</Badge>
                  <Badge variant="outline" className="text-xs">🏦 Prélèvement SEPA</Badge>
                  <Badge variant="outline" className="text-xs">📄 Virement</Badge>
                  <Badge variant="outline" className="text-xs">📧 Mandat électronique</Badge>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Section 3: Exclusions */}
      <Card>
        <Collapsible open={openSections.has("exclusions")} onOpenChange={() => toggleSection("exclusions")}>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <X className="h-5 w-5 text-orange-600" />
                  <span>Exclusions ({exclusions.length})</span>
                </CardTitle>
                {openSections.has("exclusions") ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Les exclusions sont des situations non couvertes par votre contrat. 
                  Il est important de les connaître pour éviter toute mauvaise surprise.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                {exclusions.map((exclusion, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-start space-x-2 p-3 rounded-lg border bg-orange-50/50 hover:bg-orange-50 transition-colors cursor-help">
                          <X className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{exclusion}</p>
                          </div>
                          <HelpCircle className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{exclusionDetails[exclusion] || "Exclusion standard du contrat"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Section 4: Documents avec Synthèse IA */}
      <Card>
        <Collapsible open={openSections.has("documents")} onOpenChange={() => toggleSection("documents")}>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Synthèse IA des documents</span>
                </CardTitle>
                {openSections.has("documents") ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <DocumentSynthesis
                offerId={offer.id}
                insurer={offer.insurer}
                product={offer.product}
                onDownloadDocument={(docType) => {
                  console.log(`Téléchargement du document ${docType}`);
                  // Logique de téléchargement
                }}
              />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Section 5: Contact et aide */}
      <Card>
        <Collapsible open={openSections.has("contact")} onOpenChange={() => toggleSection("contact")}>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Phone className="h-5 w-5" />
                  <span>Besoin d'aide ?</span>
                </CardTitle>
                {openSections.has("contact") ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Notre équipe est disponible pour répondre à vos questions
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      01 23 45 67 89
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Chat en ligne 24/7
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-800">
                      Consultez la section <strong>"Synthèse IA des documents"</strong> pour comprendre rapidement les documents contractuels
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}
