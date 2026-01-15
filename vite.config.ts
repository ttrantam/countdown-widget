import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { viteStaticCopy } from "vite-plugin-static-copy";

import type { Plugin } from "vite";

function forbidImagesPlugin(): Plugin {
  return {
    name: "forbid-images",
    enforce: "pre",
    resolveId(source) {
      if (/\.(png|jpe?g)$/i.test(source)) {
        throw new Error(`❌ Image files are not allowed: ${source}`);
      }
      return null;
    },
  };
}

export default defineConfig({
  publicDir: false,
  plugins: [
    react(),
    viteSingleFile(),
    forbidImagesPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: "src/config/widget-config.json",
          dest: ".",
        },
      ],
    }),
  ],
});
