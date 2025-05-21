// Taxation model interfaces

export interface TaxationModel {
  model_id: number;
  model_name: string;
  description: string;
}

export interface TaxModelParameter {
  parameter_id: number;
  model_id: number;
  ubiid: number;
  parameter_name: string;
  parameter_value: number;
}

export interface TaxBracket {
  bracket_id: number;
  model_id: number;
  ubiid: number;
  lower_bound: number;
  upper_bound: number | null;
  tax_rate: number;
}

export interface IncomePercentile {
  percentile_id: number;
  ubiid: number;
  percentile: number;
  lower_bound: number;
  upper_bound: number;
  median_income: number;
}

export interface TaxationModelData {
  model: TaxationModel;
  parameters: Record<string, number>;
  brackets: TaxBracket[];
  percentiles: IncomePercentile[];
}

// Utility functions for tax calculations

// Calculate tax using flat tax model
export function calculateFlatTax(income: number, parameters: Record<string, number>): number {
  const exemptionAmount = parameters.exemption_amount || 0;
  const taxRate = parameters.tax_rate / 100 || 0;
  
  // Apply exemption
  const taxableIncome = Math.max(0, income - exemptionAmount);
  
  // Calculate tax
  return taxableIncome * taxRate;
}

// Calculate tax using progressive tax model
export function calculateProgressiveTax(income: number, parameters: Record<string, number>, brackets: TaxBracket[]): number {
  const exemptionAmount = parameters.exemption_amount || 0;
  
  // Apply exemption
  const taxableIncome = Math.max(0, income - exemptionAmount);
  
  // If no taxable income, no tax
  if (taxableIncome <= 0) return 0;
  
  // Sort brackets by lower bound
  const sortedBrackets = [...brackets].sort((a, b) => a.lower_bound - b.lower_bound);
  
  let tax = 0;
  let remainingIncome = taxableIncome;
  
  // Calculate tax for each bracket
  for (const bracket of sortedBrackets) {
    // Skip if bracket is below exemption
    if (bracket.upper_bound !== null && bracket.upper_bound <= exemptionAmount) continue;
    
    // Adjust lower bound if it's below exemption
    const adjustedLowerBound = Math.max(bracket.lower_bound, exemptionAmount);
    
    // Calculate income in this bracket
    const upperLimit = bracket.upper_bound === null ? Infinity : bracket.upper_bound;
    const incomeInBracket = Math.min(remainingIncome, upperLimit - adjustedLowerBound);
    
    // If no income in this bracket, move to next
    if (incomeInBracket <= 0) continue;
    
    // Calculate tax for this bracket
    tax += incomeInBracket * (bracket.tax_rate / 100);
    
    // Reduce remaining income
    remainingIncome -= incomeInBracket;
    
    // If no more income to tax, break
    if (remainingIncome <= 0) break;
  }
  
  return tax;
}

// Calculate tax using bell curve model
export function calculateBellCurveTax(income: number, parameters: Record<string, number>, percentiles: IncomePercentile[]): number {
  const exemptionAmount = parameters.exemption_amount || 0;
  const bellCurveCenter = parameters.bell_curve_center || 90;
  const bellCurveWidth = parameters.bell_curve_width || 30;
  const maxTaxRate = parameters.max_tax_rate / 100 || 0.4;
  const maxTaxAmount = parameters.max_tax_amount || 1000000;
  
  // Apply exemption
  const taxableIncome = Math.max(0, income - exemptionAmount);
  
  // If no taxable income, no tax
  if (taxableIncome <= 0) return 0;
  
  // Find which percentile this income falls into
  let incomePercentile = 0;
  for (const percentile of percentiles) {
    if (income >= percentile.lower_bound && income <= percentile.upper_bound) {
      incomePercentile = percentile.percentile;
      break;
    }
  }
  
  // If income is above all percentiles, use the highest
  if (incomePercentile === 0 && percentiles.length > 0) {
    incomePercentile = Math.max(...percentiles.map(p => p.percentile));
  }
  
  // Calculate tax rate using bell curve formula
  const taxRate = maxTaxRate * Math.exp(-Math.pow(incomePercentile - bellCurveCenter, 2) / (2 * Math.pow(bellCurveWidth, 2)));
  
  // Calculate tax
  const calculatedTax = taxableIncome * taxRate;
  
  // Apply maximum tax cap
  return Math.min(calculatedTax, maxTaxAmount);
}
