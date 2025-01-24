import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/manifest.json": {
        target: "http://shishir.localhost:5173",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/manifest.json/, "/manifest.json"),
      },
    },
  },
});
