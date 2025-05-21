import type { TaxationModelData } from "./taxation";
import { BaseTaxationStrategy } from "./taxation-strategy";

/**
 * Percentile data interface
 */
interface PercentileData {
  percentile: number;
  lowerBound: number;
  upperBound: number;
  medianIncome: number;
}

/**
 * Bell Curve Tax Strategy
 * 
 * Applies a tax rate based on income percentile, following a bell curve distribution.
 */
export class BellCurveStrategy extends BaseTaxationStrategy {
  private bellCurveCenter: number;
  private bellCurveWidth: number;
  private maxTaxRate: number;
  private maxTaxAmount: number;
  private percentiles: PercentileData[];
  
  constructor(
    bellCurveCenter: number = 90,
    bellCurveWidth: number = 30,
    maxTaxRate: number = 40,
    maxTaxAmount: number = 1000
  ) {
    super(
      3, 
      "Bell Curve", 
      "Tax rate based on income percentile, following a bell curve distribution"
    );
    
    this.bellCurveCenter = bellCurveCenter;
    this.bellCurveWidth = bellCurveWidth;
    this.maxTaxRate = maxTaxRate;
    this.maxTaxAmount = maxTaxAmount;
    
    // Define percentile data (in thousands of dollars)
    this.percentiles = [
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
  }
  
  /**
   * Estimate the income percentile based on income amount
   */
  private estimatePercentile(income: number): number {
    // Find which percentile this income falls into
    for (let i = 0; i < this.percentiles.length; i++) {
      const percentile = this.percentiles[i];
      if (income >= percentile.lowerBound && income <= percentile.upperBound) {
        return percentile.percentile;
      }
    }
    
    // If income is above the highest percentile, return 100
    if (income > this.percentiles[this.percentiles.length - 1].upperBound) {
      return 100;
    }
    
    // Default to lowest percentile
    return 10;
  }
  
  calculateTax(income: number, exemptionAmount: number): number {
    const taxableIncome = Math.max(0, income - exemptionAmount);
    
    // If no taxable income, no tax
    if (taxableIncome <= 0) return 0;
    
    // Estimate income percentile
    const incomePercentile = this.estimatePercentile(income);
    
    // Calculate tax rate using bell curve formula
    const taxRate = (this.maxTaxRate / 100) * Math.exp(
      -Math.pow(incomePercentile - this.bellCurveCenter, 2) / 
      (2 * Math.pow(this.bellCurveWidth, 2))
    );
    
    // Calculate tax
    const calculatedTax = taxableIncome * taxRate;
    
    // Apply maximum tax cap
    return Math.min(calculatedTax, this.maxTaxAmount);
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
        bell_curve_center: this.bellCurveCenter,
        bell_curve_width: this.bellCurveWidth,
        max_tax_rate: this.maxTaxRate,
        max_tax_amount: this.maxTaxAmount * 1000
      },
      brackets: [],
      percentiles: this.percentiles.map((percentile, index) => ({
        percentile_id: index + 1,
        ubiid: ubiId,
        percentile: percentile.percentile,
        lower_bound: percentile.lowerBound * 1000,
        upper_bound: percentile.upperBound * 1000,
        median_income: percentile.medianIncome * 1000
      }))
    };
  }
}
