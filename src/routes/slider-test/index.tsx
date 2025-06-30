import { component$, useSignal } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { TripleSlider } from "~/components/triple-slider";
import { TripleSliderTest } from "~/components/triple-slider-test";

export default component$(() => {
  // Create independent signals for testing
  const childAge = useSignal(7);
  const youthAge = useSignal(24);
  const seniorAge = useSignal(65);

  // Define max ages
  const maxChildAge = 22;
  const maxYouthAge = 65;
  const maxSeniorAge = 100;

  return (
    <div class="p-8 max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Triple Slider Test Page</h1>

      <div class="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-xl font-semibold mb-4">
          Original Triple Slider Component
        </h2>
        <p class="text-gray-600 mb-6">
          This is the original TripleSlider component with dedicated CSS. Child
          age is restricted to 0-{maxChildAge}, Youth age to{" "}
          {childAge.value + 1}-{maxYouthAge}, and Senior age to{" "}
          {youthAge.value + 1}-{maxSeniorAge}.
        </p>

        <div class="mb-8">
          <TripleSlider
            childAge={childAge}
            youthAge={youthAge}
            seniorAge={seniorAge}
            maxChildAge={maxChildAge}
            maxYouthAge={maxYouthAge}
            maxSeniorAge={maxSeniorAge}
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
            <div class="font-medium text-blue-800">Child Age</div>
            <div class="text-2xl font-bold text-blue-600">{childAge.value}</div>
            <input
              type="number"
              min="0"
              max={Math.min(maxChildAge, youthAge.value - 1)}
              value={childAge.value}
              onInput$={(e) => {
                const val = parseInt((e.target as HTMLInputElement).value);
                if (val >= 0 && val < youthAge.value && val <= maxChildAge) {
                  childAge.value = val;
                }
              }}
              class="mt-2 w-full p-2 border rounded"
            />
          </div>

          <div class="p-4 bg-green-100 rounded-lg text-center">
            <div class="font-medium text-green-800">Youth Age</div>
            <div class="text-2xl font-bold text-green-600">
              {youthAge.value}
            </div>
            <input
              type="number"
              min={childAge.value + 1}
              max={Math.min(maxYouthAge, seniorAge.value - 1)}
              value={youthAge.value}
              onInput$={(e) => {
                const val = parseInt((e.target as HTMLInputElement).value);
                if (
                  val > childAge.value &&
                  val < seniorAge.value &&
                  val <= maxYouthAge
                ) {
                  youthAge.value = val;
                }
              }}
              class="mt-2 w-full p-2 border rounded"
            />
          </div>

          <div class="p-4 bg-amber-100 rounded-lg text-center">
            <div class="font-medium text-amber-800">Senior Age</div>
            <div class="text-2xl font-bold text-amber-600">
              {seniorAge.value}
            </div>
            <input
              type="number"
              min={youthAge.value + 1}
              max={maxSeniorAge}
              value={seniorAge.value}
              onInput$={(e) => {
                const val = parseInt((e.target as HTMLInputElement).value);
                if (val > youthAge.value && val <= maxSeniorAge) {
                  seniorAge.value = val;
                }
              }}
              class="mt-2 w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4">Age Group Visualization</h2>
        <div class="flex h-12 rounded-lg overflow-hidden mb-4">
          <div
            class="bg-blue-500 h-full flex items-center justify-center text-white font-medium"
            style={{ width: `${(childAge.value / maxSeniorAge) * 100}%` }}
          >
            Children
          </div>
          <div
            class="bg-green-500 h-full flex items-center justify-center text-white font-medium"
            style={{
              width: `${((youthAge.value - childAge.value) / maxSeniorAge) * 100}%`,
            }}
          >
            Youth
          </div>
          <div
            class="bg-amber-500 h-full flex items-center justify-center text-white font-medium"
            style={{
              width: `${((seniorAge.value - youthAge.value) / maxSeniorAge) * 100}%`,
            }}
          >
            Adults
          </div>
          <div
            class="bg-purple-500 h-full flex items-center justify-center text-white font-medium"
            style={{
              width: `${((maxSeniorAge - seniorAge.value) / maxSeniorAge) * 100}%`,
            }}
          >
            Seniors
          </div>
        </div>

        <div class="flex justify-between text-sm text-gray-600">
          <span>0</span>
          <span>{childAge.value}</span>
          <span>{youthAge.value}</span>
          <span>{seniorAge.value}</span>
          <span>{maxSeniorAge}</span>
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
  title: "Triple Slider Test",
  meta: [
    {
      name: "description",
      content: "Test page for the Triple Slider component",
    },
  ],
};
