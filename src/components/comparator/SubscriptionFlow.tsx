import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Check, Upload, Shield, CreditCard, FileText, CheckCircle, Download, Phone, Mail, Sparkles, AlertCircle, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { TooltipLexique } from "./TooltipLexique";
import { motion, AnimatePresence } from "motion/react";
import type { OfferFull } from "../../data/offersFull";
import type { FirmQuote, SubscriptionState, SubscriptionSubStep } from "../../types/subscription";

interface SubscriptionFlowProps {
  offer: OfferFull;
  firmQuote: FirmQuote;
  subscriptionState: SubscriptionState;
  onUpdateState: (updater: (prev: SubscriptionState) => SubscriptionState) => void;
  onComplete: (confirmationData: any) => void;
  onClose: () => void;
}

export function SubscriptionFlow({
  offer,
  firmQuote,
  subscriptionState,
  onUpdateState,
  onComplete,
  onClose
}: SubscriptionFlowProps) {
  const [currentSubStep, setCurrentSubStep] = useState<SubscriptionSubStep>(1);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const subSteps = [
    { number: 1, label: "Identité" },
    { number: 2, label: "Coordonnées" },
    { number: 3, label: "Pièces & KYC" },
    { number: 4, label: "Paiement" },
    { number: 5, label: "Confirmation" }
  ];

  const updateFormData = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev: any) => ({ ...prev, [key]: null }));
    }
  };

  const validateStep = (): boolean => {
    const newErrors: any = {};

    if (currentSubStep === 1) {
      if (!formData.civilite) newErrors.civilite = "Requis";
      if (!formData.nom?.trim()) newErrors.nom = "Requis";
      if (!formData.prenom?.trim()) newErrors.prenom = "Requis";
      if (!formData.date_naissance) newErrors.date_naissance = "Requis";
      if (!formData.nationalite) newErrors.nationalite = "Requis";
      if (!formData.type_doc) newErrors.type_doc = "Requis";
      if (!formData.num_doc?.trim()) newErrors.num_doc = "Requis";
      if (!formData.date_expiration) newErrors.date_expiration = "Requis";
      if (!formData.consentement_rgpd) newErrors.consentement_rgpd = "Consentement RGPD obligatoire";
    } else if (currentSubStep === 2) {
      if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Email invalide";
      if (!formData.mobile?.match(/^[\d\s+()-]+$/)) newErrors.mobile = "Téléphone invalide";
      if (!formData.adresse?.trim()) newErrors.adresse = "Requis";
      if (!formData.code_postal?.match(/^\d{5}$/)) newErrors.code_postal = "Code postal invalide";
      if (!formData.ville?.trim()) newErrors.ville = "Requis";
      if (!formData.iban?.trim()) newErrors.iban = "Requis";
    } else if (currentSubStep === 3) {
      if (!formData.piece_recto_url) newErrors.piece_recto_url = "Pièce recto requise";
      if (!formData.piece_verso_url) newErrors.piece_verso_url = "Pièce verso requise";
      if (!formData.justif_domicile_url) newErrors.justif_domicile_url = "Justificatif de domicile requis";
      if (!formData.rib_url) newErrors.rib_url = "RIB requis";
      if (formData.is_pep === undefined) newErrors.is_pep = "Requis";
      if (formData.sanctions === undefined) newErrors.sanctions = "Requis";
    } else if (currentSubStep === 4) {
      if (!formData.mode_paiement) newErrors.mode_paiement = "Requis";
      if (!formData.acceptation_cgv) newErrors.acceptation_cgv = "Vous devez accepter les CGV";
      if (!formData.signature_electronique) newErrors.signature_electronique = "Signature requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentSubStep < 5) {
      setCurrentSubStep((prev) => (prev + 1) as SubscriptionSubStep);
      onUpdateState((prev) => ({ ...prev, currentSubStep: (currentSubStep + 1) as SubscriptionSubStep }));
    } else {
      // Étape 5 - Finaliser
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSubStep > 1) {
      setCurrentSubStep((prev) => (prev - 1) as SubscriptionSubStep);
      onUpdateState((prev) => ({ ...prev, currentSubStep: (currentSubStep - 1) as SubscriptionSubStep }));
    }
  };

  const handleComplete = () => {
    // Simulation de création du contrat
    const confirmationData = {
      contrat_numero: `MIR-${Date.now()}-${offer.id}`,
      contrat_pdf_url: "/contrats/contrat-example.pdf",
      date_effet: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      prochaine_echeance: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      service_client_tel: "01 23 45 67 89",
      service_client_email: "contact@mirador.fr"
    };

    onComplete(confirmationData);
  };

  const handleFileUpload = (key: string) => {
    // Simulation d'upload
    const mockUrl = `/uploads/${key}-${Date.now()}.pdf`;
    updateFormData(key, mockUrl);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-[#2563EB]/10 rounded-xl flex items-center justify-center">
                <Shield className="h-7 w-7 text-[#2563EB]" />
              </div>
              <div>
                <h1 className="text-3xl text-[#111827]">Souscription en ligne</h1>
                <p className="text-base text-[#6B7280] mt-1">
                  {offer.assureur} • {offer.nom_offre} • <span className="text-[#2563EB] font-medium">{firmQuote.prix_ferme}€/an</span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-10 w-10 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Progression des sous-étapes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {subSteps.map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-base font-medium transition-all shadow-sm ${
                        step.number < currentSubStep
                          ? "bg-[#10B981] text-white"
                          : step.number === currentSubStep
                          ? "bg-[#2563EB] text-white"
                          : "bg-white border-2 border-[#E5E7EB] text-[#6B7280]"
                      }`}
                    >
                      {step.number < currentSubStep ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={`text-sm mt-2 font-medium ${
                        step.number === currentSubStep ? "text-[#2563EB]" : "text-[#6B7280]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < subSteps.length - 1 && (
                    <div className="flex-1 h-1 bg-[#E5E7EB] mx-4 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#10B981] transition-all duration-500"
                        style={{
                          width: step.number < currentSubStep ? "100%" : "0%"
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Progress
              value={(currentSubStep / 5) * 100}
              className="h-2 [&>div]:bg-[#2563EB]"
            />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto px-8 py-10">
          <AnimatePresence mode="wait">
            {/* Étape 1 - Identité */}
            {currentSubStep === 1 && (
              <motion.div
                key="identity"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <IdentityStep formData={formData} updateFormData={updateFormData} errors={errors} />
              </motion.div>
            )}

            {/* Étape 2 - Coordonnées */}
            {currentSubStep === 2 && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ContactStep formData={formData} updateFormData={updateFormData} errors={errors} />
              </motion.div>
            )}

            {/* Étape 3 - Pièces & KYC */}
            {currentSubStep === 3 && (
              <motion.div
                key="kyc"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <KYCStep
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                  handleFileUpload={handleFileUpload}
                />
              </motion.div>
            )}

            {/* Étape 4 - Paiement & Signature */}
            {currentSubStep === 4 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PaymentStep
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                  offer={offer}
                  firmQuote={firmQuote}
                />
              </motion.div>
            )}

            {/* Étape 5 - Confirmation */}
            {currentSubStep === 5 && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <ConfirmationStep offer={offer} firmQuote={firmQuote} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer avec navigation */}
      <footer className="bg-white border-t border-[#E5E7EB] shadow-lg">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSubStep === 1}
                className="border-[#E5E7EB] h-12 px-6 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Précédent
              </Button>
            </motion.div>

            <div className="flex flex-col items-center">
              <div className="text-base text-[#6B7280] font-medium">
                Étape {currentSubStep} sur 5
              </div>
              <div className="text-xs text-[#6B7280] mt-1">
                {currentSubStep === 5 ? "Vous y êtes presque !" : `Encore ${5 - currentSubStep} étape${5 - currentSubStep > 1 ? 's' : ''}`}
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleNext}
                className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                {currentSubStep === 5 ? "Finaliser ma souscription" : "Continuer"}
                {currentSubStep < 5 && <ChevronRight className="h-5 w-5 ml-2" />}
                {currentSubStep === 5 && <CheckCircle className="h-5 w-5 ml-2" />}
              </Button>
            </motion.div>
          </div>

          {/* Indicateur de sauvegarde */}
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center space-x-2 text-xs text-[#10B981]">
              <Check className="h-3 w-3" />
              <span>Vos données sont sauvegardées automatiquement</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Étape 1 - Identité
function IdentityStep({ formData, updateFormData, errors }: any) {
  return (
    <div className="space-y-6 bg-[#2563EB]/5 p-8 rounded-xl">
      <div>
        <h3 className="text-xl text-[#111827] mb-1">Identité</h3>
        <p className="text-sm text-[#6B7280]">
          Informations nécessaires pour établir votre contrat
        </p>
      </div>

      <Alert className="border-[#2563EB] bg-[#2563EB]/5">
        <Shield className="h-4 w-4 text-[#2563EB]" />
        <AlertDescription className="text-sm text-[#111827]">
          Vos données sont sécurisées et protégées conformément au{" "}
          <span className="inline-flex items-center">
            RGPD
            <TooltipLexique term="RGPD" />
          </span>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Civilité *</Label>
          <RadioGroup
            value={formData.civilite || ""}
            onValueChange={(val) => updateFormData("civilite", val)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="M" id="m" />
                <Label htmlFor="m" className="font-normal cursor-pointer">Monsieur</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Mme" id="mme" />
                <Label htmlFor="mme" className="font-normal cursor-pointer">Madame</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Autre" id="autre" />
                <Label htmlFor="autre" className="font-normal cursor-pointer">Autre</Label>
              </div>
            </div>
          </RadioGroup>
          {errors.civilite && <p className="text-xs text-red-600">{errors.civilite}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nom *</Label>
            <Input
              value={formData.nom || ""}
              onChange={(e) => updateFormData("nom", e.target.value)}
              placeholder="Ex: Dupont"
              className={`h-11 bg-white border-2 transition-all ${errors.nom ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
            />
            {errors.nom && <p className="text-xs text-red-600">{errors.nom}</p>}
          </div>

          <div className="space-y-2">
            <Label>Prénom *</Label>
            <Input
              value={formData.prenom || ""}
              onChange={(e) => updateFormData("prenom", e.target.value)}
              placeholder="Ex: Jean"
              className={`h-11 bg-white border-2 transition-all ${errors.prenom ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
            />
            {errors.prenom && <p className="text-xs text-red-600">{errors.prenom}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date de naissance *</Label>
            <Input
              type="date"
              value={formData.date_naissance || ""}
              onChange={(e) => updateFormData("date_naissance", e.target.value)}
              className={`h-11 bg-white border-2 transition-all ${errors.date_naissance ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
            />
            {errors.date_naissance && <p className="text-xs text-red-600">{errors.date_naissance}</p>}
          </div>

          <div className="space-y-2">
            <Label>Nationalité *</Label>
            <Select
              value={formData.nationalite || ""}
              onValueChange={(val) => updateFormData("nationalite", val)}
            >
              <SelectTrigger className={`h-11 bg-white border-2 transition-all ${errors.nationalite ? "border-red-500" : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Française">Française</SelectItem>
                <SelectItem value="UE">Union Européenne</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
            {errors.nationalite && <p className="text-xs text-red-600">{errors.nationalite}</p>}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm text-[#111827]">Pièce d'identité</h4>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type de document *</Label>
              <Select
                value={formData.type_doc || ""}
                onValueChange={(val) => updateFormData("type_doc", val)}
              >
                <SelectTrigger className={`h-11 bg-white border-2 transition-all ${errors.type_doc ? "border-red-500" : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CNI">Carte Nationale d'Identité</SelectItem>
                  <SelectItem value="Passeport">Passeport</SelectItem>
                  <SelectItem value="Titre de séjour">Titre de séjour</SelectItem>
                </SelectContent>
              </Select>
              {errors.type_doc && <p className="text-xs text-red-600">{errors.type_doc}</p>}
            </div>

            <div className="space-y-2">
              <Label>Numéro du document *</Label>
              <Input
                value={formData.num_doc || ""}
                onChange={(e) => updateFormData("num_doc", e.target.value)}
                placeholder="Ex: 123456789"
                className={`h-11 bg-white border-2 transition-all ${errors.num_doc ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
              />
              {errors.num_doc && <p className="text-xs text-red-600">{errors.num_doc}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date d'expiration *</Label>
            <Input
              type="date"
              value={formData.date_expiration || ""}
              onChange={(e) => updateFormData("date_expiration", e.target.value)}
              className={`h-11 bg-white border-2 transition-all ${errors.date_expiration ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
            />
            {errors.date_expiration && <p className="text-xs text-red-600">{errors.date_expiration}</p>}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm text-[#111827]">Consentements</h4>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="rgpd"
                checked={formData.consentement_rgpd || false}
                onCheckedChange={(val) => updateFormData("consentement_rgpd", val)}
                className={errors.consentement_rgpd ? "border-red-500" : ""}
              />
              <div className="space-y-1">
                <Label
                  htmlFor="rgpd"
                  className="text-sm font-normal leading-tight cursor-pointer"
                >
                  J'accepte la collecte et le traitement de mes données personnelles pour la souscription
                  et la gestion de mon contrat d'assurance. *
                </Label>
                {errors.consentement_rgpd && (
                  <p className="text-xs text-red-600">{errors.consentement_rgpd}</p>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="demarchage"
                checked={formData.consentement_demarchage || false}
                onCheckedChange={(val) => updateFormData("consentement_demarchage", val)}
              />
              <Label
                htmlFor="demarchage"
                className="text-sm font-normal leading-tight cursor-pointer"
              >
                J'accepte de recevoir des offres commerciales de MIRADOR et de ses partenaires (facultatif)
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Étape 2 - Coordonnées
function ContactStep({ formData, updateFormData, errors }: any) {
  return (
    <div className="space-y-6 bg-[#2563EB]/5 p-8 rounded-xl">
      <div>
        <h3 className="text-xl text-[#111827] mb-1">Coordonnées</h3>
        <p className="text-sm text-[#6B7280]">
          Pour vous contacter et finaliser votre contrat
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input
              type="email"
              placeholder="exemple@email.com"
              value={formData.email || ""}
              onChange={(e) => updateFormData("email", e.target.value)}
              className={`h-11 bg-white border-2 transition-all ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
            />
            {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label>Téléphone mobile *</Label>
            <Input
              type="tel"
              placeholder="06 12 34 56 78"
              value={formData.mobile || ""}
              onChange={(e) => updateFormData("mobile", e.target.value)}
              className={`h-11 bg-white border-2 transition-all ${errors.mobile ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
            />
            {errors.mobile && <p className="text-xs text-red-600">{errors.mobile}</p>}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm text-[#111827]">Adresse postale</h4>

          <div className="space-y-2">
            <Label>Adresse complète *</Label>
            <Input
              placeholder="Numéro et nom de rue"
              value={formData.adresse || ""}
              onChange={(e) => updateFormData("adresse", e.target.value)}
              className={`h-11 bg-white border-2 transition-all ${errors.adresse ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
            />
            {errors.adresse && <p className="text-xs text-red-600">{errors.adresse}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Code postal *</Label>
              <Input
                placeholder="75001"
                maxLength={5}
                value={formData.code_postal || ""}
                onChange={(e) => updateFormData("code_postal", e.target.value)}
                className={`h-11 bg-white border-2 transition-all ${errors.code_postal ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
              />
              {errors.code_postal && <p className="text-xs text-red-600">{errors.code_postal}</p>}
            </div>

            <div className="col-span-2 space-y-2">
              <Label>Ville *</Label>
              <Input
                placeholder="Paris"
                value={formData.ville || ""}
                onChange={(e) => updateFormData("ville", e.target.value)}
                className={`h-11 bg-white border-2 transition-all ${errors.ville ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
              />
              {errors.ville && <p className="text-xs text-red-600">{errors.ville}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Pays</Label>
            <Select
              value={formData.pays || "France"}
              onValueChange={(val) => updateFormData("pays", val)}
            >
              <SelectTrigger className="h-11 bg-white border-2 border-gray-300 transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Belgique">Belgique</SelectItem>
                <SelectItem value="Suisse">Suisse</SelectItem>
                <SelectItem value="Luxembourg">Luxembourg</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm text-[#111827]">Coordonnées bancaires</h4>
            <Badge variant="outline" className="text-xs">
              Sécurisé
            </Badge>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <span>IBAN *</span>
              <TooltipLexique term="Mandat SEPA" definition="Votre IBAN permet de mettre en place les prélèvements automatiques" />
            </Label>
            <Input
              placeholder="FR76 1234 5678 9012 3456 7890 123"
              value={formData.iban || ""}
              onChange={(e) => updateFormData("iban", e.target.value.toUpperCase())}
              className={`h-11 bg-white border-2 transition-all ${errors.iban ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
            />
            {errors.iban && <p className="text-xs text-red-600">{errors.iban}</p>}
            <p className="text-xs text-[#6B7280]">
              Format: FR76 suivi de 23 chiffres
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Étape 3 - Pièces & KYC
function KYCStep({ formData, updateFormData, errors, handleFileUpload }: any) {
  return (
    <div className="space-y-6 bg-[#2563EB]/5 p-8 rounded-xl">
      <div>
        <h3 className="text-xl text-[#111827] mb-1">Pièces justificatives & KYC</h3>
        <p className="text-sm text-[#6B7280]">
          Documents nécessaires pour valider votre identité
        </p>
      </div>

      <Alert className="border-[#F59E0B] bg-[#F59E0B]/5">
        <Upload className="h-4 w-4 text-[#F59E0B]" />
        <AlertDescription className="text-sm text-[#111827]">
          Formats acceptés : PDF, JPG, PNG • Taille max : 5 Mo par fichier
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <h4 className="text-sm text-[#111827]">Pièce d'identité</h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Recto *</Label>
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-6 text-center hover:border-[#2563EB] transition-colors cursor-pointer">
              {formData.piece_recto_url ? (
                <div className="space-y-2">
                  <CheckCircle className="h-8 w-8 text-[#10B981] mx-auto" />
                  <p className="text-xs text-[#10B981]">Fichier uploadé</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFormData("piece_recto_url", "")}
                  >
                    Changer
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => handleFileUpload("piece_recto_url")}
                  className="space-y-2"
                >
                  <Upload className="h-8 w-8 text-[#6B7280] mx-auto" />
                  <p className="text-xs text-[#6B7280]">Cliquer pour uploader</p>
                </div>
              )}
            </div>
            {errors.piece_recto_url && <p className="text-xs text-red-600">{errors.piece_recto_url}</p>}
          </div>

          <div className="space-y-2">
            <Label>Verso *</Label>
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-6 text-center hover:border-[#2563EB] transition-colors cursor-pointer">
              {formData.piece_verso_url ? (
                <div className="space-y-2">
                  <CheckCircle className="h-8 w-8 text-[#10B981] mx-auto" />
                  <p className="text-xs text-[#10B981]">Fichier uploadé</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFormData("piece_verso_url", "")}
                  >
                    Changer
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => handleFileUpload("piece_verso_url")}
                  className="space-y-2"
                >
                  <Upload className="h-8 w-8 text-[#6B7280] mx-auto" />
                  <p className="text-xs text-[#6B7280]">Cliquer pour uploader</p>
                </div>
              )}
            </div>
            {errors.piece_verso_url && <p className="text-xs text-red-600">{errors.piece_verso_url}</p>}
          </div>
        </div>

        <Separator />

        <h4 className="text-sm text-[#111827]">Autres documents</h4>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Justificatif de domicile (- 3 mois) *</Label>
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-4 text-center hover:border-[#2563EB] transition-colors cursor-pointer">
              {formData.justif_domicile_url ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-[#10B981]" />
                    <span className="text-sm text-[#10B981]">Fichier uploadé</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFormData("justif_domicile_url", "")}
                  >
                    Changer
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => handleFileUpload("justif_domicile_url")}
                  className="flex items-center justify-center space-x-2"
                >
                  <Upload className="h-5 w-5 text-[#6B7280]" />
                  <span className="text-sm text-[#6B7280]">Uploader le justificatif</span>
                </div>
              )}
            </div>
            {errors.justif_domicile_url && <p className="text-xs text-red-600">{errors.justif_domicile_url}</p>}
          </div>

          <div className="space-y-2">
            <Label>RIB (Relevé d'Identité Bancaire) *</Label>
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-4 text-center hover:border-[#2563EB] transition-colors cursor-pointer">
              {formData.rib_url ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-[#10B981]" />
                    <span className="text-sm text-[#10B981]">Fichier uploadé</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateFormData("rib_url", "")}
                  >
                    Changer
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => handleFileUpload("rib_url")}
                  className="flex items-center justify-center space-x-2"
                >
                  <Upload className="h-5 w-5 text-[#6B7280]" />
                  <span className="text-sm text-[#6B7280]">Uploader le RIB</span>
                </div>
              )}
            </div>
            {errors.rib_url && <p className="text-xs text-red-600">{errors.rib_url}</p>}
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm text-[#111827]">Vérifications KYC</h4>
            <TooltipLexique term="KYC" />
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-[#F9FAFB] rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-normal">
                  Êtes-vous une Personne Politiquement Exposée (PEP) ? *
                </Label>
                <p className="text-xs text-[#6B7280] mt-1">
                  Fonction publique importante, membre de gouvernement, etc.
                </p>
              </div>
              <RadioGroup
                value={formData.is_pep === undefined ? "" : String(formData.is_pep)}
                onValueChange={(val) => updateFormData("is_pep", val === "true")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="pep-non" />
                  <Label htmlFor="pep-non" className="font-normal cursor-pointer">Non</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="pep-oui" />
                  <Label htmlFor="pep-oui" className="font-normal cursor-pointer">Oui</Label>
                </div>
              </RadioGroup>
            </div>
            {errors.is_pep && <p className="text-xs text-red-600">{errors.is_pep}</p>}

            <div className="flex items-start space-x-3 p-3 bg-[#F9FAFB] rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-normal">
                  Faites-vous l'objet de sanctions internationales ? *
                </Label>
                <p className="text-xs text-[#6B7280] mt-1">
                  Gel d'avoirs, interdiction de transactions, etc.
                </p>
              </div>
              <RadioGroup
                value={formData.sanctions === undefined ? "" : String(formData.sanctions)}
                onValueChange={(val) => updateFormData("sanctions", val === "true")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="sanc-non" />
                  <Label htmlFor="sanc-non" className="font-normal cursor-pointer">Non</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="sanc-oui" />
                  <Label htmlFor="sanc-oui" className="font-normal cursor-pointer">Oui</Label>
                </div>
              </RadioGroup>
            </div>
            {errors.sanctions && <p className="text-xs text-red-600">{errors.sanctions}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Étape 4 - Paiement & Signature
function PaymentStep({ formData, updateFormData, errors, offer, firmQuote }: any) {
  return (
    <div className="space-y-6 bg-[#2563EB]/5 p-8 rounded-xl">
      <div>
        <h3 className="text-xl text-[#111827] mb-1">Paiement & Signature</h3>
        <p className="text-sm text-[#6B7280]">
          Dernière étape avant la finalisation de votre contrat
        </p>
      </div>

      {/* Récap offre */}
      <Card className="border-[#2563EB] bg-[#2563EB]/5">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B7280]">Offre sélectionnée</span>
            <Badge className="bg-[#2563EB] text-white">
              {offer.assureur}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#111827]">{offer.nom_offre}</span>
            <span className="text-2xl text-[#2563EB]">{firmQuote.prix_ferme}€/an</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#6B7280]">Paiement mensuel</span>
            <span className="text-[#111827]">{firmQuote.prix_mensuel}€</span>
          </div>
          {firmQuote.franchise > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280]">Franchise</span>
              <span className="text-[#111827]">{firmQuote.franchise}€</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mode de paiement */}
      <div className="space-y-4">
        <Label>Mode de paiement *</Label>
        <RadioGroup
          value={formData.mode_paiement || ""}
          onValueChange={(val) => updateFormData("mode_paiement", val)}
        >
          <div className="space-y-3">
            <div
              className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.mode_paiement === "SEPA"
                  ? "border-[#2563EB] bg-[#2563EB]/5"
                  : "border-[#E5E7EB] hover:border-[#2563EB]/50"
              }`}
            >
              <RadioGroupItem value="SEPA" id="sepa" />
              <div className="flex-1">
                <Label htmlFor="sepa" className="cursor-pointer flex items-center space-x-2">
                  <span>Prélèvement SEPA</span>
                  <TooltipLexique term="Mandat SEPA" />
                  <Badge variant="outline" className="ml-auto">Recommandé</Badge>
                </Label>
                <p className="text-xs text-[#6B7280] mt-1">
                  Paiement automatique mensuel ou annuel via votre compte bancaire
                </p>
              </div>
            </div>

            <div
              className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.mode_paiement === "CB"
                  ? "border-[#2563EB] bg-[#2563EB]/5"
                  : "border-[#E5E7EB] hover:border-[#2563EB]/50"
              }`}
            >
              <RadioGroupItem value="CB" id="cb" />
              <div className="flex-1">
                <Label htmlFor="cb" className="cursor-pointer flex items-center space-x-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Carte bancaire</span>
                </Label>
                <p className="text-xs text-[#6B7280] mt-1">
                  Paiement sécurisé par carte (renouvellement manuel)
                </p>
              </div>
            </div>
          </div>
        </RadioGroup>
        {errors.mode_paiement && <p className="text-xs text-red-600">{errors.mode_paiement}</p>}
      </div>

      <Separator />

      {/* Signature électronique */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm text-[#111827]">Signature électronique</h4>
          <TooltipLexique term="E-signature" />
        </div>

        <Alert className="border-[#F59E0B] bg-[#F59E0B]/5">
          <FileText className="h-4 w-4 text-[#F59E0B]" />
          <AlertDescription className="text-xs text-[#111827]">
            En cochant les cases ci-dessous, vous apposez votre signature électronique ayant valeur juridique
            selon le règlement eIDAS.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-[#F9FAFB] rounded-lg">
            <Checkbox
              id="cgv"
              checked={formData.acceptation_cgv || false}
              onCheckedChange={(val) => updateFormData("acceptation_cgv", val)}
              className={errors.acceptation_cgv ? "border-red-500" : ""}
            />
            <div>
              <Label htmlFor="cgv" className="text-sm font-normal leading-tight cursor-pointer">
                J'ai lu et j'accepte les{" "}
                <a
                  href={offer.lien_cgv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] hover:underline"
                >
                  Conditions Générales de Vente
                </a>{" "}
                et l'{" "}
                <a
                  href={offer.lien_pdf_ipid}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2563EB] hover:underline"
                >
                  IPID
                </a>{" "}
                du contrat. *
              </Label>
              {errors.acceptation_cgv && (
                <p className="text-xs text-red-600 mt-1">{errors.acceptation_cgv}</p>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-[#F9FAFB] rounded-lg">
            <Checkbox
              id="signature"
              checked={formData.signature_electronique || false}
              onCheckedChange={(val) => {
                updateFormData("signature_electronique", val);
                if (val) {
                  updateFormData("date_signature", new Date().toISOString());
                }
              }}
              className={errors.signature_electronique ? "border-red-500" : ""}
            />
            <div>
              <Label htmlFor="signature" className="text-sm font-normal leading-tight cursor-pointer">
                Je certifie l'exactitude des informations fournies et j'appouvre ma signature électronique
                pour souscrire à ce contrat d'assurance. *
              </Label>
              {formData.signature_electronique && (
                <p className="text-xs text-[#10B981] mt-2">
                  ✓ Signature apposée le {new Date().toLocaleDateString("fr-FR")} à{" "}
                  {new Date().toLocaleTimeString("fr-FR")}
                </p>
              )}
              {errors.signature_electronique && (
                <p className="text-xs text-red-600 mt-1">{errors.signature_electronique}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Étape 5 - Confirmation
function ConfirmationStep({ offer, firmQuote }: any) {
  return (
    <div className="space-y-6 text-center py-8">
      <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="h-12 w-12 text-[#10B981]" />
      </div>

      <div>
        <h3 className="text-2xl text-[#111827] mb-2">Souscription réussie !</h3>
        <p className="text-[#6B7280]">
          Votre contrat a été créé avec succès
        </p>
      </div>

      <Card className="border-[#10B981] bg-[#10B981]/5 text-left">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#6B7280]">Numéro de contrat</span>
            <Badge className="bg-[#10B981] text-white font-mono">
              MIR-{Date.now()}-{offer.id}
            </Badge>
          </div>

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Assureur</span>
              <span className="text-[#111827]">{offer.assureur}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Offre</span>
              <span className="text-[#111827]">{offer.nom_offre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Prime annuelle</span>
              <span className="text-[#2563EB]">{firmQuote.prix_ferme}€</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Date de prise d'effet</span>
              <span className="text-[#111827]">
                {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="sm" className="border-[#10B981] text-[#10B981]">
              <Download className="h-4 w-4 mr-2" />
              Télécharger le contrat
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <p className="text-sm text-[#6B7280]">
          Vous allez recevoir un email de confirmation avec tous les détails de votre contrat.
        </p>

        <Alert className="border-[#2563EB] bg-[#2563EB]/5 text-left">
          <Shield className="h-4 w-4 text-[#2563EB]" />
          <AlertDescription className="text-sm text-[#111827]">
            <strong>Prochaines étapes :</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
              <li>Vérification de vos documents (24-48h)</li>
              <li>Activation de votre contrat dans 7 jours</li>
              <li>Réception de votre carte de tiers (auto uniquement)</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-center gap-6 pt-4">
          <a
            href="tel:0123456789"
            className="flex items-center space-x-2 text-sm text-[#2563EB] hover:underline"
          >
            <Phone className="h-4 w-4" />
            <span>01 23 45 67 89</span>
          </a>
          <span className="text-[#E5E7EB]">•</span>
          <a
            href="mailto:contact@mirador.fr"
            className="flex items-center space-x-2 text-sm text-[#2563EB] hover:underline"
          >
            <Mail className="h-4 w-4" />
            <span>contact@mirador.fr</span>
          </a>
        </div>
      </div>
    </div>
  );
}