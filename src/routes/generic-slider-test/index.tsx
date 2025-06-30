import { component$, useSignal, $ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { TripleHandleSlider } from "~/components/triple-handle-slider";

export default component$(() => {
  // Create independent signals for testing
  const value1 = useSignal(7);
  const value2 = useSignal(24);
  const value3 = useSignal(65);

  // Define data ranges
  const minDataValue = 0;
  const maxDataValue = 100;
  const maxDataValue1 = 22;
  const maxDataValue2 = 65;
  const maxDataValue3 = 100;

  return (
    <div class="p-8 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Generic Triple Slider Test Page</h1>

      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-xl font-semibold mb-4">
          Generic Triple Slider Component
        </h2>
        <p class="text-gray-600 mb-6">
          This is the Generic Triple Slider component with pixel-based
          calculations. Value 1 is restricted to {minDataValue}-{maxDataValue1},
          Value 2 to {value1.value + 1}-{maxDataValue2}, and Value 3 to{" "}
          {value2.value + 1}-{maxDataValue3}.
        </p>

        <div class="mb-8">
          <GenericTripleSlider
            value1={{ value: value1.value }}
            value2={{ value: value2.value }}
            value3={{ value: value3.value }}
            minDataValue={minDataValue}
            maxDataValue={maxDataValue}
            maxDataValue1={maxDataValue1}
            maxDataValue2={maxDataValue2}
            maxDataValue3={maxDataValue3}
            initialPixelSliderLength={600}
            trackColor1="#3b82f6"
            trackColor2="#10b981"
            trackColor3="#f59e0b"
            trackColor4="#8b5cf6"
            label1="Children"
            label2="Youth"
            label3="Adults"
            label4="Seniors"
          />
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-xl font-semibold mb-4">Manual Controls</h2>
        <p class="text-gray-600 mb-6">
          Use these controls to manually adjust the values.
        </p>

        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="p-4 bg-blue-100 rounded-lg text-center">
            <div class="font-medium text-blue-800">Value 1</div>
            <div class="text-2xl font-bold text-blue-600">{value1.value}</div>
            <input
              type="number"
              min={minDataValue}
              max={Math.min(maxDataValue1, value2.value - 1)}
              value={value1.value}
              onInput$={(e) => {
                const val = parseInt((e.target as HTMLInputElement).value);
                if (
                  val >= minDataValue &&
                  val < value2.value &&
                  val <= maxDataValue1
                ) {
                  value1.value = val;
                }
              }}
              class="mt-2 w-full p-2 border rounded"
            />
          </div>

          <div class="p-4 bg-green-100 rounded-lg text-center">
            <div class="font-medium text-green-800">Value 2</div>
            <div class="text-2xl font-bold text-green-600">{value2.value}</div>
            <input
              type="number"
              min={value1.value + 1}
              max={Math.min(maxDataValue2, value3.value - 1)}
              value={value2.value}
              onInput$={(e) => {
                const val = parseInt((e.target as HTMLInputElement).value);
                if (
                  val > value1.value &&
                  val < value3.value &&
                  val <= maxDataValue2
                ) {
                  value2.value = val;
                }
              }}
              class="mt-2 w-full p-2 border rounded"
            />
          </div>

          <div class="p-4 bg-amber-100 rounded-lg text-center">
            <div class="font-medium text-amber-800">Value 3</div>
            <div class="text-2xl font-bold text-amber-600">{value3.value}</div>
            <input
              type="number"
              min={value2.value + 1}
              max={maxDataValue3}
              value={value3.value}
              onInput$={(e) => {
                const val = parseInt((e.target as HTMLInputElement).value);
                if (val > value2.value && val <= maxDataValue3) {
                  value3.value = val;
                }
              }}
              class="mt-2 w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div class="mt-8">
        <a href="/" class="text-blue-600 hover:underline">
          Back to Home
        </a>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Generic Triple Slider Test",
  meta: [
    {
      name: "description",
      content: "Test page for the Generic Triple Slider component",
    },
  ],
};
