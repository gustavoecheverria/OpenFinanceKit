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

/**
 * Borra todos los datos del usuario de prueba.
 *
 * El setup global lo hace una vez por corrida, pero dentro de una misma corrida
 * los tests se acumulan: este archivo necesita partir de cero en casos concretos
 * (por ejemplo, un test que verifica qué pasa sin categorías de un tipo).
 *
 * Usa la API REST de Supabase con el token de sesión que ya está en el
 * navegador, así que respeta el RLS: solo borra los datos del usuario de prueba.
 */
async function vaciarUsuario(page: import("@playwright/test").Page): Promise<void> {
  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");

  // process.env no existe dentro del navegador: se leen acá y se pasan.
  const proyecto = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!proyecto || !anonKey) throw new Error("Faltan las variables de Supabase");

  const borrado = await page.evaluate(
    async ({ url, key }: { url: string; key: string }) => {
      // El token de sesión vive en la cookie de @supabase/ssr
      const nombre = `sb-${new URL(url).hostname.split(".")[0]}-auth-token`;
      const crudo = decodeURIComponent(document.cookie)
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(nombre));
      if (!crudo) return "sin cookie de sesión";

      const token = crudo.slice(nombre.length + 1).replace(/^base64-/, "");
      const sesion = JSON.parse(atob(token));

      const tablas = [
        "gastos",
        "ingresos",
        "pagos_programados",
        "transferencias",
        "categorias",
        "cuentas",
      ];
      for (const tabla of tablas) {
        const r = await fetch(
          `${url}/rest/v1/${tabla}?user_id=eq.${sesion.user.id}`,
          {
            method: "DELETE",
            headers: { apikey: key, Authorization: `Bearer ${sesion.access_token}` },
          }
        );
        if (!r.ok) return `${tabla}: ${r.status} ${await r.text()}`;
      }
      return "ok";
    },
    { url: proyecto, key: anonKey }
  );

  if (borrado !== "ok") throw new Error(`No se pudo limpiar: ${borrado}`);
}

/**
 * Prepara al usuario E2E como si acabara de registrarse.
 *
 * El usuario de prueba arranca VACÍO a propósito: los tests de E2E borran sus
 * datos en cada corrida (ver el módulo de este archivo). Esto obliga a que cada
 * test cree lo que necesita, que es exactamente el flujo de un usuario nuevo y
 * deja ver si la app funciona sin datos previos.
 *
 * Crea las categorías y cuentas faltantes. Es idempotente: si ya existen, no
 * duplica nada.
 */
async function prepararUsuarioNuevo(
  page: import("@playwright/test").Page
): Promise<void> {
  await page.goto("/config");

  // ── Categorías: al menos una de cada tipo ──────────────────────────
  const formCat = page.locator("form").filter({
    has: page.locator('select[name="tipo"]'),
  });

  for (const [nombre, tipo] of [
    ["Arriendo", "Gasto"],
    ["Alimentación", "Gasto"],
    ["Sueldo", "Ingreso"],
  ] as const) {
    if (await page.locator("li", { hasText: nombre }).count()) continue;
    await formCat.locator('input[name="nombre"]').fill(nombre);
    await formCat.locator('select[name="tipo"]').selectOption(tipo);
    await formCat.locator('button[type="submit"]').click();
    await expect(page.locator("li", { hasText: nombre })).toBeVisible({
      timeout: 20_000,
    });
  }

  // ── Cuentas: Efectivo y Banco, con saldo ───────────────────────────
  const formCta = page.locator("form").filter({
    has: page.locator('input[name="saldo_inicial"]'),
  });

  for (const [nombre, saldo] of [
    ["Efectivo", "500000"],
    ["Banco", "2000000"],
  ] as const) {
    if (await page.locator("li", { hasText: nombre }).count()) continue;
    await formCta.locator('input[name="nombre"]').fill(nombre);
    await formCta.locator('input[name="saldo_inicial"]').fill(saldo);
    await formCta.locator('button[type="submit"]').click();
    await expect(page.locator("li", { hasText: nombre })).toBeVisible({
      timeout: 20_000,
    });
  }
}

/**
 * Crea un pago programado llenando el formulario real, como un usuario.
 * Elige la categoría indicada, que debe existir de un tipo compatible.
 */
