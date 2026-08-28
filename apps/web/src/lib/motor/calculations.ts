import type { DatosMotor, MotorResult } from "./types";

/**
 * Motor de cálculos de OpenFinanceKit — lógica pura.
 *
 * RN-002: Toda la lógica de negocio financiera vive aquí.
 * Esta función NO hace I/O: recibe los datos ya obtenidos y devuelve
 * los indicadores. Es determinista y 100% testeable sin base de datos.
 */
export function calcularIndicadores(datos: DatosMotor): MotorResult {
  const ingresosMes = sumar(datos.ingresosMes);
  const gastosMes = sumar(datos.gastosMes);
  const totalIngresosHist = sumar(datos.ingresosHist);
  const totalGastosHist = sumar(datos.gastosHist);
  const sumaSaldosIniciales = sumar(datos.saldosIniciales);
  const pendientePago = sumar(datos.pagosPendientes);
  const totalVencido = sumar(datos.pagosVencidos);
  const totalPagado = sumar(datos.pagosPagados);

  // Cálculos derivados
  const balanceMes = ingresosMes - gastosMes;
  const saldoActual = sumaSaldosIniciales + totalIngresosHist - totalGastosHist;
  const disponibleRestante = saldoActual - pendientePago;
  const porcentajeGastado =
    ingresosMes > 0 ? Math.round((gastosMes / ingresosMes) * 1000) / 10 : 0;

  return {
    ingresosMes,
    gastosMes,
    balanceMes,
    totalIngresosHist,
    totalGastosHist,
    saldoActual,
    pendientePago,
    totalVencido,
    totalPagado,
    disponibleRestante,
    porcentajeGastado,
  };
}

/** Resultado vacío (todos los indicadores en cero). */
export function resultadoVacio(): MotorResult {
  return calcularIndicadores({
    ingresosMes: [],
    gastosMes: [],
    ingresosHist: [],
    gastosHist: [],
    saldosIniciales: [],
    pagosPendientes: [],
    pagosVencidos: [],
    pagosPagados: [],
  });
}

/**
 * Calcula el rango de fechas [inicio, fin) de un mes dado.
 * Función pura, testeable.
 * @param mes formato "YYYY-MM"
 */
export function rangoMes(mes: string): { inicio: string; fin: string } {
  const [year, month] = mes.split("-").map(Number);
  const inicio = `${year}-${String(month).padStart(2, "0")}-01`;
  const fin =
    month === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(month + 1).padStart(2, "0")}-01`;
  return { inicio, fin };
}

// ── Helpers ─────────────────────────────────────────────────────────────

/** Suma una lista de valores numéricos, tolerando null/undefined. */
function sumar(valores: number[]): number {
  if (!valores || valores.length === 0) return 0;
  return valores.reduce((sum, v) => sum + Number(v || 0), 0);
}
