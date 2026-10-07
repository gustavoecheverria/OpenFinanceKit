import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { PagosProgramadosList } from "@/components/pagos/pagos-programados-list";
import { obtenerPagosProgramados } from "@/lib/motor";
import { deletePago, updateEstadoPago } from "./actions";
import {
  usarPagoProgramado,
  togglePagoProgramadoActivo,
} from "./programado/actions";

export default async function PagosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: pagos } = await supabase
    .from("pagos")
    .select("*, cuentas(nombre)")
    .eq("user_id", user.id)
    .order("fecha_vencimiento", { ascending: true })
    .limit(50);

  // Pagos programados (plantillas recurrentes), con el estado ya calculado
  // por el Motor. No se limitan a 50: cada cuenta es una sola fila y el
  // estado se renueva solo.
  const pagosProgramados = await obtenerPagosProgramados();

  return (
    <>
      <PageHeader
        title="Pagos"
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/pagos/sin-asignar"
              className="px-3 py-1.5 bg-[var(--warning)]/20 text-[var(--warning)] rounded-lg text-sm font-medium hover:opacity-80"
            >
              ⚠ Sin asignar
            </Link>
            <Link
              href="/pagos/nuevo"
              className="px-3 py-1.5 bg-[var(--muted)] text-[var(--foreground)] rounded-lg text-sm font-medium hover:opacity-80"
            >
              + Pago único
            </Link>
            <Link
              href="/pagos/programado/nuevo"
              className="px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90"
            >
              + Programado
            </Link>
          </div>
        }
      />

      <PagosProgramadosList
        pagos={pagosProgramados}
        onUsarPago={usarPagoProgramado}
        onDesactivar={togglePagoProgramadoActivo}
      />

      {/* Pagos únicos: compromisos de una sola vez (tabla `pagos`) */}
      {pagos && pagos.length > 0 ? (
        <div className="mt-6">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-sm font-semibold">Pagos únicos</h2>
            <span className="text-xs text-[var(--muted-foreground)]">
              Compromisos de una sola vez
            </span>
          </div>
          <ul className="space-y-2">
          {pagos.map((pago: any) => (
            <li
              key={pago.id}
              className="px-3 py-3 bg-[var(--muted)] rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      ${Number(pago.valor).toLocaleString("es", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm truncate">{pago.concepto}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {pago.cuentas && (
                      <span className="text-xs text-[var(--muted-foreground)]">
                        Cuenta: {pago.cuentas.nombre}
                      </span>
                    )}
                    <span className="text-xs text-[var(--muted-foreground)]">
                      Vence: {pago.fecha_vencimiento}
                    </span>
                    <EstadoBadge estado={pago.estado} />
                  </div>
                </div>
                <form action={deletePago.bind(null, pago.id)}>
                  <button
                    type="submit"
                    className="ml-2 text-[var(--muted-foreground)] hover:text-[var(--destructive)] text-sm"
                    aria-label={`Eliminar pago ${pago.concepto}`}
                  >
                    ✕
                  </button>
                </form>
              </div>

              {/* Acciones rápidas de estado */}
              {pago.estado !== "Pagado" && (
                <div className="flex gap-2 mt-2">
                  <form action={updateEstadoPago.bind(null, pago.id, "Pagado")}>
                    <button
                      type="submit"
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded"
                    >
                      Marcar pagado
                    </button>
                  </form>
                  {pago.estado === "Pendiente" && (
                    <form action={updateEstadoPago.bind(null, pago.id, "Vencido")}>
                      <button
                        type="submit"
                        className="text-xs px-2 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded"
                      >
                        Marcar vencido
                      </button>
                    </form>
                  )}
                </div>
              )}
            </li>
          ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-[var(--muted-foreground)] mt-6">
          No hay pagos únicos registrados. Usá &quot;+ Pago único&quot; para
          agregar uno, o &quot;+ Programado&quot; si se repite cada período.
        </p>
      )}
    </>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const styles: Record<string, string> = {
    Pendiente: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    Pagado: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    Vencido: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <span className={`text-xs px-1.5 py-0.5 rounded ${styles[estado] || ""}`}>
      {estado}
    </span>
  );
}
