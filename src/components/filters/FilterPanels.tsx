import React, { useState, useEffect, useCallback } from "react";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { FilterComponents } from "./FilterComponents";
import { FilterState } from "../../types";

interface FilterPanelsProps {
  segment: "particulier" | "professionnel";
  product: string;
  onFiltersChange: (filters: FilterState) => void;
  resultsCount: number;
  initialFilters?: FilterState;
}

// Configuration des filtres par produit et segment
const filterConfig = {
  particulier: {
    auto: [
      { 
        key: "priceRange", 
        label: "Budget annuel", 
        type: "range" as const, 
        min: 300, 
        max: 1500, 
        step: 50,
        defaultValue: [300, 1500],
        tooltip: "Montant maximum que vous souhaitez payer par an"
      },
      { 
        key: "franchiseMax", 
        label: "Franchise maximum", 
        type: "range" as const, 
        min: 0, 
        max: 1000, 
        step: 50,
        defaultValue: [0, 1000],
        tooltip: "Montant maximum de franchise en cas de sinistre"
      },
      { 
        key: "coverage", 
        label: "Type de couverture", 
        type: "select" as const, 
        options: [
          { value: "third_party", label: "Responsabilité civile" },
          { value: "extended_third_party", label: "Tiers étendu" },
          { value: "comprehensive", label: "Tous risques" }
        ],
        tooltip: "Niveau de protection de votre véhicule"
      },
      { 
        key: "driverProfile", 
        label: "Profil conducteur", 
        type: "select" as const, 
        options: [
          { value: "experienced", label: "Conducteur expérimenté" },
          { value: "young", label: "Jeune conducteur" },
          { value: "senior", label: "Senior" }
        ]
      },
      { 
        key: "hasAssistance", 
        label: "Assistance", 
        type: "boolean" as const,
        tooltip: "Service de dépannage et assistance routière"
      },
      { 
        key: "assistanceKm", 
        label: "Assistance dès", 
        type: "select" as const, 
        options: [
          { value: 0, label: "0 km (domicile)" },
          { value: 25, label: "25 km" },
          { value: 50, label: "50 km" }
        ]
      }
    ],
    habitation: [
      { 
        key: "priceRange", 
        label: "Budget annuel", 
        type: "range" as const, 
        min: 150, 
        max: 800, 
        step: 25,
        defaultValue: [150, 800]
      },
      { 
        key: "franchiseMax", 
        label: "Franchise maximum", 
        type: "range" as const, 
        min: 0, 
        max: 500, 
        step: 25,
        defaultValue: [0, 500]
      },
      { 
        key: "propertyType", 
        label: "Type de logement", 
        type: "select" as const, 
        options: [
          { value: "apartment", label: "Appartement" },
          { value: "house", label: "Maison" },
          { value: "studio", label: "Studio" }
        ]
      },
      { 
        key: "roomCount", 
        label: "Nombre de pièces", 
        type: "select" as const, 
        options: [
          { value: 1, label: "1 pièce" },
          { value: 2, label: "2 pièces" },
          { value: 3, label: "3 pièces" },
          { value: 4, label: "4 pièces+" }
        ]
      },
      { 
        key: "location", 
        label: "Zone géographique", 
        type: "select" as const, 
        options: [
          { value: "paris", label: "Paris et proche banlieue" },
          { value: "idf", label: "Île-de-France" },
          { value: "major_city", label: "Grande ville" },
          { value: "other", label: "Autre" }
        ]
      }
    ],
    sante: [
      { 
        key: "priceRange", 
        label: "Budget mensuel", 
        type: "range" as const, 
        min: 30, 
        max: 200, 
        step: 10,
        defaultValue: [30, 200]
      },
      { 
        key: "coverageType", 
        label: "Type de couverture", 
        type: "select" as const, 
        options: [
          { value: "individual", label: "Individuelle" },
          { value: "couple", label: "Couple" },
          { value: "family", label: "Famille" }
        ]
      },
      { 
        key: "teleconsultation", 
        label: "Téléconsultation", 
        type: "boolean" as const,
        tooltip: "Consultation médicale à distance incluse"
      },
      { 
        key: "opticalDental", 
        label: "Optique et dentaire renforcés", 
        type: "boolean" as const
      },
      { 
        key: "hospitalizationLevel", 
        label: "Hospitalisation", 
        type: "select" as const, 
        options: [
          { value: "basic", label: "Essentiel" },
          { value: "comfort", label: "Confort" },
          { value: "premium", label: "Premium" }
        ]
      }
    ],
    vie: [
      { 
        key: "investmentAmount", 
        label: "Montant d'investissement", 
        type: "range" as const, 
        min: 1000, 
        max: 100000, 
        step: 1000,
        defaultValue: [1000, 100000]
      },
      { 
        key: "riskProfile", 
        label: "Profil de risque", 
        type: "select" as const, 
        options: [
          { value: "conservative", label: "Prudent" },
          { value: "balanced", label: "Équilibré" },
          { value: "dynamic", label: "Dynamique" }
        ]
      },
      { 
        key: "managementType", 
        label: "Type de gestion", 
        type: "select" as const, 
        options: [
          { value: "euro_fund", label: "Fonds euros uniquement" },
          { value: "mixed", label: "Fonds euros + UC" },
          { value: "units", label: "Unités de compte" }
        ]
      }
    ]
  },
  professionnel: {
    "rc-pro": [
      { 
        key: "priceRange", 
        label: "Budget annuel", 
        type: "range" as const, 
        min: 200, 
        max: 5000, 
        step: 100,
        defaultValue: [200, 5000]
      },
      { 
        key: "turnover", 
        label: "Chiffre d'affaires", 
        type: "select" as const, 
        options: [
          { value: "0-50k", label: "0 à 50k€" },
          { value: "50k-200k", label: "50k à 200k€" },
          { value: "200k-1m", label: "200k à 1M€" },
          { value: "1m+", label: "Plus de 1M€" }
        ]
      },
      { 
        key: "activity", 
        label: "Secteur d'activité", 
        type: "select" as const, 
        options: [
          { value: "consulting", label: "Conseil" },
          { value: "services", label: "Services" },
          { value: "commerce", label: "Commerce" },
          { value: "artisan", label: "Artisanat" }
        ]
      }
    ]
  }
};

