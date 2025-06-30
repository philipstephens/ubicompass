// vite.config.ts
import { defineConfig } from "file:///E:/programming/Qwik/qwik-csp/node_modules/vite/dist/node/index.js";
import { qwikVite } from "file:///E:/programming/Qwik/qwik-csp/node_modules/@builder.io/qwik/dist/optimizer.mjs";
import { qwikCity } from "file:///E:/programming/Qwik/qwik-csp/node_modules/@builder.io/qwik-city/lib/vite/index.mjs";
import tsconfigPaths from "file:///E:/programming/Qwik/qwik-csp/node_modules/vite-tsconfig-paths/dist/index.mjs";

// package.json
var package_default = {
  name: "ubi-compass",
  description: "Universal Basic Income Policy Analysis Tool - Comprehensive UBI feasibility calculator with real Canadian economic data and multilingual support",
  version: "1.0.0",
  author: "Philip Stephens",
  keywords: [
    "ubi",
    "universal-basic-income",
    "policy-analysis",
    "economics",
    "canada",
    "multilingual",
    "qwik"
  ],
  homepage: "https://github.com/philipstephens/ubi-compass",
  repository: {
    type: "git",
    url: "https://github.com/philipstephens/ubi-compass.git"
  },
  engines: {
    node: "^18.17.0 || ^20.3.0 || >=21.0.0"
  },
  "engines-annotation": "Mostly required by sharp which needs a Node-API v9 compatible runtime",
  private: true,
  type: "module",
  scripts: {
    build: "qwik build",
    "build.client": "vite build",
    "build.preview": "vite build --ssr src/entry.preview.tsx",
    "build.types": "tsc --incremental --noEmit",
    deploy: `echo 'Run "npm run qwik add" to install a server adapter'`,
    dev: "vite --mode ssr",
    "dev.debug": "node --inspect-brk ./node_modules/vite/bin/vite.js --mode ssr --force",
    fmt: "prettier --write .",
    "fmt.check": "prettier --check .",
    lint: 'eslint "src/**/*.ts*"',
    preview: "qwik build preview && vite preview --open",
    start: "vite --open --mode ssr",
    qwik: "qwik",
    test: "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:unit": "vitest run src/tests/unit",
    "test:integration": "vitest run src/tests/integration",
    "test:e2e": "playwright test"
  },
  devDependencies: {
    "@builder.io/qwik": "^1.13.0",
    "@builder.io/qwik-city": "^1.13.0",
    "@playwright/test": "^1.40.0",
    "@types/eslint": "8.56.10",
    "@types/node": "20.14.11",
    "@typescript-eslint/eslint-plugin": "7.16.1",
    "@typescript-eslint/parser": "7.16.1",
    "@vitest/coverage-v8": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    clsx: "^2.1.1",
    eslint: "8.57.0",
    "eslint-plugin-qwik": "^1.13.0",
    jsdom: "^23.0.0",
    prettier: "3.3.3",
    typescript: "5.4.5",
    undici: "*",
    vite: "5.3.5",
    "vite-tsconfig-paths": "^4.2.1",
    vitest: "^1.0.0"
  },
  dependencies: {
    "@tailwindcss/vite": "^4.1.7",
    "@types/pg": "^8.15.3",
    "chart.js": "^4.4.9",
    "csv-parser": "^3.2.0",
    express: "^5.1.0",
    pg: "^8.16.0",
    tailwindcss: "^4.1.7"
  }
};

