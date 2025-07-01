// @ts-nocheck
// Utility functions for tax calculations
import type { TaxationModelData } from "../models/taxation";

/**
 * Calculate tax for a given income based on the selected taxation model
 */
export function calculateTax(
  income: number,
  modelData: TaxationModelData | null,
  fallbackTaxRate: number
): number {
  if (!modelData) {
    // Fallback to flat tax if no model data
    const exemptionAmount = 24; // $24k in thousands
    return calculateTaxByModel(income, 1, exemptionAmount, fallbackTaxRate);
  }

  // Get the model ID
  const modelId = modelData.model.model_id;

  // Get the exemption amount in thousands
  const exemptionAmount = modelData.parameters.exemption_amount / 1000;

  // Use our new calculateTax function
  return calculateTaxByModel(income, modelId, exemptionAmount, fallbackTaxRate);
}

/**
 * Calculate total tax revenue with UBI for all quintiles
 */
export function calculateTotalTaxRevenueWithUBI(
  taxEntries: TaxEntry[],
  selectedYear: YearMetaData,
  modelData: TaxationModelData | null
): number {
  return taxEntries.reduce((sum, entry) => {
    // Calculate yearly UBI in thousands
    const yearlyUbiInThousands = (selectedYear.ubiamount * 12) / 1000;
    const incomeWithUbi = entry.averagetaxableincome + yearlyUbiInThousands;

    // Calculate tax using the selected model
    const taxWithUbi = calculateTax(
      incomeWithUbi,
      modelData,
      selectedYear.flattaxpercentage
    );

    return sum + taxWithUbi * selectedYear.taxpayersperquintile;
  }, 0);
}

/**
 * Calculate total tax revenue without UBI for all quintiles
 */
export function calculateTotalTaxRevenueWithoutUBI(
  taxEntries: TaxEntry[],
  selectedYear: YearMetaData
): number {
  return taxEntries.reduce(
    (sum, entry) => sum + entry.mediantax * selectedYear.taxpayersperquintile,
    0
  );
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return "$" + Math.round(amount).toLocaleString();
}

/**
 * Calculate Line 0: Total cost of UBI
 */
export function calculateLine0(selectedYear: YearMetaData): number {
  return selectedYear.ubiamount * 12 * selectedYear.taxpayersperquintile * 5 * 1000;
}

/**
 * Calculate Line 1: Additional tax revenue from UBI
 */
export function calculateLine1(
  taxEntries: TaxEntry[],
  selectedYear: YearMetaData,
  modelData: TaxationModelData | null
): number {
  const totalTaxRevenueWithUbi = calculateTotalTaxRevenueWithUBI(
    taxEntries,
    selectedYear,
    modelData
  );

  const totalTaxRevenueWithoutUbi = calculateTotalTaxRevenueWithoutUBI(
    taxEntries,
    selectedYear
  );

  // Convert from thousands to actual dollars
  return (totalTaxRevenueWithUbi - totalTaxRevenueWithoutUbi) * 1000;
}

/**
 * Calculate Line 2: Maximum cost of UBI
 */
export function calculateLine2(
  taxEntries: TaxEntry[],
  selectedYear: YearMetaData,
  modelData: TaxationModelData | null
): number {
  const line0 = calculateLine0(selectedYear);
  const line1 = calculateLine1(taxEntries, selectedYear, modelData);
  return line0 - line1;
}
