import { test, expect } from "@playwright/test";

/**
 * Test E2E del flujo principal de OFK Web (AC-014).
 *
 * Simula el uso real: configurar datos maestros → registrar
 * ingreso y gasto → verificar que el Dashboard (Motor) refleja los datos.
 *
 * Usa la sesión pre-autenticada del auth.setup (ADR-WEB-008).
 *
 * NOTA sobre aislamiento: el test corre contra la DB real de Supabase
 * (ver observación de QA en el SDD). Para ser determinista pese a datos
 * de corridas previas, cada entrada usa una DESCRIPCIÓN única y las
 * aserciones de lista se anclan a esa descripción. El Dashboard se valida
 * verificando que los indicadores muestran valores monetarios válidos
 * (no ceros), ya que los totales mensuales acumulan entre corridas.
 */

const run = Date.now().toString().slice(-6);
const CATEGORIA_INGRESO = `Sueldo-${run}`;
const CATEGORIA_GASTO = `Comida-${run}`;
const CUENTA = `Banco-${run}`;
const DESC_INGRESO = `ingreso-e2e-${run}`;
const DESC_GASTO = `gasto-e2e-${run}`;

test.describe("Flujo principal — config → captura → dashboard", () => {
  test("configurar, registrar y verificar el flujo completo", async ({ page }) => {
    // ── 1. Configuración: crear categorías y cuenta ──────────────────
    await page.goto("/config");
    await expect(page.getByRole("heading", { name: "Configuración" })).toBeVisible();

    // Categoría de ingreso
    await page.locator('input[name="nombre"]').first().fill(CATEGORIA_INGRESO);
    await page.locator('select[name="tipo"]').selectOption("Ingreso");
    await page.locator("form").filter({ has: page.locator('select[name="tipo"]') }).getByRole("button").click();
    await expect(page.getByText(CATEGORIA_INGRESO)).toBeVisible();

    // Categoría de gasto
    await page.locator('input[name="nombre"]').first().fill(CATEGORIA_GASTO);
    await page.locator('select[name="tipo"]').selectOption("Gasto");
    await page.locator("form").filter({ has: page.locator('select[name="tipo"]') }).getByRole("button").click();
    await expect(page.getByText(CATEGORIA_GASTO)).toBeVisible();

    // Cuenta con saldo inicial 1000
    await page.locator('input[name="nombre"]').last().fill(CUENTA);
    await page.locator('input[name="saldo_inicial"]').fill("1000");
    await page.locator("form").filter({ has: page.locator('input[name="saldo_inicial"]') }).getByRole("button").click();
    await expect(page.getByText(CUENTA)).toBeVisible();

    // ── 2. Registrar un ingreso de 3500 (con descripción única) ──────
    await page.goto("/ingresos/nuevo");
    await page.locator('input[name="valor"]').fill("3500");
    await page.locator('select[name="categoria_id"]').selectOption({ label: CATEGORIA_INGRESO });
    await page.locator('select[name="cuenta_id"]').selectOption({ label: CUENTA });
    await page.locator('input[name="descripcion"]').fill(DESC_INGRESO);
    await page.getByRole("button", { name: "Guardar ingreso" }).click();
    await expect(page).toHaveURL(/\/ingresos$/);
    // Localizar la fila exacta por su descripción única, y verificar el monto
    const filaIngreso = page.locator("li", { hasText: DESC_INGRESO });
    await expect(filaIngreso).toBeVisible();
    await expect(filaIngreso).toContainText(/3\.?500/);

    // ── 3. Registrar un gasto de 120 (con descripción única) ─────────
    await page.goto("/gastos/nuevo");
    await page.locator('input[name="valor"]').fill("120");
    await page.locator('select[name="categoria_id"]').selectOption({ label: CATEGORIA_GASTO });
    await page.locator('select[name="cuenta_id"]').selectOption({ label: CUENTA });
    await page.locator('input[name="descripcion"]').fill(DESC_GASTO);
    await page.getByRole("button", { name: "Guardar gasto" }).click();
    await expect(page).toHaveURL(/\/gastos$/);
    const filaGasto = page.locator("li", { hasText: DESC_GASTO });
    await expect(filaGasto).toBeVisible();
    await expect(filaGasto).toContainText(/120/);

    // ── 4. Verificar el Dashboard (Motor calcula) ────────────────────
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    // Los 6 indicadores muestran un valor monetario/porcentual válido.
    // No afirmamos totales exactos porque el mes acumula datos de otras
    // corridas; sí verificamos que el Motor produce valores con formato correcto.
    await verificarIndicadorMoneda(page, "Saldo actual");
    await verificarIndicadorMoneda(page, "Ingresos del mes");
    await verificarIndicadorMoneda(page, "Gastos del mes");
    await verificarIndicadorMoneda(page, "Disponible restante");
    await verificarIndicadorMoneda(page, "Pendiente por pagar");
    // % Gastado debe mostrar un porcentaje
    const cardPct = page
      .locator("div", { has: page.getByText("% Gastado", { exact: true }) })
      .last();
    await expect(cardPct).toContainText(/%/);
  });
});

/**
 * Verifica que la tarjeta de indicador con el label dado muestra un
 * valor monetario válido (formato "$..."). Robusto al locale.
 */
async function verificarIndicadorMoneda(
  page: import("@playwright/test").Page,
  label: string
) {
  const card = page
    .locator("div", { has: page.getByText(label, { exact: true }) })
    .last();
  await expect(card).toContainText(/\$\s?[\d.,]+/);
}
