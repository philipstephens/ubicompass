import {
  component$,
  useContext,
  useSignal,
  useTask$,
  noSerialize,
  $,
} from "@builder.io/qwik";
import { UbiDataContext } from "../stores/ubi-data-store";
import { TranslationContext } from "../stores/translation-store";
import { CspCardComponent } from "./csp-card-component";
import { TranslatableText } from "./translatable-text";
import { TaxModelFactory } from "../models/tax-model-factory";
import { TaxModel } from "../models/tax-model.interface";
import { TaxBracketsDisplay } from "./tax-brackets-display";
import { TableSection } from "./table-section";
import { ExplanationSection } from "./explanation-section";
import { ModelComparisonBox } from "./model-comparison-box";
import { ActionsBox } from "./actions-box";
import { getTranslatedText } from "../services/translation-service";
import "./chart-icon.css";

export const UbiCalculationRefactored = component$(() => {
  console.log("UbiCalculationRefactored component rendering");
  console.log("UbiCalculationRefactored: Starting render");

  // Get the UBI data store
  const ubiStore = useContext(UbiDataContext);

  // Get the translation store
  const translationStore = useContext(TranslationContext);

  // Local state for component
  const hasData = useSignal(false);
  const showTaxBrackets = useSignal(true); // Start expanded by default
  const showChart = useSignal(true); // Start with chart view by default
  const currentTaxModel = useSignal<any>(null); // Using any type with noSerialize

  // Initialize the selectedExemptionAmount if it doesn't exist
  useTask$(({ track }) => {
    // Track the refresh trigger to ensure this runs when needed
    track(() => ubiStore.refreshTrigger);

    // Initialize selectedExemptionAmount if it doesn't exist
    if (ubiStore.selectedExemptionAmount === undefined) {
      ubiStore.selectedExemptionAmount = 24; // Default to 24k
    }
  });

  // We're now defaulting to table view instead of chart view

  // Check if data is available
  useTask$(({ track }) => {
    // Track relevant store properties
    track(() => ubiStore.yearData);
    track(() => ubiStore.taxEntries);
    track(() => ubiStore.selectedYear);

    // Update local state
    hasData.value =
      ubiStore.yearData.length > 0 &&
      ubiStore.taxEntries.length > 0 &&
      ubiStore.selectedYear !== null;

    console.log("UbiCalculationRefactored data check:", {
      hasData: hasData.value,
      yearDataLength: ubiStore.yearData.length,
      taxEntriesLength: ubiStore.taxEntries.length,
      hasSelectedYear: ubiStore.selectedYear !== null,
    });
  });

  // Update tax model when selected model ID or flat tax percentage changes
  useTask$(({ track }) => {
    // Track the selected model ID
    const modelId = track(() => ubiStore.selectedModelId);

    // Track the flat tax percentage
    const flatTaxPercentage = track(
      () => ubiStore.selectedYear?.flattaxpercentage || 30
    );

    // Track the refresh trigger
    track(() => ubiStore.refreshTrigger);

    // Create the appropriate tax model based on the selected model ID and flat tax percentage
    // Use noSerialize to prevent serialization issues with class instances
    currentTaxModel.value = noSerialize(
      TaxModelFactory.createModelById(modelId, flatTaxPercentage)
    );

    console.log(
      "Tax model updated:",
      currentTaxModel.value.name,
      "with tax rate:",
      flatTaxPercentage + "%"
    );
  });

  // Calculate UBI income for each quintile
  const getYearlyUbiInThousands = $(() => {
    if (!ubiStore.selectedYear) return 24; // Default
    return (ubiStore.selectedYear.ubiamount * 12) / 1000;
  });

  // Calculate tax revenue for a quintile or decile using the current tax model
  const calculateTaxRevenue = $((entry: any) => {
    if (!currentTaxModel.value) return 0;

    // Check if we're using quintile or decile data
    const taxpayers =
      "decile" in entry
        ? ubiStore.selectedYear?.taxpayersperdecile || 0
        : ubiStore.selectedYear?.taxpayersperquintile || 0;
    const income = entry.averagetaxableincome;

    // Get the current flat tax percentage
    const flatTaxPercentage = ubiStore.selectedYear?.flattaxpercentage || 30;

    // For flat tax model, we can calculate this directly to ensure it's using the current tax rate
    if (ubiStore.selectedModelId === 1) {
      const taxRate = flatTaxPercentage / 100;
      const revenue = income * taxRate * taxpayers;
      return Math.round(revenue * 10) / 10;
    } else {
      // For other tax models, use the model's calculation
      const revenue = currentTaxModel.value.calculateQuintileRevenue(
        income,
        taxpayers
      );

      // Return the result rounded to one decimal place
      return Math.round(revenue * 10) / 10;
    }
  });

  // Calculate tax revenue with UBI for a quintile or decile using the current tax model
  const calculateTaxRevenueWithUBI = $((entry: any) => {
    if (!currentTaxModel.value) return 0;

    // Check if we're using quintile or decile data
    const taxpayers =
      "decile" in entry
        ? ubiStore.selectedYear?.taxpayersperdecile || 0
        : ubiStore.selectedYear?.taxpayersperquintile || 0;
    const income = entry.averagetaxableincome;
    const ubiAmount = ((ubiStore.selectedYear?.ubiamount || 2000) * 12) / 1000;
    const exemptionAmount = ubiStore.selectedExemptionAmount || 24;

    // Get the current flat tax percentage
    const flatTaxPercentage = ubiStore.selectedYear?.flattaxpercentage || 30;

    // For flat tax model, we can calculate this directly to ensure it's using the current tax rate
    if (ubiStore.selectedModelId === 1) {
      const taxRate = flatTaxPercentage / 100;
      const taxableIncomeWithUBI = Math.max(
        0,
        income + ubiAmount - exemptionAmount
      );
      const revenue = taxableIncomeWithUBI * taxRate * taxpayers;
      return Math.round(revenue * 10) / 10;
    } else {
      // For other tax models, use the model's calculation
      const revenue = currentTaxModel.value.calculateQuintileRevenueWithUBI(
        income,
        taxpayers,
        ubiAmount,
        exemptionAmount
      );

      // Return the result rounded to one decimal place
      return Math.round(revenue * 10) / 10;
    }
  });

  // Calculate median tax with UBI for a quintile using the current tax model
  const calculateMedianTaxWithUBI = $((entry: any) => {
    if (!currentTaxModel.value) return 0;

    const income = entry.averagetaxableincome;
    const ubiAmount = ((ubiStore.selectedYear?.ubiamount || 2000) * 12) / 1000;
    const exemptionAmount = ubiStore.selectedExemptionAmount || 24;

    // Get the current flat tax percentage
    const flatTaxPercentage = ubiStore.selectedYear?.flattaxpercentage || 30;

    // For flat tax model, we can calculate this directly to ensure it's using the current tax rate
    if (ubiStore.selectedModelId === 1) {
      const taxRate = flatTaxPercentage / 100;
      const taxableIncomeWithUBI = Math.max(
        0,
        income + ubiAmount - exemptionAmount
      );
      const tax = taxableIncomeWithUBI * taxRate;
      return Math.round(tax * 10) / 10;
    } else {
      // For other tax models, use the model's calculation
      const tax = currentTaxModel.value.calculateTaxWithUBI(
        income,
        ubiAmount,
        exemptionAmount
      );

      // Return the result rounded to one decimal place
      return Math.round(tax * 10) / 10;
    }
  });

  // Calculate the net cost of UBI for a quintile or decile using the current tax model
  const calculateUBICost = $((entry: any) => {
    if (!currentTaxModel.value) return 0;

    // Get the current values from the store
    // Check if we're using quintile or decile data
    const taxpayers =
      "decile" in entry
        ? ubiStore.selectedYear?.taxpayersperdecile || 0
        : ubiStore.selectedYear?.taxpayersperquintile || 0;
    const income = entry.averagetaxableincome;
    const ubiAmount = ((ubiStore.selectedYear?.ubiamount || 2000) * 12) / 1000;
    const exemptionAmount = ubiStore.selectedExemptionAmount || 24;

    // Get the current flat tax percentage
    const flatTaxPercentage = ubiStore.selectedYear?.flattaxpercentage || 30;

    // For flat tax model, we can calculate this directly to ensure it's using the current tax rate
    if (ubiStore.selectedModelId === 1) {
      // Calculate UBI payments to this quintile
      const ubiPayments = taxpayers * ubiAmount;

      // Calculate tax revenue without UBI
      const taxRate = flatTaxPercentage / 100;
      const revenueWithoutUBI = income * taxRate * taxpayers;

      // Calculate tax revenue with UBI
      const taxableIncomeWithUBI = Math.max(
        0,
        income + ubiAmount - exemptionAmount
      );
      const revenueWithUBI = taxableIncomeWithUBI * taxRate * taxpayers;

      // Additional tax revenue due to UBI
      const additionalRevenue = revenueWithUBI - revenueWithoutUBI;

      // Net cost = UBI payments - additional tax revenue
      const cost = ubiPayments - additionalRevenue;

      // Return the result rounded to one decimal place
      return Math.round(cost * 10) / 10;
    } else {
      // For other tax models, use the model's calculation
      const cost = currentTaxModel.value.calculateUBICost(
        income,
        taxpayers,
        ubiAmount,
        exemptionAmount
      );

      // Return the result rounded to one decimal place
      return Math.round(cost * 10) / 10;
    }
  });

  // Get the exemption amount in thousands
  const getExemptionAmount = $(() => {
    // Return the current exemption amount from the store
    return ubiStore.selectedExemptionAmount || 24;
  });

  // Calculate income with UBI for a quintile
  const calculateIncomeWithUBI = $((entry: any) => {
    const income = entry.averagetaxableincome;
    const ubiAmount = ((ubiStore.selectedYear?.ubiamount || 2000) * 12) / 1000;
    return income + ubiAmount;
  });

  // Get tax brackets for the current model
  const getTaxBrackets = $(() => {
    if (!currentTaxModel.value) return [];
    return currentTaxModel.value.getTaxBrackets();
  });

  // Toggle between chart and table view
  const toggleChartView = $(() => {
    showChart.value = !showChart.value;
    console.log("Chart view toggled:", showChart.value);
  });

  // Create an icon element for the card with explicit size and position
  const chartIcon = (
    <span class="chart-icon-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="white"
        class="chart-icon"
      >
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    </span>
  );

  return (
    <CspCardComponent
      title={
        <TranslatableText text="Canadian Universal Basic Income Calculator" />
      }
      backgroundColor="#ffffff"
      headerBackgroundColor="#4a86e8"
      borderColor="#d0e0fc"
      icon={chartIcon}
      onIconClick$={toggleChartView}
    >
      <div class="p-4">
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <h3 class="text-blue-800 font-medium text-lg mb-2">
            <TranslatableText text="Explore the impact of Universal Basic Income on different income quintiles" />
          </h3>
          <p class="text-blue-600 text-sm">
            <TranslatableText text="Adjust the parameters below to see how different UBI configurations affect income distribution across Canada." />
          </p>
        </div>

        {ubiStore.isLoading ? (
          <div class="bg-blue-100 p-6 rounded-lg shadow-inner flex items-center justify-center">
            <div class="flex flex-col items-center">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
              <p class="text-blue-800 font-medium">
                <TranslatableText text="Loading UBI data..." />
              </p>
            </div>
          </div>
        ) : ubiStore.error ? (
          <div class="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200">
            <div class="flex items-center">
              <div class="bg-red-100 p-2 rounded-full mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p class="font-bold text-red-700">Error: {ubiStore.error}</p>
            </div>
          </div>
        ) : !hasData.value ? (
          <div class="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200">
            <div class="flex flex-col items-center text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8 text-yellow-500 mb-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <p class="text-yellow-800 mb-4">
                No data available. Please select a year or refresh the data.
              </p>
              <button
                onClick$={() => {
                  ubiStore.refreshTrigger = Date.now();
                }}
                class="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md shadow-sm transition duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clip-rule="evenodd"
                  />
                </svg>
                <TranslatableText text="Refresh Data" />
              </button>
            </div>
          </div>
        ) : (
          <div class="space-y-8">
            {/* Main Parameters Layout - Using inline styles for critical elements */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "24px",
                marginTop: "40px",
                marginBottom: "40px",
                flexWrap: "wrap",
              }}
            >
              {/* Parameters Section */}
              <div style={{ width: "25%", minWidth: "300px" }}>
                {/* UBI Parameters Component */}
                <div
                  style={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    border: "1px solid #ccc",
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Purple header */}
                  <div
                    style={{
                      backgroundColor: "purple",
                      padding: "10px 15px",
                      textAlign: "center",
                    }}
                  >
                    <h4
                      style={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        margin: 0,
                        color: "white",
                      }}
                    >
                      <TranslatableText text="UBI Calculator Parameters" />
                    </h4>
                  </div>

                  {/* Simple content */}
                  <div style={{ padding: "20px" }}>
                    <div
                      style={{
                        marginBottom: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <strong>
                        {getTranslatedText(
                          "Year:",
                          translationStore.currentLanguage
                        )}
                      </strong>
                      <div style={{ position: "relative", width: "75px" }}>
                        <select
                          style={{
                            width: "100%",
                            padding: "4px 24px 4px 8px",
                            appearance: "none",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: "white",
                          }}
                          value={ubiStore.selectedYear?.taxyear || 2023}
                          onChange$={(event) => {
                            const year = parseInt(event.target.value, 10);
                            const selectedYear = ubiStore.yearData.find(
                              (y) => y.taxyear === year
                            );
                            if (selectedYear) {
                              ubiStore.selectedYear = selectedYear;
                            }
                          }}
                        >
                          {Array.from({ length: 24 }, (_, i) => 2000 + i).map(
                            (year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            )
                          )}
                        </select>
                        <div
                          style={{
                            position: "absolute",
                            right: "8px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            style={{
                              width: "16px",
                              height: "16px",
                            }}
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        marginBottom: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <strong>
                        {getTranslatedText(
                          "Tax Model:",
                          translationStore.currentLanguage
                        )}
                      </strong>
                      <div style={{ position: "relative", width: "150px" }}>
                        <select
                          style={{
                            width: "100%",
                            padding: "4px 24px 4px 8px",
                            appearance: "none",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: "white",
                          }}
                          value={ubiStore.selectedModelId || 1}
                          onChange$={(event) => {
                            const modelId = parseInt(event.target.value, 10);
                            ubiStore.selectedModelId = modelId;
                          }}
                        >
                          <option value={1}>
                            {getTranslatedText(
                              "Flat Tax",
                              translationStore.currentLanguage
                            )}
                          </option>
                          <option value={2}>
                            {getTranslatedText(
                              "Progressive Tax",
                              translationStore.currentLanguage
                            )}
                          </option>
                          <option value={3}>
                            {getTranslatedText(
                              "Bell Curve",
                              translationStore.currentLanguage
                            )}
                          </option>
                          <option value={4}>
                            {getTranslatedText(
                              "Percentile-Matched",
                              translationStore.currentLanguage
                            )}
                          </option>
                        </select>
                        <div
                          style={{
                            position: "absolute",
                            right: "8px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            style={{
                              width: "16px",
                              height: "16px",
                            }}
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        marginBottom: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <strong>
                        {getTranslatedText(
                          "UBI Amount:",
                          translationStore.currentLanguage
                        )}
                      </strong>
                      <div style={{ position: "relative", width: "240px" }}>
                        <select
                          style={{
                            width: "100%",
                            padding: "4px 24px 4px 8px",
                            appearance: "none",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: "white",
                          }}
                          value={ubiStore.selectedUbiAmount || 24}
                          onChange$={(event) => {
                            const amount = parseInt(event.target.value, 10);
                            ubiStore.selectedUbiAmount = amount;

                            // Update the UBI amount in the selected year
                            if (ubiStore.selectedYear) {
                              ubiStore.selectedYear.ubiamount = amount;
                              // Trigger a refresh to update calculations
                              ubiStore.refreshTrigger = Date.now();
                            }
                          }}
                        >
                          {[12, 18, 24, 30, 36].map((amount) => (
                            <option key={amount} value={amount}>
                              {getTranslatedText(
                                `$${amount}k / Year ($${(amount / 12).toFixed(1)}k / month)`,
                                translationStore.currentLanguage
                              )}
                            </option>
                          ))}
                        </select>
                        <div
                          style={{
                            position: "absolute",
                            right: "8px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            style={{
                              width: "16px",
                              height: "16px",
                            }}
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginBottom: "12px" }}>
                      <p style={{ marginBottom: "4px" }}>
                        <strong>
                          {getTranslatedText(
                            "Flat Tax Percentage:",
                            translationStore.currentLanguage
                          )}
                        </strong>
                      </p>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="range"
                          min="1"
                          max="99"
                          value={ubiStore.selectedYear?.flattaxpercentage || 30}
                          style={{
                            width: "100%",
                            accentColor: "purple",
                          }}
                          onChange$={(event) => {
                            const percentage = parseInt(event.target.value, 10);
                            if (ubiStore.selectedYear) {
                              ubiStore.selectedYear.flattaxpercentage =
                                percentage;
                              // Trigger a refresh
                              ubiStore.refreshTrigger = Date.now();
                            }
                          }}
                        />
                        <span
                          style={{
                            marginLeft: "12px",
                            color: "purple",
                            fontWeight: "bold",
                            width: "48px",
                            textAlign: "right",
                          }}
                        >
                          {ubiStore.selectedYear?.flattaxpercentage || 30}%
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        marginBottom: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <strong>
                        {getTranslatedText(
                          "Exemption Amount:",
                          translationStore.currentLanguage
                        )}
                      </strong>
                      <div style={{ position: "relative", width: "240px" }}>
                        <select
                          style={{
                            width: "100%",
                            padding: "4px 24px 4px 8px",
                            appearance: "none",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            backgroundColor: "white",
                          }}
                          value={ubiStore.selectedExemptionAmount || 24}
                          onChange$={(event) => {
                            const amount = parseInt(event.target.value, 10);
                            ubiStore.selectedExemptionAmount = amount;

                            // Update the exemption amount in the selected year
                            if (ubiStore.selectedYear) {
                              ubiStore.selectedYear.exemptionamount = amount;
                              // Trigger a refresh to update calculations
                              ubiStore.refreshTrigger = Date.now();
                            }
                          }}
                        >
                          {[0, 12, 18, 24, 30, 36].map((amount) => (
                            <option key={amount} value={amount}>
                              ${amount}k{" "}
                              {amount > 0
                                ? getTranslatedText(
                                    `(No tax on first $${amount}k)`,
                                    translationStore.currentLanguage
                                  )
                                : getTranslatedText(
                                    "(No exemption)",
                                    translationStore.currentLanguage
                                  )}
                            </option>
                          ))}
                        </select>
                        <div
                          style={{
                            position: "absolute",
                            right: "8px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            style={{
                              width: "16px",
                              height: "16px",
                            }}
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Brackets Section */}
              <div style={{ width: "25%", minWidth: "300px" }}>
                {/* Income Range Component */}
                <div
                  style={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    border: "1px solid #ccc",
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Blue header */}
                  <div
                    style={{
                      backgroundColor: "blue",
                      padding: "10px 15px",
                      textAlign: "center",
                    }}
                  >
                    <h4
                      style={{
                        fontWeight: "bold",
                        fontSize: "18px",
                        margin: 0,
                        color: "white",
                      }}
                    >
                      <TranslatableText text="Income Range" />
                    </h4>
                  </div>

                  {/* Simple content */}
                  <div style={{ padding: "20px" }}>
                    <p style={{ marginBottom: "16px" }}>
                      <strong>
                        <TranslatableText text="Current Tax Model:" />
                      </strong>{" "}
                      <TranslatableText text="Flat Tax" />
                    </p>
                    <p style={{ marginBottom: "8px" }}>
                      <strong>
                        <TranslatableText text="Tax Brackets:" />
                      </strong>
                    </p>
                    <div
                      style={{
                        backgroundColor: "#f0f8ff",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          <TranslatableText text="$0k - $24k" />
                        </span>
                        <span style={{ fontWeight: "bold" }}>
                          <TranslatableText text="0%" />
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#f0f8ff",
                        padding: "12px",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>
                          <TranslatableText text="$24k+" />
                        </span>
                        <span style={{ fontWeight: "bold" }}>
                          {ubiStore.selectedYear?.flattaxpercentage || 30}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quintile Data Table/Chart */}
            <TableSection
              taxEntries={ubiStore.taxEntries}
              calculateTaxRevenue={calculateTaxRevenue}
              calculateTaxRevenueWithUBI={calculateTaxRevenueWithUBI}
              calculateMedianTaxWithUBI={calculateMedianTaxWithUBI}
              calculateUBICost={calculateUBICost}
              calculateIncomeWithUBI={calculateIncomeWithUBI}
              flatTaxPercentage={ubiStore.selectedYear?.flattaxpercentage || 30}
              ubiAmount={ubiStore.selectedYear?.ubiamount || 24}
              exemptionAmount={ubiStore.selectedExemptionAmount || 24}
              showChart={showChart.value}
              onToggleView$={toggleChartView}
            />

            {/* Tax Calculation Explanation */}
            <ExplanationSection
              taxModel={currentTaxModel.value}
              modelId={ubiStore.selectedModelId}
              exampleTaxAmount={calculateMedianTaxWithUBI({
                averagetaxableincome: 50,
              })}
              ubiCost={(() => {
                // Get taxpayers per quintile
                const taxpayersPerQuintile =
                  ubiStore.selectedYear?.taxpayersperquintile || 6140; // In thousands

                // Calculate total UBI cost across all quintiles
                const totalCost = ubiStore.taxEntries.reduce((sum, entry) => {
                  const taxRate =
                    (ubiStore.selectedYear?.flattaxpercentage || 30) / 100;
                  const ubiAmount = ubiStore.selectedYear?.ubiamount || 24;
                  const exemptionAmount =
                    ubiStore.selectedExemptionAmount || 24;

                  // UBI payment to each person in this quintile
                  const ubiPayment = ubiAmount * taxpayersPerQuintile;

                  // Calculate tax revenue without UBI
                  const revenueWithoutUBI =
                    entry.averagetaxableincome * taxRate * taxpayersPerQuintile;

                  // Calculate tax revenue with UBI
                  const taxableIncomeWithUBI = Math.max(
                    0,
                    entry.averagetaxableincome + ubiAmount - exemptionAmount
                  );
                  const revenueWithUBI =
                    taxableIncomeWithUBI * taxRate * taxpayersPerQuintile;

                  // Additional tax revenue from this quintile due to UBI
                  const additionalTax = revenueWithUBI - revenueWithoutUBI;

                  // Net cost = UBI payments - additional tax revenue
                  return sum + (ubiPayment - additionalTax);
                }, 0);

                // Format as billions with one decimal place
                return Math.round(totalCost / 1000);
              })()}
              additionalRevenue={(() => {
                // Get taxpayers per quintile
                const taxpayersPerQuintile =
                  ubiStore.selectedYear?.taxpayersperquintile || 6140; // In thousands

                // Calculate additional tax revenue across all quintiles
                const additionalRevenue = ubiStore.taxEntries.reduce(
                  (sum, entry) => {
                    const taxRate =
                      (ubiStore.selectedYear?.flattaxpercentage || 30) / 100;
                    const ubiAmount = ubiStore.selectedYear?.ubiamount || 24;
                    const exemptionAmount =
                      ubiStore.selectedExemptionAmount || 24;

                    // Calculate tax revenue without UBI
                    const revenueWithoutUBI =
                      entry.averagetaxableincome *
                      taxRate *
                      taxpayersPerQuintile;

                    // Calculate tax revenue with UBI
                    const taxableIncomeWithUBI = Math.max(
                      0,
                      entry.averagetaxableincome + ubiAmount - exemptionAmount
                    );
                    const revenueWithUBI =
                      taxableIncomeWithUBI * taxRate * taxpayersPerQuintile;

                    // Additional tax revenue from this quintile due to UBI
                    return sum + (revenueWithUBI - revenueWithoutUBI);
                  },
                  0
                );

                // Format as billions with one decimal place
                return Math.round(additionalRevenue / 1000);
              })()}
              netCost={(() => {
                // Get taxpayers per quintile
                const taxpayersPerQuintile =
                  ubiStore.selectedYear?.taxpayersperquintile || 6140; // In thousands

                // Calculate total UBI cost across all quintiles
                const totalCost = ubiStore.taxEntries.reduce((sum, entry) => {
                  const taxRate =
                    (ubiStore.selectedYear?.flattaxpercentage || 30) / 100;
                  const ubiAmount = ubiStore.selectedYear?.ubiamount || 24;
                  const exemptionAmount =
                    ubiStore.selectedExemptionAmount || 24;

                  // UBI payment to each person in this quintile
                  const ubiPayment = ubiAmount * taxpayersPerQuintile;

                  // Calculate tax revenue without UBI
                  const revenueWithoutUBI =
                    entry.averagetaxableincome * taxRate * taxpayersPerQuintile;

                  // Calculate tax revenue with UBI
                  const taxableIncomeWithUBI = Math.max(
                    0,
                    entry.averagetaxableincome + ubiAmount - exemptionAmount
                  );
                  const revenueWithUBI =
                    taxableIncomeWithUBI * taxRate * taxpayersPerQuintile;

                  // Additional tax revenue from this quintile due to UBI
                  const additionalTax = revenueWithUBI - revenueWithoutUBI;

                  // Net cost = UBI payments - additional tax revenue
                  return sum + (ubiPayment - additionalTax);
                }, 0);

                // Format as billions with one decimal place
                return Math.round(totalCost / 1000);
              })()}
              taxpayersPerQuintile={
                ubiStore.selectedYear?.taxpayersperquintile || 6140
              }
              ubiAmount={ubiStore.selectedYear?.ubiamount || 24}
            />

            {/* Model Comparison and Actions Section - Side by Side */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "24px",
                flexWrap: "wrap",
              }}
            >
              {/* Model Comparison Section - Takes 2/3 of the space */}
              <div style={{ flex: "2", minWidth: "300px" }}>
                <ModelComparisonBox />
              </div>

              {/* Actions Section - Takes 1/3 of the space */}
              <div style={{ flex: "1", minWidth: "300px" }}>
                <ActionsBox
                  onRefresh$={() => {
                    ubiStore.refreshTrigger = Date.now();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </CspCardComponent>
  );
});
