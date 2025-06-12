import { component$, useContext } from "@builder.io/qwik";
import { TranslationContext } from "../stores/translation-store";
import { getAvailableLanguages } from "../services/translation-service";

/**
 * Language Selector Component
 * Allows users to select their preferred language
 */
export const LanguageSelector = component$(() => {
  // Get the translation store from context
  const translationStore = useContext(TranslationContext);

  // Get available languages
  const languages = getAvailableLanguages();

  // Flag emoji mapping for languages
  const flagEmojis: Record<string, string> = {
    en: "🇬🇧",
    es: "🇪🇸",
    fr: "🇫🇷",
    de: "🇩🇪",
  };

  return (
    <div class="language-selector flex items-center">
      <span class="mr-1 text-lg" aria-hidden="true">
        {flagEmojis[translationStore.currentLanguage] || "🌐"}
      </span>
      <select
        value={translationStore.currentLanguage}
        onChange$={(event) => {
          const select = event.target as HTMLSelectElement;
          translationStore.setLanguage(select.value);
        }}
        class="bg-transparent border-none text-inherit font-bold text-sm appearance-none pl-1 pr-5"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0 center",
          backgroundSize: "16px 16px",
          paddingRight: "20px",
        }}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
});
