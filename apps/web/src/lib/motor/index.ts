import { createClient } from "@/lib/supabase/server";
import { calcularIndicadores, rangoMes, resultadoVacio } from "./calculations";
import type { DatosMotor, MotorResult } from "./types";

export type { MotorResult, DatosMotor } from "./types";
export {
  calcularIndicadores,
  rangoMes,
  resultadoVacio,
  mesActual,
  desplazarMes,
  etiquetaMes,
} from "./calculations";

/**
 * Obtiene los datos crudos del Motor desde Supabase para el usuario y mes dados.
 * Capa de I/O — no realiza cálculos.
 */
async function obtenerDatosMotor(
  userId: string,
  mes: string
): Promise<DatosMotor> {
  const supabase = await createClient();
  const { inicio, fin } = rangoMes(mes);

  const [
    ingresosDelMes,
    gastosDelMes,
    totalIngresos,
    totalGastos,
    saldosIniciales,
    pagosPendientes,
    pagosVencidos,
    pagosPagados,
  ] = await Promise.all([
    supabase.from("ingresos").select("valor").eq("user_id", userId).gte("fecha", inicio).lt("fecha", fin),
    supabase.from("gastos").select("valor").eq("user_id", userId).gte("fecha", inicio).lt("fecha", fin),
    supabase.from("ingresos").select("valor").eq("user_id", userId),
    supabase.from("gastos").select("valor").eq("user_id", userId),
    supabase.from("cuentas").select("saldo_inicial").eq("user_id", userId),
    supabase.from("pagos").select("valor").eq("user_id", userId).eq("estado", "Pendiente"),
    supabase.from("pagos").select("valor").eq("user_id", userId).eq("estado", "Vencido"),
    supabase.from("pagos").select("valor").eq("user_id", userId).eq("estado", "Pagado"),
  ]);

  return {
    ingresosMes: extraer(ingresosDelMes.data, "valor"),
    gastosMes: extraer(gastosDelMes.data, "valor"),
    ingresosHist: extraer(totalIngresos.data, "valor"),
    gastosHist: extraer(totalGastos.data, "valor"),
    saldosIniciales: extraer(saldosIniciales.data, "saldo_inicial"),
    pagosPendientes: extraer(pagosPendientes.data, "valor"),
    pagosVencidos: extraer(pagosVencidos.data, "valor"),
    pagosPagados: extraer(pagosPagados.data, "valor"),
  };
}

/**
 * Calcula todos los indicadores financieros del usuario para el mes indicado.
 * Compone la capa de I/O con la lógica pura de cálculo.
 * @param mes formato "YYYY-MM". Si no se pasa, usa el mes actual.
 */
export async function calcularMotor(mes?: string): Promise<MotorResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return resultadoVacio();
  }

  const mesActual = mes || new Date().toISOString().slice(0, 7);
  const datos = await obtenerDatosMotor(user.id, mesActual);
  return calcularIndicadores(datos);
}

// ── Helpers ─────────────────────────────────────────────────────────────

/** Extrae una columna numérica de las filas devueltas por Supabase. */
function extraer(
  rows: Record<string, unknown>[] | null,
  field: string
): number[] {
  if (!rows) return [];
  return rows.map((row) => Number(row[field] || 0));
}
