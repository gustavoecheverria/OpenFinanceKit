"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/form-state";

// ── Límites de longitud (G1) ────────────────────────────────────────────
const MAX_NOMBRE = 100;
const MAX_DESCRIPCION = 255;

// ── Categorías ──────────────────────────────────────────────────────────

export async function addCategoria(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  // G2: trim + G1: maxLength
  const nombre = (formData.get("nombre") as string)?.trim();
  const tipo = formData.get("tipo") as string;

  if (!nombre) return { error: "El nombre es obligatorio." };
  if (nombre.length > MAX_NOMBRE)
    return { error: `El nombre no puede superar ${MAX_NOMBRE} caracteres.` };
  if (tipo !== "Ingreso" && tipo !== "Gasto") return { error: "Tipo inválido." };

  const { error } = await supabase.from("categorias").insert({
    nombre,
    tipo,
    user_id: user.id,
  });

  if (error) return { error: "No se pudo crear la categoría. Intenta de nuevo." };
  revalidatePath("/config");
  return { error: null, ok: true };
}

export async function updateCategoria(
  id: number,
  formData: FormData
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró." };

  const nombre = (formData.get("nombre") as string)?.trim();
  const tipo = formData.get("tipo") as string;

  if (!nombre) return { error: "El nombre es obligatorio." };
  if (nombre.length > MAX_NOMBRE)
    return { error: `El nombre no puede superar ${MAX_NOMBRE} caracteres.` };
  if (tipo !== "Ingreso" && tipo !== "Gasto") return { error: "Tipo inválido." };

  const { error } = await supabase
    .from("categorias")
    .update({ nombre, tipo })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "No se pudo actualizar la categoría. Intenta de nuevo." };

  revalidatePath("/config");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteCategoria(id: number): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró." };

  const { error } = await supabase
    .from("categorias")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    // Error de integridad: la categoría está referenciada por algo.
    //
    // Antes el mensaje decía "ingresos o gastos" nomás, y mentía: el caso
    // habitual era una categoría usada solo por pagos programados, que el
    // usuario noassociaba con "movimientos". Se nombra la fuente real.
    if (esErrorDeReferencia(error)) {
      const { count: enProgramados } = await supabase
        .from("pagos_programados")
        .select("id", { count: "exact", head: true })
        .eq("categoria_id", id);

      if (enProgramados && enProgramados > 0) {
        return {
          error:
            "No puedes eliminar esta categoría porque hay pagos programados que la usan. " +
            "Desactiva o cambia la categoría en Pagos.",
        };
      }

      return {
        error:
          "No puedes eliminar esta categoría porque tiene movimientos asociados. Elimina primero esos ingresos o gastos.",
        };
    }
    return { error: "No se pudo eliminar la categoría. Intenta de nuevo." };
  }

  revalidatePath("/config");
  return { error: null };
}

// ── Cuentas ─────────────────────────────────────────────────────────────

export async function addCuenta(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  // G2: trim + G1: maxLength
  const nombre = (formData.get("nombre") as string)?.trim();
  const saldoInicial = parseFloat(formData.get("saldo_inicial") as string);

  if (!nombre) return { error: "El nombre es obligatorio." };
  if (nombre.length > MAX_NOMBRE)
    return { error: `El nombre no puede superar ${MAX_NOMBRE} caracteres.` };
  if (isNaN(saldoInicial) || saldoInicial < 0)
    return { error: "El saldo inicial debe ser un número mayor o igual a cero." };

  const { error } = await supabase.from("cuentas").insert({
    nombre,
    saldo_inicial: saldoInicial,
    user_id: user.id,
  });

  if (error) return { error: "No se pudo crear la cuenta. Intenta de nuevo." };
  revalidatePath("/config");
  return { error: null, ok: true };
}

export async function updateCuenta(
  id: number,
  formData: FormData
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró." };

  const nombre = (formData.get("nombre") as string)?.trim();
  const saldoInicial = parseFloat(formData.get("saldo_inicial") as string);

  if (!nombre) return { error: "El nombre es obligatorio." };
  if (nombre.length > MAX_NOMBRE)
    return { error: `El nombre no puede superar ${MAX_NOMBRE} caracteres.` };
  if (isNaN(saldoInicial) || saldoInicial < 0) {
    return { error: "El saldo inicial debe ser un número mayor o igual a cero." };
  }

  const { error } = await supabase
    .from("cuentas")
    .update({ nombre, saldo_inicial: saldoInicial })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "No se pudo actualizar la cuenta. Intenta de nuevo." };

  revalidatePath("/config");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteCuenta(id: number): Promise<{ error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró." };

  const { error } = await supabase
    .from("cuentas")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    // Error de integridad: la cuenta está referenciada por algo.
    // El mensaje anterior solo mencionaba ingresos y gastos, y mentía cuando
    // lo único que la bloqueaba eran pagos programados o transferencias.
    if (esErrorDeReferencia(error)) {
      const usos = await contarUsosDeCuenta(supabase, id);
      return { error: mensajeCuentaBloqueada(usos) };
    }
    return { error: "No se pudo eliminar la cuenta. Intenta de nuevo." };
  }

  revalidatePath("/config");
  return { error: null };
}

/**
 * Cuenta qué registros referencian una cuenta, para explicar por qué no se
 * puede eliminar. El error de FK de Postgres no dice cuál fue la causa, y un
 * mensaje genérico hacía pensar al usuario que tenía gastos o ingresos cuando
 * lo único que bloqueaba eran pagos programados o transferencias.
 */
