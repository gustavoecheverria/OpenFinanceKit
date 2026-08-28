import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { deleteGasto } from "./actions";

export default async function GastosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: gastos } = await supabase
    .from("gastos")
    .select("*, categorias(nombre), cuentas(nombre)")
    .eq("user_id", user.id)
    .order("fecha", { ascending: false })
    .limit(50);

  return (
    <>
      <PageHeader
        title="Gastos"
        action={
          <Link
            href="/gastos/nuevo"
            className="px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium"
          >
            + Nuevo
          </Link>
        }
      />

      {gastos && gastos.length > 0 ? (
        <ul className="space-y-2">
          {gastos.map((gasto) => (
            <li
              key={gasto.id}
              className="flex items-center justify-between px-3 py-3 bg-[var(--muted)] rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--destructive)]">
                    -${Number(gasto.valor).toLocaleString("es", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] truncate">
                    {gasto.categorias?.nombre}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {gasto.fecha}
                  </span>
                  {gasto.descripcion && (
                    <span className="text-xs text-[var(--muted-foreground)] truncate">
                      · {gasto.descripcion}
                    </span>
                  )}
                </div>
              </div>
              <form action={deleteGasto.bind(null, gasto.id)}>
                <button
                  type="submit"
                  className="ml-2 text-[var(--muted-foreground)] hover:text-[var(--destructive)] text-sm"
                  aria-label="Eliminar gasto"
                >
                  ✕
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--muted-foreground)]">
          No hay gastos registrados. Toca &quot;+ Nuevo&quot; para agregar uno.
        </p>
      )}
    </>
  );
}
