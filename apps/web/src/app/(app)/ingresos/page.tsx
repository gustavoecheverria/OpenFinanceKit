import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { IngresosListClient } from "@/components/ingresos/ingresos-list-client";

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
        <IngresosListClient
          ingresos={ingresos}
          categorias={categorias || []}
          cuentas={cuentas || []}
        />
      ) : (
        <p className="text-sm text-[var(--muted-foreground)]">
          No hay ingresos registrados. Toca &quot;+ Nuevo&quot; para agregar uno.
        </p>
      )}
    </>
  );
}
