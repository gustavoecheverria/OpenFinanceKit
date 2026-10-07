import { describe, it, expect } from "vitest";
import {
  calcularIndicadores,
  rangoMes,
  resultadoVacio,
  desplazarMes,
  etiquetaMes,
  calcularSaldosPorCuenta,
} from "./calculations";
import type { DatosMotor, DatosPorCuenta } from "./types";

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

describe("desplazarMes", () => {
  it("avanza un mes", () => {
    expect(desplazarMes("2026-08", 1)).toBe("2026-09");
  });

  it("retrocede un mes", () => {
    expect(desplazarMes("2026-08", -1)).toBe("2026-07");
  });

  it("cruza diciembre → enero del año siguiente", () => {
    expect(desplazarMes("2026-12", 1)).toBe("2027-01");
  });

  it("cruza enero → diciembre del año anterior", () => {
    expect(desplazarMes("2026-01", -1)).toBe("2025-12");
  });

  it("desplaza varios meses", () => {
    expect(desplazarMes("2026-08", -8)).toBe("2025-12");
  });
});

describe("etiquetaMes", () => {
  it("genera etiqueta legible en español", () => {
    expect(etiquetaMes("2026-08")).toBe("agosto 2026");
  });

  it("maneja enero y diciembre", () => {
    expect(etiquetaMes("2026-01")).toBe("enero 2026");
    expect(etiquetaMes("2026-12")).toBe("diciembre 2026");
  });
});


describe("calcularSaldosPorCuenta", () => {
  it("calcula correctamente el saldo de una sola cuenta", () => {
    const datos: DatosPorCuenta[] = [
      {
        id: 1,
        nombre: "Banco Principal",
        saldoInicial: 1000,
        ingresos: [500, 300],
        gastos: [200],
        pagosPagados: [100],
      },
    ];

    const resultado = calcularSaldosPorCuenta(datos);

    expect(resultado.cuentas).toHaveLength(1);
    expect(resultado.cuentas[0]).toEqual({
      id: 1,
      nombre: "Banco Principal",
      saldoInicial: 1000,
      totalIngresos: 800,
      totalGastos: 200,
      totalPagosPagados: 100,
      totalTransferenciasSalientes: 0,
      totalTransferenciasEntrantes: 0,
      saldoActual: 1500, // 1000 + 800 - 200 - 100
    });
  });

  it("calcula correctamente múltiples cuentas", () => {
    const datos: DatosPorCuenta[] = [
      {
        id: 1,
        nombre: "Banco",
        saldoInicial: 1000,
        ingresos: [500],
        gastos: [200],
        pagosPagados: [100],
      },
      {
        id: 2,
        nombre: "Efectivo",
        saldoInicial: 500,
        ingresos: [200],
        gastos: [150],
        pagosPagados: [0],
      },
    ];

    const resultado = calcularSaldosPorCuenta(datos);

    expect(resultado.cuentas).toHaveLength(2);
    expect(resultado.cuentas[0].saldoActual).toBe(1200); // 1000 + 500 - 200 - 100
    expect(resultado.cuentas[1].saldoActual).toBe(550); // 500 + 200 - 150 - 0
  });

  it("calcula saldo negativo cuando gastos + pagos > ingresos + inicial", () => {
    const datos: DatosPorCuenta[] = [
      {
        id: 1,
        nombre: "Banco",
        saldoInicial: 100,
        ingresos: [],
        gastos: [200],
        pagosPagados: [],
      },
    ];

    const resultado = calcularSaldosPorCuenta(datos);

    expect(resultado.cuentas[0].saldoActual).toBe(-100);
  });

  it("devuelve array vacío cuando no hay cuentas", () => {
    const resultado = calcularSaldosPorCuenta([]);
    expect(resultado.cuentas).toHaveLength(0);
  });
});

