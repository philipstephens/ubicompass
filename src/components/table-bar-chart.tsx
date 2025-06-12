import { component$, PropFunction } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * A bar chart implemented using HTML tables for maximum compatibility
 */
export const TableBarChart = component$(
  ({
    taxEntries,
    calculateIncomeWithUBI,
  }: {
    taxEntries: any[];
    calculateIncomeWithUBI: PropFunction<(entry: any) => number>;
  }) => {
    // Check if we have valid data
    if (!taxEntries || taxEntries.length === 0) {
      return (
        <div class="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200 text-center">
          <div class="text-yellow-800 mb-2 font-medium">
            No data available to display
          </div>
        </div>
      );
    }

    // Get the maximum value for scaling
    let maxValue = 0;
    taxEntries.forEach((entry) => {
      // Average Taxable Income
      const avgIncome = entry.averagetaxableincome || 0;
      maxValue = Math.max(maxValue, avgIncome);

      // Income with UBI
      const incomeWithUBI = calculateIncomeWithUBI(entry) || 0;
      maxValue = Math.max(maxValue, incomeWithUBI);
    });

    // Add 10% padding to the top
    maxValue = Math.ceil(maxValue * 1.1);
    
    // Calculate the maximum bar width in pixels (100%)
    const maxBarWidth = 100;

    return (
      <div>
        <h3 class="text-lg font-medium mb-4">Income Comparison by Quintile</h3>
        
        {/* Legend */}
        <div class="flex items-center gap-4 mb-4">
          <div class="flex items-center">
            <div class="w-4 h-4 mr-2 bg-blue-500"></div>
            <span class="text-sm">Average Taxable Income</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 mr-2 bg-green-500"></div>
            <span class="text-sm">Income with UBI</span>
          </div>
        </div>

        {/* Table-based chart */}
        <table class="w-full border-collapse mb-4">
          <thead>
            <tr>
              <th class="w-1/6 text-left">Quintile</th>
              <th class="w-5/6 text-left">Income Comparison</th>
            </tr>
          </thead>
          <tbody>
            {taxEntries.map((entry) => {
              // Calculate values safely
              const avgIncome = entry.averagetaxableincome || 0;
              const incomeWithUBI = calculateIncomeWithUBI(entry) || 0;

              // Calculate widths as percentages of the maximum value
              const avgIncomeWidth = maxValue > 0 ? (avgIncome / maxValue) * maxBarWidth : 0;
              const incomeWithUBIWidth = maxValue > 0 ? (incomeWithUBI / maxValue) * maxBarWidth : 0;

              // Determine quintile description
              let description = "";
              switch(entry.quintile) {
                case 1: description = "Lowest 20%"; break;
                case 2: description = "Lower-middle 20%"; break;
                case 3: description = "Middle 20%"; break;
                case 4: description = "Upper-middle 20%"; break;
                case 5: description = "Highest 20%"; break;
                default: description = "";
              }

              return (
                <tr key={entry.quintile} class="border-b border-gray-200">
                  <td class="py-4 align-top">
                    <div class="bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded-full text-sm inline-block">
                      Q{entry.quintile}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">{description}</div>
                  </td>
                  <td class="py-4">
                    <div class="mb-4">
                      <div class="flex items-center mb-1">
                        <div class="w-20 text-right text-sm mr-2">Income:</div>
                        <div class="flex-1">
                          <div 
                            class="h-6 bg-blue-500 rounded-r text-white text-xs flex items-center justify-end px-2"
                            style={{ width: `${avgIncomeWidth}%` }}
                          >
                            ${avgIncome}k
                          </div>
                        </div>
                      </div>
                      <div class="flex items-center">
                        <div class="w-20 text-right text-sm mr-2">With UBI:</div>
                        <div class="flex-1">
                          <div 
                            class="h-6 bg-green-500 rounded-r text-white text-xs flex items-center justify-end px-2"
                            style={{ width: `${incomeWithUBIWidth}%` }}
                          >
                            ${incomeWithUBI}k
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Y-axis scale */}
        <div class="flex justify-between text-xs text-gray-500 px-24 mb-2">
          <div>$0k</div>
          <div>${Math.round(maxValue * 0.25)}k</div>
          <div>${Math.round(maxValue * 0.5)}k</div>
          <div>${Math.round(maxValue * 0.75)}k</div>
          <div>${maxValue}k</div>
        </div>

        <div class="mt-6 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          <p>* <TranslatableText text="All values are in thousands of dollars." /></p>
          <p class="mt-2">
            <TranslatableText text="Each quintile represents exactly 20% of the taxpayer population. Quintiles divide the population into five equal groups based on income level, from lowest (Q1) to highest (Q5)." />
          </p>
        </div>
      </div>
    );
  }
);
