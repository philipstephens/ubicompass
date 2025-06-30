/**
 * Translation Context for UBI Compass
 * Provides translation functionality across all components
 */
import {
  createContextId,
  useContext,
  useContextProvider,
  useStore,
  useTask$,
  $,
  component$,
  Slot,
} from "@builder.io/qwik";
import { TranslationService } from "../services/translation-service";
import {
  getHashTableTranslation,
  getSupportedHashTableLanguages,
  isLanguageFullySupported,
} from "../data/translation-tables";

export interface TranslationState {
  currentLanguage: string;
  isTranslating: boolean;
  translationProgress: number;
  translations: { [key: string]: string };
  supportedLanguages: { [code: string]: string };
  isRTL: boolean;
}

export interface TranslationActions {
  translate: (text: string) => string;
  switchLanguage: (language: string) => Promise<void>;
  formatNumber: (number: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatPercentage: (value: number, decimals?: number) => string;
}

export interface TranslationContext {
  state: TranslationState;
  actions: TranslationActions;
}

// Create context
export const TranslationContextId = createContextId<TranslationContext>(
  "translation-context"
);

// RTL languages
const RTL_LANGUAGES = ["ar", "he", "fa", "ur"];

// Default state with base English translations
const createDefaultState = (): TranslationState => {
  // Initialize with English base translations
  const baseTranslations: { [key: string]: string } = {};

  // Add all the translatable texts as English base
  const translatableTexts = [
    "English",
    "Français",
    "GST/HST Credit",
    "Old Age Security",
    "Canada Child Benefit",
    "Employment Insurance",
    "High Accuracy",
    "Good Accuracy",
    "Moderate Accuracy",
    "Limited Accuracy",
    "Based on official government data",
    "Estimated from recent data trends",
    "Historical estimates - some programs may differ",
    "Rough approximation - significant differences likely",
    "Report Issue",
  ];

  // For English, translations are the same as the original text
  translatableTexts.forEach((text) => {
    baseTranslations[text] = text;
  });

  return {
    currentLanguage: "en",
    isTranslating: false,
    translationProgress: 0,
    translations: baseTranslations,
    supportedLanguages: {
      en: "English",
      fr: "Français",
      es: "Español",
      de: "Deutsch",
      it: "Italiano",
      pt: "Português",
      ru: "Русский",
      ja: "日本語",
      ko: "한국어",
      zh: "中文",
      ar: "العربية",
      hi: "हिन्दी",
      tr: "Türkçe",
      pl: "Polski",
      nl: "Nederlands",
      sv: "Svenska",
      da: "Dansk",
      no: "Norsk",
      fi: "Suomi",
      cs: "Čeština",
    },
    isRTL: false,
  };
};

// Provider component
export const TranslationProvider = component$(() => {
  const state = useStore<TranslationState>(createDefaultState());

  // Initialize with browser language (client-side only)
  useTask$(async () => {
    // Only run on client-side
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      const browserLang = navigator.language?.split("-")[0] || "en";
      if (state.supportedLanguages[browserLang]) {
        state.currentLanguage = browserLang;
        state.isRTL = RTL_LANGUAGES.includes(browserLang);

        // Set document direction
        if (typeof document !== "undefined") {
          document.documentElement.dir = state.isRTL ? "rtl" : "ltr";
          document.documentElement.lang = browserLang;
        }
      }
    }
  });

  // Helper functions (defined outside actions to avoid circular references)
  const formatNumberHelper = $(
    (number: number, options?: Intl.NumberFormatOptions): string => {
      try {
        return new Intl.NumberFormat(state.currentLanguage, options).format(
          number
        );
      } catch (error) {
        return new Intl.NumberFormat("en", options).format(number);
      }
    }
  );

  // Create actions
  const actions: TranslationActions = {
    translate: $((text: string): string => {
      // For English, return original text
      if (state.currentLanguage === "en") {
        return text;
      }

      // First, try hash table lookup (instant)
      const hashTableTranslation = getHashTableTranslation(
        text,
        state.currentLanguage
      );
      if (hashTableTranslation) {
        return hashTableTranslation;
      }

      // Second, try cached translation from previous API calls
      if (state.translations[text]) {
        return state.translations[text];
      }

      // Fallback: return original text
      return text;
    }),

    switchLanguage: $(async (language: string): Promise<void> => {
      if (language === state.currentLanguage) return;

      state.isTranslating = true;
      state.translationProgress = 0;

      try {
        console.log(`🌐 Switching to language: ${language}`);

        // Check if we have cached translations for this language
        const cacheKey = `ubi-translations-${language}`;
        let cachedTranslations: { [key: string]: string } = {};

        if (typeof localStorage !== "undefined") {
          try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
              cachedTranslations = JSON.parse(cached);
              console.log(
                `📦 Loaded ${Object.keys(cachedTranslations).length} cached translations for ${language}`
              );
            }
          } catch (error) {
            console.warn("Failed to load cached translations:", error);
          }
        }

        // Get translatable texts
        const translatableTexts = [
          "UBI Compass",
          "Year",
          "Age Distribution",
          "Adjust the age cutoffs to define different demographic groups for UBI allocation.",
          "UBI Amounts",
          "Set monthly UBI amounts for each age group. Amounts must follow: Child ≤ Youth ≤ Adult ≤ Senior",
          "Government Spending Analysis",
          "Analyze current government spending and potential UBI program replacements.",
          "UBI Optimizer",
          "Use genetic algorithms to find optimal UBI parameters for different objectives.",
          "Results Dashboard",
          "Comprehensive analysis of UBI feasibility and fiscal impact.",
          "Children",
          "Youth",
          "Adults",
          "Seniors",
          "Child Max",
          "Youth Max",
          "Senior Min",
          "Child UBI",
          "Youth UBI",
          "Adult UBI",
          "Senior UBI",
          "UBI Cost Before Tax",
          "Before/After Program Replacement",
          "Before Program Replacement",
          "After Program Replacement",
          "UBI Cost:",
          "Tax Revenue:",
          "Net Cost:",
          "Program Savings:",
          "Program Replacement Impact",
          "Total Savings:",
          "Cost Reduction:",
          "Funding Status:",
          "Funded",
          "Fully Self-Funded",
          "Additional funding needed",
          "Surplus available",
          "Tax Parameters",
          "Flat Tax Rate:",
          "Tax Exemption:",
          "/month",
          "/year",
          "Government Spending Summary",
          "Loading spending data...",
          "Failed to load spending data",
          "Federal Total",
          "Federal Social Programs",
          "Provincial Total",
          "Federal Spending Breakdown",
          "UBI Program Replacement",
          "Adjust what percentage of each program would be replaced by UBI",
          "recipients",
          "UBI Replaceable",
          "Net UBI Cost",
          "Funding Status",
          "Population Impact",
          "UBI Amounts",
          "Old Age Security",
          "Canada Child Benefit",
          "Employment Insurance",
          "Social Assistance",
          "Guaranteed Income Supplement",
          "Ontario Works",
          "Canada Pension Plan",
          "Social Protection (UBI Replaceable)",
          "Health",
          "Education",
          "Total Government Spending",
          "Old Age Security (UBI Replaceable)",
          "Debt Service",
          "Canada Child Benefit (UBI Replaceable)",
          "Defense",
          "Employment Insurance (UBI Replaceable)",
          "Canada Pension Plan (UBI Replaceable)",
          "Guaranteed Income Supplement (UBI Replaceable)",
          "UBI Optimizer",
          "Use genetic algorithms to find optimal UBI parameters",
          "Maximize Benefits",
          "Highest possible UBI amounts while maintaining feasibility",
          "Minimize Taxes",
          "Lowest tax rates while funding adequate UBI",
          "Fiscal Balance",
          "Balanced budget with minimal net cost",
          "Political Feasible",
          "Realistic parameters likely to gain political support",
          "Start Optimization",
          "Optimizing...",
          "Optimization Results",
          "Tip:",
          "Not satisfied with these results? Try running the optimization again for different solutions, or adjust your locked parameters and constraints to guide the algorithm toward your preferred outcomes.",
          "Menu",
          "About",
          "Feedback",
          "Data Unavailable",
          "Government spending data is not available for",
          "Showing estimated data based on historical trends. Some features may be limited.",
          "No Replacement Data",
          "Detailed program replacement data is not available for",
          "General spending analysis is shown above using estimated data.",
          "High Accuracy",
          "Good Accuracy",
          "Moderate Accuracy",
          "Limited Accuracy",
          "Based on official government data",
          "Estimated from recent data trends",
          "Historical estimates - some programs may differ",
          "Rough approximation - significant differences likely",
          "Report Issue",
          "GST/HST Credit",
          "GST Credit",
          "Old Age Security",
          "Canada Child Benefit",
          "Universal Child Care Benefit",
          "Child Tax Benefit",
          "Employment Insurance",
          "English",
          "Français",
          "Español",
          "Deutsch",
          "Report data accuracy issue for",
          "Data accuracy feedback for",
          "Please describe any specific issues you've noticed:",
          "Thank you for your feedback about",
          "data accuracy! Your input helps us improve our historical estimates.",
          "Feedback ID:",
          "Error submitting feedback:",
          "Please try again later.",
          "Failed to submit feedback. Please try again later.",
          "Fitness Score",
          "Adult UBI",
          "Tax Rate",
          "Net Cost",
          "GDP Impact",
          "Feasible",
          "Apply to UBI Compass",
          "Additional funding needed",
          "Annual surplus",
          "Total UBI Cost",
          "Tax Revenue",
          "Program Savings",
          "Of UBI cost is covered by taxes and program savings",
          "Tax Coverage",
          "Total population receiving UBI",
          "Children",
          "Youth",
          "Adults",
          "Seniors",
          "Adult UBI amount (primary rate)",
          "Child UBI",
          "Youth UBI",
          "Adult UBI",
          "Senior UBI",
          "UBI is fully self-funded!",
          "UBI is mostly funded but needs additional revenue",
          "UBI requires significant additional funding",
          "Feasible",
          "Challenging",
          "Unfeasible",
          "years",
          "Constraint",
          "Population Chart",
          "Loading population data...",
          "Failed to load population data",
          "Using fallback data",
          "Loading...",
          "Error",
          "Success",
          "Total UBI Cost",
          "Tax Revenue",
          "Program Savings",
          "Net Cost",
          "Feasible",
          "Challenging",
          "Unfeasible",
        ];

        // Smart translation: Hash Tables → Cache → Google Translate API
        const translations: { [key: string]: string } = {
          ...cachedTranslations,
        };
        const textsToTranslate: string[] = [];
        let hashTableHits = 0;

        // Identify which texts need translation
        for (const text of translatableTexts) {
          if (language === "en") {
            translations[text] = text;
          } else {
            // First, try hash table lookup
            const hashTableTranslation = getHashTableTranslation(
              text,
              language
            );
            if (hashTableTranslation) {
              translations[text] = hashTableTranslation;
              hashTableHits++;
            } else if (!cachedTranslations[text]) {
              // Only add to API translation queue if not in hash table or cache
              textsToTranslate.push(text);
            }
          }
        }

        console.log(
          `📚 Hash table provided ${hashTableHits} instant translations for ${language}`
        );
        console.log(
          `💾 Cache provided ${Object.keys(cachedTranslations).length} cached translations`
        );
        console.log(
          `🔄 Need to translate ${textsToTranslate.length} new texts via API`
        );

        // Translate only missing texts
        for (let i = 0; i < textsToTranslate.length; i++) {
          const text = textsToTranslate[i];

          // Update progress
          state.translationProgress = ((i + 1) / textsToTranslate.length) * 100;

          try {
            // Call the translation API
            const response = await fetch("/api/translate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                text: text,
                targetLanguage: language,
                sourceLanguage: "en",
              }),
            });

            const result = await response.json();

            if (result.success) {
              translations[text] = result.translatedText;
              console.log(
                `✅ Translated: "${text}" → "${result.translatedText}"`
              );
            } else {
              console.warn(`Translation failed for "${text}":`, result.error);
              // Fallback to prefixed text if API fails
              translations[text] = `[${language.toUpperCase()}] ${text}`;
            }
          } catch (error) {
            console.error(`Translation error for "${text}":`, error);
            // Fallback to prefixed text if API fails
            translations[text] = `[${language.toUpperCase()}] ${text}`;
          }

          // Small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Update translations
        state.translations = translations;

        // Debug: Log translations being set
        console.log(`🔄 Translations updated for ${language}:`, {
          translationsCount: Object.keys(translations).length,
          sampleTranslations: Object.entries(translations).slice(0, 3),
          allTranslations: translations,
        });

        // Update state
        state.currentLanguage = language;
        state.isRTL = RTL_LANGUAGES.includes(language);

        // Update document (client-side only)
        if (typeof document !== "undefined") {
          document.documentElement.dir = state.isRTL ? "rtl" : "ltr";
          document.documentElement.lang = language;
        }

        console.log(`✅ Language switched to: ${language}`);
      } catch (error) {
        console.error("❌ Language switch failed:", error);
        throw error;
      } finally {
        state.isTranslating = false;
        state.translationProgress = 100;
      }
    }),

    formatNumber: formatNumberHelper,

    formatCurrency: $((amount: number, currency: string = "CAD"): string => {
      try {
        return new Intl.NumberFormat(state.currentLanguage, {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
      } catch (error) {
        return `$${formatNumberHelper(amount)}`;
      }
    }),

    formatPercentage: $((value: number, decimals: number = 1): string => {
      try {
        return new Intl.NumberFormat(state.currentLanguage, {
          style: "percent",
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(value / 100);
      } catch (error) {
        return `${value.toFixed(decimals)}%`;
      }
    }),
  };

  // Provide context
  useContextProvider(TranslationContextId, { state, actions });

  return <Slot />;
});

// Hook to use the context
export const useTranslationContext = () => {
  const context = useContext(TranslationContextId);
  if (!context) {
    throw new Error(
      "useTranslationContext must be used within TranslationProvider"
    );
  }
  return context;
};

// Convenience hooks
export const useTranslation = () => {
  const { actions } = useTranslationContext();
  return actions.translate;
};

export const useTranslationState = () => {
  const { state } = useTranslationContext();
  return state;
};

export const useTranslationActions = () => {
  const { actions } = useTranslationContext();
  return actions;
};

// Translation helper component
export const T = component$<{ text: string; fallback?: string }>((props) => {
  const { state } = useTranslationContext();

  // Get translation directly from state to ensure reactivity
  const translatedText =
    state.translations[props.text] || props.fallback || props.text;

  return <span>{translatedText}</span>;
});

// Number formatting components
export const FormatNumber = component$<{
  value: number;
  options?: Intl.NumberFormatOptions;
}>((props) => {
  const { actions } = useTranslationContext();
  const formatted = actions.formatNumber(props.value, props.options);

  return <span>{formatted}</span>;
});

export const FormatCurrency = component$<{
  amount: number;
  currency?: string;
  suffix?: string;
}>((props) => {
  const { actions } = useTranslationContext();

  // Handle large numbers with suffixes (B, M, K)
  let displayAmount = props.amount;
  let suffix = props.suffix || "";

  if (!suffix) {
    if (Math.abs(props.amount) >= 1000000000) {
      displayAmount = props.amount / 1000000000;
      suffix = "B";
    } else if (Math.abs(props.amount) >= 1000000) {
      displayAmount = props.amount / 1000000;
      suffix = "M";
    } else if (Math.abs(props.amount) >= 1000) {
      displayAmount = props.amount / 1000;
      suffix = "K";
    }
  }

  const formatted = actions.formatCurrency(displayAmount, props.currency);

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  );
});

export const FormatPercentage = component$<{
  value: number;
  decimals?: number;
}>((props) => {
  const { actions } = useTranslationContext();
  const formatted = actions.formatPercentage(props.value, props.decimals);

  return <span>{formatted}</span>;
});

// Estimation indicator component (uses symbol instead of text for multilingual support)
export const EstimationIndicator = component$(() => {
  return <span title="Estimated value">~</span>;
});
