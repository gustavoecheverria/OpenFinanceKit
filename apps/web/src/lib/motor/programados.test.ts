/**
 * Tests de la capa de lectura de pagos programados.
 *
 * SDD: .kiro/specs/feature-pagos-programados.md — TAREA-007
 *
 * Las funciones que hacen I/O (obtenerPagosProgramados,
 * obtenerVencimientosProximos) necesitan una sesión de Supabase y no se testean
 * acá. Lo que sí se testea es la lógica pura que las sostiene:
 * hornearPagosProgramados y filtrarVencimientosProximos. Si el cálculo del
 * ciclo de renovación o la ventana de alerta se rompen, estos tests fallan.
 */

import { describe, it, expect } from "vitest";
import {
  hornearPagosProgramados,
  filtrarVencimientosProximos,
  type PagoProgramadoCrudo,
  type PagoProgramado,
} from "./index";
import { desdeISO } from "./fechas";

function f(iso: string): Date {
  const d = desdeISO(iso);
  if (!d) throw new Error(`fecha inválida: ${iso}`);
  return d;
}

/** Construye un pago programado con valores por defecto. */
function crudo(over: Partial<PagoProgramadoCrudo> = {}): PagoProgramadoCrudo {
  return {
    id: 1,
    concepto: "Arriendo",
    valor: 500_000,
    recurrencia: "Mensual",
    tipo: "Gasto",
    cuenta_id: 1,
    fecha_inicio: "2026-01-05",
    dia_vencimiento: 5,
    activo: true,
    fecha_ultimo_pago: null,
    cuenta_nombre: "Banco Principal",
    ...over,
  };
}

