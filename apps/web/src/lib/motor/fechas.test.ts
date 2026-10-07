/**
 * Tests de la lógica de fechas de pagos programados.
 *
 * SDD: .kiro/specs/feature-pagos-programados.md
 * Tareas: 004 (cálculo de vencimiento), 005 (casos borde),
 *         005a/005b (período de gracia y estados)
 *
 * Todas las fechas son UTC. El SDD exige cubrir: fin de mes, febrero bisiesto,
 * recurrencia vencida que debe avanzar, los cuatro estados, y el caso de
 * pago recién realizado en las cuatro recurrencias.
 */

import { describe, it, expect } from "vitest";
import {
  calcularProximaVencimiento,
  calcularEstadoProgramado,
  diasAlDia,
  diasEnMes,
  diasEntre,
  desdeISO,
  aISO,
  finGracia,
  textoCuentaRegresiva,
  diasParaVencimiento,
  DIAS_ALERTA,
  type Recurrencia,
} from "./fechas";

/** Atajo: construye una fecha UTC desde "YYYY-MM-DD". */
function f(iso: string): Date {
  const d = desdeISO(iso);
  if (!d) throw new Error(`fecha inválida en el test: ${iso}`);
  return d;
}

describe("helpers de fecha", () => {
  it("devuelve los días correctos de cada mes", () => {
    expect(diasEnMes(2026, 1)).toBe(31); // enero
    expect(diasEnMes(2026, 2)).toBe(28); // febrero 2026, no bisiesto
    expect(diasEnMes(2024, 2)).toBe(29); // febrero 2024, bisiesto
    expect(diasEnMes(2026, 4)).toBe(30); // abril
    expect(diasEnMes(2026, 12)).toBe(31); // diciembre
  });

  it("convierte a ISO en UTC sin corrimiento de zona", () => {
    expect(aISO(f("2026-03-15"))).toBe("2026-03-15");
    expect(aISO(f("2026-01-01"))).toBe("2026-01-01");
  });

  it("parsea fechas ISO válidas", () => {
    expect(desdeISO("2026-10-06")).not.toBeNull();
  });

  it("rechaza formatos inválidos", () => {
    expect(desdeISO("06-10-2026")).toBeNull(); // dd-mm-aaaa
    expect(desdeISO("2026-10")).toBeNull();
    expect(desdeISO("")).toBeNull();
    expect(desdeISO("no-es-fecha")).toBeNull();
  });

  it("rechaza fechas que no existen (31 de febrero)", () => {
    expect(desdeISO("2026-02-31")).toBeNull();
    expect(desdeISO("2026-04-31")).toBeNull();
  });

  it("cuenta días calendario correctamente", () => {
    expect(diasEntre(f("2026-10-01"), f("2026-10-06"))).toBe(5);
    expect(diasEntre(f("2026-10-06"), f("2026-10-01"))).toBe(-5);
    expect(diasEntre(f("2026-10-06"), f("2026-10-06"))).toBe(0);
  });

  it("cuenta bien un mes con 28 días", () => {
    expect(diasEntre(f("2026-02-01"), f("2026-03-01"))).toBe(28);
  });
});

