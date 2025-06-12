import { component$ } from "@builder.io/qwik";
import { UbiDataProviderDecile } from "./ubi-data-provider-decile";
import { UbiCalculationRefactored } from "./ubi-calculation-refactored";

/**
 * Root component for the UBI calculator using decile-based approach
 */
export const UbiRootDecile = component$(() => {
  console.log("UbiRootDecile component rendering");

  return (
    <div class="ubi-root-decile">
      <UbiDataProviderDecile>
        <UbiCalculationRefactored />
      </UbiDataProviderDecile>
    </div>
  );
});
