import { component$ } from "@builder.io/qwik";
import { TranslatableText } from "./translatable-text";

/**
 * UBI Parameters component that exactly matches the mockup image
 * This is a static mockup with minimal functionality
 */
export const UbiParametersMockup = component$(() => {
  return (
    <div class="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-md">
      {/* Purple header */}
      <div class="bg-purple-500 text-white px-4 py-2 text-center">
        <h4 class="font-bold text-lg">
          <TranslatableText text="UBI Calculator Parameters" />
        </h4>
      </div>
      
      {/* Parameters content */}
      <div class="p-5">
        {/* Year selector */}
        <div class="flex justify-between items-center mb-4">
          <div class="font-medium">
            <TranslatableText text="Year:" /> 2023
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-gray-600">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Tax model selector */}
        <div class="mb-4">
          <div class="flex justify-between items-center mb-1">
            <div class="font-medium">
              <TranslatableText text="Tax Model" />
            </div>
            <div>
              <TranslatableText text="Tax Model" />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-gray-600 inline ml-1">
                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div class="text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
            <TranslatableText text="Simple flat tax rate applied to all income above exemption" />
          </div>
        </div>
        
        {/* UBI Amount selector */}
        <div class="flex justify-between items-center mb-4">
          <div class="font-medium">
            <TranslatableText text="UBI Amount" />
          </div>
          <div>
            $12k / Year ($1k / month)
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-gray-600 inline ml-1">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Flat Tax Percentage */}
        <div>
          <div class="mb-2 font-medium">
            <TranslatableText text="Flat Tax Percentage:" />
          </div>
          <div class="flex items-center px-2">
            <div class="w-full bg-gray-200 h-2 rounded-full">
              <div class="bg-purple-500 h-2 rounded-full w-1/3 relative">
                <div class="absolute -right-2 -top-1 w-4 h-4 bg-gray-400 rounded-full"></div>
              </div>
            </div>
            <span class="ml-3 text-purple-700 font-medium w-12 text-right">
              30%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