async function contarUsosDeCuenta(
  supabase: Awaited<ReturnType<typeof createClient>>,
  cuentaId: number
): Promise<{ gastos: number; ingresos: number; programados: number; transferencias: number }> {
  const [gastos, ingresos, programados, transferencias] = await Promise.all([
    supabase.from("gastos").select("id", { count: "exact", head: true }).eq("cuenta_id", cuentaId),
    supabase.from("ingresos").select("id", { count: "exact", head: true }).eq("cuenta_id", cuentaId),
    supabase.from("pagos_programados").select("id", { count: "exact", head: true }).eq("cuenta_id", cuentaId),
    supabase
      .from("transferencias")
      .select("id", { count: "exact", head: true })
      .or(`origen_id.eq.${cuentaId},destino_id.eq.${cuentaId}`),
  ]);

  return {
    gastos: gastos.count ?? 0,
    ingresos: ingresos.count ?? 0,
    programados: programados.count ?? 0,
    transferencias: transferencias.count ?? 0,
  };
}

/** Arma el mensaje según qué está bloqueando el borrado. */
function mensajeCuentaBloqueada(usos: {
  gastos: number;
  ingresos: number;
  programados: number;
  transferencias: number;
}): string {
  const partes: string[] = [];
  if (usos.programados > 0) {
    partes.push(
      `${usos.programados} pago${usos.programados === 1 ? "" : "s"} programado${usos.programados === 1 ? "" : "s"}`
    );
  }
  if (usos.transferencias > 0) {
    partes.push(`${usos.transferencias} transferencia${usos.transferencias === 1 ? "" : "s"}`);
  }
  if (usos.ingresos > 0) {
    partes.push(`${usos.ingresos} ingreso${usos.ingresos === 1 ? "" : "s"}`);
  }
  if (usos.gastos > 0) {
    partes.push(`${usos.gastos} gasto${usos.gastos === 1 ? "" : "s"}`);
  }

  if (partes.length === 0) return "No se pudo eliminar la cuenta. Intenta de nuevo.";

  const lista = partes.join(", ");
  return `No se puede eliminar esta cuenta porque tiene ${lista} asociados. ` +
    `Desactiva los pagos programados o mueve los movimientos antes de eliminarla.`;
}

/**
 * Detecta si un error de Supabase/Postgres es por violación de llave foránea
 * (intento de borrar un registro referenciado por otro).
 */
function esErrorDeReferencia(error: { code?: string; message?: string }): boolean {
  // 23503 = foreign_key_violation en PostgreSQL
  return (
    error.code === "23503" ||
    /foreign key|violates foreign key|referenced/i.test(error.message ?? "")
  );
}

// ── Datos de ejemplo (seed) ─────────────────────────────────────────────

/**
 * Carga datos de ejemplo equivalentes a los del Excel OFK.
 * Solo actúa si el usuario no tiene datos maestros (evita duplicar).
 * Útil para probar la app rápidamente.
 */
export async function cargarDatosEjemplo() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Idempotencia: no cargar si ya hay categorías
  const { count } = await supabase
    .from("categorias")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);
  if (count && count > 0) return;

  // Categorías (mismas del Excel)
  const { data: categorias } = await supabase
    .from("categorias")
    .insert([
      { nombre: "Sueldo", tipo: "Ingreso", user_id: user.id },
      { nombre: "Freelance", tipo: "Ingreso", user_id: user.id },
      { nombre: "Alimentación", tipo: "Gasto", user_id: user.id },
      { nombre: "Transporte", tipo: "Gasto", user_id: user.id },
    ])
    .select("id, nombre, tipo");

  // Cuentas (mismas del Excel)
  const { data: cuentas } = await supabase
    .from("cuentas")
    .insert([
      { nombre: "Efectivo", saldo_inicial: 0, user_id: user.id },
      { nombre: "Banco", saldo_inicial: 0, user_id: user.id },
      { nombre: "Tarjeta", saldo_inicial: 0, user_id: user.id },
    ])
    .select("id, nombre");

  if (!categorias || !cuentas) {
    revalidatePath("/config");
    return;
  }

  const catSueldo = categorias.find((c) => c.nombre === "Sueldo")?.id;
  const catAlim = categorias.find((c) => c.nombre === "Alimentación")?.id;
  const ctaBanco = cuentas.find((c) => c.nombre === "Banco")?.id;
  const ctaEfectivo = cuentas.find((c) => c.nombre === "Efectivo")?.id;

  const hoy = new Date().toISOString().split("T")[0];

  // Ingreso y gasto de ejemplo (equivalentes al Excel: 3500 y 120)
  if (catSueldo && ctaBanco) {
    await supabase.from("ingresos").insert({
      fecha: hoy,
      categoria_id: catSueldo,
      cuenta_id: ctaBanco,
      valor: 3500,
      descripcion: "Sueldo (ejemplo)",
      user_id: user.id,
    });
  }
  if (catAlim && ctaEfectivo) {
    await supabase.from("gastos").insert({
      fecha: hoy,
      categoria_id: catAlim,
      cuenta_id: ctaEfectivo,
      valor: 120,
      descripcion: "Supermercado (ejemplo)",
      user_id: user.id,
    });
  }

  // Pago programado de ejemplo. Antes el seed insertaba tres pagos únicos
  // (Internet, Seguro, Gimnasio) en la tabla `pagos`, que ya no existe. Ahora
  // el concepto equivalente es una plantilla recurrente.
  await supabase.from("pagos_programados").insert({
    concepto: "Internet",
    valor: 45,
    recurrencia: "Mensual",
    tipo: "Gasto",
    cuenta_id: ctaEfectivo,
    fecha_inicio: hoy,
    dia_vencimiento: new Date(hoy).getDate(),
    user_id: user.id,
  });

  revalidatePath("/config");
  revalidatePath("/dashboard");
}
