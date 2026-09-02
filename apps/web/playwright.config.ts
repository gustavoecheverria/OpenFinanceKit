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

  // Reportes: HTML navegable + salida en consola. El HTML queda en qa/reports.
  reporter: [
    ["html", { outputFolder: "../../qa/reports/playwright", open: "never" }],
    [process.env.CI ? "github" : "list"],
  ],

  // Carpeta de artefactos (screenshots, videos, traces) — evidencia en qa/.
  outputDir: "../../qa/evidence/e2e",

  use: {
    baseURL: "http://localhost:3000",
    screenshot: "on",  // captura al inicio y fin de cada test
    video: "on",       // graba video completo de cada test
    trace: "on",       // trace completo: cada acción, screenshot, red y DOM
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
    {
      // OFK Web es mobile-first: validar también en viewport móvil
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
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