describe("hornearPagosProgramados", () => {
  it("usa hoy como base cuando nunca se pagó y la fecha_inicio ya pasó", () => {
    const hoy = f("2026-10-20");
    const r = hornearPagosProgramados(
      [crudo({ fecha_inicio: "2026-10-05", dia_vencimiento: 5 })],
      hoy
    );

    // La fecha_inicio (5 de oct) ya pasó respecto de hoy (20 de oct), así que
    // el próximo vencimiento es el 5 de noviembre
    expect(r[0].fechaVencimiento).toBe("2026-11-05");
    expect(r[0].estado).toBe("Pendiente");
  });

  it("usa fecha_ultimo_pago como base cuando ya se pagó", () => {
    const hoy = f("2026-10-06");
    const r = hornearPagosProgramados(
      [
        crudo({
          fecha_inicio: "2020-01-05",
          dia_vencimiento: 5,
          fecha_ultimo_pago: "2026-10-05",
        }),
      ],
      hoy
    );

    // Pagado el 5, mensual, día 5 → próximo vencimiento el 5 de noviembre
    expect(r[0].fechaVencimiento).toBe("2026-11-05");
  });

  it("un pago recién hecho queda en estado Al día", () => {
    const hoy = f("2026-10-06");
    const r = hornearPagosProgramados(
      [
        crudo({
          dia_vencimiento: 10,
          fecha_ultimo_pago: "2026-10-06",
        }),
      ],
      hoy
    );

    // Pagado el 6 con vencimiento día 10: el siguiente vencimiento es el 10 de
    // noviembre, a 35 días. Durante los 15 días de gracia no hay alerta.
    expect(r[0].estado).toBe("Al día");
    expect(r[0].fechaVencimiento).toBe("2026-11-10");
  });

  it("calcula diasRestantes negativo cuando ya venció", () => {
    const hoy = f("2026-11-10");
    const r = hornearPagosProgramados(
      [
        crudo({
          dia_vencimiento: 5,
          fecha_ultimo_pago: "2026-10-05",
        }),
      ],
      hoy
    );

    // El vencimiento era el 5 de noviembre y hoy es el 10
    expect(r[0].estado).toBe("Vencido");
    expect(r[0].diasRestantes).toBe(-5);
    expect(r[0].textoVencimiento).toBe("venció hace 5 días");
  });

  it("respeta el día de vencimiento para pagos quincenales", () => {
    const hoy = f("2026-10-01");
    const r = hornearPagosProgramados(
      [
        crudo({
          recurrencia: "Quincenal",
          dia_vencimiento: 5,
          fecha_inicio: "2026-10-01",
        }),
      ],
      hoy
    );

    expect(r[0].fechaVencimiento).toBe("2026-10-05");
  });

  it("renueva el ciclo indefinidamente sin intervención manual", () => {
    // Cada mes se paga el día 5 y el vencimiento siempre queda en el día 5.
    const pagos: PagoProgramadoCrudo = crudo({
      recurrencia: "Mensual",
      dia_vencimiento: 5,
      fecha_inicio: "2026-01-05",
    });

    const vencimientos: string[] = [];
    for (let mes = 1; mes <= 12; mes++) {
      const hoy = f(`2026-${String(mes).padStart(2, "0")}-06`);
      const r = hornearPagosProgramados([pagos], hoy)[0];
      vencimientos.push(r.fechaVencimiento);
      // El pago se marca como pagado el día del vencimiento
      pagos.fecha_ultimo_pago = r.fechaVencimiento;
    }

    // Todos los vencimientos caen en el día 5 del mes siguiente
    for (const v of vencimientos) {
      expect(v.slice(-2)).toBe("05");
    }
  });

  it("nunca pagado con inicio atrasado muestra el próximo vencimiento, no el más viejo", () => {
    // Caso que motivó el fix: un arriendo creado en enero y nunca pagado
    // debe mostrar su PRÓXIMO vencimiento. Antes mostraba "vencido hace
    // 238 días", porque el cálculo arrancaba en la fecha_inicio en vez de hoy.
    const hoy = f("2026-10-01");
    const r = hornearPagosProgramados(
      [
        crudo({
          fecha_inicio: "2026-01-05",
          dia_vencimiento: 5,
          fecha_ultimo_pago: null,
        }),
      ],
      hoy
    );

    // El 5 de octubre ya pasó (hoy es el 1, no... el 5 es futuro)
    expect(r[0].fechaVencimiento).toBe("2026-10-05");
    expect(r[0].estado).not.toBe("Vencido");
    expect(r[0].diasRestantes).toBe(4);
  });

  it("nunca pagado con fecha_inicio futura arranca en el mes de inicio", () => {
    const hoy = f("2026-10-01");
    const r = hornearPagosProgramados(
      [crudo({ fecha_inicio: "2026-12-10", dia_vencimiento: 15 })],
      hoy
    );

    // El pago empieza el 10 de diciembre y vence día 15: el primer vencimiento
    // es el 15 de diciembre, no el 15 de octubre ni el 10 de diciembre.
    expect(r[0].fechaVencimiento).toBe("2026-12-15");
  });

  it("un pago que vence HOY queda en alerta, no se corre al mes siguiente", () => {
    // Bug encontrado por los E2E: calcularProximaVencimiento usaba ">" y un
    // pago creado hoy para vencer hoy se iba al mes siguiente (31 días).
    // Con "vence en 31 días" el pago nunca entraba en la ventana de alerta y no
    // aparecía en el dashboard.
    const hoy = new Date("2026-10-07T09:37:47Z");
    const r = hornearPagosProgramados(
      [crudo({ fecha_inicio: "2026-10-07", dia_vencimiento: 7 })],
      hoy
    );

    expect(r[0].fechaVencimiento).toBe("2026-10-07");
    expect(r[0].estado).toBe("Alerta");
    expect(r[0].diasRestantes).toBe(0);
    expect(r[0].textoVencimiento).toBe("vence hoy");
  });

  it("el cálculo no depende de la hora del servidor", () => {
    // El mismo día a distintas horas debe dar el mismo resultado: el cálculo
    // es por día calendario, no por instante.
    const crudoPago = crudo({
      fecha_inicio: "2026-10-07",
      dia_vencimiento: 7,
    });

    const manana = hornearPagosProgramados(
      [crudoPago],
      new Date("2026-10-07T00:00:01Z")
    )[0];
    const noche = hornearPagosProgramados(
      [crudoPago],
      new Date("2026-10-07T23:59:59Z")
    )[0];

    expect(noche.fechaVencimiento).toBe(manana.fechaVencimiento);
    expect(noche.estado).toBe(manana.estado);
    expect(noche.diasRestantes).toBe(manana.diasRestantes);
  });

  it("un pago pagado hoy con vencimiento hoy queda Al día, no Vencido", () => {
    const r = hornearPagosProgramados(
      [
        crudo({
          fecha_inicio: "2026-10-07",
          dia_vencimiento: 7,
          fecha_ultimo_pago: "2026-10-07",
        }),
      ],
      new Date("2026-10-07T22:00:00Z")
    );

    expect(r[0].estado).toBe("Al día");
  });

  it("devuelve array vacío cuando no hay pagos", () => {
    expect(hornearPagosProgramados([], new Date())).toEqual([]);
  });

  it("conserva los campos originales del pago", () => {
    const r = hornearPagosProgramados(
      [crudo({ concepto: "Salario", valor: 1_200_000, tipo: "Ingreso" })],
      f("2026-10-01")
    );

    expect(r[0].concepto).toBe("Salario");
    expect(r[0].valor).toBe(1_200_000);
    expect(r[0].tipo).toBe("Ingreso");
    expect(r[0].cuenta_nombre).toBe("Banco Principal");
  });
});

