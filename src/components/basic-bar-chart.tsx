import {
  component$,
  PropFunction,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * A very basic bar chart component that doesn't rely on any external libraries
 */
export const BasicBarChart = component$(
  ({
    taxEntries,
    calculateTaxRevenue,
    calculateTaxRevenueWithUBI,
    calculateUBICost,
    calculateIncomeWithUBI,
  }: {
    taxEntries: any[];
    calculateTaxRevenue: PropFunction<(entry: any) => number>;
    calculateTaxRevenueWithUBI: PropFunction<(entry: any) => number>;
    calculateUBICost: PropFunction<(entry: any) => number>;
    calculateIncomeWithUBI: PropFunction<(entry: any) => number>;
  }) => {
    // Reference to the chart container
    const chartContainerRef = useSignal<HTMLDivElement | null>(null);
    const isChartRendered = useSignal(false);

    // Check if we have valid data
    if (!taxEntries || taxEntries.length === 0) {
      return (
        <div class="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200 text-center">
          <div class="text-yellow-800 mb-2 font-medium">
            No data available to display
          </div>
          <div class="text-yellow-700 text-sm">
            Please ensure tax entries are loaded correctly.
          </div>
        </div>
      );
    }

    // Get the maximum value for scaling
    const getMaxValue = () => {
      let max = 0;
      taxEntries.forEach((entry) => {
        // Average Taxable Income
        const avgIncome = entry.averagetaxableincome || 0;
        if (!isNaN(avgIncome)) {
          max = Math.max(max, avgIncome);
        }

        // Income with UBI
        const incomeWithUBI = calculateIncomeWithUBI(entry) || 0;
        if (!isNaN(incomeWithUBI)) {
          max = Math.max(max, incomeWithUBI);
        }
      });

      // Add 10% padding to the top and ensure we have a minimum value
      return Math.max(Math.ceil(max * 1.1), 10);
    };

    const maxValue = getMaxValue();

    console.log("BasicBarChart component rendering");

    // Use a visible task to ensure the chart is rendered on the client
    useVisibleTask$(({ track }) => {
      track(() => chartContainerRef.value);

      if (chartContainerRef.value) {
        // Set isChartRendered to true immediately to ensure bars are visible
        isChartRendered.value = true;
        console.log(
          "Chart container is visible - setting isChartRendered to true immediately"
        );

        // Set a small timeout to check if bars are rendered
        setTimeout(() => {
          // Log the chart bars to see if they're being created
          const bars = chartContainerRef.value?.querySelectorAll(
            ".bg-blue-500, .bg-green-500"
          );
          console.log(`Found ${bars?.length || 0} chart bars after timeout`);

          // Force a re-render if no bars are found
          if (!bars || bars.length === 0) {
            console.log("No bars found, forcing re-render");
            isChartRendered.value = false;
            setTimeout(() => {
              isChartRendered.value = true;
              console.log("Forced re-render of chart");
            }, 50);
          }
        }, 200);
      }
    });

    return (
      <div>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Income Comparison by Quintile</h3>

          <div class="flex items-center gap-4">
            <div class="flex items-center">
              <div class="w-4 h-4 mr-2 bg-blue-500"></div>
              <span class="text-sm">Average Taxable Income</span>
            </div>
            <div class="flex items-center">
              <div class="w-4 h-4 mr-2 bg-green-500"></div>
              <span class="text-sm">Income with UBI</span>
            </div>
          </div>
        </div>

        <div
          ref={chartContainerRef}
          class="border border-gray-200 rounded-lg p-4 bg-white"
          style={{ height: "400px" }}
        >
          <div class="flex h-full">
            {/* Y-axis labels */}
            <div
              class="flex flex-col justify-between pr-2 text-xs text-right text-gray-500"
              style={{ width: "50px" }}
            >
              <div>${maxValue}k</div>
              <div>${Math.round(maxValue * 0.75)}k</div>
              <div>${Math.round(maxValue * 0.5)}k</div>
              <div>${Math.round(maxValue * 0.25)}k</div>
              <div>$0k</div>
            </div>

            {/* Chart area */}
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
                {taxEntries.map((entry) => {
                  // Calculate values safely
                  const avgIncome = entry.averagetaxableincome || 0;
                  const incomeWithUBI = calculateIncomeWithUBI(entry) || 0;

                  // Calculate heights as percentages
                  const avgIncomeHeight =
                    maxValue > 0 ? (avgIncome / maxValue) * 100 : 0;
                  const incomeWithUBIHeight =
                    maxValue > 0 ? (incomeWithUBI / maxValue) * 100 : 0;

                  return (
                    <div
                      key={entry.quintile}
                      class="flex-1 flex justify-center"
                    >
                      <div class="w-4/5 flex justify-center relative h-full">
                        {/* Average Income Bar */}
                        <div
                          class="absolute bottom-0 w-1/3 bg-blue-500 border border-blue-600 transition-all duration-700 rounded-t-md"
                          style={{
                            height: `${avgIncomeHeight}%`,
                            left: "25%",
                            opacity: isChartRendered.value ? "1" : "0",
                            transform: isChartRendered.value
                              ? "translateY(0)"
                              : "translateY(20px)",
                          }}
                        >
                          <div class="absolute w-full text-center text-xs font-bold -top-6 text-blue-700">
                            ${avgIncome}k
                          </div>
                        </div>

                        {/* Income with UBI Bar */}
                        <div
                          class="absolute bottom-0 w-1/3 bg-green-500 border border-green-600 transition-all duration-700 rounded-t-md"
                          style={{
                            height: `${incomeWithUBIHeight}%`,
                            right: "25%",
                            opacity: isChartRendered.value ? "1" : "0",
                            transform: isChartRendered.value
                              ? "translateY(0)"
                              : "translateY(20px)",
                            transitionDelay: "0.3s",
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
        </div>

        {/* X-axis labels */}
        <div class="flex mt-2 text-sm text-gray-600 pl-12">
          {taxEntries.map((entry) => (
            <div key={entry.quintile} class="flex-1 text-center font-medium">
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

        <div class="mt-6 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
          <p>
            *{" "}
            <TranslatableText text="All values are in thousands of dollars." />
          </p>
          <p class="mt-2">
            <TranslatableText text="Each quintile represents exactly 20% of the taxpayer population. Quintiles divide the population into five equal groups based on income level, from lowest (Q1) to highest (Q5)." />
          </p>
        </div>
      </div>
    );
  }
);
