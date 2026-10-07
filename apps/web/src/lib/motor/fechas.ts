/**
 * Motor — Lógica de fechas de pagos programados.
 *
 * RN-002: toda la lógica de negocio de fechas vive en el Motor. Este módulo no
 * hace I/O: son funciones puras, deterministas y testeables sin base de datos.
 *
 * SDD: .kiro/specs/feature-pagos-programados.md (sección 5.3 y 5.5)
 *
 * Todas las fechas se trabajan en UTC. El proyecto ya usa UTC en las funciones
 * de mes de calculations.ts, y mezclar zonas en el cálculo de vencimientos
 * produciría pagos que se mueven de día según la hora local del servidor.
 */

// ── Tipos ─────────────────────────────────────────────────────────────────

/**
 * Recurrencias disponibles.
 *
 * NO incluye "Diario" a propósito. Con un ciclo de 1 día, la ventana de alerta
 * de 5 días no puede caber dentro del ciclo: el pago caería en alerta de forma
 * permanente, incluso recién pagado. Rompería la regla de que un pago recién
 * realizado nunca genera alerta.
 *
 * Si más adelante hace falta, se agrega junto con la alerta desactivada para
 * ciclos cortos, no con un período de gracia artificial.
 */
export type Recurrencia = "Mensual" | "Quincenal" | "Semanal";

/**
 * Estado de un pago programado. Se CALCULA en cada render, nunca se persiste.
 * Ver sección 5.5 del SDD.
 */
export type EstadoProgramado = "Al día" | "Pendiente" | "Alerta" | "Vencido";

/** Días de anticipación con que se marca la alerta antes del vencimiento. */
export const DIAS_ALERTA = 5;

/**
 * Período de gracia por recurrencia: días que el pago queda "Al día" después de
 * pagarlo. Ver tabla en la sección 5.5 del SDD.
 *
 * Razón de los valores: durante este período el usuario no debe recibir avisos
 * sobre un cobro que acaba de hacer. Para mensual, 15 días de un ciclo de ~30
 * lleva la alerta a la mitad del camino en lugar de a los 3 días. Quincenal usa
 * la mitad del ciclo (7 de 15). Semanal usa ~40% de su ciclo de 7 días.
 */
export const DIAS_AL_DIA: Record<Recurrencia, number> = {
  Mensual: 15,
  Quincenal: 7,
  Semanal: 3,
};

/**
 * Días que dura un ciclo para cada recurrencia. Se usa para saber si el
 * período de gracia cabe dentro del ciclo antes de empezar la ventana de
 * alerta.
 */
const DIAS_POR_CICLO: Record<Recurrencia, number> = {
  Mensual: 30,
  Quincenal: 15,
  Semanal: 7,
};

// ── Helpers ───────────────────────────────────────────────────────────────

/** Primer día del mes. Mes es 1-12. */
function primerDia(anio: number, mes: number): Date {
  return new Date(Date.UTC(anio, mes - 1, 1));
}

/**
 * Días que tiene un mes. Importa para el día 31: febrero tiene 28 o 29.
 * El argumento mes es 1-12.
 */
export function diasEnMes(anio: number, mes: number): number {
  // El día 0 del mes siguiente es el último día del mes actual.
  return new Date(Date.UTC(anio, mes, 0)).getUTCDate();
}

/** Devuelve el día limitado al último día del mes. Ej: 31 en febrero → 28/29. */
function diaAjustado(anio: number, mes: number, dia: number): number {
  return Math.min(dia, diasEnMes(anio, mes));
}

/** Convierte a fecha "YYYY-MM-DD" en UTC, para comparar sin zona horaria. */
export function aISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Parsea "YYYY-MM-DD" a Date en UTC. Devuelve null si no es válida. */
export function desdeISO(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const [, a, mes, d] = m;
  const fecha = new Date(Date.UTC(Number(a), Number(mes) - 1, Number(d)));
  // Rechaza fechas que "corren" al mes siguiente (ej: 2026-02-31).
  if (
    fecha.getUTCFullYear() !== Number(a) ||
    fecha.getUTCMonth() !== Number(mes) - 1 ||
    fecha.getUTCDate() !== Number(d)
  ) {
    return null;
  }
  return fecha;
}

/**
 * Días calendario entre dos fechas. Positivo si b es posterior a a.
 *
 * Normaliza -0 a 0: sin eso, el mismo día devuelve -0, que con === no es igual
 * a 0 y rompe las aserciones de los tests y de la UI.
 */
