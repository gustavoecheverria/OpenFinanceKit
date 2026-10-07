import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { PagoProgramadoForm } from "@/components/forms/pago-programado-form";
import { crearPagoProgramado } from "../actions";
import { createClient } from "@/lib/supabase/server";

export default async function NuevoPagoProgramadoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: cuentas } = await supabase
    .from("cuentas")
    .select("id, nombre")
    .eq("user_id", user.id)
    .order("nombre");

  return (
    <>
      <PageHeader
        title="Nuevo pago programado"
        action={
          <Link
            href="/pagos"
            className="px-3 py-1.5 bg-[var(--muted)] text-[var(--foreground)] rounded-lg text-sm hover:opacity-80"
          >
            ← Volver
          </Link>
        }
      />

      <p className="text-sm text-[var(--muted-foreground)] mb-4">
        Registrá una vez un pago que se repite, como el arriendo o el sueldo.
        Queda como plantilla: cada período solo tenés que marcar que lo pagaste.
      </p>

      <PagoProgramadoForm action={crearPagoProgramado} cuentas={cuentas || []} />
    </>
  );
}
