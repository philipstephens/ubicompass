import {
  component$,
  useContextProvider,
  useStore,
  useTask$,
  $,
} from "@builder.io/qwik";
import {
  UbiDataContext,
  createInitialUbiDataState,
} from "../stores/ubi-data-store";
import type { YearMetaData, TaxEntry } from "./ubi-calculation-component";
import type { TaxationModel } from "../models/taxation";
import {
  getMockTaxationModels,
  getMockTaxationModelData,
} from "../services/taxation-service";

/**
 * Provider component for UBI data
 */
export const UbiDataProvider = component$(() => {
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

  const mockTaxationModels = getMockTaxationModels();

  // Define QRL methods

  // Create a dummy fetchTaxEntries function that just logs
  const fetchTaxEntries = $(async (ubiId: string) => {
    console.log(`fetchTaxEntries called with ubiId: ${ubiId}`);
    // This function is intentionally empty - the actual work is done in the useTask$ below
  });

  // Function to fetch taxation model data
  const fetchTaxationModelData = $(async (modelId: number, ubiId: number) => {
    try {
      console.log(
        `Fetching taxation model data for model ${modelId}, UBI ID ${ubiId}`
      );

      // Get mock taxation model data
      const modelData = getMockTaxationModelData(modelId, ubiId);
      ubiDataStore.taxationModelData = modelData;
    } catch (err) {
      console.error(`Failed to fetch taxation model data:`, err);
      ubiDataStore.error = err instanceof Error ? err.message : "Unknown error";
    }
  });

  // Function to handle year change
  const handleYearChange = $(async (yearId: string) => {
    // Only update the selectedYearId
    ubiDataStore.selectedYearId = yearId;
  });

  // Use a task to fetch tax entries when selectedYearId changes
  useTask$(({ track }) => {
    const yearId = track(() => ubiDataStore.selectedYearId);

    // Skip if yearId is empty or "new"
    if (yearId === "" || yearId === "new") {
      ubiDataStore.taxEntries = [];
      return;
    }

    // Fetch tax entries for the selected year
    console.log(`Fetching tax entries for year ID: ${yearId}`);

    try {
      ubiDataStore.isLoadingEntries = true;

      // Create mock tax entries with the correct UBI ID
      const entries = mockTaxEntries.map((entry) => ({
        ...entry,
        ubiid: parseInt(yearId),
      }));

      // Sort by quintile
      ubiDataStore.taxEntries = entries.sort((a, b) => a.quintile - b.quintile);
    } catch (err) {
      console.error(
        `Failed to create mock tax entries for UBI ID ${yearId}:`,
        err
      );
      ubiDataStore.error = err instanceof Error ? err.message : "Unknown error";
    } finally {
      ubiDataStore.isLoadingEntries = false;
    }
  });

  // Function to handle model change
  const handleModelChange = $(async (modelId: number) => {
    // Only update the selectedModelId
    ubiDataStore.selectedModelId = modelId;
  });

  // Use a task to fetch taxation model data when selectedModelId or selectedYearId changes
  useTask$(({ track }) => {
    const modelId = track(() => ubiDataStore.selectedModelId);
    const yearId = track(() => ubiDataStore.selectedYearId);

    // Skip if yearId is empty or "new"
    if (!yearId || yearId === "new") {
      return;
    }

    // Fetch taxation model data for the selected model and UBI year
    fetchTaxationModelData(modelId, parseInt(yearId));
  });

  // Function to refresh data
  const refreshData = $(async () => {
    console.log("Refreshing data...");
    ubiDataStore.isLoading = true;
    ubiDataStore.error = "";

    try {
      // Reset data
      ubiDataStore.yearData = [];
      ubiDataStore.taxEntries = [];
      ubiDataStore.taxationModelData = null;

      // Load mock data
      ubiDataStore.yearData = [...mockYearData];
      ubiDataStore.taxationModels = [...mockTaxationModels];

      // Set the first item as selected by default
      if (ubiDataStore.yearData.length > 0) {
        const firstYearId = ubiDataStore.yearData[0].ubiid.toString();
        ubiDataStore.selectedYearId = firstYearId;

        // Only fetch taxation model data - tax entries will be fetched by the task
        await fetchTaxationModelData(
          ubiDataStore.selectedModelId,
          parseInt(firstYearId)
        );
      }
    } catch (err) {
      console.error("Failed to refresh data:", err);
      ubiDataStore.error = err instanceof Error ? err.message : "Unknown error";
    } finally {
      ubiDataStore.isLoading = false;
    }
  });

  // Assign the QRL methods to the store
  ubiDataStore.fetchTaxEntries = fetchTaxEntries;
  ubiDataStore.fetchTaxationModelData = fetchTaxationModelData;
  ubiDataStore.handleYearChange = handleYearChange;
  ubiDataStore.handleModelChange = handleModelChange;
  ubiDataStore.refreshData = refreshData;

  // Update selected year when selectedYearId changes
  useTask$(({ track }) => {
    track(() => ubiDataStore.selectedYearId);
    track(() => ubiDataStore.yearData);

    if (
      ubiDataStore.selectedYearId === "new" ||
      ubiDataStore.selectedYearId === ""
    ) {
      ubiDataStore.selectedYear = null;
      return;
    }

    ubiDataStore.selectedYear =
      ubiDataStore.yearData.find(
        (year) => year.ubiid.toString() === ubiDataStore.selectedYearId
      ) || null;
  });

  // Initialize data on component mount
  useTask$(async () => {
    // Load initial data
    ubiDataStore.yearData = [...mockYearData];
    ubiDataStore.taxationModels = [...mockTaxationModels];

    // Set the first item as selected by default
    if (ubiDataStore.yearData.length > 0) {
      const firstYearId = ubiDataStore.yearData[0].ubiid.toString();
      ubiDataStore.selectedYearId = firstYearId;

      // Only fetch taxation model data - tax entries will be fetched by the task
      await fetchTaxationModelData(
        ubiDataStore.selectedModelId,
        parseInt(firstYearId)
      );
    }

    // Mark loading as complete
    ubiDataStore.isLoading = false;
  });

  // Provide the context
  useContextProvider(UbiDataContext, ubiDataStore);

  return <slot />;
});
