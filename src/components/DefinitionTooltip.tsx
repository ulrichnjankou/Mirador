import { ReactNode } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Info, Shield, Calculator, Clock, Target, Heart, Car, Home, Building, Coins, Users, AlertTriangle, Star } from "lucide-react";

// Base de données complète des définitions d'assurance MIRADOR
const definitions: Record<string, {
  title: string;
  definition: string;
  example?: string;
  icon?: ReactNode;
  category: 'financial' | 'coverage' | 'legal' | 'time' | 'risk' | 'product' | 'health' | 'auto' | 'property' | 'professional';
}> = {
  
  // =========================
  // TERMES FINANCIERS
  // =========================
  
  'franchise': {
    title: 'Franchise',
    definition: 'Montant qui reste à votre charge en cas de sinistre, non remboursé par l\'assureur.',
    example: 'Avec une franchise de 300€, si les réparations coûtent 1000€, vous payez 300€ et l\'assureur 700€.',
    icon: <Calculator className="h-4 w-4" />,
    category: 'financial'
  },
  'frais de gestion': {
    title: 'Frais de gestion',
    definition: 'Coûts administratifs prélevés par l\'assureur pour la gestion de votre contrat.',
    example: 'Généralement entre 0,5% et 1% de la prime annuelle.',
    icon: <Calculator className="h-4 w-4" />,
    category: 'financial'
  },
  'prime': {
    title: 'Prime d\'assurance',
    definition: 'Montant que vous payez à l\'assureur en contrepartie de la couverture d\'assurance.',
    example: 'Prime annuelle de 480€ ou mensuelle de 40€.',
    icon: <Calculator className="h-4 w-4" />,
    category: 'financial'
  },
  'cotisation': {
    title: 'Cotisation',
    definition: 'Synonyme de prime d\'assurance, montant payé pour bénéficier de la couverture.',
    icon: <Calculator className="h-4 w-4" />,
    category: 'financial'
  },
  'plafond': {
    title: 'Plafond de garantie',
    definition: 'Montant maximum que l\'assureur versera en cas de sinistre pour une garantie donnée.',
    example: 'Plafond de 100 000€ pour les dommages matériels.',
    icon: <Target className="h-4 w-4" />,
    category: 'financial'
  },
  'rachat': {
    title: 'Valeur de rachat',
    definition: 'Montant que vous pouvez récupérer en cas de résiliation anticipée d\'un contrat d\'épargne.',
    example: 'Après 8 ans, rachat sans pénalités fiscales sur l\'assurance vie.',
    icon: <Coins className="h-4 w-4" />,
    category: 'financial'
  },
  'vétusté': {
    title: 'Vétusté',
    definition: 'Dépréciation de la valeur d\'un bien due à l\'usure normale et au temps.',
    example: 'Un ordinateur de 3 ans a une vétusté de 50% environ.',
    icon: <Calculator className="h-4 w-4" />,
    category: 'financial'
  },
  'budget annuel': {
    title: 'Budget annuel',
    definition: 'Montant maximum que vous souhaitez consacrer par an à votre assurance.',
    example: 'Un budget de 500€/an pour une assurance habitation.',
    icon: <Calculator className="h-4 w-4" />,
    category: 'financial'
  },
  'score mirador': {
    title: 'Score MIRADOR',
    definition: 'Note globale sur 100 calculée par notre algorithme pour classer les offres. Basée sur Prix (50%), Couverture (25%) et Service/NPS (25%).',
    example: 'Une offre à 92/100 est excellente, entre 70-85 est bonne, en-dessous de 70 est moyenne.',
    icon: <Star className="h-4 w-4" />,
    category: 'product'
  },

  // =========================
  // PRODUITS D'ASSURANCE
  // =========================

  'tous risques': {
    title: 'Assurance tous risques',
    definition: 'Formule d\'assurance automobile la plus complète couvrant la plupart des dommages à votre véhicule.',
    example: 'Couvre collision, vol, vandalisme, catastrophes naturelles, bris de glace, etc.',
    icon: <Car className="h-4 w-4" />,
    category: 'auto'
  },
  'tiers': {
    title: 'Responsabilité civile (Tiers)',
    definition: 'Garantie obligatoire qui couvre les dommages que vous pourriez causer à autrui.',
    example: 'Obligatoire pour tous les véhicules, ne couvre pas vos propres dommages.',
    icon: <Shield className="h-4 w-4" />,
    category: 'auto'
  },
  'multirisque': {
    title: 'Multirisque habitation',
    definition: 'Contrat global couvrant votre logement et vos biens contre de nombreux risques.',
    example: 'Incendie, dégâts des eaux, vol, responsabilité civile vie privée.',
    icon: <Home className="h-4 w-4" />,
    category: 'property'
  },
  'per': {
    title: 'Plan d\'Épargne Retraite',
    definition: 'Produit d\'épargne retraite permettant de se constituer un complément de revenus.',
    example: 'Déduction fiscale des versements, sortie en capital ou rente.',
    icon: <Coins className="h-4 w-4" />,
    category: 'product'
  },
  'per individuel': {
    title: 'PER Individuel',
    definition: 'Plan d\'épargne retraite ouvert à tous, avec avantages fiscaux et gestion flexible.',
    example: 'Versements déductibles, sortie flexible à partir de 62 ans.',
    icon: <Coins className="h-4 w-4" />,
    category: 'product'
  },

  // =========================
  // COUVERTURES ET GARANTIES
  // =========================

  'assistance': {
    title: 'Assistance',
    definition: 'Services d\'aide et de dépannage disponibles 24h/24 en cas de problème.',
    example: 'Remorquage, véhicule de remplacement, rapatriement.',
    icon: <Shield className="h-4 w-4" />,
    category: 'coverage'
  },
  'protection juridique': {
    title: 'Protection juridique',
    definition: 'Garantie qui vous assiste et vous défend en cas de litige ou de procédure judiciaire.',
    example: 'Prise en charge des frais d\'avocat, de procédure, médiation.',
    icon: <Shield className="h-4 w-4" />,
    category: 'legal'
  },
  'responsabilité civile': {
    title: 'Responsabilité civile',
    definition: 'Garantie couvrant les dommages que vous pourriez causer à des tiers.',
    example: 'Dommages corporels ou matériels causés à autrui par négligence.',
    icon: <Shield className="h-4 w-4" />,
    category: 'coverage'
  },
  'dégâts des eaux': {
    title: 'Dégâts des eaux',
    definition: 'Garantie couvrant les dommages causés par une fuite d\'eau accidentelle.',
    example: 'Fuite de canalisation, débordement de baignoire, infiltration.',
    icon: <Home className="h-4 w-4" />,
    category: 'property'
  },
  'vol': {
    title: 'Garantie vol',
    definition: 'Couverture contre le vol de vos biens ou de votre véhicule.',
    example: 'Vol à main armée, cambriolage, vol du véhicule.',
    icon: <Shield className="h-4 w-4" />,
    category: 'coverage'
  },
  'incendie': {
    title: 'Garantie incendie',
    definition: 'Couverture des dommages causés par un incendie à vos biens.',
    example: 'Incendie accidentel, explosion, foudre.',
    icon: <Home className="h-4 w-4" />,
    category: 'property'
  },

  // =========================
  // SANTÉ ET PRÉVOYANCE
  // =========================

  'tiers payant': {
    title: 'Tiers payant',
    definition: 'Système permettant d\'éviter l\'avance de frais chez les professionnels de santé.',
    example: 'Votre mutuelle règle directement le médecin ou la pharmacie.',
    icon: <Heart className="h-4 w-4" />,
    category: 'health'
  },
  'ticket modérateur': {
    title: 'Ticket modérateur',
    definition: 'Part des dépenses de santé qui reste à votre charge après remboursement Sécurité sociale.',
    example: '20% des frais médicaux en général, 30% pour les spécialistes.',
    icon: <Heart className="h-4 w-4" />,
    category: 'health'
  },
  'forfait journalier': {
    title: 'Forfait journalier hospitalier',
    definition: 'Participation financière aux frais d\'hébergement lors d\'une hospitalisation.',
    example: '22€ par jour en hôpital, 13,50€ en psychiatrie (2024).',
    icon: <Heart className="h-4 w-4" />,
    category: 'health'
  },
  'ipt': {
    title: 'Invalidité Permanente Totale',
    definition: 'État d\'incapacité définitive à exercer une activité professionnelle.',
    example: 'Taux d\'invalidité supérieur à 66% reconnu par expertise médicale.',
    icon: <Heart className="h-4 w-4" />,
    category: 'health'
  },
  'ipp': {
    title: 'Invalidité Permanente Partielle',
    definition: 'Incapacité partielle et définitive à exercer une activité professionnelle.',
    example: 'Taux d\'invalidité entre 10% et 66% selon barème médical.',
    icon: <Heart className="h-4 w-4" />,
    category: 'health'
  },

  // =========================
  // TERMES TEMPORELS
  // =========================

  'carence': {
    title: 'Délai de carence',
    definition: 'Période pendant laquelle vous cotisez sans pouvoir bénéficier des garanties.',
    example: 'Carence de 3 mois pour les garanties hospitalisation.',
    icon: <Clock className="h-4 w-4" />,
    category: 'time'
  },
  'préavis': {
    title: 'Préavis',
    definition: 'Délai à respecter pour informer l\'assureur d\'une modification ou résiliation.',
    example: 'Préavis de 2 mois pour résilier à l\'échéance.',
    icon: <Clock className="h-4 w-4" />,
    category: 'time'
  },
  'échéance': {
    title: 'Échéance',
    definition: 'Date à laquelle votre contrat arrive à terme et doit être renouvelé.',
    example: 'Échéance annuelle le 15 janvier.',
    icon: <Clock className="h-4 w-4" />,
    category: 'time'
  },
  'reconduction': {
    title: 'Reconduction tacite',
    definition: 'Renouvellement automatique du contrat si aucune des parties ne le résilie.',
    example: 'Contrat renouvelé automatiquement chaque année sauf résiliation.',
    icon: <Clock className="h-4 w-4" />,
    category: 'time'
  },

  // =========================
  // GESTION DES RISQUES
  // =========================

  'bonus-malus': {
    title: 'Coefficient bonus-malus',
    definition: 'Système de réduction ou majoration de votre prime selon votre historique de sinistres.',
    example: 'Bonus de 0,50 = 50% de réduction, malus de 1,25 = 25% de majoration.',
    icon: <Target className="h-4 w-4" />,
    category: 'risk'
  },
  'sinistre': {
    title: 'Sinistre',
    definition: 'Événement dommageable prévu au contrat donnant lieu à une indemnisation.',
    example: 'Accident de voiture, cambriolage, incendie, dégât des eaux.',
    icon: <AlertTriangle className="h-4 w-4" />,
    category: 'risk'
  },
  'expertise': {
    title: 'Expertise',
    definition: 'Évaluation technique des dommages par un professionnel mandaté par l\'assureur.',
    example: 'Expert automobile pour évaluer les dégâts après un accident.',
    icon: <Target className="h-4 w-4" />,
    category: 'risk'
  },
  'contre-expertise': {
    title: 'Contre-expertise',
    definition: 'Seconde expertise demandée en cas de désaccord sur l\'évaluation des dommages.',
    example: 'Vous pouvez demander une contre-expertise si vous contestez l\'évaluation.',
    icon: <Target className="h-4 w-4" />,
    category: 'risk'
  },

  // =========================
  // ASSURANCE PROFESSIONNELLE
  // =========================

  'rc professionnelle': {
    title: 'Responsabilité Civile Professionnelle',
    definition: 'Assurance couvrant les dommages causés à des tiers dans le cadre de votre activité.',
    example: 'Erreur professionnelle, dommage causé par un produit ou service.',
    icon: <Building className="h-4 w-4" />,
    category: 'professional'
  },
  'exploitation': {
    title: 'Responsabilité civile exploitation',
    definition: 'Couverture des dommages causés par l\'activité courante de l\'entreprise.',
    example: 'Client qui se blesse dans vos locaux, dégâts causés par vos employés.',
    icon: <Building className="h-4 w-4" />,
    category: 'professional'
  },
  'décennale': {
    title: 'Assurance décennale',
    definition: 'Assurance obligatoire du bâtiment couvrant les dommages pendant 10 ans.',
    example: 'Défauts compromettant la solidité ou rendant l\'ouvrage impropre.',
    icon: <Building className="h-4 w-4" />,
    category: 'professional'
  },
  'cyber-risques': {
    title: 'Assurance cyber-risques',
    definition: 'Protection contre les risques informatiques et de sécurité des données.',
    example: 'Piratage, perte de données, interruption d\'activité informatique.',
    icon: <Shield className="h-4 w-4" />,
    category: 'professional'
  },

  // =========================
  // TERMES SPÉCIALISÉS
  // =========================

  'fonds euros': {
    title: 'Fonds en euros',
    definition: 'Support d\'investissement sécurisé avec garantie en capital dans l\'assurance vie.',
    example: 'Rendement de 2% à 3% par an avec capital garanti.',
    icon: <Coins className="h-4 w-4" />,
    category: 'product'
  },
  'unités de compte': {
    title: 'Unités de compte',
    definition: 'Supports d\'investissement sans garantie en capital, liés aux marchés financiers.',
    example: 'Actions, obligations, OPCVM avec risque de perte en capital.',
    icon: <Coins className="h-4 w-4" />,
    category: 'product'
  },
  'clause bénéficiaire': {
    title: 'Clause bénéficiaire',
    definition: 'Disposition désignant la personne qui recevra le capital en cas de décès.',
    example: 'Mon conjoint à défaut mes enfants nés ou à naître par parts égales.',
    icon: <Users className="h-4 w-4" />,
    category: 'legal'
  },
  'avance sur succession': {
    title: 'Avance sur succession',
    definition: 'Possibilité d\'obtenir une avance sur l\'héritage en cas de besoin urgent.',
    example: 'Jusqu\'à 80% de la succession en attendant le règlement définitif.',
    icon: <Coins className="h-4 w-4" />,
    category: 'legal'
  },
  'valeur à neuf': {
    title: 'Garantie valeur à neuf',
    definition: 'Remboursement du prix d\'achat d\'un bien sans déduction de vétusté.',
    example: 'Votre téléviseur acheté 800€ remboursé 800€ même après 2 ans.',
    icon: <Shield className="h-4 w-4" />,
    category: 'coverage'
  },
  'relogement': {
    title: 'Garantie relogement',
    definition: 'Prise en charge d\'un logement temporaire si le vôtre devient inhabitable.',
    example: 'Hôtel ou location meublée pendant les travaux après sinistre.',
    icon: <Home className="h-4 w-4" />,
    category: 'coverage'
  },
  'téléconsultation': {
    title: 'Téléconsultation',
    definition: 'Consultation médicale à distance par vidéo ou téléphone.',
    example: 'Consultation de 25€ remboursée comme une consultation classique.',
    icon: <Heart className="h-4 w-4" />,
    category: 'health'
  },
  'réseau de soins': {
    title: 'Réseau de soins',
    definition: 'Professionnels de santé partenaires proposant des tarifs préférentiels.',
    example: 'Optique, dentaire avec tiers payant et tarifs négociés.',
    icon: <Heart className="h-4 w-4" />,
    category: 'health'
  },
  'dépassement d\'honoraires': {
    title: 'Dépassement d\'honoraires',
    definition: 'Montant facturé par un médecin au-delà du tarif conventionné.',
    example: 'Consultation à 50€ alors que le tarif conventionné est de 25€.',
    icon: <Heart className="h-4 w-4" />,
    category: 'health'
  }
};

