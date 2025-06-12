import {
  component$,
  useContextProvider,
  useStore,
  useTask$,
  Slot,
} from "@builder.io/qwik";
import {
  UbiDataContext,
  createInitialUbiDataState,
} from "../stores/ubi-data-store";
import type { YearMetaData, TaxEntry } from "../models/income-data";
import {
  getMockTaxationModels,
  getMockTaxationModelData,
} from "../services/taxation-service";

/**
 * UBI Data Provider component following Qwik best practices
 */
export const UbiDataProviderBest = component$(() => {
  console.log("UbiDataProviderBest initializing");

  // Create a store with the initial state
  const ubiDataStore = useStore(createInitialUbiDataState());

  // Pre-load mock data
  const mockYearData: YearMetaData[] = [
    {
      ubiid: 1,
      taxyear: 2023,
      ubiamount: 2000,
      taxpayersperquintile: 6140,
      flattaxpercentage: 30,
    },
  ];

  const mockTaxEntries: TaxEntry[] = [
    {
      entryid: 1,
      quintile: 1,
      averagetaxableincome: 10,
      mediantax: 0,
      ubiid: 1,
    },
    {
      entryid: 2,
      quintile: 2,
      averagetaxableincome: 30,
      mediantax: 2,
      ubiid: 1,
    },
    {
      entryid: 3,
      quintile: 3,
      averagetaxableincome: 50,
      mediantax: 5.5,
      ubiid: 1,
    },
    {
      entryid: 4,
      quintile: 4,
      averagetaxableincome: 75,
      mediantax: 11,
      ubiid: 1,
    },
    {
      entryid: 5,
      quintile: 5,
      averagetaxableincome: 200,
      mediantax: 35,
      ubiid: 1,
    },
  ];

  // Initialize data on component mount
  useTask$(() => {
    console.log("Initializing data in UbiDataProviderBest");

    // Load mock data
    ubiDataStore.yearData = [...mockYearData];
    ubiDataStore.taxationModels = getMockTaxationModels();

    // Set the first item as selected by default
    if (ubiDataStore.yearData.length > 0) {
      const firstYearId = ubiDataStore.yearData[0].ubiid.toString();
      ubiDataStore.selectedYearId = firstYearId;
      ubiDataStore.selectedYear = ubiDataStore.yearData[0];

      // Load tax entries
      ubiDataStore.taxEntries = [...mockTaxEntries];

      // Load taxation model data
      ubiDataStore.taxationModelData = getMockTaxationModelData(
        1,
        parseInt(firstYearId)
      );
    }

    // Mark loading as complete
    ubiDataStore.isLoading = false;

    console.log("Data initialized:", {
      yearData: ubiDataStore.yearData,
      taxEntries: ubiDataStore.taxEntries,
      taxationModelData: ubiDataStore.taxationModelData,
    });
  });

  // Handle year changes
  useTask$(({ track }) => {
    const yearId = track(() => ubiDataStore.yearChangeId);

    // Skip if yearId is empty or hasn't been set yet
    if (!yearId) {
      return;
    }

    console.log(`Year changed to: ${yearId}`);

    // Update the selectedYearId
    ubiDataStore.selectedYearId = yearId;

    // Update selectedYear
    ubiDataStore.selectedYear =
      ubiDataStore.yearData.find((year) => year.ubiid.toString() === yearId) ||
      null;

    // Skip if yearId is "new"
    if (yearId === "new") {
      ubiDataStore.taxEntries = [];
      return;
    }

    // Load tax entries
    ubiDataStore.taxEntries = mockTaxEntries
      .map((entry) => ({
        ...entry,
        ubiid: parseInt(yearId),
      }))
      .sort((a, b) => a.quintile - b.quintile);
  });

  // Handle model changes
  useTask$(({ track }) => {
    const modelId = track(() => ubiDataStore.modelChangeId);
    const yearId = track(() => ubiDataStore.selectedYearId);

    // Skip if modelId is 0 or yearId is empty or "new"
    if (modelId === 0 || !yearId || yearId === "new") {
      return;
    }

    console.log(`Model changed to: ${modelId}, Year: ${yearId}`);

    // Update the selectedModelId
    ubiDataStore.selectedModelId = modelId;

    // Load taxation model data
    ubiDataStore.taxationModelData = getMockTaxationModelData(
      modelId,
      parseInt(yearId)
    );
  });

  // Handle refresh
  useTask$(({ track }) => {
    const refreshTrigger = track(() => ubiDataStore.refreshTrigger);

    // Skip if refreshTrigger is 0 (initial value)
    if (refreshTrigger === 0) {
      return;
    }

    console.log(`Refreshing data (trigger: ${refreshTrigger})...`);

    // Reset data
    ubiDataStore.isLoading = true;
    ubiDataStore.error = "";
    ubiDataStore.taxEntries = [];
    ubiDataStore.taxationModelData = null;

    // Load mock data
    ubiDataStore.yearData = [...mockYearData];
    ubiDataStore.taxationModels = getMockTaxationModels();

    // Set the first item as selected by default
    if (ubiDataStore.yearData.length > 0) {
      const firstYearId = ubiDataStore.yearData[0].ubiid.toString();
      ubiDataStore.selectedYearId = firstYearId;
      ubiDataStore.selectedYear = ubiDataStore.yearData[0];

      // Load tax entries
      ubiDataStore.taxEntries = [...mockTaxEntries];

      // Load taxation model data
      ubiDataStore.taxationModelData = getMockTaxationModelData(
        1,
        parseInt(firstYearId)
      );
    }

    // Mark loading as complete
    ubiDataStore.isLoading = false;
  });

  // Provide the context
  useContextProvider(UbiDataContext, ubiDataStore);

  console.log("UbiDataProviderBest initialized");

  // Return the children using Slot
  return <Slot />;
});
