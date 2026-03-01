import { useState } from "react";
import { Car, Home, Heart, Wallet, ArrowRight, Search, Check } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { UserType } from "../types";

interface AccueilProps {
  onUserTypeSelect: (userType: UserType) => void;
  onProductSelect: (userType: UserType, productType: string) => void;
}

// Usages courants (UNIQUEMENT particuliers)
const commonUsages = [
  {
    text: "Automobile et habitation",
    icon: Car,
    userType: "particulier" as UserType,
    product: "auto",
  },
  {
    text: "Santé & prévoyance",
    icon: Heart,
    userType: "particulier" as UserType,
    product: "sante",
  },
  {
    text: "Épargne & assurance vie",
    icon: Wallet,
    userType: "particulier" as UserType,
    product: "vie",
  }
];

export function Accueil({ onUserTypeSelect, onProductSelect }: AccueilProps) {
  const [aiQuery, setAiQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAiSearch = () => {
    if (aiQuery.trim()) {
      setIsAnalyzing(true);
      
      // Simulation d'analyse IA (délai pour effet visuel)
      setTimeout(() => {
        // Détection du type de produit par mots-clés
        const query = aiQuery.toLowerCase();
        let detectedProduct = "auto"; // Par défaut
        
        // Détection Auto
        if (query.match(/auto|voiture|véhicule|citadine|suv|berline|4x4|moto|scooter|permis|conduire|collision|stationnement/i)) {
          detectedProduct = "auto";
        }
        // Détection Habitation
        else if (query.match(/maison|logement|appartement|habitation|résidence|propriétaire|locataire|mrh|dégât|incendie|cambriolage|inondation/i)) {
          detectedProduct = "habitation";
        }
        // Détection Santé
        else if (query.match(/santé|mutuelle|médecin|hôpital|soins|dentiste|optique|lunettes|hospitalisation|maladie|prévoyance/i)) {
          detectedProduct = "sante";
        }
        // Détection Épargne/Vie
        else if (query.match(/épargne|vie|assurance vie|placement|investir|retraite|capital|fiscalité|succession|pea|uc/i)) {
          detectedProduct = "vie";
        }
        
        setIsAnalyzing(false);
        onProductSelect("particulier", detectedProduct);
      }, 1500);
    }
  };

  const handleUsageClick = (usage: typeof commonUsages[0]) => {
    onProductSelect(usage.userType, usage.product);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAiSearch();
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#F9FAFB] to-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl tracking-tight text-[#111827]">
            Votre assurance, en toute simplicité
          </h1>
          
          <p className="text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto">
            Décrivez votre besoin ou explorez nos solutions.
          </p>
        </div>
      </div>

      {/* Deux cartes principales */}
      <div className="max-w-5xl mx-auto px-4 -mt-8 mb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Carte 1 : Je décris mon besoin */}
          <Card className="bg-white border-2 border-[#E5E7EB] hover:border-[#2563EB]/30 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <h3 className="text-[#111827]">Je décris mon besoin</h3>
                <p className="text-sm text-[#6B7280]">
                  Exprimez votre situation en langage naturel, notre IA trouve les meilleures offres.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Ex: Je cherche une assurance auto pour une citadine..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="h-14 text-lg transition-all focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAiSearch();
                    }
                  }}
                />
                
                <Button 
                  onClick={handleAiSearch}
                  disabled={!aiQuery.trim() || isAnalyzing}
                  className="w-full h-12 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyser ma demande
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Carte 2 : Je choisis un usage courant */}
          <Card className="bg-white border-2 border-[#E5E7EB] hover:border-[#2563EB]/30 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <h3 className="text-[#111827]">Je choisis un usage courant</h3>
                <p className="text-sm text-[#6B7280]">
                  Sélectionnez rapidement le type d'assurance dont vous avez besoin.
                </p>
              </div>

              <div className="space-y-3">
                {commonUsages.map((usage, index) => {
                  const Icon = usage.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleUsageClick(usage)}
                      className="w-full flex items-center space-x-4 p-4 rounded-lg border-2 border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] hover:border-[#2563EB]/30 transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-[#111827] group-hover:text-[#2563EB] transition-colors">
                        {usage.text}
                      </span>
                      <ArrowRight className="h-4 w-4 ml-auto text-[#6B7280] group-hover:text-[#2563EB] transition-colors" />
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section Comment ça marche */}
      <div className="bg-[#F9FAFB] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-2xl md:text-3xl text-[#111827] mb-12">
            Comment ça marche ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Étape 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#2563EB] flex items-center justify-center">
                <span className="text-2xl text-white">1</span>
              </div>
              <h3 className="text-[#111827]">Décrivez votre besoin</h3>
              <p className="text-sm text-[#6B7280]">
                En quelques mots ou via nos suggestions, exprimez ce que vous recherchez.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#2563EB] flex items-center justify-center">
                <span className="text-2xl text-white">2</span>
              </div>
              <h3 className="text-[#111827]">Comparez les offres</h3>
              <p className="text-sm text-[#6B7280]">
                Notre moteur analyse 30 assureurs et classe les résultats selon vos critères.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#10B981] flex items-center justify-center">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-[#111827]">Choisissez sereinement</h3>
              <p className="text-sm text-[#6B7280]">
                Souscrivez 100% en ligne avec transparence, sécurité et conformité garanties.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lien vers la transparence */}
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <a href="#" className="text-sm text-[#6B7280] hover:text-[#2563EB] transition-colors underline">
          → En savoir plus sur notre méthodologie de classement
        </a>
      </div>
    </div>
  );
}