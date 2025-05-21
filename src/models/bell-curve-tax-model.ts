import { TaxModel } from './tax-model.interface';

/**
 * Bell curve tax model constants
 */
export const BELL_CURVE_TAX_MODEL = {
  id: 3,
  name: "Bell Curve",
  description: "Tax rate based on income percentile, following a bell curve distribution"
};

/**
 * Bell curve parameters
 */
export const BELL_CURVE_PARAMS = {
  bellCurveCenter: 90,
  bellCurveWidth: 30,
  maxTaxRate: 40,
  maxTaxAmount: 1000
};

/**
 * Percentile data interface
 */
export interface PercentileData {
  percentile: number;
  lowerBound: number;
  upperBound: number;
  medianIncome: number;
}

/**
 * Income percentile data (in thousands of dollars)
 */
export const INCOME_PERCENTILES: PercentileData[] = [
  { percentile: 10, lowerBound: 0, upperBound: 15, medianIncome: 10 },
  { percentile: 20, lowerBound: 15, upperBound: 30, medianIncome: 25 },
  { percentile: 30, lowerBound: 30, upperBound: 45, medianIncome: 38 },
  { percentile: 40, lowerBound: 45, upperBound: 60, medianIncome: 52 },
  { percentile: 50, lowerBound: 60, upperBound: 75, medianIncome: 68 },
  { percentile: 60, lowerBound: 75, upperBound: 90, medianIncome: 82 },
  { percentile: 70, lowerBound: 90, upperBound: 120, medianIncome: 105 },
  { percentile: 80, lowerBound: 120, upperBound: 150, medianIncome: 135 },
  { percentile: 90, lowerBound: 150, upperBound: 300, medianIncome: 200 },
  { percentile: 100, lowerBound: 300, upperBound: 1000, medianIncome: 450 }
];

/**
 * Estimate income percentile based on income amount
 */
export function estimatePercentile(income: number): number {
  // Find which percentile this income falls into
  for (const percentile of INCOME_PERCENTILES) {
    if (income >= percentile.lowerBound && income <= percentile.upperBound) {
      return percentile.percentile;
    }
  }

  // If income is above the highest percentile, return 100
  if (income > INCOME_PERCENTILES[INCOME_PERCENTILES.length - 1].upperBound) {
    return 100;
  }

  // Default to lowest percentile
  return 10;
}

/**
 * Legacy function to calculate bell curve tax
 */
export function calculateBellCurveTax(income: number, exemptionAmount: number): number {
  const taxableIncome = Math.max(0, income - exemptionAmount);

  // If no taxable income, no tax
  if (taxableIncome <= 0) return 0;

  // Estimate income percentile
  const incomePercentile = estimatePercentile(income);

  // Calculate tax rate using bell curve formula
  const taxRate = (BELL_CURVE_PARAMS.maxTaxRate / 100) * Math.exp(
    -Math.pow(incomePercentile - BELL_CURVE_PARAMS.bellCurveCenter, 2) /
    (2 * Math.pow(BELL_CURVE_PARAMS.bellCurveWidth, 2))
  );

  // Calculate tax
  const calculatedTax = taxableIncome * taxRate;

  // Apply maximum tax cap
  return Math.min(calculatedTax, BELL_CURVE_PARAMS.maxTaxAmount);
}

/**
 * Implementation of a Bell Curve tax model
 * Tax rate increases based on position in income distribution
 */
export class BellCurveTaxModel implements TaxModel {
  readonly name = 'Bell Curve';

  /**
   * Create a new Bell Curve tax model
   * @param bellCurveCenter Center of the bell curve (percentile with highest tax rate)
   * @param bellCurveWidth Width of the bell curve (standard deviation)
   * @param maxTaxRate Maximum tax rate as a percentage
   * @param maxTaxAmount Maximum tax amount in thousands
   */
  constructor(
    private bellCurveCenter: number = BELL_CURVE_PARAMS.bellCurveCenter,
    private bellCurveWidth: number = BELL_CURVE_PARAMS.bellCurveWidth,
    private maxTaxRate: number = BELL_CURVE_PARAMS.maxTaxRate,
    private maxTaxAmount: number = BELL_CURVE_PARAMS.maxTaxAmount
  ) {}

  /**
   * Get the current bell curve parameters
   */
  getParameters(): {
    bellCurveCenter: number;
    bellCurveWidth: number;
    maxTaxRate: number;
    maxTaxAmount: number;
  } {
    return {
      bellCurveCenter: this.bellCurveCenter,
      bellCurveWidth: this.bellCurveWidth,
      maxTaxRate: this.maxTaxRate,
      maxTaxAmount: this.maxTaxAmount
    };
  }

