import { defineConfig } from "vite";
import pluginVue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [pluginVue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: "4000",
    hmr: true,
    usePolling: true,
    proxy: {
      "/cbc": {
        target: "http://127.0.0.1:8087",
        changeOrigin: true,
      },
    },
  },
});
