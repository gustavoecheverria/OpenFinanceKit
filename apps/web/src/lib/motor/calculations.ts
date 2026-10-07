import type { DatosMotor, MotorResult, DatosPorCuenta, SaldosPorCuentaResult } from "./types";

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
  // RN-002: Los pagos en estado "Pagado" se descuentan del saldo igual que los gastos.
  // Solo se descuentan los que tienen cuenta_id (los creados antes de la migración
  // tienen NULL y no se deben descontar porque no se sabe de dónde salieron).
  const saldoActual =
    sumaSaldosIniciales + totalIngresosHist - totalGastosHist - totalPagado;
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

/** Mes actual en formato "YYYY-MM". */
export function mesActual(): string {
  return new Date().toISOString().slice(0, 7);
}

/**
 * Desplaza un mes N posiciones (positivo = futuro, negativo = pasado).
 * Función pura. @param mes formato "YYYY-MM"
 */
export function desplazarMes(mes: string, delta: number): string {
  const [year, month] = mes.split("-").map(Number);
  // month es 1-12; el índice 0-based facilita el cálculo con Date
  const d = new Date(Date.UTC(year, month - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

const NOMBRES_MES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/**
 * Etiqueta legible de un mes. Ej: "2026-08" → "agosto 2026".
 * Función pura. @param mes formato "YYYY-MM"
 */
export function etiquetaMes(mes: string): string {
  const [year, month] = mes.split("-").map(Number);
  return `${NOMBRES_MES[month - 1]} ${year}`;
}

/**
 * Calcula el saldo actual de cada cuenta individualmente.
 * Función pura — sin I/O. RN-002: La lógica vive en el Motor.
 *
 * SALDO DE UNA CUENTA:
 *   saldoInicial + ingresos - gastos - pagosPagados
 *     - transferenciasSalientes + transferenciasEntrantes
 *
 * Una transferencia NO altera el saldo global: se resta en la cuenta origen y
 * se suma en la cuenta destino, en la misma operación. Por eso la suma de los
 * saldos por cuenta sigue cuadrando con el saldo global de calcularIndicadores.
 *
 * @param datosPorCuenta array de datos crudos por cuenta
 * @returns SaldosPorCuentaResult con cuentas calculadas
 */
export function calcularSaldosPorCuenta(
  datosPorCuenta: DatosPorCuenta[]
): SaldosPorCuentaResult {
  const cuentas = datosPorCuenta.map((d) => {
    const totalIngresos = sumar(d.ingresos);
    const totalGastos = sumar(d.gastos);
    const totalPagosPagados = sumar(d.pagosPagados);
    const totalTransferenciasSalientes = sumar(d.transferenciasSalientes);
    const totalTransferenciasEntrantes = sumar(d.transferenciasEntrantes);
    const saldoActual =
      d.saldoInicial +
      totalIngresos -
      totalGastos -
      totalPagosPagados -
      totalTransferenciasSalientes +
      totalTransferenciasEntrantes;
    return {
      id: d.id,
      nombre: d.nombre,
      saldoInicial: d.saldoInicial,
      totalIngresos,
      totalGastos,
      totalPagosPagados,
      totalTransferenciasSalientes,
      totalTransferenciasEntrantes,
      saldoActual,
    };
  });
  return { cuentas };
}

// ── Helpers ─────────────────────────────────────────────────────────────

/**
 * Suma una lista de valores numéricos, tolerando null/undefined.
 * Acepta `undefined` porque los campos opcionales de DatosPorCuenta
 * (transferenciasSalientes / transferenciasEntrantes) equivalen a lista vacía.
 */
function sumar(valores: number[] | undefined): number {
  if (!valores || valores.length === 0) return 0;
  return valores.reduce((sum, v) => sum + Number(v || 0), 0);
}
