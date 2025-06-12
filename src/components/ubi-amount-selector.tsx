import { component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { UbiDataContext } from "../stores/ubi-data-store";
import { TranslatableText } from "./translatable-text";
import { TranslationContext } from "../stores/translation-store";
import "./dropdown-icon.css";

/**
 * Component for selecting a UBI amount
 */
export const UbiAmountSelector = component$(() => {
  // Get the UBI data store
  const ubiStore = useContext(UbiDataContext);

  // Get the translation context
  const translationStore = useContext(TranslationContext);

  // State for translated option texts
  const translatedOptions = useSignal<Record<number, string>>({});

  // UBI amount options in thousands per year
  const ubiAmountOptions = [12, 18, 24, 30, 36];

  // Update translations when language changes
  useTask$(({ track }) => {
    // Track language changes
    track(() => translationStore.currentLanguage);

    // Update translations for each option
    const translations: Record<number, string> = {};
    ubiAmountOptions.forEach((amount) => {
      const text = `$${amount}k / year ($${Math.round(amount / 12)}k / month)`;
      // For now, use the mockTranslations directly
      // In a real app, you would use the translation service
      if (translationStore.currentLanguage === "es") {
        translations[amount] =
          `$${amount}k / año ($${Math.round(amount / 12)}k / mes)`;
      } else if (translationStore.currentLanguage === "fr") {
        translations[amount] =
          `$${amount}k / an ($${Math.round(amount / 12)}k / mois)`;
      } else if (translationStore.currentLanguage === "de") {
        translations[amount] =
          `$${amount}k / Jahr ($${Math.round(amount / 12)}k / Monat)`;
      } else {
        translations[amount] = text;
      }
    });

    translatedOptions.value = translations;
  });

  return (
    <div class="relative">
      <select
        id="ubi-amount"
        class="block w-full pl-3 pr-10 py-1 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
        onChange$={(event) => {
          const amount = parseInt(event.target.value, 10);
          ubiStore.selectedUbiAmount = amount;
        }}
      >
        {ubiAmountOptions.map((amount) => (
          <option
            key={amount}
            value={amount}
            selected={ubiStore.selectedUbiAmount === amount}
          >
            {translatedOptions.value[amount] ||
              `$${amount}k / year ($${Math.round(amount / 12)}k / month)`}
          </option>
        ))}
      </select>
      <div class="dropdown-icon-container text-gray-700">
        <svg
          class="dropdown-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
});