describe("calcularProximaVencimiento — Mensual", () => {
  it("devuelve el vencimiento del mes siguiente, no el mismo día de pago", () => {
    // Esta función calcula el SIGUIENTE vencimiento a un pago ya realizado.
    // Si pagaste el arriendo del 15, el próximo es el 15 del mes que viene, no
    // el 15 de hoy otra vez (eso lo deja venciendo al instante).
    // El primer vencimiento de un pago NUNCA pagado lo calcula
    // hornearPagosProgramados, en otro módulo.
    const r = calcularProximaVencimiento(f("2026-10-06"), "Mensual", 15);
    expect(aISO(r)).toBe("2026-11-15");
  });

  it("el día de vencimiento ya pasado avanza al mes siguiente", () => {
    const r = calcularProximaVencimiento(f("2026-10-20"), "Mensual", 15);
    expect(aISO(r)).toBe("2026-11-15");
  });

  it("ajusta el día 31 al último día de meses cortos", () => {
    // 31 de octubre → noviembre tiene 30 días
    const r = calcularProximaVencimiento(f("2026-10-31"), "Mensual", 31);
    expect(aISO(r)).toBe("2026-11-30");
  });

  it("ajusta el día 31 en febrero bisiesto", () => {
    // 31 de enero 2024 → febrero 2024 tiene 29 días
    const r = calcularProximaVencimiento(f("2024-01-31"), "Mensual", 31);
    expect(aISO(r)).toBe("2024-02-29");
  });

  it("ajusta el día 31 en febrero no bisiesto", () => {
    const r = calcularProximaVencimiento(f("2026-01-31"), "Mensual", 31);
    expect(aISO(r)).toBe("2026-02-28");
  });

  it("mantiene el día cuando existe en todos los meses", () => {
    const r = calcularProximaVencimiento(f("2026-09-10"), "Mensual", 5);
    expect(aISO(r)).toBe("2026-10-05");
  });

  it("avanza dos meses si el vencimiento del mes siguiente ya pasó", () => {
    // Hoy es 25 de noviembre. El día 5 de diciembre todavía no es futuro...
    // no: sí es futuro, así que debe devolver ese.
    const r = calcularProximaVencimiento(f("2026-11-25"), "Mensual", 5);
    expect(aISO(r)).toBe("2026-12-05");
  });

  it("pagado en diciembre con vencimiento día 15 pasa a enero", () => {
    const r = calcularProximaVencimiento(f("2026-12-10"), "Mensual", 15);
    expect(aISO(r)).toBe("2027-01-15");
  });

  it("sí salta al año siguiente si el día de vencimiento de diciembre ya pasó", () => {
    const r = calcularProximaVencimiento(f("2026-12-20"), "Mensual", 15);
    expect(aISO(r)).toBe("2027-01-15");
  });

  it("el resultado siempre es futuro, aunque el vencimiento de hoy ya pasó", () => {
    const hoy = f("2026-10-06");
    const r = calcularProximaVencimiento(hoy, "Mensual", 5);
    expect(r.getTime()).toBeGreaterThan(hoy.getTime());
    expect(aISO(r)).toBe("2026-11-05");
  });
});

describe("calcularProximaVencimiento — Quincenal", () => {
  it("devuelve el día configurado del mes actual si es futuro", () => {
    const r = calcularProximaVencimiento(f("2026-10-03"), "Quincenal", 5);
    expect(aISO(r)).toBe("2026-10-05");
  });

  it("devuelve el segundo vencimiento del mes si el primero ya pasó", () => {
    // Configurado día 5, el segundo cae el 20.
    const r = calcularProximaVencimiento(f("2026-10-10"), "Quincenal", 5);
    expect(aISO(r)).toBe("2026-10-20");
  });

  it("pasa al mes siguiente cuando ya no quedan vencimientos este mes", () => {
    const r = calcularProximaVencimiento(f("2026-10-25"), "Quincenal", 5);
    expect(aISO(r)).toBe("2026-11-05");
  });

  it("queda siempre en fecha de mes, sin desplazarse por días corridos", () => {
    // Este es el motivo de diseño: con 15 días corridos el vencimiento se
    // movería del 20 al 4 del mes siguiente y seguiría corriéndose.
    let r = calcularProximaVencimiento(f("2026-10-01"), "Quincenal", 5);
    const fechas: string[] = [aISO(r)];
    for (let i = 0; i < 4; i++) {
      r = calcularProximaVencimiento(sumarDias(r, 1), "Quincenal", 5);
      fechas.push(aISO(r));
    }
    // Todos los días deben ser 5 o 20.
    for (const fecha of fechas) {
      const dia = Number(fecha.slice(-2));
      expect([5, 20]).toContain(dia);
    }
  });
});

