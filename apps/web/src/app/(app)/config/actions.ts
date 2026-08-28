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

// ── Datos de ejemplo (seed) ─────────────────────────────────────────────

/**
 * Carga datos de ejemplo equivalentes a los del Excel OFK.
 * Solo actúa si el usuario no tiene datos maestros (evita duplicar).
 * Útil para probar la app rápidamente.
 */
export async function cargarDatosEjemplo() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Idempotencia: no cargar si ya hay categorías
  const { count } = await supabase
    .from("categorias")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);
  if (count && count > 0) return;

  // Categorías (mismas del Excel)
  const { data: categorias } = await supabase
    .from("categorias")
    .insert([
      { nombre: "Sueldo", tipo: "Ingreso", user_id: user.id },
      { nombre: "Freelance", tipo: "Ingreso", user_id: user.id },
      { nombre: "Alimentación", tipo: "Gasto", user_id: user.id },
      { nombre: "Transporte", tipo: "Gasto", user_id: user.id },
    ])
    .select("id, nombre, tipo");

  // Cuentas (mismas del Excel)
  const { data: cuentas } = await supabase
    .from("cuentas")
    .insert([
      { nombre: "Efectivo", saldo_inicial: 0, user_id: user.id },
      { nombre: "Banco", saldo_inicial: 0, user_id: user.id },
      { nombre: "Tarjeta", saldo_inicial: 0, user_id: user.id },
    ])
    .select("id, nombre");

  if (!categorias || !cuentas) {
    revalidatePath("/config");
    return;
  }

  const catSueldo = categorias.find((c) => c.nombre === "Sueldo")?.id;
  const catAlim = categorias.find((c) => c.nombre === "Alimentación")?.id;
  const ctaBanco = cuentas.find((c) => c.nombre === "Banco")?.id;
  const ctaEfectivo = cuentas.find((c) => c.nombre === "Efectivo")?.id;

  const hoy = new Date().toISOString().split("T")[0];

  // Ingreso y gasto de ejemplo (equivalentes al Excel: 3500 y 120)
  if (catSueldo && ctaBanco) {
    await supabase.from("ingresos").insert({
      fecha: hoy,
      categoria_id: catSueldo,
      cuenta_id: ctaBanco,
      valor: 3500,
      descripcion: "Sueldo (ejemplo)",
      user_id: user.id,
    });
  }
  if (catAlim && ctaEfectivo) {
    await supabase.from("gastos").insert({
      fecha: hoy,
      categoria_id: catAlim,
      cuenta_id: ctaEfectivo,
      valor: 120,
      descripcion: "Supermercado (ejemplo)",
      user_id: user.id,
    });
  }

  // Pagos de ejemplo (mismos estados del Excel)
  await supabase.from("pagos").insert([
    { concepto: "Internet", fecha_vencimiento: hoy, valor: 45, estado: "Pendiente", user_id: user.id },
    { concepto: "Seguro", fecha_vencimiento: hoy, valor: 120, estado: "Pendiente", user_id: user.id },
    { concepto: "Gimnasio", fecha_vencimiento: hoy, valor: 35, estado: "Vencido", user_id: user.id },
  ]);

  revalidatePath("/config");
  revalidatePath("/dashboard");
}
