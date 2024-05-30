import { defineConfig } from "vite";
import pluginVue from "@vitejs/plugin-vue";
import path from "path";
import vitePluginCesium from "vite-plugin-cesium";

export default defineConfig({
  plugins: [pluginVue(), vitePluginCesium()],
  define: {
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
  },
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
