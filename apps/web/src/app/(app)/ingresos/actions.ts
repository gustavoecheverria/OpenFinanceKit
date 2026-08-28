"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addIngreso(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const fecha = formData.get("fecha") as string;
  const categoriaId = parseInt(formData.get("categoria_id") as string);
  const cuentaId = parseInt(formData.get("cuenta_id") as string);
  const valor = parseFloat(formData.get("valor") as string);
  const descripcion = (formData.get("descripcion") as string) || null;

  if (!fecha || isNaN(categoriaId) || isNaN(cuentaId) || isNaN(valor) || valor <= 0) {
    throw new Error("Datos inválidos");
  }

  const { error } = await supabase.from("ingresos").insert({
    fecha,
    categoria_id: categoriaId,
    cuenta_id: cuentaId,
    valor,
    descripcion,
    user_id: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/ingresos");
  revalidatePath("/dashboard");
  redirect("/ingresos");
}

export async function deleteIngreso(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("ingresos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/ingresos");
  revalidatePath("/dashboard");
}
