/**
 * Enhanced UBI Compass Component
 * Uses real Statistics Canada data for professional policy analysis
 */

import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";

interface FeasibilityData {
  year: number;
  grossUbiCost: number;
  adultUbiCost: number;
  childUbiCost: number;
  gdpPercentage: number;
  budgetPercentage: number;
  feasibility: string;
  context: {
    gdp: number;
    federalRevenue: number;
    federalExpenditure: number;
    provincialRevenue: number;
    provincialExpenditure: number;
    inflationRate: number;
    population: number;
  };
  population: {
    adults: number;
    children: number;
    total: number;
  };
}

export const UbiCompassEnhanced = component$(() => {
  // State
  const selectedYear = useSignal(2022);
  const ubiAmount = useSignal(24000);
  const childUbiAmount = useSignal(200);
  const availableYears = useSignal<number[]>([]);
  const feasibilityData = useSignal<FeasibilityData | null>(null);
  const loading = useSignal(false);
  const error = useSignal<string>("");

  // Load available years
  useTask$(async () => {
    try {
      console.log("Component: Loading available years...");
      const baseUrl =
        typeof window !== "undefined" ? "" : "http://localhost:5173";
      const response = await fetch(`${baseUrl}/api/statscan/years`);
      console.log("Component: Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Component: API response:", data);

      if (data.success && data.years) {
        availableYears.value = data.years;
        if (data.years.length > 0) {
          selectedYear.value = data.years[0]; // Most recent year
        }
        console.log("Component: Years loaded successfully:", data.years);
      } else {
        throw new Error(data.error || "Invalid response format");
      }
    } catch (err) {
      console.error("Failed to load available years:", err);
      error.value = `Failed to load available years: ${err instanceof Error ? err.message : "Unknown error"}`;

      // Fallback to hardcoded years
      const fallbackYears = [
        2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011,
        2010, 2009, 2008,
      ];
      availableYears.value = fallbackYears;
      selectedYear.value = fallbackYears[0];
      console.log("Component: Using fallback years");
    }
  });

  // Calculate feasibility when parameters change
  const calculateFeasibility = $(async () => {
    loading.value = true;
    error.value = "";

    try {
      console.log("Component: Calculating feasibility...");
      const params = new URLSearchParams({
        year: selectedYear.value.toString(),
        ubiAmount: ubiAmount.value.toString(),
        childUbiAmount: childUbiAmount.value.toString(),
      });

      const baseUrl =
        typeof window !== "undefined" ? "" : "http://localhost:5173";
      const response = await fetch(
        `${baseUrl}/api/statscan/feasibility?${params}`
      );
      console.log("Component: Feasibility response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Component: Feasibility result:", result);

      if (result.success) {
        feasibilityData.value = result.data;
        console.log("Component: Feasibility calculated successfully");
      } else {
        error.value = result.error || "Calculation failed";
      }
    } catch (err) {
      console.error("Feasibility calculation error:", err);
      error.value = `Failed to calculate feasibility: ${err instanceof Error ? err.message : "Unknown error"}`;
    } finally {
      loading.value = false;
    }
  });

  // Auto-calculate when parameters change
  useTask$(({ track }) => {
    track(() => selectedYear.value);
    track(() => ubiAmount.value);
    track(() => childUbiAmount.value);

    if (selectedYear.value && availableYears.value.length > 0) {
      calculateFeasibility();
    }
  });

  // Format currency
  const formatCurrency = (amount: number): string => {
    if (amount >= 1e12) return `$${(amount / 1e12).toFixed(1)}T`;
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  // Get feasibility color
  const getFeasibilityColor = (feasibility: string): string => {
    switch (feasibility) {
      case "FEASIBLE":
        return "text-green-600";
      case "CHALLENGING":
        return "text-yellow-600";
      case "DIFFICULT":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div class="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
        <h1 class="text-3xl font-bold mb-2">🧭 UBI Compass</h1>
        <p class="text-lg opacity-90">
          Professional UBI Policy Analysis with Real Canadian Data
        </p>
        <p class="text-sm opacity-75 mt-2">
          Powered by Statistics Canada • 2000-2023 Economic Data
        </p>
      </div>

      {/* Controls */}
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4 text-gray-800">
          Analysis Parameters
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Year Selection */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Analysis Year
            </label>
            <select
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={selectedYear.value}
              onChange$={(e) =>
                (selectedYear.value = parseInt(
                  (e.target as HTMLSelectElement).value
                ))
              }
            >
              {availableYears.value.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* UBI Amount */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Adult UBI (Annual)
            </label>
            <select
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={ubiAmount.value}
              onChange$={(e) =>
                (ubiAmount.value = parseInt(
                  (e.target as HTMLSelectElement).value
                ))
              }
            >
              <option value={12000}>$12,000 ($1,000/month)</option>
              <option value={18000}>$18,000 ($1,500/month)</option>
              <option value={24000}>$24,000 ($2,000/month)</option>
              <option value={30000}>$30,000 ($2,500/month)</option>
              <option value={36000}>$36,000 ($3,000/month)</option>
            </select>
          </div>

          {/* Child UBI */}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Child UBI (Monthly)
            </label>
            <select
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={childUbiAmount.value}
              onChange$={(e) =>
                (childUbiAmount.value = parseInt(
                  (e.target as HTMLSelectElement).value
                ))
              }
            >
              <option value={0}>$0 (No child UBI)</option>
              <option value={100}>$100 ($1,200/year)</option>
              <option value={200}>$200 ($2,400/year)</option>
              <option value={300}>$300 ($3,600/year)</option>
              <option value={500}>$500 ($6,000/year)</option>
            </select>
          </div>

          {/* Calculate Button */}
          <div class="flex items-end">
            <button
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              onClick$={calculateFeasibility}
              disabled={loading.value}
            >
              {loading.value ? "Calculating..." : "Recalculate"}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error.value && (
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <strong>Error:</strong> {error.value}
        </div>
      )}

      {/* Results */}
      {feasibilityData.value && !loading.value && (
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feasibility Summary */}
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-bold mb-4 text-gray-800">
              UBI Program Feasibility
            </h3>

            <div class="space-y-4">
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="font-medium">Gross Program Cost</span>
                <span class="text-lg font-bold text-blue-600">
                  {formatCurrency(feasibilityData.value.grossUbiCost)}
                </span>
              </div>

              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="font-medium">% of GDP</span>
                <span class="text-lg font-bold">
                  {feasibilityData.value.gdpPercentage.toFixed(1)}%
                </span>
              </div>

              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="font-medium">% of Government Budget</span>
                <span class="text-lg font-bold">
                  {feasibilityData.value.budgetPercentage.toFixed(1)}%
                </span>
              </div>

              <div class="flex justify-between items-center p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg border-2">
                <span class="font-bold text-lg">Feasibility Assessment</span>
                <span
                  class={`text-xl font-bold ${getFeasibilityColor(feasibilityData.value.feasibility)}`}
                >
                  {feasibilityData.value.feasibility}
                </span>
              </div>
            </div>
          </div>

          {/* Economic Context */}
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-bold mb-4 text-gray-800">
              Economic Context ({feasibilityData.value.year})
            </h3>

            <div class="space-y-3">
              <div class="flex justify-between">
                <span>Canadian GDP</span>
                <span class="font-medium">
                  {formatCurrency(feasibilityData.value.context.gdp)}
                </span>
              </div>

              <div class="flex justify-between">
                <span>Federal Budget</span>
                <span class="font-medium">
                  {formatCurrency(
                    feasibilityData.value.context.federalExpenditure
                  )}
                </span>
              </div>

              <div class="flex justify-between">
                <span>Provincial Budgets</span>
                <span class="font-medium">
                  {formatCurrency(
                    feasibilityData.value.context.provincialExpenditure
                  )}
                </span>
              </div>

              <div class="flex justify-between">
                <span>Adult Population</span>
                <span class="font-medium">
                  {(feasibilityData.value.population.adults / 1000000).toFixed(
                    1
                  )}
                  M
                </span>
              </div>

              <div class="flex justify-between">
                <span>Child Population</span>
                <span class="font-medium">
                  {(
                    feasibilityData.value.population.children / 1000000
                  ).toFixed(1)}
                  M
                </span>
              </div>

              <div class="flex justify-between">
                <span>Inflation Rate</span>
                <span class="font-medium">
                  {feasibilityData.value.context.inflationRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Source */}
      <div class="bg-blue-50 border border-blue-200 p-4 rounded-md">
        <p class="text-sm text-blue-800">
          <strong>Data Sources:</strong> Statistics Canada (Income Distribution,
          GDP, Government Finance, CPI), Canadian Census (Population). Analysis
          covers{" "}
          {availableYears.value.length > 0
            ? `${Math.min(...availableYears.value)}-${Math.max(...availableYears.value)}`
            : "multiple years"}
          .
        </p>
      </div>
    </div>
  );
});
