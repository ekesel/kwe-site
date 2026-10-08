import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Backend the dev server proxies to (Docker dev stack sets VITE_API_PROXY=http://backend:8000).
const BACKEND = process.env.VITE_API_PROXY ?? "http://localhost:8000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: Object.fromEntries(["/api", "/media", "/admin", "/static"].map((p) => [p, BACKEND])),
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
