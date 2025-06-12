import { component$, PropFunction } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * A simple bar chart component for income comparison using the approach
 * that was verified to work in the standalone HTML test
 */
export const IncomeBarChart = component$(
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
        
        {/* Bar Chart */}
        <div>
          {taxEntries.map((entry) => {
            // Calculate values safely
            const avgIncome = entry.averagetaxableincome || 0;
            const incomeWithUBI = calculateIncomeWithUBI(entry) || 0;

            // Calculate widths as percentages of the maximum value
            const avgIncomeWidth = maxValue > 0 ? (avgIncome / maxValue) * 100 : 0;
            const incomeWithUBIWidth = maxValue > 0 ? (incomeWithUBI / maxValue) * 100 : 0;

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
              <div key={entry.quintile} class="mb-6 border-b pb-4">
                <div class="flex items-center mb-2">
                  <div class="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full text-sm mr-2">
                    Q{entry.quintile}
                  </div>
                  <div class="text-sm text-gray-600">{description}</div>
                </div>
                
                <div class="space-y-3">
                  {/* Average Income Bar */}
                  <div>
                    <div class="flex items-center mb-1">
                      <div class="w-32 text-sm">Average Income:</div>
                      <div class="flex-1 bg-gray-100 h-6 rounded overflow-hidden">
                        <div 
                          class="h-full bg-blue-500 rounded-r flex items-center justify-end px-2 text-white text-xs font-medium"
                          style={{ width: `${avgIncomeWidth}%` }}
                        >
                          ${avgIncome}k
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Income with UBI Bar */}
                  <div>
                    <div class="flex items-center mb-1">
                      <div class="w-32 text-sm">Income with UBI:</div>
                      <div class="flex-1 bg-gray-100 h-6 rounded overflow-hidden">
                        <div 
                          class="h-full bg-green-500 rounded-r flex items-center justify-end px-2 text-white text-xs font-medium"
                          style={{ width: `${incomeWithUBIWidth}%` }}
                        >
                          ${incomeWithUBI}k
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