interface DefinitionTooltipProps {
  term: string;
  children?: ReactNode;
  className?: string;
}

export function DefinitionTooltip({ term, children, className = "" }: DefinitionTooltipProps) {
  // Normaliser le terme pour la recherche (minuscules, sans accents)
  const normalizedTerm = term.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const definition = definitions[normalizedTerm];

  if (!definition) {
    // Si pas de définition, retourner juste une icône info
    return (
      <Info className="h-3 w-3 text-[#6B7280] inline-block ml-1" />
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial': return 'text-green-600 bg-green-50 border-green-200';
      case 'coverage': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'legal': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'time': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'risk': return 'text-red-600 bg-red-50 border-red-200';
      case 'product': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'health': return 'text-pink-600 bg-pink-50 border-pink-200';
      case 'auto': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'property': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'professional': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'financial': return '💰 Financier';
      case 'coverage': return '🛡️ Couverture';
      case 'legal': return '⚖️ Juridique';
      case 'time': return '⏰ Délais';
      case 'risk': return '⚠️ Risques';
      case 'product': return '📦 Produit';
      case 'health': return '🏥 Santé';
      case 'auto': return '🚗 Auto';
      case 'property': return '🏠 Habitation';
      case 'professional': return '🏢 Pro';
      default: return '📋 Général';
    }
  };

  return (
    <HoverCard openDelay={300} closeDelay={150}>
      <HoverCardTrigger asChild>
        {children ? (
          <span 
            className={`cursor-help underline decoration-dotted decoration-blue-400 hover:decoration-blue-600 transition-colors ${className}`}
          >
            {children}
          </span>
        ) : (
          <Info className={`h-3 w-3 text-[#2563EB] inline-block cursor-help ${className}`} />
        )}
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80 p-4 bg-[#111827] text-white shadow-lg border-none"
        side="top"
        align="center"
      >
        <div className="space-y-3">
          {/* En-tête avec icône et titre */}
          <div className="flex items-start space-x-2">
            <div className="p-1 rounded-md bg-white/10">
              {definition.icon || <Info className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <h4 className="text-white text-sm leading-tight">
                {definition.title}
              </h4>
            </div>
          </div>

          {/* Définition */}
          <p className="text-sm text-white/90 leading-relaxed">
            {definition.definition}
          </p>

          {/* Exemple si disponible */}
          {definition.example && (
            <div className="pt-2 border-t border-white/20">
              <p className="text-xs text-white/80 italic">
                <span>Exemple :</span> {definition.example}
              </p>
            </div>
          )}

          {/* Indicateur de catégorie */}
          <div className="flex justify-end">
            <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/90 border border-white/20">
              {getCategoryLabel(definition.category)}
            </span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

// Hook pour wrapper automatiquement les termes dans un texte
export function useDefinitionWrapper() {
  const wrapTermsWithTooltips = (text: string): ReactNode => {
    if (!text) return text;

    // Créer une expression régulière pour tous les termes définis
    const terms = Object.keys(definitions);
    const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');
    
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      const normalizedPart = part.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      
      if (definitions[normalizedPart]) {
        return (
          <DefinitionTooltip key={index} term={normalizedPart}>
            {part}
          </DefinitionTooltip>
        );
      }
      return part;
    });
  };

  return { wrapTermsWithTooltips };
}

// Fonction utilitaire pour vérifier si un terme a une définition
export function hasDefinition(term: string): boolean {
  const normalizedTerm = term.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return definitions[normalizedTerm] !== undefined;
}

// Fonction pour obtenir tous les termes disponibles par catégorie
export function getTermsByCategory(): Record<string, string[]> {
  const termsByCategory: Record<string, string[]> = {};
  
  Object.entries(definitions).forEach(([term, def]) => {
    if (!termsByCategory[def.category]) {
      termsByCategory[def.category] = [];
    }
    termsByCategory[def.category].push(term);
  });
  
  return termsByCategory;
}

export default DefinitionTooltip;