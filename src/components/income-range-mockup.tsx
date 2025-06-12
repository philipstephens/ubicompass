import { component$ } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * Income Range component that matches the mockup design
 * This is a static mockup with minimal functionality
 */
export const IncomeRangeMockup = component$(() => {
  return (
    <div class="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-md h-full">
      {/* Blue header */}
      <div class="bg-blue-500 text-white px-4 py-2 text-center">
        <h4 class="font-bold text-lg">
          <TranslatableText text="Income Range" />
        </h4>
      </div>
      
      {/* Content */}
      <div class="p-5">
        <div class="text-sm text-gray-600">
          <div class="mb-4">
            <div class="font-medium text-blue-700 mb-2">
              <TranslatableText text="Current Tax Model:" />
            </div>
            <div class="bg-blue-50 p-3 rounded-md">
              Flat Tax
            </div>
          </div>
          
          <div>
            <div class="font-medium text-blue-700 mb-2">
              <TranslatableText text="Tax Brackets:" />
            </div>
            <div class="space-y-2">
              <div class="bg-blue-50 p-3 rounded-md flex justify-between items-center">
                <div>
                  $0k - $24k
                </div>
                <div class="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  0%
                </div>
              </div>
              <div class="bg-blue-50 p-3 rounded-md flex justify-between items-center">
                <div>
                  $24k+
                </div>
                <div class="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  30%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