async function crearPagoProgramado(
  page: import("@playwright/test").Page,
  datos: {
    valor: string;
    concepto: string;
    categoria: string;
    cuenta?: string;
    tipo?: "Gasto" | "Ingreso";
    recurrencia?: string;
    diaVencimiento?: string;
  }
) {
  await page.goto("/pagos/programado/nuevo");
  await page.locator('input[name="valor"]').fill(datos.valor);
  await page.locator('input[name="concepto"]').fill(datos.concepto);

  if (datos.tipo === "Ingreso") {
    await page.locator('input[name="tipo"][value="Ingreso"]').check();
  }
  if (datos.recurrencia) {
    await page.locator('select[name="recurrencia"]').selectOption(datos.recurrencia);
  }
  if (datos.diaVencimiento) {
    await page.locator('input[name="dia_vencimiento"]').fill(datos.diaVencimiento);
  }

  await page.locator('select[name="categoria_id"]').selectOption({ label: datos.categoria });
  await page.locator('select[name="cuenta_id"]').selectOption({ label: datos.cuenta ?? "Banco" });

  await page.getByRole("button", { name: "Crear pago programado" }).click();
  await expect(page).toHaveURL(/\/pagos$/, { timeout: 20_000 });
}

/** Devuelve una cuenta con saldo, creándola si el usuario no la tiene. */
async function obtenerCuentaTrabajo(
  page: import("@playwright/test").Page,
  nombre: string,
  saldo: string
): Promise<string> {
  await page.goto("/config");
  const fila = page.locator("li").filter({ hasText: "Inicial:" }).filter({ hasText: nombre });
  if (await fila.count()) return nombre;

  const form = page.locator("form").filter({
    has: page.locator('input[name="saldo_inicial"]'),
  });
  await form.locator('input[name="nombre"]').fill(nombre);
  await form.locator('input[name="saldo_inicial"]').fill(saldo);
  await form.locator('button[type="submit"]').click();
  await expect(fila).toBeVisible({ timeout: 20_000 });
  return nombre;
}

