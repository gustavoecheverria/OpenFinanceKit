"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/form-state";

export async function addPago(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const concepto = formData.get("concepto") as string;
  const fechaVencimiento = formData.get("fecha_vencimiento") as string;
  const valor = parseFloat(formData.get("valor") as string);
  const estado = (formData.get("estado") as string) || "Pendiente";

  if (!concepto || !fechaVencimiento) {
    return { error: "Completa el concepto y la fecha de vencimiento." };
  }
  if (isNaN(valor) || valor <= 0) {
    return { error: "El valor debe ser mayor que cero." };
  }
  if (!["Pendiente", "Pagado", "Vencido"].includes(estado)) {
    return { error: "Estado inválido." };
  }

  const { error } = await supabase.from("pagos").insert({
    concepto,
    fecha_vencimiento: fechaVencimiento,
    valor,
    estado,
    user_id: user.id,
  });

  if (error) return { error: "No se pudo guardar el pago. Intenta de nuevo." };

  revalidatePath("/pagos");
  revalidatePath("/dashboard");
  return { error: null, ok: true };
}

export async function updateEstadoPago(id: number, estado: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  if (!["Pendiente", "Pagado", "Vencido"].includes(estado)) return;

  await supabase
    .from("pagos")
    .update({ estado })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/pagos");
  revalidatePath("/dashboard");
}

export async function deletePago(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("pagos").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/pagos");
  revalidatePath("/dashboard");
}
