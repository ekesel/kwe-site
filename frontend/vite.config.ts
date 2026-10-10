import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

// Backend the dev server proxies to (Docker dev stack sets VITE_API_PROXY=http://backend:8000).
const BACKEND = process.env.VITE_API_PROXY ?? "http://localhost:8000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: Object.fromEntries(["/api", "/media", "/admin", "/static"].map((p) => [p, {
      target: BACKEND,
      // files shipped in public/ (e.g. /media/hero.mp4) are served by Vite, uploads by the backend
      bypass: (req: { url?: string }) => (req.url && fs.existsSync(path.join(__dirname, "public", req.url.split("?")[0])) ? req.url : undefined),
    }])),
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