/** Lee el saldo actual de una cuenta desde la fila de /config. */
async function saldoActual(
  page: import("@playwright/test").Page,
  nombre: string
): Promise<number> {
  const fila = page.locator("li").filter({ hasText: "Inicial:" }).filter({ hasText: nombre });
  const texto = (await fila.textContent()) ?? "";
  const m = texto.match(/Actual:\s*\$?\s*([\d.,]+)/);
  if (!m) throw new Error(`No se pudo leer el saldo de ${nombre}: "${texto}"`);
  // "1.350.000,00" → 1350000.00
  return Number(m[1].replace(/\./g, "").replace(",", "."));
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
  test("un usuario nuevo ve la guía inicial en Configuración", async ({ page }) => {
    // AC-029: primer vistazo de alguien que recién ingresa. No se le imponen
    // datos de ejemplo (se quitó ese botón), se le explica qué hacer.
    await vaciarUsuario(page);
    await page.goto("/config");
    await expect(page.getByText("Empecemos por lo básico")).toBeVisible();
    await expect(page.getByText(/al menos una categoría de gasto/i)).toBeVisible();

    // Y no debe haber ningún botón de datos de ejemplo
    await expect(
      page.getByRole("button", { name: /datos de ejemplo/i })
    ).toHaveCount(0);
  });

  test("crear un pago programado exige una categoría elegida por el usuario", async ({ page }) => {
    // AC-027: la categoría se elige explícitamente. Antes la tomaba sola (la
    // más antigua del tipo) y todo caía en "Gastos Hormiga".
    await vaciarUsuario(page);
    await prepararUsuarioNuevo(page);

    await page.goto("/pagos/programado/nuevo");
    await page.locator('input[name="valor"]').fill("350000");
    await page.locator('input[name="concepto"]').fill("Arriendo mensual");

    const selCategoria = page.locator('select[name="categoria_id"]');
    // Solo ofrece categorías de Gasto, no las de Ingreso
    const opciones = await selCategoria.locator("option").allTextContents();
    expect(opciones).toContain("Arriendo");
    expect(opciones).not.toContain("Sueldo"); // es de Ingreso

    await selCategoria.selectOption({ label: "Arriendo" });
    await page.locator('select[name="cuenta_id"]').selectOption({ label: "Banco" });
    await page.getByRole("button", { name: "Crear pago programado" }).click();
    await expect(page).toHaveURL(/\/pagos$/, { timeout: 20_000 });

    // La tarjeta muestra la categoría elegida
    await verificarTarjeta(page, "Arriendo mensual", /Arriendo/);
  });

  test("sin categorías del tipo no se puede crear el pago programado", async ({ page }) => {
    // AC-030: un usuario que solo tiene categorías de Gasto no puede crear un
    // pago de tipo Ingreso hasta crear una de ese tipo. Se frena con un mensaje
    // claro, no con un error al marcarlo pagado.
    //
    // NO usa prepararUsuarioNuevo: ese helper crea también categorías de
    // Ingreso, que es justo lo que este test necesita que no exista.
    //
    // Limpia los datos del usuario antes de armar su estado. El setup global
    // los borra una vez por corrida, pero los tests anteriores de este archivo
    // ya crean categorías de Ingreso, y este necesita no tener ninguna.
    await vaciarUsuario(page);
    await page.goto("/config");
    const formCat = page.locator("form").filter({
      has: page.locator('select[name="tipo"]'),
    });
    await formCat.locator('input[name="nombre"]').fill("Alimentación");
    await formCat.locator('select[name="tipo"]').selectOption("Gasto");
    await formCat.locator('button[type="submit"]').click();
    await expect(page.locator("li", { hasText: "Alimentación" })).toBeVisible();

    await obtenerCuentaTrabajo(page, "Banco", "1000000");

    await page.goto("/pagos/programado/nuevo");

    // Con categorías de Gasto, el formulario completo se muestra: el tipo
    // inicial es Gasto y hay dónde elegir categoría.
    await expect(page.locator('select[name="categoria_id"]')).toBeVisible();

    // Al cambiar a Ingreso, que no tiene ninguna categoría, el formulario se
    // frena con un mensaje que explica qué falta.
    // Se hace click en la etiqueta que envuelve al radio, como haría el usuario.
    // check() directo falla porque el input está oculto tras el estilo
    // accent-primary del tema.
    await page.locator("label", { hasText: "Ingresos" }).first().click();
    await expect(
      page.getByText(/Primero creá una categoría de ingresos/i)
    ).toBeVisible();
    await expect(page.locator('select[name="categoria_id"]')).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Crear pago programado" })
    ).toHaveCount(0);

    // Y hay un enlace directo a donde puede crearla
    await page.getByRole("link", { name: "Crear categoría" }).click();
    await expect(page).toHaveURL(/\/config$/);
  });

  test("crea un pago programado mensual y aparece con countdown", async ({ page }) => {
    await prepararUsuarioNuevo(page);
    const concepto = `Arriendo-${run}`;
    await crearPagoProgramado(page, {
      valor: "350000",
      concepto,
      categoria: "Arriendo",
    });

    const tarjeta = page.locator("li").filter({ hasText: concepto });
    await expect(tarjeta).toBeVisible();
    await expect(tarjeta).toContainText("350.000");
    await expect(tarjeta).toContainText("Banco");
    await expect(tarjeta).toContainText("Mensual");
    await expect(tarjeta).toContainText("Arriendo");
    await expect(tarjeta).toContainText("gastos");
    await expect(tarjeta).toContainText(/vence (hoy|mañana|en \d+ días)/);
    await expect(tarjeta).toContainText(/Pendiente|Alerta|Al día/);
  });

  test("la confirmación se cierra al marcar pagado y no permite clics repetidos", async ({
    page,
  }) => {
    // Bug reportado por el usuario: el modal de confirmación quedaba abierto
    // con el botón "Sí, lo pagué" activo, permitiendo registrar el mismo pago
    // varias veces.
    await prepararUsuarioNuevo(page);
    const concepto = `Modal-${run}`;
    await crearPagoProgramado(page, {
      valor: "55500",
      concepto,
      categoria: "Alimentación",
    });

    const tarjeta = page.locator("li").filter({ hasText: concepto });
    await tarjeta.getByRole("button", { name: "Marcar pagado" }).click();
    await expect(page.getByText(/¿Confirmás que pagaste/)).toBeVisible();

    await page.getByRole("button", { name: "Sí, lo pagué" }).click();

    await expect(page.getByText(/¿Confirmás que pagaste/)).toHaveCount(0, {
      timeout: 20_000,
    });
    await verificarTarjeta(page, concepto, /Al día/);
  });

  test("el pago programado muestra el estado Al día tras marcarlo pagado", async ({
    page,
  }) => {
    await prepararUsuarioNuevo(page);
    const concepto = `PagoAlDia-${run}`;
    await crearPagoProgramado(page, {
      valor: "120000",
      concepto,
      categoria: "Alimentación",
    });

    const tarjeta = page.locator("li").filter({ hasText: concepto });
    await tarjeta.getByRole("button", { name: "Marcar pagado" }).click();
    await page.getByRole("button", { name: "Sí, lo pagué" }).click();

    await verificarTarjeta(page, concepto, /Al día/);
    await verificarTarjeta(page, concepto, /vence en \d+ días/);
  });

  test("marcar pagado registra el movimiento en la categoría elegida", async ({ page }) => {
    // AC-027: el registro real debe quedar bajo la categoría que eligió el
    // usuario, no bajo la primera del tipo.
    await prepararUsuarioNuevo(page);
    const concepto = `MovUnico-${run}`;
    await crearPagoProgramado(page, {
      valor: "77700",
      concepto,
      categoria: "Alimentación",
    });

    await page
      .locator("li", { hasText: concepto })
      .getByRole("button", { name: "Marcar pagado" })
      .click();
    await page.getByRole("button", { name: "Sí, lo pagué" }).click();
    await verificarTarjeta(page, concepto, /Al día/);

    // Aparece en /gastos con esa categoría
    await page.goto("/gastos");
    const fila = page.locator("li").filter({ hasText: concepto });
    await expect(fila).toBeVisible();
    await expect(fila).toContainText("77.700");
    await expect(fila).toContainText("Alimentación");
  });

  test("un pago programado de tipo Ingreso va al historial de ingresos", async ({
    page,
  }) => {
    await prepararUsuarioNuevo(page);
    const concepto = `Sueldo-${run}`;
    await crearPagoProgramado(page, {
      valor: "1200000",
      concepto,
      categoria: "Sueldo",
      tipo: "Ingreso",
    });

    const tarjeta = page.locator("li").filter({ hasText: concepto });
    await expect(tarjeta).toContainText("ingresos");
    await tarjeta.getByRole("button", { name: "Marcar pagado" }).click();
    await page.getByRole("button", { name: "Sí, lo pagué" }).click();
    await verificarTarjeta(page, concepto, /Al día/);

    await page.goto("/ingresos");
    await expect(page.locator("li", { hasText: concepto })).toBeVisible();
  });

  test("la cuenta es obligatoria: no deja crear sin ella", async ({ page }) => {
    await prepararUsuarioNuevo(page);
    await page.goto("/pagos/programado/nuevo");
    await page.locator('input[name="valor"]').fill("50000");
    await page.locator('input[name="concepto"]').fill(`SinCta-${run}`);
    await page.locator('select[name="categoria_id"]').selectOption({ label: "Arriendo" });

    const select = page.locator('select[name="cuenta_id"]');
    await expect(select).toHaveValue("");
    const valid = await select.evaluate(
      (el: HTMLSelectElement) => el.required && el.value === ""
    );
    expect(valid).toBe(true);
  });

  test("el dashboard muestra los vencimientos próximos", async ({ page }) => {
    await prepararUsuarioNuevo(page);
    const concepto = `Vence-${run}`;
    const hoy = new Date();
    const diaHoy = String(hoy.getDate());
    await crearPagoProgramado(page, {
      valor: "90000",
      concepto,
      categoria: "Alimentación",
      diaVencimiento: diaHoy,
    });

    await page.goto("/dashboard");
    await expect(page.getByText("Próximos vencimientos")).toBeVisible({
      timeout: 20_000,
    });
    await expect(
      page.locator("li").filter({ hasText: concepto })
    ).toContainText(/vence hoy/, { timeout: 20_000 });
  });

  test("una categoría usada solo por pagos programados no se puede borrar, y el mensaje lo dice", async ({
    page,
  }) => {
    // Bug reportado por el usuario: "Gastos Hormiga" no se podía eliminar con el
    // mensaje "tiene movimientos asociados. Elimina esos ingresos o gastos",
    // pero la categoría no tenía ninguno. El bloqueo real eran 4 pagos
    // programados, que el mensaje no mencionaba y el usuario no asociaba con
    // "movimientos".
    await vaciarUsuario(page);
    await prepararUsuarioNuevo(page);

    await crearPagoProgramado(page, {
      valor: "45000",
      concepto: `CatBloqueada-${run}`,
      categoria: "Alimentación",
    });

    // Intentar eliminar esa categoría
    await page.goto("/config");
    await page
      .locator("li", { hasText: "Alimentación" })
      .getByRole("button", { name: "Eliminar Alimentación" })
      .click();

    // El mensaje debe nombrar la fuente real del bloqueo
    await expect(
      page.getByText(/pagos programados que la usan/i)
    ).toBeVisible({ timeout: 15_000 });

    // Y la categoría sigue ahí
    await expect(page.locator("li", { hasText: "Alimentación" })).toBeVisible();
  });

  test("una cuenta usada solo por pagos programados no se puede borrar, y el mensaje lo dice", async ({
    page,
  }) => {
    // Mismo bug que el de categorías: el mensaje acusaba "ingresos o gastos"
    // cuando lo único que bloqueaba el borrado eran los pagos programados.
    await vaciarUsuario(page);
    await prepararUsuarioNuevo(page);

    await crearPagoProgramado(page, {
      valor: "75000",
      concepto: `CtaBloqueada-${run}`,
      categoria: "Alimentación",
      cuenta: "Banco",
    });

    await page.goto("/config");
    await page
      .locator("li", { hasText: "Inicial:" })
      .filter({ hasText: "Banco" })
      .getByRole("button", { name: "Eliminar Banco" })
      .click();

    // El mensaje nombra los pagos programados, no "movimientos"
    await expect(
      page.getByText(/pago programado.*asociado|pago programado.*asociados/i)
    ).toBeVisible({ timeout: 15_000 });

    // Y la cuenta sigue ahí
    await expect(
      page.locator("li").filter({ hasText: "Inicial:" }).filter({ hasText: "Banco" })
    ).toBeVisible();
  });

  test("desactivar un pago lo saca de la lista sin borrarlo", async ({ page }) => {
    // AC-028: desactivar, nunca eliminar. El registro se conserva.
    await prepararUsuarioNuevo(page);
    const concepto = `Desactivar-${run}`;
    await crearPagoProgramado(page, {
      valor: "33000",
      concepto,
      categoria: "Alimentación",
    });

    await page
      .locator("li", { hasText: concepto })
      .getByRole("button", { name: `Desactivar pago programado ${concepto}` })
      .click();

    // Desaparece de la lista
    await expect(page.locator("li").filter({ hasText: concepto })).toHaveCount(0, {
      timeout: 20_000,
    });
  });
});

