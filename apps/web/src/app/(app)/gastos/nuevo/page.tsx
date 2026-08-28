import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/layout/page-header";
import { TransactionForm } from "@/components/forms/transaction-form";
import { addGasto } from "../actions";

export default async function NuevoGastoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre")
    .eq("user_id", user.id)
    .eq("tipo", "Gasto")
    .order("nombre");

  const { data: cuentas } = await supabase
    .from("cuentas")
    .select("id, nombre")
    .eq("user_id", user.id)
    .order("nombre");

  return (
    <>
      <PageHeader title="Nuevo gasto" />
      <TransactionForm
        action={addGasto}
        categorias={categorias ?? []}
        cuentas={cuentas ?? []}
        submitLabel="Guardar gasto"
        redirectTo="/gastos"
      />
    </>
  );
}
