import { Shield, Star, Eye, ArrowRight, TrendingUp, FileText, Download, Sparkles } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { TooltipLexique } from "./TooltipLexique";
import type { OfferFull } from "../../data/offersFull";

interface OffersGridProps {
  offers: OfferFull[];
  onTarifFerme: (offer: OfferFull) => void;
  onVoirDetail: (offer: OfferFull) => void;
  onVoirDocuments?: (offer: OfferFull) => void;
}

export function OffersGrid({ offers, onTarifFerme, onVoirDetail, onVoirDocuments }: OffersGridProps) {
  if (offers.length === 0) {
    return (
      <Card className="border-2 border-dashed border-[#E5E7EB] bg-[#F9FAFB]">
        <CardContent className="p-12 text-center">
          <Shield className="h-16 w-16 text-[#6B7280] mx-auto mb-4" />
          <h3 className="text-[#111827] mb-2">Aucune offre trouvée</h3>
          <p className="text-sm text-[#6B7280]">
            Essayez d'ajuster vos filtres pour voir plus de résultats
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          onTarifFerme={onTarifFerme}
          onVoirDetail={onVoirDetail}
          onVoirDocuments={onVoirDocuments}
        />
      ))}
    </div>
  );
}

function OfferCard({ 
  offer, 
  onTarifFerme,
  onVoirDetail,
  onVoirDocuments
}: { 
  offer: OfferFull; 
  onTarifFerme: (offer: OfferFull) => void;
  onVoirDetail: (offer: OfferFull) => void;
  onVoirDocuments?: (offer: OfferFull) => void;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-[#10B981]";
    if (score >= 70) return "bg-[#2563EB]";
    return "bg-[#6B7280]";
  };

  const getBadgeVariant = (badge: string) => {
    if (badge.includes("Meilleure")) return "default";
    if (badge.includes("rapide")) return "secondary";
    return "outline";
  };

  const getDistributeurColor = (cat: string) => {
    switch (cat) {
      case "Mutuelle": return "text-[#10B981]";
      case "Insurtech": return "text-[#2563EB]";
      case "Bancassureur": return "text-[#6366F1]";
      default: return "text-[#6B7280]";
    }
  };

  // Calcul prix mensuel pour non-épargne
  const prixMensuel = offer.type_assurance !== "epargne" 
    ? (offer.prix_annuel / 12).toFixed(2)
    : null;

  return (
    <Card className="bg-white border-[#E5E7EB] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl">
      <CardContent className="p-6 space-y-4">
        {/* En-tête avec logo et assureur */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-12 bg-[#2563EB]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-[#2563EB]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#111827] truncate">{offer.assureur}</h3>
                <p className="text-sm text-[#6B7280] truncate">{offer.nom_offre}</p>
              </div>
            </div>
          </div>

          {/* Catégorie distributeur */}
          <div className="flex items-center space-x-2">
            <span className={`text-xs ${getDistributeurColor(offer.categorie_distributeur)}`}>
              {offer.categorie_distributeur}
            </span>
          </div>

          {/* Badges */}
          {offer.label_meilleure_offre && (
            <Badge className="bg-[#10B981] text-white text-xs">
              ⭐ {offer.label_meilleure_offre}
            </Badge>
          )}
        </div>

        <Separator />

        {/* Prix */}
        {offer.type_assurance !== "epargne" ? (
          <div className="text-center py-3 bg-[#F9FAFB] rounded-lg">
            <div className="text-3xl text-[#2563EB]">
              {offer.prix_annuel}€
            </div>
            <p className="text-xs text-[#6B7280] mt-1 flex items-center justify-center space-x-1">
              <span>{prixMensuel}€/mois</span>
              {offer.franchise > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center">
                    Franchise: {offer.franchise}€
                    <TooltipLexique term="Franchise" className="ml-1" />
                  </span>
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="text-center py-3 bg-[#F9FAFB] rounded-lg">
            <p className="text-sm text-[#6B7280]">Contrat d'épargne</p>
            <p className="text-xs text-[#6B7280] mt-1">
              {offer.frais_versement ? `Frais versement: ${offer.frais_versement}%` : "Sans frais d'entrée"}
              {" • "}
              Gestion UC: {offer.frais_gestion_uc}%
            </p>
          </div>
        )}

        {/* Score MIRADOR */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-[#2563EB]" />
              <span className="text-sm text-[#111827]">Score MIRADOR</span>
              <TooltipLexique term="Score MIRADOR" />
            </div>
            <span className="text-[#111827]">{offer.score_mirador}/100</span>
          </div>
          <Progress 
            value={offer.score_mirador} 
            className={`h-2 [&>div]:${getScoreColor(offer.score_mirador)}`}
          />
        </div>

        <Separator />

        {/* Garanties principales */}
        <div className="space-y-2">
          <p className="text-sm text-[#111827]">Garanties principales</p>
          <div className="space-y-1.5">
            {offer.garanties_principales.slice(0, 4).map((garantie, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs text-[#6B7280]">
                <span className="flex-shrink-0 text-[#10B981]">✓</span>
                <span className="leading-tight flex-1">{garantie}</span>
              </div>
            ))}
            {offer.garanties_principales.length > 4 && (
              <p className="text-xs text-[#2563EB] cursor-pointer hover:underline">
                +{offer.garanties_principales.length - 4} autres garanties
              </p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-2 pt-2">
          <Button 
            variant="default"
            className="w-full bg-gradient-to-r from-[#2563EB] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white shadow-md hover:shadow-lg transition-all"
            onClick={() => onVoirDetail(offer)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Voir le détail complet
          </Button>
          
          <Button 
            onClick={() => onTarifFerme(offer)}
            className="w-full bg-[#10B981] hover:bg-[#059669] text-white shadow-sm hover:shadow-md transition-all"
          >
            Obtenir un tarif définitif
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* NPS et délai */}
        <div className="flex items-center justify-between text-xs text-[#6B7280] pt-2 border-t border-[#E5E7EB]">
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>NPS: {offer.nps_client}/100</span>
            <TooltipLexique term="NPS" />
          </div>
          {offer.delai_indemn_j > 0 && (
            <div className="flex items-center space-x-1">
              <span>Indemnisation: ~{offer.delai_indemn_j}j</span>
              <TooltipLexique term="Délai d'indemnisation" />
            </div>
          )}
        </div>

        {/* Synthèse IA des documents */}
        {onVoirDocuments && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs border-[#10B981] text-[#10B981] hover:bg-[#10B981]/5"
              onClick={() => onVoirDocuments(offer)}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Synthèse IA des documents
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}