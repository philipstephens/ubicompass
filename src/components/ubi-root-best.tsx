import { component$ } from "@builder.io/qwik";
import { UbiDataProviderBest } from "./ubi-data-provider-best";
import { UbiCalculationBest } from "./ubi-calculation-best";

export const UbiRootBest = component$(() => {
  console.log("UbiRootBest component rendering");

  return (
    <div class="ubi-root-best">
      <UbiDataProviderBest>
        <UbiCalculationBest />
      </UbiDataProviderBest>
    </div>
  );
});
