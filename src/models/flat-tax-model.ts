import { TaxModel } from './tax-model.interface';

/**
 * Flat tax model constants
 */
export const FLAT_TAX_MODEL = {
  id: 1,
  name: "Flat Tax",
  description: "Simple flat tax rate applied to all income above exemption"
};

/**
 * Calculate flat tax (legacy function)
 */
export function calculateFlatTax(income: number, exemptionAmount: number, taxRate: number): number {
  const rate = taxRate / 100;
  const taxableIncome = Math.max(0, income - exemptionAmount);
  return taxableIncome * rate;
}

/**
 * Implementation of a flat tax model
 * Applies a single tax rate to all income (or income above exemption with UBI)
 */
export class FlatTaxModel implements TaxModel {
  readonly name = 'Flat Tax';

  /**
   * Create a new flat tax model
   * @param taxRate Tax rate as a percentage (e.g., 30 for 30%)
   */
  constructor(private taxRate: number) {}

  /**
   * Get the current tax rate
   * @returns Tax rate as a percentage
   */
  getTaxRate(): number {
    return this.taxRate;
  }

  /**
   * Set a new tax rate
   * @param rate Tax rate as a percentage
   */
  setTaxRate(rate: number): void {
    this.taxRate = rate;
  }

  /**
   * Calculate tax for a given income without UBI
   * Simple flat tax calculation: income * tax rate
   */
  calculateTax(income: number): number {
    return income * (this.taxRate / 100);
  }

  /**
   * Calculate tax for a given income with UBI
   * With UBI, we apply the exemption amount first, then tax the remainder
   */
  calculateTaxWithUBI(income: number, ubiAmount: number, exemptionAmount: number): number {
    // Add UBI to income
    const totalIncome = income + ubiAmount;

    // Apply exemption
    const taxableIncome = Math.max(0, totalIncome - exemptionAmount);

    // Calculate tax on taxable income
    return taxableIncome * (this.taxRate / 100);
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
   * For flat tax, we have just one bracket (or two if there's an exemption)
   */
  getTaxBrackets(): Array<{
    rate: number;
    minIncome: number;
    maxIncome?: number;
    description: string;
  }> {
    // For standard flat tax without UBI, just one bracket
    return [
      {
        rate: this.taxRate,
        minIncome: 0,
        description: 'Flat tax rate applied to all income'
      }
    ];
  }

  /**
   * Get tax brackets for display with UBI and exemption
   */
  getTaxBracketsWithUBI(exemptionAmount: number): Array<{
    rate: number;
    minIncome: number;
    maxIncome?: number;
    description: string;
  }> {
    // With UBI and exemption, we have two brackets
    return [
      {
        rate: 0,
        minIncome: 0,
        maxIncome: exemptionAmount,
        description: 'Exemption amount (no tax)'
      },
      {
        rate: this.taxRate,
        minIncome: exemptionAmount,
        description: 'Flat tax rate applied to income above exemption'
      }
    ];
  }
}
