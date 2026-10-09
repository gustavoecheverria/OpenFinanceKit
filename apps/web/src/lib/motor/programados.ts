/**
 * Motor — Datos y lógica de pagos programados.
 *
 * RN-002: la lógica de negocio vive en el Motor. Este módulo es PURO: no hace
 * I/O, no importa Supabase, no importa next/headers.
 *
 * POR QUÉ ESTE ARCHIVO ESTÁ SEPARADO DE ./index.ts:
 *
 * `index.ts` importa `@/lib/supabase/server`, que usa `next/headers`. Eso es
 * válido solo en Server Components. Si un Client Component importa tipos o
 * funciones de `index.ts`, Next.js arrastra toda esa cadena al bundle del
 * cliente y falla con:
 *
 *   "You're importing a component that needs next/headers. That only works
 *    in a Server Component which is not supported in the pages/ directory."
 *
 * Los componentes cliente (pago-programado-card, pagos-programados-list,
 * pago-programado-form) necesitan los tipos y la lógica de recurrencia. Por eso
 * viven acá, sin dependencias de servidor, y `index.ts` los re-exporta.
 *
 * SDD: .kiro/specs/feature-pagos-programados.md — secciones 5.3 y 5.5
 */

import {
  calcularProximaVencimiento,
  calcularEstadoProgramado,
  diasParaVencimiento,
  textoCuentaRegresiva,
  desdeISO,
  aISO,
  DIAS_ALERTA,
  type Recurrencia,
  type EstadoProgramado,
} from "./fechas";

/**
 * Trunca un Date a la medianoche UTC del mismo día.
 *
 * El cálculo de vencimientos es por día, no por instante. Si se pasa un `hoy`
 * con hora, compararlo contra una fecha a medianoche da un resultado que
 * depende de la hora del servidor: un pago que vence HOY sería saltado.
 */
function medianocheUTC(fecha: Date): Date {
  return new Date(
    Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate())
  );
}

/** Días que tiene un mes. mes es 1-12. */
function diasDelMes(anio: number, mes: number): number {
  return new Date(Date.UTC(anio, mes, 0)).getUTCDate();
}

/**
 * Primer vencimiento de un pago que NUNCA se pagó, contando desde `referencia`.
 *
 * A diferencia de `calcularProximaVencimiento`, que calcula el siguiente a un
 * pago ya realizado, este devuelve el día de vencimiento del mes de referencia
 * si todavía no pasó. Razón: un pago que creás hoy con vencimiento hoy tiene que
 * aparecer venciendo hoy, no dentro de un mes.
 *
 * Para el día 31 en meses cortos usa el último día del mes.
 */
function primerVencimientoDesde(
  referencia: Date,
  recurrencia: Recurrencia,
  diaVencimiento: number
): Date {
  const anio = referencia.getUTCFullYear();
  const mes = referencia.getUTCMonth() + 1;

  if (recurrencia === "Semanal") {
    return new Date(referencia.getTime() + 7 * 86_400_000);
  }

  // Mensual y Quincenal: el día configurado del mes en curso, o el siguiente
  // si ya pasó. En Quincenal hay dos candidatos por mes.
  const diasDelMesActual = diasDelMes(anio, mes);
  const candidatos =
    recurrencia === "Quincenal"
      ? [diaVencimiento, diaVencimiento + 15]
      : [diaVencimiento];

  for (const dia of candidatos) {
    const ajustado = Math.min(dia, diasDelMesActual);
    const fecha = new Date(Date.UTC(anio, mes - 1, ajustado));
    if (fecha.getTime() >= referencia.getTime()) return fecha;
  }

  // No quedó ninguno este mes: al día equivalente del mes siguiente.
  const mesSiguiente = mes === 12 ? 1 : mes + 1;
  const anioSiguiente = mes === 12 ? anio + 1 : anio;
  const diasSiguiente = diasDelMes(anioSiguiente, mesSiguiente);
  return new Date(
    Date.UTC(
      anioSiguiente,
      mesSiguiente - 1,
      Math.min(diaVencimiento, diasSiguiente)
    )
  );
}

export type { Recurrencia, EstadoProgramado } from "./fechas";

/**
 * Datos crudos de un pago programado tal como están en la base.
 * El estado y el vencimiento se calculan aparte (ver hornearPagosProgramados).
 */
export interface PagoProgramadoCrudo {
  id: number;
  concepto: string;
  valor: number;
  recurrencia: Recurrencia;
  tipo: "Gasto" | "Ingreso";
  cuenta_id: number;
  /** Categoría donde se registra al marcar pagado. Elegida por el usuario. */
  categoria_id: number;
  /** Nombre de la categoría, para mostrarlo sin una query extra. */
  categoria_nombre: string;
  fecha_inicio: string;
  dia_vencimiento: number;
  activo: boolean;
  fecha_ultimo_pago: string | null;
  cuenta_nombre: string;
}

