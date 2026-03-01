import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface TooltipLexiqueProps {
  term: string;
  definition?: string;
  className?: string;
}

// Lexique des termes d'assurance
const lexique: { [key: string]: string } = {
  // Auto
  "Franchise": "Montant restant à votre charge en cas de sinistre. Plus elle est basse, mieux vous êtes protégé.",
  "Assistance 0km": "Service de dépannage dès le premier kilomètre, même devant chez vous.",
  "Bonus-malus": "Coefficient de réduction ou majoration appliqué à votre prime selon votre historique de conduite. 0.50 = 50% de réduction.",
  "Tous risques": "Formule la plus complète couvrant vos dommages même en cas de responsabilité.",
  "Tiers": "Formule minimale obligatoire couvrant uniquement les dommages causés à autrui.",
  "Tiers+": "Formule intermédiaire ajoutant vol, incendie et bris de glace au Tiers.",
  "Protection juridique": "Prise en charge des frais d'avocat et de procédure en cas de litige.",
  "Valeur à neuf": "Indemnisation du véhicule à sa valeur d'achat (et non vénale) pendant une période définie.",
  "Véhicule de remplacement": "Mise à disposition d'un véhicule pendant la réparation du vôtre.",
  
  // Habitation
  "Dégâts des eaux": "Couverture des dommages causés par fuites, ruptures de canalisations, infiltrations.",
  "Vol et vandalisme": "Protection contre le vol de vos biens et les dégradations volontaires.",
  "Responsabilité civile": "Couvre les dommages que vous ou votre famille pourriez causer à des tiers.",
  "Catastrophes naturelles": "Événements climatiques exceptionnels reconnus par arrêté ministériel.",
  "Valeur de contenu": "Montant total de vos biens mobiliers (meubles, électroménager, vêtements, objets de valeur).",
  "Relogement": "Prise en charge de votre hébergement temporaire si votre logement est inhabitable.",
  
  // Santé
  "Téléconsultation": "Consultation médicale à distance par vidéo, remboursée comme une consultation classique.",
  "Tiers payant": "Vous ne payez que la partie non remboursée, sans avancer les frais.",
  "Hospitalisation": "Taux de remboursement des frais d'hôpital au-delà de la Sécurité sociale. Ex: 200% = 2x le tarif SS.",
  "Optique": "Budget annuel pour lunettes, lentilles, chirurgie réfractive.",
  "Dentaire": "Taux de remboursement des soins dentaires. 300% = bon pour prothèses et orthodontie.",
  "Médecines douces": "Ostéopathie, acupuncture, homéopathie - souvent forfait annuel.",
  "Délai de remboursement": "Nombre de jours entre votre demande et le versement du remboursement.",
  "Régime Alsace-Moselle": "Régime local offrant une meilleure couverture de base (90% vs 70%).",
  
  // Épargne & Vie
  "Fonds euro": "Support d'investissement sécurisé avec capital garanti et rendement annuel.",
  "Unités de compte (UC)": "Supports d'investissement en actions, obligations, immobilier - non garantis mais potentiel de gain supérieur.",
  "Gestion pilotée": "Vos investissements sont gérés automatiquement par des professionnels selon votre profil de risque.",
  "Gestion libre": "Vous choisissez vous-même vos supports d'investissement et arbitrages.",
  "Frais de versement": "Pourcentage prélevé sur chaque versement. 0% = meilleur.",
  "Frais de gestion UC": "Frais annuels sur les unités de compte. Moins de 1% = compétitif.",
  "Arbitrage": "Transfert d'argent entre différents supports (ex: fonds euro vers UC).",
  "Rachat partiel": "Retrait d'une partie de votre épargne sans tout clôturer.",
  "RCI": "Rachat Capitaux Investis - délai pour récupérer votre argent en cas de rachat.",
  
  // Général
  "Score MIRADOR": "Note sur 100 calculée selon: Prix (50%), Couverture (25%), Service/NPS (25%).",
  "NPS": "Net Promoter Score - indicateur de satisfaction client de -100 à +100. >70 = excellent.",
  "Délai d'indemnisation": "Nombre de jours moyens pour recevoir votre indemnisation après déclaration de sinistre.",
  "IPID": "Document d'Information Produit d'assurance - résumé standardisé de 2 pages.",
  "CGV": "Conditions Générales de Vente - contrat complet détaillant toutes les garanties et exclusions.",
  "KYC": "Know Your Customer - vérification d'identité et origine des fonds (obligation légale).",
  "PEP": "Personne Politiquement Exposée - soumise à une vigilance renforcée.",
  "Mandat SEPA": "Autorisation de prélèvement bancaire automatique.",
};

export function TooltipLexique({ term, definition, className = "" }: TooltipLexiqueProps) {
  const def = definition || lexique[term] || `Définition de "${term}" non disponible.`;
  
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center justify-center text-[#6B7280] hover:text-[#2563EB] transition-colors ${className}`}
            aria-label={`Définition de ${term}`}
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm bg-[#111827] text-white p-3 text-sm" side="top">
          <p className="font-semibold mb-1">{term}</p>
          <p className="text-xs text-gray-200">{def}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
