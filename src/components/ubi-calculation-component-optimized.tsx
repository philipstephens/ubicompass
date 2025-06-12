import { component$, useContext } from "@builder.io/qwik";
import { CspCardComponent } from "./csp-card-component";
import { TaxationModelSelector } from "./taxation-model-selector";
import { UbiYearSelector } from "./ubi-year-selector";
import { TaxationProvider } from "./taxation-provider";
import { TaxationStrategyComparison } from "./taxation-strategy-comparison";
import { UbiCalculationTable } from "./ubi-calculation-table";
import { UbiDataContext } from "../stores/ubi-data-store";
import "./ubi-calculation-component.css";

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
  // Get the UBI data store
  const ubiStore = useContext(UbiDataContext);

  console.log("UbiCalculationComponent rendering with state:", {
    isLoading: ubiStore.isLoading,
    error: ubiStore.error,
    yearData: ubiStore.yearData?.length,
    selectedYearId: ubiStore.selectedYearId,
    selectedYear: ubiStore.selectedYear ? "exists" : "null",
    taxEntries: ubiStore.taxEntries?.length,
    taxationModelData: ubiStore.taxationModelData ? "exists" : "null",
  });

  // Force a refresh if data is missing
  if (!ubiStore.yearData || ubiStore.yearData.length === 0) {
    console.log("No year data found, triggering refresh");
    ubiStore.refreshTrigger = Date.now();
  }

  return (
    <div>
      <div
        style={{
          backgroundColor: "lightblue",
          padding: "5px",
          marginBottom: "10px",
        }}
      >
        <h3>UBI Calculation Component</h3>
        <p>
          If you can see this, the UbiCalculationComponent is rendering
          correctly.
        </p>
        <p>Is Loading: {String(ubiStore.isLoading)}</p>
        <p>Has Error: {ubiStore.error ? "Yes" : "No"}</p>
        <p>Year Data Count: {ubiStore.yearData?.length || 0}</p>
        <p>Selected Year ID: {ubiStore.selectedYearId || "None"}</p>
      </div>

      <CspCardComponent
        title="UBI Calculation"
        backgroundColor="rgb(240, 240, 255)"
      >
        <div class="ubi-calculation-container">
          {ubiStore.isLoading ? (
            <div class="loading">Loading UBI data...</div>
          ) : ubiStore.error ? (
            <div class="error">
              <p>
                <strong>Error:</strong> {ubiStore.error}
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
                    Check the browser console for more detailed error
                    information
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
                yearData={ubiStore.yearData}
                selectedYearId={ubiStore.selectedYearId}
                onYearChange$={(event) => {
                  const select = event.target as HTMLSelectElement;
                  ubiStore.yearChangeId = select.value;
                }}
                onRefresh$={() => {
                  ubiStore.refreshTrigger = Date.now();
                }}
                selectedYear={ubiStore.selectedYear}
              />

              {/* Taxation Model Selection */}
              <TaxationModelSelector
                taxationModels={ubiStore.taxationModels}
                selectedModelId={ubiStore.selectedModelId}
                modelDescription={
                  ubiStore.taxationModelData?.model.description || null
                }
                onModelChange$={(event) => {
                  const select = event.target as HTMLSelectElement;
                  ubiStore.modelChangeId = parseInt(select.value);
                }}
              />

              {ubiStore.selectedYearId === "new" ? (
                <div class="new-entry-form">
                  <h3>Create New UBI Entry</h3>
                  {/* New entry form will go here in a future implementation */}
                  <p>New entry form coming soon...</p>
                </div>
              ) : ubiStore.selectedYear ? (
                <div class="calculation-results">
                  <div class="calculation-header">
                    <h3>
                      Data for {ubiStore.selectedYear.taxyear} | $
                      {ubiStore.selectedYear.ubiamount.toLocaleString()} |{" "}
                      {ubiStore.selectedYear.flattaxpercentage}%
                      <span class="taxpayers-count">
                        {(
                          ubiStore.selectedYear.taxpayersperquintile * 1000
                        ).toLocaleString()}{" "}
                        Taxpayers
                      </span>
                    </h3>
                  </div>
                  <hr class="calculation-divider" />

                  {ubiStore.isLoadingEntries ? (
                    <div class="loading-entries">Loading tax entries...</div>
                  ) : ubiStore.taxEntries.length === 0 ? (
                    <div class="no-entries">
                      No tax entries found for this year
                    </div>
                  ) : (
                    <div class="calculation-table-container">
                      <UbiCalculationTable
                        taxEntries={ubiStore.taxEntries}
                        selectedYear={ubiStore.selectedYear}
                        taxationModelData={ubiStore.taxationModelData}
                      />

                      <div class="calculation-footnote">
                        <p>* All values are in thousands of dollars.</p>
                      </div>

                      {/* Add the Taxation Strategy Comparison wrapped in TaxationProvider */}
                      <TaxationProvider
                        selectedModelId={ubiStore.selectedModelId}
                        taxationModelData={ubiStore.taxationModelData}
                        taxEntries={ubiStore.taxEntries}
                        selectedYear={ubiStore.selectedYear}
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
    </div>
  );
});
