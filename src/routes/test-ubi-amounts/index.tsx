import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { UbiAmountsControl } from "~/components/ubi-amounts-control";
import { getAvailableYears } from "~/lib/db";

// Add this debugging function to your test page
const debugAPI = $(async () => {
  try {
    // Test the API directly
    const response = await fetch(
      "/api/statscan?action=population&year=2022&childAge=12&youthAge=21&seniorAge=55"
    );
    const result = await response.json();
    console.log("Direct API test:", result);
  } catch (error) {
    console.error("Direct API test failed:", error);
  }
});

// Route loader to get initial data (server-side only)
export const useYearsData = routeLoader$(async () => {
  try {
    const years = await getAvailableYears();
    return {
      success: true,
      years: years.sort((a: number, b: number) => b - a),
    };
  } catch (error) {
    console.error("Error fetching years:", error);
    return {
      success: false,
      years: [2022, 2021, 2020, 2019, 2018], // Fallback years
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
});

export default component$(() => {
  // Get initial data from route loader
  const yearsData = useYearsData();

  // State for database integration
  const selectedYear = useSignal<number>(yearsData.value.years[0] || 2022);
  const populationData = useSignal<{
    children: number;
    youth: number;
    adults: number;
    seniors: number;
    total: number;
    isEstimated: boolean;
  } | null>(null);
  const isLoading = useSignal(true);
  const error = useSignal<string | null>(null);

  // Age cutoffs matching your UBI Compass constraints
  const childAgeCutoff = 12; // Children: 0-12
  const youthAgeCutoff = 21; // Youth: 13-21
  const seniorAgeCutoff = 55; // Seniors: 55+, Adults: 22-54

  // Function to fetch population data - client-side only
  const fetchPopulationData = $(async (year: number) => {
    try {
      const url = `/api/statscan?action=population&year=${year}&childAge=${childAgeCutoff}&youthAge=${youthAgeCutoff}&seniorAge=${seniorAgeCutoff}`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        populationData.value = {
          children: result.data.childPopulation || 5000000,
          youth: result.data.youthPopulation || 3000000,
          adults: result.data.adultPopulation || 15000000,
          seniors: result.data.seniorPopulation || 7000000,
          total: result.data.totalPopulation || 30000000,
          isEstimated: false,
        };
      } else {
        throw new Error("Failed to fetch population data from API");
      }
    } catch (err) {
      console.error("Error fetching population data:", err);
      // Use fallback data
      populationData.value = {
        children: 5000000,
        youth: 3000000,
        adults: 15000000,
        seniors: 7000000,
        total: 30000000,
        isEstimated: true,
      };
    }
  });

  // Load initial population data (client-side only)
  useVisibleTask$(async () => {
    if (yearsData.value.success) {
      selectedYear.value = yearsData.value.years[0];
    }

    isLoading.value = true;
    error.value = yearsData.value.success ? null : "Database connection failed";

    await fetchPopulationData(selectedYear.value);
    isLoading.value = false;
  });

  // Handle year change
  const handleYearChange = $(async (newYear: number) => {
    selectedYear.value = newYear;
    isLoading.value = true;
    await fetchPopulationData(newYear);
    isLoading.value = false;
  });

  return (
    <div style="padding: 2rem; background: #f3f4f6; min-height: 100vh;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <h1 style="text-align: center; margin-bottom: 2rem; color: #1f2937;">
          UBI Amounts Control Test - Database Integration
        </h1>

        {/* Year Selection */}
        <div style="margin-bottom: 2rem; padding: 1rem; background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
            <label style="font-weight: 600; color: #374151;">Tax Year:</label>
            <select
              value={selectedYear.value}
              onChange$={(e) =>
                handleYearChange(
                  parseInt((e.target as HTMLSelectElement).value)
                )
              }
              style="padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; background: white;"
              disabled={isLoading.value}
            >
              {yearsData.value.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {populationData.value && (
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-left: auto;">
                <span style="font-size: 0.875rem; color: #6b7280;">
                  Population:{" "}
                  {(populationData.value.total / 1000000).toFixed(1)}M
                </span>
                {populationData.value.isEstimated && (
                  <span style="font-size: 0.75rem; color: #f59e0b; background: #fef3c7; padding: 0.25rem 0.5rem; border-radius: 0.25rem;">
                    ~
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Database Status */}
          <div style="margin-top: 0.5rem; font-size: 0.75rem;">
            {yearsData.value.success ? (
              <span style="color: #10b981;">✅ Connected to database</span>
            ) : (
              <span style="color: #f59e0b;">⚠️ Using fallback data</span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading.value && (
          <div style="text-align: center; padding: 2rem;">
            <div style="color: #6b7280;">
              Loading population data for {selectedYear.value}...
            </div>
          </div>
        )}

        {/* Error State */}
        {error.value && (
          <div style="margin-bottom: 2rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 0.5rem; color: #dc2626;">
            <strong>Warning:</strong> {error.value}
            <br />
            <small>Using fallback data for demonstration.</small>
          </div>
        )}

        {/* UBI Amounts Control */}
        {populationData.value && !isLoading.value && (
          <UbiAmountsControl
            initialChildUbi={200}
            initialYouthUbi={800}
            initialAdultUbi={1200}
            initialSeniorUbi={1400}
            childPopulation={populationData.value.children}
            youthPopulation={populationData.value.youth}
            adultPopulation={populationData.value.adults}
            seniorPopulation={populationData.value.seniors}
            showPieCharts={true}
            showMonthlyAndAnnual={true}
            onUbiAmountsChange$={(amounts) => {
              console.log("UBI amounts changed:", amounts);
              console.log(
                "Total annual cost (CAD):",
                (
                  (amounts.child * populationData.value!.children +
                    amounts.youth * populationData.value!.youth +
                    amounts.adult * populationData.value!.adults +
                    amounts.senior * populationData.value!.seniors) *
                  12
                ).toLocaleString()
              );
            }}
          />
        )}

        <div style="margin-top: 2rem; padding: 1rem; background: white; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h3 style="margin-bottom: 1rem; color: #1f2937;">
            Database Integration Features:
          </h3>
          <ul style="color: #6b7280; line-height: 1.6;">
            <li>✅ Automatically loads the latest year from your database</li>
            <li>✅ Uses real Canadian population data by age groups</li>
            <li>
              ✅ Age constraints: Children (0-12), Youth (13-21), Adults
              (22-54), Seniors (55+)
            </li>
            <li>✅ Fallback to estimates if database is unavailable</li>
            <li>✅ Year selector to test different years</li>
            <li>✅ Real-time UBI cost calculations in console</li>
            <li>✅ 4 separate sliders with constraint enforcement</li>
            <li>
              ✅ Interactive pie charts for population and cost distribution
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "UBI Amounts Control Test - Database Integration",
  meta: [
    {
      name: "description",
      content:
        "Test page for the UBI amounts control component with database integration",
    },
  ],
};
