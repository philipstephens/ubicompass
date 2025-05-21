import { TaxModel } from './tax-model.interface';
import { FlatTaxModel } from './flat-tax-model';
import { ProgressiveTaxModel, PROGRESSIVE_TAX_MODEL } from './progressive-tax-model';
import { BellCurveTaxModel, BELL_CURVE_TAX_MODEL } from './bell-curve-tax-model';
import { PercentileMatchedTaxModel, PERCENTILE_MATCHED_TAX_MODEL } from './percentile-matched-tax-model';
import { FLAT_TAX_MODEL } from './flat-tax-model';

/**
 * Factory for creating tax models
 * Provides a centralized way to create and manage different tax models
 */
export class TaxModelFactory {
  /**
   * Create a tax model by ID
   * @param modelId ID of the tax model to create
   * @param taxRate Tax rate for flat tax model (if applicable)
   * @returns The created tax model
   */
  static createModelById(modelId: number, taxRate: number = 30): TaxModel {
    switch (modelId) {
      case FLAT_TAX_MODEL.id:
        return new FlatTaxModel(taxRate);
      case PROGRESSIVE_TAX_MODEL.id:
        return new ProgressiveTaxModel(ProgressiveTaxModel.getDefaultBrackets());
      case BELL_CURVE_TAX_MODEL.id:
        return new BellCurveTaxModel();
      case PERCENTILE_MATCHED_TAX_MODEL.id:
        return new PercentileMatchedTaxModel();
      default:
        // Default to flat tax if ID is not recognized
        console.warn(`Unknown tax model ID: ${modelId}, defaulting to flat tax`);
        return new FlatTaxModel(taxRate);
    }
  }

  /**
   * Get all available tax models
   * @returns Array of available tax model metadata
   */
  static getAvailableModels(): Array<{ id: number; name: string; description: string }> {
    return [
      FLAT_TAX_MODEL,
      PROGRESSIVE_TAX_MODEL,
      BELL_CURVE_TAX_MODEL,
      PERCENTILE_MATCHED_TAX_MODEL
    ];
  }

  /**
   * Create a flat tax model
   * @param taxRate Tax rate as a percentage (e.g., 30 for 30%)
   * @returns A new flat tax model
   */
  static createFlatTaxModel(taxRate: number): FlatTaxModel {
    return new FlatTaxModel(taxRate);
  }

  /**
   * Create a progressive tax model with default brackets
   * @returns A new progressive tax model
   */
  static createProgressiveTaxModel(): ProgressiveTaxModel {
    return new ProgressiveTaxModel(ProgressiveTaxModel.getDefaultBrackets());
  }

  /**
   * Create a bell curve tax model with default parameters
   * @returns A new bell curve tax model
   */
  static createBellCurveTaxModel(): BellCurveTaxModel {
    return new BellCurveTaxModel();
  }

  /**
   * Create a percentile-matched tax model with default parameters
   * @returns A new percentile-matched tax model
   */
  static createPercentileMatchedTaxModel(): PercentileMatchedTaxModel {
    return new PercentileMatchedTaxModel();
  }
}
