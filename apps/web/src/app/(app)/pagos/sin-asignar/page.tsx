import Link from "next/link";
import { obtenerPagosSinAsignar } from "@/lib/motor";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { UnassignedPaymentCard } from "@/components/pagos/unassigned-payment-card";

export default async function PagosSinAsignarPage() {
  const pagosSinAsignar = await obtenerPagosSinAsignar();

  // Calcular total
  const total = pagosSinAsignar.reduce((sum, pago) => sum + Number(pago.valor || 0), 0);

  // Obtener las cuentas del usuario para el select
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cuentas = [];
  if (user) {
    const { data } = await supabase
      .from("cuentas")
      .select("id, nombre")
      .eq("user_id", user.id)
      .order("nombre");
    cuentas = data || [];
  }

  return (
    <>
      <PageHeader title="Pagos Sin Asignar" />

      <div className="mb-4 p-3 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
        <p className="text-xs text-[var(--muted-foreground)] mb-1">Total sin asignar</p>
        <p className="text-2xl font-bold text-[var(--warning)]">
          ${total.toLocaleString("es", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p className="text-xs text-[var(--muted-foreground)] mt-2">
          Estos pagos se descuentan del saldo global pero no aparecen en ninguna cuenta individual.
        </p>
      </div>

      {pagosSinAsignar.length === 0 ? (
        <div className="p-4 rounded-lg border border-dashed border-[var(--border)] text-center">
          <p className="text-sm text-[var(--muted-foreground)] mb-3">
            ✅ No tienes pagos sin asignar. Todos están correctamente asignados a una cuenta.
          </p>
          <Link
            href="/pagos"
            className="px-3 py-1.5 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 transition-opacity inline-block"
          >
            Volver a Pagos
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {pagosSinAsignar.map((pago) => (
              <UnassignedPaymentCard
                key={pago.id}
                pago={pago}
                cuentas={cuentas}
              />
            ))}
          </div>

          <div className="mt-6 p-3 bg-[var(--muted)] rounded-lg border-l-2 border-[var(--info)]">
            <p className="text-xs text-[var(--muted-foreground)]">
              💡 <strong>Tip:</strong> Reasigna todos los pagos a su cuenta correspondiente para que los
              saldos por cuenta sean exactos.
            </p>
          </div>
        </>
      )}
    </>
  );
}
