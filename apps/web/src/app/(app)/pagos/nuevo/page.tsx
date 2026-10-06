import { PageHeader } from "@/components/layout/page-header";
import { PaymentForm } from "@/components/forms/payment-form";
import { addPago } from "../actions";
import { createClient } from "@/lib/supabase/server";

export default async function NuevoPagoPage() {
  const supabase = await createClient();
  
  // Obtener el usuario actual
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    return <div>Error: Usuario no autenticado</div>;
  }

  // Obtener las cuentas del usuario
  const { data: cuentas } = await supabase
    .from("cuentas")
    .select("id, nombre")
    .eq("user_id", user.id)
    .order("nombre");

  return (
    <>
      <PageHeader title="Nuevo pago" />
      <PaymentForm action={addPago} cuentas={cuentas || []} />
    </>
  );
}
