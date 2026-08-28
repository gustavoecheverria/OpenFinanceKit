"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/form-state";

export async function addIngreso(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Tu sesión expiró. Vuelve a iniciar sesión." };

  const fecha = formData.get("fecha") as string;
  const categoriaId = parseInt(formData.get("categoria_id") as string);
  const cuentaId = parseInt(formData.get("cuenta_id") as string);
  const valor = parseFloat(formData.get("valor") as string);
  const descripcion = (formData.get("descripcion") as string) || null;

  if (!fecha || isNaN(categoriaId) || isNaN(cuentaId)) {
    return { error: "Completa la categoría, la cuenta y la fecha." };
  }
  if (isNaN(valor) || valor <= 0) {
    return { error: "El valor debe ser mayor que cero." };
  }

  const { error } = await supabase.from("ingresos").insert({
    fecha,
    categoria_id: categoriaId,
    cuenta_id: cuentaId,
    valor,
    descripcion,
    user_id: user.id,
  });

  if (error) return { error: "No se pudo guardar el ingreso. Intenta de nuevo." };

  revalidatePath("/ingresos");
  revalidatePath("/dashboard");
  return { error: null, ok: true };
}

export async function deleteIngreso(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("ingresos").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/ingresos");
  revalidatePath("/dashboard");
}
