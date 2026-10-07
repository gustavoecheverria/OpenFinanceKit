import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { TransferirForm } from "@/components/forms/transferir-form";
import { obtenerSaldosPorCuenta } from "@/lib/motor";
import { transferirEntreCuentas } from "./actions";

export default async function TransferirPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Las cuentas con su saldo actual, para poder mostrar el disponible del origen
  const saldos = await obtenerSaldosPorCuenta();
  const cuentas = saldos.cuentas.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    saldoActual: c.saldoActual,
  }));

  // Historial de transferencias, para que el usuario vea qué ha movido
  const { data: transferencias } = await supabase
    .from("transferencias")
    .select("id, origen_id, destino_id, valor, fecha, concepto")
    .eq("user_id", user.id)
    .order("fecha", { ascending: false })
    .limit(20);

  const nombreCuenta = (id: number) =>
    cuentas.find((c) => c.id === id)?.nombre ?? "Cuenta eliminada";

  return (
    <>
      <PageHeader
        title="Transferir"
        action={
          <Link
            href="/config"
            className="px-3 py-1.5 bg-[var(--muted)] text-[var(--foreground)] rounded-lg text-sm hover:opacity-80"
          >
            ← Volver
          </Link>
        }
      />

      <p className="text-sm text-[var(--muted-foreground)] mb-4">
        Mové plata entre tus cuentas. Por ejemplo, si retirás efectivo del
        banco, transferilos a tu cuenta &quot;Efectivo&quot; para poder registrar
        los gastos que pagás con esa plata.
      </p>

      <TransferirForm action={transferirEntreCuentas} cuentas={cuentas} />

      {/* Historial */}
      {transferencias && transferencias.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold mb-2">
            Transferencias recientes ({transferencias.length})
          </h2>
          <ul className="space-y-2">
            {transferencias.map((t) => (
              <li
                key={t.id}
                className="px-3 py-2 bg-[var(--muted)] rounded-lg text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs">
                    {nombreCuenta(t.origen_id)} → {nombreCuenta(t.destino_id)}
                  </span>
                  <span className="font-medium">
                    ${Number(t.valor).toLocaleString("es", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                  {t.fecha}
                  {t.concepto && ` · ${t.concepto}`}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
