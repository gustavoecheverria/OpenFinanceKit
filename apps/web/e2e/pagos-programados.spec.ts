import { test, expect } from "@playwright/test";

/**
 * Tests E2E de pagos programados y transferencias entre cuentas.
 *
 * SDD: .kiro/specs/feature-pagos-programados.md — TAREA-015
 *
 * Cubre los criterios de aceptación que requieren navegador:
 * - Crear un pago programado con tipo, recurrencia y cuenta
 * - El countdown y los cuatro estados visibles
 * - Marcar pagado genera el registro real y deja el pago "Al día"
 * - Transferir saldo entre cuentas sin alterar el saldo global
 *
 * Usa la sesión pre-autenticada (auth.setup) y nombres únicos por corrida.
 */

const run = Date.now().toString().slice(-6);

/** Crea una categoría y una cuenta con saldo, y devuelve sus nombres. */
async function crearCuentaConSaldo(
  page: import("@playwright/test").Page,
  nombre: string,
  saldo: string
) {
  await page.goto("/config");

  // El nombre de la categoría lleva un sufijo distinto al de la cuenta, para
  // que un locator por texto no matchee la fila equivocada.
  const catNombre = `CatDe${nombre}`;

  const formCat = page.locator("form").filter({
    has: page.locator('select[name="tipo"]'),
  });
  await formCat.locator('input[name="nombre"]').fill(catNombre);
  await formCat.locator('select[name="tipo"]').selectOption("Gasto");
  await formCat.locator('button[type="submit"]').click();
  // Busca dentro del li: los selectores por texto pueden matchear la categoría
  // o la cuenta si los nombres se parecen.
  await expect(page.locator("li").filter({ hasText: catNombre })).toBeVisible({
    timeout: 15_000,
  });

  const formCta = page.locator("form").filter({
    has: page.locator('input[name="saldo_inicial"]'),
  });
  await formCta.locator('input[name="nombre"]').fill(nombre);
  await formCta.locator('input[name="saldo_inicial"]').fill(saldo);
  await formCta.locator('button[type="submit"]').click();
  await expect(page.locator("li").filter({ hasText: nombre })).toBeVisible({
    timeout: 15_000,
  });
}

/**
 * Localiza la tarjeta de un pago programado y verifica que contenga un texto.
 *
 * Usa `filter({ hasText })` sobre el <li> y después `toContainText`, no
 * `getByText` anidado: Playwright interprets `locator("li").getByText()` como
 * buscar un <li> DENTRO del <li> filtrado, que nunca existe.
 */
async function verificarTarjeta(
  page: import("@playwright/test").Page,
  concepto: string,
  texto: RegExp
) {
  const tarjeta = page.locator("li").filter({ hasText: concepto });
  await expect(tarjeta).toBeVisible();
  await expect(tarjeta).toContainText(texto);
}

