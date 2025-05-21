import { createContextId, $ } from "@builder.io/qwik";

/**
 * Interface for the translation store
 */
export interface TranslationStore {
  currentLanguage: string;
  setLanguage: (language: string) => void;
}

/**
 * Create initial state for the translation store
 */
export function createInitialTranslationState(): TranslationStore {
  return {
    currentLanguage: "en", // Default language is English
    // Use $() to make the function serializable
    setLanguage: $((language: string) => {
      // This will be replaced with the actual implementation in the provider
      console.log(`Setting language to ${language}`);
    }),
  };
}

/**
 * Context ID for the translation store
 */
export const TranslationContext = createContextId<TranslationStore>(
  "translation-context"
);
