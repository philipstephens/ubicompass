import { component$, useContext, $ } from "@builder.io/qwik";
import { UbiDataContext } from "../stores/ubi-data-store";
import { TranslatableText } from "./translatable-text";
import { TranslationContext } from "../stores/translation-store";

/**
 * UBI Parameters component with purple header and rounded corners
 */
export const UbiParameters = component$(() => {
  // Get the UBI data store
  const ubiStore = useContext(UbiDataContext);

  // Get the translation context
  const translationStore = useContext(TranslationContext);

  // UBI amount options in thousands per year
  const ubiAmountOptions = [12, 18, 24, 30, 36];

  // Get translated UBI amount text
  const getUbiAmountText = (amount: number) => {
    const text = `$${amount}k / year ($${Math.round(amount / 12)}k / month)`;

    if (translationStore.currentLanguage === "es") {
      return `$${amount}k / año ($${Math.round(amount / 12)}k / mes)`;
    } else if (translationStore.currentLanguage === "fr") {
      return `$${amount}k / an ($${Math.round(amount / 12)}k / mois)`;
    } else if (translationStore.currentLanguage === "de") {
      return `$${amount}k / Jahr ($${Math.round(amount / 12)}k / Monat)`;
    }

    return text;
  };

  return (
    <div class="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-md mb-6">
      {/* Purple header */}
      <div class="bg-purple-500 text-white px-6 py-3 text-center">
        <h4 class="font-bold text-lg">
          <TranslatableText text="UBI Calculator Parameters" />
        </h4>
      </div>

      {/* Parameters content */}
      <div class="p-6">
        <div class="space-y-6">
          {/* Year selector */}
          <div class="flex flex-col">
            <div class="flex justify-between items-center mb-1">
              <label for="year" class="font-medium">
                <TranslatableText text="Year:" />
              </label>
              <div class="w-48">
                <div class="relative">
                  <select
                    id="year"
                    class="block w-full pl-3 pr-10 py-1 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                    onChange$={(event) => {
                      const year = parseInt(event.target.value, 10);
                      const selectedYear = ubiStore.yearData.find(
                        (y) => y.taxyear === year
                      );
                      if (selectedYear) {
                        ubiStore.selectedYear = selectedYear;
                      }
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => 2000 + i).map(
                      (year) => (
                        <option
                          key={year}
                          value={year}
                          selected={ubiStore.selectedYear?.taxyear === year}
                        >
                          {year}
                        </option>
                      )
                    )}
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      class="h-4 w-4"
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
              </div>
            </div>
          </div>

          {/* Tax model selector */}
          <div class="flex flex-col">
            <div class="flex justify-between items-start mb-1">
              <label for="tax-model" class="font-medium mt-2">
                <TranslatableText text="Tax Model" />
              </label>
              <div class="w-48">
                <div class="relative">
                  <select
                    id="tax-model"
                    class="block w-full pl-3 pr-10 py-1 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                    onChange$={(event) => {
                      const modelId = parseInt(event.target.value, 10);
                      ubiStore.selectedModelId = modelId;
                    }}
                  >
                    {[
                      { id: 1, name: "Flat Tax" },
                      { id: 2, name: "Progressive Tax" },
                      { id: 3, name: "Bell Curve" },
                      { id: 4, name: "Percentile-Matched" },
                    ].map((model) => (
                      <option
                        key={model.id}
                        value={model.id}
                        selected={ubiStore.selectedModelId === model.id}
                      >
                        <TranslatableText text={model.name} />
                      </option>
                    ))}
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      class="h-4 w-4"
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
              </div>
            </div>
            <div class="text-sm text-gray-600 mt-1 pl-4 border-l-2 border-gray-200">
              <TranslatableText text="Simple flat tax rate applied to all income above exemption" />
            </div>
          </div>

          {/* UBI Amount selector */}
          <div class="flex flex-col">
            <div class="flex justify-between items-center mb-1">
              <label for="ubi-amount" class="font-medium">
                <TranslatableText text="UBI Amount" />
              </label>
              <div class="w-48">
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
                        {getUbiAmountText(amount)}
                      </option>
                    ))}
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      class="h-4 w-4"
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
              </div>
            </div>
          </div>

          {/* Flat Tax Percentage */}
          <div class="flex flex-col">
            <div class="mb-1">
              <label for="flat-tax-percentage" class="font-medium">
                <TranslatableText text="Flat Tax Percentage:" />
              </label>
            </div>
            <div class="pl-4">
              <div class="flex items-center">
                <input
                  type="range"
                  id="flat-tax-percentage"
                  min="1"
                  max="99"
                  value={ubiStore.selectedYear?.flattaxpercentage || 30}
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  onChange$={(event) => {
                    const percentage = parseInt(event.target.value, 10);
                    if (ubiStore.selectedYear) {
                      ubiStore.selectedYear.flattaxpercentage = percentage;
                      // Trigger a refresh
                      ubiStore.refreshTrigger = Date.now();
                    }
                  }}
                />
                <span class="ml-3 text-purple-700 font-medium w-12 text-right">
                  {ubiStore.selectedYear?.flattaxpercentage || 30}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
