import { component$, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { UbiDataProviderDecile } from "./ubi-data-provider-decile";
import { UbiDecileCalculator } from "./ubi-decile-calculator";
import { useUbiStore } from "../stores/ubi-data-store";
import { TranslatableText } from "./translatable-text";

/**
 * Root component for the UBI calculator using decile-based approach with SVG charts
 */
export const UbiRootDecileSvg = component$(() => {
  console.log("UbiRootDecileSvg component rendering");
  
  // Get the UBI store
  const ubiStore = useUbiStore();
  
  // Local state for parameters
  const parameters = useStore({
    ubiAmount: 24, // Default $24k per year
    flatTaxPercentage: 30, // Default 30%
    exemptionAmount: 24, // Default $24k exemption
  });
  
  // Update trigger for forcing re-renders
  const updateTrigger = useSignal(0);
  
  // Update local parameters when store changes
  useTask$(({ track }) => {
    track(() => ubiStore.selectedYear?.ubiamount);
    track(() => ubiStore.selectedYear?.flattaxpercentage);
    track(() => ubiStore.selectedExemptionAmount);
    
    if (ubiStore.selectedYear) {
      parameters.ubiAmount = ubiStore.selectedYear.ubiamount || 24;
      parameters.flatTaxPercentage = ubiStore.selectedYear.flattaxpercentage || 30;
    }
    
    if (ubiStore.selectedExemptionAmount !== undefined) {
      parameters.exemptionAmount = ubiStore.selectedExemptionAmount;
    }
    
    // Trigger update
    updateTrigger.value = Date.now();
  });
  
  return (
    <div class="ubi-root-decile-svg">
      <div class="card rounded-3xl overflow-hidden border border-indigo-200 bg-white shadow-md mb-10">
        <div class="card-header bg-purple-600 py-2.5 px-4 flex justify-between items-center">
          <h2 class="card-title font-bold text-lg m-0 text-white">
            <TranslatableText text="UBI Calculator Parameters" />
          </h2>
        </div>
        <div class="card-content p-5">
          <div class="controls flex flex-wrap gap-5">
            <div class="control-group flex-1 min-w-[200px]">
              <label class="block mb-2 font-medium">
                <TranslatableText text="Tax Year" />
              </label>
              <select
                class="w-full p-2 border border-gray-300 rounded"
                value={ubiStore.selectedYear?.year || 2022}
                onChange$={(event) => {
                  const year = parseInt(event.target.value, 10);
                  ubiStore.selectYear(year);
                }}
              >
                {ubiStore.years.map((year) => (
                  <option key={year.year} value={year.year}>
                    {year.year}
                  </option>
                ))}
              </select>
            </div>
            
            <div class="control-group flex-1 min-w-[200px]">
              <label class="block mb-2 font-medium">
                <TranslatableText text="UBI Amount" />
              </label>
              <select
                class="w-full p-2 border border-gray-300 rounded"
                value={parameters.ubiAmount}
                onChange$={(event) => {
                  const amount = parseInt(event.target.value, 10);
                  parameters.ubiAmount = amount;
                  if (ubiStore.selectedYear) {
                    ubiStore.selectedYear.ubiamount = amount;
                    ubiStore.refreshTrigger = Date.now();
                  }
                }}
              >
                <option value="12">$12k / Year ($1.0k / month)</option>
                <option value="18">$18k / Year ($1.5k / month)</option>
                <option value="24">$24k / Year ($2.0k / month)</option>
                <option value="30">$30k / Year ($2.5k / month)</option>
                <option value="36">$36k / Year ($3.0k / month)</option>
              </select>
            </div>
            
            <div class="control-group flex-1 min-w-[200px]">
              <label class="block mb-2 font-medium">
                <TranslatableText text="Flat Tax Percentage" />: {parameters.flatTaxPercentage}%
              </label>
              <input
                type="range"
                min="1"
                max="99"
                class="w-full"
                value={parameters.flatTaxPercentage}
                onChange$={(event) => {
                  const percentage = parseInt(event.target.value, 10);
                  parameters.flatTaxPercentage = percentage;
                  if (ubiStore.selectedYear) {
                    ubiStore.selectedYear.flattaxpercentage = percentage;
                    ubiStore.refreshTrigger = Date.now();
                  }
                }}
              />
            </div>
            
            <div class="control-group flex-1 min-w-[200px]">
              <label class="block mb-2 font-medium">
                <TranslatableText text="Exemption Amount" />
              </label>
              <select
                class="w-full p-2 border border-gray-300 rounded"
                value={parameters.exemptionAmount}
                onChange$={(event) => {
                  const amount = parseInt(event.target.value, 10);
                  parameters.exemptionAmount = amount;
                  ubiStore.selectedExemptionAmount = amount;
                  ubiStore.refreshTrigger = Date.now();
                }}
              >
                <option value="0">$0k (No exemption)</option>
                <option value="12">$12k (No tax on first $12k)</option>
                <option value="18">$18k (No tax on first $18k)</option>
                <option value="24">$24k (No tax on first $24k)</option>
                <option value="30">$30k (No tax on first $30k)</option>
                <option value="36">$36k (No tax on first $36k)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <UbiDataProviderDecile>
        {(taxEntries) => (
          <UbiDecileCalculator
            taxEntries={taxEntries}
            ubiAmount={parameters.ubiAmount}
            flatTaxPercentage={parameters.flatTaxPercentage}
            exemptionAmount={parameters.exemptionAmount}
          />
        )}
      </UbiDataProviderDecile>
    </div>
  );
});
