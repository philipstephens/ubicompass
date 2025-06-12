import { component$, useContextProvider, useStore, useTask$ } from "@builder.io/qwik";
import { TaxationContext, createInitialTaxationState } from "../contexts/taxation-context";
import type { TaxEntry, YearMetaData } from "./ubi-calculation-component";
import type { TaxationModelData } from "../models/taxation";

interface TaxationProviderProps {
  selectedModelId: number;
  taxationModelData: TaxationModelData | null;
  taxEntries: TaxEntry[];
  selectedYear: YearMetaData | null;
}

/**
 * Provider component for taxation context
 */
export const TaxationProvider = component$<TaxationProviderProps>(
  ({ selectedModelId, taxationModelData, taxEntries, selectedYear }) => {
    // Create a store with the initial state
    const taxationState = useStore(createInitialTaxationState());
    
    // Update the store when props change
    useTask$(({ track }) => {
      // Track changes to props
      track(() => selectedModelId);
      track(() => taxationModelData);
      track(() => taxEntries);
      track(() => selectedYear);
      
      // Update the store
      taxationState.selectedModelId = selectedModelId;
      taxationState.taxationModelData = taxationModelData;
      taxationState.taxEntries = [...taxEntries]; // Create a new array to ensure reactivity
      taxationState.selectedYear = selectedYear;
    });
    
    // Provide the context
    useContextProvider(TaxationContext, taxationState);
    
    return <slot />;
  }
);
