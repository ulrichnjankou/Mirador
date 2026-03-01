import { useState } from "react";
import { Download, FileText, Calendar, CheckCircle, ArrowLeft, AlertCircle, Shield, Car, Home, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import type { User, Contract } from "../types";

interface AttestationType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  contractTypes: string[];
  requiresDate: boolean;
  maxDaysInAdvance?: number;
  availableFormats: ('pdf' | 'email' | 'postal')[];
}

const mockContracts: Contract[] = [
  {
    id: "CNT-2024-001",
    type: "Auto",
    insurer: "AXA",
    product: "Auto Essentiel",
    status: "active",
    premium: 480,
    startDate: "2024-01-15",
    endDate: "2025-01-15",
    vehicleInfo: {
      brand: "Peugeot",
      model: "308",
      plate: "AB-123-CD"
    }
  },
  {
    id: "CNT-2024-002",
    type: "Habitation",
    insurer: "MAIF",
    product: "Habitation Sécurité",
    status: "active",
    premium: 380,
    startDate: "2023-12-01",
    endDate: "2024-12-01",
    propertyInfo: {
      address: "15 rue de la Paix, 75001 Paris",
      type: "Appartement T3"
    }
  },
  {
    id: "CNT-2023-003",
    type: "Santé",
    insurer: "Harmonie Mutuelle",
    product: "Santé Plus",
    status: "active",
    premium: 840,
    startDate: "2023-02-01",
    endDate: "2024-02-01"
  }
];

const attestationTypes: AttestationType[] = [
  {
    id: "responsabilite_civile",
    name: "Attestation de responsabilité civile",
    description: "Document prouvant que vous êtes assuré en responsabilité civile",
    icon: <Shield className="h-5 w-5" />,
    contractTypes: ["Auto", "Habitation"],
    requiresDate: false,
    availableFormats: ["pdf", "email", "postal"]
  },
  {
    id: "assurance_auto",
    name: "Attestation d'assurance automobile",
    description: "Carte verte électronique et certificat d'assurance véhicule",
    icon: <Car className="h-5 w-5" />,
    contractTypes: ["Auto"],
    requiresDate: true,
    maxDaysInAdvance: 90,
    availableFormats: ["pdf", "email"]
  },
  {
    id: "assurance_habitation",
    name: "Attestation d'assurance habitation",
    description: "Document requis pour les démarches administratives et locatives",
    icon: <Home className="h-5 w-5" />,
    contractTypes: ["Habitation"],
    requiresDate: false,
    availableFormats: ["pdf", "email", "postal"]
  },
  {
    id: "multirisque_habitation",
    name: "Attestation multirisque habitation",
    description: "Attestation complète pour propriétaires et locataires",
    icon: <Home className="h-5 w-5" />,
    contractTypes: ["Habitation"],
    requiresDate: false,
    availableFormats: ["pdf", "email", "postal"]
  },
  {
    id: "sante_sociale",
    name: "Attestation de couverture santé",
    description: "Document pour la sécurité sociale et les remboursements",
    icon: <Heart className="h-5 w-5" />,
    contractTypes: ["Santé"],
    requiresDate: false,
    availableFormats: ["pdf", "email"]
  },
  {
    id: "certificat_adhesion",
    name: "Certificat d'adhésion",
    description: "Document officiel prouvant votre adhésion au contrat",
    icon: <FileText className="h-5 w-5" />,
    contractTypes: ["Auto", "Habitation", "Santé"],
    requiresDate: false,
    availableFormats: ["pdf", "email", "postal"]
  }
];

interface AttestationDownloadProps {
  authenticatedUser: User;
  onClose: () => void;
}

