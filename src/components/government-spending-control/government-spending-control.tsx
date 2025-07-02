import {
  component$,
  useSignal,
  $,
  useStylesScoped$,
  useTask$,
  useVisibleTask$,
  useStore,
} from "@builder.io/qwik";
import { T, useTranslationState } from "../../contexts/translation-context";
import {
  getGovernmentSpendingSummary,
  getSpendingByCategory,
  getSocialProgramsData,
  calculateUbiReplacementAnalysis,
} from "../../services/government-spending-service";

export interface GovernmentSpendingControlProps {
  // Year for spending data
  year?: number;

  // UBI parameters for replacement analysis
  ubiCostAnnual?: number;
  taxRevenue?: number;

  // Callbacks
  onReplacementAnalysisChange$?: (analysis: {
    totalCurrentSpending: number;
    programSavings: number;
    netUbiCost: number;
    replacementRate: number;
  }) => void;

  // Display options
  showReplacementControls?: boolean;
  disabled?: boolean;
  className?: string;
}

export const GovernmentSpendingControl =
  component$<GovernmentSpendingControlProps>((props) => {
    useStylesScoped$(`
    .government-spending-control {
      width: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .spending-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: start;
    }

    .spending-overview {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .spending-analysis {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .spending-summary-card {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .spending-summary-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .spending-metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .spending-metric:last-child {
      border-bottom: none;
    }

    .metric-label {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .metric-value {
      font-size: 1rem;
      font-weight: 600;
      color: #1f2937;
    }

    .metric-value.positive {
      color: #059669;
    }

    .metric-value.negative {
      color: #dc2626;
    }

    .pie-chart-container {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .pie-chart-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
      text-align: center;
    }

    .pie-chart {
      width: 200px;
      height: 200px;
      margin: 0 auto 1rem;
    }

    .pie-legend {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .pie-legend-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0;
    }

    .pie-legend-color {
      width: 1rem;
      height: 1rem;
      border-radius: 0.125rem;
      margin-right: 0.5rem;
    }

    .pie-legend-label {
      font-size: 0.875rem;
      color: #374151;
    }

    .pie-legend-value {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1f2937;
    }

    .replacement-controls {
      background: white;
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid #e5e7eb;
    }

    .replacement-controls-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .program-control {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid #f3f4f6;
    }

    .program-control:last-child {
      border-bottom: none;
    }

    .program-info {
      flex: 1;
    }

    .program-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: #1f2937;
    }

    .program-amount {
      font-size: 0.75rem;
      color: #6b7280;
    }

    .replacement-slider {
      width: 120px;
      margin-left: 1rem;
    }

    .replacement-percentage {
      font-size: 0.75rem;
      color: #374151;
      margin-left: 0.5rem;
      min-width: 30px;
    }

    .loading-state {
      text-align: center;
      padding: 2rem;
      color: #6b7280;
    }

    .error-state {
      text-align: center;
      padding: 2rem;
      color: #dc2626;
      background: #fef2f2;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
      .spending-content {
        grid-template-columns: 1fr;
      }
    }
  `);

    const {
      year = 2022,
      ubiCostAnnual = 0,
      taxRevenue = 0,
      onReplacementAnalysisChange$,
      showReplacementControls = true,
      disabled = false,
      className = "",
    } = props;

    // Translation state
    const translationState = useTranslationState();

    // Helper function to translate text
    const t = (text: string): string => {
      return translationState.translations[text] || text;
    };

    // Helper function to translate accuracy labels with fallbacks (QRL)
    const translateAccuracyLabel = $((label: string): string => {
      // Ensure accuracy labels are properly translated
      const accuracyTranslations: { [key: string]: string } = {
        "High Accuracy":
          translationState.translations["High Accuracy"] || "High Accuracy",
        "Good Accuracy":
          translationState.translations["Good Accuracy"] || "Good Accuracy",
        "Moderate Accuracy":
          translationState.translations["Moderate Accuracy"] ||
          "Moderate Accuracy",
        "Limited Accuracy":
          translationState.translations["Limited Accuracy"] ||
          "Limited Accuracy",
        "Based on official government data":
          translationState.translations["Based on official government data"] ||
          "Based on official government data",
        "Estimated from recent data trends":
          translationState.translations["Estimated from recent data trends"] ||
          "Estimated from recent data trends",
        "Historical estimates - some programs may differ":
          translationState.translations[
            "Historical estimates - some programs may differ"
          ] || "Historical estimates - some programs may differ",
        "Rough approximation - significant differences likely":
          translationState.translations[
            "Rough approximation - significant differences likely"
          ] || "Rough approximation - significant differences likely",
        "Report Issue":
          translationState.translations["Report Issue"] || "Report Issue",
      };

      return (
        accuracyTranslations[label] ||
        translationState.translations[label] ||
        label
      );
    });

    // Helper function to get data accuracy information
    const getDataAccuracy = $((year: number) => {
      if (year >= 2021) {
        return {
          level: "high",
          label: "High Accuracy",
          description: "Based on official government data",
          icon: "✅",
          color: "#10b981",
        };
      } else if (year >= 2016) {
        return {
          level: "good",
          label: "Good Accuracy",
          description: "Estimated from recent data trends",
          icon: "📊",
          color: "#3b82f6",
        };
      } else if (year >= 2006) {
        return {
          level: "moderate",
          label: "Moderate Accuracy",
          description: "Historical estimates - some programs may differ",
          icon: "⚠️",
          color: "#f59e0b",
        };
      } else {
        return {
          level: "limited",
          label: "Limited Accuracy",
          description: "Rough approximation - significant differences likely",
          icon: "❓",
          color: "#ef4444",
        };
      }
    });

    // Data stores
    const spendingStore = useStore({
      summary: {
        year: 0,
        federalTotal: 0,
        federalSocial: 0,
        provincialTotal: 0,
        totalReplaceable: 0,
      },
      categories: [] as any[],
      socialPrograms: [] as any[],
      isLoading: true,
      error: null as string | null,
    });

    // Accuracy data store
    const accuracyData = useStore({
      level: "high",
      label: "High Accuracy",
      description: "Based on official government data",
      icon: "✅",
      color: "#10b981",
    });

    // Replacement scenario controls
    const replacementScenarios = useStore<Record<string, number>>({});

    // Update accuracy data when year changes (client-side only)
    useVisibleTask$(async ({ track }) => {
      track(() => year);
      const accuracy = await getDataAccuracy(year);
      accuracyData.level = accuracy.level;
      accuracyData.label = accuracy.label;
      accuracyData.description = accuracy.description;
      accuracyData.icon = accuracy.icon;
      accuracyData.color = accuracy.color;
    });

    // Load government spending data (client-side only)
    useVisibleTask$(async ({ track }) => {
      track(() => year);

      try {
        console.log(`🏛️ Loading government spending data for year ${year}`);
        spendingStore.isLoading = true;
        spendingStore.error = null;

        // Load all data in parallel
        const [summary, categories, socialPrograms] = await Promise.all([
          getGovernmentSpendingSummary(year),
          getSpendingByCategory(year, "CA"),
          getSocialProgramsData(year),
        ]);

        console.log(
          `📊 Received ${socialPrograms.length} social programs for ${year}:`,
          socialPrograms.map((p) => p.programName)
        );

        spendingStore.summary = summary;
        spendingStore.categories = categories;
        spendingStore.socialPrograms = socialPrograms;

        if (socialPrograms.length === 0) {
          console.warn(
            `⚠️ No social programs data received for year ${year} - replacement sliders will not appear`
          );
        }

        // Initialize replacement scenarios with default values
        socialPrograms.forEach((program) => {
          if (replacementScenarios[program.programCode] === undefined) {
            replacementScenarios[program.programCode] =
              program.replacementPercentage;
          }
        });

        spendingStore.isLoading = false;
      } catch (error) {
        console.error("Error loading government spending data:", error);
        spendingStore.error = "Failed to load government spending data";
        spendingStore.isLoading = false;
      }
    });

    // Calculate replacement analysis when parameters change (client-side only)
    useVisibleTask$(async ({ track }) => {
      track(() => ubiCostAnnual);
      track(() => taxRevenue);
      track(() => Object.values(replacementScenarios));

      if (!spendingStore.isLoading && spendingStore.socialPrograms.length > 0) {
        try {
          const analysis = await calculateUbiReplacementAnalysis(
            year,
            ubiCostAnnual,
            taxRevenue,
            replacementScenarios
          );

          if (onReplacementAnalysisChange$) {
            onReplacementAnalysisChange$(analysis);
          }
        } catch (error) {
          console.error("Error calculating replacement analysis:", error);
        }
      }
    });

    // Handle replacement percentage changes
    const handleReplacementChange = $(
      (programCode: string, percentage: number) => {
        replacementScenarios[programCode] = percentage;
      }
    );

    // Calculate spending pie chart data
    const spendingChartData = spendingStore.categories
      .filter((cat) => cat.amount > 0)
      .map((cat) => ({
        label: t(
          cat.isReplaceable
            ? `${cat.categoryName} (UBI Replaceable)`
            : cat.categoryName
        ),
        value: cat.amount * 1000000, // Convert to dollars
        percentage:
          spendingStore.summary.federalTotal > 0
            ? (cat.amount / spendingStore.summary.federalTotal) * 100
            : 0,
        color: cat.isReplaceable ? "#ef4444" : "#6b7280",
        isReplaceable: cat.isReplaceable,
      }));

    return (
      <div class={`government-spending-control ${className}`}>
        <div class="spending-content">
          <div class="spending-overview">
            {/* Government Spending Summary */}
            <div class="spending-summary-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 class="spending-summary-title">
                  <T text="Government Spending Summary" /> ({year})
                </h3>
                <div
                  style={`display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: ${accuracyData.color}15; border: 1px solid ${accuracyData.color}40; border-radius: 0.5rem; font-size: 0.75rem;`}
                >
                  <span style="font-size: 1rem;">{accuracyData.icon}</span>
                  <div>
                    <div
                      style={`font-weight: 600; color: ${accuracyData.color};`}
                    >
                      <T text={accuracyData.label} />
                    </div>
                    <div style="color: #6b7280; font-size: 0.7rem;">
                      <T text={accuracyData.description} />
                    </div>
                  </div>
                  {accuracyData.level !== "high" && (
                    <button
                      onClick$={async () => {
                        // Get current language
                        const currentLang =
                          translationState.currentLanguage || "en";

                        const translatedLabel = await translateAccuracyLabel(
                          accuracyData.label
                        );
                        const translatedDesc = await translateAccuracyLabel(
                          accuracyData.description
                        );

                        // Translate the prompt text components
                        const reportText =
                          translationState.translations[
                            "Report data accuracy issue for"
                          ] || "Report data accuracy issue for";
                        const dataAccuracyText =
                          translationState.translations[
                            "Data accuracy feedback for"
                          ] || "Data accuracy feedback for";
                        const describeText =
                          translationState.translations[
                            "Please describe any specific issues you've noticed:"
                          ] ||
                          "Please describe any specific issues you've noticed:";

                        const message = `${dataAccuracyText} ${year}: ${translatedLabel} - ${translatedDesc}`;
                        const promptText = `${reportText} ${year}:\n\n${message}\n\n${describeText}`;

                        const feedbackPrompt = prompt(promptText, "");
                        if (
                          feedbackPrompt &&
                          feedbackPrompt.trim().length > 0
                        ) {
                          try {
                            // Submit feedback with data-accuracy category
                            const feedbackText = `[Data Accuracy - ${year}] ${translatedLabel}: ${feedbackPrompt.trim()}`;

                            const response = await fetch("/api/feedback", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                feedback: feedbackText,
                                language: currentLang,
                                uiLanguage: currentLang,
                                userAgent: navigator.userAgent,
                                url: window.location.href,
                                timestamp: new Date().toISOString(),
                              }),
                            });

                            const result = await response.json();

                            if (result.success) {
                              // Use current language to get proper translations
                              const currentLang =
                                translationState.currentLanguage;

                              let thankYouText,
                                dataAccuracyText2,
                                feedbackIdText;

                              if (currentLang === "en") {
                                thankYouText =
                                  "Thank you for your feedback about";
                                dataAccuracyText2 =
                                  "data accuracy! Your input helps us improve our historical estimates.";
                                feedbackIdText = "Feedback ID:";
                              } else {
                                // Use translations for non-English languages
                                thankYouText =
                                  translationState.translations[
                                    "Thank you for your feedback about"
                                  ] || "Thank you for your feedback about";
                                dataAccuracyText2 =
                                  translationState.translations[
                                    "data accuracy! Your input helps us improve our historical estimates."
                                  ] ||
                                  "data accuracy! Your input helps us improve our historical estimates.";
                                feedbackIdText =
                                  translationState.translations[
                                    "Feedback ID:"
                                  ] || "Feedback ID:";
                              }

                              const successMsg = `${thankYouText} ${year} ${dataAccuracyText2}\n\n${feedbackIdText} ${result.analysis?.category || "submitted"}`;
                              alert(successMsg);
                            } else {
                              const errorText =
                                translationState.translations[
                                  "Error submitting feedback:"
                                ] || "Error submitting feedback:";
                              const tryAgainText =
                                translationState.translations[
                                  "Please try again later."
                                ] || "Please try again later.";

                              const errorMsg = `${errorText} ${result.error || tryAgainText}`;
                              alert(errorMsg);
                            }
                          } catch (error) {
                            console.error("Feedback submission error:", error);
                            const networkErrorText =
                              translationState.translations[
                                "Failed to submit feedback. Please try again later."
                              ] ||
                              "Failed to submit feedback. Please try again later.";
                            alert(networkErrorText);
                          }
                        }
                      }}
                      style="margin-left: 0.5rem; padding: 0.25rem 0.5rem; background: transparent; border: 1px solid #d1d5db; border-radius: 0.25rem; color: #6b7280; font-size: 0.7rem; cursor: pointer; transition: all 0.2s;"
                      title={`Report data accuracy issues for ${year}`}
                    >
                      📝 <T text="Report Issue" />
                    </button>
                  )}
                </div>
              </div>

              {spendingStore.isLoading && (
                <div class="loading-state">
                  <T text="Loading spending data..." />
                </div>
              )}

              {spendingStore.error && (
                <div class="error-state">
                  <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                    <span style="font-size: 1.2rem;">⚠️</span>
                    <strong>
                      <T text="Data Unavailable" />
                    </strong>
                  </div>
                  <T text="Government spending data is not available for" />{" "}
                  {year}.
                  <br />
                  <small style="color: #6b7280;">
                    <T text="Showing estimated data based on historical trends. Some features may be limited." />
                  </small>
                </div>
              )}

              {!spendingStore.isLoading && (
                <>
                  <div class="spending-metric">
                    <span class="metric-label">
                      <T text="Federal Total" />
                    </span>
                    <span class="metric-value">
                      ${(spendingStore.summary.federalTotal / 1000).toFixed(0)}B
                    </span>
                  </div>
                  <div class="spending-metric">
                    <span class="metric-label">
                      <T text="Federal Social Programs" />
                    </span>
                    <span class="metric-value">
                      ${(spendingStore.summary.federalSocial / 1000).toFixed(0)}
                      B
                    </span>
                  </div>
                  <div class="spending-metric">
                    <span class="metric-label">
                      <T text="Provincial Total" />
                    </span>
                    <span class="metric-value">
                      $
                      {(spendingStore.summary.provincialTotal / 1000).toFixed(
                        0
                      )}
                      B
                    </span>
                  </div>
                  <div class="spending-metric">
                    <span class="metric-label">
                      <T text="UBI Replaceable" />
                    </span>
                    <span class="metric-value positive">
                      $
                      {(spendingStore.summary.totalReplaceable / 1000).toFixed(
                        0
                      )}
                      B
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Federal Spending Breakdown Pie Chart */}
            {!spendingStore.isLoading && spendingChartData.length > 0 && (
              <div class="pie-chart-container">
                <h3 class="pie-chart-title">
                  <T text="Federal Spending Breakdown" />
                </h3>
                <svg class="pie-chart" viewBox="0 0 200 200">
                  {spendingChartData.map((segment, index) => {
                    const startAngle = spendingChartData
                      .slice(0, index)
                      .reduce((sum, s) => sum + (s.percentage / 100) * 360, 0);
                    const endAngle =
                      startAngle + (segment.percentage / 100) * 360;
                    const largeArcFlag = segment.percentage > 50 ? 1 : 0;

                    const x1 =
                      100 + 80 * Math.cos(((startAngle - 90) * Math.PI) / 180);
                    const y1 =
                      100 + 80 * Math.sin(((startAngle - 90) * Math.PI) / 180);
                    const x2 =
                      100 + 80 * Math.cos(((endAngle - 90) * Math.PI) / 180);
                    const y2 =
                      100 + 80 * Math.sin(((endAngle - 90) * Math.PI) / 180);

                    return (
                      <path
                        key={index}
                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={segment.color}
                        stroke="white"
                        stroke-width="2"
                      />
                    );
                  })}
                </svg>
                <div class="pie-legend">
                  {spendingChartData.map((item, index) => (
                    <div key={index} class="pie-legend-item">
                      <div style="display: flex; align-items: center;">
                        <div
                          class="pie-legend-color"
                          style={`background-color: ${item.color}`}
                        ></div>
                        <span class="pie-legend-label">{item.label}</span>
                      </div>
                      <span class="pie-legend-value">
                        ${(item.value / 1000000000).toFixed(0)}B (
                        {item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div class="spending-analysis">
            {/* Program Replacement Controls */}
            {showReplacementControls && !spendingStore.isLoading && (
              <div class="replacement-controls">
                <h3 class="replacement-controls-title">
                  <T text="UBI Program Replacement" />
                </h3>
                <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem;">
                  <T text="Adjust what percentage of each program would be replaced by UBI" />
                </p>

                {spendingStore.socialPrograms.length === 0 && (
                  <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                      <span style="font-size: 1.2rem;">📊</span>
                      <strong style="color: #92400e;">
                        <T text="No Replacement Data" />
                      </strong>
                    </div>
                    <div style="color: #92400e; font-size: 0.875rem;">
                      <T text="Detailed program replacement data is not available for" />{" "}
                      {year}.
                      <br />
                      <T text="General spending analysis is shown above using estimated data." />
                    </div>
                  </div>
                )}

                {spendingStore.socialPrograms.map((program) => (
                  <div key={program.programCode} class="program-control">
                    <div class="program-info">
                      <div class="program-name">
                        <T text={program.programName} />
                      </div>
                      <div class="program-amount">
                        ${(program.amount / 1000).toFixed(1)}B •{" "}
                        {program.beneficiaries.toLocaleString()}{" "}
                        <T text="recipients" />
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={replacementScenarios[program.programCode] || 0}
                      onInput$={(e) => {
                        const percentage = parseInt(
                          (e.target as HTMLInputElement).value
                        );
                        handleReplacementChange(
                          program.programCode,
                          percentage
                        );
                      }}
                      class="replacement-slider"
                      disabled={disabled}
                    />
                    <span class="replacement-percentage">
                      {replacementScenarios[program.programCode] || 0}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  });
