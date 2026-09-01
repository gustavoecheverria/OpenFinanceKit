import { test, expect } from "@playwright/test";

/**
 * Tests E2E del CRUD de Configuración (categorías y cuentas).
 *
 * Cubre crear, editar y eliminar, incluyendo el caso negativo de
 * eliminar una cuenta con movimientos asociados (debe mostrar mensaje,
 * no reventar con "server-side exception").
 *
 * Usa la sesión pre-autenticada (auth.setup) y nombres únicos por corrida.
 */

const run = Date.now().toString().slice(-6);

test.describe("Configuración — CRUD de categorías y cuentas", () => {
  test("crear, editar y eliminar categorías y cuentas", async ({ page }) => {
    await page.goto("/config");
    await expect(page.getByRole("heading", { name: "Configuración" })).toBeVisible();

    const catNombre = `Cat-${run}`;
    const catEditada = `CatEdit-${run}`;
    const ctaNombre = `Cta-${run}`;
    const ctaEditada = `CtaEdit-${run}`;

    // ── TC-01: Crear categoría de Ingreso ────────────────────────────
    const formCat = page.locator("form").filter({ has: page.locator('select[name="tipo"]') });
    await formCat.locator('input[name="nombre"]').fill(catNombre);
    await formCat.locator('select[name="tipo"]').selectOption("Ingreso");
    await formCat.getByRole("button").click();
    const filaCat = page.locator("li", { hasText: catNombre });
    await expect(filaCat).toBeVisible();
    await expect(filaCat).toContainText("Ingreso");

    // ── TC-02: Crear cuenta con saldo ────────────────────────────────
    const formCta = page.locator("form").filter({ has: page.locator('input[name="saldo_inicial"]') });
    await formCta.locator('input[name="nombre"]').fill(ctaNombre);
    await formCta.locator('input[name="saldo_inicial"]').fill("1500");
    await formCta.getByRole("button").click();
    const filaCta = page.locator("li", { hasText: ctaNombre });
    await expect(filaCta).toBeVisible();
    await expect(filaCta).toContainText(/1\.?500/);

    // ── TC-03: Editar nombre de categoría ────────────────────────────
    await filaCat.getByRole("button", { name: `Editar ${catNombre}` }).click();
    const editCat = page.locator("li", { has: page.locator('select[name="tipo"]') });
    await editCat.locator('input[name="nombre"]').fill(catEditada);
    await editCat.getByRole("button", { name: "Guardar" }).click();
    await expect(page.locator("li", { hasText: catEditada })).toBeVisible();

    // ── TC-04: Editar saldo de cuenta ────────────────────────────────
    const filaCtaActual = page.locator("li", { hasText: ctaNombre });
    await filaCtaActual.getByRole("button", { name: `Editar ${ctaNombre}` }).click();
    const editCta = page.locator("li", { has: page.locator('input[name="saldo_inicial"]') }).filter({
      has: page.getByRole("button", { name: "Guardar" }),
    });
    await editCta.locator('input[name="nombre"]').fill(ctaEditada);
    await editCta.locator('input[name="saldo_inicial"]').fill("2000");
    await editCta.getByRole("button", { name: "Guardar" }).click();
    const filaCtaEditada = page.locator("li", { hasText: ctaEditada });
    await expect(filaCtaEditada).toBeVisible();
    await expect(filaCtaEditada).toContainText(/2\.?000/);

    // ── TC-08: Cancelar edición vuelve al valor original ─────────────
    await filaCtaEditada.getByRole("button", { name: `Editar ${ctaEditada}` }).click();
    const editCancelar = page.locator("li", { has: page.locator('input[name="saldo_inicial"]') }).filter({
      has: page.getByRole("button", { name: "Cancelar" }),
    });
    await editCancelar.locator('input[name="nombre"]').fill("NO-DEBE-GUARDARSE");
    await editCancelar.getByRole("button", { name: "Cancelar" }).click();
    await expect(page.locator("li", { hasText: ctaEditada })).toBeVisible();
    await expect(page.getByText("NO-DEBE-GUARDARSE")).toHaveCount(0);

    // ── TC-05: Eliminar categoría sin movimientos ────────────────────
    const filaCatFinal = page.locator("li", { hasText: catEditada });
    await filaCatFinal.getByRole("button", { name: `Eliminar ${catEditada}` }).click();
    await expect(page.locator("li", { hasText: catEditada })).toHaveCount(0);

    // ── TC-06: Eliminar cuenta sin movimientos ───────────────────────
    const filaCtaFinal = page.locator("li", { hasText: ctaEditada });
    await filaCtaFinal.getByRole("button", { name: `Eliminar ${ctaEditada}` }).click();
    await expect(page.locator("li", { hasText: ctaEditada })).toHaveCount(0);
  });

  test("TC-07: eliminar cuenta con movimientos muestra mensaje (no revienta)", async ({ page }) => {
    await page.goto("/config");

    const catNombre = `CatMov-${run}`;
    const ctaNombre = `CtaMov-${run}`;

    // Crear categoría de gasto y cuenta
    const formCat = page.locator("form").filter({ has: page.locator('select[name="tipo"]') });
    await formCat.locator('input[name="nombre"]').fill(catNombre);
    await formCat.locator('select[name="tipo"]').selectOption("Gasto");
    await formCat.getByRole("button").click();
    await expect(page.locator("li", { hasText: catNombre })).toBeVisible();

    const formCta = page.locator("form").filter({ has: page.locator('input[name="saldo_inicial"]') });
    await formCta.locator('input[name="nombre"]').fill(ctaNombre);
    await formCta.locator('input[name="saldo_inicial"]').fill("500");
    await formCta.getByRole("button").click();
    await expect(page.locator("li", { hasText: ctaNombre })).toBeVisible();

    // Registrar un gasto que use esa cuenta (crea la referencia)
    await page.goto("/gastos/nuevo");
    await page.locator('input[name="valor"]').fill("50");
    await page.locator('select[name="categoria_id"]').selectOption({ label: catNombre });
    await page.locator('select[name="cuenta_id"]').selectOption({ label: ctaNombre });
    await page.getByRole("button", { name: "Guardar gasto" }).click();
    await expect(page).toHaveURL(/\/gastos$/);

    // Intentar eliminar la cuenta con movimientos → debe mostrar mensaje
    await page.goto("/config");
    const filaCta = page.locator("li", { hasText: ctaNombre });
    await filaCta.getByRole("button", { name: `Eliminar ${ctaNombre}` }).click();

    // No debe navegar a una pantalla de error; debe mostrar el mensaje amigable
    await expect(page.getByText(/movimientos asociados/i)).toBeVisible();
    // La cuenta sigue existiendo (no se borró)
    await expect(page.locator("li", { hasText: ctaNombre })).toBeVisible();
  });
});
