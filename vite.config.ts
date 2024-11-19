import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/s3": {
        target: "https://uploads.fitnfi.com", // Replace with actual S3 bucket URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/s3/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
