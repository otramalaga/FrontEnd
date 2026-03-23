import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("leaflet") || id.includes("react-leaflet")) {
            return "map-vendor";
          }
          if (id.includes("@fortawesome") || id.includes("react-icons")) {
            return "icons-vendor";
          }
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup/setupTests.js",
  },
});
