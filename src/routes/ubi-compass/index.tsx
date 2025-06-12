import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          UBI Compass - Navigate UBI Policy with Data-Driven Analysis
        </title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div
          dangerouslySetInnerHTML={`
          <!-- UBI Compass will be loaded here -->
          <div id="loading">Loading UBI Compass...</div>
          <script>
            // Redirect to static file
            window.location.href = '/public/index.html';
          </script>
        `}
        />
      </body>
    </html>
  );
});

export const head: DocumentHead = {
  title: "UBI Compass - Navigate UBI Policy with Data-Driven Analysis",
  meta: [
    {
      name: "description",
      content:
        "Professional UBI policy analysis tool with comprehensive feasibility metrics and data-driven insights.",
    },
  ],
};
