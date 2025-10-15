import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-slick', 'slick-carousel']
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Node.js backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