export function FilterPanels({ 
  segment, 
  product, 
  onFiltersChange, 
  resultsCount,
  initialFilters = {}
}: FilterPanelsProps) {
  const [activeFilters, setActiveFilters] = useState<FilterState>(initialFilters);

  // Obtenir la configuration des filtres pour le produit/segment actuel
  const currentConfig = filterConfig[segment]?.[product as keyof typeof filterConfig[typeof segment]] || [];

  // Initialiser les filtres avec les valeurs par défaut
  useEffect(() => {
    const defaultFilters: FilterState = {};
    currentConfig.forEach(filterDef => {
      if (filterDef.type === "range" && filterDef.defaultValue) {
        // Ne pas écraser si la valeur existe déjà dans initialFilters
        if (!(filterDef.key in initialFilters)) {
          defaultFilters[filterDef.key] = filterDef.defaultValue;
        }
      }
    });
    
    if (Object.keys(defaultFilters).length > 0) {
      setActiveFilters(prev => ({ ...defaultFilters, ...prev }));
    }
  }, [segment, product, currentConfig]);

  // Mettre à jour les filtres quand les filtres initiaux changent
  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      setActiveFilters(prev => ({ ...prev, ...initialFilters }));
    }
  }, [initialFilters]);

  const handleFilterChange = useCallback((key: string, value: any) => {
    const newFilters = { ...activeFilters, [key]: value };
    
    // Supprimer les filtres avec des valeurs vides
    if (value === undefined || value === null || value === '' || 
        (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key];
    }
    
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  }, [activeFilters, onFiltersChange]);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    onFiltersChange({});
  }, [onFiltersChange]);

  const activeFilterCount = Object.keys(activeFilters).length;

  if (currentConfig.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucun filtre disponible pour ce produit</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header compact */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h3 className="text-sm text-slate-700">Filtres</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 px-2 text-xs bg-blue-100 text-blue-700 border-blue-200">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        
        {activeFilterCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            className="h-7 text-xs text-slate-600 hover:text-slate-900"
          >
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Liste compacte des filtres */}
      <div className="space-y-3">
        {currentConfig.map((filterDef) => {
          const currentValue = activeFilters[filterDef.key] !== undefined 
            ? activeFilters[filterDef.key] 
            : (filterDef.type === "range" && filterDef.defaultValue ? filterDef.defaultValue : undefined);

          const isActive = activeFilters[filterDef.key] !== undefined;

          return (
            <div 
              key={filterDef.key} 
              className={`p-3 rounded-lg border transition-all ${
                isActive 
                  ? 'border-blue-300 bg-blue-50/50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-slate-700 flex items-center gap-1.5">
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                  {filterDef.label}
                </label>
                {filterDef.tooltip && (
                  <span 
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-help" 
                    title={filterDef.tooltip}
                  >
                    ℹ️
                  </span>
                )}
              </div>
              <FilterComponents
                type={filterDef.type}
                value={currentValue}
                onChange={(value) => handleFilterChange(filterDef.key, value)}
                options={filterDef.options}
                min={filterDef.min}
                max={filterDef.max}
                step={filterDef.step}
              />
            </div>
          );
        })}
      </div>

      {/* Résumé compact */}
      {activeFilterCount > 0 && (
        <div className="pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              {resultsCount} offre{resultsCount > 1 ? 's' : ''} trouvée{resultsCount > 1 ? 's' : ''}
            </span>
            <span className="text-xs text-blue-600">
              {activeFilterCount} filtre{activeFilterCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}