import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { CspHeader } from "~/components/csp-header";
import { MenuComponent } from "~/components/menu-component";
import { UbiSafeWrapper } from "~/components/ubi-safe-wrapper";
import { TranslationProvider } from "~/components/translation-provider";
import type { DocumentHead } from "@builder.io/qwik-city";
import "./index.css";

export default component$(() => {
  // State to track errors
  const hasError = useSignal(false);
  const errorMessage = useSignal("");

  // Use a visible task to catch any errors that might occur during rendering
  useVisibleTask$(({ cleanup }) => {
    console.log("Index page visible task running");

    // Set up global error handler
    const originalErrorHandler = window.onerror;

    window.onerror = (message, source, lineno, colno, error) => {
      console.error("Global error caught in index page:", message, error);
      hasError.value = true;
      errorMessage.value = message?.toString() || "Unknown error";

      // Call the original handler if it exists
      if (typeof originalErrorHandler === "function") {
        return originalErrorHandler(message, source, lineno, colno, error);
      }
      return false;
    };

    // Clean up when component unmounts
    cleanup(() => {
      window.onerror = originalErrorHandler;
    });
  });

  return (
    <TranslationProvider>
      <div class="bg-gray-200 min-h-screen">
        {/* Header */}
        <div class="header-container">
          <CspHeader
            headerColor="rgba(186, 164, 61, 1)"
            height="h-64"
            title="UBI Compass"
            subTitle="Navigate UBI Policy with Data-Driven Analysis"
            titleSize="text-3xl"
            subTitleSize="text-sm"
          />
        </div>

        {/* Menu - directly below header with no gap */}
        <div class="menu-container">
          <MenuComponent
            backgroundColor="rgb(255, 215, 0)"
            textColor="rgb(255, 0, 0)"
            height="h-4"
          />
        </div>

        {/* Small gap */}
        <div class="small-gap"></div>

        {/* Navigation Links */}
        <div class="bg-white shadow-md rounded-lg p-4 mb-4 mx-4">
          <h2 class="text-xl font-bold mb-2">UBI Compass Analysis Tool</h2>
          <div class="flex flex-wrap gap-4">
            <a
              href="/"
              class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Quintile Calculator
            </a>
            <a
              href="/ubi-compass-pro/"
              class="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded hover:from-green-600 hover:to-blue-600 font-bold shadow-lg"
            >
              🧭 UBI Compass Pro (Real Data)
            </a>
            <a
              href="/ubi-compass/"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              UBI Compass (Demo)
            </a>
            <a
              href="/simple"
              class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Simple Version
            </a>
          </div>
        </div>

        {/* Direct link to UBI Compass Pro with explanation */}
        <div class="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-6 rounded-lg mb-4 mx-4">
          <h3 class="text-xl font-semibold text-green-800 mb-3">
            🚀 NEW: UBI Compass Pro - Real Statistics Canada Data
          </h3>
          <p class="text-green-700 mb-4">
            Experience professional-grade UBI policy analysis powered by{" "}
            <strong>23+ years of real Canadian economic data</strong>
            from Statistics Canada. Features comprehensive feasibility analysis,
            GDP context, government budget analysis, and inflation-adjusted
            calculations.
          </p>
          <div class="bg-white p-4 rounded-lg mb-4">
            <h4 class="font-bold text-gray-800 mb-2">📊 Real Data Sources:</h4>
            <ul class="text-sm text-gray-700 space-y-1">
              <li>• Income Distribution (2000-2023)</li>
              <li>• GDP & Economic Indicators (2020-2024)</li>
              <li>• Federal & Provincial Government Budgets</li>
              <li>• Consumer Price Index (Inflation Data)</li>
              <li>• Population Demographics</li>
            </ul>
          </div>
          <div class="flex justify-center space-x-4">
            <a
              href="/ubi-compass-pro/"
              class="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105"
            >
              🧭 Launch UBI Compass Pro →
            </a>
            <a
              href="/ubi-compass/"
              class="inline-block px-6 py-4 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-all"
            >
              Demo Version
            </a>
          </div>
        </div>

        {/* Error display */}
        {hasError.value && (
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 mx-4">
            <strong class="font-bold">Error: </strong>
            <span class="block sm:inline">{errorMessage.value}</span>
            <p class="mt-2">
              Please try the{" "}
              <a href="/simple" class="underline text-blue-600">
                simple version
              </a>{" "}
              of the page.
            </p>
          </div>
        )}

        {/* UBI Safe Wrapper Component */}
        <div class="ubi-wrapper">{!hasError.value && <UbiSafeWrapper />}</div>
      </div>
    </TranslationProvider>
  );
});

export const head: DocumentHead = {
  title: "UBI Compass - Navigate UBI Policy with Data-Driven Analysis",
  meta: [
    {
      name: "description",
      content:
        "Professional UBI policy analysis tool with comprehensive feasibility metrics and data-driven insights.",
    },
  ],
};
