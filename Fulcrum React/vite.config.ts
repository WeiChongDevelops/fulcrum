// vite.config.ts or vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import * as path from "path";

export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [
    react(),
    // visualizer({
    //   open: true,
    //   filename: "stats.html",
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "https://fulcrumfinance.app/",
});
