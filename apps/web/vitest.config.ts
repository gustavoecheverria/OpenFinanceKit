import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    globals: true,
    // Solo tests unitarios/integración — excluye E2E de Playwright
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules", ".next", "e2e"],
  },
});
