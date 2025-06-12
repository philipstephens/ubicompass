import { component$, useContextProvider, useStore, Slot } from "@builder.io/qwik";
import { UbiDataContext, createInitialUbiDataState } from "../stores/ubi-data-store";

export const MinimalProvider = component$(() => {
  console.log("MinimalProvider component rendering");
  
  // Create a store with the initial state
  const ubiDataStore = useStore(createInitialUbiDataState());
  
  // Initialize with some basic data
  ubiDataStore.yearData = [
    {
      ubiid: 1,
      taxyear: 2023,
      ubiamount: 2000,
      taxpayersperquintile: 6140,
      flattaxpercentage: 30,
    },
  ];
  
  ubiDataStore.taxEntries = [
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
  ];
  
  ubiDataStore.selectedYearId = "1";
  ubiDataStore.selectedYear = ubiDataStore.yearData[0];
  ubiDataStore.isLoading = false;
  
  // Provide the context
  useContextProvider(UbiDataContext, ubiDataStore);
  
  return (
    <div style="border: 5px solid blue; padding: 10px; margin: 10px;">
      <h2 style="color: blue; text-align: center;">MINIMAL PROVIDER</h2>
      <p style="text-align: center;">This is a minimal provider that should render its children.</p>
      
      <div style="border: 2px dashed blue; padding: 10px; margin: 10px;">
        <h3 style="color: blue;">Children Below:</h3>
        <Slot />
      </div>
    </div>
  );
});
