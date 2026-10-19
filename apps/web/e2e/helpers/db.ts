import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function clienteAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.test.local."
    );
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function idUsuarioPrueba(admin: SupabaseClient): Promise<string> {
  const email =
    process.env.TEST_USER_EMAIL || "e2e-test@openfinancekit.local";

  const { data, error } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (error) {
    throw new Error(`No se pudieron listar usuarios: ${error.message}`);
  }

  const usuario = data.users.find((u) => u.email === email);
  if (!usuario) {
    throw new Error(`No existe el usuario de prueba ${email}`);
  }

  return usuario.id;
}

export async function idPorNombre(
  admin: SupabaseClient,
  tabla: "categorias" | "cuentas",
  userId: string,
  nombre: string
): Promise<number> {
  const { data, error } = await admin
    .from(tabla)
    .select("id")
    .eq("user_id", userId)
    .eq("nombre", nombre)
    .single();

  if (error || !data) {
    throw new Error(
      `No se encontró ${tabla}.${nombre}: ${error?.message ?? "sin fila"}`
    );
  }

  return Number(data.id);
}

export async function sembrarPagosProgramados(
  admin: SupabaseClient,
  datos: {
    userId: string;
    cantidad: number;
    categoriaId: number;
    cuentaId: number;
    prefijo: string;
  }
): Promise<void> {
  const hoy = new Date().toISOString().slice(0, 10);

  const filas = Array.from({ length: datos.cantidad }, (_, i) => ({
    concepto: `${datos.prefijo}${i + 1}`,
    valor: 1000 + i,
    tipo: "Gasto",
    recurrencia: "Mensual",
    cuenta_id: datos.cuentaId,
    categoria_id: datos.categoriaId,
    fecha_inicio: hoy,
    dia_vencimiento: (i % 28) + 1,
    activo: true,
    user_id: datos.userId,
  }));

  const { error } = await admin.from("pagos_programados").insert(filas);

  if (error) {
    throw new Error(`No se pudieron sembrar los pagos: ${error.message}`);
  }
}
