import {
  component$,
  PropFunction,
  useVisibleTask$,
  useSignal,
  $,
  useContext,
} from "@builder.io/qwik";
import { TranslationContext } from "../stores/translation-store";
import type { TaxEntry } from "../models/income-data";

/**
 * A chart component that uses an iframe to render the chart
 * This approach isolates the chart rendering from Qwik's serialization
 */
export const IframeChart = component$(
  ({
    taxEntries,
    calculateIncomeWithUBI,
  }: {
    taxEntries: TaxEntry[];
    calculateIncomeWithUBI: PropFunction<(entry: TaxEntry) => number>;
  }) => {
    const iframeRef = useSignal<HTMLIFrameElement | null>(null);
    const isIframeReady = useSignal(false);

    // Get the translation store from context
    const translationStore = useContext(TranslationContext);

    // Check if we have valid data
    if (!taxEntries || taxEntries.length === 0) {
      return (
        <div class="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200 text-center">
          <div class="text-yellow-800 mb-2 font-medium">
            No data available to display
          </div>
        </div>
      );
    }

    // Prepare data for the iframe - using $() to make it serializable
    const prepareChartData = $(() => {
      // Convert tax entries to a format the iframe can use
      const chartData = taxEntries.map((entry) => ({
        quintile: entry.quintile,
        averageTaxableIncome: entry.averagetaxableincome || 0,
        incomeWithUBI: calculateIncomeWithUBI(entry) || 0,
        lowerBound: entry.lowerBound || 0,
        upperBound: entry.upperBound || 0,
      }));

      return { taxEntries: chartData };
    });

    // Listen for messages from the iframe
    useVisibleTask$(({ track, cleanup }) => {
      track(() => iframeRef.value);

      if (!iframeRef.value) return;

      console.log("IframeChart: iframe ref is available");

      const handleMessage = (event: MessageEvent) => {
        console.log("IframeChart: received message", event.data);

        // Check if the message is from our iframe
        if (event.source !== iframeRef.value?.contentWindow) {
          console.log("IframeChart: message not from our iframe");
          return;
        }

        // Handle the ready message
        if (event.data?.type === "CHART_READY") {
          console.log("IframeChart: received CHART_READY message");
          isIframeReady.value = true;

          // Send the data to the iframe - call the QRL function
          prepareChartData().then((chartData) => {
            console.log("IframeChart: sending data to iframe", chartData);
            // Include the current language in the message
            iframeRef.value?.contentWindow?.postMessage(
              {
                ...chartData,
                language: translationStore.currentLanguage,
              },
              "*"
            );
          });
        }
      };

      // Add event listener
      window.addEventListener("message", handleMessage);

      // Clean up
      cleanup(() => {
        window.removeEventListener("message", handleMessage);
      });
    });

    // Also send data when the iframe loads
    useVisibleTask$(({ track }) => {
      track(() => iframeRef.value);

      if (!iframeRef.value) return;

      const iframe = iframeRef.value;

      const handleLoad = () => {
        console.log("IframeChart: iframe loaded");

        // Wait a bit to make sure the iframe is fully loaded
        setTimeout(() => {
          // First send a language update message
          console.log(
            "IframeChart: Sending initial language to iframe:",
            translationStore.currentLanguage
          );
          iframe.contentWindow?.postMessage(
            {
              type: "setLanguage",
              language: translationStore.currentLanguage,
            },
            "*"
          );

          // Then send the data
          prepareChartData().then((chartData) => {
            console.log(
              "IframeChart: sending data to iframe after load",
              chartData
            );
            // Include the current language in the message
            iframe.contentWindow?.postMessage(
              {
                ...chartData,
                language: translationStore.currentLanguage,
              },
              "*"
            );
          });
        }, 500);
      };

      iframe.addEventListener("load", handleLoad);

      return () => {
        iframe.removeEventListener("load", handleLoad);
      };
    });

    // Track language changes and update the iframe
    useVisibleTask$(({ track }) => {
      const language = track(() => translationStore.currentLanguage);
      console.log(
        "IframeChart: Language tracking detected change to",
        language
      );

      // Skip if iframe is not ready yet
      if (!iframeRef.value) {
        console.log("IframeChart: Iframe reference not available yet");
        return;
      }

      console.log("IframeChart: Language changed to", language);

      // Send the language update to the iframe
      try {
        iframeRef.value.contentWindow?.postMessage(
          {
            type: "setLanguage",
            language: language,
          },
          "*"
        );
        console.log("IframeChart: Language update message sent to iframe");
      } catch (error) {
        console.error("IframeChart: Error sending language update", error);
      }
    });

    return (
      <div style={{ width: "100%", minWidth: "1200px", maxWidth: "3600px" }}>
        <iframe
          ref={(el) => (iframeRef.value = el)}
          src="/fixed-chart.html"
          class="border-0"
          style={{
            height: "680px",
            width: "100%",
            minWidth: "1200px",
            maxWidth: "3600px",
          }}
          title="Income Comparison Chart"
        ></iframe>
      </div>
    );
  }
);
