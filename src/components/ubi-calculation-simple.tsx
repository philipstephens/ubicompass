import { component$, useContext, useSignal, $ } from "@builder.io/qwik";
import { UbiDataContext } from "../stores/ubi-data-store";
import { CspCardComponent } from "./csp-card-component";
import { IncomeRangeSimple } from "./income-range-simple";
import { TranslatableText } from "./translatable-text";

export const UbiCalculationSimple = component$(() => {
  console.log("UbiCalculationSimple component rendering");

  // Local state for the income range component
  const exemptionAmount = useSignal(24);
  const taxRate = useSignal(30);

  // Handle exemption amount change
  const handleExemptionChange = $((amount: number) => {
    exemptionAmount.value = amount;
    console.log("Exemption amount changed to:", amount);
  });

  try {
    // Get the UBI data store
    const ubiStore = useContext(UbiDataContext);

    console.log("UbiCalculationSimple data:", {
      yearData: ubiStore.yearData?.length,
      taxEntries: ubiStore.taxEntries?.length,
    });

    // Calculate some basic values for display
    const yearlyUbiInThousands = ubiStore.selectedYear
      ? (ubiStore.selectedYear.ubiamount * 12) / 1000
      : 24;

    // Update the exemption amount from the store if available
    if (
      ubiStore.selectedExemptionAmount &&
      exemptionAmount.value !== ubiStore.selectedExemptionAmount
    ) {
      exemptionAmount.value = ubiStore.selectedExemptionAmount;
    }

    // Update the tax rate from the store if available
    if (
      ubiStore.selectedYear?.flattaxpercentage &&
      taxRate.value !== ubiStore.selectedYear.flattaxpercentage
    ) {
      taxRate.value = ubiStore.selectedYear.flattaxpercentage;
    }

    return (
      <div style="border: 5px solid red; margin: 10px; padding: 5px;">
        <h2 style="color: red; text-align: center;">
          UBI CALCULATION SIMPLE COMPONENT
        </h2>
        <CspCardComponent
          title="UBI Calculation (Simple)"
          backgroundColor="rgb(240, 240, 255)"
        >
          <div style="padding: 10px;">
            <h3>UBI Data</h3>

            <div style="margin-bottom: 10px;">
              <p>Loading: {String(ubiStore.isLoading)}</p>
              <p>Error: {ubiStore.error || "None"}</p>
              <p>Year Data Count: {ubiStore.yearData?.length || 0}</p>
              <p>Selected Year ID: {ubiStore.selectedYearId || "None"}</p>
              <p>Tax Entries Count: {ubiStore.taxEntries?.length || 0}</p>
            </div>

            {ubiStore.selectedYear && (
              <div style="margin-top: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px;">
                <h4>Selected Year Data</h4>
                <p>Year: {ubiStore.selectedYear.taxyear}</p>
                <p>
                  UBI Amount: ${ubiStore.selectedYear.ubiamount} per month ($
                  {yearlyUbiInThousands}k per year)
                </p>
                <p>Flat Tax: {ubiStore.selectedYear.flattaxpercentage}%</p>
                <p>
                  Taxpayers per Quintile:{" "}
                  {ubiStore.selectedYear.taxpayersperquintile * 1000}
                </p>
              </div>

              {/* Income Range Component */}
              <div style="margin-top: 20px;">
                <h4>Income Range Component</h4>
                <IncomeRangeSimple
                  exemptionAmount={exemptionAmount.value}
                  taxRate={taxRate.value}
                  onExemptionChange$={handleExemptionChange}
                />
              </div>
            )}

            {ubiStore.taxEntries && ubiStore.taxEntries.length > 0 && (
              <div style="margin-top: 20px;">
                <h4>Tax Entries</h4>
                <table style="width: 100%; border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #e0e0e0;">
                      <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">
                        Quintile
                      </th>
                      <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">
                        Income
                      </th>
                      <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">
                        Tax
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ubiStore.taxEntries.map((entry) => (
                      <tr key={entry.entryid}>
                        <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">
                          Q{entry.quintile}
                        </td>
                        <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">
                          ${entry.averagetaxableincome}k
                        </td>
                        <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">
                          ${entry.mediantax}k
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style="margin-top: 20px;">
              <button
                onClick$={() => {
                  ubiStore.refreshTrigger = Date.now();
                }}
                style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </CspCardComponent>
      </div>
    );
  } catch (error) {
    console.error("Error in UbiCalculationSimple:", error);

    return (
      <div style="border: 5px solid red; margin: 10px; padding: 5px;">
        <h2 style="color: red; text-align: center;">UBI CALCULATION ERROR</h2>
        <CspCardComponent
          title="UBI Calculation Error"
          backgroundColor="rgb(255, 200, 200)"
        >
          <div style="padding: 10px;">
            <h3>An error occurred</h3>
            <p>
              Error details:{" "}
              {error instanceof Error ? error.message : String(error)}
            </p>
            <p>Please check the console for more information.</p>
          </div>
        </CspCardComponent>
      </div>
    );
  }
});
