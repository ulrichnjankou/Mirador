import { X, Download, FileText, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'IPID' | 'CG';
  insurer: string;
  product: string;
}

export const DocumentModal = ({ isOpen, onClose, type, insurer, product }: DocumentModalProps) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = () => {
      setIsDownloading(true);
      // Simulation du téléchargement
      setTimeout(() => {
        setIsDownloading(false);
        // Ici on pourrait déclencher le téléchargement réel
        console.log(`Téléchargement de ${type} pour ${insurer} - ${product}`);
      }, 2000);
    };

    const documentInfo = {
      IPID: {
        title: "Information Produit d'Assurance et de Décès",
        description: "Document standardisé présentant les caractéristiques principales du produit d'assurance",
        icon: Info,
        sections: [
          {
            title: "Nature du produit",
            icon: CheckCircle,
            content: [
              "Assurance automobile tous risques",
              "Garantie responsabilité civile obligatoire",
              "Protection du véhicule et du conducteur",
              "Assistance 24h/7j incluse"
            ]
          },
          {
            title: "Garanties couvertes",
            icon: CheckCircle,
            content: [
              "✓ Responsabilité civile illimitée",
              "✓ Dommages tous accidents (collision, vol, incendie)",
              "✓ Catastrophes naturelles et technologiques",
              "✓ Assistance et dépannage 24h/7j",
              "✓ Protection juridique automobile",
              "✓ Prêt de véhicule de remplacement"
            ]
          },
          {
            title: "Exclusions principales",
            icon: AlertTriangle,
            content: [
              "✗ Conduite en état d'ivresse ou sous stupéfiants",
              "✗ Usage du véhicule non conforme au contrat",
              "✗ Participation à des courses ou compétitions",
              "✗ Dommages volontaires ou frauduleux",
              "✗ Conduite sans permis valide"
            ]
          },
          {
            title: "Territoire de couverture",
            icon: Info,
            content: [
              "🇫🇷 France métropolitaine et DOM-TOM",
              "🇪🇺 Union Européenne (28 pays)",
              "🌍 Pays du bassin méditerranéen",
              "📍 Assistance rapatriement internationale"
            ]
          },
          {
            title: "Modalités de paiement",
            icon: Info,
            content: [
              "💳 Paiement mensuel ou annuel",
              "🏦 Prélèvement automatique SEPA",
              "💰 Première cotisation à la souscription",
              "📅 Tacite reconduction annuelle"
            ]
          }
        ]
      },
      CG: {
        title: "Conditions Générales d'Assurance",
        description: "Document contractuel détaillant l'ensemble des droits et obligations",
        icon: FileText,
        sections: [
          {
            title: "Dispositions générales",
            icon: Info,
            content: [
              "Article 1 - Objet du contrat",
              "Article 2 - Définitions des termes",
              "Article 3 - Prise d'effet et durée",
              "Article 4 - Modification du contrat"
            ]
          },
          {
            title: "Garanties détaillées",
            icon: CheckCircle,
            content: [
              "Responsabilité civile automobile",
              "Dommages au véhicule assuré",
              "Vol et tentative de vol avec effraction",
              "Incendie, explosion et forces de la nature",
              "Bris de glaces et optiques",
              "Assistance et protection juridique"
            ]
          },
          {
            title: "Obligations de l'assuré",
            icon: AlertTriangle,
            content: [
              "Déclaration exacte des risques",
              "Paiement des cotisations aux échéances",
              "Déclaration des sinistres sous 5 jours",
              "Conservation et entretien du véhicule",
              "Respect du code de la route"
            ]
          },
          {
            title: "Gestion des sinistres",
            icon: Info,
            content: [
              "Procédure de déclaration",
              "Expertise et évaluation des dommages",
              "Modalités d'indemnisation",
              "Recours et subrogation",
              "Délais de règlement"
            ]
          }
        ]
      }
    };

    const doc = documentInfo[type];
    const DocIcon = doc.icon;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <DocIcon className="h-6 w-6 text-primary" />
                <div>
                  <DialogTitle className="text-xl">{doc.title}</DialogTitle>
                  <DialogDescription className="mt-1">{doc.description}</DialogDescription>
                </div>
                <Badge variant="outline" className="ml-2">{type}</Badge>
              </div>
              <Button 
                variant="outline" 
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Téléchargement..." : "Télécharger PDF"}
              </Button>
            </div>
          </DialogHeader>

          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">Produit :</span> {product}
                </div>
                <div>
                  <span className="font-medium">Assureur :</span> {insurer}
                </div>
                <div>
                  <span className="font-medium">Version :</span> {new Date().getFullYear()}.1
                </div>
              </div>
            </CardContent>
          </Card>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {doc.sections.map((section, index) => {
                const SectionIcon = section.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 mb-4">
                        <SectionIcon className={`h-5 w-5 ${
                          section.icon === CheckCircle ? 'text-green-600' :
                          section.icon === AlertTriangle ? 'text-orange-600' :
                          'text-blue-600'
                        }`} />
                        <h4 className="font-semibold text-lg">{section.title}</h4>
                      </div>
                      
                      <div className="grid gap-2">
                        {section.content.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start space-x-2">
                            <span className="text-sm leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>

          <Separator />

          <div className="flex justify-between items-center pt-4">
            <div className="text-xs text-muted-foreground">
              Document conforme à la réglementation DDA/IDD • Dernière mise à jour : {new Date().toLocaleDateString()}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>Fermer</Button>
              <Button onClick={handleDownload} disabled={isDownloading}>
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
};