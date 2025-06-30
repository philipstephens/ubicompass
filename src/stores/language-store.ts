import { createContextId } from "@builder.io/qwik";

export interface LanguageStore {
  currentLanguage: string;
  setLanguage: ((language: string) => void) | undefined; // Make it optional initially
  availableLanguages: Record<string, string>;
}

export function createInitialLanguageState(): LanguageStore {
  return {
    currentLanguage: "en",
    setLanguage: undefined, // Will be implemented in provider
    availableLanguages: {
      en: "🇺🇸 English",
      fr: "🇫🇷 Français",
      es: "🇪🇸 Español",
      pt: "🇵🇹 Português"
    }
  };
}

export const LanguageContext = createContextId<LanguageStore>("language-context");