/**
 * UBI Optimizer Component using Genetic Algorithm
 * Provides optimization interface for finding optimal UBI parameters
 */
import {
  component$,
  useSignal,
  useStore,
  $,
  useStylesScoped$,
} from "@builder.io/qwik";
import {
  optimizeForScenario,
  optimizeUbiParameters,
  DEFAULT_OBJECTIVES,
  DEFAULT_CONSTRAINTS,
  DEFAULT_GA_CONFIG,
  type UbiGenome,
  type OptimizationResult,
  type OptimizationObjectives,
  type OptimizationConstraints,
  type GeneticAlgorithmConfig,
} from "../../services/genetic-optimizer";
import {
  useUbiCompassActions,
  useUbiCompassState,
} from "../../contexts/ubi-compass-context";
import { T, useTranslationState } from "../../contexts/translation-context";

export interface UbiOptimizerProps {
  className?: string;
  onOptimizationComplete$?: (result: OptimizationResult) => void;
  ageConstraints?: {
    childLocked: boolean;
    youthLocked: boolean;
    adultLocked: boolean;
    seniorLocked: boolean;
  };
  ubiConstraints?: {
    childLocked: boolean;
    youthLocked: boolean;
    adultLocked: boolean;
    seniorLocked: boolean;
  };
  taxConstraints?: {
    flatTaxRateLocked: boolean;
    taxExemptionLocked: boolean;
  };
}

