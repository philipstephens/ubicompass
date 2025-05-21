import type { TaxEntry, YearMetaData } from "../components/ubi-calculation-component";
import type { TaxationModelData } from "./taxation";

/**
 * Interface for all taxation strategies
 */
export interface TaxationStrategy {
  /**
   * Calculate tax for a given income
   */
  calculateTax(income: number, exemptionAmount: number): number;
  
  /**
   * Calculate tax revenue for all quintiles
   */
  calculateTaxRevenue(
    taxEntries: TaxEntry[],
    selectedYear: YearMetaData
  ): number;
  
  /**
   * Get the name of the taxation strategy
   */
  getName(): string;
  
  /**
   * Get the description of the taxation strategy
   */
  getDescription(): string;
  
  /**
   * Get the model data for the taxation strategy
   */
  getModelData(ubiId: number): TaxationModelData;
}

/**
 * Base class for all taxation strategies
 */
export abstract class BaseTaxationStrategy implements TaxationStrategy {
  protected modelId: number;
  protected modelName: string;
  protected description: string;
  
  constructor(modelId: number, modelName: string, description: string) {
    this.modelId = modelId;
    this.modelName = modelName;
    this.description = description;
  }
  
  abstract calculateTax(income: number, exemptionAmount: number): number;
  
  calculateTaxRevenue(
    taxEntries: TaxEntry[],
    selectedYear: YearMetaData
  ): number {
    return taxEntries.reduce((sum, entry) => {
      const yearlyUbiInThousands = (selectedYear.ubiamount * 12) / 1000;
      const incomeWithUbi = entry.averagetaxableincome + yearlyUbiInThousands;
      const exemptionAmount = 24; // $24k in thousands
      
      const taxWithUbi = this.calculateTax(incomeWithUbi, exemptionAmount);
      
      return sum + taxWithUbi * selectedYear.taxpayersperquintile;
    }, 0);
  }
  
  getName(): string {
    return this.modelName;
  }
  
  getDescription(): string {
    return this.description;
  }
  
  abstract getModelData(ubiId: number): TaxationModelData;
}
