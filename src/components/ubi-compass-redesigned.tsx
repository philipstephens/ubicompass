// @ts-nocheck
import {
  component$,
  useStore,
  useSignal,
  $,
  useVisibleTask$,
} from "@builder.io/qwik";
import "./ubi-compass-redesigned.css"; // Import component-specific CSS
import { AgeDistributionControl } from "./age-distribution-control";
import { UbiAmountsControl } from "./ubi-amounts-control";
import { GovernmentSpendingControl } from "./government-spending-control";
import { ResultsDashboard } from "./results-dashboard";
import { UbiOptimizer } from "./ubi-optimizer";
import { LanguageSelector } from "./language-selector/language-selector";
import { YearSelector } from "./year-selector/year-selector";
import {
  UbiCompassProvider,
  useUbiCompassState,
  useUbiCompassActions,
  useUbiResults,
} from "../contexts/ubi-compass-context";
import {
  TranslationProvider,
  useTranslationState,
  useTranslationActions,
  T,
} from "../contexts/translation-context";

// Inner component that uses the context
const UbiCompassContent = component$(() => {
  // Debug mode toggle - set to false to hide debug section
  const SHOW_DEBUG = false; // Change to true to show debug info

  const state = useUbiCompassState();
  const actions = useUbiCompassActions();
  const results = useUbiResults();
  const translationState = useTranslationState();
  const translationActions = useTranslationActions();

  // Client-side debug info for language selector
  const languageSelectorDebug = useStore({
    componentExists: false,
    buttonExists: false,
    flagExists: false,
    flagContent: "",
    languageName: "",
  });

  // Update debug info on client-side only
  useVisibleTask$(() => {
    languageSelectorDebug.componentExists =
      !!document.querySelector(".language-selector");
    languageSelectorDebug.buttonExists =
      !!document.querySelector(".language-button");
    languageSelectorDebug.flagExists =
      !!document.querySelector(".language-flag");
    languageSelectorDebug.flagContent =
      document.querySelector(".language-flag")?.textContent || "None";
    languageSelectorDebug.languageName =
      document.querySelector(".language-name")?.textContent || "None";
  });

  // Age group lock constraints for optimizer
  const ageConstraints = useStore({
    childLocked: false,
    youthLocked: false,
    adultLocked: false,
    seniorLocked: false,
  });

  // UBI amount constraints for optimizer
  const ubiConstraints = useStore({
    childLocked: false,
    youthLocked: false,
    adultLocked: false,
    seniorLocked: false,
  });

  // Tax parameter constraints for optimizer
  const taxConstraints = useStore({
    flatTaxRateLocked: false,
    taxExemptionLocked: false,
  });

  // Menu state
  const isMenuOpen = useSignal(false);

  // Menu actions
  const toggleMenu = $(() => {
    isMenuOpen.value = !isMenuOpen.value;
  });

  const openAbout = $(() => {
    isMenuOpen.value = false;
    // TODO: Open about modal/page
    alert(
      "About UBI Compass:\n\nA comprehensive tool for analyzing Universal Basic Income policies using genetic algorithms and real Canadian demographic data.\n\nVersion: 1.0\nDeveloped with Qwik framework"
    );
  });

  // Year change handler
  const handleYearChange = $((year: number) => {
    console.log("🗓️ Year changed to:", year);
    actions.updateYear(year);
  });

  const openFeedback = $(async () => {
    isMenuOpen.value = false;

    // Get current language for localized prompt
    const currentLanguage = translationState.currentLanguage;

    // Create localized feedback prompt
    let promptMessage =
      "We'd love your feedback!\n\nPlease share your thoughts, suggestions, or report any issues:";

    if (currentLanguage === "fr") {
      promptMessage =
        "[FR] Nous aimerions avoir vos commentaires!\n\nVeuillez partager vos réflexions, suggestions ou signaler tout problème:";
    } else if (currentLanguage === "es") {
      promptMessage =
        "[ES] ¡Nos encantaría recibir tus comentarios!\n\nPor favor comparte tus pensamientos, sugerencias o reporta cualquier problema:";
    } else if (currentLanguage === "de") {
      promptMessage =
        "[DE] Wir würden uns über Ihr Feedback freuen!\n\nBitte teilen Sie uns Ihre Gedanken, Vorschläge mit oder melden Sie Probleme:";
    } else if (currentLanguage !== "en") {
      promptMessage = `[${currentLanguage.toUpperCase()}] We'd love your feedback!\n\nPlease share your thoughts, suggestions, or report any issues:`;
    }

    const feedback = prompt(promptMessage);
    if (!feedback || feedback.trim().length === 0) {
      return;
    }

    try {
      // Get current language from translation context
      const responseLanguage = translationState.currentLanguage;

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback: feedback.trim(),
          language: currentLanguage,
          uiLanguage: currentLanguage, // Add UI language separately
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      console.log("📡 Feedback response status:", response.status);
      console.log("📡 Feedback response ok:", response.ok);

      const result = await response.json();
      console.log("📡 Feedback result:", result);

      if (result.success) {
        // Use the detected language from the server response
        const responseLanguage =
          result.analysis?.originalLanguage || currentLanguage;

        // Create localized success message based on detected language
        let message =
          "Thank you for your feedback! We'll review it and use it to improve UBI Compass.";

        if (responseLanguage === "fr") {
          message =
            "[FR] Merci pour vos commentaires! Nous les examinerons et les utiliserons pour améliorer UBI Compass.";
        } else if (responseLanguage === "es") {
          message =
            "[ES] ¡Gracias por tus comentarios! Los revisaremos y los usaremos para mejorar UBI Compass.";
        } else if (responseLanguage === "de") {
          message =
            "[DE] Vielen Dank für Ihr Feedback! Wir werden es überprüfen und zur Verbesserung von UBI Compass verwenden.";
        } else if (responseLanguage !== "en") {
          message = `[${responseLanguage.toUpperCase()}] Thank you for your feedback! We'll review it and use it to improve UBI Compass.`;
        }

        if (result.analysis) {
          const { sentiment, category, wasTranslated, originalLanguage } =
            result.analysis;

          // Add analysis info in appropriate language
          if (responseLanguage === "fr") {
            message += `\n\nAnalyse: sentiment ${sentiment}, catégorisé comme ${category}`;
            if (wasTranslated) {
              message += `\nTraduit de ${originalLanguage} vers l'anglais pour traitement.`;
            }
          } else if (responseLanguage === "es") {
            message += `\n\nAnálisis: sentimiento ${sentiment}, categorizado como ${category}`;
            if (wasTranslated) {
              message += `\nTraducido de ${originalLanguage} al inglés para procesamiento.`;
            }
          } else if (responseLanguage === "de") {
            message += `\n\nAnalyse: ${sentiment} Stimmung, kategorisiert als ${category}`;
            if (wasTranslated) {
              message += `\nVon ${originalLanguage} ins Englische übersetzt zur Verarbeitung.`;
            }
          } else {
            // Default English analysis
            message += `\n\nAnalysis: ${sentiment} sentiment, categorized as ${category}`;
            if (wasTranslated) {
              message += `\nTranslated from ${originalLanguage} to English for processing.`;
            }
          }
        }

        alert(message);
      } else {
        // Localized error message
        let errorMsg = `Error: ${result.error || "Failed to submit feedback"}`;
        if (responseLanguage === "fr") {
          errorMsg = `[FR] Erreur: ${result.error || "Échec de l'envoi des commentaires"}`;
        } else if (responseLanguage === "es") {
          errorMsg = `[ES] Error: ${result.error || "Error al enviar comentarios"}`;
        } else if (responseLanguage === "de") {
          errorMsg = `[DE] Fehler: ${result.error || "Feedback konnte nicht gesendet werden"}`;
        } else if (responseLanguage !== "en") {
          errorMsg = `[${responseLanguage.toUpperCase()}] Error: ${result.error || "Failed to submit feedback"}`;
        }
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Feedback submission error:", error);

      // Localized network error message
      let networkErrorMsg =
        "Failed to submit feedback. Please try again later.";
      if (responseLanguage === "fr") {
        networkErrorMsg =
          "[FR] Échec de l'envoi des commentaires. Veuillez réessayer plus tard.";
      } else if (responseLanguage === "es") {
        networkErrorMsg =
          "[ES] Error al enviar comentarios. Por favor, inténtelo de nuevo más tarde.";
      } else if (responseLanguage === "de") {
        networkErrorMsg =
          "[DE] Feedback konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.";
      } else if (responseLanguage !== "en") {
        networkErrorMsg = `[${responseLanguage.toUpperCase()}] Failed to submit feedback. Please try again later.`;
      }
      alert(networkErrorMsg);
    }
  });

  return (
    <div class="ubi-compass">
      <style>{`
        /* Hide any potential banner elements */
        body::before,
        html::before,
        .banner,
        .page-banner,
        .title-banner,
        [class*="banner"],
        [class*="redesigned"] {
          display: none !important;
        }

        /* Ensure our component takes full viewport */
        .ubi-compass {
          position: relative !important;
          min-height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Fixed header positioning */
        .ubi-header {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 9999 !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          margin: 0 !important;
          padding: 1rem 2rem !important;
          box-sizing: border-box !important;
        }



        /* Ensure full width background for body */
        body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          display: flex !important;
          justify-content: center !important;
        }

        /* Ensure component takes full width but centers content */
        .ubi-compass {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }

        /* Center the scrollable content area */
        .ubi-content {
          width: 100% !important;
          max-width: 1000px !important;
          margin: 0 auto !important;
          padding-left: 2rem !important;
          padding-right: 2rem !important;
          padding-top: 30px !important;
          box-sizing: border-box !important;
        }

        /* Ensure consistent button heights and positioning in header */
        .ubi-header .language-selector {
          position: relative !important;
        }

        .ubi-header .language-selector .language-button {
          height: 48px !important;
          min-width: 140px !important;
          max-width: 140px !important;
          box-sizing: border-box !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          white-space: nowrap !important;
          overflow: hidden !important;
        }

        .ubi-header .language-selector .language-dropdown {
          position: absolute !important;
          top: 100% !important;
          right: 0 !important;
          margin-top: 8px !important;
          z-index: 1001 !important;
        }

        /* Ensure language name doesn't cause size changes */
        .ubi-header .language-selector .language-name {
          max-width: 80px !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }

        /* Ensure year selector dropdown appears above content */
        .ubi-header .year-selector .year-dropdown {
          z-index: 1001 !important;
        }

        /* Ensure menu dropdown appears above content */
        .ubi-header .menu-dropdown {
          z-index: 1001 !important;
        }
      `}</style>
      <div class="ubi-header">
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <h1>
              <T text="UBI Compass" />
            </h1>
            <YearSelector
              selectedYear={state.selectedYear}
              onYearChange$={handleYearChange}
            />
          </div>

          <div style="display: flex; align-items: center; gap: 1rem;">
            <LanguageSelector />

            {/* Menu Dropdown */}
            <div style="position: relative;">
              <button
                onClick$={toggleMenu}
                style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 0.5rem; color: white; cursor: pointer; font-size: 0.875rem; transition: all 0.2s; height: 48px; min-width: 100px; box-sizing: border-box;"
                onMouseOver$={(e) => {
                  (e.target as HTMLElement).style.background =
                    "rgba(255,255,255,0.3)";
                }}
                onMouseOut$={(e) => {
                  (e.target as HTMLElement).style.background =
                    "rgba(255,255,255,0.2)";
                }}
              >
                <span>☰</span>
                <T text="Menu" />
              </button>

              {isMenuOpen.value && (
                <div
                  class="menu-dropdown"
                  style="position: absolute; top: 100%; right: 0; margin-top: 0.5rem; background: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); z-index: 50; min-width: 160px;"
                >
                  <div style="padding: 0.5rem 0;">
                    <button
                      onClick$={openAbout}
                      style="display: flex; align-items: center; gap: 0.75rem; width: 100%; padding: 0.75rem 1rem; text-align: left; color: #374151; background: none; border: none; cursor: pointer; font-size: 0.875rem; transition: background-color 0.2s;"
                      onMouseOver$={(e) => {
                        (e.target as HTMLElement).style.backgroundColor =
                          "#f3f4f6";
                      }}
                      onMouseOut$={(e) => {
                        (e.target as HTMLElement).style.backgroundColor =
                          "transparent";
                      }}
                    >
                      <span>ℹ️</span>
                      <T text="About" />
                    </button>
                    <button
                      onClick$={openFeedback}
                      style="display: flex; align-items: center; gap: 0.75rem; width: 100%; padding: 0.75rem 1rem; text-align: left; color: #374151; background: none; border: none; cursor: pointer; font-size: 0.875rem; transition: background-color 0.2s;"
                      onMouseOver$={(e) => {
                        (e.target as HTMLElement).style.backgroundColor =
                          "#f3f4f6";
                      }}
                      onMouseOut$={(e) => {
                        (e.target as HTMLElement).style.backgroundColor =
                          "transparent";
                      }}
                    >
                      <span>💬</span>
                      <T text="Feedback" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with padding for fixed header */}
      <div class="ubi-content">
        {/* Age Distribution Section */}
        <div class="ubi-card">
          <h2>
            <T text="Age Distribution" />
          </h2>
          <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem;">
            <T text="Adjust the age cutoffs to define different demographic groups for UBI allocation." />
          </p>

          <AgeDistributionControl
            initialChildAgeCutoff={state.ageCutoffs.child}
            initialYouthAgeCutoff={state.ageCutoffs.youth}
            initialSeniorAgeCutoff={state.ageCutoffs.senior}
            year={state.selectedYear}
            showPopulationChart={true}
            onAgeChange$={(values: [number, number, number]) => {
              console.log("🔄 UBI Compass: Age change received:", values);
              console.log(
                "🔄 UBI Compass: Updating context with senior age:",
                values[2]
              );
              actions.updateAgeCutoffs({
                child: values[0],
                youth: values[1],
                senior: values[2],
              });
            }}
            onPopulationDataChange$={(populationData: any) => {
              actions.updatePopulationData(populationData);
            }}
            onConstraintsChange$={(constraints: any) => {
              ageConstraints.childLocked = constraints.childLocked;
              ageConstraints.youthLocked = constraints.youthLocked;
              ageConstraints.adultLocked = constraints.adultLocked;
              ageConstraints.seniorLocked = constraints.seniorLocked;
              console.log("Age constraints updated:", constraints);
            }}
          />
        </div>

        {/* UBI Amounts Section */}
        <div class="ubi-card">
          <h2>
            <T text="UBI Amounts" />
          </h2>
          <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem;">
            <T text="Set monthly UBI amounts for each age group. Amounts must follow: Child ≤ Youth ≤ Adult ≤ Senior" />
          </p>
          <UbiAmountsControl
            initialChildUbi={state.ubiAmounts.child}
            initialYouthUbi={state.ubiAmounts.youth}
            initialAdultUbi={state.ubiAmounts.adult}
            initialSeniorUbi={state.ubiAmounts.senior}
            childPopulation={state.populationData.childPopulation || 5000000}
            youthPopulation={state.populationData.youthPopulation || 3000000}
            adultPopulation={state.populationData.adultPopulation || 15000000}
            seniorPopulation={state.populationData.seniorPopulation || 7000000}
            initialFlatTaxRate={state.taxParameters.flatTaxRate}
            initialTaxExemption={state.taxParameters.taxExemption}
            programSavings={
              state.replacementAnalysis.programSavings || 50000000000
            }
            totalCurrentSpending={
              state.replacementAnalysis.totalCurrentSpending || 150000000000
            }
            showPieCharts={true}
            showTaxControls={true}
            showMonthlyAndAnnual={true}
            onUbiAmountsChange$={(amounts: any) => {
              actions.updateUbiAmounts({
                child: amounts.child,
                youth: amounts.youth,
                adult: amounts.adult,
                senior: amounts.senior,
              });
            }}
            onTaxParametersChange$={(params: any) => {
              actions.updateTaxParameters({
                flatTaxRate: params.flatTaxRate,
                taxExemption: params.taxExemption,
              });
            }}
            onUbiConstraintsChange$={(constraints: any) => {
              console.log("🎯 UBI COMPASS RECEIVED CONSTRAINTS:", constraints);
              ubiConstraints.childLocked = constraints.childLocked;
              ubiConstraints.youthLocked = constraints.youthLocked;
              ubiConstraints.adultLocked = constraints.adultLocked;
              ubiConstraints.seniorLocked = constraints.seniorLocked;
              console.log("🎯 UBI COMPASS UPDATED STATE:", ubiConstraints);
            }}
            onTaxConstraintsChange$={(constraints: any) => {
              console.log("🎯 TAX COMPASS RECEIVED CONSTRAINTS:", constraints);
              taxConstraints.flatTaxRateLocked = constraints.flatTaxRateLocked;
              taxConstraints.taxExemptionLocked =
                constraints.taxExemptionLocked;
              console.log("🎯 TAX COMPASS UPDATED STATE:", taxConstraints);
            }}
          />
        </div>

        {/* Government Spending Analysis Section */}
        <div class="ubi-card">
          <h2>
            <T text="Government Spending Analysis" />
          </h2>
          <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem;">
            <T text="Analyze current government spending and potential UBI program replacements." />
          </p>

          <GovernmentSpendingControl
            year={state.selectedYear}
            ubiCostAnnual={results.totalUbiCost}
            taxRevenue={results.totalTaxRevenue}
            showReplacementControls={true}
            onReplacementAnalysisChange$={(analysis: any) => {
              actions.updateReplacementAnalysis(analysis);
            }}
          />
        </div>

        {/* UBI Optimizer Section */}
        <div class="ubi-card">
          <h2>
            <T text="UBI Optimizer" />
          </h2>
          <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem;">
            <T text="Use genetic algorithms to find optimal UBI parameters for different objectives." />
          </p>

          <UbiOptimizer
            ageConstraints={ageConstraints}
            ubiConstraints={ubiConstraints}
            taxConstraints={taxConstraints}
            onOptimizationComplete$={(result) => {
              // Optimization completed
            }}
          />
        </div>

        {/* Buy Me a Coffee Section */}
        <div
          class="ubi-card"
          style="border: 2px solid #8b5cf6; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); text-align: center; padding: 1.5rem;"
        >
          <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1rem;">
            <span style="font-size: 1.5rem;">☕</span>
            <h3 style="margin: 0; color: #374151; font-size: 1.1rem; font-weight: 600;">
              Buy me a coffee
            </h3>
          </div>
          <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 1.25rem; line-height: 1.5;">
            UBI Compass is free and open-source. If you find it helpful for
            understanding Universal Basic Income, consider supporting its
            development and maintenance.
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <a
              href="https://buymeacoffee.com/ubicompass"
              target="_blank"
              rel="noopener noreferrer"
              style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.25rem; background: #FFDD00; color: #000000; text-decoration: none; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; transition: all 0.2s; box-shadow: 0 2px 4px rgba(255, 221, 0, 0.2);"
              onMouseOver$={(e) => {
                (e.target as HTMLElement).style.background = "#FFD700";
                (e.target as HTMLElement).style.transform = "translateY(-1px)";
                (e.target as HTMLElement).style.boxShadow =
                  "0 4px 8px rgba(255, 221, 0, 0.3)";
              }}
              onMouseOut$={(e) => {
                (e.target as HTMLElement).style.background = "#FFDD00";
                (e.target as HTMLElement).style.transform = "translateY(0)";
                (e.target as HTMLElement).style.boxShadow =
                  "0 2px 4px rgba(255, 221, 0, 0.2)";
              }}
            >
              <span>☕</span>
              <span>Buy Me A Coffee</span>
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 0.75rem; margin-top: 1rem; margin-bottom: 0;">
            Every contribution helps maintain and improve this tool for
            everyone.
          </p>
        </div>

        {/* Debug Card - Hidden by default */}
        {SHOW_DEBUG && (
          <div
            class="ubi-card"
            style="border: 2px solid #f59e0b; background: #fffbeb;"
          >
            <h2 style="color: #f59e0b;">🐛 Debug Info (Development)</h2>

            {/* Language Selector Debug */}
            <div style="margin-bottom: 1rem; padding: 1rem; background: #fef3c7; border-radius: 0.5rem;">
              <h3 style="color: #92400e; margin-bottom: 0.5rem;">
                🏁 Language Selector Debug
              </h3>
              <div style="font-family: monospace; font-size: 0.75rem;">
                <div>
                  <strong>Current Language:</strong>{" "}
                  {translationState.currentLanguage}
                </div>
                <div>
                  <strong>Is Translating:</strong>{" "}
                  {translationState.isTranslating ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Translation Progress:</strong>{" "}
                  {translationState.translationProgress}%
                </div>
                <div>
                  <strong>Available Translations:</strong>{" "}
                  {Object.keys(translationState.translations).length} items
                </div>
                <div>
                  <strong>Sample Translations:</strong>
                </div>
                <ul style="margin-left: 1rem; font-size: 0.7rem;">
                  <li>
                    "English" → "
                    {translationState.translations["English"] ||
                      "Not translated"}
                    "
                  </li>
                  <li>
                    "Français" → "
                    {translationState.translations["Français"] ||
                      "Not translated"}
                    "
                  </li>
                  <li>
                    "GST/HST Credit" → "
                    {translationState.translations["GST/HST Credit"] ||
                      "Not translated"}
                    "
                  </li>
                </ul>

                {/* Language Selector Component Debug */}
                <div style="margin-top: 1rem; padding: 0.5rem; background: #fde68a; border-radius: 0.25rem;">
                  <strong>🏁 Language Selector Component Status:</strong>
                  <div style="font-size: 0.7rem; margin-top: 0.25rem;">
                    <div>
                      Header contains language selector:{" "}
                      {languageSelectorDebug.componentExists ? "Yes" : "No"}
                    </div>
                    <div>
                      Language button visible:{" "}
                      {languageSelectorDebug.buttonExists ? "Yes" : "No"}
                    </div>
                    <div>
                      Flag element exists:{" "}
                      {languageSelectorDebug.flagExists ? "Yes" : "No"}
                    </div>
                    <div>
                      Flag content: "{languageSelectorDebug.flagContent}"
                    </div>
                    <div>
                      Language name: "{languageSelectorDebug.languageName}"
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; font-family: monospace; font-size: 0.875rem;">
              <div>
                <h4 style="margin-bottom: 0.5rem; color: #374151;">
                  UBI Constraints:
                </h4>
                <div style="background: #f3f4f6; padding: 0.75rem; border-radius: 0.5rem;">
                  <div>
                    childLocked:{" "}
                    <strong style="color: {ubiConstraints.childLocked ? '#dc2626' : '#16a34a'}">
                      {ubiConstraints.childLocked ? "true" : "false"}
                    </strong>
                  </div>
                  <div>
                    youthLocked:{" "}
                    <strong style="color: {ubiConstraints.youthLocked ? '#dc2626' : '#16a34a'}">
                      {ubiConstraints.youthLocked ? "true" : "false"}
                    </strong>
                  </div>
                  <div>
                    adultLocked:{" "}
                    <strong style="color: {ubiConstraints.adultLocked ? '#dc2626' : '#16a34a'}">
                      {ubiConstraints.adultLocked ? "true" : "false"}
                    </strong>
                  </div>
                  <div>
                    seniorLocked:{" "}
                    <strong style="color: {ubiConstraints.seniorLocked ? '#dc2626' : '#16a34a'}">
                      {ubiConstraints.seniorLocked ? "true" : "false"}
                    </strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 style="margin-bottom: 0.5rem; color: #374151;">
                  Tax Constraints:
                </h4>
                <div style="background: #f3f4f6; padding: 0.75rem; border-radius: 0.5rem;">
                  <div>
                    flatTaxRateLocked:{" "}
                    <strong style="color: {taxConstraints.flatTaxRateLocked ? '#dc2626' : '#16a34a'}">
                      {taxConstraints.flatTaxRateLocked ? "true" : "false"}
                    </strong>
                  </div>
                  <div>
                    taxExemptionLocked:{" "}
                    <strong style="color: {taxConstraints.taxExemptionLocked ? '#dc2626' : '#16a34a'}">
                      {taxConstraints.taxExemptionLocked ? "true" : "false"}
                    </strong>
                  </div>
                </div>
              </div>

              <div>
                <h4 style="margin-bottom: 0.5rem; color: #374151;">
                  Current Values:
                </h4>
                <div style="background: #f3f4f6; padding: 0.75rem; border-radius: 0.5rem;">
                  <div>
                    Child: <strong>${state.ubiAmounts.child}</strong>
                  </div>
                  <div>
                    Youth: <strong>${state.ubiAmounts.youth}</strong>
                  </div>
                  <div>
                    Adult: <strong>${state.ubiAmounts.adult}</strong>
                  </div>
                  <div>
                    Senior: <strong>${state.ubiAmounts.senior}</strong>
                  </div>
                  <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #d1d5db;">
                    Tax Rate:{" "}
                    <strong>{state.taxParameters.flatTaxRate}%</strong>
                  </div>
                  <div>
                    Tax Exemption:{" "}
                    <strong>${state.taxParameters.taxExemption}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div style="margin-top: 1rem;">
              <h4 style="margin-bottom: 0.5rem; color: #374151;">
                Expected Behavior:
              </h4>
              <div style="background: #f3f4f6; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.8rem;">
                When genetic algorithm runs, locked values should stay the same,
                unlocked values should change.
              </div>
            </div>
          </div>
        )}

        {/* Results Dashboard Section */}
        <div class="ubi-card">
          <h2>
            <T text="Results Dashboard" />
          </h2>
          <p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem;">
            <T text="Comprehensive analysis of UBI feasibility and fiscal impact." />
          </p>

          <ResultsDashboard />
        </div>
      </div>
    </div>
  );
});

// Main component with providers
export const UbiCompassRedesigned = component$(() => {
  return (
    <TranslationProvider>
      <UbiCompassProvider>
        <UbiCompassContent />
      </UbiCompassProvider>
    </TranslationProvider>
  );
});
