"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/form-state";

// ── Límites de longitud (G1) ────────────────────────────────────────────
const MAX_DESCRIPCION = 255;

// ── Validación de fecha ISO (G4) ────────────────────────────────────────
function esFechaValida(fecha: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const d = new Date(fecha);
  return !isNaN(d.getTime());
}

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
  // G2: trim; G1: maxLength
  const descripcionRaw = (formData.get("descripcion") as string)?.trim() || null;
  const descripcion =
    descripcionRaw && descripcionRaw.length > MAX_DESCRIPCION
      ? descripcionRaw.slice(0, MAX_DESCRIPCION)
      : descripcionRaw;

  if (!fecha || isNaN(categoriaId) || isNaN(cuentaId)) {
    return { error: "Completa la categoría, la cuenta y la fecha." };
  }
  // G4: validar formato y que sea fecha real
  if (!esFechaValida(fecha)) {
    return { error: "La fecha no es válida." };
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