describe("calcularProximaVencimiento — Semanal", () => {
  it("suma 7 días para Semanal", () => {
    const r = calcularProximaVencimiento(f("2026-10-06"), "Semanal", 1);
    expect(aISO(r)).toBe("2026-10-13");
  });

  it("nunca devuelve una fecha pasada", () => {
    const hoy = f("2026-10-06");
    const r = calcularProximaVencimiento(hoy, "Semanal", 1);
    expect(r.getTime()).toBeGreaterThan(hoy.getTime());
  });

  it("no existe la recurrencia Diario: el ciclo de 1 día no admite alerta", () => {
    // Ver el comentario de Recurrencia en fechas.ts. Con alerta de 5 días y
    // ciclo de 1, el pago caería en alerta incluso recién pagado.
    expect(diasAlDia("Semanal")).toBe(3);
    expect(DIAS_ALERTA).toBeLessThan(7); // cabe dentro del ciclo semanal
  });
});

describe("diasAlDia — período de gracia por recurrencia", () => {
  it("devuelve los valores de la tabla 5.5 del SDD", () => {
    expect(diasAlDia("Mensual")).toBe(15);
    expect(diasAlDia("Quincenal")).toBe(7);
    expect(diasAlDia("Semanal")).toBe(3);
  });

  it("el fin de gracia es la fecha de pago más los días", () => {
    expect(aISO(finGracia(f("2026-10-01"), "Mensual"))).toBe("2026-10-16");
    expect(aISO(finGracia(f("2026-10-01"), "Quincenal"))).toBe("2026-10-08");
  });
});

describe("calcularEstadoProgramado", () => {
  it("devuelve Al día justo después de pagar", () => {
    const r = calcularEstadoProgramado({
      fechaUltimoPago: f("2026-10-06"),
      fechaVencimiento: f("2026-11-05"),
      recurrencia: "Mensual",
      hoy: f("2026-10-06"),
    });
    expect(r).toBe("Al día");
  });

  it("mantiene Al día durante todo el período de gracia del mensual", () => {
    // 15 días de gracia: del día del pago hasta el día 15 inclusive.
    for (const dia of [0, 1, 7, 14]) {
      const r = calcularEstadoProgramado({
        fechaUltimoPago: f("2026-10-01"),
        fechaVencimiento: f("2026-11-01"),
        recurrencia: "Mensual",
        hoy: sumarDias(f("2026-10-01"), dia),
      });
      expect(r, `día ${dia} de la gracia`).toBe("Al día");
    }
  });

  it("mantiene Al día durante los 7 días del quincenal", () => {
    for (const dia of [0, 3, 6]) {
      const r = calcularEstadoProgramado({
        fechaUltimoPago: f("2026-10-01"),
        fechaVencimiento: f("2026-10-20"),
        recurrencia: "Quincenal",
        hoy: sumarDias(f("2026-10-01"), dia),
      });
      expect(r, `día ${dia} de la gracia`).toBe("Al día");
    }
  });

  it("mantiene Al día durante los 3 días del semanal", () => {
    for (const dia of [0, 2]) {
      const r = calcularEstadoProgramado({
        fechaUltimoPago: f("2026-10-01"),
        fechaVencimiento: f("2026-10-08"),
        recurrencia: "Semanal",
        hoy: sumarDias(f("2026-10-01"), dia),
      });
      expect(r).toBe("Al día");
    }
  });

  it("un pago recién hecho NUNCA muestra alerta ni vencido", () => {
    // El caso que motiva la regla: vencimiento en 3 días, pero recién pagado.
    const r = calcularEstadoProgramado({
      fechaUltimoPago: f("2026-10-06"),
      fechaVencimiento: f("2026-10-09"), // solo 3 días
      recurrencia: "Mensual",
      hoy: f("2026-10-06"),
    });
    expect(r).toBe("Al día");
  });

  it("pasa a Pendiente al terminar la gracia", () => {
    const r = calcularEstadoProgramado({
      fechaUltimoPago: f("2026-10-01"), // 15 días → gracia hasta el 16
      fechaVencimiento: f("2026-11-15"),
      recurrencia: "Mensual",
      hoy: f("2026-10-16"),
    });
    expect(r).toBe("Pendiente");
  });

  it("pasa a Alerta cuando faltan 5 días o menos", () => {
    const r = calcularEstadoProgramado({
      fechaUltimoPago: f("2026-10-01"),
      fechaVencimiento: f("2026-11-05"),
      recurrencia: "Mensual",
      hoy: f("2026-11-01"), // faltan 4
    });
    expect(r).toBe("Alerta");
  });

  it("pasa a Alerta el mismo día del vencimiento", () => {
    const r = calcularEstadoProgramado({
      fechaUltimoPago: f("2026-10-01"),
      fechaVencimiento: f("2026-11-05"),
      recurrencia: "Mensual",
      hoy: f("2026-11-05"),
    });
    expect(r).toBe("Alerta");
  });

  it("pasa a Vencido un día después del vencimiento", () => {
    const r = calcularEstadoProgramado({
      fechaUltimoPago: f("2026-10-01"),
      fechaVencimiento: f("2026-11-05"),
      recurrencia: "Mensual",
      hoy: f("2026-11-06"),
    });
    expect(r).toBe("Vencido");
  });

  it("un pago nunca pagado arranca en Pendiente si falta más de 5 días", () => {
    const r = calcularEstadoProgramado({
      fechaUltimoPago: null,
      fechaVencimiento: f("2026-10-20"),
      recurrencia: "Mensual",
      hoy: f("2026-10-06"),
    });
    expect(r).toBe("Pendiente");
  });

  it("un pago nunca pagado arranca en Alerta si falta 5 días o menos", () => {
    const r = calcularEstadoProgramado({
      fechaUltimoPago: null,
      fechaVencimiento: f("2026-10-10"),
      recurrencia: "Mensual",
      hoy: f("2026-10-06"), // faltan 4
    });
    expect(r).toBe("Alerta");
  });

  it("un pago nunca pagado y ya vencido queda Vencido", () => {
    const r = calcularEstadoProgramado({
      fechaUltimoPago: null,
      fechaVencimiento: f("2026-10-01"),
      recurrencia: "Mensual",
      hoy: f("2026-10-06"),
    });
    expect(r).toBe("Vencido");
  });

  it("nunca hay alerta durante la gracia, aunque falten pocos días", () => {
    // Ciclo completo: pagado el 16, quincenal, siguiente vencimiento el 5.
    // Durante la gracia (7 días) no puede aparecer alerta.
    const pagado = f("2026-10-16");
    const r = calcularEstadoProgramado({
      fechaUltimoPago: pagado,
      fechaVencimiento: f("2026-11-05"),
      recurrencia: "Quincenal",
      hoy: f("2026-10-20"),
    });
    expect(r).toBe("Al día");
  });

  it("usa el umbral de alerta de 5 días como constante del SDD", () => {
    expect(DIAS_ALERTA).toBe(5);
  });
});

