import { noSerialize, type NoSerialize } from "@builder.io/qwik";
import { FlatTaxStrategy } from "./flat-tax-strategy";
import { ProgressiveTaxStrategy } from "./progressive-tax-strategy";
import { BellCurveStrategy } from "./bell-curve-strategy";
import type { TaxationStrategy } from "./taxation-strategy";

// Type for a non-serializable strategy
export type NonSerializableStrategy = NoSerialize<TaxationStrategy>;

/**
 * Factory for creating taxation strategies
 */
export class TaxationStrategyFactory {
  /**
   * Get a taxation strategy by model ID
   */
  static getStrategy(modelId: number): NonSerializableStrategy {
    switch (modelId) {
      case 1:
        return noSerialize(new FlatTaxStrategy());
      case 2:
        return noSerialize(new ProgressiveTaxStrategy());
      case 3:
        return noSerialize(new BellCurveStrategy());
      default:
        return noSerialize(new FlatTaxStrategy()); // Default to flat tax
    }
  }

  /**
   * Get all available taxation strategies
   */
  static getAllStrategies(): NonSerializableStrategy[] {
    return [
      noSerialize(new FlatTaxStrategy()),
      noSerialize(new ProgressiveTaxStrategy()),
      noSerialize(new BellCurveStrategy())
    ];
  }
}