test.describe("Pagos programados", () => {
  test("crea un pago programado mensual y aparece con countdown", async ({ page }) => {
    const cuenta = `CtaProg-${run}`;
    await crearCuentaConSaldo(page, cuenta, "1000000");

    // ── Crear el pago programado ────────────────────────────────────
    await page.goto("/pagos/programado/nuevo");
    await page.locator('input[name="valor"]').fill("350000");
    await page.locator('input[name="concepto"]').fill(`Arriendo-${run}`);

    // Tipo: Gasto (por defecto) y recurrencia Mensual (por defecto)
    await expect(page.locator('input[name="tipo"][value="Gasto"]')).toBeChecked();
    await expect(page.locator('select[name="recurrencia"]')).toHaveValue("Mensual");

    await page.locator('select[name="cuenta_id"]').selectOption({ label: cuenta });
    await page.getByRole("button", { name: "Crear pago programado" }).click();

    // Navega a /pagos
    await expect(page).toHaveURL(/\/pagos$/);

    // ── Aparece en la lista de programados ─────────────────────────
    const tarjeta = page.locator("li", { hasText: `Arriendo-${run}` });
    await expect(tarjeta).toBeVisible();

    // Muestra el monto, la cuenta y la recurrencia
    await expect(tarjeta).toContainText("350.000");
    await expect(tarjeta).toContainText(cuenta);
    await expect(tarjeta).toContainText("Mensual");

    // Muestra a qué lado del historial va
    await expect(tarjeta).toContainText("gastos");

    // Tiene countdown y estado
    await expect(tarjeta).toContainText(/vence (hoy|mañana|en \d+ días)/);
    await expect(tarjeta).toContainText(/Pendiente|Alerta|Al día/);
  });

  test("el pago programado muestra el estado Al día tras marcarlo pagado", async ({
    page,
  }) => {
    const cuenta = `CtaAlDia-${run}`;
    const concepto = `PagoAlDia-${run}`;
    await crearCuentaConSaldo(page, cuenta, "1000000");

    await page.goto("/pagos/programado/nuevo");
    await page.locator('input[name="valor"]').fill("120000");
    await page.locator('input[name="concepto"]').fill(concepto);
    await page.locator('select[name="cuenta_id"]').selectOption({ label: cuenta });
    await page.getByRole("button", { name: "Crear pago programado" }).click();
    await expect(page).toHaveURL(/\/pagos$/);

    const tarjeta = page.locator("li", { hasText: concepto });
    await expect(tarjeta).toBeVisible();

    // ── Marcar pagado: pide confirmación ────────────────────────────
    await tarjeta.getByRole("button", { name: "Marcar pagado" }).click();
    const confirmacion = page.getByText(/¿Confirmás que pagaste/);
    await expect(confirmacion).toBeVisible();

    await page.getByRole("button", { name: "Sí, lo pagué" }).click();

    // ── AC-011: queda "Al día", no "Pendiente" ─────────────────────
    await verificarTarjeta(page, concepto, /Al día/);

    // El countdown volvió a contar hacia el próximo período
    await verificarTarjeta(page, concepto, /vence en \d+ días/);
  });

  test("marcar pagado registra el movimiento en gastos", async ({ page }) => {
    const cuenta = `CtaMov-${run}`;
    const concepto = `MovUnico-${run}`;
    await crearCuentaConSaldo(page, cuenta, "1000000");

    await page.goto("/pagos/programado/nuevo");
    await page.locator('input[name="valor"]').fill("77700");
    await page.locator('input[name="concepto"]').fill(concepto);
    await page.locator('select[name="cuenta_id"]').selectOption({ label: cuenta });
    await page.getByRole("button", { name: "Crear pago programado" }).click();
    await expect(page).toHaveURL(/\/pagos$/);

    // Marcar pagado
    await page
      .locator("li", { hasText: concepto })
      .getByRole("button", { name: "Marcar pagado" })
      .click();
    await page.getByRole("button", { name: "Sí, lo pagué" }).click();
    await verificarTarjeta(page, concepto, /Al día/);

    // ── El registro real debe estar en /gastos ─────────────────────
    await page.goto("/gastos");
    const fila = page.locator("li", { hasText: concepto });
    await expect(fila).toBeVisible();
    await expect(fila).toContainText("77.700");
  });

  test("un pago programado de tipo Ingreso va al historial de ingresos", async ({
    page,
  }) => {
    const cuenta = `CtaSueldo-${run}`;
    const concepto = `Sueldo-${run}`;
    await crearCuentaConSaldo(page, cuenta, "500000");

    await page.goto("/pagos/programado/nuevo");
    await page.locator('input[name="valor"]').fill("1200000");
    await page.locator('input[name="concepto"]').fill(concepto);

    // Elegir tipo Ingreso
    await page.locator('input[name="tipo"][value="Ingreso"]').check();
    await page.locator('select[name="cuenta_id"]').selectOption({ label: cuenta });
    await page.getByRole("button", { name: "Crear pago programado" }).click();
    await expect(page).toHaveURL(/\/pagos$/);

    // La tarjeta dice que va a ingresos
    const tarjeta = page.locator("li", { hasText: concepto });
    await expect(tarjeta).toContainText("ingresos");

    // Marcar pagado y verificar en /ingresos
    await tarjeta.getByRole("button", { name: "Marcar pagado" }).click();
    await page.getByRole("button", { name: "Sí, lo pagué" }).click();
    await verificarTarjeta(page, concepto, /Al día/);

    await page.goto("/ingresos");
    await expect(page.locator("li", { hasText: concepto })).toBeVisible();
  });

  test("la cuenta es obligatoria: no deja crear sin ella", async ({ page }) => {
    await page.goto("/pagos/programado/nuevo");
    await page.locator('input[name="valor"]').fill("50000");
    await page.locator('input[name="concepto"]').fill(`SinCta-${run}`);

    // Sin cuenta, el navegador bloquea el submit por validación HTML
    const select = page.locator('select[name="cuenta_id"]');
    await expect(select).toHaveValue("");

    const valid = await select.evaluate(
      (el: HTMLSelectElement) => el.required && el.value === ""
    );
    expect(valid).toBe(true);
  });

  test("el dashboard muestra los vencimientos próximos", async ({ page }) => {
    const cuenta = `CtaDash-${run}`;
    const concepto = `Vence-${run}`;
    await crearCuentaConSaldo(page, cuenta, "1000000");

    await page.goto("/pagos/programado/nuevo");
    await page.locator('input[name="valor"]').fill("90000");
    await page.locator('input[name="concepto"]').fill(concepto);
    await page.locator('select[name="cuenta_id"]').selectOption({ label: cuenta });
    // Vence hoy: día del mes actual → entra en la ventana de alerta
    const hoy = new Date();
    const diaHoy = hoy.getDate();
    await page.locator('input[name="dia_vencimiento"]').fill(String(diaHoy));
    await page.locator('input[name="fecha_inicio"]').fill(
      new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), diaHoy))
        .toISOString()
        .slice(0, 10)
    );
    await page.getByRole("button", { name: "Crear pago programado" }).click();
    await expect(page).toHaveURL(/\/pagos$/);

    // En /pagos debe estar en alerta o vencido (vence hoy o ya pasó)
    const tarjeta = page.locator("li", { hasText: concepto });
    await expect(tarjeta).toBeVisible();

    // El dashboard debe mostrarlo en la sección de vencimientos
    await page.goto("/dashboard");
    const seccion = page.getByRole("heading", {
      name: /Próximos vencimientos|Pagos por vencer/,
    });
    await expect(seccion).toBeVisible();
    await expect(page.locator("li", { hasText: concepto })).toBeVisible();
  });
});

