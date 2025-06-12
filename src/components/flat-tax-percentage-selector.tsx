import { component$, useContext } from "@builder.io/qwik";
import { UbiDataContext } from "../stores/ubi-data-store";
import { TranslatableText } from "./translatable-text";

/**
 * Component for selecting a flat tax percentage
 */
export const FlatTaxPercentageSelector = component$(() => {
  // Get the UBI data store
  const ubiStore = useContext(UbiDataContext);

  return (
    <div class="flex items-center">
      <input
        type="range"
        id="flat-tax-percentage"
        min="1"
        max="99"
        value={ubiStore.selectedYear?.flattaxpercentage || 30}
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        onChange$={(event) => {
          const percentage = parseInt(event.target.value, 10);
          if (ubiStore.selectedYear) {
            ubiStore.selectedYear.flattaxpercentage = percentage;
            // Trigger a refresh
            ubiStore.refreshTrigger = Date.now();
          }
        }}
      />
      <span class="ml-3 text-purple-700 font-medium w-12 text-right">
        {ubiStore.selectedYear?.flattaxpercentage || 30}%
      </span>
    </div>
  );
});
