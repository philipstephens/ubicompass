import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { StatisticsDisplay } from "~/components/statistics-display";

export default component$(() => {
  return (
    <div class="p-4">
      <h1 class="text-3xl font-bold mb-6 text-center text-blue-900">
        Canadian Statistics Dashboard
      </h1>
      <p class="text-gray-600 max-w-3xl mx-auto mb-8 text-center">
        This dashboard displays key Canadian statistics from Statistics Canada data,
        including population demographics and economic indicators.
      </p>
      
      <StatisticsDisplay />
      
      <div class="mt-8 text-sm text-gray-500 text-center">
        <p>Data source: Statistics Canada</p>
        <p>Note: If database connection fails, estimated values will be displayed.</p>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Canadian Statistics Dashboard - UBI Compass",
  meta: [
    {
      name: "description",
      content: "View key Canadian statistics including population demographics and economic indicators from Statistics Canada data.",
    },
  ],
};