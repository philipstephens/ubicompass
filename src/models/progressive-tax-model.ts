import { TaxModel } from './tax-model.interface';

/**
 * Progressive tax model constants
 */
export const PROGRESSIVE_TAX_MODEL = {
  id: 2,
  name: "Progressive Tax",
  description: "Multiple tax brackets with increasing rates for higher incomes"
};

/**
 * Legacy tax bracket interface
 */
export interface TaxBracket {
  lowerBound: number;
  upperBound: number | null;
  rate: number;
}

/**
 * Progressive tax brackets (in thousands of dollars)
 */
export const PROGRESSIVE_TAX_BRACKETS: TaxBracket[] = [
  { lowerBound: 0, upperBound: 24, rate: 0 },
  { lowerBound: 24, upperBound: 50, rate: 10 },
  { lowerBound: 50, upperBound: 100, rate: 20 },
  { lowerBound: 100, upperBound: 250, rate: 30 },
  { lowerBound: 250, upperBound: 500, rate: 35 },
  { lowerBound: 500, upperBound: null, rate: 40 }
];

/**
 * Legacy function to calculate progressive tax
 */
export function calculateProgressiveTax(income: number, exemptionAmount: number): number {
  const taxableIncome = Math.max(0, income - exemptionAmount);

  let remainingIncome = taxableIncome;
  let tax = 0;

  // Calculate tax for each bracket
  for (const bracket of PROGRESSIVE_TAX_BRACKETS) {
    // Skip if bracket is below exemption or we've run out of income
    if ((bracket.upperBound !== null && bracket.upperBound <= exemptionAmount) || remainingIncome <= 0) {
      continue;
    }

    // Adjust lower bound if it's below exemption
    const adjustedLowerBound = Math.max(bracket.lowerBound, exemptionAmount);

    // Calculate income in this bracket
    const upperBound = bracket.upperBound !== null ? bracket.upperBound : Infinity;
    const incomeInBracket = Math.min(
      remainingIncome,
      upperBound - adjustedLowerBound
    );

    // If no income in this bracket, move to next
    if (incomeInBracket <= 0) continue;

    // Calculate tax for this bracket
    tax += incomeInBracket * (bracket.rate / 100);

    // Reduce remaining income
    remainingIncome -= incomeInBracket;

    // If no more income to tax, break
    if (remainingIncome <= 0) break;
  }

  return tax;
}

/**
 * New tax bracket interface for the TaxModel implementation
 */
export interface ProgressiveTaxBracket {
  rate: number;
  minIncome: number;
  maxIncome?: number;
  description: string;
}

/**
 * Implementation of a progressive tax model
 * Applies different tax rates to different income brackets
 */
export class ProgressiveTaxModel implements TaxModel {
  readonly name = 'Progressive Tax';

  /**
   * Create a new progressive tax model
   * @param brackets Array of tax brackets, sorted by minIncome
   */
  constructor(private brackets: ProgressiveTaxBracket[]) {
    // Ensure brackets are sorted by minIncome
    this.brackets.sort((a, b) => a.minIncome - b.minIncome);
  }

  /**
   * Get the current tax brackets
   * @returns Array of tax brackets
   */
  getBrackets(): ProgressiveTaxBracket[] {
    return [...this.brackets];
  }

  /**
   * Set new tax brackets
   * @param brackets Array of tax brackets
   */
  setBrackets(brackets: ProgressiveTaxBracket[]): void {
    this.brackets = [...brackets];
    // Ensure brackets are sorted by minIncome
    this.brackets.sort((a, b) => a.minIncome - b.minIncome);
  }

  /**
   * Calculate tax for a given income without UBI
   * Applies progressive tax brackets
   */
  calculateTax(income: number): number {
    let tax = 0;
    let remainingIncome = income;

    for (let i = 0; i < this.brackets.length; i++) {
      const bracket = this.brackets[i];
      const nextBracket = this.brackets[i + 1];

      // Determine the amount of income in this bracket
      let incomeInBracket = 0;

      if (nextBracket) {
        // If there's a next bracket, income in this bracket is capped
        incomeInBracket = Math.min(
          remainingIncome,
          nextBracket.minIncome - bracket.minIncome
        );
      } else {
        // If this is the highest bracket, all remaining income is taxed at this rate
        incomeInBracket = remainingIncome;
      }

      // Calculate tax for this bracket
      tax += incomeInBracket * (bracket.rate / 100);

      // Reduce remaining income
      remainingIncome -= incomeInBracket;

      // If no more income to tax, break
      if (remainingIncome <= 0) break;
    }

    return tax;
  }

