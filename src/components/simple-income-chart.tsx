import { component$, PropFunction } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * A simple bar chart component specifically for income comparison
 */
export const SimpleIncomeChart = component$(
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

        {/* Chart container */}
        <div class="border border-gray-200 rounded-lg p-4 bg-white">
          {/* Y-axis labels */}
          <div class="flex">
            <div class="w-12 flex flex-col justify-between text-xs text-right text-gray-500 h-64 pr-2">
              <div>${maxValue}k</div>
              <div>${Math.round(maxValue * 0.75)}k</div>
              <div>${Math.round(maxValue * 0.5)}k</div>
              <div>${Math.round(maxValue * 0.25)}k</div>
              <div>$0k</div>
            </div>

            {/* Chart area */}
            <div class="flex-1 relative">
              {/* Grid lines */}
              <div class="absolute w-full h-64 border-l border-gray-200">
                <div class="absolute w-full border-t border-gray-200" style={{ top: "0%" }}></div>
                <div class="absolute w-full border-t border-gray-200" style={{ top: "25%" }}></div>
                <div class="absolute w-full border-t border-gray-200" style={{ top: "50%" }}></div>
                <div class="absolute w-full border-t border-gray-200" style={{ top: "75%" }}></div>
                <div class="absolute w-full border-t border-gray-200" style={{ top: "100%" }}></div>
              </div>

              {/* Bars */}
              <div class="flex w-full h-64">
                {taxEntries.map((entry) => {
                  // Calculate values safely
                  const avgIncome = entry.averagetaxableincome || 0;
                  const incomeWithUBI = calculateIncomeWithUBI(entry) || 0;

                  // Calculate heights as percentages
                  const avgIncomeHeight = maxValue > 0 ? (avgIncome / maxValue) * 100 : 0;
                  const incomeWithUBIHeight = maxValue > 0 ? (incomeWithUBI / maxValue) * 100 : 0;

                  return (
                    <div key={entry.quintile} class="flex-1 flex justify-center items-end h-full">
                      <div class="w-4/5 flex justify-center relative h-full">
                        {/* Average Income Bar */}
                        <div 
                          class="absolute bottom-0 w-1/3 bg-blue-500 border border-blue-600 rounded-t"
                          style={{ 
                            height: `${avgIncomeHeight}%`,
                            left: "25%"
                          }}
                        >
                          <div class="absolute w-full text-center text-xs font-bold -top-6 text-blue-700">
                            ${avgIncome}k
                          </div>
                        </div>
                        
                        {/* Income with UBI Bar */}
                        <div 
                          class="absolute bottom-0 w-1/3 bg-green-500 border border-green-600 rounded-t"
                          style={{ 
                            height: `${incomeWithUBIHeight}%`,
                            right: "25%"
                          }}
                        >
                          <div class="absolute w-full text-center text-xs font-bold -top-6 text-green-700">
                            ${incomeWithUBI}k
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* X-axis labels */}
          <div class="flex mt-4 text-sm text-gray-600 ml-12">
            {taxEntries.map((entry) => {
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
                <div key={entry.quintile} class="flex-1 text-center">
                  <div class="bg-blue-100 text-blue-800 font-medium px-2 py-1 rounded-full text-sm inline-block">
                    Q{entry.quintile}
                  </div>
                  <div class="mt-1 text-xs text-gray-500">
                    {description}
                  </div>
                </div>
              );
            })}
          </div>
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
