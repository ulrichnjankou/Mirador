import { useState } from "react";
import { X, Calculator, FileText, Download, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { TooltipLexique } from "./TooltipLexique";
import type { OfferFull } from "../../data/offersFull";
import type { InsuranceType, FirmQuote, QuoteInput } from "../../types/subscription";

interface ProductDataSheetProps {
  offer: OfferFull;
  insuranceType: InsuranceType;
  onClose: () => void;
  onQuoteCalculated: (quote: FirmQuote, input: QuoteInput) => void;
  onSubscribe: () => void;
  firmQuote?: FirmQuote;
}

export function ProductDataSheet({
  offer,
  insuranceType,
  onClose,
  onQuoteCalculated,
  onSubscribe,
  firmQuote
}: ProductDataSheetProps) {
  const [isCalculating, setIsCalculating] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const updateFormData = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[key]) {
      setErrors((prev: any) => ({ ...prev, [key]: null }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (insuranceType === "auto") {
      if (!formData.age || formData.age < 18 || formData.age > 100) newErrors.age = "Âge invalide";
      if (!formData.permis_annees || formData.permis_annees < 0) newErrors.permis_annees = "Requis";
      if (!formData.bonus_malus) newErrors.bonus_malus = "Requis";
      if (formData.sinistres_36m === undefined) newErrors.sinistres_36m = "Requis";
      if (!formData.marque) newErrors.marque = "Requis";
      if (!formData.modele) newErrors.modele = "Requis";
      if (!formData.mise_en_circ) newErrors.mise_en_circ = "Requis";
      if (!formData.energie) newErrors.energie = "Requis";
      if (!formData.puissance_fiscale) newErrors.puissance_fiscale = "Requis";
      if (!formData.usage) newErrors.usage = "Requis";
      if (!formData.stationnement) newErrors.stationnement = "Requis";
    } else if (insuranceType === "habitation") {
      if (!formData.type_logement) newErrors.type_logement = "Requis";
      if (!formData.surface || formData.surface < 10) newErrors.surface = "Surface invalide";
      if (!formData.pieces || formData.pieces < 1) newErrors.pieces = "Requis";
      if (!formData.code_postal) newErrors.code_postal = "Requis";
      if (!formData.securite) newErrors.securite = "Requis";
      if (!formData.valeur_contenu || formData.valeur_contenu < 0) newErrors.valeur_contenu = "Requis";
    } else if (insuranceType === "sante") {
      if (!formData.age || formData.age < 18) newErrors.age = "Âge invalide";
      if (!formData.situation_pro) newErrors.situation_pro = "Requis";
      if (!formData.regime_secu) newErrors.regime_secu = "Requis";
      if (!formData.departement) newErrors.departement = "Requis";
      if (!formData.niveau_couverture) newErrors.niveau_couverture = "Requis";
    } else if (insuranceType === "epargne") {
      if (!formData.versement_initial || formData.versement_initial < 100) newErrors.versement_initial = "Minimum 100€";
      if (formData.versement_mensuel === undefined) newErrors.versement_mensuel = "Requis (0 si aucun)";
      if (!formData.horizon || formData.horizon < 1) newErrors.horizon = "Minimum 1 an";
      if (formData.mandat === undefined) newErrors.mandat = "Requis";
      if (formData.uc_cible === undefined || formData.uc_cible < 0 || formData.uc_cible > 100) newErrors.uc_cible = "Entre 0 et 100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = async () => {
    if (!validateForm()) return;

    setIsCalculating(true);

    // Simulation de calcul (remplacer par appel API réel)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Calcul de majoration/réduction selon les critères
    let prixBase = offer.prix_annuel;
    const facteurs: { label: string; montant: number }[] = [];

    if (insuranceType === "auto") {
      // Bonus-malus
      if (formData.bonus_malus < 1) {
        const reduction = prixBase * (1 - formData.bonus_malus);
        facteurs.push({ label: `Bonus ${formData.bonus_malus}`, montant: -reduction });
        prixBase -= reduction;
      } else if (formData.bonus_malus > 1) {
        const majoration = prixBase * (formData.bonus_malus - 1);
        facteurs.push({ label: `Malus ${formData.bonus_malus}`, montant: majoration });
        prixBase += majoration;
      }

      // Sinistres
      if (formData.sinistres_36m > 0) {
        const majoration = 50 * formData.sinistres_36m;
        facteurs.push({ label: `${formData.sinistres_36m} sinistre(s) 36m`, montant: majoration });
        prixBase += majoration;
      }

      // Jeune conducteur
      if (formData.permis_annees < 3) {
        const majoration = prixBase * 0.3;
        facteurs.push({ label: "Jeune conducteur", montant: majoration });
        prixBase += majoration;
      }

      // Stationnement
      if (formData.stationnement === "Rue") {
        const majoration = 80;
        facteurs.push({ label: "Stationnement rue", montant: majoration });
        prixBase += majoration;
      } else if (formData.stationnement === "Garage fermé") {
        const reduction = 50;
        facteurs.push({ label: "Garage fermé", montant: -reduction });
        prixBase -= reduction;
      }
    } else if (insuranceType === "habitation") {
      // Surface
      if (formData.surface > 100) {
        const majoration = (formData.surface - 100) * 0.5;
        facteurs.push({ label: `Surface ${formData.surface}m²`, montant: majoration });
        prixBase += majoration;
      }

      // Sécurité
      if (formData.securite.includes("Alarme")) {
        const reduction = 30;
        facteurs.push({ label: "Système d'alarme", montant: -reduction });
        prixBase -= reduction;
      }

      // Valeur contenu élevée
      if (formData.valeur_contenu > 50000) {
        const majoration = (formData.valeur_contenu - 50000) / 1000;
        facteurs.push({ label: "Valeur contenu élevée", montant: majoration });
        prixBase += majoration;
      }
    } else if (insuranceType === "sante") {
      // Âge
      if (formData.age > 60) {
        const majoration = (formData.age - 60) * 15;
        facteurs.push({ label: `Âge ${formData.age} ans`, montant: majoration });
        prixBase += majoration;
      }

      // Alsace-Moselle (meilleure sécu)
      if (formData.regime_secu === "Alsace-Moselle") {
        const reduction = prixBase * 0.1;
        facteurs.push({ label: "Régime Alsace-Moselle", montant: -reduction });
        prixBase -= reduction;
      }
    } else if (insuranceType === "epargne") {
      // Pas de prix pour l'épargne, afficher projection
      prixBase = 0;
    }

    const quote: FirmQuote = {
      offerId: offer.id,
      prix_ferme: Math.round(prixBase),
      prix_mensuel: Math.round(prixBase / 12),
      franchise: offer.franchise,
      validite_jours: 30,
      facteurs_majoration: facteurs,
      total_base: offer.prix_annuel
    };

    setIsCalculating(false);
    onQuoteCalculated(quote, formData as QuoteInput);
  };

  return (
    <Sheet open={true} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-full overflow-y-auto p-0">
        <div className="max-w-7xl mx-auto">
          <SheetHeader className="p-8 border-b border-[#E5E7EB] bg-[#F9FAFB] sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#2563EB]/10 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-[#2563EB]" />
                </div>
                <div>
                  <SheetTitle className="text-2xl text-[#111827]">Tarif définitif gratuit</SheetTitle>
                  <SheetDescription className="text-base text-[#6B7280]">
                    {offer.assureur} • {offer.nom_offre}
                  </SheetDescription>
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
          </SheetHeader>

          <div className="p-8 max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Colonne gauche - Formulaire */}
              <div className="space-y-6">
                {/* Alert info */}
                <Alert className="border-[#2563EB] bg-[#2563EB]/5">
                  <AlertCircle className="h-5 w-5 text-[#2563EB]" />
                  <AlertDescription className="text-base text-[#111827]">
                    Les informations ci-dessous sont nécessaires pour calculer un <strong>tarif ferme garanti 30 jours</strong>.
                    Vos données sont sécurisées et conformes RGPD.
                  </AlertDescription>
                </Alert>

                {/* Formulaire selon type */}
                {insuranceType === "auto" && (
                  <AutoQuoteForm formData={formData} updateFormData={updateFormData} errors={errors} />
                )}
                {insuranceType === "habitation" && (
                  <HabitationQuoteForm formData={formData} updateFormData={updateFormData} errors={errors} />
                )}
                {insuranceType === "sante" && (
                  <SanteQuoteForm formData={formData} updateFormData={updateFormData} errors={errors} />
                )}
                {insuranceType === "epargne" && (
                  <EpargneQuoteForm formData={formData} updateFormData={updateFormData} errors={errors} />
                )}
              </div>

              {/* Colonne droite - Résultat & Actions */}
              <div className="space-y-6 lg:sticky lg:top-32 h-fit">
                {/* Résumé de l'offre */}
                <Card className="border-2 border-[#2563EB]/20 bg-gradient-to-br from-[#2563EB]/5 to-transparent">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                        <Shield className="h-8 w-8 text-[#2563EB]" />
                      </div>
                      <div>
                        <h3 className="text-xl text-[#111827] mb-1">{offer.assureur}</h3>
                        <p className="text-[#6B7280]">{offer.nom_offre}</p>
                        <Badge className="mt-2">{offer.niveau_couverture}</Badge>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6B7280]">Prix indicatif</span>
                        <span className="text-[#111827] font-medium">{offer.prix_annuel}€/an</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#6B7280]">Franchise</span>
                        <span className="text-[#111827] font-medium">{offer.franchise}€</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Résultat du calcul */}
                {firmQuote && (
                  <Card className="border-2 border-[#10B981] bg-gradient-to-br from-[#10B981]/10 to-transparent">
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-center space-x-3 text-[#10B981]">
                        <CheckCircle className="h-6 w-6" />
                        <h3 className="text-2xl text-[#111827]">Votre tarif définitif</h3>
                      </div>

                      <div className="text-center py-8 bg-white rounded-xl shadow-sm">
                        <div className="text-6xl text-[#2563EB]">
                          {firmQuote.prix_ferme}€
                        </div>
                        <p className="text-lg text-[#6B7280] mt-2">
                          Soit {firmQuote.prix_mensuel}€/mois
                        </p>
                        {firmQuote.franchise > 0 && (
                          <p className="text-sm text-[#6B7280] mt-3">
                            Franchise: {firmQuote.franchise}€
                          </p>
                        )}
                      </div>

                      {firmQuote.facteurs_majoration.length > 0 && (
                        <>
                          <Separator />
                          <div className="space-y-3">
                            <p className="text-sm font-medium text-[#6B7280]">Facteurs de tarification :</p>
                            {firmQuote.facteurs_majoration.map((facteur, idx) => (
                              <div key={idx} className="flex items-center justify-between text-base bg-white rounded-lg p-3">
                                <span className="text-[#111827]">{facteur.label}</span>
                                <span className={facteur.montant >= 0 ? "text-red-600 font-medium" : "text-[#10B981] font-medium"}>
                                  {facteur.montant >= 0 ? "+" : ""}{Math.round(facteur.montant)}€
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      <Alert className="border-[#F59E0B] bg-[#F59E0B]/5">
                        <AlertCircle className="h-5 w-5 text-[#F59E0B]" />
                        <AlertDescription className="text-sm text-[#111827]">
                          Tarif garanti pendant <strong>30 jours</strong>. Valable sous réserve d'exactitude des informations fournies.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="space-y-4">
                  {!firmQuote ? (
                    <Button
                      onClick={handleCalculate}
                      disabled={isCalculating}
                      className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-14 text-lg"
                      size="lg"
                    >
                      <Calculator className="h-6 w-6 mr-2" />
                      {isCalculating ? "Calcul en cours..." : "Calculer le tarif définitif"}
                    </Button>
                  ) : (
                    <Button
                      onClick={onSubscribe}
                      className="w-full bg-[#10B981] hover:bg-[#059669] text-white h-14 text-lg"
                      size="lg"
                    >
                      <Shield className="h-6 w-6 mr-2" />
                      Souscrire maintenant
                    </Button>
                  )}

                  <div className="flex items-center justify-center gap-6 text-base">
                    <a
                      href={offer.lien_pdf_ipid}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563EB] hover:underline flex items-center space-x-2"
                    >
                      <FileText className="h-5 w-5" />
                      <span>IPID</span>
                    </a>
                    <span className="text-[#E5E7EB]">•</span>
                    <a
                      href={offer.lien_cgv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#2563EB] hover:underline flex items-center space-x-2"
                    >
                      <Download className="h-5 w-5" />
                      <span>CGV</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Formulaire AUTO
function AutoQuoteForm({ formData, updateFormData, errors }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-[#111827] flex items-center space-x-2">
        <span>Profil conducteur</span>
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <span>Âge</span>
            <TooltipLexique term="Budget annuel" definition="Âge du conducteur principal" />
          </Label>
          <Input
            type="number"
            min="18"
            max="100"
            value={formData.age || ""}
            onChange={(e) => updateFormData("age", parseInt(e.target.value))}
            className={`transition-all ${errors.age ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
          {errors.age && <p className="text-xs text-red-600">{errors.age}</p>}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <span>Permis depuis (années)</span>
            <TooltipLexique term="Permis depuis" />
          </Label>
          <Input
            type="number"
            min="0"
            value={formData.permis_annees || ""}
            onChange={(e) => updateFormData("permis_annees", parseInt(e.target.value))}
            className={`transition-all ${errors.permis_annees ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
          {errors.permis_annees && <p className="text-xs text-red-600">{errors.permis_annees}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <span>Bonus-malus</span>
            <TooltipLexique term="Bonus-malus" />
          </Label>
          <Input
            type="number"
            step="0.01"
            min="0.5"
            max="3.5"
            placeholder="Ex: 0.50 ou 1.25"
            value={formData.bonus_malus || ""}
            onChange={(e) => updateFormData("bonus_malus", parseFloat(e.target.value))}
            className={`transition-all ${errors.bonus_malus ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
          {errors.bonus_malus && <p className="text-xs text-red-600">{errors.bonus_malus}</p>}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <span>Sinistres 36 mois</span>
            <TooltipLexique term="Sinistres 36m" />
          </Label>
          <Input
            type="number"
            min="0"
            max="10"
            value={formData.sinistres_36m ?? ""}
            onChange={(e) => updateFormData("sinistres_36m", parseInt(e.target.value))}
            className={`transition-all ${errors.sinistres_36m ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
          {errors.sinistres_36m && <p className="text-xs text-red-600">{errors.sinistres_36m}</p>}
        </div>
      </div>

      <Separator className="my-4" />

      <h3 className="text-[#111827]">Véhicule</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Marque</Label>
          <Input
            placeholder="Ex: Renault"
            value={formData.marque || ""}
            onChange={(e) => updateFormData("marque", e.target.value)}
            className={`transition-all ${errors.marque ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
        </div>

        <div className="space-y-2">
          <Label>Modèle</Label>
          <Input
            placeholder="Ex: Clio 5"
            value={formData.modele || ""}
            onChange={(e) => updateFormData("modele", e.target.value)}
            className={`transition-all ${errors.modele ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Mise en circulation</Label>
          <Input
            placeholder="MM/AAAA"
            value={formData.mise_en_circ || ""}
            onChange={(e) => updateFormData("mise_en_circ", e.target.value)}
            className={`transition-all ${errors.mise_en_circ ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <span>Puissance fiscale</span>
            <TooltipLexique term="Puissance fiscale" />
          </Label>
          <Input
            type="number"
            min="1"
            max="50"
            placeholder="Ex: 7"
            value={formData.puissance_fiscale || ""}
            onChange={(e) => updateFormData("puissance_fiscale", parseInt(e.target.value))}
            className={`transition-all ${errors.puissance_fiscale ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Énergie</Label>
        <Select
          value={formData.energie || ""}
          onValueChange={(val) => updateFormData("energie", val)}
        >
          <SelectTrigger className={`transition-all ${errors.energie ? "border-red-500" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Essence">Essence</SelectItem>
            <SelectItem value="Diesel">Diesel</SelectItem>
            <SelectItem value="Électrique">Électrique</SelectItem>
            <SelectItem value="Hybride">Hybride</SelectItem>
            <SelectItem value="GPL">GPL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <span>Usage</span>
            <TooltipLexique term="Usage professionnel" />
          </Label>
          <Select
            value={formData.usage || ""}
            onValueChange={(val) => updateFormData("usage", val)}
          >
            <SelectTrigger className={`transition-all ${errors.usage ? "border-red-500" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Personnel">Personnel</SelectItem>
              <SelectItem value="Professionnel">Professionnel</SelectItem>
              <SelectItem value="Mixte">Mixte</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <span>Stationnement</span>
            <TooltipLexique term="Stationnement" />
          </Label>
          <Select
            value={formData.stationnement || ""}
            onValueChange={(val) => updateFormData("stationnement", val)}
          >
            <SelectTrigger className={`transition-all ${errors.stationnement ? "border-red-500" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Garage fermé">Garage fermé</SelectItem>
              <SelectItem value="Parking couvert">Parking couvert</SelectItem>
              <SelectItem value="Parking découvert">Parking découvert</SelectItem>
              <SelectItem value="Rue">Rue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

// Formulaire HABITATION
function HabitationQuoteForm({ formData, updateFormData, errors }: any) {
  return (
    <div className="space-y-4 bg-[#2563EB]/5 p-6 rounded-xl">
      <h3 className="text-[#111827]">Décrire votre Logement</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type de logement</Label>
          <Select
            value={formData.type_logement || ""}
            onValueChange={(val) => updateFormData("type_logement", val)}
          >
            <SelectTrigger className={`transition-all ${errors.type_logement ? "border-red-500" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Appartement">Appartement</SelectItem>
              <SelectItem value="Maison">Maison</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Surface (m²)</Label>
          <Input
            type="number"
            min="10"
            max="1000"
            value={formData.surface || ""}
            onChange={(e) => updateFormData("surface", parseInt(e.target.value))}
            className={`transition-all ${errors.surface ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nombre de pièces</Label>
          <Input
            type="number"
            min="1"
            max="20"
            value={formData.pieces || ""}
            onChange={(e) => updateFormData("pieces", parseInt(e.target.value))}
            className={`transition-all ${errors.pieces ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
        </div>

        <div className="space-y-2">
          <Label>Code postal</Label>
          <Input
            placeholder="Ex: 75001"
            maxLength={5}
            value={formData.code_postal || ""}
            onChange={(e) => updateFormData("code_postal", e.target.value)}
            className={`transition-all ${errors.code_postal ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
        </div>
      </div>

      {formData.type_logement === "Appartement" && (
        <div className="space-y-2">
          <Label>Étage</Label>
          <Input
            type="number"
            min="0"
            max="50"
            placeholder="Ex: 3"
            value={formData.etage || ""}
            onChange={(e) => updateFormData("etage", parseInt(e.target.value))}
            className="transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label className="flex items-center space-x-2">
          <span>Sécurité</span>
          <TooltipLexique term="Sécurité" />
        </Label>
        <Select
          value={formData.securite || ""}
          onValueChange={(val) => updateFormData("securite", val)}
        >
          <SelectTrigger className={`transition-all ${errors.securite ? "border-red-500" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Aucune">Aucune</SelectItem>
            <SelectItem value="Serrure 3 points">Serrure 3 points</SelectItem>
            <SelectItem value="Alarme">Alarme</SelectItem>
            <SelectItem value="Alarme + Serrure 3 points">Alarme + Serrure 3 points</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center space-x-2">
          <span>Valeur du contenu (€)</span>
          <TooltipLexique term="Valeur du contenu" />
        </Label>
        <Input
          type="number"
          min="0"
          step="1000"
          placeholder="Ex: 30000"
          value={formData.valeur_contenu || ""}
          onChange={(e) => updateFormData("valeur_contenu", parseInt(e.target.value))}
          className={`transition-all ${errors.valeur_contenu ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
        />
      </div>
    </div>
  );
}

// Formulaire SANTÉ
function SanteQuoteForm({ formData, updateFormData, errors }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-[#111827]">Profil assuré</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Âge</Label>
          <Input
            type="number"
            min="18"
            max="100"
            value={formData.age || ""}
            onChange={(e) => updateFormData("age", parseInt(e.target.value))}
            className={`transition-all ${errors.age ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
        </div>

        <div className="space-y-2">
          <Label>Situation professionnelle</Label>
          <Select
            value={formData.situation_pro || ""}
            onValueChange={(val) => updateFormData("situation_pro", val)}
          >
            <SelectTrigger className={`transition-all ${errors.situation_pro ? "border-red-500" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Salarié">Salarié</SelectItem>
              <SelectItem value="Indépendant">Indépendant</SelectItem>
              <SelectItem value="Étudiant">Étudiant</SelectItem>
              <SelectItem value="Retraité">Retraité</SelectItem>
              <SelectItem value="Sans emploi">Sans emploi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <span>Régime Sécu</span>
            <TooltipLexique term="Régime sécu" />
          </Label>
          <Select
            value={formData.regime_secu || ""}
            onValueChange={(val) => updateFormData("regime_secu", val)}
          >
            <SelectTrigger className={`transition-all ${errors.regime_secu ? "border-red-500" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Général">Général</SelectItem>
              <SelectItem value="Alsace-Moselle">Alsace-Moselle</SelectItem>
              <SelectItem value="Étudiant">Étudiant</SelectItem>
              <SelectItem value="Agricole">Agricole</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Département</Label>
          <Input
            placeholder="Ex: 75"
            maxLength={3}
            value={formData.departement || ""}
            onChange={(e) => updateFormData("departement", e.target.value)}
            className={`transition-all ${errors.departement ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center space-x-2">
          <span>Niveau de couverture</span>
          <TooltipLexique term="Niveau de couverture" />
        </Label>
        <Select
          value={formData.niveau_couverture || ""}
          onValueChange={(val) => updateFormData("niveau_couverture", val)}
        >
          <SelectTrigger className={`transition-all ${errors.niveau_couverture ? "border-red-500" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Essentielle">Essentielle</SelectItem>
            <SelectItem value="Confort">Confort</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Formulaire ÉPARGNE-VIE
function EpargneQuoteForm({ formData, updateFormData, errors }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-[#111827]">Projet d'épargne</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Versement initial (€)</Label>
          <Input
            type="number"
            min="100"
            step="100"
            placeholder="Ex: 5000"
            value={formData.versement_initial || ""}
            onChange={(e) => updateFormData("versement_initial", parseInt(e.target.value))}
            className={`transition-all ${errors.versement_initial ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
          {errors.versement_initial && <p className="text-xs text-red-600">{errors.versement_initial}</p>}
        </div>

        <div className="space-y-2">
          <Label>Versement mensuel (€)</Label>
          <Input
            type="number"
            min="0"
            step="50"
            placeholder="Ex: 200"
            value={formData.versement_mensuel ?? ""}
            onChange={(e) => updateFormData("versement_mensuel", parseInt(e.target.value))}
            className={`transition-all ${errors.versement_mensuel ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Horizon (années)</Label>
          <Input
            type="number"
            min="1"
            max="50"
            placeholder="Ex: 15"
            value={formData.horizon || ""}
            onChange={(e) => updateFormData("horizon", parseInt(e.target.value))}
            className={`transition-all ${errors.horizon ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center space-x-2">
            <span>% Unités de compte</span>
            <TooltipLexique term="Unités de compte (UC)" />
          </Label>
          <Input
            type="number"
            min="0"
            max="100"
            placeholder="Ex: 50"
            value={formData.uc_cible ?? ""}
            onChange={(e) => updateFormData("uc_cible", parseInt(e.target.value))}
            className={`transition-all ${errors.uc_cible ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center space-x-2">
          <span>Type de gestion</span>
          <TooltipLexique term="Gestion pilotée" />
        </Label>
        <Select
          value={formData.mandat === undefined ? "" : String(formData.mandat)}
          onValueChange={(val) => updateFormData("mandat", val === "true")}
        >
          <SelectTrigger className={`transition-all ${errors.mandat ? "border-red-500" : "focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"}`}>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Gestion pilotée</SelectItem>
            <SelectItem value="false">Gestion libre</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}