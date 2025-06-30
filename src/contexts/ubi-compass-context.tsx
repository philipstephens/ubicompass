/**
 * Central State Management for UBI Compass
 * Coordinates all component state and calculations
 */
import {
  createContextId,
  useContext,
  useContextProvider,
  useStore,
  useTask$,
  $,
  component$,
  Slot,
} from "@builder.io/qwik";

// State interfaces
export interface UbiAmounts {
  child: number;
  youth: number;
  adult: number;
  senior: number;
}

export interface AgeCutoffs {
  child: number;
  youth: number;
  senior: number;
}

export interface TaxParameters {
  flatTaxRate: number;
  taxExemption: number;
}

export interface PopulationData {
  childPopulation: number;
  youthPopulation: number;
  adultPopulation: number;
  seniorPopulation: number;
  totalPopulation: number;
}

export interface GovernmentSpendingData {
  federalTotal: number;
  federalSocial: number;
  provincialTotal: number;
  totalReplaceable: number;
}

export interface ReplacementAnalysis {
  totalCurrentSpending: number;
  programSavings: number;
  netUbiCost: number;
  replacementRate: number;
}

export interface CalculatedResults {
  totalUbiCost: number;
  totalTaxRevenue: number;
  netCostBeforeReplacement: number;
  netCostAfterReplacement: number;
  fundingPercentage: number;
  costReductionPercentage: number;
  isSelfFunded: boolean;
}

// Main state interface
export interface UbiCompassState {
  // Core parameters
  selectedYear: number;
  ageCutoffs: AgeCutoffs;
  ubiAmounts: UbiAmounts;
  taxParameters: TaxParameters;

  // Data from services
  populationData: PopulationData;
  governmentSpending: GovernmentSpendingData;
  replacementAnalysis: ReplacementAnalysis;

  // Calculated results
  results: CalculatedResults;

  // Loading states
  isLoadingPopulation: boolean;
  isLoadingSpending: boolean;

  // Error states
  populationError: string | null;
  spendingError: string | null;
}

// Context actions interface
export interface UbiCompassActions {
  // Core parameter updates
  updateYear: (year: number) => void;
  updateAgeCutoffs: (cutoffs: AgeCutoffs) => void;
  updateUbiAmounts: (amounts: UbiAmounts) => void;
  updateTaxParameters: (params: TaxParameters) => void;

  // Data updates from services
  updatePopulationData: (data: PopulationData) => void;
  updateGovernmentSpending: (data: GovernmentSpendingData) => void;
  updateReplacementAnalysis: (analysis: ReplacementAnalysis) => void;

  // Loading state updates
  setPopulationLoading: (loading: boolean) => void;
  setSpendingLoading: (loading: boolean) => void;

  // Error state updates
  setPopulationError: (error: string | null) => void;
  setSpendingError: (error: string | null) => void;
}

// Combined context interface
export interface UbiCompassContext {
  state: UbiCompassState;
  actions: UbiCompassActions;
}

// Create context
export const UbiCompassContextId = createContextId<UbiCompassContext>(
  "ubi-compass-context"
);

// Default state
const createDefaultState = (): UbiCompassState => ({
  selectedYear: 2022,
  ageCutoffs: {
    child: 12,
    youth: 21,
    senior: 55,
  },
  ubiAmounts: {
    child: 200,
    youth: 400,
    adult: 1200,
    senior: 1500,
  },
  taxParameters: {
    flatTaxRate: 30,
    taxExemption: 15000,
  },
  populationData: {
    childPopulation: 5000000,
    youthPopulation: 3000000,
    adultPopulation: 15000000,
    seniorPopulation: 7000000,
    totalPopulation: 30000000,
  },
  governmentSpending: {
    federalTotal: 0,
    federalSocial: 0,
    provincialTotal: 0,
    totalReplaceable: 0,
  },
  replacementAnalysis: {
    totalCurrentSpending: 150000000000, // $150B default
    programSavings: 50000000000, // $50B default (about 33% replacement)
    netUbiCost: 0,
    replacementRate: 33,
  },
  results: {
    totalUbiCost: 0,
    totalTaxRevenue: 0,
    netCostBeforeReplacement: 0,
    netCostAfterReplacement: 0,
    fundingPercentage: 0,
    costReductionPercentage: 0,
    isSelfFunded: false,
  },
  isLoadingPopulation: false,
  isLoadingSpending: false,
  populationError: null,
  spendingError: null,
});

