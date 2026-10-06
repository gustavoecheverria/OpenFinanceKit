import { createClient } from "@/lib/supabase/server";
import { calcularIndicadores, rangoMes, resultadoVacio, calcularSaldosPorCuenta } from "./calculations";
import type { DatosMotor, MotorResult, DatosPorCuenta, SaldosPorCuentaResult } from "./types";

export type { MotorResult, DatosMotor, DatosPorCuenta, SaldoCuenta, SaldosPorCuentaResult } from "./types";
export {
  calcularIndicadores,
  calcularSaldosPorCuenta,
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
    supabase.from("pagos").select("valor").eq("user_id", userId).eq("estado", "Pagado").not("cuenta_id", "is", null),
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

/**
 * Obtiene los saldos actuales de todas las cuentas del usuario.
 * Capa de I/O — hace queries a Supabase y llama a calcularSaldosPorCuenta.
 * Optimización posible: GROUP BY en SQL (pero por MVP usamos queries simples).
 */
async function obtenerSaldosPorCuentaData(
  userId: string
): Promise<DatosPorCuenta[]> {
  const supabase = await createClient();

  // Obtener todas las cuentas del usuario
  const { data: cuentas } = await supabase
    .from("cuentas")
    .select("id, nombre, saldo_inicial")
    .eq("user_id", userId)
    .order("nombre");

  if (!cuentas || cuentas.length === 0) {
    return [];
  }

  // Para cada cuenta, obtener ingresos, gastos y pagos pagados
  const datosPorCuenta: DatosPorCuenta[] = await Promise.all(
    cuentas.map(async (cuenta) => {
      const [{ data: ingresos }, { data: gastos }, { data: pagosPagados }] =
        await Promise.all([
          supabase
            .from("ingresos")
            .select("valor")
            .eq("user_id", userId)
            .eq("cuenta_id", cuenta.id),
          supabase
            .from("gastos")
            .select("valor")
            .eq("user_id", userId)
            .eq("cuenta_id", cuenta.id),
          supabase
            .from("pagos")
            .select("valor")
            .eq("user_id", userId)
            .eq("cuenta_id", cuenta.id)
            .eq("estado", "Pagado"),
        ]);

      return {
        id: cuenta.id,
        nombre: cuenta.nombre,
        saldoInicial: Number(cuenta.saldo_inicial),
        ingresos: extraer(ingresos, "valor"),
        gastos: extraer(gastos, "valor"),
        pagosPagados: extraer(pagosPagados, "valor"),
      };
    })
  );

  return datosPorCuenta;
}

/**
 * Wrapper público que obtiene y calcula los saldos por cuenta para el usuario autenticado.
 * Si no hay usuario, devuelve un resultado vacío.
 */
export async function obtenerSaldosPorCuenta(): Promise<SaldosPorCuentaResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { cuentas: [] };
  }

  const datosPorCuenta = await obtenerSaldosPorCuentaData(user.id);
  return calcularSaldosPorCuenta(datosPorCuenta);
}

/**
 * Obtiene los pagos del usuario que tienen cuenta_id = NULL.
 * Estos son pagos antiguos creados antes de la migración 002.
 * Están descontados del saldo global pero no de ninguna cuenta individual.
 */
export async function obtenerPagosSinAsignar(): Promise<Array<{
  id: number;
  concepto: string;
  fecha_vencimiento: string | null;
  valor: number;
  estado: string;
}>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from("pagos")
    .select("id, concepto, fecha_vencimiento, valor, estado")
    .eq("user_id", user.id)
    .is("cuenta_id", null)
    .eq("estado", "Pagado")
    .order("fecha_vencimiento", { ascending: false });

  return data || [];
}

/**
 * Reasigna un pago a una cuenta específica.
 * Requiere que el usuario sea propietario del pago y la cuenta.
 * RN-004: Modificación de datos vía Server Action.
 */
export async function reasignarPagoACuenta(
  pagoId: number,
  cuentaId: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "No autenticado" };
  }

  // Validar que el pago pertenece al usuario y está sin asignar
  const { data: pago, error: errorPago } = await supabase
    .from("pagos")
    .select("id, user_id, cuenta_id")
    .eq("id", pagoId)
    .eq("user_id", user.id)
    .is("cuenta_id", null)
    .single();

  if (errorPago || !pago) {
    return { success: false, error: "Pago no encontrado o ya está asignado" };
  }

  // Validar que la cuenta pertenece al usuario
  const { data: cuenta, error: errorCuenta } = await supabase
    .from("cuentas")
    .select("id, user_id")
    .eq("id", cuentaId)
    .eq("user_id", user.id)
    .single();

  if (errorCuenta || !cuenta) {
    return { success: false, error: "Cuenta no encontrada" };
  }

  // Reasignar el pago
  const { error: errorUpdate } = await supabase
    .from("pagos")
    .update({ cuenta_id: cuentaId })
    .eq("id", pagoId)
    .eq("user_id", user.id);

  if (errorUpdate) {
    return { success: false, error: errorUpdate.message };
  }

  return { success: true };
}