export function diasEntre(a: Date, b: Date): number {
  const msPorDia = 86_400_000;
  const dias = Math.round((b.getTime() - a.getTime()) / msPorDia);
  return dias === 0 ? 0 : dias;
}

// ── Próximo vencimiento ───────────────────────────────────────────────────

/**
 * Calcula el próximo vencimiento de un pago programado.
 *
 * REGLA CENTRAL: si la fecha ya pasó, avanza hasta que sea futura. Eso es lo
 * que hace que el ciclo se renueve solo sin que el usuario tenga que hacer nada.
 *
 * Mensual y Quincenal se calculan por fecha de mes, NO por días corridos. Razón:
 * un arriendo siempre vence en una fecha fija; con 15 días corridos el
 * vencimiento se movería del 31 al 15 de otro mes y seguiría desplazándose.
 * Para el día 31 en meses cortos se usa el último día del mes.
 *
 * @param desde fecha desde la que se calcula (típicamente, hoy)
 * @param recurrencia cada cuánto se repite
 * @param diaVencimiento día del mes en que vence (1-31)
 */
export function calcularProximaVencimiento(
  desde: Date,
  recurrencia: Recurrencia,
  diaVencimiento: number
): Date {
  switch (recurrencia) {
    case "Mensual": {
      // Se prueban el mes de "desde" y los siguientes, y se devuelve el primero
      // que sea futuro. Probar solo un mes saltaría un vencimiento de este mes
      // que todavía no ocurrió (caso de un pago recién creado).
      //
      // El ciclo puede avanzar varios meses: si el pago lleva meses sin pagarse,
      // el vencimiento tiene que llegar al mes actual, no quedarse atrás.
      //
      // Se usa Date.UTC con mes 0-based porque JavaScript normaliza solo el
      // desborde de mes: mes 12 = enero del año siguiente.
      const enMes = (offsetMeses: number) =>
        new Date(
          Date.UTC(
            desde.getUTCFullYear(),
            desde.getUTCMonth() + offsetMeses,
            diaAjustado(
              desde.getUTCFullYear(),
              desde.getUTCMonth() + offsetMeses + 1,
              diaVencimiento
            )
          )
        );

      for (let offset = 1; offset <= 24; offset++) {
        const fecha = enMes(offset);
        // Estrictamente futuro: si `desde` cae hoy en el día de vencimiento,
        // el próximo es el del mes que viene. Volver al mismo día lo dejaría
        // venciendo inmediatamente, que es el caso de un pago recién hecho:
        // al pagar el arriendo del día 5, el siguiente es el 5 del mes
        // siguiente, no el 5 de hoy otra vez.
        if (fecha.getTime() > desde.getTime()) return fecha;
      }
      // Fallback: un mes por delante.
      return enMes(1);
    }

    case "Quincenal": {
      // Dos vencimientos por mes: el día configurado y ese día + 15.
      // Se parte del mes actual y se prueban las dos candidatas.
      const candidatas = candidatasQuincenales(
        desde.getUTCFullYear(),
        desde.getUTCMonth() + 1,
        diaVencimiento
      );
      const futura = candidatas.find((f) => f.getTime() > desde.getTime());
      if (futura) return futura;
      // Ninguna del mes actual sirve: pasar al siguiente y tomar la primera.
      const sig = candidatasQuincenales(
        desde.getUTCFullYear(),
        desde.getUTCMonth() + 2,
        diaVencimiento
      );
      return sig[0];
    }

    case "Semanal":
      return avanzarSiPasó(
        sumarDias(desde, 7),
        desde,
        recurrencia,
        diaVencimiento
      );
  }
}

/** Fecha de vencimiento de un mes concreto para la recurrencia Mensual. */
function vencimientoDelMes(anio: number, mes: number, dia: number): Date {
  return new Date(Date.UTC(anio, mes - 1, diaAjustado(anio, mes, dia)));
}

/** Las dos fechas de vencimiento de un mes para la recurrencia Quincenal. */
function candidatasQuincenales(
  anio: number,
  mes: number,
  diaVencimiento: number
): Date[] {
  const primero = diaAjustado(anio, mes, diaVencimiento);
  const segundo = diaAjustado(anio, mes, diaVencimiento + 15);
  return [
    new Date(Date.UTC(anio, mes - 1, primero)),
    new Date(Date.UTC(anio, mes - 1, segundo)),
  ];
}

