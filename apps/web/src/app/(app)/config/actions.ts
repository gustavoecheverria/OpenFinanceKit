"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ── Categorías ──────────────────────────────────────────────────────────

export async function addCategoria(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const nombre = formData.get("nombre") as string;
  const tipo = formData.get("tipo") as string;

  if (!nombre || !tipo) throw new Error("Nombre y tipo son obligatorios");
  if (tipo !== "Ingreso" && tipo !== "Gasto") throw new Error("Tipo inválido");

  const { error } = await supabase.from("categorias").insert({
    nombre,
    tipo,
    user_id: user.id,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/config");
}

export async function deleteCategoria(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("categorias")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/config");
}

// ── Cuentas ─────────────────────────────────────────────────────────────

export async function addCuenta(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const nombre = formData.get("nombre") as string;
  const saldoInicial = parseFloat(formData.get("saldo_inicial") as string);

  if (!nombre) throw new Error("Nombre es obligatorio");
  if (isNaN(saldoInicial) || saldoInicial < 0) throw new Error("Saldo inicial inválido");

  const { error } = await supabase.from("cuentas").insert({
    nombre,
    saldo_inicial: saldoInicial,
    user_id: user.id,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/config");
}

export async function deleteCuenta(id: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("cuentas")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/config");
}
