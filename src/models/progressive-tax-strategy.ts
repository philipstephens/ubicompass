import type { TaxationModelData } from "./taxation";
import { BaseTaxationStrategy } from "./taxation-strategy";

/**
 * Tax bracket interface
 */
interface TaxBracket {
  lowerBound: number;
  upperBound: number | null;
  rate: number;
}

/**
 * Progressive Tax Strategy
 * 
 * Applies increasing tax rates to higher income brackets.
 */
export class ProgressiveTaxStrategy extends BaseTaxationStrategy {
  private brackets: TaxBracket[];
  
  constructor() {
    super(
      2, 
      "Progressive Tax", 
      "Multiple tax brackets with increasing rates for higher incomes"
    );
    
    // Define tax brackets (in thousands of dollars)
    this.brackets = [
      { lowerBound: 0, upperBound: 24, rate: 0 },
      { lowerBound: 24, upperBound: 50, rate: 10 },
      { lowerBound: 50, upperBound: 100, rate: 20 },
      { lowerBound: 100, upperBound: 250, rate: 30 },
      { lowerBound: 250, upperBound: 500, rate: 35 },
      { lowerBound: 500, upperBound: null, rate: 40 }
    ];
  }
  
  calculateTax(income: number, exemptionAmount: number): number {
    const taxableIncome = Math.max(0, income - exemptionAmount);
    
    // Sort brackets by lower bound
    const sortedBrackets = [...this.brackets].sort(
      (a, b) => a.lowerBound - b.lowerBound
    );
    
    let remainingIncome = taxableIncome;
    let tax = 0;
    
    // Calculate tax for each bracket
    for (const bracket of sortedBrackets) {
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
  
  getModelData(ubiId: number): TaxationModelData {
    return {
      model: {
        model_id: this.modelId,
        model_name: this.modelName,
        description: this.description
      },
      parameters: {
        exemption_amount: 24000
      },
      brackets: this.brackets.map((bracket, index) => ({
        bracket_id: index + 1,
        model_id: this.modelId,
        ubiid: ubiId,
        lower_bound: bracket.lowerBound * 1000,
        upper_bound: bracket.upperBound !== null ? bracket.upperBound * 1000 : null,
        tax_rate: bracket.rate
      })),
      percentiles: []
    };
  }
}
