import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import UBICompassSimplified from "~/components/ubi-compass-simplified";

export default component$(() => {
  return <UBICompassSimplified />;
});

export const head: DocumentHead = {
  title: "UBI Compass - Simplified Version",
  meta: [
    {
      name: "description",
      content:
        "A simplified version of the UBI Compass tool with streamlined features and improved stability.",
    },
  ],
};
