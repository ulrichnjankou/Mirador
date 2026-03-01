import { useState } from "react";
import { SlidersHorizontal, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { TooltipLexique } from "./TooltipLexique";
import type { InsuranceType, FiltersAuto, FiltersHabitation, FiltersSante, FiltersVie } from "../../types/subscription";

interface FiltersPanelProps {
  selectedType: InsuranceType;
  onTypeChange: (type: InsuranceType) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
  onApply: () => void;
  onReset: () => void;
}

export function FiltersPanel({
  selectedType,
  onTypeChange,
  filters,
  onFiltersChange,
  onApply,
  onReset
}: FiltersPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <aside className="w-[320px] flex-shrink-0">
      <Card className="sticky top-24 bg-[#F9FAFB] border-[#E5E7EB]">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="h-5 w-5 text-[#2563EB]" />
              <h3 className="text-[#111827]">Filtres</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 text-xs text-[#6B7280] hover:text-[#111827]"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Réinitialiser
            </Button>
          </div>

          <Separator className="bg-[#E5E7EB]" />

          {/* Type d'assurance - Radio Pills */}
          <div className="space-y-3">
            <Label className="text-sm text-[#111827]">Type d'assurance</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "auto", label: "🚗 Auto", emoji: "🚗" },
                { value: "habitation", label: "🏠 Habitation", emoji: "🏠" },
                { value: "sante", label: "🏥 Santé", emoji: "🏥" },
                { value: "epargne", label: "💰 Épargne", emoji: "💰" }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => onTypeChange(type.value as InsuranceType)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedType === type.value
                      ? "bg-[#2563EB] text-white shadow-md"
                      : "bg-white text-[#6B7280] hover:bg-[#2563EB]/10 border border-[#E5E7EB]"
                  }`}
                >
                  <span className="mr-1">{type.emoji}</span>
                  <span>{type.value === "auto" ? "Auto" : type.value === "habitation" ? "Habitation" : type.value === "sante" ? "Santé" : "Épargne"}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-[#E5E7EB]" />

          {/* Filtres AUTO */}
          {selectedType === "auto" && <FiltersAutoSection filters={filters} updateFilter={updateFilter} />}

          {/* Filtres HABITATION */}
          {selectedType === "habitation" && <FiltersHabitationSection filters={filters} updateFilter={updateFilter} />}

          {/* Filtres SANTÉ */}
          {selectedType === "sante" && <FiltersSanteSection filters={filters} updateFilter={updateFilter} />}

          {/* Filtres ÉPARGNE */}
          {selectedType === "epargne" && <FiltersVieSection filters={filters} updateFilter={updateFilter} />}

          <Separator className="bg-[#E5E7EB]" />

          {/* CTA */}
          <Button
            onClick={onApply}
            className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-12"
          >
            Appliquer les filtres
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}

// ===== Sections de filtres spécifiques =====

function FiltersAutoSection({ filters, updateFilter }: { filters: FiltersAuto; updateFilter: (key: string, value: any) => void }) {
  return (
    <div className="space-y-5">
      {/* Formule */}
      <div className="space-y-2">
        <Label className="flex items-center space-x-2 text-sm">
          <span>Formule</span>
          <TooltipLexique term="Tous risques" />
        </Label>
        <Select value={filters.formule || "all"} onValueChange={(v) => updateFilter("formule", v === "all" ? undefined : v)}>
          <SelectTrigger className="bg-white border-[#E5E7EB]">
            <SelectValue placeholder="Toutes formules" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes formules</SelectItem>
            <SelectItem value="Tiers">Tiers</SelectItem>
            <SelectItem value="Tiers+">Tiers+</SelectItem>
            <SelectItem value="Tous Risques">Tous Risques</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Budget annuel max */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Budget annuel max</Label>
          <span className="text-sm text-[#2563EB]">{filters.budget_annuel_max || 2000}€</span>
        </div>
        <Slider
          value={[filters.budget_annuel_max || 2000]}
          onValueChange={(val) => updateFilter("budget_annuel_max", val[0])}
          min={200}
          max={2000}
          step={50}
          className="[&>span]:bg-[#2563EB]"
        />
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>200€</span>
          <span>2000€</span>
        </div>
      </div>

      {/* Franchise max */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center space-x-2 text-sm">
            <span>Franchise max</span>
            <TooltipLexique term="Franchise" />
          </Label>
          <span className="text-sm text-[#2563EB]">{filters.franchise_max || 500}€</span>
        </div>
        <Slider
          value={[filters.franchise_max || 500]}
          onValueChange={(val) => updateFilter("franchise_max", val[0])}
          min={0}
          max={1000}
          step={50}
          className="[&>span]:bg-[#2563EB]"
        />
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>0€</span>
          <span>1000€</span>
        </div>
      </div>

      {/* Assistance 0km */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center space-x-2 text-sm">
          <span>Assistance 0km</span>
          <TooltipLexique term="Assistance 0km" />
        </Label>
        <Switch
          checked={filters.assistance_0km || false}
          onCheckedChange={(checked) => updateFilter("assistance_0km", checked)}
        />
      </div>
    </div>
  );
}

function FiltersHabitationSection({ filters, updateFilter }: { filters: FiltersHabitation; updateFilter: (key: string, value: any) => void }) {
  return (
    <div className="space-y-5">
      {/* Budget annuel max */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Budget annuel max</Label>
          <span className="text-sm text-[#2563EB]">{filters.budget_annuel_max || 500}€</span>
        </div>
        <Slider
          value={[filters.budget_annuel_max || 500]}
          onValueChange={(val) => updateFilter("budget_annuel_max", val[0])}
          min={100}
          max={800}
          step={50}
          className="[&>span]:bg-[#2563EB]"
        />
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>100€</span>
          <span>800€</span>
        </div>
      </div>

      {/* Surface max */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Surface max</Label>
          <span className="text-sm text-[#2563EB]">{filters.surface_max || 250}m²</span>
        </div>
        <Slider
          value={[filters.surface_max || 250]}
          onValueChange={(val) => updateFilter("surface_max", val[0])}
          min={20}
          max={500}
          step={10}
          className="[&>span]:bg-[#2563EB]"
        />
      </div>

      {/* Vol inclus */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center space-x-2 text-sm">
          <span>Vol inclus</span>
          <TooltipLexique term="Vol et vandalisme" />
        </Label>
        <Switch
          checked={filters.vol_inclus || false}
          onCheckedChange={(checked) => updateFilter("vol_inclus", checked)}
        />
      </div>

      {/* Dégâts des eaux */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center space-x-2 text-sm">
          <span>Dégâts des eaux</span>
          <TooltipLexique term="Dégâts des eaux" />
        </Label>
        <Switch
          checked={filters.degat_eaux_inclus || false}
          onCheckedChange={(checked) => updateFilter("degat_eaux_inclus", checked)}
        />
      </div>

      {/* NPS min */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center space-x-2 text-sm">
            <span>Satisfaction min</span>
            <TooltipLexique term="NPS" />
          </Label>
          <span className="text-sm text-[#2563EB]">{filters.nps_min || 60}/100</span>
        </div>
        <Slider
          value={[filters.nps_min || 60]}
          onValueChange={(val) => updateFilter("nps_min", val[0])}
          min={50}
          max={100}
          step={5}
          className="[&>span]:bg-[#10B981]"
        />
      </div>
    </div>
  );
}

function FiltersSanteSection({ filters, updateFilter }: { filters: FiltersSante; updateFilter: (key: string, value: any) => void }) {
  return (
    <div className="space-y-5">
      {/* Niveau de couverture */}
      <div className="space-y-2">
        <Label className="text-sm">Niveau de couverture</Label>
        <Select value={filters.niveau_couverture || "all"} onValueChange={(v) => updateFilter("niveau_couverture", v === "all" ? undefined : v)}>
          <SelectTrigger className="bg-white border-[#E5E7EB]">
            <SelectValue placeholder="Tous niveaux" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous niveaux</SelectItem>
            <SelectItem value="Essentielle">Essentielle</SelectItem>
            <SelectItem value="Etendue">Étendue</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Budget mensuel max */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Budget mensuel max</Label>
          <span className="text-sm text-[#2563EB]">{filters.budget_mensuel_max || 200}€</span>
        </div>
        <Slider
          value={[filters.budget_mensuel_max || 200]}
          onValueChange={(val) => updateFilter("budget_mensuel_max", val[0])}
          min={50}
          max={300}
          step={10}
          className="[&>span]:bg-[#2563EB]"
        />
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>50€</span>
          <span>300€</span>
        </div>
      </div>

      {/* Tiers payant */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center space-x-2 text-sm">
          <span>Tiers payant</span>
          <TooltipLexique term="Tiers payant" />
        </Label>
        <Switch
          checked={filters.tiers_payant || false}
          onCheckedChange={(checked) => updateFilter("tiers_payant", checked)}
        />
      </div>

      {/* Optique min */}
      <div className="space-y-2">
        <Label className="flex items-center space-x-2 text-sm">
          <span>Optique minimum</span>
          <TooltipLexique term="Optique" />
        </Label>
        <Select value={filters.optique_min || "all"} onValueChange={(v) => updateFilter("optique_min", v === "all" ? undefined : v)}>
          <SelectTrigger className="bg-white border-[#E5E7EB]">
            <SelectValue placeholder="Peu importe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Peu importe</SelectItem>
            <SelectItem value="Base">Base</SelectItem>
            <SelectItem value="Confort">Confort</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dentaire min */}
      <div className="space-y-2">
        <Label className="flex items-center space-x-2 text-sm">
          <span>Dentaire minimum</span>
          <TooltipLexique term="Dentaire" />
        </Label>
        <Select value={filters.dentaire_min || "all"} onValueChange={(v) => updateFilter("dentaire_min", v === "all" ? undefined : v)}>
          <SelectTrigger className="bg-white border-[#E5E7EB]">
            <SelectValue placeholder="Peu importe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Peu importe</SelectItem>
            <SelectItem value="Base">Base</SelectItem>
            <SelectItem value="Confort">Confort</SelectItem>
            <SelectItem value="Premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function FiltersVieSection({ filters, updateFilter }: { filters: FiltersVie; updateFilter: (key: string, value: any) => void }) {
  return (
    <div className="space-y-5">
      {/* Type de produit épargne */}
      <div className="space-y-2">
        <Label className="text-sm">Type de produit</Label>
        <Select value={filters.type_produit_epargne || "all"} onValueChange={(v) => updateFilter("type_produit_epargne", v === "all" ? undefined : v)}>
          <SelectTrigger className="bg-white border-[#E5E7EB]">
            <SelectValue placeholder="Tous les produits" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les produits</SelectItem>
            <SelectItem value="Assurance Vie">Assurance Vie</SelectItem>
            <SelectItem value="PER">PER (Plan Épargne Retraite)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Critères ESG */}
      <div className="space-y-2">
        <Label className="text-sm">Critères ESG</Label>
        <Select value={filters.criteres_esg || "all"} onValueChange={(v) => updateFilter("criteres_esg", v === "all" ? undefined : v)}>
          <SelectTrigger className="bg-white border-[#E5E7EB]">
            <SelectValue placeholder="Tous les niveaux" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            <SelectItem value="ISR">Label ISR</SelectItem>
            <SelectItem value="Greenfin">Label Greenfin</SelectItem>
            <SelectItem value="Article 8">Article 8 SFDR</SelectItem>
            <SelectItem value="Article 9">Article 9 SFDR</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-[#E5E7EB]" />

      {/* Versement minimum */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Versement min max</Label>
          <Badge variant="secondary" className="bg-[#2563EB] text-white">
            {filters.versement_min_max || 500}€
          </Badge>
        </div>
        <div className="relative">
          <Slider
            value={[filters.versement_min_max || 500]}
            onValueChange={(val) => updateFilter("versement_min_max", val[0])}
            min={100}
            max={2000}
            step={100}
            className="[&>span]:bg-[#2563EB]"
          />
        </div>
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>100€</span>
          <span>2000€</span>
        </div>
      </div>

      {/* Fonds euro requis */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center space-x-2 text-sm">
          <span>Fonds euro requis</span>
          <TooltipLexique term="Fonds euro" />
        </Label>
        <Switch
          checked={filters.fonds_euro_requis || false}
          onCheckedChange={(checked) => updateFilter("fonds_euro_requis", checked)}
        />
      </div>

      {/* Gestion pilotée */}
      <div className="flex items-center justify-between">
        <Label className="flex items-center space-x-2 text-sm">
          <span>Gestion pilotée</span>
          <TooltipLexique term="Gestion pilotée" />
        </Label>
        <Switch
          checked={filters.mandat_pilotage || false}
          onCheckedChange={(checked) => updateFilter("mandat_pilotage", checked)}
        />
      </div>

      {/* Frais de gestion UC max */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center space-x-2 text-sm">
            <span>Frais gestion UC max</span>
            <TooltipLexique term="Frais de gestion UC" />
          </Label>
          <Badge variant="secondary" className="bg-[#2563EB] text-white">
            {(filters.frais_gestion_uc_max || 1.2).toFixed(2)}%
          </Badge>
        </div>
        <div className="relative">
          <Slider
            value={[filters.frais_gestion_uc_max || 1.2]}
            onValueChange={(val) => updateFilter("frais_gestion_uc_max", val[0])}
            min={0.5}
            max={2}
            step={0.1}
            className="[&>span]:bg-[#2563EB]"
          />
        </div>
        <div className="flex justify-between text-xs text-[#6B7280]">
          <span>0.5%</span>
          <span>2%</span>
        </div>
      </div>
    </div>
  );
}