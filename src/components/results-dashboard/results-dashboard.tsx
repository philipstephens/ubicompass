import { component$, useStylesScoped$ } from "@builder.io/qwik";
import {
  useUbiCompassState,
  useUbiResults,
} from "../../contexts/ubi-compass-context";
import { T, useTranslationState } from "../../contexts/translation-context";

export interface ResultsDashboardProps {
  className?: string;
}

export const ResultsDashboard = component$<ResultsDashboardProps>((props) => {
  useStylesScoped$(`
    .results-dashboard {
      width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .result-card {
      background: white;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .result-card.success {
      border-left: 4px solid #22c55e;
      background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
    }

    .result-card.warning {
      border-left: 4px solid #f59e0b;
      background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
    }

    .result-card.danger {
      border-left: 4px solid #ef4444;
      background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
    }

    .result-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .result-value {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
    }

    .result-value.success {
      color: #16a34a;
    }

    .result-value.warning {
      color: #d97706;
    }

    .result-value.danger {
      color: #dc2626;
    }

    .result-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin-bottom: 1rem;
    }

    .result-breakdown {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .breakdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
      font-size: 0.875rem;
    }

    .breakdown-item:last-child {
      border-bottom: none;
    }

    .breakdown-label {
      color: #6b7280;
    }

    .breakdown-value {
      font-weight: 600;
      color: #1f2937;
    }

    .feasibility-indicator {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-top: 1rem;
    }

    .feasibility-indicator.feasible {
      background: #dcfce7;
      color: #166534;
    }

    .feasibility-indicator.challenging {
      background: #fef3c7;
      color: #92400e;
    }

    .feasibility-indicator.unfeasible {
      background: #fee2e2;
      color: #991b1b;
    }

    .feasibility-icon {
      font-size: 1.5rem;
    }

    .progress-bar {
      width: 100%;
      height: 0.5rem;
      background: #f3f4f6;
      border-radius: 0.25rem;
      overflow: hidden;
      margin: 0.5rem 0;
    }

    .progress-fill {
      height: 100%;
      transition: width 0.3s ease;
    }

    .progress-fill.success {
      background: linear-gradient(90deg, #22c55e, #16a34a);
    }

    .progress-fill.warning {
      background: linear-gradient(90deg, #f59e0b, #d97706);
    }

    .progress-fill.danger {
      background: linear-gradient(90deg, #ef4444, #dc2626);
    }
  `);

  const { className = "" } = props;
  const state = useUbiCompassState();
  const results = useUbiResults();

  // Translation state
  const translationState = useTranslationState();

  // Helper function to translate text
  const t = (text: string): string => {
    return translationState.translations[text] || text;
  };

  // Determine feasibility status
  const getFeasibilityStatus = () => {
    if (results.isSelfFunded) {
      return {
        status: "feasible",
        icon: "✅",
        message: t("UBI is fully self-funded!"),
      };
    } else if (results.fundingPercentage >= 75) {
      return {
        status: "challenging",
        icon: "⚠️",
        message: t("UBI is mostly funded but needs additional revenue"),
      };
    } else {
      return {
        status: "unfeasible",
        icon: "❌",
        message: t("UBI requires significant additional funding"),
      };
    }
  };

  const feasibility = getFeasibilityStatus();

  return (
    <div class={`results-dashboard ${className}`}>
      <div class="results-grid">
        {/* Net Cost Card */}
        <div
          class={`result-card ${results.isSelfFunded ? "success" : results.fundingPercentage >= 75 ? "warning" : "danger"}`}
        >
          <div class="result-title">
            💰 <T text="Net UBI Cost" />
          </div>
          <div
            class={`result-value ${results.isSelfFunded ? "success" : results.fundingPercentage >= 75 ? "warning" : "danger"}`}
          >
            {results.isSelfFunded ? "+" : ""}$
            {Math.abs(results.netCostAfterReplacement / 1000000000).toFixed(1)}B
          </div>
          <div class="result-subtitle">
            {results.isSelfFunded
              ? t("Annual surplus")
              : t("Additional funding needed")}
          </div>
          <div class="result-breakdown">
            <div class="breakdown-item">
              <span class="breakdown-label">
                <T text="Total UBI Cost" />
              </span>
              <span class="breakdown-value">
                ${(results.totalUbiCost / 1000000000).toFixed(1)}B
              </span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">
                <T text="Tax Revenue" />
              </span>
              <span class="breakdown-value">
                ${(results.totalTaxRevenue / 1000000000).toFixed(1)}B
              </span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">
                <T text="Program Savings" />
              </span>
              <span class="breakdown-value">
                $
                {(
                  state.replacementAnalysis.programSavings / 1000000000
                ).toFixed(1)}
                B
              </span>
            </div>
          </div>
        </div>

        {/* Funding Status Card */}
        <div
          class={`result-card ${results.fundingPercentage >= 100 ? "success" : results.fundingPercentage >= 75 ? "warning" : "danger"}`}
        >
          <div class="result-title">
            📊 <T text="Funding Status" />
          </div>
          <div
            class={`result-value ${results.fundingPercentage >= 100 ? "success" : results.fundingPercentage >= 75 ? "warning" : "danger"}`}
          >
            {results.fundingPercentage.toFixed(1)}%
          </div>
          <div class="result-subtitle">
            <T text="Of UBI cost is covered by taxes and program savings" />
          </div>
          <div class="progress-bar">
            <div
              class={`progress-fill ${results.fundingPercentage >= 100 ? "success" : results.fundingPercentage >= 75 ? "warning" : "danger"}`}
              style={`width: ${Math.min(100, results.fundingPercentage)}%`}
            ></div>
          </div>
          <div class="result-breakdown">
            <div class="breakdown-item">
              <span class="breakdown-label">
                <T text="Tax Coverage" />
              </span>
              <span class="breakdown-value">
                {(
                  (results.totalTaxRevenue / results.totalUbiCost) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">
                <T text="Program Savings" />
              </span>
              <span class="breakdown-value">
                {results.costReductionPercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Population Impact Card */}
        <div class="result-card">
          <div class="result-title">
            👥 <T text="Population Impact" />
          </div>
          <div class="result-value">
            {(state.populationData.totalPopulation / 1000000).toFixed(1)}M
          </div>
          <div class="result-subtitle">
            <T text="Total population receiving UBI" />
          </div>
          <div class="result-breakdown">
            <div class="breakdown-item">
              <span class="breakdown-label">
                👶 <T text="Children" /> (0-{state.ageCutoffs.child})
              </span>
              <span class="breakdown-value">
                {(state.populationData.childPopulation / 1000000).toFixed(1)}M
              </span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">
                🧑 <T text="Youth" /> ({state.ageCutoffs.child + 1}-
                {state.ageCutoffs.youth})
              </span>
              <span class="breakdown-value">
                {(state.populationData.youthPopulation / 1000000).toFixed(1)}M
              </span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">
                👨 <T text="Adults" /> ({state.ageCutoffs.youth + 1}-
                {state.ageCutoffs.senior - 1})
              </span>
              <span class="breakdown-value">
                {(state.populationData.adultPopulation / 1000000).toFixed(1)}M
              </span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">
                👴 <T text="Seniors" /> ({state.ageCutoffs.senior}+)
              </span>
              <span class="breakdown-value">
                {(state.populationData.seniorPopulation / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>

        {/* UBI Amounts Card */}
        <div class="result-card">
          <div class="result-title">
            💵 <T text="UBI Amounts" />
          </div>
          <div class="result-value">${state.ubiAmounts.adult}/mo</div>
          <div class="result-subtitle">
            <T text="Adult UBI amount (primary rate)" />
          </div>
          <div class="result-breakdown">
            <div class="breakdown-item">
              <span class="breakdown-label">
                👶 <T text="Child UBI" />
              </span>
              <span class="breakdown-value">${state.ubiAmounts.child}/mo</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">
                🧑 <T text="Youth UBI" />
              </span>
              <span class="breakdown-value">${state.ubiAmounts.youth}/mo</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">
                👨 <T text="Adult UBI" />
              </span>
              <span class="breakdown-value">${state.ubiAmounts.adult}/mo</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">
                👴 <T text="Senior UBI" />
              </span>
              <span class="breakdown-value">${state.ubiAmounts.senior}/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feasibility Indicator */}
      <div class={`feasibility-indicator ${feasibility.status}`}>
        <div class="feasibility-icon">{feasibility.icon}</div>
        <div>
          <div style="font-weight: 600; margin-bottom: 0.25rem;">
            {feasibility.status === "feasible"
              ? t("Feasible")
              : feasibility.status === "challenging"
                ? t("Challenging")
                : t("Unfeasible")}
          </div>
          <div style="font-size: 0.875rem;">{feasibility.message}</div>
        </div>
      </div>
    </div>
  );
});
