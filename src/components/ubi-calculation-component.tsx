import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { CspCardComponent } from "./csp-card-component";
import { UbiCalculationSummary } from "./ubi-calculation-summary";
import { TaxationModelSelector } from "./taxation-model-selector";
import { UbiYearSelector } from "./ubi-year-selector";
import { TaxationStrategyComparison } from "./taxation-strategy-comparison";
import { TaxationProvider } from "./taxation-provider";
import "./ubi-calculation-component.css";
import type { TaxationModel, TaxationModelData } from "../models/taxation";
import {
  getMockTaxationModels,
  getMockTaxationModelData,
} from "../services/taxation-service";

export interface YearMetaData {
  ubiid: number;
  taxyear: number;
  ubiamount: number;
  taxpayersperquintile: number;
  flattaxpercentage: number;
}

export interface TaxEntry {
  entryid: number;
  quintile: number;
  averagetaxableincome: number;
  mediantax: number;
  ubiid: number;
}

export const UbiCalculationComponent = component$(() => {
  const yearData = useSignal<YearMetaData[]>([]);
  const taxEntries = useSignal<TaxEntry[]>([]);
  const selectedYearId = useSignal<string>("");
  const isLoading = useSignal(true);
  const isLoadingEntries = useSignal(false);
  const error = useSignal("");

  // Taxation model state
  const taxationModels = useSignal<TaxationModel[]>([]);
  const selectedModelId = useSignal<number>(1); // Default to Flat Tax (model_id = 1)
  const taxationModelData = useSignal<TaxationModelData | null>(null);

  // Define fetchTaxEntries function using mock data
  const fetchTaxEntries = $(async (ubiId: string) => {
    if (ubiId === "new" || ubiId === "") {
      taxEntries.value = [];
      return;
    }

    try {
      isLoadingEntries.value = true;
      console.log(`Fetching mock tax entries for UBI ID: ${ubiId}`);

      // Create mock tax entries
      const mockTaxEntries: TaxEntry[] = [
        {
          entryid: 1,
          quintile: 1,
          averagetaxableincome: 10,
          mediantax: 0,
          ubiid: parseInt(ubiId),
        },
        {
          entryid: 2,
          quintile: 2,
          averagetaxableincome: 30,
          mediantax: 2,
          ubiid: parseInt(ubiId),
        },
        {
          entryid: 3,
          quintile: 3,
          averagetaxableincome: 50,
          mediantax: 5.5,
          ubiid: parseInt(ubiId),
        },
        {
          entryid: 4,
          quintile: 4,
          averagetaxableincome: 75,
          mediantax: 11,
          ubiid: parseInt(ubiId),
        },
        {
          entryid: 5,
          quintile: 5,
          averagetaxableincome: 200,
          mediantax: 35,
          ubiid: parseInt(ubiId),
        },
      ];

      console.log("Mock tax entries:", mockTaxEntries);

      // Sort by quintile
      taxEntries.value = mockTaxEntries.sort(
        (a: TaxEntry, b: TaxEntry) => a.quintile - b.quintile
      );
    } catch (err) {
      console.error(
        `Failed to create mock tax entries for UBI ID ${ubiId}:`,
        err
      );
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      isLoadingEntries.value = false;
    }
  });

  const handleYearChange = $((event: Event) => {
    const select = event.target as HTMLSelectElement;
    const newYearId = select.value;
    selectedYearId.value = newYearId;

    // Fetch tax entries for the selected year
    fetchTaxEntries(newYearId);
  });

  // Function to fetch taxation model data
  const fetchTaxationModelData = $(async (modelId: number, ubiId: number) => {
    try {
      console.log(
        `Fetching taxation model data for model ${modelId}, UBI ID ${ubiId}`
      );

      // Always use mock data since we're having issues with the backend
      console.log("Using mock data for taxation models");
      const modelData = getMockTaxationModelData(modelId, ubiId);
      taxationModelData.value = modelData;

      console.log("Taxation model data:", modelData);
    } catch (err) {
      console.error(
        `Failed to fetch taxation model data for model ${modelId}, UBI ID ${ubiId}:`,
        err
      );
      error.value = err instanceof Error ? err.message : "Unknown error";
    }
  });

  // Function to handle taxation model change
  const handleModelChange = $((event: Event) => {
    const select = event.target as HTMLSelectElement;
    const newModelId = parseInt(select.value);
    selectedModelId.value = newModelId;

    // Fetch taxation model data for the selected model and UBI year
    if (selectedYearId.value && selectedYearId.value !== "new") {
      fetchTaxationModelData(newModelId, parseInt(selectedYearId.value));
    }
  });

  // Function to refresh data - using mock data only
  const refreshData = $(async () => {
    console.log("Refreshing data with mock data...");
    isLoading.value = true;
    error.value = "";

    // Clear existing data
    yearData.value = [];
    taxEntries.value = [];
    taxationModelData.value = null;

    try {
      // Create mock data for testing
      console.log("Using mock data for testing");
      const mockData: YearMetaData[] = [
        {
          ubiid: 1,
          taxyear: 2023,
          ubiamount: 2000,
          taxpayersperquintile: 6140,
          flattaxpercentage: 30,
        },
      ];

      // Use the mock data
      yearData.value = mockData;

      // Fetch taxation models
      taxationModels.value = getMockTaxationModels();
      console.log("Taxation models:", taxationModels.value);

      // Set the first item as selected by default
      if (yearData.value.length > 0) {
        const firstYearId = yearData.value[0].ubiid.toString();
        selectedYearId.value = firstYearId;

        // Create mock tax entries
        const mockTaxEntries: TaxEntry[] = [
          {
            entryid: 1,
            quintile: 1,
            averagetaxableincome: 10,
            mediantax: 0,
            ubiid: 1,
          },
          {
            entryid: 2,
            quintile: 2,
            averagetaxableincome: 30,
            mediantax: 2,
            ubiid: 1,
          },
          {
            entryid: 3,
            quintile: 3,
            averagetaxableincome: 50,
            mediantax: 5.5,
            ubiid: 1,
          },
          {
            entryid: 4,
            quintile: 4,
            averagetaxableincome: 75,
            mediantax: 11,
            ubiid: 1,
          },
          {
            entryid: 5,
            quintile: 5,
            averagetaxableincome: 200,
            mediantax: 35,
            ubiid: 1,
          },
        ];

        taxEntries.value = mockTaxEntries;

        // Fetch taxation model data for the selected model and UBI year
        await fetchTaxationModelData(
          selectedModelId.value,
          parseInt(firstYearId)
        );
      }
    } catch (err) {
      console.error("Failed to refresh data:", err);
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      isLoading.value = false;
    }
  });

  // Find the selected year data
  const getSelectedYearData = () => {
    if (selectedYearId.value === "new" || selectedYearId.value === "") {
      return null;
    }

    return yearData.value.find(
      (year) => year.ubiid.toString() === selectedYearId.value
    );
  };

  const selectedYear = getSelectedYearData();

  // Initialize with mock data
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ cleanup }) => {
    // Clear any cached data
    yearData.value = [];
    taxEntries.value = [];
    selectedYearId.value = "";
    taxationModels.value = [];
    taxationModelData.value = null;

    // Add cleanup function to clear data when component unmounts
    cleanup(() => {
      console.log("Cleaning up UBI Calculation Component");
      yearData.value = [];
      taxEntries.value = [];
      taxationModels.value = [];
      taxationModelData.value = null;
    });

    try {
      isLoading.value = true;
      error.value = ""; // Clear any previous errors

      console.log("Initializing with mock data...");

      // Create mock data for testing
      const mockData: YearMetaData[] = [
        {
          ubiid: 1,
          taxyear: 2023,
          ubiamount: 2000,
          taxpayersperquintile: 6140,
          flattaxpercentage: 30,
        },
      ];

      // Use the mock data
      console.log("Using mock data for testing");
      yearData.value = mockData;

      // Get mock taxation models
      taxationModels.value = getMockTaxationModels();
      console.log("Taxation models:", taxationModels.value);

      // Initialize with the first year
      if (yearData.value.length > 0) {
        const firstYearId = yearData.value[0].ubiid.toString();
        selectedYearId.value = firstYearId;

        // Create mock tax entries
        const mockTaxEntries: TaxEntry[] = [
          {
            entryid: 1,
            quintile: 1,
            averagetaxableincome: 10,
            mediantax: 0,
            ubiid: 1,
          },
          {
            entryid: 2,
            quintile: 2,
            averagetaxableincome: 30,
            mediantax: 2,
            ubiid: 1,
          },
          {
            entryid: 3,
            quintile: 3,
            averagetaxableincome: 50,
            mediantax: 5.5,
            ubiid: 1,
          },
          {
            entryid: 4,
            quintile: 4,
            averagetaxableincome: 75,
            mediantax: 11,
            ubiid: 1,
          },
          {
            entryid: 5,
            quintile: 5,
            averagetaxableincome: 200,
            mediantax: 35,
            ubiid: 1,
          },
        ];

        taxEntries.value = mockTaxEntries;

        // Get taxation model data for the selected model and UBI year
        await fetchTaxationModelData(
          selectedModelId.value,
          parseInt(firstYearId)
        );
      }
    } catch (err) {
      console.error("Failed to initialize with mock data:", err);
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      isLoading.value = false;
    }
  });

  return (
    <CspCardComponent
      title="UBI Calculation"
      backgroundColor="rgb(240, 240, 255)"
    >
      <div class="ubi-calculation-container">
        {isLoading.value ? (
          <div class="loading">Loading UBI data...</div>
        ) : error.value ? (
          <div class="error">
            <p>
              <strong>Error:</strong> {error.value}
            </p>
            <div class="error-help">
              <p>Troubleshooting steps:</p>
              <ol>
                <li>
                  Make sure your backend server is running at
                  http://localhost:8000
                </li>
                <li>
                  Check that your PostgreSQL database is running on port 7000
                </li>
                <li>Verify that you have data in the UBIDatabase</li>
                <li>
                  Check the browser console for more detailed error information
                </li>
                <li>
                  Try accessing the API directly in your browser:
                  <a
                    href="http://localhost:8000/api/year-meta-data"
                    target="_blank"
                  >
                    http://localhost:8000/api/year-meta-data
                  </a>
                </li>
                <li>
                  Check if the test server is accessible:
                  <a href="http://localhost:8001/api/test" target="_blank">
                    http://localhost:8001/api/test
                  </a>
                </li>
                <li>
                  Try disabling any browser extensions that might be blocking
                  the requests
                </li>
              </ol>
            </div>
          </div>
        ) : (
          <div class="ubi-form">
            <UbiYearSelector
              yearData={yearData.value}
              selectedYearId={selectedYearId.value}
              onYearChange$={handleYearChange}
              onRefresh$={refreshData}
              selectedYear={selectedYear || null}
            />

            {/* Taxation Model Selection */}
            <TaxationModelSelector
              taxationModels={taxationModels.value}
              selectedModelId={selectedModelId.value}
              modelDescription={
                taxationModelData.value?.model.description || null
              }
              onModelChange$={handleModelChange}
            />

            {selectedYearId.value === "new" ? (
              <div class="new-entry-form">
                <h3>Create New UBI Entry</h3>
                {/* New entry form will go here in a future implementation */}
                <p>New entry form coming soon...</p>
              </div>
            ) : selectedYear ? (
              <div class="calculation-results">
                <div class="calculation-header">
                  <h3>
                    Data for {selectedYear.taxyear} | $
                    {selectedYear.ubiamount.toLocaleString()} |{" "}
                    {selectedYear.flattaxpercentage}%
                    <span class="taxpayers-count">
                      {(
                        selectedYear.taxpayersperquintile * 1000
                      ).toLocaleString()}{" "}
                      Taxpayers
                    </span>
                  </h3>
                </div>
                <hr class="calculation-divider" />

                {isLoadingEntries.value ? (
                  <div class="loading-entries">Loading tax entries...</div>
                ) : taxEntries.value.length === 0 ? (
                  <div class="no-entries">
                    No tax entries found for this year
                  </div>
                ) : (
                  <div class="calculation-table-container">
                    <table class="calculation-table">
                      <thead>
                        <tr class="table-header">
                          <th class="description-col">Description</th>
                          <th>Q1</th>
                          <th>Q2</th>
                          <th>Q3</th>
                          <th>Q4</th>
                          <th>Q5</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Average Taxable Income */}
                        <tr>
                          <td class="description-col">
                            Average Taxable Income: T
                          </td>
                          {taxEntries.value.map((entry) => (
                            <td key={`income-${entry.quintile}`}>
                              ${entry.averagetaxableincome.toLocaleString()}
                            </td>
                          ))}
                          <td>-</td>
                        </tr>

                        {/* Median Tax */}
                        <tr>
                          <td class="description-col">Median Tax: M</td>
                          {taxEntries.value.map((entry) => (
                            <td key={`tax-${entry.quintile}`}>
                              $
                              {entry.mediantax.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          ))}
                          <td>-</td>
                        </tr>

                        {/* Tax Revenue */}
                        <tr>
                          <td class="description-col">Tax Revenue: M * N</td>
                          {taxEntries.value.map((entry) => {
                            // Since mediantax is already in thousands, we don't need to multiply by 1000 again
                            const revenue =
                              entry.mediantax *
                              selectedYear.taxpayersperquintile;
                            return (
                              <td key={`revenue-${entry.quintile}`}>
                                $
                                {revenue.toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                })}
                              </td>
                            );
                          })}
                          <td>
                            $
                            {taxEntries.value
                              .reduce(
                                (sum, entry) =>
                                  sum +
                                  entry.mediantax *
                                    selectedYear.taxpayersperquintile,
                                0
                              )
                              .toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                          </td>
                        </tr>

                        {/* Income with UBI */}
                        <tr>
                          <td class="description-col">Income with UBI: U</td>
                          {taxEntries.value.map((entry) => {
                            // Calculate yearly UBI in thousands
                            // UBIAmount is monthly, so multiply by 12 and divide by 1000 to get yearly in thousands
                            const yearlyUbiInThousands =
                              (selectedYear.ubiamount * 12) / 1000;

                            console.log(
                              `Q${entry.quintile} income: ${entry.averagetaxableincome}, UBI: ${selectedYear.ubiamount} monthly, ${yearlyUbiInThousands} yearly in thousands, Total: ${entry.averagetaxableincome + yearlyUbiInThousands}`
                            );

                            const incomeWithUbi =
                              entry.averagetaxableincome + yearlyUbiInThousands;
                            return (
                              <td key={`ubi-income-${entry.quintile}`}>
                                $
                                {/* Force display as integer with no decimal places */}
                                {Math.round(incomeWithUbi).toLocaleString()}
                              </td>
                            );
                          })}
                          <td>
                            $
                            {/* Force display as integer with no decimal places */}
                            {Math.round(
                              taxEntries.value.reduce(
                                (sum, entry) =>
                                  sum + entry.averagetaxableincome,
                                0
                              ) /
                                5 +
                                (selectedYear.ubiamount * 12) / 1000
                            ).toLocaleString()}
                          </td>
                        </tr>

                        {/* Exemption Amount */}
                        <tr>
                          <td class="description-col">Exemption Amount</td>
                          {taxEntries.value.map((entry) => (
                            <td key={`exemption-${entry.quintile}`}>$24</td>
                          ))}
                          <td>$24</td>
                        </tr>

                        {/* Taxable Income (Income with UBI - Exemption) */}
                        <tr>
                          <td class="description-col">
                            Taxable Income (U - Exemption)
                          </td>
                          {taxEntries.value.map((entry) => {
                            // Calculate yearly UBI in thousands
                            const yearlyUbiInThousands =
                              (selectedYear.ubiamount * 12) / 1000;
                            const incomeWithUbi =
                              entry.averagetaxableincome + yearlyUbiInThousands;
                            // Subtract exemption amount ($24k = $24 in thousands)
                            const exemptionAmount = 24;
                            const taxableIncome = Math.max(
                              0,
                              incomeWithUbi - exemptionAmount
                            );

                            return (
                              <td key={`taxable-income-${entry.quintile}`}>
                                $
                                {/* Force display as integer with no decimal places */}
                                {Math.round(taxableIncome).toLocaleString()}
                              </td>
                            );
                          })}
                          <td>
                            $
                            {/* Force display as integer with no decimal places */}
                            {Math.round(
                              Math.max(
                                0,
                                taxEntries.value.reduce(
                                  (sum, entry) =>
                                    sum + entry.averagetaxableincome,
                                  0
                                ) /
                                  5 +
                                  (selectedYear.ubiamount * 12) / 1000 -
                                  24
                              )
                            ).toLocaleString()}
                          </td>
                        </tr>

                        {/* Tax Revenue with UBI */}
                        <tr>
                          <td class="description-col">
                            Tax Revenue with UBI (
                            {taxationModelData.value?.model.model_name}):
                          </td>
                          {taxEntries.value.map((entry) => {
                            // Calculate yearly UBI in thousands
                            // UBIAmount is monthly, so multiply by 12 and divide by 1000 to get yearly in thousands
                            const yearlyUbiInThousands =
                              (selectedYear.ubiamount * 12) / 1000;
                            const incomeWithUbi =
                              entry.averagetaxableincome + yearlyUbiInThousands;

                            let taxWithUbi = 0;

                            // Calculate tax based on the selected model
                            if (taxationModelData.value) {
                              const modelType =
                                taxationModelData.value.model.model_name;

                              if (modelType === "Flat Tax") {
                                // Flat tax calculation
                                const exemptionAmount =
                                  taxationModelData.value.parameters
                                    .exemption_amount / 1000; // Convert to thousands
                                const taxRate =
                                  taxationModelData.value.parameters.tax_rate /
                                  100;
                                const taxableIncome = Math.max(
                                  0,
                                  incomeWithUbi - exemptionAmount
                                );
                                taxWithUbi = taxableIncome * taxRate;
                              } else if (modelType === "Progressive Tax") {
                                // Progressive tax calculation using brackets
                                const exemptionAmount =
                                  taxationModelData.value.parameters
                                    .exemption_amount / 1000; // Convert to thousands
                                const taxableIncome = Math.max(
                                  0,
                                  incomeWithUbi - exemptionAmount
                                );

                                // Sort brackets by lower bound
                                const sortedBrackets = [
                                  ...taxationModelData.value.brackets,
                                ].sort((a, b) => a.lower_bound - b.lower_bound);

                                let remainingIncome = taxableIncome;
                                taxWithUbi = 0;

                                // Calculate tax for each bracket
                                for (const bracket of sortedBrackets) {
                                  // Convert bracket bounds to thousands
                                  const lowerBound = bracket.lower_bound / 1000;
                                  const upperBound = bracket.upper_bound
                                    ? bracket.upper_bound / 1000
                                    : Infinity;

                                  // Skip if bracket is below exemption or we've run out of income
                                  if (
                                    upperBound <= exemptionAmount ||
                                    remainingIncome <= 0
                                  )
                                    continue;

                                  // Adjust lower bound if it's below exemption
                                  const adjustedLowerBound = Math.max(
                                    lowerBound,
                                    exemptionAmount
                                  );

                                  // Calculate income in this bracket
                                  const incomeInBracket = Math.min(
                                    remainingIncome,
                                    upperBound - adjustedLowerBound
                                  );

                                  // If no income in this bracket, move to next
                                  if (incomeInBracket <= 0) continue;

                                  // Calculate tax for this bracket
                                  taxWithUbi +=
                                    incomeInBracket * (bracket.tax_rate / 100);

                                  // Reduce remaining income
                                  remainingIncome -= incomeInBracket;

                                  // If no more income to tax, break
                                  if (remainingIncome <= 0) break;
                                }
                              } else if (modelType === "Bell Curve") {
                                // Bell curve calculation
                                const exemptionAmount =
                                  taxationModelData.value.parameters
                                    .exemption_amount / 1000; // Convert to thousands
                                const bellCurveCenter =
                                  taxationModelData.value.parameters
                                    .bell_curve_center;
                                const bellCurveWidth =
                                  taxationModelData.value.parameters
                                    .bell_curve_width;
                                const maxTaxRate =
                                  taxationModelData.value.parameters
                                    .max_tax_rate / 100;
                                const maxTaxAmount =
                                  taxationModelData.value.parameters
                                    .max_tax_amount / 1000; // Convert to thousands

                                // Apply exemption
                                const taxableIncome = Math.max(
                                  0,
                                  incomeWithUbi - exemptionAmount
                                );

                                // Find which percentile this income falls into
                                const incomePercentile = entry.quintile * 20; // Approximate percentile based on quintile

                                // Calculate tax rate using bell curve formula
                                const taxRate =
                                  maxTaxRate *
                                  Math.exp(
                                    -Math.pow(
                                      incomePercentile - bellCurveCenter,
                                      2
                                    ) /
                                      (2 * Math.pow(bellCurveWidth, 2))
                                  );

                                // Calculate tax
                                const calculatedTax = taxableIncome * taxRate;

                                // Apply maximum tax cap
                                taxWithUbi = Math.min(
                                  calculatedTax,
                                  maxTaxAmount
                                );
                              }
                            } else {
                              // Fallback to flat tax if no model data
                              const exemptionAmount = 24; // $24k in thousands
                              const taxRate =
                                selectedYear.flattaxpercentage / 100;
                              const taxableIncome = Math.max(
                                0,
                                incomeWithUbi - exemptionAmount
                              );
                              taxWithUbi = taxableIncome * taxRate;
                            }

                            // Since monetary values are already in thousands, we don't need to multiply by 1000 again
                            const totalTaxWithUbi =
                              taxWithUbi * selectedYear.taxpayersperquintile;

                            return (
                              <td key={`ubi-tax-${entry.quintile}`}>
                                $
                                {/* Force display as integer with no decimal places */}
                                {Math.round(totalTaxWithUbi).toLocaleString()}
                              </td>
                            );
                          })}
                          <td>
                            $
                            {/* Force display as integer with no decimal places */}
                            {Math.round(
                              taxEntries.value.reduce((sum, entry) => {
                                // Calculate yearly UBI in thousands
                                // UBIAmount is monthly, so multiply by 12 and divide by 1000 to get yearly in thousands
                                const yearlyUbiInThousands =
                                  (selectedYear.ubiamount * 12) / 1000;
                                const incomeWithUbi =
                                  entry.averagetaxableincome +
                                  yearlyUbiInThousands;

                                let taxWithUbi = 0;

                                // Calculate tax based on the selected model
                                if (taxationModelData.value) {
                                  const modelType =
                                    taxationModelData.value.model.model_name;

                                  if (modelType === "Flat Tax") {
                                    // Flat tax calculation
                                    const exemptionAmount =
                                      taxationModelData.value.parameters
                                        .exemption_amount / 1000;
                                    const taxRate =
                                      taxationModelData.value.parameters
                                        .tax_rate / 100;
                                    const taxableIncome = Math.max(
                                      0,
                                      incomeWithUbi - exemptionAmount
                                    );
                                    taxWithUbi = taxableIncome * taxRate;
                                  } else if (modelType === "Progressive Tax") {
                                    // Progressive tax calculation
                                    const exemptionAmount =
                                      taxationModelData.value.parameters
                                        .exemption_amount / 1000;
                                    const taxableIncome = Math.max(
                                      0,
                                      incomeWithUbi - exemptionAmount
                                    );

                                    // Sort brackets by lower bound
                                    const sortedBrackets = [
                                      ...taxationModelData.value.brackets,
                                    ].sort(
                                      (a, b) => a.lower_bound - b.lower_bound
                                    );

                                    let remainingIncome = taxableIncome;
                                    taxWithUbi = 0;

                                    // Calculate tax for each bracket
                                    for (const bracket of sortedBrackets) {
                                      // Convert bracket bounds to thousands
                                      const lowerBound =
                                        bracket.lower_bound / 1000;
                                      const upperBound = bracket.upper_bound
                                        ? bracket.upper_bound / 1000
                                        : Infinity;

                                      // Skip if bracket is below exemption or we've run out of income
                                      if (
                                        upperBound <= exemptionAmount ||
                                        remainingIncome <= 0
                                      )
                                        continue;

                                      // Adjust lower bound if it's below exemption
                                      const adjustedLowerBound = Math.max(
                                        lowerBound,
                                        exemptionAmount
                                      );

                                      // Calculate income in this bracket
                                      const incomeInBracket = Math.min(
                                        remainingIncome,
                                        upperBound - adjustedLowerBound
                                      );

                                      // If no income in this bracket, move to next
                                      if (incomeInBracket <= 0) continue;

                                      // Calculate tax for this bracket
                                      taxWithUbi +=
                                        incomeInBracket *
                                        (bracket.tax_rate / 100);

                                      // Reduce remaining income
                                      remainingIncome -= incomeInBracket;

                                      // If no more income to tax, break
                                      if (remainingIncome <= 0) break;
                                    }
                                  } else if (modelType === "Bell Curve") {
                                    // Bell curve calculation
                                    const exemptionAmount =
                                      taxationModelData.value.parameters
                                        .exemption_amount / 1000;
                                    const bellCurveCenter =
                                      taxationModelData.value.parameters
                                        .bell_curve_center;
                                    const bellCurveWidth =
                                      taxationModelData.value.parameters
                                        .bell_curve_width;
                                    const maxTaxRate =
                                      taxationModelData.value.parameters
                                        .max_tax_rate / 100;
                                    const maxTaxAmount =
                                      taxationModelData.value.parameters
                                        .max_tax_amount / 1000;

                                    // Apply exemption
                                    const taxableIncome = Math.max(
                                      0,
                                      incomeWithUbi - exemptionAmount
                                    );

                                    // Find which percentile this income falls into
                                    const incomePercentile =
                                      entry.quintile * 20; // Approximate percentile based on quintile

                                    // Calculate tax rate using bell curve formula
                                    const taxRate =
                                      maxTaxRate *
                                      Math.exp(
                                        -Math.pow(
                                          incomePercentile - bellCurveCenter,
                                          2
                                        ) /
                                          (2 * Math.pow(bellCurveWidth, 2))
                                      );

                                    // Calculate tax
                                    const calculatedTax =
                                      taxableIncome * taxRate;

                                    // Apply maximum tax cap
                                    taxWithUbi = Math.min(
                                      calculatedTax,
                                      maxTaxAmount
                                    );
                                  }
                                } else {
                                  // Fallback to flat tax if no model data
                                  const exemptionAmount = 24; // $24k in thousands
                                  const taxRate =
                                    selectedYear.flattaxpercentage / 100;
                                  const taxableIncome = Math.max(
                                    0,
                                    incomeWithUbi - exemptionAmount
                                  );
                                  taxWithUbi = taxableIncome * taxRate;
                                }

                                return (
                                  sum +
                                  taxWithUbi * selectedYear.taxpayersperquintile
                                );
                              }, 0)
                            ).toLocaleString()}
                          </td>
                        </tr>

                        {/* Additional Calculation Lines */}
                        <tr>
                          <td colSpan={7}>
                            <UbiCalculationSummary
                              taxEntries={taxEntries.value}
                              selectedYear={selectedYear}
                              taxationModelData={taxationModelData.value}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="calculation-footnote">
                      <p>* All values are in thousands of dollars.</p>
                    </div>

                    {/* Add the Taxation Strategy Comparison wrapped in TaxationProvider */}
                    <TaxationProvider
                      selectedModelId={selectedModelId.value}
                      taxationModelData={taxationModelData.value}
                      taxEntries={taxEntries.value}
                      selectedYear={selectedYear}
                    >
                      <TaxationStrategyComparison />
                    </TaxationProvider>
                  </div>
                )}
              </div>
            ) : (
              <div class="no-year-selected">
                <p>Please select a year to view calculations</p>
              </div>
            )}
          </div>
        )}
      </div>
    </CspCardComponent>
  );
});
