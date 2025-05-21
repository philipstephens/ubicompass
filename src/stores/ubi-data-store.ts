import { createContextId } from "@builder.io/qwik";
import type { Signal, QRL } from "@builder.io/qwik";
import type { YearMetaData, TaxEntry } from "../components/ubi-calculation-component";
import type { TaxationModel, TaxationModelData } from "../models/taxation";

/**
 * Interface for the UBI data store
 */
export interface UbiDataStore {
  // Data
  yearData: YearMetaData[];
  taxEntries: TaxEntry[];
  taxationModels: TaxationModel[];
  taxationModelData: TaxationModelData | null;

  // Selection state
  selectedYearId: string;
  selectedModelId: number;

  // UI state
  isLoading: boolean;
  isLoadingEntries: boolean;
  error: string;

  // Derived data
  selectedYear: YearMetaData | null;

  // Action triggers (simple values that tasks can track)
  refreshTrigger: number;
  yearChangeId: string;
  modelChangeId: number;
}

/**
 * Create the UBI data context ID
 */
export const UbiDataContext = createContextId<Signal<UbiDataStore>>("ubi-data-context");

/**
 * Create the initial state for the UBI data store
 */
export function createInitialUbiDataState(): UbiDataStore {
  return {
    // Data
    yearData: [],
    taxEntries: [],
    taxationModels: [],
    taxationModelData: null,

    // Selection state
    selectedYearId: "",
    selectedModelId: 1, // Default to Flat Tax

    // UI state
    isLoading: true,
    isLoadingEntries: false,
    error: "",

    // Derived data
    selectedYear: null,

    // Action triggers with initial values
    refreshTrigger: 0,
    yearChangeId: "",
    modelChangeId: 1,
  };
}
