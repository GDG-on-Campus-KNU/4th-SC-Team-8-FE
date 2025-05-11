import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //==============================Proxy<RemoveLater>==============================
  server: {
    proxy: {
      "/api": {
        target: "http://34.64.111.10:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  //==============================Proxy<RemoveLater>==============================
});
