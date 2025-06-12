import { component$ } from "@builder.io/qwik";
import type { TaxEntry, YearMetaData } from "./ubi-calculation-component";
import type { TaxationModelData } from "../models/taxation";
import {
  calculateLine0,
  calculateLine1,
  calculateLine2,
  calculateTotalTaxRevenueWithUBI,
  calculateTotalTaxRevenueWithoutUBI,
  formatCurrency,
} from "../utils/tax-calculations";
import "./ubi-calculation-summary.css";

interface UbiCalculationSummaryProps {
  taxEntries: TaxEntry[];
  selectedYear: YearMetaData;
  taxationModelData: TaxationModelData | null;
}

export const UbiCalculationSummary = component$<UbiCalculationSummaryProps>(
  ({ taxEntries, selectedYear, taxationModelData }) => {
    // Calculate Line 0: Total cost of UBI
    const line0 = calculateLine0(selectedYear);

    // Calculate tax revenue with and without UBI
    const taxRevenueWithUBI =
      calculateTotalTaxRevenueWithUBI(
        taxEntries,
        selectedYear,
        taxationModelData
      ) * 1000; // Convert from thousands to actual dollars

    const taxRevenueWithoutUBI =
      calculateTotalTaxRevenueWithoutUBI(taxEntries, selectedYear) * 1000; // Convert from thousands to actual dollars

    // Calculate Line 1: Additional tax revenue from UBI
    const line1 = taxRevenueWithUBI - taxRevenueWithoutUBI;

    // Calculate Line 2: Maximum cost of UBI
    const line2 = line0 - line1;

    // Format total taxpayers
    const totalTaxpayers = (
      selectedYear.taxpayersperquintile *
      5 *
      1000
    ).toLocaleString();

    // Format yearly UBI amount
    const yearlyUbiAmount = (selectedYear.ubiamount * 12).toLocaleString();

    return (
      <div class="calculation-summary-container">
        <h3 class="summary-title">UBI Program Cost Analysis</h3>

        <div class="summary-section">
          <div class="summary-row">
            <div class="line-number">Line 0:</div>
            <div class="line-description">
              <div class="line-formula">
                <span class="formula-item">UBI Amount</span>
                <span class="formula-operator">×</span>
                <span class="formula-item">Total Taxpayers</span>
                <span class="formula-operator">=</span>
                <span class="formula-result">Gross UBI Cost</span>
              </div>
              <div class="line-calculation">
                <span class="calculation-item">${yearlyUbiAmount}/year</span>
                <span class="calculation-operator">×</span>
                <span class="calculation-item">{totalTaxpayers} taxpayers</span>
                <span class="calculation-operator">=</span>
                <span class="calculation-result">{formatCurrency(line0)}</span>
              </div>
            </div>
          </div>

          <div class="summary-row">
            <div class="line-number">Line 1:</div>
            <div class="line-description">
              <div class="line-formula">
                <span class="formula-item">Tax Revenue with UBI</span>
                <span class="formula-operator">−</span>
                <span class="formula-item">Tax Revenue without UBI</span>
                <span class="formula-operator">=</span>
                <span class="formula-result">Additional Tax Revenue</span>
              </div>
              <div class="line-calculation">
                <span class="calculation-item">
                  {formatCurrency(taxRevenueWithUBI)}
                </span>
                <span class="calculation-operator">−</span>
                <span class="calculation-item">
                  {formatCurrency(taxRevenueWithoutUBI)}
                </span>
                <span class="calculation-operator">=</span>
                <span class="calculation-result">{formatCurrency(line1)}</span>
              </div>
            </div>
          </div>

          <div class="summary-row">
            <div class="line-number">Line 2:</div>
            <div class="line-description">
              <div class="line-formula">
                <span class="formula-item">Gross UBI Cost</span>
                <span class="formula-operator">−</span>
                <span class="formula-item">Additional Tax Revenue</span>
                <span class="formula-operator">=</span>
                <span class="formula-result">Net UBI Cost</span>
              </div>
              <div class="line-calculation">
                <span class="calculation-item">{formatCurrency(line0)}</span>
                <span class="calculation-operator">−</span>
                <span class="calculation-item">{formatCurrency(line1)}</span>
                <span class="calculation-operator">=</span>
                <span class="calculation-result">{formatCurrency(line2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="summary-notes">
          <p>
            <strong>Note:</strong> This analysis shows how a UBI program of $
            {yearlyUbiAmount}/year for {totalTaxpayers} taxpayers would be
            partially offset by increased tax revenue using the{" "}
            {taxationModelData?.model.model_name || "Flat Tax"} model.
          </p>
          <p>
            <strong>Net Cost:</strong> {formatCurrency(line2)} (
            {Math.round((line2 / line0) * 100)}% of gross cost)
          </p>
        </div>
      </div>
    );
  }
);
