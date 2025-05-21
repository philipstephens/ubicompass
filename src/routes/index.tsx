import { component$ } from "@builder.io/qwik";
import { CspHeader } from "~/components/csp-header";
import { MenuComponent } from "~/components/menu-component";
import { UbiRootRefactored } from "~/components/ubi-root-refactored";
import { TranslationProvider } from "~/components/translation-provider";
import type { DocumentHead } from "@builder.io/qwik-city";
import "./index.css";

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

        {/* UBI Calculation Component - full width with small margin (mx-4) */}
        <div class="card-container mx-4">
          <UbiRootRefactored />
        </div>
      </div>
    </TranslationProvider>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
