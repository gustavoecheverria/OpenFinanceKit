import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { CategoriaRow } from "@/components/config/categoria-row";
import { CuentaRow } from "@/components/config/cuenta-row";
import {
  addCategoria,
  updateCategoria,
  deleteCategoria,
  addCuenta,
  updateCuenta,
  deleteCuenta,
  cargarDatosEjemplo,
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

  const sinDatos = (!categorias || categorias.length === 0) && (!cuentas || cuentas.length === 0);

  return (
    <>
      <PageHeader title="Configuración" />

      {/* Datos de ejemplo — solo si no hay nada configurado */}
      {sinDatos && (
        <form action={cargarDatosEjemplo} className="mb-6">
          <div className="p-4 rounded-lg border border-dashed border-[var(--border)] text-center">
            <p className="text-sm text-[var(--muted-foreground)] mb-3">
              ¿Primera vez? Carga datos de ejemplo para probar la app.
            </p>
            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity"
            >
              Cargar datos de ejemplo
            </button>
          </div>
        </form>
      )}

      {/* Categorías */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Categorías</h2>

        <form action={addCategoria} className="flex gap-2 mb-4">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            required
            className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm"
          />
          <select
            name="tipo"
            required
            className="px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm"
          >
            <option value="Ingreso">Ingreso</option>
            <option value="Gasto">Gasto</option>
          </select>
          <button
            type="submit"
            className="px-3 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium"
          >
            +
          </button>
        </form>

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
        <h2 className="text-lg font-semibold mb-3">Cuentas</h2>

        <form action={addCuenta} className="flex gap-2 mb-4">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            required
            className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm"
          />
          <input
            name="saldo_inicial"
            type="number"
            step="0.01"
            min="0"
            placeholder="Saldo"
            required
            className="w-24 px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium"
          >
            +
          </button>
        </form>

        {cuentas && cuentas.length > 0 ? (
          <ul className="space-y-2">
            {cuentas.map((cuenta) => (
              <CuentaRow
                key={cuenta.id}
                cuenta={cuenta}
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
