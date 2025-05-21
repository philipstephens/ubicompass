import type { TaxationModelData } from "./taxation";
import { BaseTaxationStrategy } from "./taxation-strategy";

/**
 * Flat Tax Strategy
 * 
 * Applies a uniform tax rate to all income above the exemption amount.
 */
export class FlatTaxStrategy extends BaseTaxationStrategy {
  private taxRate: number;
  
  constructor(taxRate: number = 30) {
    super(
      1, 
      "Flat Tax", 
      "Simple flat tax rate applied to all income above exemption"
    );
    this.taxRate = taxRate;
  }
  
  calculateTax(income: number, exemptionAmount: number): number {
    const taxRate = this.taxRate / 100;
    const taxableIncome = Math.max(0, income - exemptionAmount);
    return taxableIncome * taxRate;
  }
  
  getModelData(ubiId: number): TaxationModelData {
    return {
      model: {
        model_id: this.modelId,
        model_name: this.modelName,
        description: this.description
      },
      parameters: {
        exemption_amount: 24000,
        tax_rate: this.taxRate
      },
      brackets: [],
      percentiles: []
    };
  }
}
