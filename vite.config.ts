import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// AUREV — frontend only. No backend proxy; assets are served from /public.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    // no-store: the sandboxed preview proxy must never hand back a stale
    // document — silent cause of "I don't see the new section" reports.
    headers: { "Cache-Control": "no-store" },
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: true,
    headers: { "Cache-Control": "no-store" },
  },
  build: {
    target: "es2020",
    assetsInlineLimit: 2048,
  },
});
