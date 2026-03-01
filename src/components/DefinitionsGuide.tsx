import { useState } from "react";
import { HelpCircle, BookOpen, Info, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Alert, AlertDescription } from "./ui/alert";
import { DefinitionTooltip } from "./DefinitionTooltip";

interface DefinitionsGuideProps {
  product: string;
  userType: "particulier" | "professionnel";
}

// Définitions par produit et segment
const definitions = {
  particulier: {
    auto: [
      {
        term: "Franchise",
        definition: "Montant qui reste à votre charge en cas de sinistre. Plus la franchise est élevée, plus votre prime est réduite.",
        example: "Avec une franchise de 300€, si vous avez un accident causant 1000€ de dégâts, vous payez 300€ et l'assureur 700€."
      },
      {
        term: "Tous risques",
        definition: "Formule d'assurance la plus complète qui couvre les dommages à votre véhicule même si vous êtes responsable.",
        example: "En cas d'accident responsable, vos réparations sont prises en charge (déduction faite de la franchise)."
      },
      {
        term: "Assistance 0km",
        definition: "Service de dépannage et assistance dès votre domicile, sans kilométrage minimum.",
        example: "Si votre voiture tombe en panne dans votre garage, l'assistance intervient."
      },
      {
        term: "Valeur à neuf",
        definition: "Garantie qui vous indemnise au prix d'achat de votre véhicule neuf pendant une durée déterminée.",
        example: "Pour un véhicule de moins de 2 ans, vous êtes remboursé au prix neuf en cas de vol ou destruction."
      },
      {
        term: "Protection juridique",
        definition: "Prise en charge des frais de procédure et d'avocat en cas de litige lié à votre véhicule.",
        example: "En cas de contestation après un accident, vos frais d'avocat sont couverts jusqu'à 15 000€."
      }
    ],
    habitation: [
      {
        term: "Multirisque habitation",
        definition: "Contrat d'assurance qui couvre l'ensemble des risques liés à votre logement et à vos biens.",
        example: "Incendie, dégâts des eaux, vol, bris de glace... tout est couvert en un seul contrat."
      },
      {
        term: "Responsabilité civile vie privée",
        definition: "Garantie qui couvre les dommages que vous pourriez causer à autrui dans votre vie quotidienne.",
        example: "Si votre enfant casse la vitre du voisin en jouant au ballon, les réparations sont couvertes."
      },
      {
        term: "Capital mobilier",
        definition: "Montant maximum d'indemnisation pour vos biens mobiliers (meubles, électroménager, vêtements...).",
        example: "Avec un capital mobilier de 30 000€, vos biens sont couverts jusqu'à cette somme en cas de sinistre."
      },
      {
        term: "Dégâts des eaux",
        definition: "Dommages causés par une fuite, une rupture ou un débordement d'eau dans votre logement.",
        example: "Fuite de canalisation qui endommage votre parquet : les réparations et le remplacement sont couverts."
      },
      {
        term: "Franchise dégâts des eaux",
        definition: "Montant qui reste à votre charge en cas de sinistre dégâts des eaux, souvent forfaitaire.",
        example: "Avec une franchise de 150€, vous payez ce montant et l'assureur prend en charge le reste."
      }
    ],
    sante: [
      {
        term: "Tiers payant",
        definition: "Système permettant de ne pas avancer les frais chez certains professionnels de santé.",
        example: "Chez votre médecin conventionné, vous ne payez que le ticket modérateur, le reste est directement réglé."
      },
      {
        term: "Forfait optique",
        definition: "Montant annuel de remboursement pour vos frais d'optique (lunettes, lentilles).",
        example: "Avec un forfait de 300€/an, vous pouvez acheter des lunettes jusqu'à ce montant sans reste à charge."
      },
      {
        term: "Forfait dentaire",
        definition: "Budget annuel dédié aux soins dentaires non remboursés par la Sécurité sociale.",
        example: "Pour une couronne à 800€ remboursée 120€ par la Sécu, le forfait dentaire couvre les 680€ restants."
      },
      {
        term: "Téléconsultation",
        definition: "Consultation médicale à distance via internet, souvent incluse dans les contrats modernes.",
        example: "Consultez un médecin depuis chez vous 24h/7j via votre smartphone, sans avancer de frais."
      },
      {
        term: "Délai de carence",
        definition: "Période pendant laquelle certaines garanties ne sont pas encore actives après souscription.",
        example: "Délai de 6 mois pour les soins dentaires : pas de remboursement pendant cette période."
      }
    ],
    vie: [
      {
        term: "Fonds euros",
        definition: "Support d'investissement sécurisé avec capital garanti et rendement annuel.",
        example: "Votre capital ne peut jamais diminuer et vous percevez chaque année un rendement (ex: 2,5%)."
      },
      {
        term: "Unités de compte",
        definition: "Supports d'investissement liés aux marchés financiers, plus risqués mais potentiellement plus rentables.",
        example: "Investissement dans des fonds actions ou obligations, avec risque de perte en capital."
      },
      {
        term: "Clause bénéficiaire",
        definition: "Désignation des personnes qui recevront le capital en cas de décès de l'assuré.",
        example: "\"Mon conjoint, à défaut mes enfants\" : ordre de priorité clairement établi."
      },
      {
        term: "Rachat",
        definition: "Possibilité de récupérer tout ou partie de votre capital avant le terme du contrat.",
        example: "Besoin de liquidités pour un projet : vous pouvez récupérer une partie de votre épargne."
      },
      {
        term: "Fiscalité après 8 ans",
        definition: "Avantage fiscal important : après 8 ans, abattement de 4 600€/an sur les gains (9 200€ pour un couple).",
        example: "Sur 5 000€ de gains après 8 ans, vous ne payez des impôts que sur 400€ (5000 - 4600)."
      }
    ]
  },
  professionnel: {
    "rc-pro": [
      {
        term: "Responsabilité civile professionnelle",
        definition: "Garantie qui couvre les dommages causés à des tiers dans le cadre de votre activité professionnelle.",
        example: "Un consultant endommage le matériel informatique de son client : les réparations sont couvertes."
      },
      {
        term: "Dommages corporels",
        definition: "Indemnisation des blessures causées à une personne dans le cadre de votre activité.",
        example: "Un client se blesse en glissant dans vos locaux : frais médicaux et préjudices couverts."
      },
      {
        term: "Dommages matériels",
        definition: "Prise en charge des dégâts causés aux biens d'autrui lors de votre intervention professionnelle.",
        example: "Un artisan casse une cloison chez un client : reconstruction prise en charge."
      },
      {
        term: "Plafond annuel",
        definition: "Montant maximum d'indemnisation par année d'assurance, tous sinistres confondus.",
        example: "Avec un plafond de 2M€, vous êtes couvert jusqu'à cette somme même en cas de sinistres multiples."
      },
      {
        term: "Franchise par sinistre",
        definition: "Montant qui reste à votre charge pour chaque sinistre déclaré.",
        example: "Franchise de 500€ : sur un sinistre de 10 000€, vous payez 500€ et l'assureur 9 500€."
      }
    ]
  }
};