export const UbiOptimizer = component$<UbiOptimizerProps>((props) => {
  useStylesScoped$(`
    .optimizer-container {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .optimizer-header {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: white;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .optimizer-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .optimizer-subtitle {
      font-size: 0.875rem;
      opacity: 0.9;
      margin: 0;
    }

    .scenario-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .scenario-button {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      border: 2px solid #d1d5db;
      border-radius: 0.5rem;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }

    .scenario-button:hover {
      background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
      border-color: #8b5cf6;
      transform: translateY(-2px);
    }

    .scenario-button.active {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      border-color: #7c3aed;
      color: white;
    }

    .scenario-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .scenario-name {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .scenario-description {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    .objectives-section {
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .objective-slider {
      margin-bottom: 1rem;
    }

    .objective-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .objective-value {
      font-weight: 600;
      color: #374151;
    }

    .slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #e5e7eb;
      outline: none;
      -webkit-appearance: none;
    }

    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #8b5cf6;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #8b5cf6;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .optimize-button {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      border-radius: 0.5rem;
      padding: 1rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
      margin-bottom: 1rem;
    }

    .optimize-button:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .optimize-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .progress-section {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e5e7eb;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #8b5cf6, #7c3aed);
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.875rem;
      color: #6b7280;
      text-align: center;
    }

    .success-message {
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      border: 2px solid #28a745;
      border-radius: 12px;
      padding: 16px;
      margin: 16px 0;
      box-shadow: 0 4px 12px rgba(40, 167, 69, 0.2);
      animation: slideIn 0.5s ease-out;
    }

    .success-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .success-icon {
      font-size: 24px;
      flex-shrink: 0;
    }

    .success-text {
      font-size: 16px;
      font-weight: 500;
      color: #155724;
      line-height: 1.4;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .feasibility-explanation {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
    }

    .explanation-title {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .feasible-explanation,
    .unfeasible-explanation {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .explanation-icon {
      font-size: 20px;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .explanation-text {
      flex: 1;
    }

    .explanation-main {
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;
    }

    .explanation-criteria {
      list-style: none;
      padding: 0;
      margin: 8px 0;
    }

    .explanation-criteria li {
      display: grid;
      grid-template-columns: 90px 1fr auto;
      align-items: center;
      padding: 4px 0;
      font-size: 14px;
      color: #6b7280;
      gap: 12px;
    }

    .criteria-label {
      text-align: left;
    }

    .criteria-value {
      text-align: left;
    }

    .criteria-status {
      font-weight: 600;
      font-size: 12px;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .criteria-status.success {
      background: #dcfce7;
      color: #166534;
    }

    .criteria-status.failure {
      background: #fef2f2;
      color: #dc2626;
    }

    .explanation-note {
      font-size: 12px;
      color: #6b7280;
      font-style: italic;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e5e7eb;
    }

    .results-section {
      margin-top: 2rem;
      padding: 1.5rem;
      background: #f0fdf4;
      border-radius: 0.5rem;
      border: 1px solid #bbf7d0;
    }

    .results-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #166534;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .result-item {
      background: white;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid #d1fae5;
    }

    .result-label {
      font-size: 0.75rem;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .result-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #166534;
    }

    .apply-button {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border: none;
      border-radius: 0.5rem;
      padding: 0.75rem 1.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 1rem;
    }

    .apply-button:hover {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      transform: translateY(-1px);
    }
  `);

  const {
    className = "",
    ageConstraints = {
      childLocked: false,
      youthLocked: false,
      adultLocked: false,
      seniorLocked: false,
    },
    ubiConstraints = {
      childLocked: false,
      youthLocked: false,
      adultLocked: false,
      seniorLocked: false,
    },
    taxConstraints = {
      flatTaxRateLocked: false,
      taxExemptionLocked: false,
    },
  } = props;
  const state = useUbiCompassState();
  const actions = useUbiCompassActions();

  // Translation state
  const translationState = useTranslationState();

  // Helper function to translate text
  const t = (text: string): string => {
    return translationState.translations[text] || text;
  };

  // Component state
  const selectedScenario = useSignal<string>("");
  const isOptimizing = useSignal(false);
  const optimizationProgress = useSignal(0);
  const currentGeneration = useSignal(0);
  const bestResult = useSignal<OptimizationResult | null>(null);
  const showSuccessMessage = useSignal(false);

  // Optimization parameters
  const objectives = useStore<OptimizationObjectives>({
    ...DEFAULT_OBJECTIVES,
  });

  const constraints = useStore<OptimizationConstraints>({
    ...DEFAULT_CONSTRAINTS,
  });

  const config = useStore<GeneticAlgorithmConfig>({
    ...DEFAULT_GA_CONFIG,
    generations: 25, // Reduced for UI responsiveness
    populationSize: 50,
  });

  // Scenario definitions
  const scenarios = [
    {
      id: "maximize_benefits",
      icon: "💰",
      name: t("Maximize Benefits"),
      description: t(
        "Highest possible UBI amounts while maintaining feasibility"
      ),
    },
    {
      id: "minimize_taxes",
      icon: "📉",
      name: t("Minimize Taxes"),
      description: t("Lowest tax rates while funding adequate UBI"),
    },
    {
      id: "fiscal_balance",
      icon: "⚖️",
      name: t("Fiscal Balance"),
      description: t("Balanced budget with minimal net cost"),
    },
    {
      id: "political_feasible",
      icon: "🏛️",
      name: t("Political Feasible"),
      description: t("Realistic parameters likely to gain political support"),
    },
  ];

  // Handle scenario selection
  const selectScenario = $((scenarioId: string) => {
    selectedScenario.value = scenarioId;

    // Update objectives based on scenario
    switch (scenarioId) {
      case "maximize_benefits":
        objectives.maximizeBenefits = 0.6;
        objectives.minimizeTaxBurden = 0.1;
        objectives.achieveFiscalBalance = 0.2;
        objectives.politicalFeasibility = 0.1;
        break;
      case "minimize_taxes":
        objectives.maximizeBenefits = 0.1;
        objectives.minimizeTaxBurden = 0.6;
        objectives.achieveFiscalBalance = 0.2;
        objectives.politicalFeasibility = 0.1;
        break;
      case "fiscal_balance":
        objectives.maximizeBenefits = 0.2;
        objectives.minimizeTaxBurden = 0.2;
        objectives.achieveFiscalBalance = 0.5;
        objectives.politicalFeasibility = 0.1;
        break;
      case "political_feasible":
        objectives.maximizeBenefits = 0.2;
        objectives.minimizeTaxBurden = 0.2;
        objectives.achieveFiscalBalance = 0.2;
        objectives.politicalFeasibility = 0.4;
        break;
    }
  });

  // Progress callback
  const onProgress = $(
    (generation: number, fitness: number, genome: UbiGenome) => {
      currentGeneration.value = generation;
      optimizationProgress.value = (generation / config.generations) * 100;
    }
  );

  // Run optimization
  const runOptimization = $(async () => {
    if (!selectedScenario.value) {
      alert("Please select an optimization scenario first.");
      return;
    }

    isOptimizing.value = true;
    optimizationProgress.value = 0;
    currentGeneration.value = 0;
    bestResult.value = null;

    try {
      // Validate population data
      if (!state.populationData || state.populationData.totalPopulation === 0) {
        throw new Error(
          "Invalid population data - population data is missing or zero"
        );
      }

      // Create current genome from state
      const currentGenome = {
        childUbi: state.ubiAmounts.child,
        youthUbi: state.ubiAmounts.youth,
        adultUbi: state.ubiAmounts.adult,
        seniorUbi: state.ubiAmounts.senior,
        flatTaxRate: state.taxParameters.flatTaxRate,
        taxExemption: state.taxParameters.taxExemption,
        childAgeCutoff: state.ageCutoffs.child,
        youthAgeCutoff: state.ageCutoffs.youth,
        seniorAgeCutoff: state.ageCutoffs.senior,
        oasReplacement: 50,
        ccbReplacement: 80,
        eiReplacement: 70,
        socialAssistanceReplacement: 60,
      };

      // Debug logging
      console.log("🎯 STARTING OPTIMIZATION:");
      console.log("  UBI Constraints:", ubiConstraints);
      console.log("  Age Constraints:", ageConstraints);
      console.log("  Tax Constraints:", taxConstraints);
      console.log("  Current Genome:", currentGenome);
      console.log("  Current State Values:", {
        ubiAmounts: state.ubiAmounts,
        taxParameters: state.taxParameters,
        ageCutoffs: state.ageCutoffs,
      });

      const result = await optimizeForScenario(
        selectedScenario.value as any,
        state.populationData,
        { gdp: 2500000000000 }, // $2.5T GDP estimate
        onProgress,
        ageConstraints,
        ubiConstraints,
        taxConstraints,
        currentGenome
      );

      bestResult.value = result;
      optimizationProgress.value = 100;

      // Apply results automatically
      const genome = result.genome;

      // Update UBI amounts (respect locks - only update unlocked values)
      const currentUbiAmounts = state.ubiAmounts;
      actions.updateUbiAmounts({
        child: ubiConstraints.childLocked
          ? currentUbiAmounts.child
          : genome.childUbi,
        youth: ubiConstraints.youthLocked
          ? currentUbiAmounts.youth
          : genome.youthUbi,
        adult: ubiConstraints.adultLocked
          ? currentUbiAmounts.adult
          : genome.adultUbi,
        senior: ubiConstraints.seniorLocked
          ? currentUbiAmounts.senior
          : genome.seniorUbi,
      });

      console.log("🎯 APPLYING OPTIMIZATION RESULTS:");
      console.log("  UBI Constraints:", ubiConstraints);
      console.log("  Genome Values:", {
        child: genome.childUbi,
        youth: genome.youthUbi,
        adult: genome.adultUbi,
        senior: genome.seniorUbi,
      });
      console.log("  Applied Values:", {
        child: ubiConstraints.childLocked
          ? currentUbiAmounts.child
          : genome.childUbi,
        youth: ubiConstraints.youthLocked
          ? currentUbiAmounts.youth
          : genome.youthUbi,
        adult: ubiConstraints.adultLocked
          ? currentUbiAmounts.adult
          : genome.adultUbi,
        senior: ubiConstraints.seniorLocked
          ? currentUbiAmounts.senior
          : genome.seniorUbi,
      });

      // Update tax parameters (respect locks - only update unlocked values)
      const currentTaxParameters = state.taxParameters;
      actions.updateTaxParameters({
        flatTaxRate: taxConstraints.flatTaxRateLocked
          ? currentTaxParameters.flatTaxRate
          : genome.flatTaxRate,
        taxExemption: taxConstraints.taxExemptionLocked
          ? currentTaxParameters.taxExemption
          : genome.taxExemption,
      });

      console.log("🎯 APPLYING TAX PARAMETER RESULTS:");
      console.log("  Tax Constraints:", taxConstraints);
      console.log("  Genome Tax Values:", {
        flatTaxRate: genome.flatTaxRate,
        taxExemption: genome.taxExemption,
      });
      console.log("  Applied Tax Values:", {
        flatTaxRate: taxConstraints.flatTaxRateLocked
          ? currentTaxParameters.flatTaxRate
          : genome.flatTaxRate,
        taxExemption: taxConstraints.taxExemptionLocked
          ? currentTaxParameters.taxExemption
          : genome.taxExemption,
      });

      // Update age cutoffs
      actions.updateAgeCutoffs({
        child: genome.childAgeCutoff,
        youth: genome.youthAgeCutoff,
        senior: genome.seniorAgeCutoff,
      });

      // Show success message
      showSuccessMessage.value = true;

      // Hide success message after 4 seconds
      setTimeout(() => {
        showSuccessMessage.value = false;
      }, 4000);

      if (props.onOptimizationComplete$) {
        props.onOptimizationComplete$(result);
      }
    } catch (error) {
      console.error("❌ Optimization failed:", error);
      console.error("❌ Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        selectedScenario: selectedScenario.value,
        populationData: state.populationData,
        ageConstraints: ageConstraints,
      });
      alert(
        `Optimization failed: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      isOptimizing.value = false;
    }
  });

  return (
    <div class={`optimizer-container ${className}`}>
      <div class="optimizer-header">
        <h3 class="optimizer-title">
          🧬 <T text="UBI Optimizer" />
        </h3>
        <p class="optimizer-subtitle">
          <T text="Use genetic algorithms to find optimal UBI parameters" />
        </p>
      </div>

      {/* Scenario Selection */}
      <div class="scenario-buttons">
        {scenarios.map((scenario) => {
          console.log("🎯 Rendering scenario button:", scenario.name);
          return (
            <div
              key={scenario.id}
              class={`scenario-button ${selectedScenario.value === scenario.id ? "active" : ""}`}
              onClick$={() => selectScenario(scenario.id)}
            >
              <div class="scenario-icon">{scenario.icon}</div>
              <div class="scenario-name">{scenario.name}</div>
              <div class="scenario-description">{scenario.description}</div>
            </div>
          );
        })}
      </div>

      {/* Optimization Button */}
      <button
        class="optimize-button"
        onClick$={runOptimization}
        disabled={isOptimizing.value || !selectedScenario.value}
      >
        {isOptimizing.value
          ? `🧬 ${t("Optimizing...")}`
          : `🚀 ${t("Start Optimization")}`}
      </button>

      {/* Progress Section */}
      {isOptimizing.value && (
        <div class="progress-section">
          <div class="progress-bar">
            <div
              class="progress-fill"
              style={`width: ${optimizationProgress.value}%`}
            ></div>
          </div>
          <div class="progress-text">
            Generation {currentGeneration.value} of {config.generations}(
            {optimizationProgress.value.toFixed(1)}%)
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage.value && (
        <div class="success-message">
          <div class="success-content">
            <span class="success-icon">✅</span>
            <span class="success-text">
              <T text="Optimization complete! Controls have been updated with optimized values." />
            </span>
          </div>
        </div>
      )}

      {/* Results Section */}
      {bestResult.value && (
        <div class="results-section">
          <h4 class="results-title">
            🎯 <T text="Optimization Results" />
          </h4>

          {/* User guidance note */}
          <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 0.5rem; padding: 0.75rem; margin-bottom: 1rem; font-size: 0.875rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem; color: #0369a1;">
              <span>💡</span>
              <strong>
                <T text="Tip:" />
              </strong>
            </div>
            <div style="color: #0369a1; margin-top: 0.25rem;">
              <T text="Not satisfied with these results? Try running the optimization again for different solutions, or adjust your locked parameters and constraints to guide the algorithm toward your preferred outcomes." />
            </div>
          </div>

          <div class="results-grid">
            <div class="result-item">
              <div class="result-label">
                <T text="Fitness Score" />
              </div>
              <div class="result-value">
                {(bestResult.value.fitness * 100).toFixed(1)}%
              </div>
            </div>

            <div class="result-item">
              <div class="result-label">
                <T text="Adult UBI" />
              </div>
              <div class="result-value">
                ${bestResult.value.genome.adultUbi}/mo
                {ubiConstraints.adultLocked && (
                  <span style="color: #dc2626; margin-left: 0.5rem;">🔒</span>
                )}
              </div>
            </div>

            <div class="result-item">
              <div class="result-label">
                <T text="Tax Rate" />
              </div>
              <div class="result-value">
                {bestResult.value.genome.flatTaxRate}%
                {taxConstraints.flatTaxRateLocked && (
                  <span style="color: #dc2626; margin-left: 0.5rem;">🔒</span>
                )}
              </div>
            </div>

            <div class="result-item">
              <div class="result-label">
                <T text="Net Cost" />
              </div>
              <div class="result-value">
                $
                {(bestResult.value.feasibility.netCost / 1000000000).toFixed(1)}
                B
              </div>
            </div>

            <div class="result-item">
              <div class="result-label">
                <T text="GDP Impact" />
              </div>
              <div class="result-value">
                {bestResult.value.feasibility.gdpPercentage.toFixed(1)}%
              </div>
            </div>

            <div class="result-item">
              <div class="result-label">
                <T text="Optimizer Feasible" />
              </div>
              <div class="result-value">
                {bestResult.value.feasibility.isFeasible ? "✅" : "❌"}
              </div>
            </div>
          </div>

          {/* Feasibility Explanation */}
          <div class="feasibility-explanation">
            <h5 class="explanation-title">
              <T text="Feasibility Assessment" />
            </h5>
            <div class="explanation-content">
              {bestResult.value.feasibility.isFeasible ? (
                <div class="feasible-explanation">
                  <div class="explanation-icon">✅</div>
                  <div class="explanation-text">
                    <div class="explanation-main">
                      <T text="This optimization meets the genetic algorithm's feasibility criteria:" />
                    </div>
                    <ul class="explanation-criteria">
                      <li>
                        <span class="criteria-label">
                          <T text="Net cost" />:
                        </span>
                        <span class="criteria-value">
                          $
                          {(
                            bestResult.value.feasibility.netCost / 1000000000
                          ).toFixed(1)}
                          B
                        </span>
                        <span class="criteria-status success">
                          ≤ ${(200).toFixed(0)}B <T text="limit" />
                        </span>
                      </li>
                      <li>
                        <span class="criteria-label">
                          <T text="GDP impact" />:
                        </span>
                        <span class="criteria-value">
                          {bestResult.value.feasibility.gdpPercentage.toFixed(
                            1
                          )}
                          %
                        </span>
                        <span class="criteria-status success">
                          ≤ 10% <T text="limit" />
                        </span>
                      </li>
                    </ul>
                    <div class="explanation-note">
                      <T text="Note: This assessment uses optimization constraints and may differ from the main feasibility indicator, which considers funding sources and political viability." />
                    </div>
                  </div>
                </div>
              ) : (
                <div class="unfeasible-explanation">
                  <div class="explanation-icon">❌</div>
                  <div class="explanation-text">
                    <div class="explanation-main">
                      <T text="This optimization exceeds the genetic algorithm's feasibility limits:" />
                    </div>
                    <ul class="explanation-criteria">
                      <li>
                        <span class="criteria-label">
                          <T text="Net cost" />:
                        </span>
                        <span class="criteria-value">
                          $
                          {(
                            bestResult.value.feasibility.netCost / 1000000000
                          ).toFixed(1)}
                          B
                        </span>
                        <span
                          class={`criteria-status ${bestResult.value.feasibility.netCost <= 200000000000 ? "success" : "failure"}`}
                        >
                          {bestResult.value.feasibility.netCost <= 200000000000
                            ? "✓"
                            : "✗"}{" "}
                          ${(200).toFixed(0)}B <T text="limit" />
                        </span>
                      </li>
                      <li>
                        <span class="criteria-label">
                          <T text="GDP impact" />:
                        </span>
                        <span class="criteria-value">
                          {bestResult.value.feasibility.gdpPercentage.toFixed(
                            1
                          )}
                          %
                        </span>
                        <span
                          class={`criteria-status ${bestResult.value.feasibility.gdpPercentage <= 10 ? "success" : "failure"}`}
                        >
                          {bestResult.value.feasibility.gdpPercentage <= 10
                            ? "✓"
                            : "✗"}{" "}
                          10% <T text="limit" />
                        </span>
                      </li>
                    </ul>
                    <div class="explanation-note">
                      <T text="Note: The optimizer prioritizes other objectives over strict feasibility. Check the main feasibility indicator for a comprehensive assessment including funding sources." />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default UbiOptimizer;
