import { vercelAdapter } from "@builder.io/qwik-city/adapters/vercel/vite";
import { extendConfig } from "@builder.io/qwik-city/vite";
import baseConfig from "../../vite.config";

export default extendConfig(baseConfig, () => {
  return {
    build: {
      ssr: true,
      rollupOptions: {
        input: ["src/entry.vercel.tsx", "@qwik-city-plan"],
      },
    },
    plugins: [vercelAdapter()],
  };
});
