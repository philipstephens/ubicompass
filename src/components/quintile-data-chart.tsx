import {
  component$,
  PropFunction,
  useVisibleTask$,
  useSignal,
} from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";
import { prepareChartData, getChartOptions } from "../utils/chart-data-utils";

/**
 * Component for displaying quintile data as a chart
 */
export const QuintileDataChart = component$(
  ({
    taxEntries,
    calculateTaxRevenue,
    calculateTaxRevenueWithUBI,
    calculateMedianTaxWithUBI,
    calculateUBICost,
    calculateIncomeWithUBI,
    flatTaxPercentage = 30, // Default to 30% if not provided
    ubiAmount = 24, // Default to $24k if not provided
    exemptionAmount = 24, // Default to $24k if not provided
  }: {
    taxEntries: any[];
    calculateTaxRevenue: PropFunction<(entry: any) => number>;
    calculateTaxRevenueWithUBI: PropFunction<(entry: any) => number>;
    calculateMedianTaxWithUBI: PropFunction<(entry: any) => number>;
    calculateUBICost: PropFunction<(entry: any) => number>;
    calculateIncomeWithUBI: PropFunction<(entry: any) => number>;
    flatTaxPercentage?: number;
    ubiAmount?: number;
    exemptionAmount?: number;
  }) => {
    const chartRef = useSignal<HTMLCanvasElement | null>(null);
    const chartInstance = useSignal<any>(null);

    // Initialize and update chart when component is visible
    useVisibleTask$(({ track, cleanup }) => {
      // Track dependencies to update chart when they change
      track(() => flatTaxPercentage);
      track(() => ubiAmount);
      track(() => exemptionAmount);
      track(() => taxEntries);

      // Only proceed if we have a canvas element
      if (!chartRef.value) return;

      // Define an async function to initialize the chart
      const initChart = async () => {
        try {
          // Import Chart.js dynamically (client-side only)
          const ChartModule = await import("chart.js");
          const { Chart, registerables } = ChartModule;

          // Register required components
          Chart.register(...registerables);

          // Destroy previous chart instance if it exists
          if (chartInstance.value) {
            chartInstance.value.destroy();
          }

          // Prepare chart data
          const data = prepareChartData(
            taxEntries,
            (entry) => calculateTaxRevenue(entry),
            (entry) => calculateTaxRevenueWithUBI(entry),
            (entry) => calculateUBICost(entry),
            (entry) => calculateIncomeWithUBI(entry)
          );

          // Get chart options
          const options = getChartOptions();

          // Create new chart
          const ctx = chartRef.value.getContext("2d");
          if (ctx) {
            chartInstance.value = new Chart(ctx, {
              type: "bar",
              data,
              options,
            });

            // Force an update to ensure all datasets are properly initialized
            setTimeout(() => {
              if (chartInstance.value) {
                chartInstance.value.update();
              }
            }, 100);
          }
        } catch (error) {
          console.error("Error initializing chart:", error);
        }
      };

      // Initialize the chart
      initChart();

      // Cleanup function to destroy chart when component unmounts
      cleanup(() => {
        if (chartInstance.value) {
          chartInstance.value.destroy();
          chartInstance.value = null;
        }
      });
    });

    return (
      <div>
        <div>
          <div style={{ height: "500px", position: "relative" }}>
            <canvas ref={chartRef}></canvas>
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
      </div>
    );
  }
);