export function DefinitionsGuide({ product, userType }: DefinitionsGuideProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentDefinitions = definitions[userType]?.[product as keyof typeof definitions[typeof userType]] || [];

  if (currentDefinitions.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-base">Lexique assurance {product}</CardTitle>
            <Badge variant="outline" className="bg-indigo-100 text-indigo-700 border-indigo-300">
              {currentDefinitions.length} termes
            </Badge>
          </div>
          
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/80 border-indigo-200 text-indigo-700 hover:bg-indigo-100">
                <Lightbulb className="h-4 w-4 mr-2" />
                {isExpanded ? 'Masquer' : 'Voir les définitions'}
                {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
        
        <p className="text-sm text-indigo-700">
          Comprenez les termes techniques pour mieux choisir votre assurance
        </p>
      </CardHeader>

      <Collapsible open={isExpanded}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid md:grid-cols-2 gap-4">
              {currentDefinitions.map((def, index) => (
                <Card key={index} className="bg-white/70 border-indigo-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <HelpCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h6 className="font-medium text-indigo-900">{def.term}</h6>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {def.definition}
                      </p>
                      
                      <Alert className="bg-indigo-50 border-indigo-200">
                        <Info className="h-3 w-3" />
                        <AlertDescription className="text-xs text-indigo-800">
                          <strong>Exemple :</strong> {def.example}
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Alert className="bg-white/70 border-indigo-200">
                <BookOpen className="h-4 w-4" />
                <AlertDescription className="text-indigo-800">
                  <strong>💡 Conseil :</strong> Ces définitions vous aident à comparer les offres en toute connaissance de cause. 
                  En cas de doute, nos conseillers sont disponibles pour vous expliquer chaque garantie.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}