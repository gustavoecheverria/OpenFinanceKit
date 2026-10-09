"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/form-state";
import type { Recurrencia } from "@/lib/motor";

/**
 * Server Actions de los pagos programados.
 *
 * SDD: .kiro/specs/feature-pagos-programados.md — Tareas 010, 011 y 012.
 *
 * La tabla pagos_programados NO tiene columna de estado: el estado se calcula
 * en cada render a partir de fecha_ultimo_pago, dia_vencimiento y la
 * recurrencia. Ver sección 5.5 del SDD.
 */

// ── Límites (G1) ──────────────────────────────────────────────────────────
const MAX_CONCEPTO = 255;

// ── Validación de fecha ISO (G4) ─────────────────────────────────────────
function esFechaValida(fecha: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const d = new Date(fecha);
  return !isNaN(d.getTime());
}

/** Valida el día 1-31. El ajuste a meses cortos lo hace el Motor. */
function esDiaValido(dia: number): boolean {
  return Number.isInteger(dia) && dia >= 1 && dia <= 31;
}

/**
 * Registra un pago programado (plantilla recurrente).
 *
 * El estado se deja en su valor por defecto: no se persiste a propósito.
 */
export async function crearPagoProgramado(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const concepto = (formData.get("concepto") as string)?.trim(); // G2: trim
  const valor = parseFloat(formData.get("valor") as string);
  const tipo = formData.get("tipo") as string;
  const recurrencia = formData.get("recurrencia") as string;
  const cuentaId = parseInt(formData.get("cuenta_id") as string);
  const categoriaId = parseInt(formData.get("categoria_id") as string);
  const fechaInicio = formData.get("fecha_inicio") as string;
  const diaVencimiento = parseInt(formData.get("dia_vencimiento") as string);

  if (!concepto) {
    return { error: "Completa el concepto." };
  }
  if (concepto.length > MAX_CONCEPTO) {
    return { error: `El concepto no puede superar ${MAX_CONCEPTO} caracteres.` };
  }
  if (isNaN(valor) || valor <= 0) {
    return { error: "El valor debe ser mayor que cero." };
  }
  if (tipo !== "Gasto" && tipo !== "Ingreso") {
    return { error: "Tipo inválido." };
  }
  // Sin "Diario": con un ciclo de 1 día la alerta de 5 días no cabe. Ver 5.5 del SDD.
  if (!["Mensual", "Quincenal", "Semanal"].includes(recurrencia)) {
    return { error: "Recurrencia inválida." };
  }
  if (isNaN(cuentaId) || cuentaId <= 0) {
    return { error: "Selecciona la cuenta de la que sale el pago." };
  }
  // La categoría se elige explícitamente. Antes se tomaba la primera del tipo,
  // y eso mandaba todos los pagos recurrentes a la categoría más antigua del
  // usuario (típicamente "Gastos Hormiga"). Ver migración 009.
  if (isNaN(categoriaId) || categoriaId <= 0) {
    return { error: "Selecciona la categoría donde se va a registrar." };
  }
  if (!esFechaValida(fechaInicio)) {
    return { error: "La fecha del primer vencimiento no es válida." };
  }
  if (!esDiaValido(diaVencimiento)) {
    return { error: "El día del mes debe estar entre 1 y 31." };
  }

  // Verificar que la cuenta pertenece al usuario (RN-002 security check)
  const { data: cuenta } = await supabase
    .from("cuentas")
    .select("id")
    .eq("id", cuentaId)
    .eq("user_id", user.id)
    .single();

  if (!cuenta) {
    return { error: "La cuenta seleccionada no existe o no pertenece a ti." };
  }

  // Verificar que la categoría pertenece al usuario Y es del tipo del pago.
  // Sin esto se podría colar una categoría de Ingreso en un pago de Gasto, y
  // el registro real quedaría con el tipo cruzado.
  const { data: categoria } = await supabase
    .from("categorias")
    .select("id, tipo")
    .eq("id", categoriaId)
    .eq("user_id", user.id)
    .single();

  if (!categoria) {
    return { error: "La categoría seleccionada no existe o no pertenece a ti." };
  }

  if (categoria.tipo !== tipo) {
    return {
      error: `Esa categoría es de ${categoria.tipo === "Gasto" ? "gastos" : "ingresos"}. Elige una del mismo tipo que el pago.`,
    };
  }

  const { error } = await supabase.from("pagos_programados").insert({
    concepto,
    valor,
    tipo,
    recurrencia: recurrencia as Recurrencia,
    cuenta_id: cuentaId,
    categoria_id: categoriaId,
    fecha_inicio: fechaInicio,
    dia_vencimiento: diaVencimiento,
    user_id: user.id,
  });

  if (error) return { error: "No se pudo guardar el pago programado." };

  revalidatePath("/pagos");
  revalidatePath("/dashboard");
  return { error: null, ok: true };
}

