import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { deleteIngreso } from "./actions";

export default async function IngresosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: ingresos } = await supabase
    .from("ingresos")
    .select("*, categorias(nombre), cuentas(nombre)")
    .eq("user_id", user.id)
    .order("fecha", { ascending: false })
    .limit(50);

  return (
    <>
      <PageHeader
        title="Ingresos"
        action={
          <Link
            href="/ingresos/nuevo"
            className="px-3 py-1.5 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg text-sm font-medium"
          >
            + Nuevo
          </Link>
        }
      />

      {ingresos && ingresos.length > 0 ? (
        <ul className="space-y-2">
          {ingresos.map((ingreso) => (
            <li
              key={ingreso.id}
              className="flex items-center justify-between px-3 py-3 bg-[var(--muted)] rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--success)]">
                    +${Number(ingreso.valor).toLocaleString("es", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] truncate">
                    {ingreso.categorias?.nombre}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {ingreso.fecha}
                  </span>
                  {ingreso.descripcion && (
                    <span className="text-xs text-[var(--muted-foreground)] truncate">
                      · {ingreso.descripcion}
                    </span>
                  )}
                </div>
              </div>
              <form action={deleteIngreso.bind(null, ingreso.id)}>
                <button
                  type="submit"
                  className="ml-2 text-[var(--muted-foreground)] hover:text-[var(--destructive)] text-sm"
                  aria-label="Eliminar ingreso"
                >
                  ✕
                </button>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--muted-foreground)]">
          No hay ingresos registrados. Toca &quot;+ Nuevo&quot; para agregar uno.
        </p>
      )}
    </>
  );
}
