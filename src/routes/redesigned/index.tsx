import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { UbiCompassRedesigned } from "~/components/ubi-compass-redesigned";

export default component$(() => {
  return (
    <div>
      {/* Make sure Tailwind is loaded */}
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />

      <div
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          background: "linear-gradient(to right, #3b82f6, #4f46e5)",
          color: "white",
          padding: "10px",
          textAlign: "center",
          zIndex: "9999",
          fontWeight: "bold",
        }}
      >
        Redesigned UBI Compass
      </div>
      <div style={{ marginTop: "50px", padding: "20px" }}>
        <UbiCompassRedesigned />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "UBI Compass - Redesigned",
  meta: [
    {
      name: "description",
      content:
        "Modern UBI Compass with redesigned interface for policy analysis",
    },
  ],
};
