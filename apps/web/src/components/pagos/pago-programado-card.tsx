"use client";

// Importa del módulo PURO, no de "@/lib/motor": este es un Client Component y
// "@/lib/motor" arrastra supabase/server (next/headers) al bundle.
import type { PagoProgramado } from "@/lib/motor/programados";

/**
 * Tarjeta de un pago programado con su countdown y acción de pago.
 *
 * El estado NO se persiste: viene calculado desde el Motor
 * (`obtenerPagosProgramados`). Ver sección 5.5 del SDD.
 *
 * Accesibilidad: el estado se comunica con texto, no solo con color. Un usuario
 * daltónico no puede distinguir rojo de verde, y "Vencido" vs "Al día" es
 * información crítica.
 */

const ESTILOS_ESTADO: Record<
  string,
  { badge: string; borde: string; icono: string }
> = {
  "Al día": {
    badge: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    borde: "border-[var(--success)]",
    icono: "✓",
  },
  Pendiente: {
    badge: "bg-[var(--muted)] text-[var(--muted-foreground)]",
    borde: "border-[var(--border)]",
    icono: "○",
  },
  Alerta: {
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    borde: "border-[var(--warning)]",
    icono: "!",
  },
  Vencido: {
    badge: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    borde: "border-[var(--destructive)]",
    icono: "!",
  },
};

const ETIQUETA_RECURRENCIA: Record<string, string> = {
  Mensual: "Mensual",
  Quincenal: "Quincenal",
  Semanal: "Semanal",
};

export function PagoProgramadoCard({
  pago,
  onPagar,
  onDesactivar,
}: {
  pago: PagoProgramado;
  /** Abre el modal de confirmación. Opcional si la tarjeta es solo lectura. */
  onPagar?: (pago: PagoProgramado) => void;
  onDesactivar?: (pago: PagoProgramado) => void;
}) {
  const estilo = ESTILOS_ESTADO[pago.estado] ?? ESTILOS_ESTADO.Pendiente;
  // Al día y Pendiente no son urgentes: el botón secundario se atenúa.
  const urgente = pago.estado === "Alerta" || pago.estado === "Vencido";

  return (
    <li
      className={`p-3 bg-[var(--muted)] rounded-lg border-l-4 ${estilo.borde}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          {/* Concepto y valor */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium truncate">{pago.concepto}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded ${estilo.badge}`}
              // El texto del estado es la información real; el color es apoyo visual.
              aria-label={`Estado: ${pago.estado}`}
            >
              {estilo.icono} {pago.estado}
            </span>
          </div>

          {/* Monto */}
          <p className="text-lg font-bold mt-1">
            ${pago.valor.toLocaleString("es", { minimumFractionDigits: 2 })}
          </p>

          {/* Metadatos */}
          <div className="flex items-center gap-2 flex-wrap mt-1 text-xs text-[var(--muted-foreground)]">
            <span>{pago.cuenta_nombre}</span>
            <span aria-hidden="true">·</span>
            <span>día {pago.dia_vencimiento}</span>
            <span aria-hidden="true">·</span>
            <span>
              {ETIQUETA_RECURRENCIA[pago.recurrencia] ?? pago.recurrencia}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              va a {pago.tipo === "Gasto" ? "gastos" : "ingresos"}
            </span>
          </div>

          {/* Countdown */}
          <p
            className={`text-xs mt-1.5 font-medium ${
              urgente ? "text-[var(--destructive)]" : ""
            }`}
          >
            {pago.textoVencimiento}
            <span className="font-normal text-[var(--muted-foreground)]">
              {" "}
              (vto. {pago.fechaVencimiento})
            </span>
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-1.5 shrink-0">
          {onPagar && (
            <button
              onClick={() => onPagar(pago)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${
                urgente
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
                  : "bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] hover:opacity-80"
              }`}
            >
              Marcar pagado
            </button>
          )}
          {onDesactivar && (
            <button
              onClick={() => onDesactivar(pago)}
              aria-label={`Desactivar pago programado ${pago.concepto}`}
              className="px-2 py-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--destructive)] rounded"
            >
              Desactivar
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
