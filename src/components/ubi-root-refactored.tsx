import { component$ } from "@builder.io/qwik";
import { UbiDataProviderBest } from "./ubi-data-provider-best";
import { UbiCalculationRefactored } from "./ubi-calculation-refactored";

export const UbiRootRefactored = component$(() => {
  console.log("UbiRootRefactored component rendering");

  return (
    <div class="ubi-root-refactored">
      <UbiDataProviderBest>
        <UbiCalculationRefactored />
      </UbiDataProviderBest>
    </div>
  );
});
