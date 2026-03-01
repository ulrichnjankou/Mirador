import { useState, useEffect, useCallback } from "react";
import type { FilterState } from "../../types";

export interface UseFilterStateOptions {
  onFiltersChange?: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export function useFilterState({ onFiltersChange, initialFilters = {} }: UseFilterStateOptions = {}) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [savedFilters, setSavedFilters] = useState<FilterState>(initialFilters);
  const [hasModifications, setHasModifications] = useState(false);

  // Mise à jour des filtres parent
  useEffect(() => {
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  // Vérifier si des modifications ont été faites
  useEffect(() => {
    const hasChanges = JSON.stringify(filters) !== JSON.stringify(savedFilters);
    setHasModifications(hasChanges);
  }, [filters, savedFilters]);

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const handleResetFilter = useCallback((key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const handleResetAll = useCallback(() => {
    setFilters({});
    setSavedFilters({});
  }, []);

  const handleApplyFilters = useCallback(() => {
    setSavedFilters({ ...filters });
    setHasModifications(false);
    onFiltersChange?.(filters);
  }, [filters, onFiltersChange]);

  const handleRestoreFilters = useCallback(() => {
    setFilters({ ...savedFilters });
    setHasModifications(false);
  }, [savedFilters]);

  const getActiveFilterCount = useCallback((panelFilters: string[]) => {
    return panelFilters.filter(key => filters[key] !== undefined && filters[key] !== null).length;
  }, [filters]);

  const getActiveFilterTags = useCallback(() => {
    return Object.entries(filters)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        let displayValue = value;
        if (Array.isArray(value)) {
          displayValue = value.join(", ");
        } else if (typeof value === 'boolean') {
          displayValue = value ? "Oui" : "Non";
        }
        
        return {
          key,
          label: key.replace(/_/g, ' '),
          value: displayValue.toString(),
        };
      });
  }, [filters]);

  return {
    filters,
    savedFilters,
    hasModifications,
    handleFilterChange,
    handleResetFilter,
    handleResetAll,
    handleApplyFilters,
    handleRestoreFilters,
    getActiveFilterCount,
    getActiveFilterTags
  };
}