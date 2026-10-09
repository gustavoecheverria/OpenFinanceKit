import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { PagosProgramadosList } from "@/components/pagos/pagos-programados-list";
import { obtenerPagosProgramados } from "@/lib/motor";
import { marcarPagoProgramadoPagado, togglePagoProgramadoActivo } from "./programado/actions";

/**
 * Listado de pagos programados.
 *
 * Antes esta página listaba también los "pagos únicos" de la tabla `pagos`,
 * que se eliminó: el módulo estaba roto (nunca creaba historial al marcarlo
 * pagado) y era redundante con los pagos programados. Ver el SDD
 * feature-pagos-programados, sección 4.
 *
 * Todo lo que se ve aquí son plantillas recurrentes. Cada una tiene su
 * countdown y su estado calculado por el Motor.
 */
export default async function PagosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Con el estado ya calculado por el Motor. No se limitan a 50 registros: cada
  // plantilla es una sola fila y el ciclo se renueva solo.
  const pagosProgramados = await obtenerPagosProgramados();

  return (
    <>
      <PageHeader
        title="Pagos"
        action={
          <Link
            href="/pagos/programado/nuevo"
            className="px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium hover:opacity-90"
          >
            + Programado
          </Link>
        }
      />

      <p className="text-sm text-[var(--muted-foreground)] mb-4">
        Pagos que se repiten, como el arriendo o el sueldo. Registras la
        plantilla una vez y cada período solo marcás que lo pagaste.
      </p>

      <PagosProgramadosList
        pagos={pagosProgramados}
        onMarcarPagado={marcarPagoProgramadoPagado}
        onDesactivar={togglePagoProgramadoActivo}
      />

      {pagosProgramados.length === 0 && (
        <div className="mt-4 p-4 rounded-lg border border-dashed border-[var(--border)] text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            Todavía no tenés pagos programados.
          </p>
        </div>
      )}
    </>
  );
}
