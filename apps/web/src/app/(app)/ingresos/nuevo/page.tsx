import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { addIngreso } from "../actions";

export default async function NuevoIngresoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre")
    .eq("user_id", user.id)
    .eq("tipo", "Ingreso")
    .order("nombre");

  const { data: cuentas } = await supabase
    .from("cuentas")
    .select("id, nombre")
    .eq("user_id", user.id)
    .order("nombre");

  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <PageHeader title="Nuevo ingreso" />

      <form action={addIngreso} className="space-y-4">
        {/* Valor — campo principal, grande para acceso rápido */}
        <div>
          <label htmlFor="valor" className="block text-sm font-medium mb-1">
            Valor
          </label>
          <input
            id="valor"
            name="valor"
            type="number"
            step="0.01"
            min="0.01"
            required
            inputMode="decimal"
            placeholder="0.00"
            className="w-full px-3 py-3 text-2xl border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="categoria_id" className="block text-sm font-medium mb-1">
            Categoría
          </label>
          <select
            id="categoria_id"
            name="categoria_id"
            required
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
          >
            <option value="">Seleccionar...</option>
            {categorias?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Cuenta */}
        <div>
          <label htmlFor="cuenta_id" className="block text-sm font-medium mb-1">
            Cuenta
          </label>
          <select
            id="cuenta_id"
            name="cuenta_id"
            required
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
          >
            <option value="">Seleccionar...</option>
            {cuentas?.map((cuenta) => (
              <option key={cuenta.id} value={cuenta.id}>
                {cuenta.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium mb-1">
            Fecha
          </label>
          <input
            id="fecha"
            name="fecha"
            type="date"
            required
            defaultValue={today}
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
          />
        </div>

        {/* Descripción (opcional) */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium mb-1">
            Descripción <span className="text-[var(--muted-foreground)]">(opcional)</span>
          </label>
          <input
            id="descripcion"
            name="descripcion"
            type="text"
            placeholder="Ej: Sueldo agosto"
            className="w-full px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--background)]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-medium text-lg hover:opacity-90 transition-opacity"
        >
          Guardar ingreso
        </button>
      </form>
    </>
  );
}