  /**
   * Set new bell curve parameters
   */
  setParameters(params: {
    bellCurveCenter?: number;
    bellCurveWidth?: number;
    maxTaxRate?: number;
    maxTaxAmount?: number;
  }): void {
    if (params.bellCurveCenter !== undefined) this.bellCurveCenter = params.bellCurveCenter;
    if (params.bellCurveWidth !== undefined) this.bellCurveWidth = params.bellCurveWidth;
    if (params.maxTaxRate !== undefined) this.maxTaxRate = params.maxTaxRate;
    if (params.maxTaxAmount !== undefined) this.maxTaxAmount = params.maxTaxAmount;
  }

  /**
   * Calculate tax rate for a given income
   * @param income Income amount in thousands
   * @returns Tax rate as a percentage
   */
  private calculateTaxRate(income: number): number {
    // Estimate income percentile
    const incomePercentile = estimatePercentile(income);

    // Calculate tax rate using bell curve formula
    const taxRate = this.maxTaxRate * Math.exp(
      -Math.pow(incomePercentile - this.bellCurveCenter, 2) /
      (2 * Math.pow(this.bellCurveWidth, 2))
    );

    return taxRate;
  }

  /**
   * Calculate tax for a given income without UBI
   */
  calculateTax(income: number): number {
    // Calculate tax rate
    const taxRate = this.calculateTaxRate(income);

    // Calculate tax
    const calculatedTax = income * (taxRate / 100);

    // Apply maximum tax cap
    return Math.min(calculatedTax, this.maxTaxAmount);
  }

  /**
   * Calculate tax for a given income with UBI
   */
  calculateTaxWithUBI(income: number, ubiAmount: number, exemptionAmount: number): number {
    // Add UBI to income
    const totalIncome = income + ubiAmount;

    // Apply exemption
    const taxableIncome = Math.max(0, totalIncome - exemptionAmount);

    // If no taxable income, no tax
    if (taxableIncome <= 0) return 0;

    // Calculate tax rate based on total income (including UBI)
    const taxRate = this.calculateTaxRate(totalIncome);

    // Calculate tax
    const calculatedTax = taxableIncome * (taxRate / 100);

    // Apply maximum tax cap
    return Math.min(calculatedTax, this.maxTaxAmount);
  }

  /**
   * Calculate tax revenue for a quintile without UBI
   */
  calculateQuintileRevenue(averageIncome: number, taxpayerCount: number): number {
    const taxPerPerson = this.calculateTax(averageIncome);
    return taxPerPerson * taxpayerCount;
  }

  /**
   * Calculate tax revenue for a quintile with UBI
   */
  calculateQuintileRevenueWithUBI(
    averageIncome: number,
    taxpayerCount: number,
    ubiAmount: number,
    exemptionAmount: number
  ): number {
    const taxPerPerson = this.calculateTaxWithUBI(averageIncome, ubiAmount, exemptionAmount);
    return taxPerPerson * taxpayerCount;
  }

  /**
   * Calculate the net cost of UBI for a quintile
   */
  calculateUBICost(
    averageIncome: number,
    taxpayerCount: number,
    ubiAmount: number,
    exemptionAmount: number
  ): number {
    // Total UBI payments to this quintile
    const ubiPayments = taxpayerCount * ubiAmount;

    // Tax revenue without UBI
    const revenueWithoutUBI = this.calculateQuintileRevenue(averageIncome, taxpayerCount);

    // Tax revenue with UBI
    const revenueWithUBI = this.calculateQuintileRevenueWithUBI(
      averageIncome,
      taxpayerCount,
      ubiAmount,
      exemptionAmount
    );

    // Additional tax revenue due to UBI
    const additionalRevenue = revenueWithUBI - revenueWithoutUBI;

    // Net cost = UBI payments - additional tax revenue
    return ubiPayments - additionalRevenue;
  }

  /**
   * Get tax brackets for display
   * For bell curve, we show representative brackets at different income levels
   */
  getTaxBrackets(): Array<{
    rate: number;
    minIncome: number;
    maxIncome?: number;
    description: string;
  }> {
    // Use the percentile data to create representative brackets
    return INCOME_PERCENTILES.map(percentile => {
      const rate = this.calculateTaxRate(percentile.medianIncome);

      return {
        rate: Math.round(rate * 10) / 10, // Round to 1 decimal place
        minIncome: percentile.lowerBound,
        maxIncome: percentile.upperBound === 1000 ? undefined : percentile.upperBound,
        description: `${percentile.percentile}th percentile`
      };
    });
  }
}
