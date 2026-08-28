import { test as setup, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

/**
 * Setup de autenticación para E2E (ADR-WEB-008).
 *
 * En vez de usar el magic link (frágil de automatizar), este setup:
 * 1. Crea/asegura un usuario de prueba vía Supabase Admin API (service_role)
 * 2. Genera una sesión y la inyecta en el storageState de Playwright
 *
 * Requiere variables de entorno (ver .env.test.local.example):
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - SUPABASE_SERVICE_ROLE_KEY
 * - TEST_USER_EMAIL
 * - TEST_USER_PASSWORD
 */

const authFile = path.join(__dirname, ".auth", "user.json");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TEST_EMAIL = process.env.TEST_USER_EMAIL || "e2e-test@openfinancekit.local";
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || "ofk-e2e-test-pw-2026";

setup("autenticar usuario de prueba", async ({ page }) => {
  if (!SERVICE_KEY) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY. Copia .env.test.local.example a .env.test.local y complétala."
    );
  }

  // 1. Asegurar que el usuario de prueba existe (Admin API)
  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Crear usuario con email ya confirmado (idempotente)
  const { error: createError } = await admin.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
  });

  // Si ya existe, no es error — continuamos (idempotente)
  if (createError && !/already.*(registered|exists)|has already been/i.test(createError.message)) {
    throw new Error(`No se pudo crear usuario de prueba: ${createError.message}`);
  }

  // 2. Iniciar sesión con contraseña para obtener la sesión
  const client = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error: signInError } = await client.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });

  if (signInError || !data.session) {
    throw new Error(`No se pudo iniciar sesión de prueba: ${signInError?.message}`);
  }

  // 3. Inyectar la sesión en el navegador (cookies de Supabase SSR)
  //    La app usa @supabase/ssr que lee la sesión desde cookies.
  const projectRef = new URL(SUPABASE_URL).hostname.split(".")[0];
  const cookieName = `sb-${projectRef}-auth-token`;
  const sessionValue = JSON.stringify(data.session);

  await page.context().addCookies([
    {
      name: cookieName,
      value: encodeURIComponent(`base64-${Buffer.from(sessionValue).toString("base64")}`),
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  // 4. Verificar que la sesión funciona accediendo al dashboard
  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({
    timeout: 15_000,
  });

  // 5. Guardar el estado de autenticación
  fs.mkdirSync(path.dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
