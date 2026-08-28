/**
 * Tipos del Motor de OpenFinanceKit.
 */

/** Resultado con todos los indicadores calculados. */
export interface MotorResult {
  ingresosMes: number;
  gastosMes: number;
  balanceMes: number;
  totalIngresosHist: number;
  totalGastosHist: number;
  saldoActual: number;
  pendientePago: number;
  totalVencido: number;
  totalPagado: number;
  disponibleRestante: number;
  porcentajeGastado: number;
}

/**
 * Datos crudos que el Motor necesita para calcular.
 * Los produce la capa de I/O (obtenerDatosMotor) y los consume
 * la función pura (calcularIndicadores).
 */
export interface DatosMotor {
  ingresosMes: number[];
  gastosMes: number[];
  ingresosHist: number[];
  gastosHist: number[];
  saldosIniciales: number[];
  pagosPendientes: number[];
  pagosVencidos: number[];
  pagosPagados: number[];
}
