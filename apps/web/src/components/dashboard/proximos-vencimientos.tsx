import Link from "next/link";
// Módulo PURO: este componente lo renderiza el Dashboard (Server Component),
// pero el tipo debe venir de un módulo sin next/headers.
import type { PagoProgramado } from "@/lib/motor/programados";

/**
 * Indicador de pagos programados que entran en la ventana de alerta.
 *
 * Solo muestra los que están en "Alerta" o "Vencido", nunca los "Al día": si
 * el usuario acaba de pagar algo, avisarle otra vez es ruido.
 *
 * Es la base de las notificaciones push futuras (fuera de alcance de este
 * feature). Cuando se implementen, la consulta ya está hecha:
 * `obtenerVencimientosProximos()`.
 *
 * RN-003: el Dashboard solo visualiza, nunca calcula. Todos los valores
 * vienen calculados del Motor.
 */
export function ProximosVencimientos({
  pagos,
}: {
  pagos: PagoProgramado[];
}) {
  if (pagos.length === 0) return null;

  const vencidos = pagos.filter((p) => p.estado === "Vencido");
  const proximos = pagos.filter((p) => p.estado !== "Vencido");

  return (
    <section className="mt-6">
      <div className="flex items-baseline justify-between mb-2">
        <h2 className="text-sm font-semibold">
          {vencidos.length > 0 ? "Pagos por vencer" : "Próximos vencimientos"}
        </h2>
        <Link
          href="/pagos"
          className="text-xs text-[var(--primary)] hover:underline"
        >
          Ver todos
        </Link>
      </div>

      {vencidos.length > 0 && (
        <p className="text-xs text-[var(--destructive)] mb-2">
          {vencidos.length} pago{vencidos.length === 1 ? "" : "s"} vencido
          {vencidos.length === 1 ? "" : "s"} sin marcar.
        </p>
      )}

      <ul className="space-y-2">
        {[...vencidos, ...proximos].map((pago) => {
          const vencido = pago.estado === "Vencido";
          return (
            <li
              key={pago.id}
              className={`px-3 py-2 bg-[var(--muted)] rounded-lg border-l-4 text-sm ${
                vencido ? "border-[var(--destructive)]" : "border-[var(--warning)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium truncate">{pago.concepto}</span>
                <span className="font-semibold whitespace-nowrap">
                  ${pago.valor.toLocaleString("es", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className="text-xs text-[var(--muted-foreground)] truncate">
                  {pago.cuenta_nombre}
                </span>
                <span
                  className={`text-xs font-medium whitespace-nowrap ${
                    vencido ? "text-[var(--destructive)]" : "text-[var(--warning)]"
                  }`}
                >
                  {/* Texto además del color: accesible sin depender del color */}
                  {vencido ? "!" : "•"} {pago.textoVencimiento}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
