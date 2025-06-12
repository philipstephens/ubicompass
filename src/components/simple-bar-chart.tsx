import {
  component$,
  PropFunction,
  useVisibleTask$,
  useSignal,
} from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * A simple bar chart component that doesn't rely on complex Chart.js configuration
 */
export const SimpleBarChart = component$(
  ({
    taxEntries,
    calculateTaxRevenue,
    calculateTaxRevenueWithUBI,
    calculateMedianTaxWithUBI,
    calculateUBICost,
    calculateIncomeWithUBI,
  }: {
    taxEntries: any[];
    calculateTaxRevenue: PropFunction<(entry: any) => number>;
    calculateTaxRevenueWithUBI: PropFunction<(entry: any) => number>;
    calculateMedianTaxWithUBI: PropFunction<(entry: any) => number>;
    calculateUBICost: PropFunction<(entry: any) => number>;
    calculateIncomeWithUBI: PropFunction<(entry: any) => number>;
  }) => {
    // State for which datasets to show
    const showAverageIncome = useSignal(true);
    const showIncomeWithUBI = useSignal(true);
    const showTaxRevenue = useSignal(false);
    const showTaxRevenueWithUBI = useSignal(false);
    const showUBICost = useSignal(false);

    // Find the maximum value to scale the chart properly
    const getMaxValue = () => {
      let max = 0;

      taxEntries.forEach((entry) => {
        if (showAverageIncome.value) {
          const value = entry.averagetaxableincome || 0;
          if (!isNaN(value)) {
            max = Math.max(max, value);
          }
        }
        if (showIncomeWithUBI.value) {
          const value = calculateIncomeWithUBI(entry) || 0;
          if (!isNaN(value)) {
            max = Math.max(max, value);
          }
        }
        if (showTaxRevenue.value) {
          const value = calculateTaxRevenue(entry) || 0;
          if (!isNaN(value)) {
            max = Math.max(max, value);
          }
        }
        if (showTaxRevenueWithUBI.value) {
          const value = calculateTaxRevenueWithUBI(entry) || 0;
          if (!isNaN(value)) {
            max = Math.max(max, value);
          }
        }
        if (showUBICost.value) {
          const value = calculateUBICost(entry) || 0;
          if (!isNaN(value)) {
            max = Math.max(max, value);
          }
        }
      });

      // Add 10% padding to the top and ensure we have a minimum value
      return Math.max(Math.ceil(max * 1.1), 10);
    };

    // Calculate the height percentage for a bar
    const getBarHeight = (value: number) => {
      if (isNaN(value) || value === null || value === undefined) {
        return 0;
      }
      const maxValue = getMaxValue();
      return maxValue > 0 ? (value / maxValue) * 100 : 0;
    };

    // Check if we have valid data
    const hasValidData = taxEntries && taxEntries.length > 0;

    // Debug log to check tax entries
    console.log("SimpleBarChart rendering with tax entries:", taxEntries);

    // Debug log to check calculated values
    if (hasValidData && taxEntries.length > 0) {
      const entry = taxEntries[0];
      console.log("Sample calculations for first entry:", {
        avgIncome: entry.averagetaxableincome,
        incomeWithUBI: calculateIncomeWithUBI(entry),
        taxRevenue: calculateTaxRevenue(entry),
        taxRevenueWithUBI: calculateTaxRevenueWithUBI(entry),
        ubiCost: calculateUBICost(entry),
      });
    }

    return (
      <div>
        {!hasValidData ? (
          <div class="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200 text-center">
            <div class="text-yellow-800 mb-2 font-medium">
              No data available to display
            </div>
            <div class="text-yellow-700 text-sm">
              Please ensure tax entries are loaded correctly.
            </div>
          </div>
        ) : (
          <div>
            {/* Chart Legend */}
            <div class="mb-4 flex flex-wrap gap-4">
              <div
                class="flex items-center cursor-pointer"
                onClick$={() =>
                  (showAverageIncome.value = !showAverageIncome.value)
                }
              >
                <div
                  class="w-4 h-4 mr-2"
                  style={{
                    backgroundColor: showAverageIncome.value
                      ? "rgba(54, 162, 235, 0.7)"
                      : "rgba(200, 200, 200, 0.5)",
                    border: `2px solid ${showAverageIncome.value ? "rgba(54, 162, 235, 1)" : "rgba(200, 200, 200, 1)"}`,
                  }}
                ></div>
                <span
                  class={
                    showAverageIncome.value ? "font-medium" : "text-gray-400"
                  }
                >
                  Average Taxable Income
                </span>
              </div>

              <div
                class="flex items-center cursor-pointer"
                onClick$={() =>
                  (showIncomeWithUBI.value = !showIncomeWithUBI.value)
                }
              >
                <div
                  class="w-4 h-4 mr-2"
                  style={{
                    backgroundColor: showIncomeWithUBI.value
                      ? "rgba(75, 192, 192, 0.7)"
                      : "rgba(200, 200, 200, 0.5)",
                    border: `2px solid ${showIncomeWithUBI.value ? "rgba(75, 192, 192, 1)" : "rgba(200, 200, 200, 1)"}`,
                  }}
                ></div>
                <span
                  class={
                    showIncomeWithUBI.value ? "font-medium" : "text-gray-400"
                  }
                >
                  Income with UBI
                </span>
              </div>

              <div
                class="flex items-center cursor-pointer"
                onClick$={() => (showTaxRevenue.value = !showTaxRevenue.value)}
              >
                <div
                  class="w-4 h-4 mr-2"
                  style={{
                    backgroundColor: showTaxRevenue.value
                      ? "rgba(255, 159, 64, 0.7)"
                      : "rgba(200, 200, 200, 0.5)",
                    border: `2px solid ${showTaxRevenue.value ? "rgba(255, 159, 64, 1)" : "rgba(200, 200, 200, 1)"}`,
                  }}
                ></div>
                <span
                  class={showTaxRevenue.value ? "font-medium" : "text-gray-400"}
                >
                  Tax Revenue
                </span>
              </div>

              <div
                class="flex items-center cursor-pointer"
                onClick$={() =>
                  (showTaxRevenueWithUBI.value = !showTaxRevenueWithUBI.value)
                }
              >
                <div
                  class="w-4 h-4 mr-2"
                  style={{
                    backgroundColor: showTaxRevenueWithUBI.value
                      ? "rgba(153, 102, 255, 0.7)"
                      : "rgba(200, 200, 200, 0.5)",
                    border: `2px solid ${showTaxRevenueWithUBI.value ? "rgba(153, 102, 255, 1)" : "rgba(200, 200, 200, 1)"}`,
                  }}
                ></div>
                <span
                  class={
                    showTaxRevenueWithUBI.value
                      ? "font-medium"
                      : "text-gray-400"
                  }
                >
                  Tax Revenue with UBI
                </span>
              </div>

              <div
                class="flex items-center cursor-pointer"
                onClick$={() => (showUBICost.value = !showUBICost.value)}
              >
                <div
                  class="w-4 h-4 mr-2"
                  style={{
                    backgroundColor: showUBICost.value
                      ? "rgba(255, 99, 132, 0.7)"
                      : "rgba(200, 200, 200, 0.5)",
                    border: `2px solid ${showUBICost.value ? "rgba(255, 99, 132, 1)" : "rgba(200, 200, 200, 1)"}`,
                  }}
                ></div>
                <span
                  class={showUBICost.value ? "font-medium" : "text-gray-400"}
                >
                  Cost of UBI
                </span>
              </div>
            </div>

            {/* Chart Container */}
            <div
              style={{
                height: "400px",
                position: "relative",
                marginBottom: "20px",
              }}
            >
              <div class="flex h-full">
                {/* Y-axis labels */}
                <div
                  class="flex flex-col justify-between pr-2 text-xs text-right text-gray-500"
                  style={{ width: "50px" }}
                >
                  <div>${getMaxValue()}k</div>
                  <div>${Math.round(getMaxValue() * 0.75)}k</div>
                  <div>${Math.round(getMaxValue() * 0.5)}k</div>
                  <div>${Math.round(getMaxValue() * 0.25)}k</div>
                  <div>$0k</div>
                </div>

                {/* Chart grid and bars */}
                <div class="flex-1 relative">
                  {/* Grid lines */}
                  <div class="absolute w-full h-full border-l border-gray-200">
                    <div
                      class="absolute w-full border-t border-gray-200"
                      style={{ top: "0%" }}
                    ></div>
                    <div
                      class="absolute w-full border-t border-gray-200"
                      style={{ top: "25%" }}
                    ></div>
                    <div
                      class="absolute w-full border-t border-gray-200"
                      style={{ top: "50%" }}
                    ></div>
                    <div
                      class="absolute w-full border-t border-gray-200"
                      style={{ top: "75%" }}
                    ></div>
                    <div
                      class="absolute w-full border-t border-gray-200"
                      style={{ top: "100%" }}
                    ></div>
                  </div>

                  {/* Bars */}
                  <div class="absolute w-full h-full flex">
                    {taxEntries.map((entry, index) => {
                      // Calculate values safely
                      const avgIncome = entry.averagetaxableincome || 0;
                      const incomeWithUBI = calculateIncomeWithUBI(entry) || 0;
                      const taxRevenue = calculateTaxRevenue(entry) || 0;
                      const taxRevenueWithUBI =
                        calculateTaxRevenueWithUBI(entry) || 0;
                      const ubiCost = calculateUBICost(entry) || 0;

                      return (
                        <div
                          key={entry.quintile}
                          class="flex-1 flex justify-center items-end h-full"
                        >
                          <div class="w-4/5 flex justify-center relative h-full">
                            {/* Average Taxable Income */}
                            {showAverageIncome.value && (
                              <div
                                class="absolute bottom-0 w-1/5 bg-blue-400 border border-blue-600 hover:bg-blue-500 transition-colors"
                                style={{
                                  height: `${getBarHeight(avgIncome)}%`,
                                  left: "10%",
                                }}
                              >
                                <div class="absolute w-full text-center text-xs text-white font-bold -top-6">
                                  ${avgIncome}k
                                </div>
                              </div>
                            )}

                            {/* Income with UBI */}
                            {showIncomeWithUBI.value && (
                              <div
                                class="absolute bottom-0 w-1/5 bg-teal-400 border border-teal-600 hover:bg-teal-500 transition-colors"
                                style={{
                                  height: `${getBarHeight(incomeWithUBI)}%`,
                                  left: "30%",
                                }}
                              >
                                <div class="absolute w-full text-center text-xs text-white font-bold -top-6">
                                  ${incomeWithUBI}k
                                </div>
                              </div>
                            )}

                            {/* Tax Revenue */}
                            {showTaxRevenue.value && (
                              <div
                                class="absolute bottom-0 w-1/5 bg-orange-400 border border-orange-600 hover:bg-orange-500 transition-colors"
                                style={{
                                  height: `${getBarHeight(taxRevenue)}%`,
                                  left: "50%",
                                }}
                              >
                                <div class="absolute w-full text-center text-xs text-white font-bold -top-6">
                                  ${taxRevenue}k
                                </div>
                              </div>
                            )}

                            {/* Tax Revenue with UBI */}
                            {showTaxRevenueWithUBI.value && (
                              <div
                                class="absolute bottom-0 w-1/5 bg-purple-400 border border-purple-600 hover:bg-purple-500 transition-colors"
                                style={{
                                  height: `${getBarHeight(taxRevenueWithUBI)}%`,
                                  left: "70%",
                                }}
                              >
                                <div class="absolute w-full text-center text-xs text-white font-bold -top-6">
                                  ${taxRevenueWithUBI}k
                                </div>
                              </div>
                            )}

                            {/* Cost of UBI */}
                            {showUBICost.value && (
                              <div
                                class="absolute bottom-0 w-1/5 bg-red-400 border border-red-600 hover:bg-red-500 transition-colors"
                                style={{
                                  height: `${getBarHeight(ubiCost)}%`,
                                  left: "90%",
                                }}
                              >
                                <div class="absolute w-full text-center text-xs text-white font-bold -top-6">
                                  ${ubiCost}k
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* X-axis labels */}
              <div class="flex mt-2 text-sm text-gray-600 pl-12">
                {taxEntries.map((entry) => (
                  <div
                    key={entry.quintile}
                    class="flex-1 text-center font-medium"
                  >
                    <div class="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full text-sm inline-block">
                      Q{entry.quintile}
                    </div>
                    <div class="mt-1 text-xs text-gray-500">
                      {entry.quintile === 1 && "Lowest 20%"}
                      {entry.quintile === 2 && "Lower-middle 20%"}
                      {entry.quintile === 3 && "Middle 20%"}
                      {entry.quintile === 4 && "Upper-middle 20%"}
                      {entry.quintile === 5 && "Highest 20%"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div class="bg-gray-50 px-6 py-3 text-sm text-gray-500 italic border-t border-gray-200 mt-4">
              <div class="mb-2">
                *{" "}
                <TranslatableText text="All values are in thousands of dollars." />
              </div>
              <div class="mb-2">
                **{" "}
                <TranslatableText text="Cost of UBI calculation: (UBI payments to quintile) - (Additional tax revenue from quintile)" />
              </div>
              <div class="mb-2 font-medium text-blue-600 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mr-1"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>
                  <TranslatableText text="Click on the colored boxes in the legend to show/hide different datasets." />
                </span>
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
        )}
      </div>
    );
  }
);
