import { Shield, Star, ChevronRight, Info } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

interface OfferCardMobileProps {
  id: number;
  assureur: string;
  logo?: string;
  produit: string;
  prix: number;
  prixBarre?: number;
  economie?: number;
  scoreMirador: number;
  garantiesEssentielles: string[];
  onVoir: () => void;
  isBestOffer?: boolean;
  variant?: 'mobile' | 'desktop';
}

export function OfferCardMobile({
  id,
  assureur,
  logo,
  produit,
  prix,
  prixBarre,
  economie,
  scoreMirador,
  garantiesEssentielles,
  onVoir,
  isBestOffer = false,
  variant = 'mobile'
}: OfferCardMobileProps) {
  // Variante Mobile : Épurée et verticale
  if (variant === 'mobile') {
    return (
      <div
        className={cn(
          "bg-white rounded-xl border-2 p-4 shadow-sm transition-all active:scale-[0.98]",
          isBestOffer
            ? "border-[#10B981] bg-gradient-to-br from-[#10B981]/5 to-white"
            : "border-[#E5E7EB] hover:border-[#2563EB]/30"
        )}
      >
        {/* Badge Meilleure Offre */}
        {isBestOffer && (
          <div className="flex items-center gap-2 mb-3 -mt-1">
            <Badge className="bg-[#10B981] text-white border-0 px-2 py-1">
              <Star className="h-3 w-3 mr-1 fill-white" />
              Meilleure offre
            </Badge>
          </div>
        )}

        {/* Header : Logo + Nom */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {logo ? (
              <img
                src={logo}
                alt={assureur}
                className="w-12 h-12 object-contain rounded-lg border border-[#E5E7EB] p-1"
              />
            ) : (
              <div className="w-12 h-12 bg-[#F9FAFB] rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-[#6B7280]" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-[#111827]">{assureur}</h3>
              <p className="text-sm text-[#6B7280]">{produit}</p>
            </div>
          </div>

          {/* Score Mirador */}
          <div className="flex flex-col items-center bg-[#2563EB]/10 rounded-lg px-2 py-1">
            <div className="flex items-center gap-0.5">
              <span className="text-xl font-bold text-[#2563EB]">{scoreMirador}</span>
              <span className="text-xs text-[#6B7280]">/10</span>
            </div>
            <span className="text-[9px] text-[#6B7280] uppercase tracking-wide">
              Score
            </span>
          </div>
        </div>

        {/* Prix : Gros et centré */}
        <div className="mb-4 py-3 border-y border-[#E5E7EB]">
          <div className="flex items-baseline justify-center gap-2">
            {prixBarre && (
              <span className="text-lg text-[#6B7280] line-through">
                {prixBarre}€
              </span>
            )}
            <span className="text-3xl font-bold text-[#2563EB]">{prix}€</span>
            <span className="text-[#6B7280]">/mois</span>
          </div>
          {economie && (
            <p className="text-center text-sm text-[#10B981] font-medium mt-1">
              Économisez {economie}€/an
            </p>
          )}
        </div>

        {/* Garanties essentielles : Max 3 */}
        <div className="space-y-2 mb-4">
          {garantiesEssentielles.slice(0, 3).map((garantie, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full flex-shrink-0" />
              <span className="text-[#111827] line-clamp-1">{garantie}</span>
            </div>
          ))}
          {garantiesEssentielles.length > 3 && (
            <button className="flex items-center gap-1 text-xs text-[#2563EB] font-medium">
              <Info className="h-3 w-3" />
              +{garantiesEssentielles.length - 3} garanties
            </button>
          )}
        </div>

        {/* CTA : Bouton large */}
        <Button
          onClick={onVoir}
          className={cn(
            "w-full py-6 text-base font-semibold",
            isBestOffer
              ? "bg-[#10B981] hover:bg-[#059669]"
              : "bg-[#2563EB] hover:bg-[#1d4ed8]"
          )}
        >
          Voir l'offre
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    );
  }

  // Variante Desktop : Grille horizontale (comportement existant)
  return (
    <div
      className={cn(
        "bg-white rounded-xl border-2 p-6 shadow-sm transition-all hover:shadow-md",
        isBestOffer
          ? "border-[#10B981] bg-gradient-to-br from-[#10B981]/5 to-white"
          : "border-[#E5E7EB] hover:border-[#2563EB]/30"
      )}
    >
      {isBestOffer && (
        <Badge className="bg-[#10B981] text-white mb-4">
          <Star className="h-3 w-3 mr-1 fill-white" />
          Meilleure offre
        </Badge>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {logo ? (
            <img
              src={logo}
              alt={assureur}
              className="w-16 h-16 object-contain"
            />
          ) : (
            <div className="w-16 h-16 bg-[#F9FAFB] rounded-lg flex items-center justify-center">
              <Shield className="h-8 w-8 text-[#6B7280]" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg text-[#111827]">{assureur}</h3>
            <p className="text-[#6B7280]">{produit}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-baseline gap-2">
            {prixBarre && (
              <span className="text-lg text-[#6B7280] line-through">
                {prixBarre}€
              </span>
            )}
            <span className="text-3xl font-bold text-[#2563EB]">{prix}€</span>
            <span className="text-[#6B7280]">/mois</span>
          </div>
          {economie && (
            <p className="text-sm text-[#10B981] font-medium mt-1">
              Économisez {economie}€/an
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {garantiesEssentielles.map((garantie, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-[#F9FAFB] rounded-full text-sm text-[#111827]"
            >
              {garantie}
            </span>
          ))}
        </div>

        <Button onClick={onVoir} className="ml-4">
          Voir l'offre
        </Button>
      </div>
    </div>
  );
}

// Composant wrapper qui détecte la taille d'écran
export function ResponsiveOfferCard(props: OfferCardMobileProps) {
  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <OfferCardMobile {...props} variant="mobile" />
      </div>
      
      {/* Desktop */}
      <div className="hidden md:block">
        <OfferCardMobile {...props} variant="desktop" />
      </div>
    </>
  );
}
