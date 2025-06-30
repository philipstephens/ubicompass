//import { component$ } from "@builder.io/qwik";
// import type { DocumentHead } from "@builder.io/qwik-city";
// import UBICompassRedesignedWithConstraints from "~/components/ubi-compass-redesigned-with-constraints";
import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { SimpleTest } from "~/components/simple-test";
import { SimpleConstraints } from "~/components/simple-constraints";

// export default component$(() => {
//   return <MinimalTest />;
// });

export default component$(() => {
  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          background: "blue",
          color: "white",
          padding: "10px",
          textAlign: "center",
          zIndex: "9999",
          fontWeight: "bold",
        }}
      >
        UBI Compass - Optimization Constraints
      </div>

      {/* Main content area */}
      <div style="padding: 60px 20px 20px 20px;">
        <SimpleTest />

        {/* Placeholder for the actual UBI Compass component */}
        <div style="background-color: #f0f0f0; padding: 30px; margin: 20px 0; border-radius: 8px; min-height: 400px; text-align: center;">
          <h2>UBI Compass Component</h2>
          <p>
            This is where your main UBI Compass component would be rendered.
          </p>
          <p>The constraints panel is positioned in the bottom-right corner.</p>
        </div>
      </div>

      {/* Floating constraints panel */}
      <div style="position: fixed; bottom: 20px; right: 20px; z-index: 100; max-width: 350px;">
        <SimpleConstraints />
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "UBI Compass - Optimization Tool",
  meta: [
    {
      name: "description",
      content:
        "Advanced UBI feasibility calculator with optimization constraints",
    },
  ],
};

// export default component$(() => {
//   return (
//     <div>
//       <div
//         style={{
//           position: "fixed",
//           top: "0",
//           left: "0",
//           right: "0",
//           background: "blue",
//           color: "white",
//           padding: "10px",
//           textAlign: "center",
//           zIndex: "9999",
//           fontWeight: "bold",
//         }}
//       >
//         Main Route - Using UBICompassRedesignedWithConstraints
//       </div>
//       <UBICompassRedesignedWithConstraints />
//     </div>
//   );
// });

// export const head: DocumentHead = {
//   title: "UBI Compass - Modern UBI Policy Analysis",
//   meta: [
//     {
//       name: "description",
//       content:
//         "Modern redesigned UBI Compass with triple-handle age slider and improved interface for Universal Basic Income policy analysis.",
//     },
//     {
//       name: "keywords",
//       content:
//         "UBI, Universal Basic Income, policy analysis, redesigned interface, triple slider, modern UI",
//     },
//   ],
// };
