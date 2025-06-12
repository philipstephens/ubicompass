import {
  component$,
  useContextProvider,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import {
  UbiDataContext,
  createInitialUbiDataState,
} from "../stores/ubi-data-store";
import type { YearMetaData, TaxEntry } from "./ubi-calculation-component";
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

  // Task to handle year changes
  useTask$(({ track }) => {
    const yearId = track(() => ubiDataStore.yearChangeId);

    console.log(`Year change task triggered with yearId: ${yearId}`);

    // Skip if yearId is empty or hasn't been set yet
    if (!yearId) {
      console.log("Year ID is empty, skipping");
      return;
    }

    console.log(`Year changed to: ${yearId}`);

    // Update the selectedYearId
    ubiDataStore.selectedYearId = yearId;
    console.log(`Updated selectedYearId to: ${ubiDataStore.selectedYearId}`);

    // Skip if yearId is "new"
    if (yearId === "new") {
      console.log("Year ID is 'new', clearing tax entries");
      ubiDataStore.taxEntries = [];
      return;
    }

    // Fetch tax entries for the selected year
    try {
      ubiDataStore.isLoadingEntries = true;
      console.log(`Fetching tax entries for year ID: ${yearId}`);

      // Create mock tax entries with the correct UBI ID
      const entries = mockTaxEntries.map((entry) => ({
        ...entry,
        ubiid: parseInt(yearId),
      }));

      // Sort by quintile
      ubiDataStore.taxEntries = entries.sort((a, b) => a.quintile - b.quintile);
      console.log(`Tax entries loaded:`, ubiDataStore.taxEntries);
    } catch (err) {
      console.error(
        `Failed to create mock tax entries for UBI ID ${yearId}:`,
        err
      );
      ubiDataStore.error = err instanceof Error ? err.message : "Unknown error";
    } finally {
      ubiDataStore.isLoadingEntries = false;
      console.log(`isLoadingEntries set to: ${ubiDataStore.isLoadingEntries}`);
    }
  });

  // Task to handle model changes
  useTask$(({ track }) => {
    const modelId = track(() => ubiDataStore.modelChangeId);
    const yearId = track(() => ubiDataStore.selectedYearId);

    console.log(
      `Model change task triggered with modelId: ${modelId}, yearId: ${yearId}`
    );

    // Skip if modelId is 0 (initial value) or yearId is empty or "new"
    if (modelId === 0 || !yearId || yearId === "new") {
      console.log("Skipping model change - invalid modelId or yearId");
      return;
    }

    console.log(`Model changed to: ${modelId}, Year: ${yearId}`);

    // Update the selectedModelId
    ubiDataStore.selectedModelId = modelId;
    console.log(`Updated selectedModelId to: ${ubiDataStore.selectedModelId}`);

    // Fetch taxation model data
    try {
      console.log(
        `Fetching taxation model data for model ${modelId}, UBI ID ${yearId}`
      );

      // Get mock taxation model data
      const modelData = getMockTaxationModelData(modelId, parseInt(yearId));
      ubiDataStore.taxationModelData = modelData;
      console.log(
        `Taxation model data loaded:`,
        ubiDataStore.taxationModelData
      );
    } catch (err) {
      console.error(`Failed to fetch taxation model data:`, err);
      ubiDataStore.error = err instanceof Error ? err.message : "Unknown error";
    }
  });

  // Task to handle refresh
  useTask$(({ track }) => {
    const refreshTrigger = track(() => ubiDataStore.refreshTrigger);

    // Skip if refreshTrigger is 0 (initial value)
    if (refreshTrigger === 0) {
      return;
    }

    console.log(`Refreshing data (trigger: ${refreshTrigger})...`);
    ubiDataStore.isLoading = true;
    ubiDataStore.error = "";

    try {
      // Reset data
      ubiDataStore.taxEntries = [];
      ubiDataStore.taxationModelData = null;

      // Load mock data
      ubiDataStore.yearData = [...mockYearData];
      ubiDataStore.taxationModels = [...mockTaxationModels];

      // Set the first item as selected by default
      if (ubiDataStore.yearData.length > 0) {
        const firstYearId = ubiDataStore.yearData[0].ubiid.toString();

        // Update the yearChangeId to trigger the year change task
        ubiDataStore.yearChangeId = firstYearId;

        // Update the modelChangeId to trigger the model change task
        ubiDataStore.modelChangeId = ubiDataStore.selectedModelId;
      }
    } catch (err) {
      console.error("Failed to refresh data:", err);
      ubiDataStore.error = err instanceof Error ? err.message : "Unknown error";
    } finally {
      ubiDataStore.isLoading = false;
    }
  });

  // Task to update selectedYear when selectedYearId changes
  useTask$(({ track }) => {
    const yearId = track(() => ubiDataStore.selectedYearId);
    const yearData = track(() => ubiDataStore.yearData);

    if (yearId === "new" || yearId === "") {
      ubiDataStore.selectedYear = null;
      return;
    }

    ubiDataStore.selectedYear =
      yearData.find((year) => year.ubiid.toString() === yearId) || null;
  });

  // Task to initialize data on component mount
  useTask$(() => {
    console.log("Initializing UBI data provider...");

    // Load initial data
    ubiDataStore.yearData = [...mockYearData];
    ubiDataStore.taxationModels = [...mockTaxationModels];

    console.log("Initial year data:", ubiDataStore.yearData);
    console.log("Initial taxation models:", ubiDataStore.taxationModels);

    // Set the first item as selected by default
    if (ubiDataStore.yearData.length > 0) {
      const firstYearId = ubiDataStore.yearData[0].ubiid.toString();
      console.log("Setting first year ID:", firstYearId);

      // Update the yearChangeId to trigger the year change task
      ubiDataStore.yearChangeId = firstYearId;

      // Update the modelChangeId to trigger the model change task
      ubiDataStore.modelChangeId = ubiDataStore.selectedModelId;
      console.log("Setting model ID:", ubiDataStore.selectedModelId);
    }

    // Mark loading as complete
    ubiDataStore.isLoading = false;
    console.log("Initialization complete, loading:", ubiDataStore.isLoading);
  });

  // Provide the context
  useContextProvider(UbiDataContext, ubiDataStore);

  return <slot />;
});
