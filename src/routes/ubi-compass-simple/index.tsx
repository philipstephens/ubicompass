import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import SimpleUbiCalculator from "../../components/simple-ubi-calculator-clean";

export default component$(() => {
  return <SimpleUbiCalculator />;
});

export const head: DocumentHead = {
  title: "UBI Compass - Comprehensive Policy Analysis with Real Canadian Data",
  meta: [
    {
      name: "description",
      content:
        "Advanced UBI feasibility calculator with real Canadian economic data, multilingual support, and comprehensive policy analysis tools.",
    },
    {
      name: "keywords",
      content:
        "UBI, Universal Basic Income, policy analysis, economics, Canada, multilingual, feasibility calculator, Statistics Canada",
    },
  ],
};