// ── Transferencias entre cuentas ────────────────────────────────────────
// TAREA-002 y TAREA-003 del SDD feature-pagos-programados.
//
// Una transferencia mueve saldo entre cuentas SIN alterar el saldo global.
// Estos tests son la defensa contra el error más grave posible en esta feature:
// que la suma de saldos por cuenta deje de cuadrar con el saldo global.
describe("calcularSaldosPorCuenta con transferencias", () => {
  it("resta en la cuenta origen y suma en la cuenta destino", () => {
    // Caso del usuario: saca $500.000 de la Cuenta 1 para llevarlos a Efectivo.
    const datos: DatosPorCuenta[] = [
      {
        id: 1,
        nombre: "Banco Principal",
        saldoInicial: 1000,
        ingresos: [],
        gastos: [],
        pagosPagados: [],
        transferenciasSalientes: [500],
        transferenciasEntrantes: [],
      },
      {
        id: 2,
        nombre: "Efectivo",
        saldoInicial: 0,
        ingresos: [],
        gastos: [],
        pagosPagados: [],
        transferenciasSalientes: [],
        transferenciasEntrantes: [500],
      },
    ];

    const resultado = calcularSaldosPorCuenta(datos);

    expect(resultado.cuentas[0].saldoActual).toBe(500); // 1000 - 500
    expect(resultado.cuentas[1].saldoActual).toBe(500); // 0 + 500
  });

  it("NO altera el saldo global: se resta y suma en la misma operación", () => {
    // AC-021: la suma de saldos por cuenta es idéntica antes y después
    const antes: DatosPorCuenta[] = [
      {
        id: 1,
        nombre: "Banco",
        saldoInicial: 1000,
        ingresos: [200],
        gastos: [100],
        pagosPagados: [50],
        transferenciasSalientes: [],
        transferenciasEntrantes: [],
      },
      {
        id: 2,
        nombre: "Efectivo",
        saldoInicial: 300,
        ingresos: [],
        gastos: [25],
        pagosPagados: [],
        transferenciasSalientes: [],
        transferenciasEntrantes: [],
      },
    ];
    const despues: DatosPorCuenta[] = [
      {
        ...antes[0],
        transferenciasSalientes: [400],
        transferenciasEntrantes: [],
      },
      {
        ...antes[1],
        transferenciasSalientes: [],
        transferenciasEntrantes: [400],
      },
    ];

    const sumaAntes = calcularSaldosPorCuenta(antes)
      .cuentas.reduce((s, c) => s + c.saldoActual, 0);
    const sumaDespues = calcularSaldosPorCuenta(despues)
      .cuentas.reduce((s, c) => s + c.saldoActual, 0);

    // 1000 + 200 - 100 - 50 = 1050;  300 - 25 = 275;  total 1325
    expect(sumaAntes).toBe(1325);
    expect(sumaDespues).toBe(sumaAntes);
  });

  it("permite gastar el efectivo recibido sin descuadrar el total", () => {
    // AC-025: entra $500.000 a Efectivo y se gastan $50.000 de ahí.
    // El total global solo baja $50.000, no $550.000.
    const datos: DatosPorCuenta[] = [
      {
        id: 1,
        nombre: "Banco",
        saldoInicial: 1000,
        ingresos: [],
        gastos: [],
        pagosPagados: [],
        transferenciasSalientes: [500],
        transferenciasEntrantes: [],
      },
      {
        id: 2,
        nombre: "Efectivo",
        saldoInicial: 0,
        ingresos: [],
        gastos: [50],
        pagosPagados: [],
        transferenciasSalientes: [],
        transferenciasEntrantes: [500],
      },
    ];

    const resultado = calcularSaldosPorCuenta(datos);
    const suma = resultado.cuentas.reduce((s, c) => s + c.saldoActual, 0);

    expect(resultado.cuentas[0].saldoActual).toBe(500);
    expect(resultado.cuentas[1].saldoActual).toBe(450); // 0 + 500 - 50
    expect(suma).toBe(950); // 1000 - 50
  });

  it("maneja múltiples transferencias acumuladas", () => {
    const datos: DatosPorCuenta[] = [
      {
        id: 1,
        nombre: "Banco",
        saldoInicial: 2000,
        ingresos: [],
        gastos: [],
        pagosPagados: [],
        transferenciasSalientes: [300, 200, 100],
        transferenciasEntrantes: [],
      },
      {
        id: 2,
        nombre: "Efectivo",
        saldoInicial: 0,
        ingresos: [],
        gastos: [],
        pagosPagados: [],
        transferenciasSalientes: [],
        transferenciasEntrantes: [300, 200, 100],
      },
    ];

    const resultado = calcularSaldosPorCuenta(datos);

    expect(resultado.cuentas[0].totalTransferenciasSalientes).toBe(600);
    expect(resultado.cuentas[1].totalTransferenciasEntrantes).toBe(600);
    expect(resultado.cuentas[0].saldoActual).toBe(1400);
    expect(resultado.cuentas[1].saldoActual).toBe(600);
  });

  it("cuadra con el saldo global de calcularIndicadores tras transferir, gastar e ingresar", () => {
    // AC-026: el test que amarra ambos cálculos.
    // Si alguien cambia una de las dos fórmulas sin la otra, esto falla.
    const cuentas: DatosPorCuenta[] = [
      {
        id: 1,
        nombre: "Banco",
        saldoInicial: 1000,
        ingresos: [800],
        gastos: [100],
        pagosPagados: [50],
        transferenciasSalientes: [500],
        transferenciasEntrantes: [100],
      },
      {
        id: 2,
        nombre: "Efectivo",
        saldoInicial: 0,
        ingresos: [0],
        gastos: [50],
        pagosPagados: [0],
        transferenciasSalientes: [100],
        transferenciasEntrantes: [500],
      },
    ];

    const saldosPorCuenta = calcularSaldosPorCuenta(cuentas);
    const suma = saldosPorCuenta.cuentas.reduce((s, c) => s + c.saldoActual, 0);

    // calcularIndicadores no conhece las transferencias: se anulan entre sí.
    const global = calcularIndicadores({
      ingresosMes: [],
      gastosMes: [],
      ingresosHist: [800],
      gastosHist: [100, 50],
      saldosIniciales: [1000],
      pagosPendientes: [],
      pagosVencidos: [],
      pagosPagados: [50],
    });

    expect(suma).toBe(global.saldoActual);
  });

  it("tolera cuentas sin transferencias (equivale a lista vacía)", () => {
    const datos: DatosPorCuenta[] = [
      {
        id: 1,
        nombre: "Banco",
        saldoInicial: 1000,
        ingresos: [100],
        gastos: [],
        pagosPagados: [],
      },
    ];

    const resultado = calcularSaldosPorCuenta(datos);

    expect(resultado.cuentas[0].totalTransferenciasSalientes).toBe(0);
    expect(resultado.cuentas[0].totalTransferenciasEntrantes).toBe(0);
    expect(resultado.cuentas[0].saldoActual).toBe(1100);
  });
});
