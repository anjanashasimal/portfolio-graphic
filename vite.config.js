import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// Inline PostCSS config so Vite doesn't pick up E:\portfolio\postcss.config.js (Tailwind) from the parent folder.
export default defineConfig({ plugins: [react()], css: { postcss: {} } });
