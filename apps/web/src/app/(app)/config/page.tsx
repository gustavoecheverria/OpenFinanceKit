import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import {
  addCategoria,
  deleteCategoria,
  addCuenta,
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
              <li
                key={cat.id}
                className="flex items-center justify-between px-3 py-2 bg-[var(--muted)] rounded-lg"
              >
                <div>
                  <span className="text-sm font-medium">{cat.nombre}</span>
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                    cat.tipo === "Ingreso"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  }`}>
                    {cat.tipo}
                  </span>
                </div>
                <form action={deleteCategoria.bind(null, cat.id)}>
                  <button
                    type="submit"
                    className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] text-sm"
                    aria-label={`Eliminar ${cat.nombre}`}
                  >
                    ✕
                  </button>
                </form>
              </li>
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
              <li
                key={cuenta.id}
                className="flex items-center justify-between px-3 py-2 bg-[var(--muted)] rounded-lg"
              >
                <div>
                  <span className="text-sm font-medium">{cuenta.nombre}</span>
                  <span className="ml-2 text-xs text-[var(--muted-foreground)]">
                    ${Number(cuenta.saldo_inicial).toLocaleString("es", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <form action={deleteCuenta.bind(null, cuenta.id)}>
                  <button
                    type="submit"
                    className="text-[var(--muted-foreground)] hover:text-[var(--destructive)] text-sm"
                    aria-label={`Eliminar ${cuenta.nombre}`}
                  >
                    ✕
                  </button>
                </form>
              </li>
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
