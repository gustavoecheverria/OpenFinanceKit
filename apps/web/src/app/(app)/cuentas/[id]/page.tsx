import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { obtenerSaldosPorCuenta } from "@/lib/motor";

export default async function DetalleCuentaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cuentaId = Number(id);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Obtener la cuenta
  const { data: cuenta } = await supabase
    .from("cuentas")
    .select("*")
    .eq("id", cuentaId)
    .eq("user_id", user.id)
    .single();

  if (!cuenta) {
    return (
      <>
        <PageHeader title="Cuenta no encontrada" />
        <p className="text-sm text-[var(--muted-foreground)]">
          La cuenta no existe o no tienes acceso a ella.
        </p>
        <Link
          href="/config"
          className="inline-block mt-4 px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm"
        >
          Volver a Configuración
        </Link>
      </>
    );
  }

  // Obtener saldo actual de esta cuenta
  const saldosPorCuenta = await obtenerSaldosPorCuenta();
  const saldoCuenta = saldosPorCuenta.cuentas.find((c) => c.id === cuentaId);

  // Obtener todos los ingresos de esta cuenta
  const { data: ingresos } = await supabase
    .from("ingresos")
    .select("*, categorias(nombre)")
    .eq("user_id", user.id)
    .eq("cuenta_id", cuentaId)
    .order("fecha", { ascending: false });

  // Obtener todos los gastos de esta cuenta
  const { data: gastos } = await supabase
    .from("gastos")
    .select("*, categorias(nombre)")
    .eq("user_id", user.id)
    .eq("cuenta_id", cuentaId)
    .order("fecha", { ascending: false });

  // Obtener todos los pagos pagados de esta cuenta
  const { data: pagos } = await supabase
    .from("pagos")
    .select("*")
    .eq("user_id", user.id)
    .eq("cuenta_id", cuentaId)
    .eq("estado", "Pagado")
    .order("fecha_vencimiento", { ascending: false });

  // Calcular totales
  const totalIngresos = ingresos?.reduce((sum, ing) => sum + Number(ing.valor || 0), 0) || 0;
  const totalGastos = gastos?.reduce((sum, gasto) => sum + Number(gasto.valor || 0), 0) || 0;
  const totalPagosPagados = pagos?.reduce((sum, pago) => sum + Number(pago.valor || 0), 0) || 0;

  return (
    <>
      <PageHeader
        title={cuenta.nombre}
        action={
          <Link
            href="/config"
            className="px-3 py-1.5 bg-[var(--muted)] text-[var(--foreground)] rounded-lg text-sm hover:opacity-80"
          >
            ← Volver
          </Link>
        }
      />

      {/* Resumen de la cuenta */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="p-3 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Saldo Inicial</p>
          <p className="text-lg font-bold text-[var(--primary)]">
            ${Number(cuenta.saldo_inicial).toLocaleString("es", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="p-3 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Saldo Actual</p>
          <p
            className={`text-lg font-bold ${
              saldoCuenta && saldoCuenta.saldoActual >= 0
                ? "text-[var(--success)]"
                : "text-[var(--destructive)]"
            }`}
          >
            ${Number(saldoCuenta?.saldoActual || 0).toLocaleString("es", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="p-3 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Total Ingresos</p>
          <p className="text-lg font-bold text-[var(--success)]">
            +${totalIngresos.toLocaleString("es", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="p-3 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Total Gastos + Pagos</p>
          <p className="text-lg font-bold text-[var(--destructive)]">
            -${(totalGastos + totalPagosPagados).toLocaleString("es", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      {/* Movimientos */}
      <div className="space-y-6">
        {/* Ingresos */}
        <section>
          <h2 className="text-sm font-semibold mb-2">Ingresos ({ingresos?.length || 0})</h2>
          {ingresos && ingresos.length > 0 ? (
            <ul className="space-y-2">
              {ingresos.map((ingreso) => (
                <li
                  key={ingreso.id}
                  className="flex items-center justify-between px-3 py-2 bg-[var(--muted)] rounded-lg text-sm"
                >
                  <div>
                    <span className="font-medium">{ingreso.categorias?.nombre}</span>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      {ingreso.fecha}
                      {ingreso.descripcion && ` · ${ingreso.descripcion}`}
                    </p>
                  </div>
                  <span className="font-bold text-[var(--success)]">
                    +${Number(ingreso.valor).toLocaleString("es", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--muted-foreground)]">
              No hay ingresos registrados en esta cuenta.
            </p>
          )}
        </section>

        {/* Gastos */}
        <section>
          <h2 className="text-sm font-semibold mb-2">Gastos ({gastos?.length || 0})</h2>
          {gastos && gastos.length > 0 ? (
            <ul className="space-y-2">
              {gastos.map((gasto) => (
                <li
                  key={gasto.id}
                  className="flex items-center justify-between px-3 py-2 bg-[var(--muted)] rounded-lg text-sm"
                >
                  <div>
                    <span className="font-medium">{gasto.categorias?.nombre}</span>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      {gasto.fecha}
                      {gasto.descripcion && ` · ${gasto.descripcion}`}
                    </p>
                  </div>
                  <span className="font-bold text-[var(--destructive)]">
                    -${Number(gasto.valor).toLocaleString("es", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--muted-foreground)]">
              No hay gastos registrados en esta cuenta.
            </p>
          )}
        </section>

        {/* Pagos pagados */}
        <section>
          <h2 className="text-sm font-semibold mb-2">Pagos Realizados ({pagos?.length || 0})</h2>
          {pagos && pagos.length > 0 ? (
            <ul className="space-y-2">
              {pagos.map((pago) => (
                <li
                  key={pago.id}
                  className="flex items-center justify-between px-3 py-2 bg-[var(--muted)] rounded-lg text-sm"
                >
                  <div>
                    <span className="font-medium">{pago.concepto || "Pago"}</span>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      Realizado: {pago.fecha_vencimiento}
                    </p>
                  </div>
                  <span className="font-bold text-[var(--destructive)]">
                    -${Number(pago.valor).toLocaleString("es", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--muted-foreground)]">
              No hay pagos realizados en esta cuenta.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
