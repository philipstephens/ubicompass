import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { UbiCompassRedesigned } from "~/components/ubi-compass-redesigned";

export default component$(() => {
  return (
    <div>
      <h1>Hello World - Vercel Test</h1>
      <p>If you can see this, the deployment is working!</p>
      <UbiCompassRedesigned />
    </div>
  );
});

export const head: DocumentHead = {
  title: "UBI Compass - Universal Basic Income Policy Analysis Tool",
  meta: [
    {
      name: "description",
      content:
        "Analyze Universal Basic Income policies with advanced modeling, genetic algorithm optimization, and real-time fiscal impact calculations. Free, open-source tool for UBI research and policy development.",
    },
    {
      name: "keywords",
      content:
        "UBI, Universal Basic Income, policy analysis, genetic algorithm, optimization, fiscal impact, Canada, basic income, social policy, economic modeling",
    },
    {
      name: "author",
      content: "UBI Compass",
    },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
    {
      property: "og:title",
      content: "UBI Compass - Universal Basic Income Policy Analysis",
    },
    {
      property: "og:description",
      content:
        "Free, comprehensive tool for analyzing Universal Basic Income policies with advanced modeling and optimization algorithms.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://ubicompass.info",
    },
    {
      property: "og:site_name",
      content: "UBI Compass",
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: "UBI Compass - UBI Policy Analysis Tool",
    },
    {
      name: "twitter:description",
      content:
        "Analyze Universal Basic Income policies with advanced modeling and optimization. Free, open-source research tool.",
    },
    {
      name: "robots",
      content: "index, follow",
    },
    {
      name: "language",
      content: "en",
    },
    {
      name: "theme-color",
      content: "#8b5cf6",
    },
  ],
};
