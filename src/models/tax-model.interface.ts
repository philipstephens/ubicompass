/**
 * Interface for tax models to implement
 * Provides a consistent structure for different taxation approaches
 */
export interface TaxModel {
  /**
   * Name of the tax model for display purposes
   */
  readonly name: string;
  
  /**
   * Calculate tax amount for a given income without UBI
   * @param income Income amount in thousands
   * @returns Tax amount in thousands
   */
  calculateTax(income: number): number;
  
  /**
   * Calculate tax amount for a given income with UBI
   * @param income Income amount in thousands
   * @param ubiAmount UBI amount in thousands per year
   * @param exemptionAmount Exemption amount in thousands
   * @returns Tax amount in thousands
   */
  calculateTaxWithUBI(income: number, ubiAmount: number, exemptionAmount: number): number;
  
  /**
   * Calculate tax revenue for a quintile without UBI
   * @param averageIncome Average income for the quintile in thousands
   * @param taxpayerCount Number of taxpayers in the quintile in thousands
   * @returns Tax revenue in thousands
   */
  calculateQuintileRevenue(averageIncome: number, taxpayerCount: number): number;
  
  /**
   * Calculate tax revenue for a quintile with UBI
   * @param averageIncome Average income for the quintile in thousands
   * @param taxpayerCount Number of taxpayers in the quintile in thousands
   * @param ubiAmount UBI amount in thousands per year
   * @param exemptionAmount Exemption amount in thousands
   * @returns Tax revenue in thousands
   */
  calculateQuintileRevenueWithUBI(
    averageIncome: number, 
    taxpayerCount: number, 
    ubiAmount: number, 
    exemptionAmount: number
  ): number;
  
  /**
   * Calculate the net cost of UBI for a quintile
   * @param averageIncome Average income for the quintile in thousands
   * @param taxpayerCount Number of taxpayers in the quintile in thousands
   * @param ubiAmount UBI amount in thousands per year
   * @param exemptionAmount Exemption amount in thousands
   * @returns Net cost in thousands (UBI payments - additional tax revenue)
   */
  calculateUBICost(
    averageIncome: number, 
    taxpayerCount: number, 
    ubiAmount: number, 
    exemptionAmount: number
  ): number;
  
  /**
   * Get tax brackets for display
   * @returns Array of tax brackets with rate and income range
   */
  getTaxBrackets(): Array<{
    rate: number;
    minIncome: number;
    maxIncome?: number;
    description: string;
  }>;
}
