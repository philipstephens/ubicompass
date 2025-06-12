import { component$, useComputed$, useSignal } from "@builder.io/qwik";
import type { NonSerializableStrategy } from "../models/taxation-strategy-factory";
import "./taxation-strategy-visualization.css";

interface TaxationStrategyVisualizationProps {
  strategy: NonSerializableStrategy;
}

export const TaxationStrategyVisualization =
  component$<TaxationStrategyVisualizationProps>(({ strategy }) => {
    // Handle potentially undefined strategy (due to noSerialize)
    if (!strategy) {
      return <div>Strategy not available</div>;
    }

    // Store strategy properties to avoid serialization issues
    const strategyName = strategy.getName();
    const strategyDescription = strategy.getDescription();

    // Pre-calculate tax rates to avoid serialization issues
    // Generate sample incomes from $0 to $300k in increments of $10k
    const sampleIncomes = Array.from({ length: 31 }, (_, i) => i * 10);

    // Calculate tax rates upfront
    const initialTaxRates = sampleIncomes.map((income) => {
      const exemptionAmount = 24; // $24k in thousands
      const tax = strategy.calculateTax(income, exemptionAmount);
      const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
      return {
        income,
        tax,
        effectiveRate: Math.round(effectiveRate * 10) / 10, // Round to 1 decimal place
      };
    });

    // Store in signals
    const taxRates = useSignal(initialTaxRates);

    // Use computed value for max effective rate
    const maxEffectiveRate = useComputed$(() => {
      if (taxRates.value.length === 0) return 1; // Avoid division by zero
      return Math.max(...taxRates.value.map((rate) => rate.effectiveRate));
    });

    return (
      <div class="taxation-strategy-visualization">
        <h3 class="strategy-name">{strategyName} Model</h3>
        <p class="strategy-description">{strategyDescription}</p>

        <div class="visualization-container">
          <div class="visualization-header">
            <div>Income Level</div>
            <div>Effective Tax Rate</div>
            <div>Tax Amount</div>
          </div>

          <div class="visualization-body">
            {taxRates.value.map((rate) => (
              <div key={`income-${rate.income}`} class="visualization-row">
                <div class="income-level">${rate.income}k</div>
                <div class="tax-rate-bar-container">
                  <div
                    class="tax-rate-bar"
                    style={{
                      width: `${(rate.effectiveRate / maxEffectiveRate.value) * 100}%`,
                      backgroundColor: getBarColor(rate.effectiveRate),
                    }}
                  ></div>
                  <span class="tax-rate-value">{rate.effectiveRate}%</span>
                </div>
                <div class="tax-amount">${Math.round(rate.tax)}k</div>
              </div>
            ))}
          </div>
        </div>

        <div class="strategy-summary">
          <h4>Key Points:</h4>
          <ul>
            {strategyName === "Flat Tax" && (
              <>
                <li>Applies a uniform 30% tax rate to all income above $24k</li>
                <li>Simple to understand and implement</li>
                <li>Doesn't account for ability to pay</li>
                <li>
                  Effective tax rate increases as income rises, approaching 30%
                </li>
              </>
            )}

            {strategyName === "Progressive Tax" && (
              <>
                <li>
                  Uses increasing rates (10% to 40%) for higher income brackets
                </li>
                <li>More equitable based on ability to pay</li>
                <li>More complex to understand and implement</li>
                <li>
                  Effective tax rate increases more steeply as income rises
                </li>
              </>
            )}

            {strategyName === "Bell Curve" && (
              <>
                <li>
                  Tax rate based on income percentile, with highest rates around
                  90th percentile
                </li>
                <li>Targets the "sweet spot" for tax revenue</li>
                <li>Avoids extremely high rates on highest incomes</li>
                <li>
                  Effective tax rate peaks for upper-middle incomes, then levels
                  off
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  });

/**
 * Get a color for the tax rate bar based on the rate
 */
function getBarColor(rate: number): string {
  if (rate < 10) return "#4ade80"; // Green
  if (rate < 20) return "#facc15"; // Yellow
  if (rate < 30) return "#fb923c"; // Orange
  return "#ef4444"; // Red
}