export function AttestationDownload({ authenticatedUser, onClose }: AttestationDownloadProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [selectedAttestation, setSelectedAttestation] = useState<AttestationType | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'email' | 'postal'>('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);

  const getContractIcon = (type: string) => {
    switch (type) {
      case "Auto": return <Car className="h-5 w-5 text-blue-600" />;
      case "Habitation": return <Home className="h-5 w-5 text-green-600" />;
      case "Santé": return <Heart className="h-5 w-5 text-red-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      case 'suspended': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAvailableAttestations = () => {
    if (!selectedContract) return [];
    return attestationTypes.filter(att => 
      att.contractTypes.includes(selectedContract.type)
    );
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    if (!selectedAttestation?.maxDaysInAdvance) return null;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + selectedAttestation.maxDaysInAdvance);
    return maxDate.toISOString().split('T')[0];
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulation de génération
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    setGenerationComplete(true);
    setCurrentStep(4);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: return selectedContract !== null;
      case 2: return selectedAttestation !== null;
      case 3: 
        if (selectedAttestation?.requiresDate) {
          return selectedDate !== "" && selectedFormat !== "";
        }
        return selectedFormat !== "";
      default: return false;
    }
  };

  const steps = [
    { id: 1, title: "Contrat", description: "Sélectionner le contrat" },
    { id: 2, title: "Attestation", description: "Type d'attestation" },
    { id: 3, title: "Options", description: "Date et format" },
    { id: 4, title: "Téléchargement", description: "Génération du document" }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Sélectionnez un contrat</h3>
              <p className="text-muted-foreground">Choisissez le contrat pour lequel vous souhaitez obtenir une attestation</p>
            </div>
            
            <div className="space-y-3">
              {mockContracts.filter(c => c.status === 'active').map((contract) => (
                <Card 
                  key={contract.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedContract?.id === contract.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedContract(contract)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getContractIcon(contract.type)}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{contract.insurer}</h4>
                            <Badge variant="outline">{contract.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{contract.product}</p>
                          <p className="text-xs text-muted-foreground">#{contract.id}</p>
                          
                          {contract.vehicleInfo && (
                            <p className="text-xs text-muted-foreground">
                              {contract.vehicleInfo.brand} {contract.vehicleInfo.model} - {contract.vehicleInfo.plate}
                            </p>
                          )}
                          
                          {contract.propertyInfo && (
                            <p className="text-xs text-muted-foreground">
                              {contract.propertyInfo.type} - {contract.propertyInfo.address}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <Badge className={getStatusColor(contract.status)}>
                        Actif
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Type d'attestation</h3>
              <p className="text-muted-foreground">
                Attestations disponibles pour votre contrat {selectedContract?.type}
              </p>
            </div>

            <div className="space-y-3">
              {getAvailableAttestations().map((attestation) => (
                <Card
                  key={attestation.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedAttestation?.id === attestation.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedAttestation(attestation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {attestation.icon}
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium">{attestation.name}</h4>
                        <p className="text-sm text-muted-foreground">{attestation.description}</p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          {attestation.requiresDate && (
                            <Badge variant="outline" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              Date requise
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {attestation.availableFormats.length} format{attestation.availableFormats.length > 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Options de génération</h3>
              <p className="text-muted-foreground">
                Configurez les paramètres de votre attestation
              </p>
            </div>

            {/* Récapitulatif */}
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Contrat :</span>
                    <span className="font-medium">{selectedContract?.insurer} - {selectedContract?.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Attestation :</span>
                    <span className="font-medium">{selectedAttestation?.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {/* Date si requise */}
              {selectedAttestation?.requiresDate && (
                <div className="space-y-2">
                  <Label htmlFor="date">Date d'effet de l'attestation</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getTodayDate()}
                    max={getMaxDate() || undefined}
                  />
                  {selectedAttestation.maxDaysInAdvance && (
                    <p className="text-xs text-muted-foreground">
                      Maximum {selectedAttestation.maxDaysInAdvance} jours à l'avance
                    </p>
                  )}
                </div>
              )}

              {/* Format de réception */}
              <div className="space-y-3">
                <Label>Format de réception</Label>
                <RadioGroup 
                  value={selectedFormat} 
                  onValueChange={(value: 'pdf' | 'email' | 'postal') => setSelectedFormat(value)}
                >
                  {selectedAttestation?.availableFormats.includes('pdf') && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pdf" id="pdf" />
                      <Label htmlFor="pdf" className="flex items-center space-x-2 cursor-pointer">
                        <Download className="h-4 w-4" />
                        <span>Téléchargement PDF immédiat</span>
                      </Label>
                    </div>
                  )}
                  
                  {selectedAttestation?.availableFormats.includes('email') && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="flex items-center space-x-2 cursor-pointer">
                        <FileText className="h-4 w-4" />
                        <span>Envoi par email ({authenticatedUser.email})</span>
                      </Label>
                    </div>
                  )}
                  
                  {selectedAttestation?.availableFormats.includes('postal') && (
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="postal" id="postal" />
                      <Label htmlFor="postal" className="flex items-center space-x-2 cursor-pointer">
                        <FileText className="h-4 w-4" />
                        <span>Envoi postal (délai 3-5 jours)</span>
                      </Label>
                    </div>
                  )}
                </RadioGroup>
              </div>
            </div>

            {/* Informations importantes */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Cette attestation sera générée avec les informations actuelles de votre contrat. 
                Elle sera valide immédiatement et pourra être téléchargée plusieurs fois.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            {isGenerating ? (
              <>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Génération en cours...</h3>
                    <p className="text-muted-foreground">
                      Nous préparons votre attestation
                    </p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </>
            ) : generationComplete ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Attestation générée !</h3>
                  <p className="text-muted-foreground">
                    Votre document est prêt à être téléchargé
                  </p>
                </div>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Document :</span>
                        <span className="font-medium">{selectedAttestation?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contrat :</span>
                        <span className="font-medium">#{selectedContract?.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Format :</span>
                        <span className="font-medium uppercase">{selectedFormat}</span>
                      </div>
                      {selectedDate && (
                        <div className="flex justify-between">
                          <span>Date d'effet :</span>
                          <span className="font-medium">
                            {new Date(selectedDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col space-y-3">
                  {selectedFormat === 'pdf' && (
                    <Button size="lg" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le PDF
                    </Button>
                  )}
                  
                  {selectedFormat === 'email' && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <FileText className="h-4 w-4" />
                      <AlertDescription className="text-blue-800">
                        L'attestation a été envoyée à {authenticatedUser.email}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {selectedFormat === 'postal' && (
                    <Alert className="bg-orange-50 border-orange-200">
                      <FileText className="h-4 w-4" />
                      <AlertDescription className="text-orange-800">
                        L'attestation sera expédiée sous 24h à votre adresse postale
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Button variant="outline" onClick={onClose}>
                    Retour à l'espace client
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Télécharger une attestation</h1>
            <p className="text-muted-foreground">Obtenez vos documents d'assurance en quelques clics</p>
          </div>
        </div>
      </div>

      {/* Indicateur d'étapes */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.id ? "bg-primary" : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold">{steps[currentStep - 1]?.title}</h3>
            <p className="text-sm text-muted-foreground">{steps[currentStep - 1]?.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Contenu de l'étape */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      {currentStep < 4 && !isGenerating && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Précédent
          </Button>
          
          {currentStep === 3 ? (
            <Button
              onClick={handleGenerate}
              disabled={!canProceedToNextStep()}
            >
              Générer l'attestation
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              disabled={!canProceedToNextStep()}
            >
              Suivant
            </Button>
          )}
        </div>
      )}
    </div>
  );
}