describe("filtrarVencimientosProximos", () => {
  it("incluye lo que vence dentro de la ventana", () => {
    const hoy = f("2026-10-01");
    const pagos = hornearPagosProgramados(
      [
        crudo({ id: 1, dia_vencimiento: 4 }), // faltan 3 días
        crudo({ id: 2, dia_vencimiento: 5 }), // faltan 5 días (borde)
      ],
      hoy
    );

    const r = filtrarVencimientosProximos(pagos, 5);
    expect(r.map((p) => p.id)).toEqual([1, 2]);
  });

  it("excluye lo que está en período de gracia aunque su vencimiento esté cerca", () => {
    // Recién pagado: el vencimiento puede caer dentro de la ventana de alerta,
    // pero no debe entrar. El filtro opera sobre el ESTADO, no solo sobre los
    // días: un pago "Al día" nunca genera aviso.
    const hoy = f("2026-10-06");
    const pagos = hornearPagosProgramados(
      [
        crudo({
          id: 1,
          recurrencia: "Semanal",
          dia_vencimiento: 13,
          fecha_ultimo_pago: "2026-10-06", // gracia de 3 días
        }),
      ],
      hoy
    );

    expect(pagos[0].estado).toBe("Al día");
    expect(filtrarVencimientosProximos(pagos, 5)).toHaveLength(0);
  });

  it("un pago mensual en gracia sigue excluido cuando su vencimiento entra en la ventana", () => {
    // Quincenal: gracia de 7 días y el siguiente vencimiento cae 15 días
    // después. No hay caso donde la gracia y la ventana se solapen en Quincenal,
    // pero el filtro no debe depender de esa suposición: mira el estado.
    const hoy = f("2026-10-06");
    const pagos = hornearPagosProgramados(
      [
        crudo({
          id: 1,
          recurrencia: "Quincenal",
          dia_vencimiento: 20,
          fecha_ultimo_pago: "2026-10-06",
        }),
      ],
      hoy
    );

    expect(pagos[0].estado).toBe("Al día");
    expect(filtrarVencimientosProximos(pagos, 5)).toHaveLength(0);

    // Y el mismo pago, una vez terminada la gracia, sí entra:
    const masAdelante = hornearPagosProgramados(
      [
        crudo({
          id: 1,
          recurrencia: "Quincenal",
          dia_vencimiento: 20,
          fecha_ultimo_pago: "2026-10-06",
        }),
      ],
      f("2026-10-14") // 8 días después: la gracia de 7 días ya terminó
    );
    expect(masAdelante[0].estado).not.toBe("Al día");
  });

  it("excluye lo que ya venció", () => {
    const hoy = f("2026-11-10");
    const pagos = hornearPagosProgramados(
      [crudo({ dia_vencimiento: 5, fecha_ultimo_pago: "2026-10-05" })],
      hoy
    );

    expect(pagos[0].estado).toBe("Vencido");
    expect(filtrarVencimientosProximos(pagos, 5)).toHaveLength(0);
  });

  it("ordena por días restantes: lo más urgente primero", () => {
    const hoy = f("2026-10-01");
    const pagos = hornearPagosProgramados(
      [
        crudo({ id: 1, dia_vencimiento: 5 }), // 4 días
        crudo({ id: 2, dia_vencimiento: 2 }), // 1 día
        crudo({ id: 3, dia_vencimiento: 3 }), // 2 días
      ],
      hoy
    );

    const r = filtrarVencimientosProximos(pagos, 5);
    expect(r.map((p) => p.id)).toEqual([2, 3, 1]);
  });

  it("respeta una ventana mayor que la de por defecto", () => {
    const hoy = f("2026-10-01");
    const pagos = hornearPagosProgramados(
      [crudo({ dia_vencimiento: 20 })], // 19 días
      hoy
    );

    expect(filtrarVencimientosProximos(pagos, 5)).toHaveLength(0);
    expect(filtrarVencimientosProximos(pagos, 30)).toHaveLength(1);
  });
});
