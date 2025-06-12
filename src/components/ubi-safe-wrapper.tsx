import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import { UbiRootDecile } from "./ubi-root-decile";
import { UbiRootRefactored } from "./ubi-root-refactored";

/**
 * A safe wrapper component for the UBI calculator
 * This component isolates the UBI calculator from the rest of the application
 * to prevent circular reference issues
 */
export const UbiSafeWrapper = component$(() => {
  // State to track which view to show
  const showDecileView = useSignal(false);

  // State to track errors
  const hasError = useSignal(false);
  const errorMessage = useSignal("");
  const isLoading = useSignal(true);

  // Use a visible task to catch any errors that might occur during rendering
  useVisibleTask$(({ cleanup }) => {
    console.log("UbiSafeWrapper visible task running");

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

    // Mark loading as complete
    isLoading.value = false;
  });

  // Function to toggle between quintile and decile views
  const toggleView = $(() => {
    try {
      showDecileView.value = !showDecileView.value;
      console.log(
        "Toggled view to:",
        showDecileView.value ? "Decile" : "Quintile"
      );

      // Reset error state when toggling
      hasError.value = false;
      errorMessage.value = "";
    } catch (error) {
      console.error("Error toggling view:", error);
      hasError.value = true;
      errorMessage.value =
        error instanceof Error ? error.message : "Unknown error";
    }
  });

  return (
    <div>
      {/* Toggle Button */}
      <div class="flex justify-center my-4">
        <button
          onClick$={toggleView}
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transition duration-300 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
              clip-rule="evenodd"
            />
          </svg>
          {showDecileView.value ? (
            <span>Switch to Quintile View</span>
          ) : (
            <span>Switch to Decile View</span>
          )}
        </button>
      </div>

      {/* Loading indicator */}
      {isLoading.value && (
        <div class="flex justify-center my-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}

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

      {/* UBI Calculator Component */}
      {!isLoading.value && !hasError.value && (
        <div class="card-container mx-4">
          {showDecileView.value ? (
            <div id="decile-view">
              <UbiRootDecile />
            </div>
          ) : (
            <div id="quintile-view">
              <UbiRootRefactored />
            </div>
          )}
        </div>
      )}
    </div>
  );
});
