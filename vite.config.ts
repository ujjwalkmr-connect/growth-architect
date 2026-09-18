import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { publicContent } from "./scripts/public-content";
const virtualId = "\0virtual:portfolio-content";
export default defineConfig({
  plugins: [
    {
      name: "admin-directory",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url?.split("?")[0].match(/^\/admin\/?$/)) req.url = "/admin/index.html";
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url?.split("?")[0].match(/^\/admin\/?$/)) req.url = "/admin/index.html";
          next();
        });
      },
    },
    {
      name: "published-portfolio-content",
      resolveId(id) {
        if (id === "virtual:portfolio-content") return virtualId;
      },
      load(id) {
        if (id === virtualId)
          return "export default " + JSON.stringify(publicContent(process.cwd()));
      },
      handleHotUpdate(ctx) {
        if (ctx.file.replaceAll("\\", "/").includes("/content/")) {
          const mod = ctx.server.moduleGraph.getModuleById(virtualId);
          if (mod) ctx.server.moduleGraph.invalidateModule(mod);
          ctx.server.ws.send({ type: "full-reload" });
        }
      },
    },
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    proxy: { "/api": { target: "http://127.0.0.1:3003", changeOrigin: false } },
  },
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
});

