import { TaxModel } from './tax-model.interface';
import { estimatePercentile, INCOME_PERCENTILES } from './bell-curve-tax-model';

/**
 * Percentile-Matched tax model constants
 */
export const PERCENTILE_MATCHED_TAX_MODEL = {
  id: 4,
  name: "Percentile-Matched",
  description: "Tax burden percentile matches income percentile (75th percentile income pays 75th percentile of tax)"
};

/**
 * Implementation of a Percentile-Matched tax model
 * Tax rate ensures that your tax burden percentile matches your income percentile
 */
export class PercentileMatchedTaxModel implements TaxModel {
  readonly name = 'Percentile-Matched';
  
  /**
   * Create a new Percentile-Matched tax model
   * @param maxTaxRate Maximum tax rate as a percentage (e.g., 40 for 40%)
   * @param minTaxRate Minimum tax rate as a percentage (e.g., 0 for 0%)
   */
  constructor(
    private maxTaxRate: number = 40,
    private minTaxRate: number = 0
  ) {}
  
  /**
   * Get the current maximum tax rate
   */
  getMaxTaxRate(): number {
    return this.maxTaxRate;
  }
  
  /**
   * Set a new maximum tax rate
   */
  setMaxTaxRate(maxTaxRate: number): void {
    this.maxTaxRate = maxTaxRate;
  }
  
  /**
   * Get the current minimum tax rate
   */
  getMinTaxRate(): number {
    return this.minTaxRate;
  }
  
  /**
   * Set a new minimum tax rate
   */
  setMinTaxRate(minTaxRate: number): void {
    this.minTaxRate = minTaxRate;
  }
  
  /**
   * Calculate tax rate for a given income
   * Maps income percentile directly to a tax rate between minTaxRate and maxTaxRate
   * @param income Income amount in thousands
   * @returns Tax rate as a percentage
   */
  private calculateTaxRate(income: number): number {
    // Estimate income percentile (0-100)
    const incomePercentile = estimatePercentile(income);
    
    // Map percentile to tax rate (linear mapping from minTaxRate to maxTaxRate)
    // For example, if minTaxRate=0 and maxTaxRate=40:
    // - 0th percentile income gets 0% tax rate
    // - 50th percentile income gets 20% tax rate
    // - 100th percentile income gets 40% tax rate
    const taxRate = this.minTaxRate + (incomePercentile / 100) * (this.maxTaxRate - this.minTaxRate);
    
    return taxRate;
  }
  
  /**
   * Calculate tax for a given income without UBI
   */
  calculateTax(income: number): number {
    const taxRate = this.calculateTaxRate(income);
    return income * (taxRate / 100);
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
    
    // Apply tax rate to taxable income
    return taxableIncome * (taxRate / 100);
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
   * For percentile-matched, we show representative brackets at different percentiles
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