  /**
   * Calculate tax for a given income with UBI
   * With UBI, we add UBI to income, then apply progressive tax brackets
   * with an exemption amount
   */
  calculateTaxWithUBI(income: number, ubiAmount: number, exemptionAmount: number): number {
    // Add UBI to income
    const totalIncome = income + ubiAmount;

    // Create a copy of brackets with exemption applied
    const bracketsWithExemption = this.getExemptionAdjustedBrackets(exemptionAmount);

    let tax = 0;
    let remainingIncome = totalIncome;

    for (let i = 0; i < bracketsWithExemption.length; i++) {
      const bracket = bracketsWithExemption[i];
      const nextBracket = bracketsWithExemption[i + 1];

      // Skip brackets below the remaining income
      if (bracket.minIncome >= remainingIncome) continue;

      // Determine the amount of income in this bracket
      let incomeInBracket = 0;

      if (nextBracket) {
        // If there's a next bracket, income in this bracket is capped
        incomeInBracket = Math.min(
          remainingIncome - bracket.minIncome,
          nextBracket.minIncome - bracket.minIncome
        );
      } else {
        // If this is the highest bracket, all remaining income is taxed at this rate
        incomeInBracket = remainingIncome - bracket.minIncome;
      }

      // Calculate tax for this bracket
      tax += incomeInBracket * (bracket.rate / 100);

      // If no more income to tax, break
      if (nextBracket && remainingIncome <= nextBracket.minIncome) break;
    }

    return tax;
  }

  /**
   * Get brackets adjusted for exemption amount
   * @param exemptionAmount Exemption amount in thousands
   * @returns Adjusted tax brackets
   */
  private getExemptionAdjustedBrackets(exemptionAmount: number): ProgressiveTaxBracket[] {
    // Create a new set of brackets with the exemption applied
    const adjustedBrackets: ProgressiveTaxBracket[] = [];

    // Add a 0% bracket for the exemption amount
    adjustedBrackets.push({
      rate: 0,
      minIncome: 0,
      maxIncome: exemptionAmount,
      description: 'Exemption amount (no tax)'
    });

    // Adjust all other brackets by the exemption amount
    for (const bracket of this.brackets) {
      if (bracket.minIncome <= exemptionAmount) {
        // Skip brackets that are fully within the exemption
        if (bracket.maxIncome && bracket.maxIncome <= exemptionAmount) continue;

        // Adjust brackets that start within the exemption
        adjustedBrackets.push({
          ...bracket,
          minIncome: exemptionAmount,
        });
      } else {
        // Brackets above the exemption are unchanged
        adjustedBrackets.push(bracket);
      }
    }

    return adjustedBrackets.sort((a, b) => a.minIncome - b.minIncome);
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
   * Net cost = UBI payments - additional tax revenue
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
   */
  getTaxBrackets(): ProgressiveTaxBracket[] {
    return this.getBrackets();
  }

  /**
   * Convert legacy tax brackets to new format
   */
  static convertLegacyBrackets(legacyBrackets: TaxBracket[]): ProgressiveTaxBracket[] {
    return legacyBrackets.map((bracket, index) => ({
      rate: bracket.rate,
      minIncome: bracket.lowerBound,
      maxIncome: bracket.upperBound !== null ? bracket.upperBound : undefined,
      description: `Tax bracket ${index + 1}`
    }));
  }

  /**
   * Get default progressive tax brackets based on the existing PROGRESSIVE_TAX_BRACKETS
   */
  static getDefaultBrackets(): ProgressiveTaxBracket[] {
    return ProgressiveTaxModel.convertLegacyBrackets(PROGRESSIVE_TAX_BRACKETS);
  }
}