// Provider component
export const UbiCompassProvider = component$(() => {
  const state = useStore<UbiCompassState>(createDefaultState());

  // Create actions
  const actions: UbiCompassActions = {
    updateYear: $((year: number) => {
      state.selectedYear = year;
    }),

    updateAgeCutoffs: $((cutoffs: AgeCutoffs) => {
      console.log("🔄 UBI Context: updateAgeCutoffs called with:", cutoffs);
      console.log("🔄 UBI Context: Previous ageCutoffs:", state.ageCutoffs);
      state.ageCutoffs = { ...cutoffs };
      console.log("🔄 UBI Context: New ageCutoffs:", state.ageCutoffs);
    }),

    updateUbiAmounts: $((amounts: UbiAmounts) => {
      state.ubiAmounts = { ...amounts };
    }),

    updateTaxParameters: $((params: TaxParameters) => {
      state.taxParameters = { ...params };
    }),

    updatePopulationData: $((data: PopulationData) => {
      state.populationData = { ...data };
      state.isLoadingPopulation = false;
      state.populationError = null;
    }),

    updateGovernmentSpending: $((data: GovernmentSpendingData) => {
      state.governmentSpending = { ...data };
      state.isLoadingSpending = false;
      state.spendingError = null;
    }),

    updateReplacementAnalysis: $((analysis: ReplacementAnalysis) => {
      state.replacementAnalysis = { ...analysis };
    }),

    setPopulationLoading: $((loading: boolean) => {
      state.isLoadingPopulation = loading;
    }),

    setSpendingLoading: $((loading: boolean) => {
      state.isLoadingSpending = loading;
    }),

    setPopulationError: $((error: string | null) => {
      state.populationError = error;
      state.isLoadingPopulation = false;
    }),

    setSpendingError: $((error: string | null) => {
      state.spendingError = error;
      state.isLoadingSpending = false;
    }),
  };

  // Reactive calculations
  useTask$(({ track }) => {
    // Track all relevant state changes
    track(() => state.ubiAmounts);
    track(() => state.populationData);
    track(() => state.taxParameters);
    track(() => state.replacementAnalysis);

    // Use fallback population if database data isn't loaded yet
    const fallbackPopulation = {
      childPopulation: state.populationData.childPopulation || 5000000,
      youthPopulation: state.populationData.youthPopulation || 3000000,
      adultPopulation: state.populationData.adultPopulation || 15000000,
      seniorPopulation: state.populationData.seniorPopulation || 7000000,
    };

    // Calculate total UBI cost
    const totalUbiCost =
      state.ubiAmounts.child * fallbackPopulation.childPopulation * 12 +
      state.ubiAmounts.youth * fallbackPopulation.youthPopulation * 12 +
      state.ubiAmounts.adult * fallbackPopulation.adultPopulation * 12 +
      state.ubiAmounts.senior * fallbackPopulation.seniorPopulation * 12;

    // Calculate tax revenue (simplified model)
    const avgIncomes = {
      child: 0,
      youth: 25000,
      adult: 55000,
      senior: 35000,
    };

    const getTaxableIncome = (income: number) =>
      Math.max(0, income - state.taxParameters.taxExemption);
    const getTaxOwed = (income: number) =>
      getTaxableIncome(income) * (state.taxParameters.flatTaxRate / 100);

    const totalTaxRevenue =
      fallbackPopulation.youthPopulation * getTaxOwed(avgIncomes.youth) +
      fallbackPopulation.adultPopulation * getTaxOwed(avgIncomes.adult) +
      fallbackPopulation.seniorPopulation * getTaxOwed(avgIncomes.senior);

    // Calculate net costs
    const netCostBeforeReplacement = totalUbiCost - totalTaxRevenue;
    const netCostAfterReplacement =
      totalUbiCost - totalTaxRevenue - state.replacementAnalysis.programSavings;

    // Calculate percentages
    const fundingPercentage =
      totalUbiCost > 0
        ? ((totalTaxRevenue + state.replacementAnalysis.programSavings) /
            totalUbiCost) *
          100
        : 0;

    const costReductionPercentage =
      totalUbiCost > 0
        ? (state.replacementAnalysis.programSavings / totalUbiCost) * 100
        : 0;

    // Update calculated results
    state.results = {
      totalUbiCost,
      totalTaxRevenue,
      netCostBeforeReplacement,
      netCostAfterReplacement,
      fundingPercentage,
      costReductionPercentage,
      isSelfFunded: netCostAfterReplacement <= 0,
    };
  });

  // Provide context
  useContextProvider(UbiCompassContextId, { state, actions });

  return <Slot />;
});

// Hook to use the context
export const useUbiCompassContext = () => {
  const context = useContext(UbiCompassContextId);
  if (!context) {
    throw new Error(
      "useUbiCompassContext must be used within UbiCompassProvider"
    );
  }
  return context;
};

// Selector hooks for specific parts of state
export const useUbiCompassState = () => {
  const { state } = useUbiCompassContext();
  return state;
};

export const useUbiCompassActions = () => {
  const { actions } = useUbiCompassContext();
  return actions;
};

// Computed value hooks
export const useUbiResults = () => {
  const { state } = useUbiCompassContext();
  return state.results;
};

export const usePopulationData = () => {
  const { state } = useUbiCompassContext();
  return {
    data: state.populationData,
    isLoading: state.isLoadingPopulation,
    error: state.populationError,
  };
};

export const useGovernmentSpending = () => {
  const { state } = useUbiCompassContext();
  return {
    data: state.governmentSpending,
    isLoading: state.isLoadingSpending,
    error: state.spendingError,
  };
};
