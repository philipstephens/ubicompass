import {
  component$,
  useContextProvider,
  useStore,
  Slot,
  $,
  useTask$,
} from "@builder.io/qwik";
import {
  TranslationContext,
  createInitialTranslationState,
} from "../stores/translation-store";

/**
 * Translation Provider Component
 * Provides translation context to all child components
 */
export const TranslationProvider = component$(() => {
  // Create a store with the initial state
  const translationStore = useStore(createInitialTranslationState());

  // Use useTask$ to set up the setLanguage function
  useTask$(() => {
    // Override the setLanguage function with the actual implementation
    // Use $() to make the function serializable
    translationStore.setLanguage = $((language: string) => {
      translationStore.currentLanguage = language;
    });
  });

  // Provide the context
  useContextProvider(TranslationContext, translationStore);

  // Return the children
  return <Slot />;
});
