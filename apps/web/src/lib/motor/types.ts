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

/** Datos crudos de una cuenta para calcular su saldo. */
export interface DatosPorCuenta {
  id: number;
  nombre: string;
  saldoInicial: number;
  ingresos: number[];
  gastos: number[];
  pagosPagados: number[];
  /**
   * Transferencias donde esta cuenta es el ORIGEN. Se restan del saldo.
   * Ej: sacar $500.000 de la Cuenta 1 para llevarlos a Efectivo.
   *
   * Opcional para no romper los datos existentes: equivale a lista vacía.
   */
  transferenciasSalientes?: number[];
  /**
   * Transferencias donde esta cuenta es el DESTINO. Se suman al saldo.
   * Ej: los $500.000 que llegaron a Efectivo.
   *
   * Opcional para no romper los datos existentes: equivale a lista vacía.
   */
  transferenciasEntrantes?: number[];
}

/** Saldo calculado de una cuenta individual. */
export interface SaldoCuenta {
  id: number;
  nombre: string;
  saldoInicial: number;
  totalIngresos: number;
  totalGastos: number;
  totalPagosPagados: number;
  /** Total de transferencias saliendo de esta cuenta (se resta). */
  totalTransferenciasSalientes: number;
  /** Total de transferencias hacia esta cuenta (se suma). */
  totalTransferenciasEntrantes: number;
  saldoActual: number;
}

/** Resultado de la función calcularSaldosPorCuenta. */
export interface SaldosPorCuentaResult {
  cuentas: SaldoCuenta[];
}
