"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { obtenerSaldosPorCuenta } from "@/lib/motor";
import type { FormState } from "@/lib/form-state";

// ── Límites (G1) ──────────────────────────────────────────────────────────
const MAX_CONCEPTO = 255;

// ── Validación de fecha ISO (G4) ─────────────────────────────────────────
function esFechaValida(fecha: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const d = new Date(fecha);
  return !isNaN(d.getTime());
}

/**
 * Transfiere saldo de una cuenta a otra.
 *
 * Es la operación que hace que "Efectivo" sea una cuenta real: el usuario saca
 * plata de la Cuenta 1 y la pasa a Efectivo, y ahí puede gastar sin que el
 * saldo global se altere.
 *
 * NO altera el saldo global: se resta en el origen y se suma en el destino.
 * Ver sección 5.1 del SDD feature-pagos-programados.
 */
export async function transferirEntreCuentas(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const origenId = parseInt(formData.get("origen_id") as string);
  const destinoId = parseInt(formData.get("destino_id") as string);
  const valor = parseFloat(formData.get("valor") as string);
  const fecha = formData.get("fecha") as string;
  // G2: trim; G1: maxLength
  const concepto = (formData.get("concepto") as string)?.trim() || null;

  if (isNaN(origenId) || isNaN(destinoId)) {
    return { error: "Selecciona las cuentas de origen y destino." };
  }
  // El CHECK de la base también lo impide, pero se valida acá para dar un
  // mensaje claro en vez de un error de Postgres.
  if (origenId === destinoId) {
    return { error: "Las cuentas de origen y destino deben ser distintas." };
  }
  if (isNaN(valor) || valor <= 0) {
    return { error: "El valor debe ser mayor que cero." };
  }
  if (!esFechaValida(fecha)) {
    return { error: "La fecha no es válida." };
  }
  if (concepto && concepto.length > MAX_CONCEPTO) {
    return { error: `El concepto no puede superar ${MAX_CONCEPTO} caracteres.` };
  }

  // Verificar que ambas cuentas pertenecen al usuario.
  // El RLS de la tabla transferencias solo valida user_id, no que las cuentas
  // referenciadas sean suyas. Eso se valida acá (ver nota en la migración 004).
  const { data: cuentas } = await supabase
    .from("cuentas")
    .select("id, nombre")
    .eq("user_id", user.id)
    .in("id", [origenId, destinoId]);

  if (!cuentas || cuentas.length !== 2) {
    return { error: "Una de las cuentas no existe o no pertenece a ti." };
  }

  // No se puede transferir más que el saldo disponible en el origen.
  const saldos = await obtenerSaldosPorCuenta();
  const origen = saldos.cuentas.find((c) => c.id === origenId);
  const saldoDisponible = origen?.saldoActual ?? 0;

  if (valor > saldoDisponible) {
    return {
      error: `No tienes saldo suficiente en ${origen?.nombre ?? "la cuenta de origen"}. Disponible: $${saldoDisponible.toLocaleString("es", { minimumFractionDigits: 2 })}.`,
    };
  }

  const { error } = await supabase.from("transferencias").insert({
    origen_id: origenId,
    destino_id: destinoId,
    valor,
    fecha,
    concepto,
    user_id: user.id,
  });

  if (error) {
    return { error: "No se pudo registrar la transferencia. Intenta de nuevo." };
  }

  // La transferencia afecta los saldos por cuenta y el detalle de ambas cuentas.
  revalidatePath("/cuentas/transferir");
  revalidatePath(`/cuentas/${origenId}`);
  revalidatePath(`/cuentas/${destinoId}`);
  revalidatePath("/dashboard");
  revalidatePath("/config");

  return { error: null, ok: true };
}
