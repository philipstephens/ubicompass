import { component$ } from "@builder.io/qwik";
import { UbiDataProvider } from "./ubi-data-provider-simple";
import { UbiCalculationSimple } from "./ubi-calculation-simple";
import { SuperSimple } from "./super-simple";
import { InsideProvider } from "./inside-provider";
import { MinimalProvider } from "./minimal-provider";

export const UbiRoot = component$(() => {
  console.log("UbiRoot component rendering");

  return (
    <div>
      <div style="background-color: yellow; padding: 5px; margin-bottom: 10px;">
        <h3>UBI Root Component</h3>
        <p>
          If you can see this, the UbiRoot component is rendering correctly.
        </p>
      </div>

      <SuperSimple />

      <UbiDataProvider>
        <InsideProvider />
      </UbiDataProvider>

      <MinimalProvider>
        <InsideProvider />
        <UbiCalculationSimple />
      </MinimalProvider>
    </div>
  );
});
