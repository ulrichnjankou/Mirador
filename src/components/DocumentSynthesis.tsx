import { useState } from "react";
import { FileText, Sparkles, Download, Eye, ChevronDown, ChevronUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";

interface DocumentSynthesisProps {
  offerId: number;
  insurer: string;
  product: string;
  onDownloadDocument?: (docType: string) => void;
}

// Mock des synthèses IA pour différents documents
const documentSyntheses = {
  ipid: {
    title: "IPID - Information Produit Assurance",
    aiSummary: {
      mainPoints: [
        "Couverture complète tous risques avec franchise de 300€",
        "Protection juridique incluse jusqu'à 15 000€",
        "Assistance 24h/7j dès 0km du domicile",
        "Garantie valeur à neuf pendant 24 mois",
        "Exclusions : usage professionnel, courses automobiles"
      ],
      keyMetrics: {
        franchise: "300€",
        plafondIndemnisation: "Valeur vénale + 20%",
        dureeEngagement: "12 mois",
        delaiCarence: "Aucun"
      },
      prosAndCons: {
        pros: [
          "Assistance très étendue (0km)",
          "Protection juridique généreuse",
          "Pas de franchise sur le bris de glace"
        ],
        cons: [
          "Franchise élevée sur dommages matériels",
          "Exclusion des accessoires > 3000€",
          "Limite kilométrique: 30 000km/an"
        ]
      }
    },
    confidence: 95,
    lastAnalyzed: "2024-02-15T10:30:00Z",
    pageCount: 2
  },
  conditions: {
    title: "Conditions Générales",
    aiSummary: {
      mainPoints: [
        "Contrat à durée déterminée d'un an, tacitement reconductible",
        "Résiliation possible à tout moment après la première année",
        "Déclaration de sinistre obligatoire sous 5 jours ouvrés",
        "Expertise contradictoire en cas de désaccord sur l'indemnisation",
        "Recours contre tiers automatique pour récupération de franchise"
      ],
      keyMetrics: {
        delaiDeclaration: "5 jours ouvrés",
        delaiIndemnisation: "30 jours maximum",
        prescriptionRecours: "2 ans",
        competenceJuridictionnelle: "Tribunaux français"
      },
      prosAndCons: {
        pros: [
          "Délai d'indemnisation rapide (30j max)",
          "Recours automatique contre tiers",
          "Expertise gratuite pour le client"
        ],
        cons: [
          "Délai de déclaration court (5j)",
          "Certaines exclusions mal définies",
          "Clause d'aggravation du risque stricte"
        ]
      }
    },
    confidence: 92,
    lastAnalyzed: "2024-02-15T10:30:00Z",
    pageCount: 24
  },
  notice: {
    title: "Notice d'Information",
    aiSummary: {
      mainPoints: [
        "Détail de toutes les garanties et options disponibles",
        "Procédures de mise en jeu des garanties",
        "Coordonnées des services clients et sinistres",
        "Méthodes de calcul des indemnisations",
        "Droit de renonciation de 14 jours après signature"
      ],
      keyMetrics: {
        droitRenonciation: "14 jours",
        serviceClient: "24h/7j",
        hotlineSinistre: "24h/7j",
        delaiReponseReclamation: "15 jours"
      },
      prosAndCons: {
        pros: [
          "Service client accessible 24h/7j",
          "Procédures claires et détaillées",
          "Droit de renonciation respecté"
        ],
        cons: [
          "Document très technique",
          "Conditions spéciales nombreuses",
          "Références juridiques complexes"
        ]
      }
    },
    confidence: 88,
    lastAnalyzed: "2024-02-15T10:30:00Z",
    pageCount: 8
  }
};

export function DocumentSynthesis({ 
  offerId, 
  insurer, 
  product, 
  onDownloadDocument 
}: DocumentSynthesisProps) {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [synthesisLoading, setSynthesisLoading] = useState<string | null>(null);

  const handleDownload = (docType: string) => {
    onDownloadDocument?.(docType);
  };

  const handleViewSynthesis = async (docType: string) => {
    if (expandedDoc === docType) {
      setExpandedDoc(null);
      return;
    }

    setSynthesisLoading(docType);
    // Simulation d'analyse IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSynthesisLoading(null);
    setExpandedDoc(docType);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 80) return "text-blue-600";
    if (confidence >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100";
    if (confidence >= 80) return "bg-blue-100";
    if (confidence >= 70) return "bg-orange-100";
    return "bg-red-100";
  };

  const DocumentCard = ({ docType, docData }: { docType: string; docData: any }) => {
    const isExpanded = expandedDoc === docType;
    const isLoading = synthesisLoading === docType;
    
    return (
      <Card className="border-muted">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base">{docData.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {docData.pageCount} page{docData.pageCount > 1 ? 's' : ''} • 
                  Analysé le {new Date(docData.lastAnalyzed).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${getConfidenceBg(docData.confidence)} border border-current/20 shadow-sm`}>
                <Sparkles className={`h-3 w-3 ${getConfidenceColor(docData.confidence)}`} />
                <span className={`text-xs font-semibold ${getConfidenceColor(docData.confidence)}`}>
                  {docData.confidence}%
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleViewSynthesis(docType)}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Analyse IA...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isExpanded ? 'Masquer' : 'Synthèse IA'}
                  {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload(docType)}
            >
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Voir
            </Button>
          </div>
          
          {isLoading && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>Analyse du document en cours...</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          )}
          
          <Collapsible open={isExpanded}>
            <CollapsibleContent>
              <div className="space-y-4 pt-3 border-t">
                {/* Points clés */}
                <div>
                  <h6 className="font-medium mb-2 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Points clés identifiés</span>
                  </h6>
                  <ul className="space-y-1">
                    {docData.aiSummary.mainPoints.map((point: string, i: number) => (
                      <li key={i} className="text-sm flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                {/* Métriques importantes */}
                <div>
                  <h6 className="font-medium mb-2">Métriques importantes</h6>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(docData.aiSummary.keyMetrics).map(([key, value]) => (
                      <div key={key} className="bg-muted/50 p-2 rounded">
                        <div className="text-xs text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                        <div className="text-sm font-medium">{value as string}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Avantages et inconvénients */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h6 className="font-medium mb-2 text-green-700 flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Avantages</span>
                    </h6>
                    <ul className="space-y-1">
                      {docData.aiSummary.prosAndCons.pros.map((pro: string, i: number) => (
                        <li key={i} className="text-sm flex items-start space-x-2 text-green-700">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h6 className="font-medium mb-2 text-orange-700 flex items-center space-x-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>Points d'attention</span>
                    </h6>
                    <ul className="space-y-1">
                      {docData.aiSummary.prosAndCons.cons.map((con: string, i: number) => (
                        <li key={i} className="text-sm flex items-start space-x-2 text-orange-700">
                          <span className="text-orange-500 mt-1">⚠</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Confiance de l'IA */}
                <Alert className="bg-blue-50 border-blue-200">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription className="text-blue-800">
                    <strong>Confiance IA: {docData.confidence}%</strong> - Cette synthèse a été générée automatiquement. 
                    Consultez toujours le document original pour les détails contractuels complets.
                  </AlertDescription>
                </Alert>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="font-medium">Documents contractuels</h5>
          <p className="text-sm text-muted-foreground">
            {insurer} - {product} • Synthèse automatique par IA
          </p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          <Sparkles className="h-3 w-3 mr-1" />
          IA Ready
        </Badge>
      </div>
      
      <div className="space-y-3">
        <DocumentCard docType="ipid" docData={documentSyntheses.ipid} />
        <DocumentCard docType="conditions" docData={documentSyntheses.conditions} />
        <DocumentCard docType="notice" docData={documentSyntheses.notice} />
      </div>
      
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          Les synthèses IA facilitent la compréhension mais ne remplacent pas la lecture des documents officiels. 
          Tous les documents sont téléchargeables au format PDF.
        </AlertDescription>
      </Alert>
    </div>
  );
}