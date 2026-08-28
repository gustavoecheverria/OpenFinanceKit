import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { TransactionForm } from "@/components/forms/transaction-form";
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

  return (
    <>
      <PageHeader title="Nuevo ingreso" />
      <TransactionForm
        action={addIngreso}
        categorias={categorias ?? []}
        cuentas={cuentas ?? []}
        submitLabel="Guardar ingreso"
        redirectTo="/ingresos"
      />
    </>
  );
}