/**
 * Marca un pago programado como pagado.
 *
 * Hace dos cosas (SDD 5.8):
 * 1. Crea el registro real en `gastos` o `ingresos` con la fecha de hoy.
 * 2. Guarda fecha_ultimo_pago = hoy, lo que hace que el estado pase a "Al día"
 *    y que el próximo vencimiento se calcule desde esa fecha. Así el ciclo se
 *    renueva solo.
 *
 * NO guarda estado: el estado se deriva de fecha_ultimo_pago.
 */
export async function marcarPagoProgramadoPagado(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const id = parseInt(formData.get("id") as string);
  if (isNaN(id)) return { error: "Pago programado inválido." };

  // Leer la plantilla y verificar que sea del usuario
  const { data: pago, error: errorLectura } = await supabase
    .from("pagos_programados")
    .select("id, concepto, valor, tipo, cuenta_id, categoria_id, fecha_ultimo_pago")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (errorLectura || !pago) {
    return { error: "El pago programado no existe." };
  }

  const hoy = new Date().toISOString().split("T")[0];

  // Protección contra doble clic: si ya se pagó hoy, no se registra otra vez.
  // La acción es idempotente por día.
  if (pago.fecha_ultimo_pago === hoy) {
    return { error: "Este pago ya fue marcado como pagado hoy." };
  }

  // La categoría viene GUARDADA en la plantilla, elegida por el usuario al
  // crearla (migración 009). Antes se tomaba la primera del tipo, lo que
  // mandaba todos los pagos recurrentes a la categoría más antigua.
  const categoriaId = pago.categoria_id;

  // El registro real va a gastos o ingresos según el tipo de la plantilla.
  // descripcion lleva el concepto del pago programado.
  if (pago.tipo === "Gasto") {
    const { error } = await supabase.from("gastos").insert({
      fecha: hoy,
      categoria_id: categoriaId,
      cuenta_id: pago.cuenta_id,
      valor: Number(pago.valor),
      descripcion: pago.concepto,
      user_id: user.id,
    });

    if (error) {
      return { error: "No se pudo registrar el gasto. Intenta de nuevo." };
    }
  } else {
    const { error } = await supabase.from("ingresos").insert({
      fecha: hoy,
      categoria_id: categoriaId,
      cuenta_id: pago.cuenta_id,
      valor: Number(pago.valor),
      descripcion: pago.concepto,
      user_id: user.id,
    });

    if (error) {
      return { error: "No se pudo registrar el ingreso. Intenta de nuevo." };
    }
  }

  // Renovar el ciclo: con fecha_ultimo_pago = hoy, el Motor recalcula el
  // próximo vencimiento y el estado vuelve a "Al día".
  const { error: errorRenovar } = await supabase
    .from("pagos_programados")
    .update({ fecha_ultimo_pago: hoy })
    .eq("id", id)
    .eq("user_id", user.id);

  if (errorRenovar) {
    return { error: "Se registró el movimiento pero no se renovó el pago." };
  }

  revalidatePath("/pagos");
  revalidatePath("/dashboard");
  revalidatePath("/gastos");
  revalidatePath("/ingresos");

  return { error: null, ok: true };
}

/**
 * Activa o desactiva un pago programado.
 *
 * Desactivar NO borra: la plantilla se conserva con su fecha_ultimo_pago, así
 * que si la reactivás sigue el mismo ciclo.
 */
export async function togglePagoProgramadoActivo(
  id: number,
  activo: boolean
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  await supabase
    .from("pagos_programados")
    .update({ activo })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/pagos");
  revalidatePath("/dashboard");
}

// NO existe eliminarPagoProgramado, y es intencional.
//
// Decisión del usuario (2026-10-08): un pago programado nunca se borra, se
// desactiva. Desactivar lo saca de la lista pero conserva el registro y su
// fecha_ultimo_pago, así que el historial no se pierde y reactivarlo retoma
// el ciclo donde estaba.
//
// Borrar la fila rompería esa garantía: los registros ya generados en gastos o
// ingresos seguirían existiendo sin la plantilla que los originó, y la lista
// de pagos no explicaría de dónde salieron.
