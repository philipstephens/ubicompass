import { component$, useSignal, $ } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";
import { createMockDecileData } from "../models/income-data";
import type { TaxEntry } from "../models/income-data";
import { CspCardComponent } from "./csp-card-component";

/**
 * Component to display decile-based UBI data
 */
export const DecileDisplay = component$(() => {
  // Local state
  const ubiAmount = useSignal(2000);
  const showChart = useSignal(false);
  const decileData = useSignal<TaxEntry[]>(createMockDecileData(1));

  // Calculate income with UBI
  const calculateIncomeWithUBI = $((entry: TaxEntry) => {
    const income = entry.averagetaxableincome;
    const yearlyUbi = (ubiAmount.value * 12) / 1000; // Convert to thousands per year
    return income + yearlyUbi;
  });

  // Toggle between chart and table view
  const toggleView = $(() => {
    showChart.value = !showChart.value;
  });

  // Create an icon element for the card
  const chartIcon = (
    <span class="chart-icon-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="white"
        class="chart-icon"
      >
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    </span>
  );

  return (
    <CspCardComponent
      title={<TranslatableText text="UBI Impact by Income Decile" />}
      backgroundColor="#ffffff"
      headerBackgroundColor="#4a86e8"
      borderColor="#d0e0fc"
      icon={chartIcon}
      onIconClick$={toggleView}
    >
      <div class="p-4">
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <h3 class="text-blue-800 font-medium text-lg mb-2">
            <TranslatableText text="Explore the impact of Universal Basic Income on different income deciles" />
          </h3>
          <p class="text-blue-600 text-sm">
            <TranslatableText text="This view shows how UBI affects income distribution across 10 income groups (deciles) in Canada." />
          </p>
        </div>

        {showChart.value ? (
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <h3 class="text-lg font-medium mb-4 text-center">
              <TranslatableText text="Income Comparison Chart" />
            </h3>
            <div class="text-center text-gray-500">
              <p>Chart view is not implemented yet.</p>
              <button
                onClick$={toggleView}
                class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                <TranslatableText text="Show Table" />
              </button>
            </div>
          </div>
        ) : (
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <h3 class="text-lg font-medium mb-4">
              <TranslatableText text="Income Comparison by Decile" />
            </h3>

            <div class="overflow-x-auto">
              <table class="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="py-2 px-4 border-b border-gray-200 text-left">
                      <TranslatableText text="Decile" />
                    </th>
                    <th class="py-2 px-4 border-b border-gray-200 text-left">
                      <TranslatableText text="Description" />
                    </th>
                    <th class="py-2 px-4 border-b border-gray-200 text-right">
                      <TranslatableText text="Average Taxable Income" />
                    </th>
                    <th class="py-2 px-4 border-b border-gray-200 text-right">
                      <TranslatableText text="Income with UBI" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {decileData.value.map((entry) => {
                    const avgIncome = entry.averagetaxableincome || 0;
                    const incomeWithUBI = calculateIncomeWithUBI(entry) || 0;

                    // Format income range
                    const incomeRange = `$${entry.lowerBound}k - $${entry.upperBound}k`;

                    // Get description based on decile
                    let descriptionKey = "";
                    switch (entry.decile) {
                      case 1:
                        descriptionKey = "Lowest 10%";
                        break;
                      case 2:
                        descriptionKey = "10-20%";
                        break;
                      case 3:
                        descriptionKey = "20-30%";
                        break;
                      case 4:
                        descriptionKey = "30-40%";
                        break;
                      case 5:
                        descriptionKey = "40-50%";
                        break;
                      case 6:
                        descriptionKey = "50-60%";
                        break;
                      case 7:
                        descriptionKey = "60-70%";
                        break;
                      case 8:
                        descriptionKey = "70-80%";
                        break;
                      case 9:
                        descriptionKey = "80-90%";
                        break;
                      case 10:
                        descriptionKey = "Highest 10%";
                        break;
                      default:
                        descriptionKey = "";
                        break;
                    }

                    return (
                      <tr key={entry.decile} class="hover:bg-gray-50">
                        <td class="py-2 px-4 border-b border-gray-200">
                          <span class="bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded-full text-sm">
                            D{entry.decile}
                          </span>
                        </td>
                        <td class="py-2 px-4 border-b border-gray-200">
                          <TranslatableText text={descriptionKey} />
                          <span class="text-gray-500 text-sm ml-2">
                            ({incomeRange})
                          </span>
                        </td>
                        <td class="py-2 px-4 border-b border-gray-200 text-right">
                          <div class="flex items-center justify-end">
                            <div class="w-24 text-right font-medium mr-2">
                              ${avgIncome}k
                            </div>
                            <div
                              class="h-6 bg-blue-500 rounded"
                              style={{ width: `${Math.min(avgIncome, 150)}px` }}
                            ></div>
                          </div>
                        </td>
                        <td class="py-2 px-4 border-b border-gray-200 text-right">
                          <div class="flex items-center justify-end">
                            <div class="w-24 text-right font-medium mr-2">
                              ${incomeWithUBI}k
                            </div>
                            <div
                              class="h-6 bg-green-500 rounded"
                              style={{
                                width: `${Math.min(incomeWithUBI, 150)}px`,
                              }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div class="mt-6 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
              <p>
                <TranslatableText text="* All values are in thousands of dollars." />
              </p>
              <p class="mt-2">
                <TranslatableText text="Each decile represents exactly 10% of the taxpayer population. Deciles divide the population into ten equal groups based on income level, from lowest (D1) to highest (D10)." />
              </p>
            </div>
          </div>
        )}
      </div>
    </CspCardComponent>
  );
});
