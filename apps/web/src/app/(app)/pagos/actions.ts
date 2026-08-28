"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addPago(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const concepto = formData.get("concepto") as string;
  const fechaVencimiento = formData.get("fecha_vencimiento") as string;
  const valor = parseFloat(formData.get("valor") as string);
  const estado = (formData.get("estado") as string) || "Pendiente";

  if (!concepto || !fechaVencimiento || isNaN(valor) || valor <= 0) {
    throw new Error("Datos inválidos");
  }

  if (!["Pendiente", "Pagado", "Vencido"].includes(estado)) {
    throw new Error("Estado inválido");
  }

  const { error } = await supabase.from("pagos").insert({
    concepto,
    fecha_vencimiento: fechaVencimiento,
    valor,
    estado,
    user_id: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/pagos");
  revalidatePath("/dashboard");
  redirect("/pagos");
}

export async function updateEstadoPago(id: number, estado: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  if (!["Pendiente", "Pagado", "Vencido"].includes(estado)) {
    throw new Error("Estado inválido");
  }

  const { error } = await supabase
    .from("pagos")
    .update({ estado })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/pagos");
  revalidatePath("/dashboard");
}

export async function deletePago(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("pagos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/pagos");
  revalidatePath("/dashboard");
}