// vite.config.ts
var { dependencies = {}, devDependencies = {} } = package_default;
errorOnDuplicatesPkgDeps(devDependencies, dependencies);
var vite_config_default = defineConfig(({ command, mode }) => {
  return {
    plugins: [
      qwikCity({
        // Configure static file handling
        staticGenerate: {
          // Allow static files to be served directly
        }
      }),
      qwikVite(),
      tsconfigPaths()
    ],
    // This tells Vite which dependencies to pre-build in dev mode.
    optimizeDeps: {
      // Put problematic deps that break bundling here, mostly those with binaries.
      // For example ['better-sqlite3'] if you use that in server functions.
      exclude: []
    },
    /**
     * This is an advanced setting. It improves the bundling of your server code. To use it, make sure you understand when your consumed packages are dependencies or dev dependencies. (otherwise things will break in production)
     */
    // ssr:
    //   command === "build" && mode === "production"
    //     ? {
    //         // All dev dependencies should be bundled in the server build
    //         noExternal: Object.keys(devDependencies),
    //         // Anything marked as a dependency will not be bundled
    //         // These should only be production binary deps (including deps of deps), CLI deps, and their module graph
    //         // If a dep-of-dep needs to be external, add it here
    //         // For example, if something uses `bcrypt` but you don't have it as a dep, you can write
    //         // external: [...Object.keys(dependencies), 'bcrypt']
    //         external: Object.keys(dependencies),
    //       }
    //     : undefined,
    server: {
      headers: {
        // Don't cache the server response in dev mode
        "Cache-Control": "public, max-age=0"
      },
      middlewareMode: false,
      fs: {
        // Allow serving files from public directory
        allow: [".."]
      }
    },
    preview: {
      headers: {
        // Do cache the server response in preview (non-adapter production build)
        "Cache-Control": "public, max-age=600"
      }
    }
  };
});
function errorOnDuplicatesPkgDeps(devDependencies2, dependencies2) {
  let msg = "";
  const duplicateDeps = Object.keys(devDependencies2).filter(
    (dep) => dependencies2[dep]
  );
  const qwikPkg = Object.keys(dependencies2).filter(
    (value) => /qwik/i.test(value)
  );
  msg = `Move qwik packages ${qwikPkg.join(", ")} to devDependencies`;
  if (qwikPkg.length > 0) {
    throw new Error(msg);
  }
  msg = `
    Warning: The dependency "${duplicateDeps.join(", ")}" is listed in both "devDependencies" and "dependencies".
    Please move the duplicated dependencies to "devDependencies" only and remove it from "dependencies"
  `;
  if (duplicateDeps.length > 0) {
    throw new Error(msg);
  }
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxccHJvZ3JhbW1pbmdcXFxcUXdpa1xcXFxxd2lrLWNzcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxccHJvZ3JhbW1pbmdcXFxcUXdpa1xcXFxxd2lrLWNzcFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovcHJvZ3JhbW1pbmcvUXdpay9xd2lrLWNzcC92aXRlLmNvbmZpZy50c1wiOy8qKlxuICogVGhpcyBpcyB0aGUgYmFzZSBjb25maWcgZm9yIHZpdGUuXG4gKiBXaGVuIGJ1aWxkaW5nLCB0aGUgYWRhcHRlciBjb25maWcgaXMgdXNlZCB3aGljaCBsb2FkcyB0aGlzIGZpbGUgYW5kIGV4dGVuZHMgaXQuXG4gKi9cbmltcG9ydCB7IGRlZmluZUNvbmZpZywgdHlwZSBVc2VyQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IHF3aWtWaXRlIH0gZnJvbSBcIkBidWlsZGVyLmlvL3F3aWsvb3B0aW1pemVyXCI7XG5pbXBvcnQgeyBxd2lrQ2l0eSB9IGZyb20gXCJAYnVpbGRlci5pby9xd2lrLWNpdHkvdml0ZVwiO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcbmltcG9ydCBwa2cgZnJvbSBcIi4vcGFja2FnZS5qc29uXCI7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSAnQHRhaWx3aW5kY3NzL3ZpdGUnXG5cbnR5cGUgUGtnRGVwID0gUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbmNvbnN0IHsgZGVwZW5kZW5jaWVzID0ge30sIGRldkRlcGVuZGVuY2llcyA9IHt9IH0gPSBwa2cgYXMgYW55IGFzIHtcbiAgZGVwZW5kZW5jaWVzOiBQa2dEZXA7XG4gIGRldkRlcGVuZGVuY2llczogUGtnRGVwO1xuICBba2V5OiBzdHJpbmddOiB1bmtub3duO1xufTtcbmVycm9yT25EdXBsaWNhdGVzUGtnRGVwcyhkZXZEZXBlbmRlbmNpZXMsIGRlcGVuZGVuY2llcyk7XG5cbi8qKlxuICogTm90ZSB0aGF0IFZpdGUgbm9ybWFsbHkgc3RhcnRzIGZyb20gYGluZGV4Lmh0bWxgIGJ1dCB0aGUgcXdpa0NpdHkgcGx1Z2luIG1ha2VzIHN0YXJ0IGF0IGBzcmMvZW50cnkuc3NyLnRzeGAgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IGNvbW1hbmQsIG1vZGUgfSk6IFVzZXJDb25maWcgPT4ge1xuICByZXR1cm4ge1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHF3aWtDaXR5KHtcbiAgICAgICAgLy8gQ29uZmlndXJlIHN0YXRpYyBmaWxlIGhhbmRsaW5nXG4gICAgICAgIHN0YXRpY0dlbmVyYXRlOiB7XG4gICAgICAgICAgLy8gQWxsb3cgc3RhdGljIGZpbGVzIHRvIGJlIHNlcnZlZCBkaXJlY3RseVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHF3aWtWaXRlKCksXG4gICAgICB0c2NvbmZpZ1BhdGhzKClcbiAgICBdLFxuICAgIC8vIFRoaXMgdGVsbHMgVml0ZSB3aGljaCBkZXBlbmRlbmNpZXMgdG8gcHJlLWJ1aWxkIGluIGRldiBtb2RlLlxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgLy8gUHV0IHByb2JsZW1hdGljIGRlcHMgdGhhdCBicmVhayBidW5kbGluZyBoZXJlLCBtb3N0bHkgdGhvc2Ugd2l0aCBiaW5hcmllcy5cbiAgICAgIC8vIEZvciBleGFtcGxlIFsnYmV0dGVyLXNxbGl0ZTMnXSBpZiB5b3UgdXNlIHRoYXQgaW4gc2VydmVyIGZ1bmN0aW9ucy5cbiAgICAgIGV4Y2x1ZGU6IFtdLFxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGFuIGFkdmFuY2VkIHNldHRpbmcuIEl0IGltcHJvdmVzIHRoZSBidW5kbGluZyBvZiB5b3VyIHNlcnZlciBjb2RlLiBUbyB1c2UgaXQsIG1ha2Ugc3VyZSB5b3UgdW5kZXJzdGFuZCB3aGVuIHlvdXIgY29uc3VtZWQgcGFja2FnZXMgYXJlIGRlcGVuZGVuY2llcyBvciBkZXYgZGVwZW5kZW5jaWVzLiAob3RoZXJ3aXNlIHRoaW5ncyB3aWxsIGJyZWFrIGluIHByb2R1Y3Rpb24pXG4gICAgICovXG4gICAgLy8gc3NyOlxuICAgIC8vICAgY29tbWFuZCA9PT0gXCJidWlsZFwiICYmIG1vZGUgPT09IFwicHJvZHVjdGlvblwiXG4gICAgLy8gICAgID8ge1xuICAgIC8vICAgICAgICAgLy8gQWxsIGRldiBkZXBlbmRlbmNpZXMgc2hvdWxkIGJlIGJ1bmRsZWQgaW4gdGhlIHNlcnZlciBidWlsZFxuICAgIC8vICAgICAgICAgbm9FeHRlcm5hbDogT2JqZWN0LmtleXMoZGV2RGVwZW5kZW5jaWVzKSxcbiAgICAvLyAgICAgICAgIC8vIEFueXRoaW5nIG1hcmtlZCBhcyBhIGRlcGVuZGVuY3kgd2lsbCBub3QgYmUgYnVuZGxlZFxuICAgIC8vICAgICAgICAgLy8gVGhlc2Ugc2hvdWxkIG9ubHkgYmUgcHJvZHVjdGlvbiBiaW5hcnkgZGVwcyAoaW5jbHVkaW5nIGRlcHMgb2YgZGVwcyksIENMSSBkZXBzLCBhbmQgdGhlaXIgbW9kdWxlIGdyYXBoXG4gICAgLy8gICAgICAgICAvLyBJZiBhIGRlcC1vZi1kZXAgbmVlZHMgdG8gYmUgZXh0ZXJuYWwsIGFkZCBpdCBoZXJlXG4gICAgLy8gICAgICAgICAvLyBGb3IgZXhhbXBsZSwgaWYgc29tZXRoaW5nIHVzZXMgYGJjcnlwdGAgYnV0IHlvdSBkb24ndCBoYXZlIGl0IGFzIGEgZGVwLCB5b3UgY2FuIHdyaXRlXG4gICAgLy8gICAgICAgICAvLyBleHRlcm5hbDogWy4uLk9iamVjdC5rZXlzKGRlcGVuZGVuY2llcyksICdiY3J5cHQnXVxuICAgIC8vICAgICAgICAgZXh0ZXJuYWw6IE9iamVjdC5rZXlzKGRlcGVuZGVuY2llcyksXG4gICAgLy8gICAgICAgfVxuICAgIC8vICAgICA6IHVuZGVmaW5lZCxcblxuICAgIHNlcnZlcjoge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAvLyBEb24ndCBjYWNoZSB0aGUgc2VydmVyIHJlc3BvbnNlIGluIGRldiBtb2RlXG4gICAgICAgIFwiQ2FjaGUtQ29udHJvbFwiOiBcInB1YmxpYywgbWF4LWFnZT0wXCIsXG4gICAgICB9LFxuICAgICAgbWlkZGxld2FyZU1vZGU6IGZhbHNlLFxuICAgICAgZnM6IHtcbiAgICAgICAgLy8gQWxsb3cgc2VydmluZyBmaWxlcyBmcm9tIHB1YmxpYyBkaXJlY3RvcnlcbiAgICAgICAgYWxsb3c6IFsnLi4nXVxuICAgICAgfVxuICAgIH0sXG4gICAgcHJldmlldzoge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAvLyBEbyBjYWNoZSB0aGUgc2VydmVyIHJlc3BvbnNlIGluIHByZXZpZXcgKG5vbi1hZGFwdGVyIHByb2R1Y3Rpb24gYnVpbGQpXG4gICAgICAgIFwiQ2FjaGUtQ29udHJvbFwiOiBcInB1YmxpYywgbWF4LWFnZT02MDBcIixcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn0pO1xuXG4vLyAqKiogdXRpbHMgKioqXG5cbi8qKlxuICogRnVuY3Rpb24gdG8gaWRlbnRpZnkgZHVwbGljYXRlIGRlcGVuZGVuY2llcyBhbmQgdGhyb3cgYW4gZXJyb3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXZEZXBlbmRlbmNpZXMgLSBMaXN0IG9mIGRldmVsb3BtZW50IGRlcGVuZGVuY2llc1xuICogQHBhcmFtIHtPYmplY3R9IGRlcGVuZGVuY2llcyAtIExpc3Qgb2YgcHJvZHVjdGlvbiBkZXBlbmRlbmNpZXNcbiAqL1xuZnVuY3Rpb24gZXJyb3JPbkR1cGxpY2F0ZXNQa2dEZXBzKFxuICBkZXZEZXBlbmRlbmNpZXM6IFBrZ0RlcCxcbiAgZGVwZW5kZW5jaWVzOiBQa2dEZXAsXG4pIHtcbiAgbGV0IG1zZyA9IFwiXCI7XG4gIC8vIENyZWF0ZSBhbiBhcnJheSAnZHVwbGljYXRlRGVwcycgYnkgZmlsdGVyaW5nIGRldkRlcGVuZGVuY2llcy5cbiAgLy8gSWYgYSBkZXBlbmRlbmN5IGFsc28gZXhpc3RzIGluIGRlcGVuZGVuY2llcywgaXQgaXMgY29uc2lkZXJlZCBhIGR1cGxpY2F0ZS5cbiAgY29uc3QgZHVwbGljYXRlRGVwcyA9IE9iamVjdC5rZXlzKGRldkRlcGVuZGVuY2llcykuZmlsdGVyKFxuICAgIChkZXApID0+IGRlcGVuZGVuY2llc1tkZXBdLFxuICApO1xuXG4gIC8vIGluY2x1ZGUgYW55IGtub3duIHF3aWsgcGFja2FnZXNcbiAgY29uc3QgcXdpa1BrZyA9IE9iamVjdC5rZXlzKGRlcGVuZGVuY2llcykuZmlsdGVyKCh2YWx1ZSkgPT5cbiAgICAvcXdpay9pLnRlc3QodmFsdWUpLFxuICApO1xuXG4gIC8vIGFueSBlcnJvcnMgZm9yIG1pc3NpbmcgXCJxd2lrLWNpdHktcGxhblwiXG4gIC8vIFtQTFVHSU5fRVJST1JdOiBJbnZhbGlkIG1vZHVsZSBcIkBxd2lrLWNpdHktcGxhblwiIGlzIG5vdCBhIHZhbGlkIHBhY2thZ2VcbiAgbXNnID0gYE1vdmUgcXdpayBwYWNrYWdlcyAke3F3aWtQa2cuam9pbihcIiwgXCIpfSB0byBkZXZEZXBlbmRlbmNpZXNgO1xuXG4gIGlmIChxd2lrUGtnLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgfVxuXG4gIC8vIEZvcm1hdCB0aGUgZXJyb3IgbWVzc2FnZSB3aXRoIHRoZSBkdXBsaWNhdGVzIGxpc3QuXG4gIC8vIFRoZSBgam9pbmAgZnVuY3Rpb24gaXMgdXNlZCB0byByZXByZXNlbnQgdGhlIGVsZW1lbnRzIG9mIHRoZSAnZHVwbGljYXRlRGVwcycgYXJyYXkgYXMgYSBjb21tYS1zZXBhcmF0ZWQgc3RyaW5nLlxuICBtc2cgPSBgXG4gICAgV2FybmluZzogVGhlIGRlcGVuZGVuY3kgXCIke2R1cGxpY2F0ZURlcHMuam9pbihcIiwgXCIpfVwiIGlzIGxpc3RlZCBpbiBib3RoIFwiZGV2RGVwZW5kZW5jaWVzXCIgYW5kIFwiZGVwZW5kZW5jaWVzXCIuXG4gICAgUGxlYXNlIG1vdmUgdGhlIGR1cGxpY2F0ZWQgZGVwZW5kZW5jaWVzIHRvIFwiZGV2RGVwZW5kZW5jaWVzXCIgb25seSBhbmQgcmVtb3ZlIGl0IGZyb20gXCJkZXBlbmRlbmNpZXNcIlxuICBgO1xuXG4gIC8vIFRocm93IGFuIGVycm9yIHdpdGggdGhlIGNvbnN0cnVjdGVkIG1lc3NhZ2UuXG4gIGlmIChkdXBsaWNhdGVEZXBzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgfVxufVxuIiwgIntcbiAgXCJuYW1lXCI6IFwidWJpLWNvbXBhc3NcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIlVuaXZlcnNhbCBCYXNpYyBJbmNvbWUgUG9saWN5IEFuYWx5c2lzIFRvb2wgLSBDb21wcmVoZW5zaXZlIFVCSSBmZWFzaWJpbGl0eSBjYWxjdWxhdG9yIHdpdGggcmVhbCBDYW5hZGlhbiBlY29ub21pYyBkYXRhIGFuZCBtdWx0aWxpbmd1YWwgc3VwcG9ydFwiLFxuICBcInZlcnNpb25cIjogXCIxLjAuMFwiLFxuICBcImF1dGhvclwiOiBcIlBoaWxpcCBTdGVwaGVuc1wiLFxuICBcImtleXdvcmRzXCI6IFtcbiAgICBcInViaVwiLFxuICAgIFwidW5pdmVyc2FsLWJhc2ljLWluY29tZVwiLFxuICAgIFwicG9saWN5LWFuYWx5c2lzXCIsXG4gICAgXCJlY29ub21pY3NcIixcbiAgICBcImNhbmFkYVwiLFxuICAgIFwibXVsdGlsaW5ndWFsXCIsXG4gICAgXCJxd2lrXCJcbiAgXSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9waGlsaXBzdGVwaGVucy91YmktY29tcGFzc1wiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL3BoaWxpcHN0ZXBoZW5zL3ViaS1jb21wYXNzLmdpdFwiXG4gIH0sXG4gIFwiZW5naW5lc1wiOiB7XG4gICAgXCJub2RlXCI6IFwiXjE4LjE3LjAgfHwgXjIwLjMuMCB8fCA+PTIxLjAuMFwiXG4gIH0sXG4gIFwiZW5naW5lcy1hbm5vdGF0aW9uXCI6IFwiTW9zdGx5IHJlcXVpcmVkIGJ5IHNoYXJwIHdoaWNoIG5lZWRzIGEgTm9kZS1BUEkgdjkgY29tcGF0aWJsZSBydW50aW1lXCIsXG4gIFwicHJpdmF0ZVwiOiB0cnVlLFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwicXdpayBidWlsZFwiLFxuICAgIFwiYnVpbGQuY2xpZW50XCI6IFwidml0ZSBidWlsZFwiLFxuICAgIFwiYnVpbGQucHJldmlld1wiOiBcInZpdGUgYnVpbGQgLS1zc3Igc3JjL2VudHJ5LnByZXZpZXcudHN4XCIsXG4gICAgXCJidWlsZC50eXBlc1wiOiBcInRzYyAtLWluY3JlbWVudGFsIC0tbm9FbWl0XCIsXG4gICAgXCJkZXBsb3lcIjogXCJlY2hvICdSdW4gXFxcIm5wbSBydW4gcXdpayBhZGRcXFwiIHRvIGluc3RhbGwgYSBzZXJ2ZXIgYWRhcHRlcidcIixcbiAgICBcImRldlwiOiBcInZpdGUgLS1tb2RlIHNzclwiLFxuICAgIFwiZGV2LmRlYnVnXCI6IFwibm9kZSAtLWluc3BlY3QtYnJrIC4vbm9kZV9tb2R1bGVzL3ZpdGUvYmluL3ZpdGUuanMgLS1tb2RlIHNzciAtLWZvcmNlXCIsXG4gICAgXCJmbXRcIjogXCJwcmV0dGllciAtLXdyaXRlIC5cIixcbiAgICBcImZtdC5jaGVja1wiOiBcInByZXR0aWVyIC0tY2hlY2sgLlwiLFxuICAgIFwibGludFwiOiBcImVzbGludCBcXFwic3JjLyoqLyoudHMqXFxcIlwiLFxuICAgIFwicHJldmlld1wiOiBcInF3aWsgYnVpbGQgcHJldmlldyAmJiB2aXRlIHByZXZpZXcgLS1vcGVuXCIsXG4gICAgXCJzdGFydFwiOiBcInZpdGUgLS1vcGVuIC0tbW9kZSBzc3JcIixcbiAgICBcInF3aWtcIjogXCJxd2lrXCIsXG4gICAgXCJ0ZXN0XCI6IFwidml0ZXN0XCIsXG4gICAgXCJ0ZXN0OnVpXCI6IFwidml0ZXN0IC0tdWlcIixcbiAgICBcInRlc3Q6cnVuXCI6IFwidml0ZXN0IHJ1blwiLFxuICAgIFwidGVzdDpjb3ZlcmFnZVwiOiBcInZpdGVzdCBydW4gLS1jb3ZlcmFnZVwiLFxuICAgIFwidGVzdDp3YXRjaFwiOiBcInZpdGVzdCAtLXdhdGNoXCIsXG4gICAgXCJ0ZXN0OnVuaXRcIjogXCJ2aXRlc3QgcnVuIHNyYy90ZXN0cy91bml0XCIsXG4gICAgXCJ0ZXN0OmludGVncmF0aW9uXCI6IFwidml0ZXN0IHJ1biBzcmMvdGVzdHMvaW50ZWdyYXRpb25cIixcbiAgICBcInRlc3Q6ZTJlXCI6IFwicGxheXdyaWdodCB0ZXN0XCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGJ1aWxkZXIuaW8vcXdpa1wiOiBcIl4xLjEzLjBcIixcbiAgICBcIkBidWlsZGVyLmlvL3F3aWstY2l0eVwiOiBcIl4xLjEzLjBcIixcbiAgICBcIkBwbGF5d3JpZ2h0L3Rlc3RcIjogXCJeMS40MC4wXCIsXG4gICAgXCJAdHlwZXMvZXNsaW50XCI6IFwiOC41Ni4xMFwiLFxuICAgIFwiQHR5cGVzL25vZGVcIjogXCIyMC4xNC4xMVwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5cIjogXCI3LjE2LjFcIixcbiAgICBcIkB0eXBlc2NyaXB0LWVzbGludC9wYXJzZXJcIjogXCI3LjE2LjFcIixcbiAgICBcIkB2aXRlc3QvY292ZXJhZ2UtdjhcIjogXCJeMS4wLjBcIixcbiAgICBcIkB2aXRlc3QvdWlcIjogXCJeMS4wLjBcIixcbiAgICBcImNsc3hcIjogXCJeMi4xLjFcIixcbiAgICBcImVzbGludFwiOiBcIjguNTcuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1xd2lrXCI6IFwiXjEuMTMuMFwiLFxuICAgIFwianNkb21cIjogXCJeMjMuMC4wXCIsXG4gICAgXCJwcmV0dGllclwiOiBcIjMuMy4zXCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiNS40LjVcIixcbiAgICBcInVuZGljaVwiOiBcIipcIixcbiAgICBcInZpdGVcIjogXCI1LjMuNVwiLFxuICAgIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiOiBcIl40LjIuMVwiLFxuICAgIFwidml0ZXN0XCI6IFwiXjEuMC4wXCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQHRhaWx3aW5kY3NzL3ZpdGVcIjogXCJeNC4xLjdcIixcbiAgICBcIkB0eXBlcy9wZ1wiOiBcIl44LjE1LjNcIixcbiAgICBcImNoYXJ0LmpzXCI6IFwiXjQuNC45XCIsXG4gICAgXCJjc3YtcGFyc2VyXCI6IFwiXjMuMi4wXCIsXG4gICAgXCJleHByZXNzXCI6IFwiXjUuMS4wXCIsXG4gICAgXCJwZ1wiOiBcIl44LjE2LjBcIixcbiAgICBcInRhaWx3aW5kY3NzXCI6IFwiXjQuMS43XCJcbiAgfVxufVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUlBLFNBQVMsb0JBQXFDO0FBQzlDLFNBQVMsZ0JBQWdCO0FBQ3pCLFNBQVMsZ0JBQWdCO0FBQ3pCLE9BQU8sbUJBQW1COzs7QUNQMUI7QUFBQSxFQUNFLE1BQVE7QUFBQSxFQUNSLGFBQWU7QUFBQSxFQUNmLFNBQVc7QUFBQSxFQUNYLFFBQVU7QUFBQSxFQUNWLFVBQVk7QUFBQSxJQUNWO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsRUFDRjtBQUFBLEVBQ0EsVUFBWTtBQUFBLEVBQ1osWUFBYztBQUFBLElBQ1osTUFBUTtBQUFBLElBQ1IsS0FBTztBQUFBLEVBQ1Q7QUFBQSxFQUNBLFNBQVc7QUFBQSxJQUNULE1BQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxzQkFBc0I7QUFBQSxFQUN0QixTQUFXO0FBQUEsRUFDWCxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsSUFDVCxPQUFTO0FBQUEsSUFDVCxnQkFBZ0I7QUFBQSxJQUNoQixpQkFBaUI7QUFBQSxJQUNqQixlQUFlO0FBQUEsSUFDZixRQUFVO0FBQUEsSUFDVixLQUFPO0FBQUEsSUFDUCxhQUFhO0FBQUEsSUFDYixLQUFPO0FBQUEsSUFDUCxhQUFhO0FBQUEsSUFDYixNQUFRO0FBQUEsSUFDUixTQUFXO0FBQUEsSUFDWCxPQUFTO0FBQUEsSUFDVCxNQUFRO0FBQUEsSUFDUixNQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxZQUFZO0FBQUEsSUFDWixpQkFBaUI7QUFBQSxJQUNqQixjQUFjO0FBQUEsSUFDZCxhQUFhO0FBQUEsSUFDYixvQkFBb0I7QUFBQSxJQUNwQixZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0EsaUJBQW1CO0FBQUEsSUFDakIsb0JBQW9CO0FBQUEsSUFDcEIseUJBQXlCO0FBQUEsSUFDekIsb0JBQW9CO0FBQUEsSUFDcEIsaUJBQWlCO0FBQUEsSUFDakIsZUFBZTtBQUFBLElBQ2Ysb0NBQW9DO0FBQUEsSUFDcEMsNkJBQTZCO0FBQUEsSUFDN0IsdUJBQXVCO0FBQUEsSUFDdkIsY0FBYztBQUFBLElBQ2QsTUFBUTtBQUFBLElBQ1IsUUFBVTtBQUFBLElBQ1Ysc0JBQXNCO0FBQUEsSUFDdEIsT0FBUztBQUFBLElBQ1QsVUFBWTtBQUFBLElBQ1osWUFBYztBQUFBLElBQ2QsUUFBVTtBQUFBLElBQ1YsTUFBUTtBQUFBLElBQ1IsdUJBQXVCO0FBQUEsSUFDdkIsUUFBVTtBQUFBLEVBQ1o7QUFBQSxFQUNBLGNBQWdCO0FBQUEsSUFDZCxxQkFBcUI7QUFBQSxJQUNyQixhQUFhO0FBQUEsSUFDYixZQUFZO0FBQUEsSUFDWixjQUFjO0FBQUEsSUFDZCxTQUFXO0FBQUEsSUFDWCxJQUFNO0FBQUEsSUFDTixhQUFlO0FBQUEsRUFDakI7QUFDRjs7O0FEbEVBLElBQU0sRUFBRSxlQUFlLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLElBQUk7QUFLcEQseUJBQXlCLGlCQUFpQixZQUFZO0FBS3RELElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsU0FBUyxLQUFLLE1BQWtCO0FBQzdELFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQTtBQUFBLFFBRVAsZ0JBQWdCO0FBQUE7QUFBQSxRQUVoQjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsU0FBUztBQUFBLE1BQ1QsY0FBYztBQUFBLElBQ2hCO0FBQUE7QUFBQSxJQUVBLGNBQWM7QUFBQTtBQUFBO0FBQUEsTUFHWixTQUFTLENBQUM7QUFBQSxJQUNaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQW1CQSxRQUFRO0FBQUEsTUFDTixTQUFTO0FBQUE7QUFBQSxRQUVQLGlCQUFpQjtBQUFBLE1BQ25CO0FBQUEsTUFDQSxnQkFBZ0I7QUFBQSxNQUNoQixJQUFJO0FBQUE7QUFBQSxRQUVGLE9BQU8sQ0FBQyxJQUFJO0FBQUEsTUFDZDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQTtBQUFBLFFBRVAsaUJBQWlCO0FBQUEsTUFDbkI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7QUFTRCxTQUFTLHlCQUNQQSxrQkFDQUMsZUFDQTtBQUNBLE1BQUksTUFBTTtBQUdWLFFBQU0sZ0JBQWdCLE9BQU8sS0FBS0QsZ0JBQWUsRUFBRTtBQUFBLElBQ2pELENBQUMsUUFBUUMsY0FBYSxHQUFHO0FBQUEsRUFDM0I7QUFHQSxRQUFNLFVBQVUsT0FBTyxLQUFLQSxhQUFZLEVBQUU7QUFBQSxJQUFPLENBQUMsVUFDaEQsUUFBUSxLQUFLLEtBQUs7QUFBQSxFQUNwQjtBQUlBLFFBQU0sc0JBQXNCLFFBQVEsS0FBSyxJQUFJLENBQUM7QUFFOUMsTUFBSSxRQUFRLFNBQVMsR0FBRztBQUN0QixVQUFNLElBQUksTUFBTSxHQUFHO0FBQUEsRUFDckI7QUFJQSxRQUFNO0FBQUEsK0JBQ3VCLGNBQWMsS0FBSyxJQUFJLENBQUM7QUFBQTtBQUFBO0FBS3JELE1BQUksY0FBYyxTQUFTLEdBQUc7QUFDNUIsVUFBTSxJQUFJLE1BQU0sR0FBRztBQUFBLEVBQ3JCO0FBQ0Y7IiwKICAibmFtZXMiOiBbImRldkRlcGVuZGVuY2llcyIsICJkZXBlbmRlbmNpZXMiXQp9Cg==