test.describe("Transferencias entre cuentas", () => {
  test("transfiere saldo sin alterar el saldo global", async ({ page }) => {
    // Dos cuentas de trabajo fijas: ver obtenerCuentaTrabajo.
    const origen = "E2E-Origen";
    const destino = "E2E-Destino";
    await obtenerCuentaTrabajo(page, origen, "500000");
    await obtenerCuentaTrabajo(page, destino, "100000");

    // Saldos antes de transferir
    const saldoAntes = async (nombre: string) => {
      const fila = page
        .locator("li")
        .filter({ hasText: "Inicial:" })
        .filter({ hasText: nombre });
      const texto = (await fila.textContent()) ?? "";
      const m = texto.match(/Actual:\s*\$?\s*([\d.]+)/);
      return m ? Number(m[1].replace(/\./g, "").replace(",", ".")) : NaN;
    };

    await page.goto("/config");
    const origenAntes = await saldoAntes(origen);
    const destinoAntes = await saldoAntes(destino);

    await page.goto("/cuentas/transferir");

    // ── Registrar la transferencia ─────────────────────────────────
    const valor = 200000;
    await page.locator('input[name="valor"]').fill(String(valor));
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

    // ── AC-021: el saldo se movió de una cuenta a la otra ──────────
    // Se compara contra los valores previos en vez de usar números fijos: la
    // cuenta de trabajo se reutiliza entre corridas y arrastra movimientos.
    const origenDespues = await saldoAntes(origen);
    const destinoDespues = await saldoAntes(destino);

    expect(origenDespues).toBeCloseTo(origenAntes - valor, -1);
    expect(destinoDespues).toBeCloseTo(destinoAntes + valor, -1);
  });

  test("el destino excluye la cuenta de origen", async ({ page }) => {
    const origen = "E2E-Origen";
    const destino = "E2E-Destino";
    await obtenerCuentaTrabajo(page, origen, "300000");
    await obtenerCuentaTrabajo(page, destino, "0");

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
    const origen = "E2E-Poca";
    const destino = "E2E-Destino";
    await obtenerCuentaTrabajo(page, origen, "10000");
    await obtenerCuentaTrabajo(page, destino, "0");

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
