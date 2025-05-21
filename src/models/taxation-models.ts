import { FLAT_TAX_MODEL, calculateFlatTax } from "./flat-tax-model";
import { PROGRESSIVE_TAX_MODEL, calculateProgressiveTax } from "./progressive-tax-model";
import { BELL_CURVE_TAX_MODEL, calculateBellCurveTax } from "./bell-curve-tax-model";
import type { TaxEntry, YearMetaData } from "../components/ubi-calculation-component";
import type { TaxationModelData } from "./taxation";

/**
 * Simple serializable taxation model interface
 */
export interface TaxationModel {
  id: number;
  name: string;
  description: string;
}

/**
 * All available taxation models
 */
export const TAXATION_MODELS: TaxationModel[] = [
  FLAT_TAX_MODEL,
  PROGRESSIVE_TAX_MODEL,
  BELL_CURVE_TAX_MODEL
];

/**
 * Get a taxation model by ID
 */
export function getTaxationModel(modelId: number): TaxationModel {
  return TAXATION_MODELS.find(model => model.id === modelId) || FLAT_TAX_MODEL;
}

/**
 * Calculate tax for a given income based on the model ID
 */
export function calculateTax(
  income: number,
  modelId: number,
  exemptionAmount: number,
  fallbackTaxRate: number
): number {
  switch (modelId) {
    case FLAT_TAX_MODEL.id:
      return calculateFlatTax(income, exemptionAmount, fallbackTaxRate);
    case PROGRESSIVE_TAX_MODEL.id:
      return calculateProgressiveTax(income, exemptionAmount);
    case BELL_CURVE_TAX_MODEL.id:
      return calculateBellCurveTax(income, exemptionAmount);
    default:
      return calculateFlatTax(income, exemptionAmount, fallbackTaxRate);
  }
}

/**
 * Calculate tax revenue for a given model
 */
export function calculateTaxRevenue(
  modelId: number,
  taxEntries: TaxEntry[],
  selectedYear: YearMetaData
): number {
  return taxEntries.reduce((sum, entry) => {
    const yearlyUbiInThousands = (selectedYear.ubiamount * 12) / 1000;
    const incomeWithUbi = entry.averagetaxableincome + yearlyUbiInThousands;
    const exemptionAmount = 24; // $24k in thousands
    
    const taxWithUbi = calculateTax(
      incomeWithUbi,
      modelId,
      exemptionAmount,
      selectedYear.flattaxpercentage
    );
    
    return sum + taxWithUbi * selectedYear.taxpayersperquintile;
  }, 0);
}

/**
 * Get model data for a taxation model
 */
export function getTaxationModelData(modelId: number, ubiId: number): TaxationModelData {
  const model = getTaxationModel(modelId);
  
  switch (modelId) {
    case FLAT_TAX_MODEL.id:
      return {
        model: {
          model_id: model.id,
          model_name: model.name,
          description: model.description
        },
        parameters: {
          exemption_amount: 24000,
          tax_rate: 30
        },
        brackets: [],
        percentiles: []
      };
    case PROGRESSIVE_TAX_MODEL.id:
      return {
        model: {
          model_id: model.id,
          model_name: model.name,
          description: model.description
        },
        parameters: {
          exemption_amount: 24000
        },
        brackets: [
          { bracket_id: 1, model_id: model.id, ubiid: ubiId, lower_bound: 0, upper_bound: 24000, tax_rate: 0 },
          { bracket_id: 2, model_id: model.id, ubiid: ubiId, lower_bound: 24000.01, upper_bound: 50000, tax_rate: 10 },
          { bracket_id: 3, model_id: model.id, ubiid: ubiId, lower_bound: 50000.01, upper_bound: 100000, tax_rate: 20 },
          { bracket_id: 4, model_id: model.id, ubiid: ubiId, lower_bound: 100000.01, upper_bound: 250000, tax_rate: 30 },
          { bracket_id: 5, model_id: model.id, ubiid: ubiId, lower_bound: 250000.01, upper_bound: 500000, tax_rate: 35 },
          { bracket_id: 6, model_id: model.id, ubiid: ubiId, lower_bound: 500000.01, upper_bound: null, tax_rate: 40 }
        ],
        percentiles: []
      };
    case BELL_CURVE_TAX_MODEL.id:
      return {
        model: {
          model_id: model.id,
          model_name: model.name,
          description: model.description
        },
        parameters: {
          exemption_amount: 24000,
          bell_curve_center: 90,
          bell_curve_width: 30,
          max_tax_rate: 40,
          max_tax_amount: 1000000
        },
        brackets: [],
        percentiles: [
          { percentile_id: 1, ubiid: ubiId, percentile: 10, lower_bound: 0, upper_bound: 15000, median_income: 10000 },
          { percentile_id: 2, ubiid: ubiId, percentile: 20, lower_bound: 15000.01, upper_bound: 30000, median_income: 25000 },
          { percentile_id: 3, ubiid: ubiId, percentile: 30, lower_bound: 30000.01, upper_bound: 45000, median_income: 38000 },
          { percentile_id: 4, ubiid: ubiId, percentile: 40, lower_bound: 45000.01, upper_bound: 60000, median_income: 52000 },
          { percentile_id: 5, ubiid: ubiId, percentile: 50, lower_bound: 60000.01, upper_bound: 75000, median_income: 68000 },
          { percentile_id: 6, ubiid: ubiId, percentile: 60, lower_bound: 75000.01, upper_bound: 90000, median_income: 82000 },
          { percentile_id: 7, ubiid: ubiId, percentile: 70, lower_bound: 90000.01, upper_bound: 120000, median_income: 105000 },
          { percentile_id: 8, ubiid: ubiId, percentile: 80, lower_bound: 120000.01, upper_bound: 150000, median_income: 135000 },
          { percentile_id: 9, ubiid: ubiId, percentile: 90, lower_bound: 150000.01, upper_bound: 300000, median_income: 200000 },
          { percentile_id: 10, ubiid: ubiId, percentile: 100, lower_bound: 300000.01, upper_bound: 1000000, median_income: 450000 }
        ]
      };
    default:
      return {
        model: {
          model_id: 1,
          model_name: "Flat Tax",
          description: "Simple flat tax rate applied to all income above exemption"
        },
        parameters: {
          exemption_amount: 24000,
          tax_rate: 30
        },
        brackets: [],
        percentiles: []
      };
  }
}
