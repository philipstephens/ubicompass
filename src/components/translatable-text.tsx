import { component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { TranslationContext } from "../stores/translation-store";
import { translateText } from "../services/translation-service";

interface TranslatableTextProps {
  text: string;
  class?: string;
  tag?: string;
}

/**
 * Translatable Text Component
 * Displays text that can be translated to different languages
 */
export const TranslatableText = component$((props: TranslatableTextProps) => {
  // Get the translation store from context
  const translationStore = useContext(TranslationContext);

  // Create a signal for the translated text
  const translatedText = useSignal(props.text);

  // Update the translated text when the language or text changes
  useTask$(async ({ track }) => {
    // Track the language and text
    const language = track(() => translationStore.currentLanguage);
    const text = track(() => props.text);

    console.log(`TranslatableText: Translating "${text}" to ${language}`);

    // If the language is English, use the original text
    if (language === "en") {
      translatedText.value = text;
      console.log(
        `TranslatableText: Using original text for English: "${text}"`
      );
      return;
    }

    try {
      // Translate the text
      const translated = await translateText(text, language);
      console.log(
        `TranslatableText: Translated "${text}" to "${translated}" (${language})`
      );
      translatedText.value = translated;
    } catch (error) {
      console.error(
        `TranslatableText: Translation error for "${text}":`,
        error
      );
      // Use the original text if translation fails
      translatedText.value = text;
    }
  });

  // Render the text with the appropriate tag
  const Tag = (props.tag || "span") as any;

  return <Tag class={props.class}>{translatedText.value}</Tag>;
});
