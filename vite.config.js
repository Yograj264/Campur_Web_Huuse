import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
var stdin_default = defineConfig({ plugins: [react(), tailwindcss()], base: "/static/frontend/", server: { proxy: { "/api": "http://127.0.0.1:8000" } } });
export {
  stdin_default as default
};
