import { describe, it, expect } from "vitest";
import { calcularIndicadores, rangoMes, resultadoVacio } from "./calculations";
import type { DatosMotor } from "./types";

/**
 * Tests del Motor de OpenFinanceKit.
 *
 * El dataset principal replica los datos de ejemplo del Excel
 * (scripts/test_excel.py) para garantizar consistencia entre
 * OFK Excel y OFK Web (AC-009).
 */

// ── Dataset base (consistente con el Excel) ─────────────────────────────
// Excel: Ingreso 3500, Gasto 120, Saldos iniciales 0,
//        Pagos: Pendiente 45+120=165, Vencido 35, Pagado 0
function datosEjemplo(): DatosMotor {
  return {
    ingresosMes: [3500],
    gastosMes: [120],
    ingresosHist: [3500],
    gastosHist: [120],
    saldosIniciales: [0, 0, 0],
    pagosPendientes: [45, 120],
    pagosVencidos: [35],
    pagosPagados: [],
  };
}

describe("calcularIndicadores — dataset del Excel", () => {
  const r = calcularIndicadores(datosEjemplo());

  it("ingresos del mes = 3500", () => {
    expect(r.ingresosMes).toBe(3500);
  });

  it("gastos del mes = 120", () => {
    expect(r.gastosMes).toBe(120);
  });

  it("balance del mes = ingresos - gastos = 3380", () => {
    expect(r.balanceMes).toBe(3380);
  });

  it("total ingresos histórico = 3500", () => {
    expect(r.totalIngresosHist).toBe(3500);
  });

  it("total gastos histórico = 120", () => {
    expect(r.totalGastosHist).toBe(120);
  });

  it("saldo actual = saldosIniciales + ingresos - gastos = 3380", () => {
    expect(r.saldoActual).toBe(3380);
  });

  it("pendiente de pago = 45 + 120 = 165", () => {
    expect(r.pendientePago).toBe(165);
  });

  it("total vencido = 35", () => {
    expect(r.totalVencido).toBe(35);
  });

  it("total pagado = 0", () => {
    expect(r.totalPagado).toBe(0);
  });

  it("disponible restante = saldo - pendiente = 3215", () => {
    expect(r.disponibleRestante).toBe(3215);
  });

  it("% gastado = gastos/ingresos = 3.4%", () => {
    expect(r.porcentajeGastado).toBe(3.4);
  });
});

describe("calcularIndicadores — con saldos iniciales", () => {
  it("saldo actual incluye saldos iniciales de cuentas", () => {
    const datos = datosEjemplo();
    datos.saldosIniciales = [1000, 500]; // 1500 inicial
    const r = calcularIndicadores(datos);
    // 1500 + 3500 - 120 = 4880
    expect(r.saldoActual).toBe(4880);
    // disponible = 4880 - 165 = 4715
    expect(r.disponibleRestante).toBe(4715);
  });
});

describe("calcularIndicadores — casos borde", () => {
  it("todo vacío devuelve ceros (no NaN)", () => {
    const r = resultadoVacio();
    expect(r.ingresosMes).toBe(0);
    expect(r.gastosMes).toBe(0);
    expect(r.balanceMes).toBe(0);
    expect(r.saldoActual).toBe(0);
    expect(r.disponibleRestante).toBe(0);
    expect(r.porcentajeGastado).toBe(0);
    // Ningún valor debe ser NaN
    Object.values(r).forEach((v) => expect(Number.isNaN(v)).toBe(false));
  });

  it("% gastado = 0 cuando no hay ingresos (división por cero)", () => {
    const datos: DatosMotor = {
      ingresosMes: [],
      gastosMes: [500],
      ingresosHist: [],
      gastosHist: [500],
      saldosIniciales: [],
      pagosPendientes: [],
      pagosVencidos: [],
      pagosPagados: [],
    };
    const r = calcularIndicadores(datos);
    expect(r.porcentajeGastado).toBe(0);
    expect(Number.isNaN(r.porcentajeGastado)).toBe(false);
  });

  it("balance negativo cuando gastos superan ingresos", () => {
    const datos = datosEjemplo();
    datos.ingresosMes = [100];
    datos.gastosMes = [300];
    const r = calcularIndicadores(datos);
    expect(r.balanceMes).toBe(-200);
  });

  it("saldo puede ser negativo si gastos históricos superan ingresos + saldos", () => {
    const datos: DatosMotor = {
      ingresosMes: [],
      gastosMes: [],
      ingresosHist: [100],
      gastosHist: [500],
      saldosIniciales: [0],
      pagosPendientes: [],
      pagosVencidos: [],
      pagosPagados: [],
    };
    const r = calcularIndicadores(datos);
    expect(r.saldoActual).toBe(-400);
  });

  it("% gastado redondea a 1 decimal", () => {
    const datos = datosEjemplo();
    datos.ingresosMes = [3];
    datos.gastosMes = [1];
    const r = calcularIndicadores(datos);
    // 1/3 = 0.3333... → 33.3%
    expect(r.porcentajeGastado).toBe(33.3);
  });

  it("suma múltiples ingresos y gastos del mes", () => {
    const datos = datosEjemplo();
    datos.ingresosMes = [1000, 2000, 500];
    datos.gastosMes = [100, 200, 50];
    const r = calcularIndicadores(datos);
    expect(r.ingresosMes).toBe(3500);
    expect(r.gastosMes).toBe(350);
    expect(r.balanceMes).toBe(3150);
  });
});

describe("rangoMes", () => {
  it("calcula rango de un mes normal", () => {
    expect(rangoMes("2026-08")).toEqual({
      inicio: "2026-08-01",
      fin: "2026-09-01",
    });
  });

  it("maneja diciembre → enero del año siguiente", () => {
    expect(rangoMes("2026-12")).toEqual({
      inicio: "2026-12-01",
      fin: "2027-01-01",
    });
  });

  it("formatea meses de un dígito con cero", () => {
    expect(rangoMes("2026-01")).toEqual({
      inicio: "2026-01-01",
      fin: "2026-02-01",
    });
  });
});
