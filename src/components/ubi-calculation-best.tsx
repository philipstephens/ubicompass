import {
  component$,
  useContext,
  useSignal,
  useTask$,
  noSerialize,
} from "@builder.io/qwik";
import { UbiDataContext } from "../stores/ubi-data-store";
import { CspCardComponent } from "./csp-card-component";
import { TranslatableText } from "./translatable-text";
import { TranslationContext } from "../stores/translation-store";
import { TaxModelFactory } from "../models/tax-model-factory";
import { TaxModel } from "../models/tax-model.interface";

export const UbiCalculationBest = component$(() => {
  console.log("UbiCalculationBest component rendering");

  // Get the UBI data store
  const ubiStore = useContext(UbiDataContext);

  // Get the translation store from context
  const translationStore = useContext(TranslationContext);

  // Local state for component
  const hasData = useSignal(false);
  const showTaxBrackets = useSignal(true); // Start expanded by default
  const currentTaxModel = useSignal<any>(null); // Using any type with noSerialize

  // Check if data is available
  useTask$(({ track }) => {
    // Track relevant store properties
    track(() => ubiStore.yearData);
    track(() => ubiStore.taxEntries);
    track(() => ubiStore.selectedYear);

    // Update local state
    hasData.value =
      ubiStore.yearData.length > 0 &&
      ubiStore.taxEntries.length > 0 &&
      ubiStore.selectedYear !== null;

    console.log("UbiCalculationBest data check:", {
      hasData: hasData.value,
      yearDataLength: ubiStore.yearData.length,
      taxEntriesLength: ubiStore.taxEntries.length,
      hasSelectedYear: ubiStore.selectedYear !== null,
    });
  });

  // Update tax model when selected model ID changes
  useTask$(({ track }) => {
    // Track the selected model ID
    const modelId = track(() => ubiStore.selectedModelId);

    // Get the flat tax percentage from the selected year
    const flatTaxPercentage = ubiStore.selectedYear?.flattaxpercentage || 30;

    // Create the appropriate tax model based on the selected model ID
    // Use noSerialize to prevent serialization issues with class instances
    currentTaxModel.value = noSerialize(
      TaxModelFactory.createModelById(modelId, flatTaxPercentage)
    );

    console.log("Tax model updated:", currentTaxModel.value.name);
  });

  // Calculate UBI income for each quintile
  const getYearlyUbiInThousands = () => {
    if (!ubiStore.selectedYear) return 24; // Default
    return (ubiStore.selectedYear.ubiamount * 12) / 1000;
  };

  // Calculate tax revenue for a quintile using the current tax model
  const calculateTaxRevenue = (entry: any) => {
    if (!currentTaxModel.value) return 0;

    const taxpayers = ubiStore.selectedYear?.taxpayersperquintile || 0;
    const income = entry.averagetaxableincome;

    // Use the tax model to calculate the revenue
    const revenue = currentTaxModel.value.calculateQuintileRevenue(
      income,
      taxpayers
    );

    // Return the result rounded to one decimal place
    return Math.round(revenue * 10) / 10;
  };

  // Calculate tax revenue with UBI for a quintile using the current tax model
  const calculateTaxRevenueWithUBI = (entry: any) => {
    if (!currentTaxModel.value) return 0;

    const taxpayers = ubiStore.selectedYear?.taxpayersperquintile || 0;
    const income = entry.averagetaxableincome;
    const ubiAmount = getYearlyUbiInThousands();
    const exemptionAmount = getExemptionAmount();

    // Use the tax model to calculate the revenue with UBI
    const revenue = currentTaxModel.value.calculateQuintileRevenueWithUBI(
      income,
      taxpayers,
      ubiAmount,
      exemptionAmount
    );

    // Return the result rounded to one decimal place
    return Math.round(revenue * 10) / 10;
  };

  // Calculate median tax with UBI for a quintile using the current tax model
  const calculateMedianTaxWithUBI = (entry: any) => {
    if (!currentTaxModel.value) return 0;

    const income = entry.averagetaxableincome;
    const ubiAmount = getYearlyUbiInThousands();
    const exemptionAmount = getExemptionAmount();

    // Use the tax model to calculate the tax with UBI for an individual
    const tax = currentTaxModel.value.calculateTaxWithUBI(
      income,
      ubiAmount,
      exemptionAmount
    );

    // Return the result rounded to one decimal place
    return Math.round(tax * 10) / 10;
  };

  // Calculate the net cost of UBI for a quintile using the current tax model
  const calculateUBICost = (entry: any) => {
    if (!currentTaxModel.value) return 0;

    const taxpayers = ubiStore.selectedYear?.taxpayersperquintile || 0;
    const income = entry.averagetaxableincome;
    const ubiAmount = getYearlyUbiInThousands();
    const exemptionAmount = getExemptionAmount();

    // Use the tax model to calculate the UBI cost
    const cost = currentTaxModel.value.calculateUBICost(
      income,
      taxpayers,
      ubiAmount,
      exemptionAmount
    );

    // Return the result rounded to one decimal place
    return Math.round(cost * 10) / 10;
  };

  // Get the exemption amount in thousands
  const getExemptionAmount = () => {
    // For now, this is hardcoded to 24k, but could be made dynamic
    // by connecting to the exemption amount input field
    return 24;
  };

  // Get tax brackets for the current model
  const getTaxBrackets = () => {
    if (!currentTaxModel.value) return [];
    return currentTaxModel.value.getTaxBrackets();
  };

  // Create an icon element for the card with explicit size and position
  const chartIcon = (
    <span
      style={{
        display: "inline-block",
        width: "16px",
        height: "16px",
        marginLeft: "8px",
        position: "relative",
        top: "2px",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="white"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
        }}
      >
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    </span>
  );

  return (
    <CspCardComponent
      title={
        <TranslatableText text="Canadian Universal Basic Income Calculator" />
      }
      backgroundColor="#ffffff"
      headerBackgroundColor="#4a86e8"
      borderColor="#d0e0fc"
      icon={chartIcon}
    >
      <div class="p-4">
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <h3 class="text-blue-800 font-medium text-lg mb-2">
            <TranslatableText text="Explore the impact of Universal Basic Income on different income quintiles" />
          </h3>
          <p class="text-blue-600 text-sm">
            <TranslatableText text="Adjust the parameters below to see how different UBI configurations affect income distribution across Canada." />
          </p>
        </div>

        {ubiStore.isLoading ? (
          <div class="bg-blue-100 p-6 rounded-lg shadow-inner flex items-center justify-center">
            <div class="flex flex-col items-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
              <p class="text-blue-800 font-medium">
                <TranslatableText text="Loading UBI data..." />
              </p>
            </div>
          </div>
        ) : ubiStore.error ? (
          <div class="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200">
            <div class="flex items-center">
              <div class="bg-red-100 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p class="font-bold text-red-700">Error: {ubiStore.error}</p>
            </div>
          </div>
        ) : !hasData.value ? (
          <div class="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200">
            <div class="flex flex-col items-center text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-yellow-500 mb-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <p class="text-yellow-800 mb-4">
                No data available. Please select a year or refresh the data.
              </p>
              <button
                onClick$={() => {
                  ubiStore.refreshTrigger = Date.now();
                }}
                class="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md shadow-sm transition duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clip-rule="evenodd"
                  />
                </svg>
                <TranslatableText text="Refresh Data" />
              </button>
            </div>
          </div>
        ) : (
          <div class="space-y-8">
            {/* Year Summary Card */}
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-100 overflow-hidden">
              <div class="bg-blue-600 text-white px-6 py-3">
                <h4 class="font-bold text-lg">
                  <TranslatableText text="UBI Calculator Parameters" />
                </h4>
              </div>

              <div class="p-6">
                <div class="bg-white rounded-lg shadow-sm p-5 border border-blue-100 mb-6">
                  <table class="w-full text-left">
                    <tbody>
                      {/* Year Selection */}
                      <tr>
                        <td class="py-3 font-medium text-gray-700 w-1/3">
                          <TranslatableText text="Selected Year:" />
                        </td>
                        <td class="py-3 font-bold text-gray-800">
                          <select
                            class="bg-blue-500 text-white border border-blue-400 rounded px-3 py-2 font-medium"
                            onChange$={(e) => {
                              const select = e.target as HTMLSelectElement;
                              if (ubiStore.selectedYear) {
                                ubiStore.selectedYear.taxyear = parseInt(
                                  select.value
                                );
                              }
                            }}
                          >
                            {Array.from({ length: 24 }, (_, i) => 2000 + i).map(
                              (year) => (
                                <option
                                  key={year}
                                  value={year}
                                  selected={
                                    ubiStore.selectedYear?.taxyear === year
                                  }
                                >
                                  {year}
                                </option>
                              )
                            )}
                          </select>
                        </td>
                      </tr>

                      {/* Empty row for spacing */}
                      <tr>
                        <td class="py-2" colSpan={2}></td>
                      </tr>

                      {/* Model Selection */}
                      <tr>
                        <td class="py-3 font-medium text-gray-700 w-1/3">
                          <TranslatableText text="Calculation Model:" />
                        </td>
                        <td class="py-3 font-bold text-gray-800">
                          <select
                            class="bg-blue-500 text-white border border-blue-400 rounded px-3 py-2 font-medium"
                            onChange$={(e) => {
                              const select = e.target as HTMLSelectElement;
                              if (ubiStore) {
                                ubiStore.selectedModelId = parseInt(
                                  select.value
                                );
                                ubiStore.modelChangeId = parseInt(select.value);
                              }
                            }}
                          >
                            <option
                              value="1"
                              selected={ubiStore.selectedModelId === 1}
                            >
                              <TranslatableText text="Flat Tax" />
                            </option>
                            <option
                              value="2"
                              selected={ubiStore.selectedModelId === 2}
                            >
                              <TranslatableText text="Progressive Tax" />
                            </option>
                            <option
                              value="3"
                              selected={ubiStore.selectedModelId === 3}
                            >
                              <TranslatableText text="Bell Curve (Gaussian)" />
                            </option>
                            <option
                              value="4"
                              selected={ubiStore.selectedModelId === 4}
                            >
                              <TranslatableText text="Percentile-Matched" />
                            </option>
                          </select>
                        </td>
                      </tr>

                      {/* Empty row for spacing */}
                      <tr>
                        <td class="py-2" colSpan={2}></td>
                      </tr>

                      {/* UBI Amount */}
                      <tr>
                        <td class="py-3 font-medium text-gray-700 align-top">
                          <TranslatableText text="Payment to each Taxpayer:" />
                        </td>
                        <td class="py-3">
                          <div class="font-bold text-gray-800">
                            $
                            <select
                              class="ml-1 bg-gray-100 border border-gray-300 rounded px-2 py-1"
                              onChange$={(e) => {
                                const select = e.target as HTMLSelectElement;
                                if (ubiStore.selectedYear) {
                                  ubiStore.selectedYear.ubiamount = parseInt(
                                    select.value
                                  );
                                }
                              }}
                            >
                              {[1000, 1500, 2000, 2500, 3000].map((amount) => (
                                <option
                                  key={amount}
                                  value={amount}
                                  selected={
                                    ubiStore.selectedYear?.ubiamount === amount
                                  }
                                >
                                  {amount}
                                </option>
                              ))}
                            </select>
                            {" / "}
                            <TranslatableText text="Month" />
                            {" × 12 = "}$
                            {(ubiStore.selectedYear?.ubiamount || 0) * 12}
                            {" / "}
                            <TranslatableText text="Year" />
                          </div>
                        </td>
                      </tr>

                      {/* Empty row for spacing */}
                      <tr>
                        <td class="py-2" colSpan={2}></td>
                      </tr>

                      {/* Flat Tax */}
                      <tr>
                        <td class="py-3 font-medium text-gray-700">
                          <TranslatableText text="Income Tax Flat Rate:" />
                        </td>
                        <td class="py-3 font-bold text-gray-800">
                          <input
                            type="number"
                            min="1"
                            max="99"
                            class="w-16 bg-gray-100 border border-gray-300 rounded px-2 py-1 text-right"
                            value={
                              ubiStore.selectedYear?.flattaxpercentage || 0
                            }
                            onChange$={(e) => {
                              const input = e.target as HTMLInputElement;
                              const value = parseInt(input.value);
                              if (
                                ubiStore.selectedYear &&
                                !isNaN(value) &&
                                value >= 1 &&
                                value <= 99
                              ) {
                                ubiStore.selectedYear.flattaxpercentage = value;
                              }
                            }}
                          />
                          <span class="ml-1">%</span>
                        </td>
                      </tr>

                      {/* Empty row for spacing */}
                      <tr>
                        <td class="py-2" colSpan={2}></td>
                      </tr>

                      {/* Exemption Amount */}
                      <tr>
                        <td class="py-3 font-medium text-gray-700">
                          <TranslatableText text="Exemption Amount:" />
                        </td>
                        <td class="py-3 font-bold text-gray-800">
                          <div class="flex items-center">
                            <span class="mr-1">$</span>
                            <input
                              type="number"
                              min="0"
                              max="100000"
                              step="1000"
                              class="w-24 bg-gray-100 border border-gray-300 rounded px-2 py-1 text-right"
                              value={24000}
                              onChange$={(e) => {
                                const input = e.target as HTMLInputElement;
                                const value = parseInt(input.value);
                                // Store the exemption amount in the appropriate place
                                // This is a placeholder - you'll need to update your store
                                console.log(
                                  "Exemption amount changed to:",
                                  value
                                );
                              }}
                            />
                            <span class="ml-2 text-gray-600 text-sm">
                              <TranslatableText text="per year" />
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Empty row for spacing */}
                      <tr>
                        <td class="py-2" colSpan={2}></td>
                      </tr>

                      {/* Taxpayers */}
                      <tr>
                        <td class="py-3 font-medium text-gray-700 align-top">
                          <TranslatableText text="Number of taxpayers:" />
                        </td>
                        <td class="py-3">
                          <div class="font-bold text-gray-800">
                            {(
                              (ubiStore.selectedYear?.taxpayersperquintile ||
                                0) * 1000
                            ).toLocaleString()}
                            {" × 5 = "}
                            {(
                              (ubiStore.selectedYear?.taxpayersperquintile ||
                                0) * 5000
                            ).toLocaleString()}
                            {" / "}
                            <TranslatableText text="year" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Tax Entries Table */}
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 class="font-bold text-gray-700 text-lg">
                  <TranslatableText text="Tax Entries by Quintile" />
                </h4>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                      <th class="py-3 px-4 text-left font-medium">
                        <TranslatableText text="Quintile (20% of Population)" />
                      </th>
                      <th class="py-3 px-4 text-right font-medium">
                        <TranslatableText text="Average Taxable Income" />
                      </th>
                      <th class="py-3 px-4 text-right font-medium">
                        <TranslatableText text="Median Tax" />
                      </th>
                      <th class="py-3 px-4 text-right font-medium">
                        <TranslatableText text="Tax Revenue" />
                      </th>
                      <th class="py-3 px-4 text-right font-medium">
                        <TranslatableText text="Average Income with UBI" />
                      </th>
                      <th class="py-3 px-4 text-right font-medium">
                        <TranslatableText text="Median Tax with UBI" />
                      </th>
                      <th class="py-3 px-4 text-right font-medium">
                        <TranslatableText text="Tax Revenue with UBI" />
                      </th>
                      <th class="py-3 px-4 text-right font-medium">
                        <TranslatableText text="Cost of UBI" />
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    {ubiStore.taxEntries.map((entry) => (
                      <tr
                        key={entry.entryid}
                        class="hover:bg-gray-50 transition duration-150"
                      >
                        <td class="py-4 px-4 text-left">
                          <div>
                            <span class="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full text-sm">
                              Q{entry.quintile}
                            </span>
                            <div class="mt-1 text-xs text-gray-500">
                              {entry.quintile === 1 && (
                                <TranslatableText text="Lowest 20% (0-20th percentile)" />
                              )}
                              {entry.quintile === 2 && (
                                <TranslatableText text="Lower-middle 20% (20-40th percentile)" />
                              )}
                              {entry.quintile === 3 && (
                                <TranslatableText text="Middle 20% (40-60th percentile)" />
                              )}
                              {entry.quintile === 4 && (
                                <TranslatableText text="Upper-middle 20% (60-80th percentile)" />
                              )}
                              {entry.quintile === 5 && (
                                <TranslatableText text="Highest 20% (80-100th percentile)" />
                              )}
                            </div>
                          </div>
                        </td>
                        <td class="py-4 px-4 text-right font-medium">
                          ${entry.averagetaxableincome}k
                        </td>
                        <td class="py-4 px-4 text-right font-medium">
                          ${entry.mediantax}k
                        </td>
                        <td class="py-4 px-4 text-right font-medium text-blue-600">
                          ${calculateTaxRevenue(entry)}k
                        </td>
                        <td class="py-4 px-4 text-right font-medium text-green-600">
                          $
                          {entry.averagetaxableincome +
                            getYearlyUbiInThousands()}
                          k
                        </td>
                        <td class="py-4 px-4 text-right font-medium text-orange-600">
                          ${calculateMedianTaxWithUBI(entry)}k
                        </td>
                        <td class="py-4 px-4 text-right font-medium text-purple-600">
                          ${calculateTaxRevenueWithUBI(entry)}k
                        </td>
                        <td class="py-4 px-4 text-right font-medium text-red-600">
                          ${calculateUBICost(entry)}k
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div class="bg-gray-50 px-6 py-3 text-sm text-gray-500 italic border-t border-gray-200">
                <div class="mb-2">
                  *{" "}
                  <TranslatableText text="All values are in thousands of dollars." />
                </div>
                <div class="mb-2">
                  **{" "}
                  <TranslatableText text="Cost of UBI calculation: (UBI payments to quintile) - (Additional tax revenue from quintile)" />
                </div>
                <div class="mt-3 p-2 bg-blue-50 rounded-md text-blue-800 text-xs non-italic">
                  <div class="font-medium mb-1">
                    <TranslatableText text="About Income Quintiles:" />
                  </div>
                  <div>
                    <TranslatableText text="Each quintile represents exactly 20% of the taxpayer population (6.14 million people per quintile). Quintiles divide the population into five equal groups based on income level, from lowest (Q1) to highest (Q5)." />
                  </div>
                </div>
              </div>
            </div>

            {/* Tax Brackets Panel */}
            <div class="mt-4 bg-white rounded-lg shadow-md border border-blue-200 overflow-hidden">
              <div
                class="bg-blue-50 px-6 py-4 border-b border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-100 transition-colors"
                onClick$={() => {
                  // Toggle the tax brackets panel visibility
                  showTaxBrackets.value = !showTaxBrackets.value;
                }}
              >
                <h4 class="font-bold text-blue-700 text-lg flex items-center">
                  {/* Icon removed */}
                  <TranslatableText text="Tax Brackets" />
                  <span class="ml-2 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-normal">
                    <TranslatableText text="click to toggle" />
                  </span>
                </h4>
                <div class="text-blue-500">
                  {showTaxBrackets.value ? <span>▲</span> : <span>▼</span>}
                </div>
              </div>

              {showTaxBrackets.value && (
                <div class="p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 class="text-blue-700 font-medium mb-3">
                        <TranslatableText text="Tax Bracket Structure" />
                      </h5>
                      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <table class="w-full">
                          <thead>
                            <tr class="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                              <th class="py-3 px-4 text-left font-medium">
                                <TranslatableText text="Income Range" />
                              </th>
                              <th class="py-3 px-4 text-right font-medium">
                                <TranslatableText text="Tax Rate" />
                              </th>
                            </tr>
                          </thead>
                          <tbody class="divide-y divide-gray-200">
                            {getTaxBrackets().map((bracket, index) => (
                              <tr
                                key={index}
                                class="hover:bg-gray-50 transition duration-150"
                              >
                                <td class="py-4 px-4 text-left font-medium">
                                  {bracket.maxIncome
                                    ? `$${bracket.minIncome}k - $${bracket.maxIncome}k`
                                    : `$${bracket.minIncome}k+`}
                                  <div class="text-xs text-gray-500 mt-1">
                                    {bracket.description}
                                  </div>
                                </td>
                                <td class="py-4 px-4 text-right">
                                  <span
                                    class={`bg-${index === 0 ? "green" : "blue"}-100 text-${index === 0 ? "green" : "blue"}-700 font-medium px-3 py-1 rounded-full`}
                                  >
                                    {bracket.rate}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h5 class="text-blue-700 font-medium mb-3">
                        <TranslatableText text="How taxes are calculated:" />
                      </h5>
                      <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 h-full">
                        <div class="font-medium text-blue-800 mb-2">
                          {currentTaxModel.value?.name || "Tax"} Model
                        </div>

                        <ul class="space-y-3">
                          <li class="flex items-start">
                            <span class="mr-1.5">1.</span>
                            <span>
                              <TranslatableText text="First $24,000 of income is exempt from taxation" />
                            </span>
                          </li>
                          <li class="flex items-start">
                            <span class="mr-1.5">2.</span>
                            <span>
                              {ubiStore.selectedModelId === 1 && (
                                <TranslatableText text="All income above exemption amount is taxed at flat rate" />
                              )}
                              {ubiStore.selectedModelId === 2 && (
                                <TranslatableText text="Income above exemption is taxed using progressive brackets" />
                              )}
                              {ubiStore.selectedModelId === 3 && (
                                <TranslatableText text="Income is taxed based on a bell curve distribution with highest rates near 90th percentile" />
                              )}
                              {ubiStore.selectedModelId === 4 && (
                                <TranslatableText text="Income is taxed so that tax burden percentile matches income percentile" />
                              )}
                            </span>
                          </li>
                          <li class="flex items-start">
                            <span class="mr-1.5">3.</span>
                            <span>
                              <TranslatableText text="UBI payments are added to income before taxation" />
                            </span>
                          </li>
                        </ul>

                        <div class="mt-4 bg-white p-3 rounded border border-blue-100 text-sm">
                          <div class="font-medium text-blue-800 mb-1">
                            <TranslatableText text="Example:" />
                          </div>
                          <div class="text-gray-700">
                            <TranslatableText text="For income of $50,000 with UBI of $24,000/year:" />
                            <div class="mt-2 pl-4 border-l-2 border-blue-200">
                              <div>
                                <span class="font-medium">Total Income:</span>{" "}
                                $74,000 ($50,000 + $24,000 UBI)
                              </div>
                              <div>
                                <span class="font-medium">Exemption:</span>{" "}
                                $24,000
                              </div>
                              <div>
                                <span class="font-medium">Taxable Income:</span>{" "}
                                $50,000 ($74,000 - $24,000)
                              </div>
                              <div>
                                <span class="font-medium">Tax:</span>{" "}
                                {calculateMedianTaxWithUBI({
                                  averagetaxableincome: 50,
                                })}
                                k
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Model Comparison Section */}
            <div class="mt-6 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div class="bg-indigo-50 px-6 py-4 border-b border-indigo-200">
                <h4 class="font-bold text-indigo-700 text-lg">
                  <TranslatableText text="Tax Model Comparison" />
                </h4>
              </div>
              <div class="p-6">
                <div class="mb-4">
                  <p class="text-gray-600 mb-3">
                    <TranslatableText text="Compare different tax models to see their impact on income and government revenue." />
                  </p>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Model Selection */}
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h5 class="font-medium text-gray-700 mb-2">
                        <TranslatableText text="Select Tax Models to Compare:" />
                      </h5>
                      <div class="space-y-2">
                        <label class="flex items-center">
                          <input
                            type="checkbox"
                            class="form-checkbox h-5 w-5 text-indigo-600"
                            checked={true}
                            disabled={true}
                          />
                          <span class="ml-2 text-gray-700">
                            <TranslatableText text="Flat Tax" />
                          </span>
                        </label>
                        <label class="flex items-center">
                          <input
                            type="checkbox"
                            class="form-checkbox h-5 w-5 text-indigo-600"
                          />
                          <span class="ml-2 text-gray-700">
                            <TranslatableText text="Progressive Tax" />
                          </span>
                        </label>
                        <label class="flex items-center">
                          <input
                            type="checkbox"
                            class="form-checkbox h-5 w-5 text-indigo-600"
                          />
                          <span class="ml-2 text-gray-700">
                            <TranslatableText text="Bell Curve (Gaussian)" />
                          </span>
                        </label>
                        <label class="flex items-center">
                          <input
                            type="checkbox"
                            class="form-checkbox h-5 w-5 text-indigo-600"
                          />
                          <span class="ml-2 text-gray-700">
                            <TranslatableText text="Percentile-Matched" />
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* UBI Toggle */}
                    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h5 class="font-medium text-gray-700 mb-2">
                        <TranslatableText text="UBI Options:" />
                      </h5>
                      <div class="space-y-2">
                        <label class="flex items-center">
                          <input
                            type="checkbox"
                            class="form-checkbox h-5 w-5 text-indigo-600"
                            checked={true}
                            disabled={true}
                          />
                          <span class="ml-2 text-gray-700">
                            <TranslatableText text="With UBI" />
                          </span>
                        </label>
                        <label class="flex items-center">
                          <input
                            type="checkbox"
                            class="form-checkbox h-5 w-5 text-indigo-600"
                          />
                          <span class="ml-2 text-gray-700">
                            <TranslatableText text="Without UBI" />
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-sm text-yellow-800 mb-4">
                    <TranslatableText text="Note: Model comparison feature is under development. Currently showing Flat Tax with UBI only." />
                  </div>

                  <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h5 class="font-medium text-gray-700 mb-2">
                      <TranslatableText text="About Tax Models:" />
                    </h5>
                    <div class="space-y-3 text-sm">
                      <div>
                        <div class="font-medium text-gray-800">
                          <TranslatableText text="Flat Tax:" />
                        </div>
                        <div class="text-gray-600">
                          <TranslatableText text="Applies the same tax rate to all income (or income above exemption with UBI)." />
                        </div>
                      </div>

                      <div>
                        <div class="font-medium text-gray-800">
                          <TranslatableText text="Progressive Tax:" />
                        </div>
                        <div class="text-gray-600">
                          <TranslatableText text="Uses multiple tax brackets with increasing rates for higher incomes." />
                        </div>
                      </div>

                      <div>
                        <div class="font-medium text-gray-800">
                          <TranslatableText text="Bell Curve (Gaussian):" />
                        </div>
                        <div class="text-gray-600">
                          <TranslatableText text="Applies a bell-shaped distribution to tax rates, with highest rates near the 90th percentile." />
                        </div>
                      </div>

                      <div>
                        <div class="font-medium text-gray-800">
                          <TranslatableText text="Percentile-Matched:" />
                        </div>
                        <div class="text-gray-600">
                          <TranslatableText text="If your income is in the 75th percentile, your tax burden will be in the 75th percentile of all tax burdens." />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div class="flex justify-end mt-4">
              <button
                onClick$={() => {
                  ubiStore.refreshTrigger = Date.now();
                }}
                class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm transition duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clip-rule="evenodd"
                  />
                </svg>
                <TranslatableText text="Refresh Data" />
              </button>
            </div>
          </div>
        )}
      </div>
    </CspCardComponent>
  );
});
