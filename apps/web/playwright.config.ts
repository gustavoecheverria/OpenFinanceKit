import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

// Carga variables de entorno para tests (service key, credenciales de prueba)
loadEnv({ path: ".env.test.local" });

/**
 * Configuración de Playwright para tests E2E de OFK Web.
 * Los tests viven en ./e2e y corren contra el dev server local.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false, // Tests comparten un usuario de prueba — evitar carreras
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [
    // Setup: crea la sesión autenticada antes de los tests
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Reutiliza la sesión creada en el setup
        storageState: "e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],

  // Levanta el dev server automáticamente si no está corriendo
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000/login",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
