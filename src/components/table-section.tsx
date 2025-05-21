import { component$, PropFunction, $, useSignal } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";
import { QuintileDataTable } from "./quintile-data-table";
import { IframeChart } from "./iframe-chart";
import { DecileTable } from "./decile-table";
import type { TaxEntry } from "../models/income-data";

/**
 * Component for displaying the table section with a rounded box
 */
export const TableSection = component$(
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
    showChart = true, // Default to chart view
    onToggleView$ = $(() => {}), // Default no-op function
  }: {
    taxEntries: TaxEntry[];
    calculateTaxRevenue: PropFunction<(entry: TaxEntry) => number>;
    calculateTaxRevenueWithUBI: PropFunction<(entry: TaxEntry) => number>;
    calculateMedianTaxWithUBI: PropFunction<(entry: TaxEntry) => number>;
    calculateUBICost: PropFunction<(entry: TaxEntry) => number>;
    calculateIncomeWithUBI: PropFunction<(entry: TaxEntry) => number>;
    flatTaxPercentage?: number;
    ubiAmount?: number;
    exemptionAmount?: number;
    showChart?: boolean;
    onToggleView$?: PropFunction<() => void>;
  }) => {
    console.log("TableSection rendering with showChart:", showChart);

    return (
      <div
        style={{
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid #d0d6f7",
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginTop: "40px",
          marginBottom: "40px",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#673ab7", // Changed to purple
            padding: "10px 15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
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
            <TranslatableText text="UBI Impact by Income Decile" />
          </h4>

          {/* View toggle button */}
          <button
            onClick$={onToggleView$}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "4px",
              borderRadius: "4px",
              transition: "background-color 0.2s",
            }}
            onMouseOver$={(_, el) =>
              (el.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
            }
            onMouseOut$={(_, el) => (el.style.backgroundColor = "transparent")}
          >
            {showChart ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="white"
                >
                  <path d="M5 4a1 1 0 011-1h8a1 1 0 011 1v1H5V4zm4 8a1 1 0 100-2 1 1 0 000 2zm-2 2a1 1 0 100-2 1 1 0 000 2zm8-2a1 1 0 10-2 0 1 1 0 002 0zm-4 2a1 1 0 100-2 1 1 0 000 2zm-6-6h12V6H5v2z" />
                  <path
                    fillRule="evenodd"
                    d="M2 3a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm1 0v14h14V3H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span style={{ marginLeft: "4px" }}>
                  <TranslatableText text="Show Table" />
                </span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="white"
                >
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <span style={{ marginLeft: "4px" }}>
                  <TranslatableText text="Show Chart" />
                </span>
              </>
            )}
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px", width: "100%" }}>
          {showChart ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                maxWidth: "none",
              }}
            >
              <IframeChart
                taxEntries={taxEntries}
                calculateIncomeWithUBI={calculateIncomeWithUBI}
              />
            </div>
          ) : (
            <DecileTable
              taxEntries={taxEntries}
              calculateIncomeWithUBI={calculateIncomeWithUBI}
            />
          )}
        </div>
      </div>
    );
  }
);