/** Pago programado con el estado ya calculado. Es lo que consume la UI. */
export interface PagoProgramado extends PagoProgramadoCrudo {
  fechaVencimiento: string;
  estado: EstadoProgramado;
  diasRestantes: number;
  textoVencimiento: string;
}

/**
 * Calcula vencimiento y estado de cada pago programado.
 *
 * BASE DEL CÁLCULO DEL VENCIMIENTO:
 *
 * - Si ya se pagó: la base es la última fecha pagada. El ciclo se renueva a
 *   partir de ahí, que es lo que hace que el pago avance solo.
 *
 * - Si nunca se pagó, hay dos casos distintos:
 *
 *   a) fecha_inicio ya pasó: la base es HOY. El pago debe mostrar su PRÓXIMO
 *      vencimiento, no el más lejano atraso del histórico. Sin esto, un arriendo
 *      de enero nunca pagado aparecería como "vencido hace 238 días" en vez de
 *      "vence el 5 de noviembre".
 *
 *   b) fecha_inicio todavía no llegó: la base es la propia fecha_inicio. Un pago
 *      que empieza en diciembre no debe aparecer con vencimiento en octubre:
 *      todavía no existe.
 *
 * Función pura, sin I/O, para poder testearla sin base de datos.
 */
export function hornearPagosProgramados(
  crudos: PagoProgramadoCrudo[],
  hoy: Date
): PagoProgramado[] {
  // Se trabaja a nivel de DÍA, no de instante. Un Date de "hoy" con hora
  // 09:37 es posterior a la medianoche UTC de hoy, así que comparar con ">"
  // saltaría un vencimiento que cae HOY. Todo el cálculo es de fechas, no de
  // horas, y el countdown cuenta días calendario.
  const hoyDia = medianocheUTC(hoy);

  return crudos.map((p) => {
    const ultimaPagada = p.fecha_ultimo_pago ? desdeISO(p.fecha_ultimo_pago) : null;
    const inicio = desdeISO(p.fecha_inicio);

    // BASE DEL VENCIMIENTO:
    //
    // - Si ya se pagó: la base es la última fecha pagada y el vencimiento es
    //   el SIGUIENTE a esa fecha. Así renovar el ciclo nunca devuelve el mismo
    //   día: al pagar el arriendo del 5, el siguiente es el 5 del mes que viene.
    //
    // - Si nunca se pagó: el primer vencimiento puede ser HOY. Por eso no se
    //   usa calcularProximaVencimiento (que es estrictamente futuro, porque su
    //   trabajo es renovar un pago ya hecho) sino el día de vencimiento del mes
    //   en curso, quedándose si no pasó y avanzando un mes si ya pasó.
    let vencimiento: Date;

    if (ultimaPagada) {
      vencimiento = calcularProximaVencimiento(
        ultimaPagada,
        p.recurrencia,
        p.dia_vencimiento
      );
    } else {
      // Un pago que todavía no arranca (fecha_inicio futura) tiene su primer
      // vencimiento en el día configurado DENTRO de ese mes, no en la fecha de
      // inicio. Ej: inicio 10-dic con vencimiento día 15 → vence el 15-dic.
      if (inicio && inicio.getTime() > hoyDia.getTime()) {
        vencimiento = primerVencimientoDesde(
          inicio,
          p.recurrencia,
          p.dia_vencimiento
        );
      } else {
        vencimiento = primerVencimientoDesde(
          hoyDia,
          p.recurrencia,
          p.dia_vencimiento
        );
      }
    }

    const estado = calcularEstadoProgramado({
      fechaUltimoPago: ultimaPagada,
      fechaVencimiento: vencimiento,
      recurrencia: p.recurrencia,
      hoy: hoyDia,
    });

    // Importante: se pasa hoyDia (medianoche UTC), no el `hoy` con hora. Con
    // hora, un vencimiento de hoy a medianoche da -1 días y el countdown
    // muestra "venció ayer" cuando en realidad vence hoy.
    const diasRestantes = diasParaVencimiento(vencimiento, hoyDia);

    return {
      ...p,
      fechaVencimiento: aISO(vencimiento),
      estado,
      diasRestantes,
      textoVencimiento: textoCuentaRegresiva(vencimiento, hoyDia),
    };
  });
}

/**
 * Filtra los que entran en la ventana de alerta.
 *
 * Excluye los que están en período de gracia ("Al día") y los ya vencidos:
 * avisarle al usuario sobre algo que acaba de pagar, o que ya pasó, es ruido.
 */
export function filtrarVencimientosProximos(
  pagos: PagoProgramado[],
  dias: number = DIAS_ALERTA
): PagoProgramado[] {
  return pagos
    .filter((p) => {
      if (p.estado === "Al día") return false;
      if (p.diasRestantes < 0) return false;
      return p.diasRestantes <= dias;
    })
    .sort((a, b) => a.diasRestantes - b.diasRestantes);
}
