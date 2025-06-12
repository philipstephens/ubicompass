import { component$ } from "@builder.io/qwik";
import { CspHeader } from "~/components/csp-header";
import { MenuComponent } from "~/components/menu-component";
import { TranslationProvider } from "~/components/translation-provider";
import type { DocumentHead } from "@builder.io/qwik-city";

/**
 * A simplified page without the UBI calculator components
 * This can help us test if the server can run without the circular reference issues
 */
export default component$(() => {
  return (
    <TranslationProvider>
      <div class="bg-gray-200 min-h-screen">
        {/* Header */}
        <div class="header-container">
          <CspHeader
            headerColor="rgba(186, 164, 61, 1)"
            height="h-64"
            title="Help Us End Poverty Forever!!"
            subTitle="with a Universal Basic Income"
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

        {/* Simple content */}
        <div class="mx-4 p-6 bg-white rounded-lg shadow-md">
          <h2 class="text-2xl font-bold mb-4">Simple Test Page</h2>
          <p class="mb-4">
            This is a simplified page without the UBI calculator components. If
            this page loads correctly, then the issue is with the UBI calculator
            components.
          </p>

          <div class="mt-6 flex gap-4">
            <a
              href="/"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Try Main Page
            </a>
            <a
              href="/income-range"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Income Range Demo
            </a>
            <a
              href="/standalone"
              class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Standalone Component
            </a>
            <a
              href="/minimal"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Minimal Demo
            </a>
          </div>
        </div>
      </div>
    </TranslationProvider>
  );
});

export const head: DocumentHead = {
  title: "Simple Test Page",
  meta: [
    {
      name: "description",
      content: "A simple test page without the UBI calculator components",
    },
  ],
};