/** Si la fecha no es futura, recalcula desde esa fecha hasta que lo sea. */
function avanzarSiPasó(
  fecha: Date,
  desde: Date,
  recurrencia: Recurrencia,
  diaVencimiento: number
): Date {
  if (fecha.getTime() > desde.getTime()) return fecha;
  // Para Mensual basta con avanzar un mes y volver a ajustar el día.
  if (recurrencia === "Mensual") {
    const siguiente = primerDia(
      fecha.getUTCFullYear(),
      fecha.getUTCMonth() + 2
    );
    return new Date(
      Date.UTC(
        siguiente.getUTCFullYear(),
        siguiente.getUTCMonth(),
        diaAjustado(
          siguiente.getUTCFullYear(),
          siguiente.getUTCMonth() + 1,
          diaVencimiento
        )
      )
    );
  }
  return sumarDias(fecha, DIAS_POR_CICLO[recurrencia]);
}

/** Suma días calendario preservando la hora. */
function sumarDias(fecha: Date, dias: number): Date {
  return new Date(fecha.getTime() + dias * 86_400_000);
}

// ── Período de gracia ─────────────────────────────────────────────────────

/**
 * Días que el pago queda "Al día" después de pagarlo.
 * Ver la tabla de la sección 5.5 del SDD.
 */
export function diasAlDia(recurrencia: Recurrencia): number {
  return DIAS_AL_DIA[recurrencia];
}

/**
 * Fin del período de gracia a partir del último pago.
 * @returns la fecha en que el pago deja de estar "Al día"
 */
export function finGracia(
  fechaUltimoPago: Date,
  recurrencia: Recurrencia
): Date {
  return sumarDias(fechaUltimoPago, DIAS_AL_DIA[recurrencia]);
}

// ── Estado ────────────────────────────────────────────────────────────────

/**
 * Determina el estado de un pago programado.
 *
 * El período de gracia se mide DESDE LA FECHA DEL ÚLTIMO PAGO, no desde el
 * vencimiento. Es lo que evita que un pago recién realizado muestre alerta.
 *
 * @param fechaUltimoPago cuándo se pagó. null = nunca se pagó
 * @param fechaVencimiento próximo vencimiento
 * @param recurrencia cada cuánto se repite
 * @param hoy fecha de referencia
 */
export function calcularEstadoProgramado(args: {
  fechaUltimoPago: Date | null;
  fechaVencimiento: Date;
  recurrencia: Recurrencia;
  hoy: Date;
}): EstadoProgramado {
  const { fechaUltimoPago, fechaVencimiento, recurrencia } = args;

  // Se compara a nivel de DÍA. Si `hoy` trae hora, un vencimiento de hoy a
  // medianoche parecería "pasado" y el pago caería en Vencido en vez de Alerta.
  const hoyDia = medianocheUTC(args.hoy);

  // Pasó la fecha y no se marcó pagado.
  if (fechaVencimiento.getTime() < hoyDia.getTime()) return "Vencido";

  const diasRestantes = diasEntre(hoyDia, fechaVencimiento);

  // Nunca pagado: no hay gracia porque no se pagó nada. Entra directo en la
  // cuenta regresiva.
  if (fechaUltimoPago === null) {
    return diasRestantes <= DIAS_ALERTA ? "Alerta" : "Pendiente";
  }

  // Recién pagado: el pago está Al día hasta que termine el período de gracia.
  // Se evalúa antes que la alerta, así que un pago recién hecho NUNCA
  // muestra alerta ni aparece como vencido, aunque el vencimiento esté cerca.
  if (hoyDia.getTime() < finGracia(fechaUltimoPago, recurrencia).getTime()) {
    return "Al día";
  }

  return diasRestantes <= DIAS_ALERTA ? "Alerta" : "Pendiente";
}

/** Trunca un Date a la medianoche UTC del mismo día. Ver el uso arriba. */
function medianocheUTC(fecha: Date): Date {
  return new Date(
    Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate())
  );
}

/**
 * Texto del countdown: "vence hoy", "vence en N días", "venció hace N días".
 * Función pura. Devuelve string porque el formato es parte de la regla de
 * negocio de la UI.
 */
export function textoCuentaRegresiva(
  fechaVencimiento: Date,
  hoy: Date
): string {
  const dias = diasEntre(hoy, fechaVencimiento);
  if (dias === 0) return "vence hoy";
  if (dias === 1) return "vence mañana";
  if (dias > 1) return `vence en ${dias} días`;
  if (dias === -1) return "venció ayer";
  return `venció hace ${Math.abs(dias)} días`;
}

/**
 * Días que faltan para el vencimiento. Negativo si ya venció.
 */
export function diasParaVencimiento(
  fechaVencimiento: Date,
  hoy: Date
): number {
  return diasEntre(hoy, fechaVencimiento);
}
