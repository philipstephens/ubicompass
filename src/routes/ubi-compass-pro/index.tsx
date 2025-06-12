import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { UbiCompassEnhanced } from "~/components/ubi-compass-enhanced";

export default component$(() => {
  return (
    <div class="min-h-screen bg-gray-100">
      <UbiCompassEnhanced />
    </div>
  );
});

export const head: DocumentHead = {
  title: "UBI Compass Pro - Professional Policy Analysis with Real Canadian Data",
  meta: [
    {
      name: "description",
      content: "Professional UBI policy analysis powered by 23+ years of real Statistics Canada data. Comprehensive feasibility analysis with GDP context, government budgets, and economic indicators.",
    },
    {
      name: "keywords", 
      content: "UBI, Universal Basic Income, Canada, policy analysis, Statistics Canada, feasibility, GDP, government budget, economic analysis"
    }
  ],
};
