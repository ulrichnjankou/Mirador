import { useState } from "react";
import { FileText, Download, Eye, Sparkles, ChevronDown, ChevronUp, CheckCircle2, FileCheck, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import type { OfferFull, ProductDocument } from "../../data/offersFull";

interface ProductDocumentSynthesisProps {
  offer: OfferFull | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDocumentSynthesis({ offer, isOpen, onClose }: ProductDocumentSynthesisProps) {
  const [isSynthesisOpen, setIsSynthesisOpen] = useState(true);

  if (!offer) return null;

  // Données de synthèse IA (simulées)
  const aiSynthesis = generateAISynthesis(offer);

  const getDocumentIcon = (type: ProductDocument['type']) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case "IPID":
        return <FileCheck className={iconClass + " text-blue-600"} />;
      case "Conditions Générales":
        return <FileText className={iconClass + " text-slate-600"} />;
      case "Tableau Garanties":
        return <FileText className={iconClass + " text-green-600"} />;
      case "Notice Information":
        return <FileText className={iconClass + " text-purple-600"} />;
      case "Fiche Produit":
        return <FileText className={iconClass + " text-orange-600"} />;
      default:
        return <FileText className={iconClass} />;
    }
  };

  const getTypeColor = (type: ProductDocument['type']) => {
    switch (type) {
      case "IPID":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Conditions Générales":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Tableau Garanties":
        return "bg-green-100 text-green-700 border-green-200";
      case "Notice Information":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Fiche Produit":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#10B981]" />
                Synthèse IA des documents produit
              </DialogTitle>
              <DialogDescription className="mt-2">
                {offer.assureur} • {offer.nom_offre}
              </DialogDescription>
            </div>
            <Badge variant="outline" className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20">
              {offer.documents?.length || 0} documents
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Synthèse IA */}
          <Card className="border-[#10B981]/20 bg-gradient-to-br from-[#10B981]/5 to-transparent">
            <Collapsible open={isSynthesisOpen} onOpenChange={setIsSynthesisOpen}>
              <CardHeader className="pb-3">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full text-left hover:opacity-80 transition-opacity">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="h-5 w-5 text-[#10B981]" />
                      Synthèse IA du produit
                      <Badge className="bg-[#10B981] hover:bg-[#10B981]/90">
                        Confiance: {aiSynthesis.confidence}%
                      </Badge>
                    </CardTitle>
                    {isSynthesisOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {/* Résumé général */}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                      Résumé général
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {aiSynthesis.summary}
                    </p>
                  </div>

                  <Separator />

                  {/* Points clés */}
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-[#10B981]" />
                      Points clés identifiés
                    </h4>
                    <ul className="space-y-1.5">
                      {aiSynthesis.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-[#10B981] mt-0.5">•</span>
                          <span className="text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  {/* Points d'attention */}
                  {aiSynthesis.warnings.length > 0 && (
                    <>
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2 text-orange-700">
                          <Clock className="h-4 w-4" />
                          Points d'attention
                        </h4>
                        <ul className="space-y-1.5">
                          {aiSynthesis.warnings.map((warning, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="text-orange-600 mt-0.5">⚠</span>
                              <span className="text-muted-foreground">{warning}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Analyse de confiance */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Fiabilité de l'analyse IA</span>
                      <span className="font-medium">{aiSynthesis.confidence}%</span>
                    </div>
                    <Progress value={aiSynthesis.confidence} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Basée sur l'analyse de {offer.documents?.length || 0} documents officiels
                    </p>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Liste des documents */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#2563EB]" />
              Documents disponibles
            </h3>

            {offer.documents && offer.documents.length > 0 ? (
              <div className="space-y-3">
                {offer.documents.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getDocumentIcon(doc.type)}
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{doc.nom}</h4>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getTypeColor(doc.type)}`}
                                >
                                  {doc.type}
                                </Badge>
                                {doc.pages && (
                                  <span className="text-xs text-muted-foreground">
                                    {doc.pages} page{doc.pages > 1 ? 's' : ''}
                                  </span>
                                )}
                                {doc.taille && (
                                  <span className="text-xs text-muted-foreground">• {doc.taille}</span>
                                )}
                                {doc.derniere_maj && (
                                  <span className="text-xs text-muted-foreground">
                                    • MAJ {doc.derniere_maj}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8"
                              onClick={() => window.open(doc.url, '_blank')}
                            >
                              <Eye className="h-3 w-3 mr-1.5" />
                              Consulter
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = doc.url;
                                link.download = doc.nom;
                                link.click();
                              }}
                            >
                              <Download className="h-3 w-3 mr-1.5" />
                              Télécharger
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Aucun document disponible pour ce produit</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Avertissement légal */}
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Note :</strong> Cette synthèse est générée automatiquement par IA à partir des documents officiels.
                Bien que nous nous efforcions d'assurer son exactitude, veuillez toujours consulter les documents officiels complets
                avant toute souscription. Seuls les documents contractuels font foi en cas de litige (conformément à la directive DDA/IDD).
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Fonction pour générer une synthèse IA basée sur l'offre
function generateAISynthesis(offer: OfferFull) {
  const typeLabel = {
    auto: "automobile",
    habitation: "habitation",
    sante: "santé",
    prevoyance: "prévoyance",
    vie: "assurance vie",
    epargne: "épargne"
  }[offer.type_assurance];

  const summary = `Cette offre d'assurance ${typeLabel} "${offer.nom_offre}" proposée par ${offer.assureur} offre une couverture de niveau ${offer.niveau_couverture}. ${
    offer.prix_annuel > 0
      ? `Avec un tarif annuel de ${offer.prix_annuel}€ et une franchise de ${offer.franchise}€, `
      : ""
  }elle s'adresse aux assurés recherchant ${
    offer.niveau_couverture === "Premium" || offer.niveau_couverture === "Tous Risques"
      ? "une protection complète et renforcée"
      : offer.niveau_couverture === "Etendue"
      ? "un bon équilibre entre protection et budget"
      : "une couverture essentielle à prix maîtrisé"
  }. Score MIRADOR : ${offer.score_mirador}/100.`;

  const keyPoints: string[] = [];
  
  // Points clés basés sur le type d'assurance
  if (offer.type_assurance === "auto") {
    keyPoints.push(`Formule ${offer.formule || offer.niveau_couverture} avec ${offer.assistance_0km ? "assistance 0km incluse" : "assistance à partir de 50km"}`);
    if (offer.valeur_vehicule_max) {
      keyPoints.push(`Véhicules assurables jusqu'à ${offer.valeur_vehicule_max.toLocaleString()}€ de valeur`);
    }
  } else if (offer.type_assurance === "habitation") {
    keyPoints.push(`Protection habitation ${offer.vol_inclus ? "avec garantie vol" : "garantie vol optionnelle"}`);
    if (offer.surface_max) {
      keyPoints.push(`Logements jusqu'à ${offer.surface_max}m² couverts`);
    }
  } else if (offer.type_assurance === "sante") {
    keyPoints.push(`Niveau optique ${offer.optique_lvl}, dentaire ${offer.dentaire_lvl}, hospitalisation ${offer.hosp_lvl}`);
    keyPoints.push(`${offer.tiers_payant ? "Tiers payant disponible" : "Sans tiers payant"}`);
    if (offer.delai_remboursement) {
      keyPoints.push(`Remboursements sous ${offer.delai_remboursement} jours en moyenne`);
    }
  } else if (offer.type_assurance === "epargne") {
    if (offer.fonds_euro_dispo) {
      keyPoints.push("Fonds euro disponible pour sécuriser votre capital");
    }
    if (offer.mandat_pilotage) {
      keyPoints.push("Gestion pilotée proposée pour optimiser votre épargne");
    }
    if (offer.versement_min) {
      keyPoints.push(`Versements libres à partir de ${offer.versement_min}€`);
    }
  }

  // Garanties principales
  const topGuaranties = offer.garanties_principales.slice(0, 3);
  keyPoints.push(`Garanties incluses : ${topGuaranties.join(", ")}`);
  
  // Délai d'indemnisation
  if (offer.delai_indemn_j > 0) {
    keyPoints.push(`Indemnisation moyenne sous ${offer.delai_indemn_j} jours`);
  }

  // NPS
  keyPoints.push(`Satisfaction client (NPS) : ${offer.nps_client}/100`);

  const warnings: string[] = [];
  
  // Warnings basés sur les caractéristiques
  if (offer.franchise > 300) {
    warnings.push(`Franchise relativement élevée (${offer.franchise}€) - à comparer avec vos besoins`);
  }
  
  if (offer.delai_indemn_j > 20) {
    warnings.push("Délai d'indemnisation supérieur à la moyenne du marché");
  }

  if (offer.type_assurance === "auto" && !offer.assistance_0km) {
    warnings.push("Assistance non incluse en cas de panne à domicile (uniquement >50km)");
  }

  if (offer.type_assurance === "sante" && !offer.tiers_payant) {
    warnings.push("Absence de tiers payant - avance de frais nécessaire");
  }

  if (offer.type_assurance === "epargne" && offer.frais_versement && offer.frais_versement > 1) {
    warnings.push(`Frais de versement de ${offer.frais_versement}% appliqués`);
  }

  // Calcul de la confiance basé sur le nombre de documents
  const docCount = offer.documents?.length || 0;
  const confidence = Math.min(95, 70 + (docCount * 5));

  return {
    summary,
    keyPoints,
    warnings,
    confidence
  };
}
