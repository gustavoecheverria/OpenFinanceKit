import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { CategoriaRow } from "@/components/config/categoria-row";
import { CuentaRow } from "@/components/config/cuenta-row";
import { AddCategoriaForm } from "@/components/config/add-categoria-form";
import { AddCuentaForm } from "@/components/config/add-cuenta-form";
import { obtenerSaldosPorCuenta } from "@/lib/motor";
import {
  addCategoria,
  updateCategoria,
  deleteCategoria,
  addCuenta,
  updateCuenta,
  deleteCuenta,
} from "./actions";

export default async function ConfigPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: categorias } = await supabase
    .from("categorias")
    .select("*")
    .eq("user_id", user.id)
    .order("tipo")
    .order("nombre");

  const { data: cuentas } = await supabase
    .from("cuentas")
    .select("*")
    .eq("user_id", user.id)
    .order("nombre");

  // Obtener saldos actuales de las cuentas
  const saldosPorCuenta = await obtenerSaldosPorCuenta();
  const saldosActuales = new Map(
    saldosPorCuenta.cuentas.map((c) => [c.id, c.saldoActual])
  );

  const sinDatos = (!categorias || categorias.length === 0) && (!cuentas || cuentas.length === 0);

  return (
    <>
      <PageHeader title="Configuración" />

      {/* Usuario nuevo: guía los tres pasos sin imponer datos */}
      {sinDatos && (
        <div className="mb-6 p-4 rounded-lg border border-dashed border-[var(--border)]">
          <p className="text-sm font-medium mb-1">Empecemos por lo básico</p>
          <p className="text-sm text-[var(--muted-foreground)]">
            Para usar la app necesitás al menos una categoría de gasto y una
            cuenta con su saldo. Después vas a poder registrar movimientos y
            pagos programados.
          </p>
          <ol className="text-xs text-[var(--muted-foreground)] mt-3 space-y-1 list-decimal list-inside">
            <li>Crea una categoría de tipo Gasto</li>
            <li>Crea una cuenta con el saldo que tienes hoy</li>
            <li>Registra tu primer ingreso o gasto</li>
          </ol>
        </div>
      )}

      {/* Categorías */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Categorías</h2>

        {/* Formulario de creación con feedback de error (G3) */}
        <AddCategoriaForm action={addCategoria} />

        {categorias && categorias.length > 0 ? (
          <ul className="space-y-2">
            {categorias.map((cat) => (
              <CategoriaRow
                key={cat.id}
                categoria={cat}
                onUpdate={updateCategoria}
                onDelete={deleteCategoria}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">
            No hay categorías. Agrega una para empezar.
          </p>
        )}
      </section>

      {/* Cuentas */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Cuentas</h2>
          {cuentas && cuentas.length >= 2 && (
            <Link
              href="/cuentas/transferir"
              className="px-3 py-1.5 bg-[var(--muted)] text-[var(--foreground)] rounded-lg text-sm hover:opacity-80"
            >
              Transferir
            </Link>
          )}
        </div>

        {/* Formulario de creación con feedback de error (G3) */}
        <AddCuentaForm action={addCuenta} />

        {cuentas && cuentas.length > 0 ? (
          <ul className="space-y-2">
            {cuentas.map((cuenta) => (
              <CuentaRow
                key={cuenta.id}
                cuenta={cuenta}
                saldoActual={saldosActuales.get(cuenta.id) || 0}
                onUpdate={updateCuenta}
                onDelete={deleteCuenta}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-[var(--muted-foreground)]">
            No hay cuentas. Agrega una para empezar.
          </p>
        )}
      </section>
    </>
  );
}
