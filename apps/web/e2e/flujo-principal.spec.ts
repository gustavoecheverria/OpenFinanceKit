import { test, expect } from "@playwright/test";

/**
 * Test E2E del flujo principal de OFK Web.
 *
 * Genera evidencia paso a paso:
 * - Screenshot nombrado en cada acción clave
 * - Trace completo (timeline de acciones, DOM, red)
 * - Video de toda la ejecución
 *
 * Estructura de evidencia generada:
 * qa/evidence/e2e/<nombre-test>/
 *   ├── 01-pagina-config.png
 *   ├── 02-categoria-ingreso-creada.png
 *   ├── 03-categoria-gasto-creada.png
 *   ├── 04-cuenta-creada.png
 *   ├── 05-formulario-ingreso.png
 *   ├── 06-ingreso-guardado.png
 *   ├── 07-formulario-gasto.png
 *   ├── 08-gasto-guardado.png
 *   ├── 09-dashboard-final.png
 *   └── test-finished-1.png  (automático de Playwright)
 */

const run = Date.now().toString().slice(-6);
const CATEGORIA_INGRESO = `Sueldo-${run}`;
const CATEGORIA_GASTO = `Comida-${run}`;
const CUENTA = `Banco-${run}`;
const DESC_INGRESO = `ingreso-e2e-${run}`;
const DESC_GASTO = `gasto-e2e-${run}`;

test.describe("Flujo principal — config → captura → dashboard", () => {
  test("configurar, registrar y verificar el flujo completo", async ({
    page,
  }) => {
    // ── PASO 1: Ir a Configuración ────────────────────────────────────
    await page.goto("/config");
    await expect(
      page.getByRole("heading", { name: "Configuración" })
    ).toBeVisible();
    await page.screenshot({
      path: "../../qa/evidence/steps/01-pagina-config.png",
    });

    // ── PASO 2: Crear categoría de ingreso ────────────────────────────
    await page.locator('input[name="nombre"]').first().fill(CATEGORIA_INGRESO);
    await page.locator('select[name="tipo"]').selectOption("Ingreso");
    await page.screenshot({
      path: "../../qa/evidence/steps/02-formulario-categoria-ingreso.png",
    });
    await page
      .locator("form")
      .filter({ has: page.locator('select[name="tipo"]') })
      .getByRole("button")
      .click();
    await expect(page.getByText(CATEGORIA_INGRESO)).toBeVisible();
    await page.screenshot({
      path: "../../qa/evidence/steps/03-categoria-ingreso-creada.png",
    });

    // ── PASO 3: Crear categoría de gasto ─────────────────────────────
    await page.locator('input[name="nombre"]').first().fill(CATEGORIA_GASTO);
    await page.locator('select[name="tipo"]').selectOption("Gasto");
    await page
      .locator("form")
      .filter({ has: page.locator('select[name="tipo"]') })
      .getByRole("button")
      .click();
    await expect(page.getByText(CATEGORIA_GASTO)).toBeVisible();
    await page.screenshot({
      path: "../../qa/evidence/steps/04-categoria-gasto-creada.png",
    });

    // ── PASO 4: Crear cuenta ──────────────────────────────────────────
    await page.locator('input[name="nombre"]').last().fill(CUENTA);
    await page.locator('input[name="saldo_inicial"]').fill("1000");
    await page.screenshot({
      path: "../../qa/evidence/steps/05-formulario-cuenta.png",
    });
    await page
      .locator("form")
      .filter({ has: page.locator('input[name="saldo_inicial"]') })
      .getByRole("button")
      .click();
    await expect(page.getByText(CUENTA)).toBeVisible();
    await page.screenshot({
      path: "../../qa/evidence/steps/06-cuenta-creada.png",
    });

    // ── PASO 5: Registrar ingreso ─────────────────────────────────────
    await page.goto("/ingresos/nuevo");
    await page.locator('input[name="valor"]').fill("3500");
    await page
      .locator('select[name="categoria_id"]')
      .selectOption({ label: CATEGORIA_INGRESO });
    await page
      .locator('select[name="cuenta_id"]')
      .selectOption({ label: CUENTA });
    await page.locator('input[name="descripcion"]').fill(DESC_INGRESO);
    await page.screenshot({
      path: "../../qa/evidence/steps/07-formulario-ingreso-llenado.png",
    });
    await page.getByRole("button", { name: "Guardar ingreso" }).click();
    await expect(page).toHaveURL(/\/ingresos$/);
    const filaIngreso = page.locator("li", { hasText: DESC_INGRESO });
    await expect(filaIngreso).toBeVisible();
    await expect(filaIngreso).toContainText(/3\.?500/);
    await page.screenshot({
      path: "../../qa/evidence/steps/08-ingreso-guardado-en-lista.png",
    });

    // ── PASO 6: Registrar gasto ───────────────────────────────────────
    await page.goto("/gastos/nuevo");
    await page.locator('input[name="valor"]').fill("120");
    await page
      .locator('select[name="categoria_id"]')
      .selectOption({ label: CATEGORIA_GASTO });
    await page
      .locator('select[name="cuenta_id"]')
      .selectOption({ label: CUENTA });
    await page.locator('input[name="descripcion"]').fill(DESC_GASTO);
    await page.screenshot({
      path: "../../qa/evidence/steps/09-formulario-gasto-llenado.png",
    });
    await page.getByRole("button", { name: "Guardar gasto" }).click();
    await expect(page).toHaveURL(/\/gastos$/);
    const filaGasto = page.locator("li", { hasText: DESC_GASTO });
    await expect(filaGasto).toBeVisible();
    await expect(filaGasto).toContainText(/120/);
    await page.screenshot({
      path: "../../qa/evidence/steps/10-gasto-guardado-en-lista.png",
    });

    // ── PASO 7: Verificar Dashboard ───────────────────────────────────
    await page.goto("/dashboard");
    await expect(
      page.getByRole("heading", { name: "Dashboard" })
    ).toBeVisible();

    // Los 6 indicadores muestran valores monetarios válidos
    await verificarIndicadorMoneda(page, "Saldo actual");
    await verificarIndicadorMoneda(page, "Ingresos del mes");
    await verificarIndicadorMoneda(page, "Gastos del mes");
    await verificarIndicadorMoneda(page, "Disponible restante");
    await verificarIndicadorMoneda(page, "Pendiente por pagar");
    const cardPct = page
      .locator("div", { has: page.getByText("% Gastado", { exact: true }) })
      .last();
    await expect(cardPct).toContainText(/%/);
    await page.screenshot({
      path: "../../qa/evidence/steps/11-dashboard-con-6-indicadores.png",
    });
  });
});

async function verificarIndicadorMoneda(
  page: import("@playwright/test").Page,
  label: string
) {
  const card = page
    .locator("div", { has: page.getByText(label, { exact: true }) })
    .last();
  await expect(card).toContainText(/\$\s?[\d.,]+/);
}
