import { useState, useEffect } from "react";
import { 
  CheckCircle, FileText, User, CreditCard, PenTool, 
  Download, ArrowLeft, ArrowRight, Clock, Shield,
  AlertCircle, Eye, UserCheck, FileCheck, Settings,
  Star, Gift
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { AuthModal } from "./AuthModal";
import { offers } from "../data/offers";
import type { User as UserType } from "../types";

interface SignatureProps {
  selectedOfferId: number | null;
  onReturnToComparator: () => void;
  authenticatedUser?: UserType | null;
  onUserAuthenticated: (user: UserType) => void;
  onGoToEspaceClient?: () => void; // Nouvelle prop pour naviguer vers l'espace client
}

const signatureSteps = [
  {
    id: 1,
    title: "Documents",
    description: "Consultation des conditions",
    icon: FileText,
    color: "text-blue-600"
  },
  {
    id: 2,
    title: "Informations",
    description: "Vos données personnelles",
    icon: User,
    color: "text-green-600"
  },
  {
    id: 3,
    title: "Signature",
    description: "Signature électronique",
    icon: PenTool,
    color: "text-purple-600"
  },
  {
    id: 4,
    title: "Prélèvements",
    description: "Mode de paiement",
    icon: CreditCard,
    color: "text-orange-600"
  }
];

export function Signature({ 
  selectedOfferId, 
  onReturnToComparator, 
  authenticatedUser, 
  onUserAuthenticated,
  onGoToEspaceClient 
}: SignatureProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [contractNumber, setContractNumber] = useState<string>("");

  // Rediriger vers l'authentification si pas connecté
  useEffect(() => {
    if (!authenticatedUser) {
      setShowAuthModal(true);
    }
  }, [authenticatedUser]);

  // Générer un numéro de contrat une fois le processus terminé
  useEffect(() => {
    if (isCompleted && !contractNumber) {
      const timestamp = Date.now().toString();
      const randomSuffix = Math.random().toString(36).substr(2, 6).toUpperCase();
      setContractNumber(`MIR-${timestamp.slice(-8)}-${randomSuffix}`);
    }
  }, [isCompleted, contractNumber]);

  if (!selectedOfferId) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Aucune offre sélectionnée</h2>
        <p className="text-muted-foreground mb-6">
          Veuillez d'abord choisir une offre depuis le comparateur
        </p>
        <Button onClick={onReturnToComparator}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au comparateur
        </Button>
      </div>
    );
  }

  if (!authenticatedUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Souscription sécurisée</CardTitle>
            <p className="text-muted-foreground">
              Connectez-vous pour finaliser votre souscription en toute sécurité
            </p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setShowAuthModal(true)} 
              className="w-full"
            >
              Se connecter pour souscrire
            </Button>
          </CardContent>
        </Card>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthenticated={onUserAuthenticated}
          title="Connexion Souscription"
        />
      </div>
    );
  }

  const selectedOffer = offers.find(offer => offer.id === selectedOfferId);

  if (!selectedOffer) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Offre introuvable</h2>
        <p className="text-muted-foreground mb-6">
          L'offre sélectionnée n'est plus disponible
        </p>
        <Button onClick={onReturnToComparator}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au comparateur
        </Button>
      </div>
    );
  }

  const handleNextStep = async () => {
    setIsProcessing(true);
    
    // Simulation du traitement
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCompletedSteps(prev => [...prev, currentStep]);
    
    if (currentStep < signatureSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
    
    setIsProcessing(false);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);
  const isStepCurrent = (stepId: number) => stepId === currentStep;

  // Page de confirmation finale avec accès espace client
  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header de succès */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              Félicitations ! 🎉
            </h1>
            <p className="text-lg text-green-700 mb-4">
              Votre souscription a été finalisée avec succès
            </p>
            <div className="bg-white/70 rounded-lg p-4 inline-block">
              <p className="text-sm text-green-600 mb-1">Numéro de contrat</p>
              <p className="text-xl font-bold text-green-800">{contractNumber}</p>
            </div>
          </CardContent>
        </Card>

        {/* Récapitulatif de l'offre souscrite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileCheck className="h-5 w-5 text-primary" />
              <span>Votre contrat {selectedOffer.insurer}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Détails du contrat</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Assureur :</span>
                    <span className="font-medium">{selectedOffer.insurer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Produit :</span>
                    <span className="font-medium">{selectedOffer.product}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prime annuelle :</span>
                    <span className="font-medium text-primary">{selectedOffer.price}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Franchise :</span>
                    <span className="font-medium">{selectedOffer.franchise}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prise d'effet :</span>
                    <span className="font-medium">{new Date(Date.now() + 24*60*60*1000).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Prochaines étapes</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Attestation d'assurance</p>
                      <p className="text-muted-foreground">Disponible dans votre espace client sous 2h</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FileText className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Conditions générales</p>
                      <p className="text-muted-foreground">Envoyées par email et consultables en ligne</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CreditCard className="h-4 w-4 text-purple-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Premier prélèvement</p>
                      <p className="text-muted-foreground">Le {new Date(Date.now() + 15*24*60*60*1000).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions principales - Nouveau design avec accès espace client */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Accès Espace Client - Mise en avant */}
          <Card className="bg-gradient-to-r from-primary/5 to-blue-50 border-primary/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Settings className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Accédez à votre espace client</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gérez vos contrats, téléchargez vos documents et suivez vos remboursements
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <Badge variant="outline" className="text-xs">📄 Documents</Badge>
                    <Badge variant="outline" className="text-xs">💰 Sinistres</Badge>
                    <Badge variant="outline" className="text-xs">🎁 Avantages</Badge>
                  </div>
                </div>
                <Button 
                  onClick={onGoToEspaceClient || (() => {})}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  disabled={!onGoToEspaceClient}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Mon espace client
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Découvrir les avantages fidélité */}
          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <Gift className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Découvrez vos avantages</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Profitez de votre programme fidélité et gagnez des points dès maintenant
                  </p>
                  <div className="bg-orange-100 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Star className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">
                        +500 points de bienvenue 🎉
                      </span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  className="w-full border-orange-200 text-orange-700 hover:bg-orange-100"
                  size="lg"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Mes avantages fidélité
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions secondaires */}
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-12">
                <Download className="h-4 w-4 mr-2" />
                Télécharger le contrat
              </Button>
              
              <Button variant="outline" className="h-12">
                <Eye className="h-4 w-4 mr-2" />
                Voir les garanties
              </Button>
              
              <Button variant="outline" className="h-12" onClick={onReturnToComparator}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Nouvelle comparaison
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Informations de contact */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Besoin d'aide ?</strong> Notre équipe est disponible 24h/7j au 01 23 45 67 89 
            ou par email à support@mirador.fr. Votre conseiller dédié vous contactera sous 48h.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* En-tête avec informations offre */}
      <Card className="bg-gradient-to-r from-primary/5 to-blue-50 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Finalisation de votre souscription</h1>
              <p className="text-muted-foreground">
                {selectedOffer.insurer} - {selectedOffer.product}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className="text-primary font-medium">{selectedOffer.price}€/an</span>
                <span>•</span>
                <span>Franchise: {selectedOffer.franchise}€</span>
                <span>•</span>
                <span>Score: {selectedOffer.score}/100</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Shield className="h-3 w-3 mr-1" />
                Souscription sécurisée
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicateur de progression */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progression</span>
              <span>{Math.round(((completedSteps.length + (isProcessing ? 0.5 : 0)) / signatureSteps.length) * 100)}%</span>
            </div>
            <Progress 
              value={((completedSteps.length + (isProcessing ? 0.5 : 0)) / signatureSteps.length) * 100} 
              className="h-2"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {signatureSteps.map((step) => {
              const Icon = step.icon;
              const isCompleted = isStepCompleted(step.id);
              const isCurrent = isStepCurrent(step.id);
              
              return (
                <div 
                  key={step.id}
                  className={`text-center p-4 rounded-lg border transition-all ${
                    isCompleted 
                      ? 'bg-green-50 border-green-200' 
                      : isCurrent 
                      ? 'bg-primary/5 border-primary/30 ring-2 ring-primary/20' 
                      : 'bg-muted/30 border-muted'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    isCompleted 
                      ? 'bg-green-100' 
                      : isCurrent 
                      ? 'bg-primary/10' 
                      : 'bg-muted'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <Icon className={`h-6 w-6 ${isCurrent ? step.color : 'text-muted-foreground'}`} />
                    )}
                  </div>
                  <h4 className={`font-medium text-sm mb-1 ${
                    isCompleted ? 'text-green-800' : isCurrent ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contenu de l'étape courante */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {(() => {
              const Icon = signatureSteps[currentStep - 1].icon;
              return <Icon className={`h-5 w-5 ${signatureSteps[currentStep - 1].color}`} />;
            })()}
            <span>Étape {currentStep}: {signatureSteps[currentStep - 1].title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Contenu simulé pour chaque étape */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <div>
                <h4 className="font-medium mb-4">Documents contractuels à consulter</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: "Conditions générales", pages: "24 pages", status: "À lire" },
                    { name: "IPID - Information produit", pages: "2 pages", status: "À lire" },
                    { name: "Notice d'information", pages: "8 pages", status: "À lire" }
                  ].map((doc, index) => (
                    <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{doc.pages}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Consulter
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div>
                <h4 className="font-medium mb-4">Vérification de vos informations</h4>
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium mb-2">Informations personnelles</p>
                      <p>Nom: {authenticatedUser.lastName}</p>
                      <p>Prénom: {authenticatedUser.firstName}</p>
                      <p>Email: {authenticatedUser.email}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-2">Adresse de facturation</p>
                      <p>123 Avenue de la République</p>
                      <p>75011 Paris</p>
                      <p>France</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="text-center">
                <h4 className="font-medium mb-4">Signature électronique sécurisée</h4>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 max-w-md mx-auto">
                  <PenTool className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Cliquez sur "Signer" pour valider électroniquement votre contrat
                  </p>
                  <div className="bg-white rounded border-2 border-dashed border-muted p-4 mb-4">
                    <p className="text-xs text-muted-foreground">Zone de signature</p>
                    <div className="text-lg font-script text-primary mt-2">
                      {authenticatedUser.firstName} {authenticatedUser.lastName}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 4 && (
              <div>
                <h4 className="font-medium mb-4">Configuration du prélèvement</h4>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="h-5 w-5 text-orange-600" />
                        <span className="font-medium">Prélèvement SEPA</span>
                      </div>
                      <Badge>Recommandé</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Mensualisation automatique • Aucun frais • Résiliation facile
                    </p>
                    <div className="text-sm">
                      <p>IBAN: FR76 **** **** **** ***4 92</p>
                      <p>Montant mensuel: {Math.round(selectedOffer.price / 12)}€</p>
                      <p>Premier prélèvement: {new Date(Date.now() + 15*24*60*60*1000).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Separator className="my-6" />
          
          {/* Boutons de navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousStep}
              disabled={currentStep === 1 || isProcessing}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Précédent
            </Button>
            
            <Button 
              onClick={handleNextStep}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : currentStep === signatureSteps.length ? (
                <>
                  Finaliser la souscription
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}