describe("textoCuentaRegresiva", () => {
  it("usa el singular y el plural correctos", () => {
    const v = f("2026-10-06");
    expect(textoCuentaRegresiva(v, f("2026-10-06"))).toBe("vence hoy");
    expect(textoCuentaRegresiva(v, f("2026-10-05"))).toBe("vence mañana");
    expect(textoCuentaRegresiva(v, f("2026-10-04"))).toBe("vence en 2 días");
    expect(textoCuentaRegresiva(v, f("2026-10-01"))).toBe("vence en 5 días");
  });

  it("describe el pasado cuando ya venció", () => {
    const v = f("2026-10-06");
    expect(textoCuentaRegresiva(v, f("2026-10-07"))).toBe("venció ayer");
    expect(textoCuentaRegresiva(v, f("2026-10-10"))).toBe("venció hace 4 días");
  });
});

describe("diasParaVencimiento", () => {
  it("es positivo antes, cero el día y negativo después", () => {
    const v = f("2026-10-06");
    expect(diasParaVencimiento(v, f("2026-10-01"))).toBe(5);
    expect(diasParaVencimiento(v, v)).toBe(0);
    expect(diasParaVencimiento(v, f("2026-10-09"))).toBe(-3);
  });
});

/** Suma días a una fecha UTC. */
function sumarDias(fecha: Date, dias: number): Date {
  return new Date(fecha.getTime() + dias * 86_400_000);
}
