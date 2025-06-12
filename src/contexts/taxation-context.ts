import { createContextId, $ } from "@builder.io/qwik";
import type { TaxEntry, YearMetaData } from "../components/ubi-calculation-component";
import type { TaxationModelData } from "../models/taxation";
import {
  type TaxationModel,
  TAXATION_MODELS,
  getTaxationModel,
  calculateTaxRevenue,
  getTaxationModelData
} from "../models/taxation-models";

/**
 * Interface for the taxation context
 */
export interface TaxationContextState {
  // Current state
  selectedModelId: number;
  taxationModelData: TaxationModelData | null;
  taxEntries: TaxEntry[];
  selectedYear: YearMetaData | null;

  // Available models
  taxationModels: TaxationModel[];

  // Computed values (using QRL for serialization)
  getTaxRevenueComparison: QRL<() => TaxRevenueComparisonItem[]>;
}

/**
 * Interface for tax revenue comparison
 */
export interface TaxRevenueComparisonItem {
  name: string;
  revenue: number;
  formattedRevenue: string;
}

/**
 * Create the taxation context ID
 */
export const TaxationContext = createContextId<TaxationContextState>(
  "taxation-context"
);

/**
 * Create the initial state for the taxation context
 */
export function createInitialTaxationState(): TaxationContextState {
  // Create the getTaxRevenueComparison function as a QRL
  const getTaxRevenueComparison = $<() => TaxRevenueComparisonItem[]>(function() {
    if (!this.selectedYear || this.taxEntries.length === 0) {
      return [];
    }

    return TAXATION_MODELS.map(model => {
      const revenue = calculateTaxRevenue(
        model.id,
        this.taxEntries,
        this.selectedYear!
      ) * 1000; // Convert to actual dollars

      return {
        name: model.name,
        revenue,
        formattedRevenue: formatCurrency(revenue)
      };
    });
  });

  return {
    selectedModelId: 1, // Default to Flat Tax
    taxationModelData: null,
    taxEntries: [],
    selectedYear: null,
    taxationModels: TAXATION_MODELS,
    getTaxRevenueComparison
  };
}

/**
 * Format currency for display
 */
function formatCurrency(amount: number): string {
  return "$" + Math.round(amount).toLocaleString();
}
