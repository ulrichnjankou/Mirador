import { ReactNode } from "react";
import { DefinitionTooltip, hasDefinition } from "../DefinitionTooltip";

// Liste étendue des termes qui doivent avoir un tooltip automatique
const TOOLTIP_TERMS = [
  // Termes financiers
  'franchise', 'prime', 'cotisation', 'plafond', 'frais de gestion', 'rachat', 'vétusté',
  
  // Produits d'assurance
  'tous risques', 'tiers', 'multirisque', 'per', 'per individuel', 'fonds euros', 'unités de compte',
  
  // Couvertures
  'assistance', 'protection juridique', 'responsabilité civile', 'dégâts des eaux', 'vol', 'incendie',
  'valeur à neuf', 'relogement',
  
  // Santé
  'tiers payant', 'ticket modérateur', 'forfait journalier', 'ipt', 'ipp', 'téléconsultation',
  'réseau de soins', 'dépassement d\'honoraires',
  
  // Termes temporels
  'carence', 'préavis', 'échéance', 'reconduction',
  
  // Gestion des risques
  'bonus-malus', 'sinistre', 'expertise', 'contre-expertise',
  
  // Professionnel
  'rc professionnelle', 'exploitation', 'décennale', 'cyber-risques',
  
  // Termes spécialisés
  'clause bénéficiaire', 'avance sur succession'
];

/**
 * Fonction utilitaire pour wrapper automatiquement les labels avec des tooltips
 * Utilise maintenant la base de données complète des définitions
 * @param text - Le texte à analyser
 * @returns Le texte wrappé avec des tooltips si nécessaire
 */
export function wrapWithTooltip(text: string): ReactNode {
  const lowerText = text.toLowerCase();
  
  // Vérifier si le texte contient un terme qui nécessite un tooltip
  const foundTerm = TOOLTIP_TERMS.find(term => lowerText.includes(term));
  
  if (foundTerm && hasDefinition(foundTerm)) {
    return (
      <DefinitionTooltip term={foundTerm}>
        <span>{text}</span>
      </DefinitionTooltip>
    );
  }
  
  return text;
}

/**
 * Fonction pour créer des labels avec tooltips intégrés
 * @param baseLabel - Le label de base
 * @param tooltipTerm - Le terme spécifique pour le tooltip (optionnel)
 * @returns Le label avec tooltip si applicable
 */
export function createTooltipLabel(baseLabel: string, tooltipTerm?: string): ReactNode {
  if (tooltipTerm && hasDefinition(tooltipTerm)) {
    return (
      <DefinitionTooltip term={tooltipTerm}>
        <span>{baseLabel}</span>
      </DefinitionTooltip>
    );
  }
  
  return wrapWithTooltip(baseLabel);
}

/**
 * Fonction pour gérer les labels combinés problématiques
 * Sépare maintenant correctement les concepts avec tooltips distincts
 * @param label - Le label à corriger
 * @returns Le label corrigé avec tooltips appropriés
 */
export function handleCombinedLabels(label: string): ReactNode {
  const lowerLabel = label.toLowerCase();
  
  // Cas spécial pour "Carence & Franchise" - séparer les concepts
  if (lowerLabel.includes('carence') && lowerLabel.includes('franchise')) {
    return (
      <span>
        <DefinitionTooltip term="carence">
          <span>Carence</span>
        </DefinitionTooltip>
        {" & "}
        <DefinitionTooltip term="franchise">
          <span>Franchise</span>
        </DefinitionTooltip>
      </span>
    );
  }
  
  // Cas pour "Délais (carence & franchise)"
  if (lowerLabel.includes('délais') && lowerLabel.includes('carence') && lowerLabel.includes('franchise')) {
    return (
      <span>
        Délais (
        <DefinitionTooltip term="carence">
          <span>carence</span>
        </DefinitionTooltip>
        {" & "}
        <DefinitionTooltip term="franchise">
          <span>franchise</span>
        </DefinitionTooltip>
        )
      </span>
    );
  }
  
  // Autres cas de labels combinés
  if (lowerLabel.includes('rc') && lowerLabel.includes('plafond')) {
    return (
      <span>
        <DefinitionTooltip term="responsabilité civile">
          <span>RC</span>
        </DefinitionTooltip>
        {" "}
        <DefinitionTooltip term="plafond">
          <span>plafond</span>
        </DefinitionTooltip>
      </span>
    );
  }
  
  return wrapWithTooltip(label);
}

/**
 * Fonction pour wrapper intelligemment le contenu d'une description de produit
 * @param description - La description à analyser
 * @returns La description avec tooltips automatiques
 */
export function wrapProductDescription(description: string): ReactNode {
  if (!description) return description;
  
  // Diviser le texte en mots pour une analyse plus fine
  const words = description.split(/(\s+)/);
  
  return words.map((word, index) => {
    const cleanWord = word.toLowerCase().replace(/[^\w\s]/g, '');
    
    // Vérifier si le mot correspond à un terme défini
    if (hasDefinition(cleanWord)) {
      return (
        <DefinitionTooltip key={index} term={cleanWord}>
          <span>{word}</span>
        </DefinitionTooltip>
      );
    }
    
    return word;
  });
}

/**
 * Fonction pour obtenir la liste des termes avec tooltips disponibles
 * @returns Array des termes disponibles
 */
export function getAvailableTooltipTerms(): string[] {
  return TOOLTIP_TERMS.filter(term => hasDefinition(term));
}

/**
 * Fonction pour vérifier si un texte contient des termes avec tooltips
 * @param text - Le texte à vérifier
 * @returns boolean
 */
export function containsTooltipTerms(text: string): boolean {
  const lowerText = text.toLowerCase();
  return TOOLTIP_TERMS.some(term => lowerText.includes(term) && hasDefinition(term));
}