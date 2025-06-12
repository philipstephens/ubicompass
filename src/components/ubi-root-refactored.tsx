import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { UbiDataProviderBest } from "./ubi-data-provider-best";
import { UbiCalculationRefactored } from "./ubi-calculation-refactored";

export const UbiRootRefactored = component$(() => {
  console.log("UbiRootRefactored component rendering");

  // State to track errors
  const hasError = useSignal(false);
  const errorMessage = useSignal("");

  // Use a visible task to catch any errors that might occur during rendering
  useVisibleTask$(({ cleanup }) => {
    console.log("UbiRootRefactored visible task running");

    // Set up global error handler
    const originalErrorHandler = window.onerror;

    window.onerror = (message, source, lineno, colno, error) => {
      console.error("Global error caught:", message, error);
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
    <div class="ubi-root-refactored">
      {hasError.value ? (
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong class="font-bold">Error: </strong>
          <span class="block sm:inline">{errorMessage.value}</span>
          <p class="mt-2">
            Please try refreshing the page or contact support if the issue
            persists.
          </p>
        </div>
      ) : (
        <UbiDataProviderBest>
          <UbiCalculationRefactored />
        </UbiDataProviderBest>
      )}
    </div>
  );
});
