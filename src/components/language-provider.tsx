import {
  component$,
  useContextProvider,
  useStore,
  Slot,
  $,
  useTask$,
} from "@builder.io/qwik";
import {
  LanguageContext,
  createInitialLanguageState,
} from "~/stores/language-store";

export const LanguageProvider = component$(() => {
  const languageStore = useStore(createInitialLanguageState());

  // Use useTask$ to set up the setLanguage function
  useTask$(() => {
    // Override the setLanguage function with the actual implementation
    // Use $() to make the function serializable
    languageStore.setLanguage = $((language: string) => {
      languageStore.currentLanguage = language;
      // Optionally save to localStorage for persistence
      try {
        localStorage.setItem("preferredLanguage", language);
      } catch (e) {
        // Handle localStorage errors
      }
    });
  });

  // Load saved language preference on initialization
  useTask$(() => {
    try {
      const savedLanguage = localStorage.getItem("preferredLanguage");
      if (savedLanguage && languageStore.availableLanguages[savedLanguage]) {
        languageStore.currentLanguage = savedLanguage;
      }
    } catch (e) {
      // Handle localStorage errors
    }
  });

  useContextProvider(LanguageContext, languageStore);

  return <Slot />;
});