test.describe("Transferencias entre cuentas", () => {
  // El usuario de prueba acumula cuentas de corridas anteriores, así que cada
  // test crea dos más. Los selects llegan a tener 30+ opciones y la página
  // necesita más que los 30s por defecto de Playwright.
  test.slow();

  test("transfiere saldo sin alterar el saldo global", async ({ page }) => {
    const origen = `CtaOrigen-${run}`;
    const destino = `CtaDestino-${run}`;

    // Dos cuentas con saldos conocidos
    await crearCuentaConSaldo(page, origen, "500000");
    await crearCuentaConSaldo(page, destino, "100000");

    await page.goto("/cuentas/transferir");

    // ── Registrar la transferencia ─────────────────────────────────
    await page.locator('input[name="valor"]').fill("200000");
    await page.locator('select[name="origen_id"]').selectOption({ label: origen });
    // El select de destino arranca deshabilitado hasta que hay origen.
    // Sin esperar a que se habilite, selectOption no dispara el onChange y la
    // transferencia nunca se envía.
    const destinoSelect = page.locator('select[name="destino_id"]');
    await expect(destinoSelect).toBeEnabled({ timeout: 10_000 });
    await destinoSelect.selectOption({ label: destino });
    await page.getByRole("button", { name: "Transferir" }).click();

    // Tras el éxito navega a /config
    await expect(page).toHaveURL(/\/config$/, { timeout: 20_000 });

    // ── AC-021: el saldo se movió, no se creó ni se destruyó ───────
    // Origen: 500.000 - 200.000 = 300.000
    // Destino: 100.000 + 200.000 = 300.000
    // La fila de cuenta muestra "Inicial: $X" y "Actual: $Y". Se busca el saldo
// con tolerancia al separador de miles, porque toLocaleString("es") puede
// renderizar "300.000,00" o "300000,00" según el runtime.
const SALDO_300K = /Actual:\s*\$?\s*300[.\s]?000/;

// La categoría se llama "CatDe<nombre-cuenta>", así que un filtro por el
// nombre de la cuenta matchea dos <li>. La fila de cuenta es la que tiene
// el texto "Inicial:", y es la última de las dos.
const filaOrigen = page
    .locator("li")
    .filter({ hasText: origen })
    .filter({ hasText: "Inicial:" })
    .last();
  await expect(filaOrigen).toContainText(SALDO_300K, { timeout: 20_000 });

  const filaDestino = page
    .locator("li")
    .filter({ hasText: destino })
    .filter({ hasText: "Inicial:" })
    .last();
  await expect(filaDestino).toContainText(SALDO_300K, { timeout: 20_000 });
  });

  test("el destino excluye la cuenta de origen", async ({ page }) => {
    const origen = `CtaExcl-${run}`;
    const destino = `CtaOther-${run}`;
    await crearCuentaConSaldo(page, origen, "300000");
    await crearCuentaConSaldo(page, destino, "0");

    await page.goto("/cuentas/transferir");

    const selectOrigen = page.locator('select[name="origen_id"]');
    const selectDestino = page.locator('select[name="destino_id"]');

    // El destino está deshabilitado hasta elegir origen
    await expect(selectDestino).toBeDisabled();

    await selectOrigen.selectOption({ label: origen });
    await expect(selectDestino).toBeEnabled({ timeout: 10_000 });

    // La cuenta de origen NO aparece entre las opciones de destino
    const opcionesDestino = await selectDestino
      .locator("option")
      .allTextContents();
    expect(opcionesDestino).not.toContain(origen);
  });

  test("rechaza transferir más que el saldo disponible", async ({ page }) => {
    const origen = `CtaPoca-${run}`;
    const destino = `CtaRica-${run}`;
    await crearCuentaConSaldo(page, origen, "10000");
    await crearCuentaConSaldo(page, destino, "0");

    await page.goto("/cuentas/transferir");
    await page.locator('input[name="valor"]').fill("999999");
    await page.locator('select[name="origen_id"]').selectOption({ label: origen });
    const sel = page.locator('select[name="destino_id"]');
    await expect(sel).toBeEnabled({ timeout: 10_000 });
    await sel.selectOption({ label: destino });
    await page.getByRole("button", { name: "Transferir" }).click();

    // Debe mostrar el error de saldo insuficiente
    await expect(page.getByText(/saldo suficiente/i)).toBeVisible({
      timeout: 15_000,
    });
    // No debe navegar
    await expect(page).toHaveURL(/\/cuentas\/transferir/);
  });
});
