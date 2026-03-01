import React from "react";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { FilterState } from "../../types";

interface FilterOption {
  value: any;
  label: string;
}

interface FilterComponentsProps {
  type: "range" | "select" | "boolean" | "multiselect";
  value: any;
  onChange: (value: any) => void;
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

export function FilterComponents({
  type,
  value,
  onChange,
  options = [],
  min = 0,
  max = 100,
  step = 1
}: FilterComponentsProps) {
  
  switch (type) {
    case "range":
      // Ensure we always have a valid array for range values
      const currentValue = Array.isArray(value) && value.length === 2 
        ? value 
        : [min, max];
      
      // Validate the range values
      const validatedValue = [
        Math.max(min, Math.min(max, currentValue[0])),
        Math.max(min, Math.min(max, currentValue[1]))
      ];

      return (
        <div className="space-y-3">
          <Slider
            value={validatedValue}
            onValueChange={(newValue) => {
              if (Array.isArray(newValue) && newValue.length === 2) {
                onChange(newValue);
              }
            }}
            min={min}
            max={max}
            step={step}
            className="w-full px-1"
          />
          <div className="flex justify-between items-center text-sm">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {validatedValue[0]}€
            </span>
            <span className="text-slate-400">—</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {validatedValue[1]}€
            </span>
          </div>
        </div>
      );

    case "select":
      return (
        <Select value={value || ""} onValueChange={onChange}>
          <SelectTrigger className="w-full h-9 text-sm border-slate-200 bg-white hover:border-blue-400 focus:ring-blue-500">
            <SelectValue placeholder="Sélectionner..." />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem 
                key={String(option.value)} 
                value={String(option.value)}
                className="text-sm"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "boolean":
      return (
        <div className="flex items-center justify-between py-1">
          <span className={value ? 'text-sm text-blue-700' : 'text-sm text-slate-500'}>
            {value ? "Activé" : "Désactivé"}
          </span>
          <Switch
            checked={Boolean(value)}
            onCheckedChange={onChange}
          />
        </div>
      );

    case "multiselect":
      const selectedValues = Array.isArray(value) ? value : [];
      
      const toggleValue = (optionValue: any) => {
        const currentValues = Array.isArray(selectedValues) ? selectedValues : [];
        const isSelected = currentValues.includes(optionValue);
        
        if (isSelected) {
          onChange(currentValues.filter(v => v !== optionValue));
        } else {
          onChange([...currentValues, optionValue]);
        }
      };

      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {options.map((option) => {
              const isSelected = selectedValues.includes(option.value);
              return (
                <Button
                  key={String(option.value)}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleValue(option.value)}
                  className={
                    isSelected 
                      ? 'h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'h-7 text-xs border-slate-300 hover:bg-slate-50 hover:border-blue-400'
                  }
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
          {selectedValues.length > 0 && (
            <div className="text-xs text-blue-600">
              {selectedValues.length} sélectionné{selectedValues.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="text-sm text-muted-foreground">
          Type de filtre non supporté: {type}
        </div>
      );
  }
}