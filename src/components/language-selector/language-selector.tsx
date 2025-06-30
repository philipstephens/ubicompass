/**
 * Language Selector Component
 * Provides language selection and automatic translation for UBI Compass
 */
import {
  component$,
  useSignal,
  useStore,
  $,
  useStylesScoped$,
  useTask$,
} from "@builder.io/qwik";
import {
  useTranslationActions,
  useTranslationState,
} from "../../contexts/translation-context";

export interface LanguageSelectorProps {
  className?: string;
  onLanguageChange$?: (language: string) => void;
  showProgress?: boolean;
}

export const LanguageSelector = component$<LanguageSelectorProps>((props) => {
  useStylesScoped$(`
    .language-selector {
      position: relative;
      display: inline-block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Force reset any inherited styles */
    .language-selector * {
      box-sizing: border-box;
    }

    .language-selector .language-dropdown * {
      color: inherit !important;
      opacity: 1 !important;
      visibility: visible !important;
    }

    .language-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: 2px solid transparent;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 140px;
      justify-content: space-between;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.25);
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }

    .language-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .language-button:hover::before {
      left: 100%;
    }

    .language-button:hover {
      background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .language-button:active {
      transform: translateY(0);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.25);
    }

    .language-button.loading {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      cursor: not-allowed;
      animation: translatePulse 1.5s ease-in-out infinite;
      position: relative;
      overflow: hidden;
    }

    .language-button.loading::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: translateShimmer 2s infinite;
    }

    @keyframes translatePulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
      }
      50% {
        transform: scale(1.02);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
      }
    }

    @keyframes translateShimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }

    .language-flag {
      font-size: 1.3rem;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
    }

    .language-name {
      flex: 1;
      text-align: left;
      font-weight: 600;
      letter-spacing: 0.025em;
    }

    .dropdown-arrow {
      font-size: 0.8rem;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0.8;
    }

    .dropdown-arrow.open {
      transform: rotate(180deg);
    }

    .language-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06);
      z-index: 1000;
      max-height: 320px;
      overflow-y: auto;
      margin-top: 8px;
      min-width: 220px;
      color: #000000 !important;
      animation: dropdownSlide 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: top;
    }

    @keyframes dropdownSlide {
      from {
        opacity: 0;
        transform: translateY(-10px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .language-option {
      padding: 14px 18px !important;
      cursor: pointer !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex !important;
      align-items: center !important;
      gap: 12px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      color: #1f2937 !important;
      background: transparent !important;
      opacity: 1 !important;
      visibility: visible !important;
      position: relative;
      margin: 0 6px;
      border-radius: 10px;
      border-bottom: none;
    }

    .language-option:last-child {
      border-bottom: none;
    }

    .language-option::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      opacity: 0;
      border-radius: 10px;
      transition: opacity 0.3s ease;
      z-index: -1;
    }

    .language-option:hover::before {
      opacity: 0.1;
    }

    .language-option:hover {
      background: transparent !important;
      color: #1f2937 !important;
      transform: translateX(4px);
    }

    .language-option:hover .language-option-name {
      color: #1f2937 !important;
    }

    .language-option:hover .language-option-code {
      color: #4b5563 !important;
    }

    .language-option.selected {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%) !important;
      color: #667eea !important;
      font-weight: 600;
      border: 1px solid rgba(102, 126, 234, 0.2);
    }

    .language-option.selected::before {
      opacity: 0.15;
    }

    .language-option.selected .language-option-name {
      color: #667eea !important;
      font-weight: 600;
    }

    .language-option.selected .language-option-code {
      color: #764ba2 !important;
      font-weight: 500;
    }

    .language-option-flag {
      font-size: 1.4rem;
      filter: drop-shadow(0 1px 3px rgba(0,0,0,0.1));
      transition: transform 0.3s ease;
    }

    .language-option:hover .language-option-flag {
      transform: scale(1.1);
    }

    .language-option-name {
      flex: 1 !important;
      color: #1f2937 !important;
      font-weight: 500 !important;
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
      font-size: 0.95rem;
      letter-spacing: 0.025em;
    }

    .language-option-code {
      font-size: 0.75rem !important;
      color: #6b7280 !important;
      text-transform: uppercase !important;
      font-weight: 600 !important;
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
      background: rgba(107, 114, 128, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
      letter-spacing: 0.05em;
    }

    .progress-section {
      margin-top: 8px;
      padding: 16px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
      animation: progressFadeIn 0.3s ease-out;
    }

    @keyframes progressFadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .progress-bar {
      width: 100%;
      height: 10px;
      background: rgba(229, 231, 235, 0.8);
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 12px;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
      position: relative;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669, #047857);
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 8px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(16, 185, 129, 0.4);
    }

    .progress-fill::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    .progress-text {
      font-size: 0.85rem;
      color: #374151;
      text-align: center;
      font-weight: 600;
      letter-spacing: 0.025em;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .progress-text::before {
      content: '🌐';
      animation: progressSpin 2s linear infinite;
    }

    @keyframes progressSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Ensure text is visible in loading state */
    .language-button.loading .language-name {
      color: #ffffff !important;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      font-weight: 600;
    }

    .language-button.loading .language-flag,
    .language-button.loading .dropdown-arrow {
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
    }

    .translation-status {
      margin-top: 0.5rem;
      padding: 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      text-align: center;
    }

    .translation-status.success {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }

    .translation-status.error {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
  `);

  const { className = "", showProgress = true } = props;

  // Translation context
  const translationState = useTranslationState();
  const translationActions = useTranslationActions();

  // Component state
  const isOpen = useSignal(false);
  const translationStatus = useSignal<"idle" | "success" | "error">("idle");

  // Available languages with text flags and names (Canadian context)
  const languages = useStore({
    en: { name: "English", flag: "🇬🇧" }, // UK flag for English (British flag for Canadians)
    fr: { name: "Français", flag: "🇫🇷" }, // France flag for French
    es: { name: "Español", flag: "🇪🇸" },
    de: { name: "Deutsch", flag: "🇩🇪" },
    it: { name: "Italiano", flag: "🇮🇹" },
    pt: { name: "Português", flag: "🇵🇹" },
    ru: { name: "Русский", flag: "🇷🇺" },
    ja: { name: "日本語", flag: "🇯🇵" },
    ko: { name: "한국어", flag: "🇰🇷" },
    zh: { name: "中文", flag: "🇨🇳" },
    ar: { name: "العربية", flag: "🇸🇦" },
    hi: { name: "हिन्दी", flag: "🇮🇳" },
    tr: { name: "Türkçe", flag: "🇹🇷" },
    pl: { name: "Polski", flag: "🇵🇱" },
    nl: { name: "Nederlands", flag: "🇳🇱" },
    sv: { name: "Svenska", flag: "🇸🇪" },
    da: { name: "Dansk", flag: "🇩🇰" },
    no: { name: "Norsk", flag: "🇳🇴" },
    fi: { name: "Suomi", flag: "🇫🇮" },
    cs: { name: "Čeština", flag: "🇨🇿" },
  });

  // Handle language selection
  const selectLanguage = $(async (languageCode: string) => {
    if (languageCode === translationState.currentLanguage) {
      isOpen.value = false;
      return;
    }

    isOpen.value = false;
    translationStatus.value = "idle";

    try {
      // Switch language using translation context
      await translationActions.switchLanguage(languageCode);

      translationStatus.value = "success";

      // Trigger callback
      if (props.onLanguageChange$) {
        props.onLanguageChange$(languageCode);
      }
    } catch (error) {
      console.error("Language switch failed:", error);
      translationStatus.value = "error";
    } finally {
      // Clear status after delay
      setTimeout(() => {
        translationStatus.value = "idle";
      }, 3000);
    }
  });

  // Toggle dropdown
  const toggleDropdown = $(() => {
    if (!translationState.isTranslating) {
      isOpen.value = !isOpen.value;
    }
  });

  // Close dropdown when clicking outside (client-side only)
  useTask$(({ cleanup }) => {
    // Only run on client-side
    if (typeof document !== "undefined") {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest(".language-selector")) {
          isOpen.value = false;
        }
      };

      document.addEventListener("click", handleClickOutside);
      cleanup(() => document.removeEventListener("click", handleClickOutside));
    }
  });

  const currentLang =
    languages[translationState.currentLanguage as keyof typeof languages];

  // Debug logging to see what's happening
  console.log("🏁 Language Selector Debug:", {
    currentLanguage: translationState.currentLanguage,
    currentLang: currentLang,
    availableLanguages: Object.keys(languages),
    languagesObject: languages,
  });

  // Force a fallback if currentLang is undefined
  const displayLang = currentLang || {
    name: translationState.currentLanguage.toUpperCase(),
    flag: "🌐",
  };

  return (
    <div class={`language-selector ${className}`}>
      <button
        class={`language-button ${translationState.isTranslating ? "loading" : ""}`}
        onClick$={toggleDropdown}
        disabled={translationState.isTranslating}
      >
        <span class="language-flag">
          {translationState.isTranslating ? "🔄" : displayLang.flag}
        </span>
        <span class="language-name">
          {translationState.isTranslating ? "Translating..." : displayLang.name}
        </span>
        <span class={`dropdown-arrow ${isOpen.value ? "open" : ""}`}>
          {translationState.isTranslating ? "⏳" : "▼"}
        </span>
      </button>

      {isOpen.value && !translationState.isTranslating && (
        <div class="language-dropdown">
          {Object.entries(languages).map(([code, lang]) => (
            <div
              key={code}
              class={`language-option ${code === translationState.currentLanguage ? "selected" : ""}`}
              onClick$={() => selectLanguage(code)}
            >
              <span class="language-option-flag">{lang.flag}</span>
              <span class="language-option-name">{lang.name}</span>
              <span class="language-option-code">{code}</span>
            </div>
          ))}
        </div>
      )}

      {/* Translation Progress */}
      {translationState.isTranslating && showProgress && (
        <div class="progress-section">
          <div class="progress-bar">
            <div
              class="progress-fill"
              style={`width: ${translationState.translationProgress}%`}
            ></div>
          </div>
          <div class="progress-text">
            Translating interface...{" "}
            {translationState.translationProgress.toFixed(0)}%
          </div>
        </div>
      )}

      {/* Translation Status */}
      {translationStatus.value !== "idle" && (
        <div class={`translation-status ${translationStatus.value}`}>
          {translationStatus.value === "success" && "✅ Translation complete!"}
          {translationStatus.value === "error" &&
            "❌ Translation failed. Using fallback."}
        </div>
      )}
    </div>
  );
});
